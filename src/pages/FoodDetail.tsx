import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { getFoodItemById, updateFoodItem, uploadFoodImage, deleteFoodImage } from '@/db/api';
import { getStorageMethodIcon } from '@/utils/storageMethodHelper';
import type { FoodItem, FoodItemFormData, StorageMethod } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, Camera, Loader2 } from 'lucide-react';

export default function FoodDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [foodItem, setFoodItem] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const categories = ['vegetables', 'fruits', 'meat', 'seafood', 'dairy', 'eggs', 'grains', 'snacks', 'beverages', 'condiments', 'other'];
  const storageMethods: StorageMethod[] = ['refrigerated', 'frozen', 'room_temp'];
  const units = ['piece', 'kg', 'g', 'l', 'ml', 'bag', 'box', 'bottle', 'can'];

  useEffect(() => {
    if (id) {
      loadFoodItem();
    }
  }, [id]);

  const loadFoodItem = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const item = await getFoodItemById(id);
      if (item) {
        setFoodItem(item);
        if (item.image_url) {
          setImagePreview(item.image_url);
        }
      } else {
        toast({
          variant: 'destructive',
          title: '食材不存在',
        });
        navigate('/');
      }
    } catch (error) {
      console.error('加载食材失败:', error);
      toast({
        variant: 'destructive',
        title: '加载失败',
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (file: File) => {
    if (file.size > 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: '图片过大',
        description: '图片大小不能超过1MB',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodItem || !id) return;

    if (!foodItem.name.trim()) {
      toast({
        variant: 'destructive',
        title: t('foodItem.nameRequired'),
      });
      return;
    }

    if (!foodItem.expiry_date) {
      toast({
        variant: 'destructive',
        title: t('foodItem.expiryDateRequired'),
      });
      return;
    }

    if (new Date(foodItem.expiry_date) <= new Date(foodItem.purchase_date)) {
      toast({
        variant: 'destructive',
        title: t('foodItem.expiryDateInvalid'),
      });
      return;
    }

    setSaving(true);

    try {
      let imageUrl = foodItem.image_url;

      // 如果有新图片，先上传
      if (imageFile) {
        // 删除旧图片
        if (foodItem.image_url) {
          await deleteFoodImage(foodItem.image_url);
        }

        const uploadedUrl = await uploadFoodImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const success = await updateFoodItem(id, {
        name: foodItem.name,
        category: foodItem.category || undefined,
        purchase_date: foodItem.purchase_date,
        expiry_date: foodItem.expiry_date,
        quantity: foodItem.quantity,
        unit: foodItem.unit,
        storage_method: foodItem.storage_method,
        image_url: imageUrl || undefined,
        notes: foodItem.notes || undefined,
      });

      if (success) {
        toast({
          title: t('foodItem.updateSuccess'),
        });
        navigate('/');
      } else {
        throw new Error('更新失败');
      }
    } catch (error: any) {
      console.error('更新食材失败:', error);
      toast({
        variant: 'destructive',
        title: t('foodItem.updateFailed'),
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 pb-20 max-w-2xl">
        <Skeleton className="h-8 w-32 mb-6 bg-muted" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 bg-muted" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full bg-muted" />
            <Skeleton className="h-10 w-full bg-muted" />
            <Skeleton className="h-10 w-full bg-muted" />
            <Skeleton className="h-10 w-full bg-muted" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!foodItem) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 pb-20 max-w-2xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回
        </Button>
        <h1 className="text-3xl font-bold">{t('common.edit')}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{foodItem.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('foodItem.name')} *</Label>
              <Input
                id="name"
                value={foodItem.name}
                onChange={(e) => setFoodItem({ ...foodItem, name: e.target.value })}
                placeholder={t('foodItem.name')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">{t('foodItem.category')}</Label>
              <Select
                value={foodItem.category || 'other'}
                onValueChange={(value) => setFoodItem({ ...foodItem, category: value })}
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
                  value={foodItem.purchase_date}
                  onChange={(e) => setFoodItem({ ...foodItem, purchase_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry_date">{t('foodItem.expiryDate')} *</Label>
                <Input
                  id="expiry_date"
                  type="date"
                  value={foodItem.expiry_date}
                  onChange={(e) => setFoodItem({ ...foodItem, expiry_date: e.target.value })}
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
                  value={foodItem.quantity}
                  onChange={(e) => setFoodItem({ ...foodItem, quantity: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">{t('foodItem.unit')}</Label>
                <Select
                  value={foodItem.unit}
                  onValueChange={(value) => setFoodItem({ ...foodItem, unit: value })}
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
                value={foodItem.storage_method}
                onValueChange={(value: StorageMethod) => setFoodItem({ ...foodItem, storage_method: value })}
              >
                <SelectTrigger>
                  <SelectValue>
                    <span className="flex items-center gap-2">
                      {getStorageMethodIcon(foodItem.storage_method)}
                      {t(`storageMethod.${foodItem.storage_method}`)}
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
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
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
                    alt="预览"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t('foodItem.notes')}</Label>
              <Textarea
                id="notes"
                value={foodItem.notes || ''}
                onChange={(e) => setFoodItem({ ...foodItem, notes: e.target.value })}
                placeholder={t('foodItem.notes')}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                t('common.save')
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
