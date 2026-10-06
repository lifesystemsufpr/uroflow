import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CaretDownIcon, CheckIcon, UserPlusIcon } from '@/shared/icons';
import { Avatar, Button, Glyph, Popover, Text, Touchable, type Anchor } from '@/shared/ui';
import { colors, fonts, radius, space } from '@/shared/theme';
import { calculateAge } from '@/shared/lib/date';
import { useChildStore } from '../store/childStore';
import { useActiveChild } from '../hooks/useActiveChild';

export type ChildSwitcherProps = {
  variant?: 'pill' | 'headline';
  inverse?: boolean;
};

const firstName = (name?: string) => name?.trim().split(/\s+/)[0] ?? '';

export function ChildSwitcher({ variant = 'pill', inverse = false }: ChildSwitcherProps) {
  const navigation = useNavigation();
  const child = useActiveChild();
  const children = useChildStore((s) => s.children);
  const activeChildId = useChildStore((s) => s.activeChildId);
  const setActiveChild = useChildStore((s) => s.setActiveChild);
  const trigger = useRef<View>(null);
  const afterClose = useRef<(() => void) | null>(null);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const [open, setOpen] = useState(false);

  const openMenu = () =>
    trigger.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setOpen(true);
    });

  const closeThen = (action?: () => void) => {
    afterClose.current = action ?? null;
    setOpen(false);
  };

  const label = child?.name || 'Selecione';

  return (
    <>
      <View ref={trigger} collapsable={false} style={variant === 'headline' ? styles.headlineWrap : null}>
        <Touchable
          onPress={openMenu}
          accessibilityLabel={`Criança acompanhada: ${label}. Trocar criança`}
          style={variant === 'pill' ? styles.pill : styles.headline}
        >
          {variant === 'pill' ? (
            <>
              <Avatar name={child?.name} size={30} />
              <Text variant="bodyStrong" color={colors.primary} numberOfLines={1} style={styles.pillName}>
                {firstName(child?.name) || label}
              </Text>
              <Glyph icon={CaretDownIcon} size={14} color={colors.primary} weight="bold" />
            </>
          ) : (
            <>
              <Text numberOfLines={1} style={[styles.headlineName, inverse && styles.headlineInverse]}>
                {firstName(child?.name) || label}
              </Text>
              <View style={[styles.headlineCaret, inverse && styles.caretInverse]}>
                <Glyph icon={CaretDownIcon} size={16} color={inverse ? colors.onPrimary : colors.primary} weight="bold" />
              </View>
            </>
          )}
        </Touchable>
      </View>

      <Popover
        visible={open}
        anchor={anchor}
        onClose={() => closeThen()}
        onClosed={() => {
          afterClose.current?.();
          afterClose.current = null;
        }}
      >
        <Text variant="label" style={styles.menuLabel}>
          Acompanhando
        </Text>
        {children.map((item) => {
          const active = item.id === activeChildId;
          return (
            <Touchable
              key={item.id}
              effect="tint"
              accessibilityState={{ selected: active }}
              onPress={() => {
                setActiveChild(item.id);
                closeThen();
              }}
              style={[styles.row, active && styles.rowActive]}
            >
              <Avatar
                name={item.name}
                size={40}
                background={active ? colors.onPrimary : colors.primaryMist}
                color={colors.primary}
              />
              <View style={styles.rowText}>
                <Text variant="bodyStrong" color={active ? colors.onPrimary : colors.text} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text variant="caption" color={active ? colors.primaryMist : colors.textMuted}>
                  {calculateAge(item.birthDate) || 'Sem idade'}
                </Text>
              </View>
              {active ? <Glyph icon={CheckIcon} size={18} color={colors.onPrimary} weight="bold" /> : null}
            </Touchable>
          );
        })}
        <Button
          label="Cadastrar nova criança"
          icon={UserPlusIcon}
          variant="dashed"
          compact
          onPress={() => closeThen(() => navigation.navigate('ChildForm'))}
          style={styles.add}
        />
      </Popover>
    </>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    paddingLeft: 4,
    paddingRight: space.sm,
    height: 40,
    maxWidth: 170,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  pillName: {
    flexShrink: 1,
    fontSize: 14,
  },
  headlineWrap: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  headline: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: space.xs,
    maxWidth: '100%',
  },
  headlineName: {
    flexShrink: 1,
    fontFamily: fonts.heavy,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.8,
    color: colors.primary,
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
    textDecorationColor: colors.primarySoft,
  },
  headlineCaret: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primaryMist,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  headlineInverse: {
    color: colors.onPrimary,
    textDecorationColor: colors.primaryMist,
  },
  caretInverse: {
    backgroundColor: colors.primary,
  },
  menuLabel: {
    paddingHorizontal: space.xs,
    paddingTop: space.xxs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    padding: space.xs,
    borderRadius: radius.md,
  },
  rowActive: {
    backgroundColor: colors.primary,
  },
  rowText: {
    flex: 1,
  },
  add: {
    marginTop: space.xxs,
  },
});
