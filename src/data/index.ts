import { Language } from './languages';
import { languages as languages1 } from './languages';
import { languages2 } from './languages2';
import { languages3 } from './languages3';
import { languages4 } from './languages4';

// Combine all language arrays into a single exported array
export const allLanguages: Language[] = [...languages1, ...languages2, ...languages3, ...languages4];

// Re-export types
export type { Language, Moon } from './languages';
