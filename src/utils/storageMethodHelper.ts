import type { StorageMethod } from '@/types/types';

/**
 * 根据食材分类推荐最佳存储方式
 * @param category 食材分类
 * @returns 推荐的存储方式
 */
export function recommendStorageMethod(category: string): StorageMethod {
  switch (category) {
    case 'vegetables': // 蔬菜
      return 'refrigerated';
    
    case 'fruits': // 水果
      return 'refrigerated';
    
    case 'meat': // 肉类
      return 'frozen';
    
    case 'seafood': // 海鲜
      return 'frozen';
    
    case 'dairy': // 乳制品
      return 'refrigerated';
    
    case 'eggs': // 蛋类
      return 'refrigerated';
    
    case 'grains': // 谷物
      return 'room_temp';
    
    case 'snacks': // 零食
      return 'room_temp';
    
    case 'beverages': // 饮料
      return 'room_temp';
    
    case 'condiments': // 调味品
      return 'room_temp';
    
    case 'other': // 其他
    default:
      return 'room_temp';
  }
}

/**
 * 获取存储方式的图标
 * @param storageMethod 存储方式
 * @returns 图标emoji
 */
export function getStorageMethodIcon(storageMethod: StorageMethod): string {
  switch (storageMethod) {
    case 'refrigerated':
      return '❄️';
    case 'frozen':
      return '🧊';
    case 'room_temp':
      return '🌡️';
    default:
      return '📦';
  }
}

/**
 * 获取存储方式的颜色类
 * @param storageMethod 存储方式
 * @returns Tailwind CSS颜色类
 */
export function getStorageMethodColor(storageMethod: StorageMethod): string {
  switch (storageMethod) {
    case 'refrigerated':
      return 'text-blue-500';
    case 'frozen':
      return 'text-cyan-500';
    case 'room_temp':
      return 'text-orange-500';
    default:
      return 'text-muted-foreground';
  }
}
