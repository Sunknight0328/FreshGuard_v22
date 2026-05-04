import ky from 'ky';
import { createParser } from 'eventsource-parser';
import type { StorageMethod } from '@/types/types';

const APP_ID = import.meta.env.VITE_APP_ID;

/**
 * 检测文本是否主要包含中文
 * @param text 文本
 * @returns 是否为中文
 */
function isChinese(text: string): boolean {
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g);
  return chineseChars !== null && chineseChars.length > text.length * 0.3;
}

/**
 * 使用百度AI搜索查询食材保质期
 * @param foodName - 食材名称
 * @returns 保质期天数，如果无法确定则返回null
 */
export async function searchShelfLife(foodName: string): Promise<number | null> {
  return new Promise((resolve) => {
    let fullContent = '';
    let completed = false;

    const parser = createParser({
      onEvent: (event) => {
        if (event.data) {
          try {
            const parsed = JSON.parse(event.data);
            if (parsed.choices?.[0]?.delta?.content) {
              fullContent += parsed.choices[0].delta.content;
            }
            if (parsed.choices?.[0]?.finish_reason === 'stop') {
              completed = true;
            }
          } catch (error) {
            console.warn('解析SSE数据失败:', error);
          }
        }
      }
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      if (!completed) {
        resolve(extractShelfLifeDays(fullContent));
      }
    }, 15000); // 15秒超时

    // 根据食材名称语言选择查询语句
    const isChineseFood = isChinese(foodName);
    const userMessage = isChineseFood
      ? `${foodName}的保质期是多少天？请直接回答天数，如果有多种情况请说明常温、冷藏、冷冻的保质期。`
      : `What is the shelf life of ${foodName} in days? Please provide the number of days directly. If there are multiple scenarios, please specify the shelf life for room temperature, refrigerated, and frozen storage.`;
    
    const instruction = isChineseFood
      ? '你是一个食材保质期专家，请简洁准确地回答食材的保质期天数。'
      : 'You are a food shelf life expert. Please provide concise and accurate answers about food shelf life in days.';

    ky.post('/api/miaoda/runtime/apicenter/source/proxy/aisearchstreamw4DTfSmsE1', {
      json: {
        messages: [
          {
            role: 'user',
            content: userMessage
          }
        ],
        instruction,
        enable_deep_search: false,
        resource_type_filter: [{ type: 'web', top_k: 5 }],
        enable_reasoning: false,
        max_completion_tokens: 500,
        response_format: 'text',
        enable_followup_queries: false,
      },
      headers: {
        'Content-Type': 'application/json',
        'X-App-Id': APP_ID,
      },
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok || !response.body) {
          resolve(null);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf8');

        const read = async (): Promise<void> => {
          const result = await reader.read();
          if (result.done) {
            clearTimeout(timeoutId);
            resolve(extractShelfLifeDays(fullContent));
            return;
          }

          parser.feed(decoder.decode(result.value, { stream: true }));
          await read();
        };

        await read();
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        console.error('查询保质期失败:', error);
        resolve(null);
      });
  });
}

/**
 * 从AI返回的文本中提取保质期天数
 * @param text - AI返回的文本
 * @returns 保质期天数，优先返回冷藏保质期
 */
function extractShelfLifeDays(text: string): number | null {
  if (!text) return null;

  // 中文匹配模式
  const chinesePatterns = [
    /冷藏[：:]\s*(\d+)\s*[天日]/i,
    /冰箱[：:]\s*(\d+)\s*[天日]/i,
    /保质期[：:]\s*(\d+)\s*[天日]/i,
    /可以保存\s*(\d+)\s*[天日]/i,
    /(\d+)\s*[天日]左右/i,
    /大约\s*(\d+)\s*[天日]/i,
    /约\s*(\d+)\s*[天日]/i,
    /(\d+)\s*[-~至]\s*(\d+)\s*[天日]/i, // 范围，取中间值
  ];

  // 英文匹配模式
  const englishPatterns = [
    /refrigerat(?:ed|or)[:\s]+(\d+)\s*days?/i,
    /fridge[:\s]+(\d+)\s*days?/i,
    /shelf\s*life[:\s]+(\d+)\s*days?/i,
    /lasts?\s+(?:for\s+)?(\d+)\s*days?/i,
    /keeps?\s+(?:for\s+)?(\d+)\s*days?/i,
    /stores?\s+(?:for\s+)?(\d+)\s*days?/i,
    /about\s+(\d+)\s*days?/i,
    /around\s+(\d+)\s*days?/i,
    /approximately\s+(\d+)\s*days?/i,
    /(\d+)\s*[-~to]\s*(\d+)\s*days?/i, // 范围，取中间值
  ];

  // 合并所有模式
  const allPatterns = [...chinesePatterns, ...englishPatterns];

  for (const pattern of allPatterns) {
    const match = text.match(pattern);
    if (match) {
      if (match[2]) {
        // 范围情况，取平均值
        const min = parseInt(match[1]);
        const max = parseInt(match[2]);
        return Math.round((min + max) / 2);
      }
      return parseInt(match[1]);
    }
  }

  // 如果没有匹配到，尝试查找任何数字+天/days的组合
  const simpleChineseMatch = text.match(/(\d+)\s*[天日]/);
  if (simpleChineseMatch) {
    return parseInt(simpleChineseMatch[1]);
  }

  const simpleEnglishMatch = text.match(/(\d+)\s*days?/i);
  if (simpleEnglishMatch) {
    return parseInt(simpleEnglishMatch[1]);
  }

  return null;
}

/**
 * 根据保质期天数计算到期日期
 * @param purchaseDate - 购买日期
 * @param shelfLifeDays - 保质期天数
 * @returns 到期日期字符串 (YYYY-MM-DD)
 */
export function calculateExpiryDate(purchaseDate: string, shelfLifeDays: number): string {
  const purchase = new Date(purchaseDate);
  const expiry = new Date(purchase);
  expiry.setDate(expiry.getDate() + shelfLifeDays);
  return expiry.toISOString().split('T')[0];
}

/**
 * 根据食材分类和存储方式推荐默认保质期
 * @param category - 食材分类
 * @param storageMethod - 存储方式
 * @returns 推荐的保质期天数
 */
export function getDefaultShelfLife(category: string, storageMethod: StorageMethod): number {
  // 根据分类和存储方式返回默认保质期
  const shelfLifeMap: Record<string, Record<StorageMethod, number>> = {
    vegetables: {
      refrigerated: 7,    // 冷藏：7天
      frozen: 180,        // 冷冻：6个月
      room_temp: 3,       // 常温：3天
    },
    fruits: {
      refrigerated: 7,    // 冷藏：7天
      frozen: 180,        // 冷冻：6个月
      room_temp: 5,       // 常温：5天
    },
    meat: {
      refrigerated: 3,    // 冷藏：3天
      frozen: 180,        // 冷冻：6个月
      room_temp: 1,       // 常温：1天（不建议）
    },
    seafood: {
      refrigerated: 2,    // 冷藏：2天
      frozen: 90,         // 冷冻：3个月
      room_temp: 1,       // 常温：1天（不建议）
    },
    dairy: {
      refrigerated: 7,    // 冷藏：7天
      frozen: 30,         // 冷冻：1个月
      room_temp: 1,       // 常温：1天（不建议）
    },
    eggs: {
      refrigerated: 30,   // 冷藏：30天
      frozen: 180,        // 冷冻：6个月
      room_temp: 7,       // 常温：7天
    },
    grains: {
      refrigerated: 90,   // 冷藏：3个月
      frozen: 365,        // 冷冻：1年
      room_temp: 180,     // 常温：6个月
    },
    snacks: {
      refrigerated: 90,   // 冷藏：3个月
      frozen: 180,        // 冷冻：6个月
      room_temp: 90,      // 常温：3个月
    },
    beverages: {
      refrigerated: 30,   // 冷藏：30天
      frozen: 90,         // 冷冻：3个月
      room_temp: 180,     // 常温：6个月
    },
    condiments: {
      refrigerated: 180,  // 冷藏：6个月
      frozen: 365,        // 冷冻：1年
      room_temp: 365,     // 常温：1年
    },
    other: {
      refrigerated: 7,    // 冷藏：7天
      frozen: 90,         // 冷冻：3个月
      room_temp: 30,      // 常温：30天
    },
  };

  // 获取对应分类和存储方式的保质期，如果不存在则使用默认值
  const categoryShelfLife = shelfLifeMap[category] || shelfLifeMap.other;
  return categoryShelfLife[storageMethod];
}

