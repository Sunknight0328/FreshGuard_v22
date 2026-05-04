// 数据库类型定义

export type UserRole = 'user' | 'admin';
export type StorageMethod = 'refrigerated' | 'frozen' | 'room_temp';

export interface Profile {
  id: string;
  username: string;
  email: string | null;
  role: UserRole;
  language_preference: string;
  created_at: string;
}

export interface FoodItem {
  id: string;
  user_id: string;
  name: string;
  category: string | null;
  purchase_date: string;
  expiry_date: string;
  quantity: number;
  unit: string;
  storage_method: StorageMethod;
  image_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: string;
  food_item_id: string;
  reminder_date: string;
  reminder_type: '3_days' | '1_day';
  is_sent: boolean;
  created_at: string;
}

// 扩展类型（用于前端展示）
export interface FoodItemWithDays extends FoodItem {
  daysUntilExpiry: number;
  status: 'expired' | 'warning' | 'urgent' | 'fresh';
}

export interface FoodItemFormData {
  name: string;
  category: string;
  purchase_date: string;
  expiry_date: string;
  quantity: number;
  unit: string;
  storage_method: StorageMethod;
  image_url?: string;
  notes?: string;
}

// OCR识别结果类型
export interface OCRResult {
  taskId: string;
  status: 'processing' | 'success' | 'failed';
  description?: string;
}

// 图像内容理解API响应类型
export interface ImageUnderstandingResponse {
  status: number;
  msg: string;
  data: {
    log_id: string;
    result: {
      task_id: string;
      ret_code?: number;
      ret_msg?: string;
      description?: string;
    };
  };
}
