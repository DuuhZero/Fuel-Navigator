import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import AdicionarVeiculoScreen from './src/screens/AdicionarVeiculoScreen';
import EditarVeiculoScreen from './src/screens/EditarVeiculoScreen';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegistroScreen from './src/screens/RegistroScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';

const Stack = createStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Registro" component={RegistroScreen} />
              <Stack.Screen name="Main" component={MainTabNavigator} />
              <Stack.Screen
                name="AdicionarVeiculo"
                component={AdicionarVeiculoScreen}
                options={{ title: 'Adicionar Veículo' }}
              />
              <Stack.Screen
                name="EditarVeiculo"
                component={EditarVeiculoScreen}
                options={{ title: 'Editar Veículo' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}