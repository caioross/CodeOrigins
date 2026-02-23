import { Language } from './languages';
import { languages as languages1 } from './languages';
import { languages2 } from './languages2';

// Combine all language arrays into a single exported array
export const allLanguages: Language[] = [...languages1, ...languages2];

// Re-export types
export type { Language, Moon } from './languages';
