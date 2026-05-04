import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { addFoodItem, uploadFoodImage, checkDuplicateFoodItem, increaseFoodQuantity } from '@/db/api';
import api from '@/utils/api';
import { sendChatStream } from '@/utils/aiChat';
import { calculateExpiryDate, getDefaultShelfLife } from '@/utils/shelfLifeHelper';
import { recommendStorageMethod, getStorageMethodIcon } from '@/utils/storageMethodHelper';
import { classifyFood } from '@/utils/categoryHelper';
import type { FoodItemFormData, StorageMethod, FoodItem } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload, Loader2, ArrowLeft, Sparkles } from 'lucide-react';

export default function AddFood() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const scanFileInputRef = useRef<HTMLInputElement>(null);
  const scanCameraInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FoodItemFormData>({
    name: '',
    category: 'other',
    purchase_date: new Date().toISOString().split('T')[0],
    expiry_date: '',
    quantity: 1,
    unit: 'piece',
    storage_method: 'room_temp',
    image_url: '',
    notes: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  // 查重相关状态
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [duplicateItem, setDuplicateItem] = useState<FoodItem | null>(null);
  const [pendingFormData, setPendingFormData] = useState<FoodItemFormData | null>(null);
  
  // 扫描小票相关状态
  const [scannedItems, setScannedItems] = useState<Array<{
    name: string;
    category: string;
    storageMethod: StorageMethod;
    shelfLifeDays: number | null;
    expiryDate: string;
    loading: boolean;
  }>>([]);
  const [scanningReceipt, setScanningReceipt] = useState(false);
  const [addingItems, setAddingItems] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [searchingShelfLife, setSearchingShelfLife] = useState(false);

  const categories = ['vegetables', 'fruits', 'meat', 'seafood', 'dairy', 'eggs', 'grains', 'snacks', 'beverages', 'condiments', 'other'];
  const units = ['piece', 'kg', 'g', 'l', 'ml', 'bag', 'box', 'bottle', 'can'];
  const storageMethods: StorageMethod[] = ['refrigerated', 'frozen', 'room_temp'];

  const handleImageSelect = (file: File) => {
    if (file.size > 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: t('common.imageTooLarge'),
        description: t('common.imageSizeLimit'),
      });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleRecognize = async () => {
    if (!imageFile) {
      toast({
        variant: 'destructive',
        title: t('addFood.imageRequired'),
      });
      return;
    }

    setRecognizing(true);
    setScanningReceipt(true);
    setScannedItems([]);

    try {
      toast({
        title: t('common.recognizing'),
        description: t('common.recognizingDesc'),
      });

      // 步骤1：图片转 base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result;
          if (typeof result !== 'string') { reject(new Error(t('common.recognitionFailed'))); return; }
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      // 步骤2：OCR 精准识别小票所有文字（使用 ENG 支持英/欧语言小票）
      const ocrResponse = await api.recognizeTextAccurate(base64, 'ENG') as any;
      // 兼容多种返回格式：{ words_result } 或 { data: { words_result } }
      const rawWords = ocrResponse?.words_result ?? ocrResponse?.data?.words_result ?? [];
      const wordsResult: Array<{ words: string }> = Array.isArray(rawWords) ? rawWords : [];

      let receiptText = '';

      if (wordsResult.length > 0) {
        receiptText = wordsResult.map(item => item.words).join('\n');
      } else {
        // OCR 无结果时，回退到图像理解 API
        const submitResponse = await api.submitImageUnderstanding(base64, 'List all text lines from this receipt image exactly as they appear, one per line.');
        if (submitResponse.status !== 0) {
          throw new Error(submitResponse.msg || t('common.recognitionFailed'));
        }
        const taskId = submitResponse.data.result.task_id;
        let retries = 0;
        const MAX_RETRIES = 10;
        const pollForText = async (): Promise<string> => {
          if (retries >= MAX_RETRIES) throw new Error(t('common.recognitionTimeout'));
          await new Promise(r => setTimeout(r, 2000));
          const res = await api.getImageUnderstandingResult(taskId);
          if (res.status !== 0) throw new Error(res.msg || t('common.getResultFailed'));
          const result = res.data.result;
          if (result.ret_code === 1) { retries++; return pollForText(); }
          if (result.ret_code === 0) return result.description || '';
          throw new Error(t('addFood.recognizeFailed'));
        };
        receiptText = await pollForText();
      }

      if (!receiptText.trim()) {
        throw new Error(t('common.recognitionFailed'));
      }

      // 步骤3：AI 从 OCR 文字中提取食品名称
      const APP_ID = import.meta.env.VITE_APP_ID;
      const CHAT_API_URL = 'https://api-integrations.appmiaoda.com/app-7noqonmn18g1/api-2bk93oeO9NlE/v2/chat/completions';

      const foodNames = await new Promise<string[]>((resolve) => {
        let fullContent = '';

        sendChatStream({
          endpoint: CHAT_API_URL,
          apiId: APP_ID,
          messages: [
            {
              role: 'system',
              content: 'You are a grocery receipt parser. Extract ONLY food and grocery product names from receipt text. Output one product name per line. Do NOT include prices, quantities, weights, store names, totals, taxes, dates, or non-food items. Do NOT add explanations, bullets, or numbering. Keep names exactly as on the receipt.',
            },
            {
              role: 'user',
              content: `Extract all food and grocery product names from the following receipt, one per line:\n\n${receiptText}`,
            },
          ],
          onUpdate: (content) => {
            fullContent = content;
          },
          onComplete: () => {
            const lines = fullContent
              .split('\n')
              .map(line => line.replace(/^[\-\*\•\d\.]+\s*/, '').trim())
              .filter(line => line.length >= 2 && !/^\d+(\.\d+)?$/.test(line));
            resolve(lines);
          },
          onError: () => resolve([]),
        });
      });

      if (foodNames.length === 0) {
        toast({
          variant: 'destructive',
          title: t('addFood.noItemsRecognized'),
          description: t('addFood.noItemsRecognizedDesc'),
        });
        return;
      }

      toast({
        title: t('addFood.recognizeSuccess'),
        description: t('addFood.recognizedItems', { count: foodNames.length }),
      });

      // 步骤4：为每个食品创建初始数据（分类→存储方式→保质期→到期日）
      const items = foodNames.map(name => {
        const category = classifyFood(name);
        const storageMethod = recommendStorageMethod(category);
        const shelfLifeDays = getDefaultShelfLife(category, storageMethod);
        const expiryDate = calculateExpiryDate(formData.purchase_date, shelfLifeDays);
        return { name, category, storageMethod, shelfLifeDays, expiryDate, loading: false };
      });

      setScannedItems(items);

      toast({
        title: t('addFood.smartRecommendComplete'),
        description: t('addFood.smartRecommendCompleteDesc'),
      });
    } catch (error: any) {
      console.error('Recognition failed:', error);
      toast({
        variant: 'destructive',
        title: t('addFood.recognizeFailed'),
        description: error.message,
      });
    } finally {
      setRecognizing(false);
      setScanningReceipt(false);
    }
  };

  // 智能推荐保质期
  const handleRecommendShelfLife = async () => {
    if (!formData.name.trim()) {
      toast({
        variant: 'destructive',
        title: t('addFood.needFoodName'),
        description: t('addFood.needFoodNameDesc'),
      });
      return;
    }

    setSearchingShelfLife(true);
    try {
      // 步骤1: 智能分类
      const category = classifyFood(formData.name);
      
      // 步骤2: 根据分类推荐存储方式
      const storageMethod = recommendStorageMethod(category);
      
      // 步骤3: 根据分类和存储方式推荐保质期
      const shelfLifeDays = getDefaultShelfLife(category, storageMethod);
      
      // 步骤4: 计算到期日期
      const expiryDate = calculateExpiryDate(formData.purchase_date, shelfLifeDays);
      
      // 更新表单数据
      setFormData(prev => ({
        ...prev,
        category,
        storage_method: storageMethod,
        expiry_date: expiryDate,
      }));
      
      toast({
        title: t('addFood.smartRecommendSuccess'),
        description: t('addFood.smartRecommendSuccessDesc', {
          name: formData.name,
          category: t(`categories.${category}`),
          storage: t(`storageMethod.${storageMethod}`),
          days: shelfLifeDays
        }),
      });
    } catch (error: any) {
      console.error('智能推荐失败:', error);
      toast({
        variant: 'destructive',
        title: t('addFood.smartRecommendFailed'),
        description: error.message || t('addFood.smartRecommendFailedDesc'),
      });
    } finally {
      setSearchingShelfLife(false);
    }
  };

  // 添加单个扫描的食材
  const handleAddSingleItem = async (index: number) => {
    const item = scannedItems[index];
    
    try {
      const foodData = {
        name: item.name,
        category: item.category,
        purchase_date: formData.purchase_date,
        expiry_date: item.expiryDate,
        quantity: 1,
        unit: 'piece',
        storage_method: item.storageMethod,
        image_url: '',
        notes: t('foodItem.fromReceiptNote', {
          days: item.shelfLifeDays,
          storage: t(`storageMethod.${item.storageMethod}`)
        }),
      };

      await addFoodItem(foodData);
      
      toast({
        title: t('foodItem.addSuccess'),
        description: t('foodItem.addSuccessDesc', { name: item.name }),
      });

      // 从列表中移除已添加的食材
      setScannedItems(prev => prev.filter((_, i) => i !== index));
    } catch (error: any) {
      console.error('添加食材失败:', error);
      toast({
        variant: 'destructive',
        title: t('foodItem.addFailed'),
        description: error.message || t('foodItem.addFailedDesc'),
      });
    }
  };

  // 批量添加所有扫描的食材
  const handleAddAllItems = async () => {
    if (scannedItems.length === 0) {
      toast({
        variant: 'destructive',
        title: t('addFood.noItemsToAdd'),
      });
      return;
    }

    setAddingItems(true);
    let successCount = 0;
    let failCount = 0;

    try {
      for (let i = 0; i < scannedItems.length; i++) {
        const item = scannedItems[i];
        
        try {
          const foodData = {
            name: item.name,
            category: item.category,
            purchase_date: formData.purchase_date,
            expiry_date: item.expiryDate,
            quantity: 1,
            unit: 'piece',
            storage_method: item.storageMethod,
            image_url: '',
            notes: t('addFood.addedFromReceipt', {
              days: item.shelfLifeDays,
              storage: t(`storageMethod.${item.storageMethod}`)
            }),
          };

          await addFoodItem(foodData);
          successCount++;
        } catch (error) {
          console.error(`添加${item.name}失败:`, error);
          failCount++;
        }

        // 添加延迟避免频繁请求
        if (i < scannedItems.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }

      // 清空列表
      setScannedItems([]);

      const failText = failCount > 0 ? t('addFood.failedCount', { count: failCount }) : '';
      toast({
        title: t('addFood.batchAddComplete'),
        description: t('addFood.batchAddCompleteDesc', { success: successCount, failText }),
      });

      // 如果全部成功，跳转到首页
      if (failCount === 0) {
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error: any) {
      console.error('批量添加失败:', error);
      toast({
        variant: 'destructive',
        title: t('addFood.batchAddFailed'),
        description: error.message,
      });
    } finally {
      setAddingItems(false);
    }
  };

  // 更新扫描食材的分类
  const handleUpdateItemCategory = (index: number, category: string) => {
    setScannedItems(prev => {
      const updated = [...prev];
      // 步骤1: 更新分类
      // 步骤2: 根据新分类推荐存储方式
      const recommendedStorage = recommendStorageMethod(category);
      // 步骤3: 根据新分类和存储方式推荐保质期
      const shelfLifeDays = getDefaultShelfLife(category, recommendedStorage);
      // 步骤4: 重新计算到期日期
      const expiryDate = calculateExpiryDate(formData.purchase_date, shelfLifeDays);
      
      updated[index] = {
        ...updated[index],
        category,
        storageMethod: recommendedStorage,
        shelfLifeDays,
        expiryDate,
      };
      return updated;
    });
  };

  // 更新扫描食材的存储方式
  const handleUpdateItemStorageMethod = (index: number, storageMethod: StorageMethod) => {
    setScannedItems(prev => {
      const updated = [...prev];
      const item = updated[index];
      // 根据当前分类和新的存储方式重新计算保质期
      const shelfLifeDays = getDefaultShelfLife(item.category, storageMethod);
      const expiryDate = calculateExpiryDate(formData.purchase_date, shelfLifeDays);
      
      updated[index] = {
        ...updated[index],
        storageMethod,
        shelfLifeDays,
        expiryDate,
      };
      return updated;
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        variant: 'destructive',
        title: t('foodItem.nameRequired'),
      });
      return;
    }

    // 保质期不再是必填项
    // 如果没有填写保质期，将在后台自动搜索
    if (formData.expiry_date && new Date(formData.expiry_date) <= new Date(formData.purchase_date)) {
      toast({
        variant: 'destructive',
        title: t('foodItem.expiryDateInvalid'),
      });
      return;
    }

    // 查重：检查是否已存在同名食材
    const duplicate = await checkDuplicateFoodItem(formData.name.trim());
    if (duplicate) {
      setDuplicateItem(duplicate);
      setPendingFormData(formData);
      setDuplicateDialogOpen(true);
      return;
    }

    // 没有重复，直接添加
    await performAddFood(formData);
  };

  const performAddFood = async (data: FoodItemFormData) => {
    setLoading(true);

    try {
      let imageUrl = data.image_url;
      let finalExpiryDate = data.expiry_date;

      // 如果有图片文件，先上传
      if (imageFile) {
        toast({
          title: t('addFood.uploadImage'),
        });
        const uploadedUrl = await uploadFoodImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      // 如果没有保质期，使用智能推荐
      if (!finalExpiryDate) {
        toast({
          title: t('addFood.recommendingShelfLife'),
          description: t('addFood.pleaseWait'),
        });

        try {
          // 步骤1: 智能分类
          const category = data.category || classifyFood(data.name);
          
          // 步骤2: 根据分类推荐存储方式（如果用户没有选择）
          const storageMethod = data.storage_method;
          
          // 步骤3: 根据分类和存储方式推荐保质期
          const shelfLifeDays = getDefaultShelfLife(category, storageMethod);
          
          // 步骤4: 计算到期日期
          finalExpiryDate = calculateExpiryDate(data.purchase_date, shelfLifeDays);
          
          toast({
            title: t('addFood.smartRecommendSuccess'),
            description: t('addFood.recommendedShelfLife', {
              category: t(`categories.${category}`),
              storage: t(`storageMethod.${storageMethod}`),
              days: shelfLifeDays
            }),
          });
        } catch (error) {
          console.error('智能推荐保质期失败:', error);
          // 推荐失败，使用默认7天
          finalExpiryDate = calculateExpiryDate(data.purchase_date, 7);
          toast({
            title: t('addFood.useDefaultShelfLife'),
            description: t('addFood.autoRecommendFailed'),
          });
        }
      }

      const result = await addFoodItem({
        ...data,
        expiry_date: finalExpiryDate,
        image_url: imageUrl,
      });

      if (result) {
        toast({
          title: t('foodItem.addSuccess'),
        });
        navigate('/');
      } else {
        throw new Error(t('foodItem.addFailed'));
      }
    } catch (error: any) {
      console.error('添加食材失败:', error);
      toast({
        variant: 'destructive',
        title: t('foodItem.addFailed'),
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleIncreaseQuantity = async () => {
    if (!duplicateItem || !pendingFormData) return;

    setLoading(true);
    try {
      const success = await increaseFoodQuantity(duplicateItem.id, pendingFormData.quantity);
      if (success) {
        toast({
          title: t('foodItem.quantityIncreased'),
        });
        navigate('/');
      } else {
        throw new Error(t('foodItem.quantityUpdateFailed'));
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('foodItem.quantityUpdateFailed'),
      });
    } finally {
      setLoading(false);
      setDuplicateDialogOpen(false);
      setDuplicateItem(null);
      setPendingFormData(null);
    }
  };

  const handleAddAsNew = async () => {
    if (!pendingFormData) return;
    
    setDuplicateDialogOpen(false);
    await performAddFood(pendingFormData);
    setDuplicateItem(null);
    setPendingFormData(null);
  };

  return (
    <div className="container mx-auto p-4 pb-20 max-w-2xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>
        <h1 className="text-3xl font-bold">{t('addFood.title')}</h1>
      </div>

      <Tabs defaultValue="manual" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">{t('addFood.manualAdd')}</TabsTrigger>
          <TabsTrigger value="scan">{t('addFood.scanReceipt')}</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('addFood.manualAdd')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('foodItem.name')} *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('foodItem.name')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">{t('foodItem.category')}</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {t(`categories.${cat}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchase_date">{t('foodItem.purchaseDate')} *</Label>
                    <Input
                      id="purchase_date"
                      type="date"
                      value={formData.purchase_date}
                      onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <Label htmlFor="expiry_date" className="shrink-0">
                        {t('foodItem.expiryDate')}
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRecommendShelfLife}
                        disabled={!formData.name.trim() || searchingShelfLife}
                        className="h-8 text-xs whitespace-nowrap"
                      >
                        {searchingShelfLife ? (
                          <>
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            {t('addFood.aiSearching')}
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-1 h-3 w-3" />
                            {t('addFood.smartRecommend')}
                          </>
                        )}
                      </Button>
                    </div>
                    <Input
                      id="expiry_date"
                      type="date"
                      value={formData.expiry_date}
                      onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                      placeholder=""
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">{t('foodItem.quantity')}</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">{t('foodItem.unit')}</Label>
                    <Select
                      value={formData.unit}
                      onValueChange={(value) => setFormData({ ...formData, unit: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {t(`units.${unit}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storage_method">{t('storageMethod.label')}</Label>
                  <Select
                    value={formData.storage_method}
                    onValueChange={(value: StorageMethod) => setFormData({ ...formData, storage_method: value })}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        <span className="flex items-center gap-2">
                          {getStorageMethodIcon(formData.storage_method)}
                          {t(`storageMethod.${formData.storage_method}`)}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {storageMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          <span className="flex items-center gap-2">
                            {getStorageMethodIcon(method)}
                            {t(`storageMethod.${method}`)}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t('foodItem.image')}</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {t('addFood.uploadImage')}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => cameraInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      {t('addFood.takePhoto')}
                    </Button>
                  </div>
                  {/* 上传图片按钮 - 打开图库 */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {/* 拍照按钮 - 直接调用相机 */}
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt={t('common.preview')}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">{t('foodItem.notes')}</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder={t('foodItem.notes')}
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t('common.loading')}
                    </>
                  ) : (
                    t('common.add')
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('addFood.scanReceipt')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('addFood.uploadImage')}</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => scanFileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {t('addFood.uploadImage')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => scanCameraInputRef.current?.click()}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {t('addFood.takePhoto')}
                  </Button>
                </div>
                {/* 扫描小票专用的文件输入 */}
                {/* 上传图片按钮 - 打开图库 */}
                <input
                  ref={scanFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {/* 拍照按钮 - 直接调用相机 */}
                <input
                  ref={scanCameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt={t('common.preview')}
                      className="w-full h-64 object-contain rounded-lg bg-muted"
                    />
                  </div>
                )}
              </div>

              <Button
                onClick={handleRecognize}
                className="w-full"
                disabled={!imageFile || recognizing}
              >
                {recognizing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('addFood.recognizing')}
                  </>
                ) : (
                  t('addFood.scanReceipt')
                )}
              </Button>

              {/* 扫描结果列表 */}
              {scannedItems.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">
                      {t('addFood.recognizedCount', { count: scannedItems.length })}
                    </h3>
                    <Button
                      onClick={handleAddAllItems}
                      disabled={addingItems}
                      className="gap-2"
                    >
                      {addingItems ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {t('addFood.adding')}
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          {t('addFood.addAllToFridge')}
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {scannedItems.map((item, index) => (
                      <Card key={index} className="p-4">
                        <div className="space-y-3">
                          {/* 食材名称 */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{item.name}</h4>
                              {item.loading ? (
                                <div className="flex items-center gap-2 mt-1">
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  <span className="text-sm text-muted-foreground">
                                    {t('addFood.recommendingShelfLifeText')}
                                  </span>
                                </div>
                              ) : (
                                <div className="mt-1 space-y-1">
                                  <p className="text-sm text-muted-foreground">
                                    {t('addFood.recommendedShelfLifeLabel')}：{item.shelfLifeDays} {t('addFood.daysUnit')}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {t('addFood.expiryDateLabel')}：{item.expiryDate}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 分类选择 */}
                          <div className="space-y-2">
                            <Label className="text-sm">{t('foodItem.category')}</Label>
                            <Select
                              value={item.category}
                              onValueChange={(value) => handleUpdateItemCategory(index, value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((cat) => (
                                  <SelectItem key={cat} value={cat}>
                                    {t(`categories.${cat}`)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* 存储方式选择 */}
                          <div className="space-y-2">
                            <Label className="text-sm">{t('storageMethod.label')}</Label>
                            <Select
                              value={item.storageMethod}
                              onValueChange={(value: StorageMethod) => handleUpdateItemStorageMethod(index, value)}
                            >
                              <SelectTrigger>
                                <SelectValue>
                                  <span className="flex items-center gap-2">
                                    {getStorageMethodIcon(item.storageMethod)}
                                    {t(`storageMethod.${item.storageMethod}`)}
                                  </span>
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {storageMethods.map((method) => (
                                  <SelectItem key={method} value={method}>
                                    <span className="flex items-center gap-2">
                                      {getStorageMethodIcon(method)}
                                      {t(`storageMethod.${method}`)}
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* 添加按钮 */}
                          <Button
                            onClick={() => handleAddSingleItem(index)}
                            disabled={item.loading || addingItems}
                            className="w-full"
                            variant="outline"
                          >
                            {t('addFood.addThisItem')}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>{t('addFood.modifyTip')}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 查重确认对话框 */}
      <AlertDialog open={duplicateDialogOpen} onOpenChange={setDuplicateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('foodItem.duplicateFound')}</AlertDialogTitle>
            <AlertDialogDescription>
              {duplicateItem && pendingFormData && (
                <>
                  {t('foodItem.duplicateMessage', {
                    name: duplicateItem.name,
                    quantity: duplicateItem.quantity,
                    unit: t(`units.${duplicateItem.unit}`, duplicateItem.unit)
                  })}
                  <br /><br />
                  <strong>{t('foodItem.expiryDate')}:</strong> {duplicateItem.expiry_date}
                  <br />
                  <strong>{t('addFood.willAdd')}:</strong> {pendingFormData.quantity} {t(`units.${pendingFormData.unit}`, pendingFormData.unit)}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDuplicateDialogOpen(false);
              setDuplicateItem(null);
              setPendingFormData(null);
            }}>
              {t('common.cancel')}
            </AlertDialogCancel>
            <Button
              onClick={handleAddAsNew}
              variant="outline"
            >
              {t('foodItem.addAsNew')}
            </Button>
            <AlertDialogAction
              onClick={handleIncreaseQuantity}
            >
              {t('foodItem.increaseQuantity')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
