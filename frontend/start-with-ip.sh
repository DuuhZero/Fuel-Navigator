#!/bin/bash

# Detecta o IP local automaticamente
LOCAL_IP=$(node get-local-ip.js)


# Exporta a variável de ambiente e inicia o Expo
export EXPO_PUBLIC_API_HOST=$LOCAL_IP
npx expo start
