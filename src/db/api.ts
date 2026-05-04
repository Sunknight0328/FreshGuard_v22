import { supabase } from "./supabase";
import type { Profile, FoodItem, Reminder, FoodItemFormData } from "@/types/types";

// ==================== 用户相关 ====================

/**
 * 获取当前用户信息
 */
export async function getCurrentUserProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("获取用户信息失败:", error);
    return null;
  }

  return data;
}

/**
 * 更新用户语言偏好
 */
export async function updateUserLanguage(language: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("profiles")
    .update({ language_preference: language })
    .eq("id", user.id);

  if (error) {
    console.error("更新语言偏好失败:", error);
    return false;
  }

  return true;
}

/**
 * 更新用户手机号
 */
export async function updateUserPhone(phone: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("profiles")
    .update({ phone })
    .eq("id", user.id);

  if (error) {
    console.error("更新手机号失败:", error);
    return false;
  }

  return true;
}

/**
 * 获取所有用户（管理员）
 */
export async function getAllUsers(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("获取用户列表失败:", error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

/**
 * 更新用户角色（管理员）
 */
export async function updateUserRole(userId: string, role: 'user' | 'admin'): Promise<boolean> {
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) {
    console.error("更新用户角色失败:", error);
    return false;
  }

  return true;
}

// ==================== 食材相关 ====================

/**
 * 获取当前用户的所有食材
 */
export async function getUserFoodItems(page = 1, pageSize = 20): Promise<FoodItem[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error } = await supabase
    .from("food_items")
    .select("*")
    .eq("user_id", user.id)
    .order("expiry_date", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("获取食材列表失败:", error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

/**
 * 根据ID获取食材详情
 */
export async function getFoodItemById(id: string): Promise<FoodItem | null> {
  const { data, error } = await supabase
    .from("food_items")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("获取食材详情失败:", error);
    return null;
  }

  return data;
}

/**
 * 添加食材
 */
export async function addFoodItem(foodData: FoodItemFormData): Promise<FoodItem | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("food_items")
    .insert({
      user_id: user.id,
      name: foodData.name,
      category: foodData.category || null,
      purchase_date: foodData.purchase_date,
      expiry_date: foodData.expiry_date,
      quantity: foodData.quantity || 1,
      unit: foodData.unit || '个',
      image_url: foodData.image_url || null,
      notes: foodData.notes || null,
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error("添加食材失败:", error);
    return null;
  }

  return data;
}

/**
 * 更新食材
 */
export async function updateFoodItem(id: string, foodData: Partial<FoodItemFormData>): Promise<boolean> {
  const { error } = await supabase
    .from("food_items")
    .update(foodData)
    .eq("id", id);

  if (error) {
    console.error("更新食材失败:", error);
    return false;
  }

  return true;
}

/**
 * 删除食材
 */
export async function deleteFoodItem(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("food_items")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("删除食材失败:", error);
    return false;
  }

  return true;
}

/**
 * 更新食材数量
 */
export async function updateFoodQuantity(id: string, quantity: number): Promise<boolean> {
  const { error } = await supabase
    .from("food_items")
    .update({ quantity })
    .eq("id", id);

  if (error) {
    console.error("更新食材数量失败:", error);
    return false;
  }

  return true;
}

/**
 * 标记食材为已食用（删除）
 */
export async function markFoodAsConsumed(id: string): Promise<boolean> {
  // 目前直接删除，未来可以添加到消费记录表
  return deleteFoodItem(id);
}

/**
 * 搜索食材
 */
export async function searchFoodItems(keyword: string): Promise<FoodItem[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("food_items")
    .select("*")
    .eq("user_id", user.id)
    .or(`name.ilike.%${keyword}%,category.ilike.%${keyword}%,notes.ilike.%${keyword}%`)
    .order("expiry_date", { ascending: true })
    .limit(50);

  if (error) {
    console.error("搜索食材失败:", error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

/**
 * 获取即将过期的食材（3天内）
 */
export async function getExpiringFoodItems(): Promise<FoodItem[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const today = new Date().toISOString().split('T')[0];
  const threeDaysLater = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const { data, error } = await supabase
    .from("food_items")
    .select("*")
    .eq("user_id", user.id)
    .gte("expiry_date", today)
    .lte("expiry_date", threeDaysLater)
    .order("expiry_date", { ascending: true })
    .limit(50);

  if (error) {
    console.error("获取即将过期食材失败:", error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

// ==================== 提醒相关 ====================

/**
 * 获取用户的提醒记录
 */
export async function getUserReminders(): Promise<Reminder[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("reminders")
    .select(`
      *,
      food_items!inner(user_id)
    `)
    .eq("food_items.user_id", user.id)
    .order("reminder_date", { ascending: true })
    .limit(100);

  if (error) {
    console.error("获取提醒记录失败:", error);
    return [];
  }

  return Array.isArray(data) ? data : [];
}

/**
 * 创建提醒
 */
export async function createReminder(foodItemId: string, reminderDate: string, reminderType: '3_days' | '1_day'): Promise<boolean> {
  const { error } = await supabase
    .from("reminders")
    .insert({
      food_item_id: foodItemId,
      reminder_date: reminderDate,
      reminder_type: reminderType,
    });

  if (error) {
    console.error("创建提醒失败:", error);
    return false;
  }

  return true;
}

// ==================== 图片上传 ====================

/**
 * 上传食材图片
 */
export async function uploadFoodImage(file: File): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // 生成唯一文件名
  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from("app-7noqonmn18g1_food_images")
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error("上传图片失败:", error);
    return null;
  }

  // 获取公开URL
  const { data: { publicUrl } } = supabase.storage
    .from("app-7noqonmn18g1_food_images")
    .getPublicUrl(data.path);

  return publicUrl;
}

/**
 * 删除食材图片
 */
export async function deleteFoodImage(imageUrl: string): Promise<boolean> {
  try {
    // 从URL中提取文件路径
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(pathParts.indexOf('app-7noqonmn18g1_food_images') + 1).join('/');

    const { error } = await supabase.storage
      .from("app-7noqonmn18g1_food_images")
      .remove([filePath]);

    if (error) {
      console.error("删除图片失败:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("删除图片失败:", error);
    return false;
  }
}
