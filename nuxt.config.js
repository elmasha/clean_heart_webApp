import colors from 'vuetify/es5/util/colors'

export default {
  ssr: false,

  head: {
    titleTemplate: '%s | Clean Heart',
    title: 'Clean Heart',
    htmlAttrs: { lang: 'en' },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Premium streetwear merchandise. Wear your heart on your sleeve.' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/logo.jpg' }
    ]
  },

  css: [],

  plugins: [
    "@/plugins/mapGoogle.client.js",
    "@/plugins/directionsRenderer.js",
    '@/plugins/chart.js'
  ],

  router: { middleware: ["auth"] },

  env: {
    MAPS_API_KEY: process.env.MAPS_API_KEY || 'AIzaSyBohXT2fagF68PWxk4fnTSnH3tNf5Zo21o',
  },

  components: true,

  googleFonts: {
    download: true,
    families: { Quicksand: true },
    display: "Quicksand",
  },

  buildModules: [
    '@nuxtjs/vuetify',
    "@nuxtjs/google-fonts",
  ],

  moment: { timezone: false },

  modules: [
    [
      "@nuxtjs/firebase",
      {
        config: {
          apiKey: "AIzaSyA1bevCNuORUYa1f2_b2_Otj0yVMIkkLSI",
          authDomain: "clean-heart-85fea.firebaseapp.com",
          projectId: "clean-heart-85fea",
          storageBucket: "clean-heart-85fea.firebasestorage.app",
          messagingSenderId: "890248014442",
          appId: "1:890248014442:web:73f193e9b4da705b267813",
          measurementId: "G-7JKBZMJY3G"
        },
        services: {
          auth: {
            persistence: "local",
            initialize: {
              nAuthStateChangedMutation: "ON_AUTH_STATE_CHANGED_MUTATION",
              subscribeManually: false,
            },
            ssr: false,
          },
          storage: true,
          firestore: true,
        },
      },
    ],
    '@nuxtjs/axios',
  ],

  axios: {
    baseURL:'https://cleanheartserver-production.up.railway.app',
    credentials: true,
  },

  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#E53935',
          secondary: '#212121',
          accent: '#B71C1C',
          background: '#FFFFFF',
          surface: '#FAFAFA',
          info: '#424242',
          success: '#2E7D32',
          warning: '#F57C00',
          error: '#C62828',
        },
        dark: {
          primary: '#E53935',
          secondary: '#FFFFFF',
          accent: '#FF1744',
          background: '#121212',
          surface: '#1E1E1E',
          info: '#BDBDBD',
          success: '#66BB6A',
          warning: '#FFA726',
          error: '#EF5350',
        }
      }
    }
  },

  build: {}
}