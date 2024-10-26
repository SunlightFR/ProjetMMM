import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { NativeModules, Platform } from 'react-native';

const languageDetector = {
    type: 'languageDetector',
    async: true,
    detect: callback => {
        const lang =
            Platform.OS === 'ios'
                ? NativeModules.SettingsManager.settings.AppleLanguages[0]
                : NativeModules.I18nManager.localeIdentifier;
        callback(lang ? lang.split('_')[0] : 'en');
    },
    init: () => {},
    cacheUserLanguage: () => {},
};

import en from './locales/en.json';
import fr from './locales/fr.json';

i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
        compatibilityJSON: 'v3',
        fallbackLng: 'en',
        lng: 'fr',
        resources: {
            en: {
                translation: en
            },
            fr: {
                translation: fr
            }
        },
        interpolation: {
            escapeValue: false
        },
    });

export default i18n;
