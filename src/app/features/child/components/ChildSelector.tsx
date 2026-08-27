import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useChildStore } from '../store/childStore';
import { colors, metrics } from '../../../shared/theme/colors';
import { calculateAge } from '../../../shared/utils/date';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AddChildModal } from './AddChildModal';

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddChild?: () => void; // Optional now, since we handle it internally
}

export function ChildSelector({ visible, onClose, onAddChild }: Props) {
  const { children, activeChildId, setActiveChild } = useChildStore();
  const insets = useSafeAreaInsets();
  const [isAddingChild, setIsAddingChild] = useState(false);

  const handleSelect = (id: string) => {
    setActiveChild(id);
    onClose();
  };

  const handleAddPress = () => {
    setIsAddingChild(true);
    if (onAddChild) {
      onAddChild();
    }
  };

  const handleCloseAdd = () => {
    setIsAddingChild(false);
    onClose(); // Optional: close selector too when done adding
  };

  return (
    <>
      <Modal visible={visible && !isAddingChild} transparent animationType="slide">
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
          
          <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, metrics.paddingLg) }]}>
            <View style={styles.header}>
              <Text style={styles.title}>Selecionar criança</Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
              {children.map(child => (
                <TouchableOpacity 
                  key={child.id} 
                  style={[styles.item, activeChildId === child.id && styles.itemActive]}
                  onPress={() => handleSelect(child.id)}
                >
                  <Text style={styles.avatar}>{child.avatar || '👦'}</Text>
                  <View style={styles.info}>
                    <Text style={styles.name}>{child.name}</Text>
                    <Text style={styles.age}>{calculateAge(child.birthDate) || 'Sem idade'}</Text>
                  </View>
                  {activeChildId === child.id && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
              <Ionicons name="add" size={20} color={colors.primary} />
              <Text style={styles.addText}>Cadastrar nova criança</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <AddChildModal 
        visible={isAddingChild} 
        onClose={handleCloseAdd} 
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: metrics.paddingLg,
    paddingTop: metrics.paddingLg,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: metrics.paddingLg,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  list: {
    flexGrow: 0,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: metrics.paddingMd,
    borderRadius: metrics.radiusMd,
    marginBottom: metrics.paddingSm,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  itemActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  avatar: {
    fontSize: 32,
    marginRight: metrics.paddingMd,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  age: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: metrics.paddingMd,
    marginTop: metrics.paddingSm,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    borderRadius: metrics.radiusMd,
  },
  addText: {
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 8,
  }
});
