// languages.ts
import { useTranslation } from 'react-i18next';

const LanguagesArray = () => {
  const { t } = useTranslation();

  return {
    [t('English')]: 'en',
    [t('Spanish')]: 'es',
    [t('Arabic')]: 'ar',
    [t('French')]: 'fr'
  };
};

export default LanguagesArray;
