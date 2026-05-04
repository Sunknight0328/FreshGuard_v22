import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/auth/AuthProvider';
import { updateUserLanguage } from '@/db/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, Globe, LogOut } from 'lucide-react';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { profile, signOut, refreshProfile } = useAuth();
  const { toast } = useToast();

  const handleLanguageChange = async (language: string) => {
    try {
      await i18n.changeLanguage(language);
      // 保存到 localStorage
      localStorage.setItem('language', language);
      const success = await updateUserLanguage(language);
      if (success) {
        await refreshProfile();
        toast({
          title: t('settings.changeLanguageSuccess'),
        });
      }
    } catch (error) {
      console.error('切换语言失败:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: '已退出登录',
      });
    } catch (error) {
      console.error('退出登录失败:', error);
    }
  };

  return (
    <div className="container mx-auto p-4 pb-20 max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t('settings.language')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="language">{t('settings.language')}</Label>
              <Select
                value={i18n.language}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zh">{t('settings.languageChinese')}</SelectItem>
                  <SelectItem value="en">{t('settings.languageEnglish')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('settings.accountInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-muted-foreground">{t('settings.username')}</Label>
              <p className="text-lg font-medium">{profile?.username}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">{t('settings.role')}</Label>
              <p className="text-lg font-medium">
                {profile?.role === 'admin' ? t('settings.roleAdmin') : t('settings.roleUser')}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">{t('settings.registrationDate')}</Label>
              <p className="text-lg font-medium">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '-'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('common.logout')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
