import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LanguageSelectorProps {
  onLanguageSelected: (language: string) => void;
}

export default function LanguageSelector({ onLanguageSelected }: LanguageSelectorProps) {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  const languages = [
    {
      code: 'zh',
      name: '中文',
      description: '简体中文',
      flag: '🇨🇳',
    },
    {
      code: 'en',
      name: 'English',
      description: 'English',
      flag: '🇺🇸',
    },
  ];

  const handleLanguageSelect = (code: string) => {
    setSelectedLanguage(code);
  };

  const handleConfirm = () => {
    if (selectedLanguage) {
      i18n.changeLanguage(selectedLanguage);
      localStorage.setItem('language', selectedLanguage);
      onLanguageSelected(selectedLanguage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Globe className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">时鲜管家</CardTitle>
            <CardTitle className="text-xl font-bold text-muted-foreground mt-1">Fresh Manager</CardTitle>
          </div>
          <CardDescription className="text-base">
            请选择您的语言 / Please select your language
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between hover:border-primary hover:bg-primary/5 ${
                  selectedLanguage === language.code
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-border bg-card'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{language.flag}</span>
                  <div className="text-left">
                    <div className="font-semibold text-lg">{language.name}</div>
                    <div className="text-sm text-muted-foreground">{language.description}</div>
                  </div>
                </div>
                {selectedLanguage === language.code && (
                  <Check className="h-6 w-6 text-primary" />
                )}
              </button>
            ))}
          </div>

          <Button
            onClick={handleConfirm}
            disabled={!selectedLanguage}
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            {selectedLanguage === 'zh' ? '确认' : selectedLanguage === 'en' ? 'Confirm' : '确认 / Confirm'}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            您可以稍后在设置中更改语言
            <br />
            You can change the language later in settings
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
