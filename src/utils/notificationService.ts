import { sendChatStream, type ChatMessage } from './aiChat';
import type { FoodItem } from '@/types/types';
import i18n from '@/i18n';

const APP_ID = import.meta.env.VITE_APP_ID;
const API_ENV = import.meta.env.VITE_API_ENV;

// 文心大模型API接口
const ERNIE_API_URL = 'https://api-integrations.appmiaoda.com/app-7noqonmn18g1/api-2bk93oeO9NlE/v2/chat/completions';

/**
 * 使用AI生成个性化推送消息（仅食用建议）
 */
export async function generateNotificationMessage(
  foodItem: FoodItem,
  daysUntilExpiry: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    let fullMessage = '';
    
    const isEnglish = i18n.language === 'en';

    // 构建提示词（根据语言）- 只生成食用建议
    const systemPrompt = isEnglish
      ? `You are an intelligent food management assistant responsible for generating friendly and practical food consumption suggestions.
Requirements:
1. Use a warm and friendly tone
2. Provide practical eating or cooking suggestions
3. Keep the message within 80 words
4. Use emojis to add fun
5. Focus ONLY on food consumption suggestions, do NOT include encyclopedia information or movie references`
      : `你是一个智能食材管理助手，负责生成友好、实用的食材食用建议。
要求：
1. 语气温馨友好
2. 提供实用的食用建议或烹饪建议
3. 消息长度控制在80字以内
4. 使用emoji增加趣味性
5. 只关注食材食用建议，不要包含百科信息或电影引用`;

    const userPrompt = isEnglish
      ? `Please generate a food consumption reminder message for the following food item:
Food name: ${foodItem.name}
Category: ${foodItem.category}
Days until expiry: ${daysUntilExpiry} days

Please generate a short, friendly reminder message with practical consumption suggestions.`
      : `请为以下食材生成一条食用提醒消息：
食材名称：${foodItem.name}
分类：${foodItem.category}
距离过期：${daysUntilExpiry}天

请生成一条简短、友好的提醒消息，包含实用的食用建议。`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const defaultMessage = isEnglish
      ? `Your ${foodItem.name} will expire in ${daysUntilExpiry} days. Remember to consume it in time! 🍽️`
      : `您的${foodItem.name}还有${daysUntilExpiry}天就要过期了，记得及时食用哦！🍽️`;

    sendChatStream({
      endpoint: ERNIE_API_URL,
      apiId: APP_ID,
      messages,
      onUpdate: (content: string) => {
        fullMessage = content;
      },
      onComplete: () => {
        resolve(fullMessage || defaultMessage);
      },
      onError: (error: Error) => {
        console.error('AI生成消息失败:', error);
        // 返回默认消息
        resolve(defaultMessage);
      }
    });
  });
}

/**
 * 生成食材烹饪建议
 */
export async function generateCookingSuggestion(foodName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let fullMessage = '';
    
    const isEnglish = i18n.language === 'en';

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: isEnglish
          ? 'You are a professional cooking consultant who specializes in providing simple and practical cooking suggestions.'
          : '你是一个专业的烹饪顾问，擅长提供简单实用的烹饪建议。'
      },
      {
        role: 'user',
        content: isEnglish
          ? `Please provide 2-3 simple cooking suggestions for "${foodName}", keeping each suggestion within 30 words.`
          : `请为"${foodName}"提供2-3个简单的烹饪建议，每个建议控制在30字以内。`
      }
    ];

    const defaultSuggestion = isEnglish
      ? 'Can be stir-fried, boiled in soup, or eaten as a salad.'
      : '可以炒菜、煮汤或凉拌食用。';

    sendChatStream({
      endpoint: ERNIE_API_URL,
      apiId: APP_ID,
      messages,
      onUpdate: (content: string) => {
        fullMessage = content;
      },
      onComplete: () => {
        resolve(fullMessage || defaultSuggestion);
      },
      onError: (error: Error) => {
        console.error('AI生成烹饪建议失败:', error);
        resolve(defaultSuggestion);
      }
    });
  });
}

/**
 * 生成食材营养信息
 */
export async function generateNutritionInfo(foodName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let fullMessage = '';

    const isEnglish = i18n.language === 'en';

    const userPrompt = isEnglish
      ? `Please briefly introduce the main nutritional components of "${foodName}" (within 80 words).`
      : `请简要介绍"${foodName}"的主要营养成分（控制在80字以内）。`;

    const systemContent = isEnglish
      ? 'You are a nutrition expert who specializes in introducing the nutritional value of food in concise language.'
      : '你是一个营养学专家，擅长用简洁的语言介绍食材的营养价值。';

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: systemContent
      },
      {
        role: 'user',
        content: userPrompt
      }
    ];

    const defaultNutrition = isEnglish
      ? 'Rich in various vitamins and minerals, nutritious.'
      : '富含多种维生素和矿物质，营养丰富。';

    sendChatStream({
      endpoint: ERNIE_API_URL,
      apiId: APP_ID,
      messages,
      onUpdate: (content: string) => {
        fullMessage = content;
      },
      onComplete: () => {
        resolve(fullMessage || defaultNutrition);
      },
      onError: (error: Error) => {
        console.error('AI生成营养信息失败:', error);
        resolve(defaultNutrition);
      }
    });
  });
}

/**
 * 发送浏览器通知（如果用户授权）
 */
export async function sendBrowserNotification(title: string, body: string, icon?: string): Promise<void> {
  // 检查浏览器是否支持通知
  if (!('Notification' in window)) {
    console.log('浏览器不支持通知功能');
    return;
  }

  // 检查通知权限
  if (Notification.permission === 'granted') {
    // 已授权，直接发送通知
    new Notification(title, {
      body,
      icon: icon || '/favicon.png',
      badge: '/favicon.png',
      tag: 'food-expiry-reminder',
      requireInteraction: false
    });
  } else if (Notification.permission !== 'denied') {
    // 请求权限
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification(title, {
        body,
        icon: icon || '/favicon.png',
        badge: '/favicon.png',
        tag: 'food-expiry-reminder',
        requireInteraction: false
      });
    }
  }
}

/**
 * 生成智能推送通知
 * 使用AI大模型生成个性化的推送消息和烹饪建议
 */
export async function generateSmartNotification(
  foodItem: FoodItem,
  daysUntilExpiry: number
): Promise<{
  title: string;
  message: string;
  cookingSuggestion?: string;
}> {
  try {
    // 1. 使用AI生成个性化消息
    const message = await generateNotificationMessage(foodItem, daysUntilExpiry);

    // 2. 生成标题（根据语言）
    const isEnglish = i18n.language === 'en';
    let title = '';
    if (isEnglish) {
      if (daysUntilExpiry === 0) {
        title = `⚠️ ${foodItem.name} expires today`;
      } else if (daysUntilExpiry === 1) {
        title = `⏰ ${foodItem.name} expires tomorrow`;
      } else {
        title = `📅 ${foodItem.name} expires in ${daysUntilExpiry} days`;
      }
    } else {
      if (daysUntilExpiry === 0) {
        title = `⚠️ ${foodItem.name}今天到期`;
      } else if (daysUntilExpiry === 1) {
        title = `⏰ ${foodItem.name}明天到期`;
      } else {
        title = `📅 ${foodItem.name}还有${daysUntilExpiry}天到期`;
      }
    }

    // 3. 生成烹饪建议（对于即将过期的食材）
    let cookingSuggestion = '';
    if (daysUntilExpiry <= 1) {
      cookingSuggestion = await generateCookingSuggestion(foodItem.name);
    }

    return {
      title,
      message,
      cookingSuggestion
    };
  } catch (error) {
    console.error('生成智能推送通知失败:', error);
    
    // 返回默认消息
    const isEnglish = i18n.language === 'en';
    let title = '';
    let message = '';
    
    if (isEnglish) {
      if (daysUntilExpiry === 0) {
        title = `⚠️ ${foodItem.name} expires today`;
      } else if (daysUntilExpiry === 1) {
        title = `⏰ ${foodItem.name} expires tomorrow`;
      } else {
        title = `📅 ${foodItem.name} expires in ${daysUntilExpiry} days`;
      }
      message = `Your ${foodItem.name} will expire in ${daysUntilExpiry} days. Remember to consume it in time! 🍽️`;
    } else {
      if (daysUntilExpiry === 0) {
        title = `⚠️ ${foodItem.name}今天到期`;
      } else if (daysUntilExpiry === 1) {
        title = `⏰ ${foodItem.name}明天到期`;
      } else {
        title = `📅 ${foodItem.name}还有${daysUntilExpiry}天到期`;
      }
      message = `您的${foodItem.name}还有${daysUntilExpiry}天就要过期了，记得及时食用哦！🍽️`;
    }

    return {
      title,
      message
    };
  }
}

/**
 * 请求通知权限
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('浏览器不支持通知功能');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}
