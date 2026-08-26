import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useChildStore } from '../store/childStore';
import { colors, metrics } from '../../../shared/theme/colors';
import { calculateAge } from '../../../shared/utils/date';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
  onAddChild: () => void;
}

export function ChildSelector({ visible, onClose, onAddChild }: Props) {
  const { children, activeChildId, setActiveChild } = useChildStore();

  const handleSelect = (id: string) => {
    setActiveChild(id);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Selecionar criança</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.list}>
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
          
          <TouchableOpacity style={styles.addButton} onPress={() => { onClose(); onAddChild(); }}>
            <Ionicons name="add" size={20} color={colors.primary} />
            <Text style={styles.addText}>Cadastrar nova criança</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: metrics.radiusXl,
    borderTopRightRadius: metrics.radiusXl,
    padding: metrics.paddingLg,
    maxHeight: '80%',
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
    maxHeight: 300,
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
