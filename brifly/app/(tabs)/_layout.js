import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#white' },
        tabBarActiveTintColor: '#facc15',
        tabBarInactiveTintColor: '#888',
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'index') iconName = 'home';
          if (route.name === 'dashboard') iconName = 'list';
          if (route.name === 'discover') iconName = 'earth';
          if (route.name === 'profile') iconName = 'person';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    />
  );
}