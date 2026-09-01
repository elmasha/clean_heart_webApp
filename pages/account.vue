<template>
  <div style="margin-top: 64px; min-height: calc(100vh - 64px); background: #fafafa;">
    <v-container class="py-8">
      <h1 style="font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 900; color: #000; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 30px;">
        My Account
      </h1>

      <v-row>
        <!-- Sidebar -->
        <v-col cols="12" md="3">
          <v-card style="border-radius: 0; border: 1px solid #e0e0e0;">
            <div class="pa-6 text-center">
              <v-avatar size="80" color="#E53935" class="mb-3">
                <span style="font-size: 2rem; color: #fff; font-weight: 700;">
                  {{ userInitials }}
                </span>
              </v-avatar>
              <div style="font-weight: 700; font-size: 1rem; color: #000;">
                {{ userDisplayName }}
              </div>
              <div style="font-size: 0.8rem; color: #666;">
                {{ userEmail }}
              </div>
            </div>
            <v-divider />
            <v-list dense nav style="padding: 0;">
              <v-list-item
                v-for="item in menuItems"
                :key="item.id"
                :active="activeSection === item.id"
                @click="activeSection = item.id"
                style="border-radius: 0; border-left: 3px solid transparent;"
                :style="activeSection === item.id ? 'border-left-color: #E53935; background: #f5f5f5;' : ''"
              >
                <v-list-item-icon>
                  <v-icon size="20" :color="activeSection === item.id ? '#E53935' : '#666'">
                    {{ item.icon }}
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-title 
                  style="font-size: 0.85rem; font-weight: 500;"
                  :style="activeSection === item.id ? 'color: #E53935;' : 'color: #333;'"
                >
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item>
              <v-divider />
              <v-list-item @click="logout" style="border-radius: 0;">
                <v-list-item-icon>
                  <v-icon size="20" color="#E53935">mdi-logout</v-icon>
                </v-list-item-icon>
                <v-list-item-title style="font-size: 0.85rem; font-weight: 500; color: #E53935;">
                  Logout
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <!-- Main Content -->
        <v-col cols="12" md="9">
          <!-- Profile Section -->
          <template v-if="activeSection === 'profile'">
            <ProfileSection :user="user" @update="fetchUser" />
          </template>

          <!-- Orders Section -->
          <template v-if="activeSection === 'orders'">
            <OrdersSection :orders="orders" :loading="loadingOrders" @refresh="fetchOrders" />
          </template>

          <!-- Addresses Section -->
          <template v-if="activeSection === 'addresses'">
            <AddressesSection :addresses="addresses" :loading="loadingAddresses" @refresh="fetchAddresses" />
          </template>

          <!-- Wishlist Section -->
          <template v-if="activeSection === 'wishlist'">
            <WishlistSection :wishlist="wishlist" :loading="loadingWishlist" @refresh="fetchWishlist" />
          </template>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AccountPage',
  middleware: 'auth',
  data() {
    return {
      activeSection: 'profile',
      loading: false,
      loadingOrders: false,
      loadingAddresses: false,
      loadingWishlist: false,
      user: null,
      orders: [],
      addresses: [],
      wishlist: [],
      menuItems: [
        { id: 'profile', title: 'Profile', icon: 'mdi-account-outline' },
        { id: 'orders', title: 'My Orders', icon: 'mdi-package-variant' },
        { id: 'addresses', title: 'Addresses', icon: 'mdi-map-marker-outline' },
        { id: 'wishlist', title: 'Wishlist', icon: 'mdi-heart-outline' },
      ]
    }
  },
  computed: {
    ...mapState({
      authUser: state => state.authUser,
    }),
    firebaseUid() {
      return this.authUser?.uid || null
    },
    userDisplayName() {
      if (this.user?.full_name) return this.user.full_name
      if (this.authUser?.displayName) return this.authUser.displayName
      return 'User'
    },
    userEmail() {
      return this.user?.email || this.authUser?.email || 'No email'
    },
    userInitials() {
      const name = this.userDisplayName
      if (name === 'User') return 'U'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
  },
  mounted() {
    if (this.firebaseUid) {
      this.fetchUser()
      this.fetchOrders()
      this.fetchAddresses()
      this.fetchWishlist()
    }
  },
  watch: {
    firebaseUid: {
      immediate: true,
      handler(newUid) {
        if (newUid) {
          this.fetchUser()
          this.fetchOrders()
          this.fetchAddresses()
          this.fetchWishlist()
        }
      }
    }
  },
  methods: {
    async fetchUser() {
      if (!this.firebaseUid) return
      
      this.loading = true
      try {
        const { data } = await this.$axios.get('/api/users/profile', {
          params: { firebaseUid: this.firebaseUid },
          withCredentials: false
        })
        if (data.success) {
          this.user = data.data
        }
      } catch (error) {
        console.error('Fetch user error:', error)
        this.$nuxt.$emit('show-snackbar', {
          message: 'Failed to load user profile',
          color: 'error'
        })
      } finally {
        this.loading = false
      }
    },

    async fetchOrders() {
      if (!this.firebaseUid) return
      
      this.loadingOrders = true
      try {
        const { data } = await this.$axios.get('/api/orders', {
          params: { firebaseUid: this.firebaseUid },
          withCredentials: false
        })
        if (data.success) {
          this.orders = data.data || []
        }
      } catch (error) {
        console.error('Fetch orders error:', error)
      } finally {
        this.loadingOrders = false
      }
    },

    async fetchAddresses() {
      if (!this.firebaseUid) return
      
      this.loadingAddresses = true
      try {
        // Get addresses from user profile
        const { data } = await this.$axios.get('/api/users/profile', {
          params: { firebaseUid: this.firebaseUid },
          withCredentials: false
        })
        if (data.success && data.data.addresses) {
          this.addresses = data.data.addresses
        } else {
          this.addresses = []
        }
      } catch (error) {
        console.error('Fetch addresses error:', error)
        this.addresses = []
      } finally {
        this.loadingAddresses = false
      }
    },

    async fetchWishlist() {
      if (!this.firebaseUid) return
      
      this.loadingWishlist = true
      try {
        // If you have a wishlist endpoint, use it
        // For now, we'll use a placeholder
        this.wishlist = []
      } catch (error) {
        console.error('Fetch wishlist error:', error)
        this.wishlist = []
      } finally {
        this.loadingWishlist = false
      }
    },

    async logout() {
      try {
        await this.$fire.auth.signOut()
        this.$store.dispatch('logout')
        this.$nuxt.$emit('show-snackbar', {
          message: 'Logged out successfully',
          color: '#E53935'
        })
        this.$router.push('/')
      } catch (error) {
        console.error('Logout error:', error)
        this.$nuxt.$emit('show-snackbar', {
          message: 'Failed to logout',
          color: 'error'
        })
      }
    }
  },
  head() {
    return { title: 'My Account | Clean Heart' }
  }
}
</script>