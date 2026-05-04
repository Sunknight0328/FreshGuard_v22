import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getExpiringFoodItems } from '@/db/api';
import type { FoodItem, FoodItemWithDays } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Bell, Calendar, Package, Sparkles, BellRing } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  generateSmartNotification, 
  sendBrowserNotification, 
  requestNotificationPermission 
} from '@/utils/notificationService';

export default function Reminders() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [expiringItems, setExpiringItems] = useState<FoodItemWithDays[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<FoodItemWithDays | null>(null);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [notificationContent, setNotificationContent] = useState<{
    title: string;
    message: string;
    cookingSuggestion?: string;
  } | null>(null);
  const [generatingNotification, setGeneratingNotification] = useState(false);

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

  useEffect(() => {
    loadExpiringItems();
    // 请求通知权限
    requestNotificationPermission();
  }, []);

  const loadExpiringItems = async () => {
    setLoading(true);
    try {
      const items = await getExpiringFoodItems();
      const itemsWithDays = items.map(calculateDaysAndStatus);
      setExpiringItems(itemsWithDays);
    } catch (error) {
      console.error('加载提醒失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 生成智能推送通知
  const handleGenerateSmartNotification = async (item: FoodItemWithDays) => {
    setSelectedItem(item);
    setGeneratingNotification(true);
    setNotificationDialogOpen(true);
    setNotificationContent(null);

    try {
      const notification = await generateSmartNotification(item, item.daysUntilExpiry);
      setNotificationContent(notification);
      
      // 同时发送浏览器通知
      await sendBrowserNotification(notification.title, notification.message);
      
      toast({
        title: t('reminders.pushGenerated'),
        description: t('reminders.pushGeneratedDesc'),
      });
    } catch (error) {
      console.error('生成智能推送失败:', error);
      toast({
        variant: 'destructive',
        title: t('reminders.generateFailed'),
        description: t('reminders.generateFailedDesc'),
      });
    } finally {
      setGeneratingNotification(false);
    }
  };

  // 批量发送智能推送
  const handleBatchNotification = async () => {
    const urgentItems = expiringItems.filter(item => 
      item.status === 'urgent' || item.status === 'warning'
    );

    if (urgentItems.length === 0) {
      toast({
        title: t('reminders.noItemsToRemind'),
        description: t('reminders.noExpiringItems'),
      });
      return;
    }

    toast({
      title: t('reminders.generatingBatch'),
      description: t('reminders.generatingBatchDesc', { count: urgentItems.length }),
    });

    for (const item of urgentItems) {
      try {
        const notification = await generateSmartNotification(item, item.daysUntilExpiry);
        await sendBrowserNotification(notification.title, notification.message);
        // 添加延迟避免频繁请求
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`生成${item.name}的推送失败:`, error);
      }
    }

    toast({
      title: t('reminders.batchComplete'),
      description: t('reminders.batchCompleteDesc', { count: urgentItems.length }),
    });
  };

  const getStatusBadge = (status: string, daysUntilExpiry: number) => {
    switch (status) {
      case 'expired':
        return <Badge variant="destructive">{t('reminders.expired')}</Badge>;
      case 'urgent':
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600">
            {daysUntilExpiry === 0 ? t('reminders.expiresToday') : t('reminders.daysUntilExpiry', { days: daysUntilExpiry })}
          </Badge>
        );
      case 'warning':
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            {t('reminders.daysUntilExpiry', { days: daysUntilExpiry })}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4 pb-20 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">{t('reminders.title')}</h1>
          </div>
          <Button
            onClick={handleBatchNotification}
            disabled={loading || expiringItems.length === 0}
            className="gap-2"
          >
            <BellRing className="h-4 w-4" />
            {t('reminders.batchPush')}
          </Button>
        </div>
        <p className="text-muted-foreground">
          {t('reminders.subtitle')}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('reminders.expiringTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-lg bg-muted" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-muted" />
                    <Skeleton className="h-4 w-1/2 bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : expiringItems.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">{t('reminders.noReminders')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {expiringItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col @container gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border"
                >
                  {/* 上半部分：图片、食材信息和状态 */}
                  <div 
                    className="flex items-start gap-3 cursor-pointer"
                    onClick={() => navigate(`/food/${item.id}`)}
                  >
                    {/* 食材图片 */}
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-16 w-16 min-w-[4rem] rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-16 w-16 min-w-[4rem] rounded-lg bg-muted flex items-center justify-center">
                        <Package className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* 食材信息 */}
                    <div className="flex-1 min-w-0">
                      {/* 食材名称 - 独占一行 */}
                      <h3 className="font-semibold text-base mb-1.5 truncate pr-2">
                        {item.name}
                      </h3>
                      
                      {/* 状态徽章和到期日期 - 第二行 */}
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusBadge(item.status, item.daysUntilExpiry)}
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{item.expiry_date}</span>
                        </div>
                      </div>
                      
                      {/* 分类信息 - 第三行 */}
                      {item.category && (
                        <p className="text-xs text-muted-foreground">
                          {t(`categories.${item.category}`, item.category)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* 下半部分：操作按钮 */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateSmartNotification(item);
                      }}
                      className="flex-1 gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      {t('reminders.smartPush')}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/food/${item.id}`)}
                      className="gap-2"
                    >
                      {t('reminders.viewDetails')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>{t('reminders.clickToView')}</p>
      </div>

      {/* 智能推送对话框 */}
      <Dialog open={notificationDialogOpen} onOpenChange={setNotificationDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              {t('reminders.smartPushDialog')}
            </DialogTitle>
            <DialogDescription>
              {t('reminders.aiGeneratedMessage')}
            </DialogDescription>
          </DialogHeader>

          {generatingNotification ? (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">{t('reminders.generatingPush')}</p>
              </div>
              <Skeleton className="h-20 w-full bg-muted" />
              <Skeleton className="h-32 w-full bg-muted" />
            </div>
          ) : notificationContent && selectedItem ? (
            <div className="space-y-4 py-4">
              {/* 推送标题 */}
              <div className="p-4 bg-primary/10 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{notificationContent.title}</h3>
                <p className="text-foreground">{notificationContent.message}</p>
              </div>

              {/* 烹饪建议 */}
              {notificationContent.cookingSuggestion && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    {t('reminders.cookingSuggestion')}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {notificationContent.cookingSuggestion}
                  </p>
                </div>
              )}

              {/* 食材信息 */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">{t('reminders.foodInfo')}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">{t('reminders.foodName')}：</span>
                    <span className="font-medium">{selectedItem.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('reminders.foodCategory')}：</span>
                    <span className="font-medium">
                      {t(`categories.${selectedItem.category}`, selectedItem.category || '')}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('reminders.expiryDateLabel')}：</span>
                    <span className="font-medium">{selectedItem.expiry_date}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('reminders.daysRemaining')}：</span>
                    <span className="font-medium">{selectedItem.daysUntilExpiry}{t('reminders.daysUnit')}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => navigate(`/food/${selectedItem.id}`)}
                  className="flex-1"
                >
                  {t('reminders.viewDetails')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setNotificationDialogOpen(false)}
                  className="flex-1"
                >
                  {t('reminders.close')}
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
