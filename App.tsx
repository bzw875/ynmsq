import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { navigationRef } from './src/utils/navigationRef';

// 导入所有屏幕
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import Aish123Screen from './src/screens/Aish123Screen';
import AgentScreen from './src/screens/AgentScreen';
import WenXinScreen from './src/screens/WenXinScreen';
import AccountScreen from './src/screens/AccountScreen';
import AuthorScreen from './src/screens/AuthorScreen';
import LoginScreen from './src/screens/LoginScreen';

// 创建导航器
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 主页标签导航
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';
          
          if (route.name === 'Home') {
            iconName = focused ? '🏠' : '🏠';
          } else if (route.name === 'Search') {
            iconName = focused ? '🔍' : '🔍';
          } else if (route.name === 'Statistics') {
            iconName = focused ? '📊' : '📊';
          } else if (route.name === 'Aish123') {
            iconName = focused ? '✨' : '✨';
          } else if (route.name === 'Account') {
            iconName = focused ? '👤' : '👤';
          }
          
          return <Text style={{ fontSize: size }}>{iconName}</Text>;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: '首页' }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ title: '搜索' }}
      />
      <Tab.Screen 
        name="Statistics" 
        component={StatisticsScreen} 
        options={{ title: '统计' }}
      />
      <Tab.Screen 
        name="Aish123" 
        component={Aish123Screen} 
        options={{ title: 'Aish123' }}
      />
      <Tab.Screen 
        name="Account" 
        component={AccountScreen} 
        options={{ title: '账户' }}
      />
    </Tab.Navigator>
  );
}

// 根导航堆栈
function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#f5f5f5' },
      }}
    >
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Agent" component={AgentScreen} />
      <Stack.Screen name="WenXin" component={WenXinScreen} />
      <Stack.Screen name="Author" component={AuthorScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

// 主应用组件
function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer ref={navigationRef}>
          <RootStack />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;