import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getUserFoodItems, deleteFoodItem, updateFoodQuantity, markFoodAsConsumed } from '@/db/api';
import { getStorageMethodIcon, getStorageMethodColor } from '@/utils/storageMethodHelper';
import type { FoodItem, FoodItemWithDays } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
import { Search, Plus, Trash2, Edit, Calendar, Package, Minus, Check } from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [foodItems, setFoodItems] = useState<FoodItemWithDays[]>([]);
  const [filteredItems, setFilteredItems] = useState<FoodItemWithDays[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'fresh' | 'warning' | 'urgent' | 'expired'>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [consumedDialogOpen, setConsumedDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [itemToConsume, setItemToConsume] = useState<FoodItemWithDays | null>(null);

  const calculateDaysAndStatus = (item: FoodItem): FoodItemWithDays => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiryDate = new Date(item.expiry_date);
    expiryDate.setHours(0, 0, 0, 0);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    let status: 'expired' | 'warning' | 'urgent' | 'fresh';
    if (daysUntilExpiry < 0) {
      status = 'expired';
    } else if (daysUntilExpiry === 0 || daysUntilExpiry === 1) {
      status = 'urgent';
    } else if (daysUntilExpiry <= 3) {
      status = 'warning';
    } else {
      status = 'fresh';
    }

    return { ...item, daysUntilExpiry, status };
  };

  const loadFoodItems = async () => {
    setLoading(true);
    try {
      const items = await getUserFoodItems();
      const itemsWithDays = items.map(calculateDaysAndStatus);
      setFoodItems(itemsWithDays);
      setFilteredItems(itemsWithDays);
    } catch (error) {
      console.error('加载食材失败:', error);
      toast({
        variant: 'destructive',
        title: t('common.loadFailed'),
        description: t('common.cannotLoadList'),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFoodItems();
  }, []);

  useEffect(() => {
    let filtered = foodItems;

    // 按状态筛选
    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    // 按搜索关键词筛选
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query) ||
        item.notes?.toLowerCase().includes(query)
      );
    }

    setFilteredItems(filtered);
  }, [searchQuery, filterStatus, foodItems]);

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      const success = await deleteFoodItem(itemToDelete);
      if (success) {
        toast({
          title: t('foodItem.deleteSuccess'),
        });
        loadFoodItems();
      } else {
        throw new Error(t('common.deleteFailed'));
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('foodItem.deleteFailed'),
      });
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleConsumed = async () => {
    if (!itemToConsume) return;

    try {
      const success = await markFoodAsConsumed(itemToConsume.id);
      if (success) {
        toast({
          title: t('foodItem.consumedSuccess'),
        });
        loadFoodItems();
      } else {
        throw new Error(t('foodItem.consumedFailed'));
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('foodItem.consumedFailed'),
      });
    } finally {
      setConsumedDialogOpen(false);
      setItemToConsume(null);
    }
  };

  const handleQuantityChange = async (item: FoodItemWithDays, delta: number) => {
    const newQuantity = item.quantity + delta;
    
    // 如果数量减到0或以下，提示标记为已食用
    if (newQuantity <= 0) {
      setItemToConsume(item);
      setConsumedDialogOpen(true);
      return;
    }

    try {
      const success = await updateFoodQuantity(item.id, newQuantity);
      if (success) {
        toast({
          title: t('foodItem.quantityUpdateSuccess'),
        });
        loadFoodItems();
      } else {
        throw new Error(t('foodItem.quantityUpdateFailed'));
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('foodItem.quantityUpdateFailed'),
      });
    }
  };

  const getStatusBadge = (status: string, daysUntilExpiry: number) => {
    switch (status) {
      case 'expired':
        return <Badge variant="destructive">{t('home.expired')}</Badge>;
      case 'urgent':
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600">
            {daysUntilExpiry === 0 ? t('home.today') : t('home.tomorrow')}
          </Badge>
        );
      case 'warning':
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            {t('home.daysLeft', { days: daysUntilExpiry })}
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            {t('home.daysLeft', { days: daysUntilExpiry })}
          </Badge>
        );
    }
  };

  return (
    <div className="container mx-auto p-4 pb-20 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">{t('home.title')}</h1>

        {/* 搜索栏 */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('home.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* 筛选按钮 */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
          >
            {t('home.filterAll')}
          </Button>
          <Button
            variant={filterStatus === 'fresh' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('fresh')}
          >
            {t('home.filterFresh')}
          </Button>
          <Button
            variant={filterStatus === 'warning' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('warning')}
          >
            {t('home.filterWarning')}
          </Button>
          <Button
            variant={filterStatus === 'urgent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('urgent')}
          >
            {t('home.filterUrgent')}
          </Button>
          <Button
            variant={filterStatus === 'expired' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('expired')}
          >
            {t('home.filterExpired')}
          </Button>
        </div>
      </div>

      {/* 食材列表 */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-40 w-full mb-4 bg-muted" />
                <Skeleton className="h-4 w-3/4 mb-2 bg-muted" />
                <Skeleton className="h-4 w-1/2 bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t('home.emptyTitle')}</h3>
          <p className="text-muted-foreground mb-6">{t('home.emptyDesc')}</p>
          <Button onClick={() => navigate('/add')}>
            <Plus className="h-4 w-4 mr-2" />
            {t('nav.add')}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="card-shadow-hover overflow-hidden">
              {item.image_url && (
                <div className="aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  {getStatusBadge(item.status, item.daysUntilExpiry)}
                </div>
                <div className="flex items-center gap-3 mb-2">
                  {item.category && (
                    <span className="text-sm text-muted-foreground">
                      {t(`categories.${item.category}`, item.category)}
                    </span>
                  )}
                  {item.storage_method && (
                    <span className={`text-sm flex items-center gap-1 ${getStorageMethodColor(item.storage_method)}`}>
                      <span>{getStorageMethodIcon(item.storage_method)}</span>
                      <span>{t(`storageMethod.${item.storage_method}`)}</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{item.expiry_date}</span>
                </div>
                
                {/* 数量管理 */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">
                    {t('foodItem.quantity')}:
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleQuantityChange(item, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium min-w-[60px] text-center">
                      {item.quantity} {t(`units.${item.unit}`, item.unit)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleQuantityChange(item, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/food/${item.id}`)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {t('common.edit')}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setItemToConsume(item);
                      setConsumedDialogOpen(true);
                    }}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    {t('foodItem.consumed')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('foodItem.deleteConfirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('common.deleteWarning')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 已食用确认对话框 */}
      <AlertDialog open={consumedDialogOpen} onOpenChange={setConsumedDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('foodItem.markAsConsumed')}</AlertDialogTitle>
            <AlertDialogDescription>
              {itemToConsume && (
                <>
                  {t('foodItem.markAsConsumed')}: {itemToConsume.name}
                  <br />
                  {t('foodItem.quantity')}: {itemToConsume.quantity} {t(`units.${itemToConsume.unit}`, itemToConsume.unit)}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConsumed}
              className="bg-green-600 hover:bg-green-700"
            >
              {t('common.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 浮动添加按钮（移动端） */}
      <Button
        className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg md:hidden"
        onClick={() => navigate('/add')}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
