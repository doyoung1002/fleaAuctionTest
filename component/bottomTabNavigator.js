import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return;
}

function MarketScreen() {
  return;
}

function ArticleScreen() {
  return;
}

function MyPageScreen() {
  return;
}

function BottomTabNavigationApp() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home"
        screenOptions={{
          color: 'black',
          tabBarActiveTintColor: 'black',
          tabBarLabelPosition: 'below-icon',


        }}>

        <Tab.Screen
          name="HOME"
          component={HomeScreen}
          options={{
            title: 'HOME',
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" color={color} size={size} />

            ),
          }}
        />
        <Tab.Screen
          name="MARKET"
          component={MarketScreen}
          options={{
            title: 'MARKET',
            tabBarIcon: ({ color, size }) => (
              <Icon name="store" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="ARTICLE"
          component={ArticleScreen}
          options={{
            title: 'ARTICLE',
            tabBarIcon: ({ color, size }) => (
              <Icon name="article" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="My page"
          component={MyPageScreen}
          options={{
            title: 'MY PAGE',
            tabBarIcon: ({ color, size }) => (
              <Icon name="person" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default BottomTabNavigationApp;