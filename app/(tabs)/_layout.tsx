import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: string;
  color: string;
}) {
  return <IconSymbol size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF6B00',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: 60 + (insets.bottom > 0 ? insets.bottom : 10),
          paddingTop: 10,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          borderTopWidth: 1,
          borderTopColor: '#eee',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 5,
        },
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color }) => <TabBarIcon name="house" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Khám phá',
          tabBarIcon: ({ color }) => <TabBarIcon name="safari" color={color} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Đơn hàng',
          tabBarIcon: ({ color }) => <TabBarIcon name="bag" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Cá nhân',
          tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'Thêm',
          tabBarIcon: ({ color }) => <TabBarIcon name="ellipsis.circle" color={color} />,
        }}
      />
    </Tabs>
  );
}
