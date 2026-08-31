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
      { rel: 'icon', type: 'image/x-icon', href: '/logo.png' }
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
          apiKey: "AIzaSyAwLDEb3zYp9_0KNzrmz4reYgI3Y6iFCkg",
          authDomain: "swiife-260ff.firebaseapp.com",
          projectId: "swiife-260ff",
          storageBucket: "swiife-260ff.firebasestorage.app",
          messagingSenderId: "872066992824",
          appId: "1:872066992824:web:b76134c4b884354b13424d",
          measurementId: "G-29FZ1PJ8HL"
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
    baseURL: process.env.API_BASE_URL || 'https://cleanheartserver-production.up.railway.app/api',
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