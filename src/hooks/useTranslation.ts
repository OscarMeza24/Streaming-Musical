import { useThemeSettings } from '../contexts/SettingsContext';
import { translations, TranslationKey } from '../locales';

export const useTranslation = () => {
    const { language } = useThemeSettings();

    const t = (key: TranslationKey): string => {
        return translations[language][key] || key;
    };

    return { t, currentLanguage: language };
};
