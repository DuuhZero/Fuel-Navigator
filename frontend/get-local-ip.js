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


