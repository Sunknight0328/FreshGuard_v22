import axios from 'axios';
import type { ImageUnderstandingResponse } from '@/types/types';

const APP_ID = import.meta.env.VITE_APP_ID;

const apiClient = axios.create({
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "X-App-Id": APP_ID,
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API 请求错误:", error);
    if (error.response?.data?.status === 999) {
      throw new Error(error.response.data.msg);
    }
    return Promise.reject(error);
  }
);

const api = {
  /**
   * 提交图像内容理解请求
   * @param imageBase64 - base64编码的图片数据
   * @param question - 提问信息
   */
  submitImageUnderstanding: (imageBase64: string, question: string): Promise<ImageUnderstandingResponse> =>
    apiClient.post('/api/miaoda/runtime/apicenter/source/proxy/vCkBqBnYAumpihoy7mJKFS', {
      image: imageBase64,
      question,
    }),

  /**
   * 获取图像内容理解结果
   * @param taskId - 任务ID
   */
  getImageUnderstandingResult: (taskId: string): Promise<ImageUnderstandingResponse> =>
    apiClient.post('/api/miaoda/runtime/apicenter/source/proxy/p1fmNnVdKApGo3cse1Xn4m', {
      task_id: taskId,
    }),

  /**
   * 通用文字识别（高精度版）
   * @param image - base64编码的图片数据
   * @param languageType - 识别语言类型，默认为CHN_ENG
   */
  recognizeTextAccurate: (image: string, languageType = 'CHN_ENG') =>
    apiClient.post(
      '/api/miaoda/runtime/apicenter/source/proxy/6KmAKxK9aE29irAwt32QRk',
      new URLSearchParams({
        image,
        language_type: languageType,
        detect_direction: 'false',
        probability: 'false',
        multidirectional_recognize: 'false',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-App-Id': APP_ID,
        },
      }
    ),

  /**
   * 发送短信验证码
   * @param phone - 手机号
   * @param sessionId - 会话ID
   */
  sendSmsCode: (phone: string, sessionId: string) =>
    apiClient.post('/api/miaoda/runtime/apicenter/source/proxy/hch5WXYwg5jJEnjQw5nYCR', {
      phone,
      sessionId,
    }),

  /**
   * 验证短信验证码
   * @param phone - 手机号
   * @param phoneCode - 验证码
   * @param sessionId - 会话ID
   */
  verifySmsCode: (phone: string, phoneCode: string, sessionId: string) =>
    apiClient.post('/api/miaoda/runtime/apicenter/source/proxy/7mph9XQDXoJXmSvGCAhBEi', {
      phone,
      phoneCode,
      sessionId,
    }),

  /**
   * 百度百科查询
   * @param searchKey - 搜索关键词
   * @param searchType - 搜索类型，默认为lemmaTitle
   */
  getBaikeContent: (searchKey: string, searchType: 'lemmaTitle' | 'lemmaId' = 'lemmaTitle') =>
    apiClient.get('https://api-integrations.appmiaoda.com/app-7noqonmn18g1/api-zYkZ8XBkmb2L/v2/baike/lemma/get_content', {
      params: {
        search_type: searchType,
        search_key: searchKey,
      },
      headers: {
        'Accept': 'application/json',
      },
    }),
};

export default api;
