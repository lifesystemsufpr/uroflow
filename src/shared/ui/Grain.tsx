import { memo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import grain from '../../../assets/images/grain.png';

export const Grain = memo(function Grain() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Image source={grain} resizeMode="repeat" style={styles.fill} />
    </View>
  );
});

const styles = StyleSheet.create({
  fill: {
    width: '100%',
    height: '100%',
  },
});
