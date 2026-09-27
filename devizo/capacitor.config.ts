import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'app.devizo.converter',
  appName: 'Devizo',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
}

export default config
