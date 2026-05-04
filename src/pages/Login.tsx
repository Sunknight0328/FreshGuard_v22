import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Leaf, Globe, Mail, ArrowLeft } from 'lucide-react';
import { useLanguageContext } from '@/contexts/LanguageContext';

type AuthMode = 'login' | 'register' | 'verify' | 'forgot';

export default function Login() {
  const { t } = useTranslation();
  const { signIn, signUp, verifyEmailOTP, resetPasswordWithEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { resetLanguageSelection } = useLanguageContext();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 倒计时效果
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validateEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  // 发送验证码
  const handleSendCode = async () => {
    if (!email.trim()) {
      toast({
        variant: 'destructive',
        title: t('auth.emailRequired'),
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        variant: 'destructive',
        title: t('auth.emailFormat'),
      });
      return;
    }

    if (mode === 'register' && !password.trim()) {
      toast({
        variant: 'destructive',
        title: t('auth.passwordRequired'),
      });
      return;
    }

    if (mode === 'register' && password.length < 6) {
      toast({
        variant: 'destructive',
        title: t('auth.passwordLength'),
      });
      return;
    }

    if (mode === 'register' && !confirmPassword.trim()) {
      toast({
        variant: 'destructive',
        title: t('auth.confirmPasswordRequired'),
      });
      return;
    }

    if (mode === 'register' && password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: t('auth.passwordMismatch'),
      });
      return;
    }

    setLoading(true);
    try {
      if (mode === 'register') {
        // 注册流程：先创建账号
        await signUp(email, password);
        toast({
          title: t('auth.verificationCodeSent'),
          description: t('auth.checkYourEmail'),
        });
        setMode('verify');
        setCountdown(60);
      } else if (mode === 'forgot') {
        // 忘记密码：发送重置密码邮件
        await resetPasswordWithEmail(email);
        toast({
          title: t('auth.resetEmailSent'),
          description: t('auth.checkYourEmail'),
        });
        setCountdown(60);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // 验证验证码
  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      toast({
        variant: 'destructive',
        title: t('auth.verificationCodeRequired'),
      });
      return;
    }

    setLoading(true);
    try {
      await verifyEmailOTP(email, verificationCode);
      toast({
        title: t('auth.verificationSuccess'),
      });
      
      // 验证成功后登录
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('auth.verificationFailed'),
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // 登录
  const handleLogin = async () => {
    if (!email.trim()) {
      toast({
        variant: 'destructive',
        title: t('auth.emailRequired'),
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        variant: 'destructive',
        title: t('auth.emailFormat'),
      });
      return;
    }

    if (!password.trim()) {
      toast({
        variant: 'destructive',
        title: t('auth.passwordRequired'),
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: 'destructive',
        title: t('auth.passwordLength'),
      });
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      toast({
        title: t('auth.loginSuccess'),
      });
      
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('auth.loginFailed'),
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'login') {
      await handleLogin();
    } else if (mode === 'register') {
      await handleSendCode();
    } else if (mode === 'verify') {
      await handleVerifyCode();
    } else if (mode === 'forgot') {
      await handleSendCode();
    }
  };

  const handleBackToLanguageSelection = () => {
    resetLanguageSelection();
    toast({
      title: t('auth.backToLanguageSelection'),
    });
  };

  const getTitle = () => {
    switch (mode) {
      case 'login':
        return t('auth.loginTitle');
      case 'register':
        return t('auth.registerTitle');
      case 'verify':
        return t('auth.verifyTitle');
      case 'forgot':
        return t('auth.forgotPasswordTitle');
      default:
        return t('auth.loginTitle');
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'login':
        return t('auth.loginDescription');
      case 'register':
        return t('auth.registerDescription');
      case 'verify':
        return t('auth.verifyDescription');
      case 'forgot':
        return t('auth.forgotPasswordDescription');
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold gradient-text">
                {t('common.appName')}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToLanguageSelection}
              title={t('auth.changeLanguage')}
            >
              <Globe className="h-5 w-5" />
            </Button>
          </div>
          <div>
            <CardTitle className="text-2xl">{getTitle()}</CardTitle>
            {getDescription() && (
              <CardDescription className="mt-2">{getDescription()}</CardDescription>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 邮箱输入 */}
            {mode !== 'verify' && (
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* 密码输入 */}
            {(mode === 'login' || mode === 'register') && (
              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('auth.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}

            {/* 确认密码输入 - 仅注册时显示 */}
            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}

            {/* 验证码输入 */}
            {mode === 'verify' && (
              <div className="space-y-2">
                <Label htmlFor="code">{t('auth.verificationCode')}</Label>
                <div className="flex gap-2">
                  <Input
                    id="code"
                    type="text"
                    placeholder={t('auth.verificationCodePlaceholder')}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    disabled={loading}
                    maxLength={6}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSendCode}
                    disabled={loading || countdown > 0}
                  >
                    {countdown > 0 ? `${countdown}s` : t('auth.resendCode')}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('auth.verificationCodeSentTo', { email })}
                </p>
              </div>
            )}

            {/* 忘记密码链接 */}
            {mode === 'login' && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  className="px-0 text-sm"
                  onClick={() => setMode('forgot')}
                >
                  {t('auth.forgotPassword')}
                </Button>
              </div>
            )}

            {/* 提交按钮 */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? t('common.loading') : getTitle()}
            </Button>

            {/* 返回按钮 */}
            {(mode === 'verify' || mode === 'forgot') && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setMode(mode === 'verify' ? 'register' : 'login')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.back')}
              </Button>
            )}

            {/* 切换登录/注册 */}
            {(mode === 'login' || mode === 'register') && (
              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  {mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}
                </span>
                <Button
                  type="button"
                  variant="link"
                  className="px-1"
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                >
                  {mode === 'login' ? t('auth.goToRegister') : t('auth.goToLogin')}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
