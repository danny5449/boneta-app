import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import { FavoritesProvider } from './FavoritesContext';
import MarketScreen from './MarketScreen';
import FavoritesScreen from './FavoritesScreen';
import SearchScreen from './SearchScreen';
import NotificationsScreen from './NotificationsScreen';
import AccountScreen from './AccountScreen';
import ProductDetailsScreen from './ProductDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack navigator for Market tab
const MarketStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MarketHome" component={MarketScreen} />
    <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
  </Stack.Navigator>
);

// Stack navigator for Favorites tab
const FavoritesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="FavoritesHome" component={FavoritesScreen} />
    <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
  </Stack.Navigator>
);

export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'Market') {
                iconName = 'trending-up';
              } else if (route.name === 'Search') {
                iconName = 'search';
              } else if (route.name === 'Favorites') {
                iconName = 'heart';
              } else if (route.name === 'Notifications') {
                iconName = 'notifications';
              } else if (route.name === 'Account') {
                iconName = 'person';
              }
              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#000',
            tabBarInactiveTintColor: '#666',
            tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#ccc' },
            headerShown: false,
          })}
        >
          <Tab.Screen name="Market" component={MarketStack} />
          <Tab.Screen name="Search" component={SearchScreen} />
          <Tab.Screen name="Favorites" component={FavoritesStack} />
          <Tab.Screen name="Notifications" component={NotificationsScreen} />
          <Tab.Screen name="Account" component={AccountScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}