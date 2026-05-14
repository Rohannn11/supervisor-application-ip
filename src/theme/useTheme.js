import { useAppContext } from '../context/AppContext';
import { Colors, DarkColors } from './colors';

/**
 * Returns the correct color palette based on the current dark mode setting.
 * Usage: const C = useTheme();  → C.primary, C.background, etc.
 */
export function useTheme() {
  const { isDarkMode } = useAppContext();
  return isDarkMode ? DarkColors : Colors;
}
