import { NunitoSans_400Regular } from '@expo-google-fonts/nunito-sans/400Regular';
import { NunitoSans_600SemiBold } from '@expo-google-fonts/nunito-sans/600SemiBold';
import { NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans/700Bold';
import { NunitoSans_800ExtraBold } from '@expo-google-fonts/nunito-sans/800ExtraBold';
import { fonts } from './tokens';

export const fontAssets = {
  [fonts.regular]: NunitoSans_400Regular,
  [fonts.semibold]: NunitoSans_600SemiBold,
  [fonts.bold]: NunitoSans_700Bold,
  [fonts.heavy]: NunitoSans_800ExtraBold,
};
