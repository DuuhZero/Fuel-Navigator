const os = require('os');

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  
  // Procura por interface WiFi ou ethernet ativa
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Ignora interfaces internas e IPv6
      if (iface.family === 'IPv4' && !iface.internal) {
        // Prioriza WiFi (wl*), senão ethernet (eth*, enp*)
        if (name.startsWith('wl') || name.startsWith('eth') || name.startsWith('enp')) {
          return iface.address;
        }
      }
    }
  }
  
  // Fallback: retorna qualquer IPv4 não-interno
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  
  return 'localhost';
}

const LOCAL_IP = getLocalIp();

export default {
  expo: {
    name: "FuelNav",
    slug: "fuelnavapp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.fuelnavapp"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "FOREGROUND_SERVICE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.FOREGROUND_SERVICE"
      ],
      config: {
        googleMaps: {
          apiKey: "SUA_CHAVE_GOOGLE_MAPS_AQUI"
        }
      },
      package: "com.anonymous.fuelnavapp"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Permitir $(PRODUCT_NAME) usar sua localização para calcular rotas mais precisas."
        }
      ]
    ],
    extra: {
      apiHost: LOCAL_IP,
    },
  },
};

