import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens (você precisará criar essas telas depois)
import NavegacaoScreen from '../screens/NavegacaoScreen';
import VeiculosScreen from '../screens/VeiculosScreen';
import HistoricoScreen from '../screens/HistoricoScreen';
import PerfilScreen from '../screens/PerfilScreen';
import RelatoriosScreen from '../screens/RelatoriosScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#FF9B42',
        tabBarInactiveTintColor: '#bbbbbb',
        tabBarStyle: { backgroundColor: '#fff' },
      }}
    >
      <Tab.Screen
        name="Navegação"
        component={NavegacaoScreen}
        options={{
          tabBarLabel: 'Navegação',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="navigate" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Veículos"
        component={VeiculosScreen}
        options={{
          tabBarLabel: 'Veículos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Histórico"
        component={HistoricoScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Relatórios"
        component={RelatoriosScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size} color={color} />
          ),
        }}
      />
      
    </Tab.Navigator>
  );
}