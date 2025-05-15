import { Platform } from 'react-native';
import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleProp, ViewStyle, TextStyle, OpaqueColorValue } from 'react-native';

// Mapping từ tên SF Symbols sang tên Material Icons
const MAPPING: Record<string, string> = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'star.fill': 'star',
  'globe': 'public',
  'info.circle': 'info',
  'paintbrush': 'brush',
  'bubble.left.and.bubble.right': 'chat',
  'doc.text': 'description',
  'lock.shield': 'security',
  'arrow.clockwise': 'refresh',
  'square.grid.2x2': 'grid-view',
  'puzzle.piece': 'extension',
  'chevron.down': 'keyboard-arrow-down',
  'chevron.up': 'keyboard-arrow-up',
  'chevron.left': 'keyboard-arrow-left',
  'bell.fill': 'notifications',
  'bell': 'notifications-none',
  'cart.fill': 'shopping-cart',
  'cart': 'shopping-cart-outlined',
  'heart.fill': 'favorite',
  'heart': 'favorite-border',
  'person.fill': 'person',
  'person': 'person-outline',
  'magnifyingglass': 'search',
  'gearshape.fill': 'settings',
  'gearshape': 'settings-outlined',
  'ellipsis': 'more-horiz',
  'trash.fill': 'delete',
  'trash': 'delete-outline',
  'plus': 'add',
  'minus': 'remove',
  'xmark': 'close',
  'checkmark': 'check',
  'arrow.left': 'arrow-back',
  'arrow.right': 'arrow-forward',
  'arrow.up': 'arrow-upward',
  'arrow.down': 'arrow-downward',
  'calendar': 'calendar-today',
  'clock': 'access-time',
  'location.fill': 'place',
  'location': 'place',
  'phone.fill': 'phone',
  'phone': 'phone',
  'envelope.fill': 'email',
  'envelope': 'email',
  'camera.fill': 'camera',
  'camera': 'camera-alt',
  'photo.fill': 'photo',
  'photo': 'photo',
  'video.fill': 'videocam',
  'video': 'videocam',
  'mic.fill': 'mic',
  'mic': 'mic-none',
  'bookmark.fill': 'bookmark',
  'bookmark': 'bookmark-border',
  'tag.fill': 'local-offer',
  'tag': 'local-offer',
  'bag.fill': 'shopping-bag',
  'bag': 'shopping-bag',
  'gift.fill': 'card-giftcard',
  'gift': 'card-giftcard'
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle | TextStyle>;
  weight?: SymbolWeight;
}) {
  // Sử dụng SF Symbols trên iOS, Material Icons trên Android và web
  if (Platform.OS === 'ios') {
    return (
      <SymbolView
        weight={weight}
        tintColor={color as string}
        resizeMode="scaleAspectFit"
        name={name as SymbolViewProps['name']}
        style={[
          {
            width: size,
            height: size,
          },
          style as StyleProp<ViewStyle>,
        ]}
      />
    );
  } else {
    // Fallback cho Android và web
    const materialIconName = MAPPING[name] || 'help-outline';
    return (
      <MaterialIcons
        name={materialIconName}
        size={size}
        color={color}
        style={style as StyleProp<TextStyle>}
      />
    );
  }
}