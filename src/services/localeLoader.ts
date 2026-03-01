/// <reference types="vite/client" />
import { useStore } from '../store';
import { Language } from '../data/languages';

// Glob pattern to find all json files in src/data/lang/
const localeFiles = import.meta.glob('/src/data/lang/*.json');

export const getAvailableLocales = () => {
    return Object.keys(localeFiles).map((path) => {
        // Extract the filename without extension (e.g. 'en' from '/src/data/lang/en.json')
        const match = path.match(/\/([^/]+)\.json$/);
        return match ? match[1] : '';
    }).filter(Boolean);
};

// Deterministic pseudo-random number generator based on string hash
const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
};

export const loadLocaleData = async (locale: string) => {
    const store = useStore.getState();
    store.setIsLoading(true);

    try {
        const path = `/src/data/lang/${locale}.json`;
        const loader = localeFiles[path] as () => Promise<any>;

        if (!loader) {
            console.warn(`Locale ${locale} not found, falling back to en`);
            if (locale !== 'en') {
                return loadLocaleData('en');
            }
            return;
        }

        const module = await loader();
        // Invite, raw JSON imports usually have the array in `default`, or directly
        const rawLanguages: Language[] = module.default || module;

        // Apply deterministic angles to languages based on their IDs so they don't jump 
        // around randomly between loads, but are distributed.
        const languagesWithAngles = rawLanguages.map((lang, index) => {
            // Golden angle distribution or hash based
            // Using a hash of the ID ensures the same language always gets the same angle
            const hash = hashString(lang.id);
            const angle = hash % 360;

            return {
                ...lang,
                angle: lang.angle ?? angle
            };
        });

        store.setLanguages(languagesWithAngles);
        store.setCurrentLocale(locale);

        // Re-assign currently selected and hovered planets so that new language texts take effect immediately
        if (store.selectedLanguage) {
            const newSelected = languagesWithAngles.find(l => l.id === store.selectedLanguage!.id);
            if (newSelected) store.setSelectedLanguage(newSelected);
        }
        if (store.hoveredLanguage) {
            const newHovered = languagesWithAngles.find(l => l.id === store.hoveredLanguage!.id);
            if (newHovered) store.setHoveredLanguage(newHovered);
        }

    } catch (error) {
        console.error(`Failed to load locale: ${locale}`, error);
    } finally {
        store.setIsLoading(false);
    }
};
