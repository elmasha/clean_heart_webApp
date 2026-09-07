<template>
  <div class="ch-account-wrapper">
    <!-- Mobile Header -->
    <div class="ch-mobile-header d-md-none">
      
      <span class="ch-mobile-title">My Account</span>
      <v-avatar size="32" class="ch-mobile-avatar">
        <span class="ch-avatar-text-sm">{{ userInitials }}</span>
      </v-avatar>
    </div>

    <!-- Desktop Container -->
    <v-container class="py-6 py-md-10 px-4 px-md-6">
      <!-- Desktop Header -->
      <div class="ch-header d-none d-md-flex mb-8">
        <div>
          <h1 class="ch-title">My Account</h1>
          <p class="ch-subtitle">Manage your profile, orders & saved items</p>
        </div>
        <v-spacer />
        <div class="ch-header-actions">
          <v-btn
            icon
            dark
            class="mr-2"
            @click="$router.push('/cart')"
          >
            <v-badge
              :content="cartCount"
              :value="cartCount > 0"
              color="#E53935"
              overlap
            >
              <v-icon>mdi-shopping-outline</v-icon>
            </v-badge>
          </v-btn>
          <v-btn icon dark @click="mobileMenuOpen = true">
            <v-icon>mdi-cog-outline</v-icon>
          </v-btn>
        </div>
      </div>

      <v-row>
        <!-- Desktop Sidebar -->
        <v-col cols="12" md="3" class="d-none d-md-block">
          <div class="ch-sidebar-sticky">
            <!-- User Card -->
            <v-card class="ch-card ch-user-card mb-4" flat>
              <div class="pa-6 text-center">
                <v-avatar size="100" class="ch-avatar mb-4">
                  <span class="ch-avatar-text">{{ userInitials }}</span>
                </v-avatar>
                <div class="ch-user-name">{{ userDisplayName }}</div>
                <div class="ch-user-email">{{ userEmail }}</div>
                <v-chip
                  v-if="user?.member_since"
                  class="mt-3"
                  small
                  color="#E53935"
                  text-color="white"
                  label
                >
                  <v-icon left size="14">mdi-calendar-check</v-icon>
                  Since {{ formatDate(user.member_since) }}
                </v-chip>
              </div>
            </v-card>

            <!-- Navigation -->
            <v-card class="ch-card" flat>
              <v-list dense nav class="ch-nav">
                <v-list-item
                  v-for="item in menuItems"
                  :key="item.id"
                  :class="['ch-nav-item', { 'ch-nav-active': activeSection === item.id }]"
                  @click="activeSection = item.id"
                >
                  <v-list-item-icon class="mr-3">
                    <v-icon size="20" :color="activeSection === item.id ? '#E53935' : '#888'">
                      {{ item.icon }}
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-title class="ch-nav-text">
                    {{ item.title }}
                  </v-list-item-title>
                  <v-list-item-action v-if="item.badge">
                    <v-chip x-small color="#E53935" text-color="white" class="ch-badge">
                      {{ item.badge }}
                    </v-chip>
                  </v-list-item-action>
                </v-list-item>

                <v-divider class="ch-divider my-2" />

                <v-list-item class="ch-nav-item ch-logout" @click="logout">
                  <v-list-item-icon class="mr-3">
                    <v-icon size="20" color="#E53935">mdi-logout-variant</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title class="ch-nav-text" style="color: #E53935;">
                    Sign Out
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>

            <!-- Loyalty Card -->
            <v-card class="ch-card ch-loyalty-card mt-4 pa-5" flat v-if="user?.loyalty_points">
              <div class="d-flex align-center mb-3">
                <div class="ch-loyalty-icon">
                  <v-icon color="#E53935" size="18">mdi-heart</v-icon>
                </div>
                <span class="ch-loyalty-title">Clean Rewards</span>
              </div>
              <div class="ch-loyalty-points">{{ user.loyalty_points.toLocaleString() }}</div>
              <div class="ch-loyalty-label">points</div>
              <v-progress-linear
                :value="(user.loyalty_points % 1000) / 10"
                color="#E53935"
                background-color="#2a2a2a"
                height="4"
                rounded
                class="mt-3"
              />
              <div class="ch-loyalty-hint mt-2">
                {{ (1000 - (user.loyalty_points % 1000)).toLocaleString() }} pts to next reward
              </div>
            </v-card>
          </div>
        </v-col>

        <!-- Main Content -->
        <v-col cols="12" md="9">
          <!-- Mobile User Summary -->
          <v-card class="ch-card ch-mobile-user d-md-none mb-4" flat>
            <div class="d-flex align-center pa-4">
              <v-avatar size="56" class="ch-avatar mr-4">
                <span class="ch-avatar-text">{{ userInitials }}</span>
              </v-avatar>
              <div class="flex-grow-1">
                <div class="ch-user-name">{{ userDisplayName }}</div>
                <div class="ch-user-email">{{ userEmail }}</div>
                <div v-if="user?.loyalty_points" class="ch-mobile-points mt-1">
                  <v-icon size="14" color="#E53935" class="mr-1">mdi-heart</v-icon>
                  {{ user.loyalty_points.toLocaleString() }} pts
                </div>
              </div>
              <v-btn icon dark small @click="mobileMenuOpen = true">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>
          </v-card>

          <!-- Content Sections -->
          <v-slide-x-reverse-transition mode="out-in">
            <div :key="activeSection">
              <!-- Profile Section -->
              <div v-if="activeSection === 'profile'">
                <ProfileSection :user="user" @update="fetchUser" />
              </div>

              <!-- Orders Section -->
              <div v-if="activeSection === 'orders'">
                <OrdersSection 
                  :orders="orders" 
                  :loading="loadingOrders" 
                  @refresh="fetchOrders"
                  @track="openTracking"
                />
              </div>

              <!-- Addresses Section -->
              <div v-if="activeSection === 'addresses'">
                <AddressesSection 
                  :addresses="addresses" 
                  :loading="loadingAddresses" 
                  @refresh="fetchAddresses"
                />
              </div>

              <!-- Wishlist Section -->
              <div v-if="activeSection === 'wishlist'">
                <WishlistSection 
                  :wishlist="wishlist" 
                  :loading="loadingWishlist" 
                  @refresh="fetchWishlist"
                  @move-to-cart="moveToCart"
                />
              </div>
            </div>
          </v-slide-x-reverse-transition>
        </v-col>
      </v-row>
    </v-container>

    <!-- Mobile Bottom Navigation -->
    <v-bottom-navigation
      v-model="bottomNav"
      class="ch-bottom-nav d-md-none"
      grow
      dark
      shift
    >
      <v-btn
        v-for="item in menuItems"
        :key="item.id"
        :value="item.id"
        @click="activeSection = item.id"
      >
        <span>{{ item.title }}</span>
        <v-icon>{{ item.icon }}</v-icon>
        <v-badge
          v-if="item.badge"
          :content="item.badge"
          color="#E53935"
          overlap
          class="ch-bottom-badge"
        />
      </v-btn>
    </v-bottom-navigation>

    <!-- Mobile Menu Drawer -->
    <v-navigation-drawer
      v-model="mobileMenuOpen"
      fixed
      temporary
      right
      dark
      class="ch-drawer"
      width="300"
    >
      <div class="ch-drawer-header pa-6">
        <v-avatar size="64" class="ch-avatar mb-3">
          <span class="ch-avatar-text">{{ userInitials }}</span>
        </v-avatar>
        <div class="ch-user-name">{{ userDisplayName }}</div>
        <div class="ch-user-email">{{ userEmail }}</div>
      </div>
      <v-divider class="ch-divider" />
      <v-list nav dark class="ch-drawer-nav">
        <v-list-item
          v-for="item in menuItems"
          :key="item.id"
          @click="activeSection = item.id; mobileMenuOpen = false"
          class="ch-drawer-item"
        >
          <v-list-item-icon>
            <v-icon :color="activeSection === item.id ? '#E53935' : '#888'">
              {{ item.icon }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-title :class="['ch-drawer-text', { 'ch-text-red': activeSection === item.id }]">
            {{ item.title }}
          </v-list-item-title>
          <v-list-item-action v-if="item.badge">
            <v-chip x-small color="#E53935" text-color="white">{{ item.badge }}</v-chip>
          </v-list-item-action>
        </v-list-item>
        <v-divider class="ch-divider my-2" />
        <v-list-item @click="logout" class="ch-drawer-item">
          <v-list-item-icon>
            <v-icon color="#E53935">mdi-logout-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="ch-drawer-text" style="color: #E53935;">
            Sign Out
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Tracking Dialog -->
    <v-dialog v-model="trackingDialog" max-width="480" content-class="ch-dialog">
      <v-card class="ch-card ch-tracking-card" flat>
        <v-card-title class="ch-dialog-title">
          <v-icon color="#E53935" class="mr-2">mdi-truck-fast</v-icon>
          Track Order
          <v-spacer />
          <v-btn icon dark small @click="trackingDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-4 pb-2">
          <div class="ch-tracking-number mb-4">#{{ trackingOrder?.order_number }}</div>
          <v-timeline dense align-top>
            <v-timeline-item
              v-for="(event, i) in trackingEvents"
              :key="i"
              :color="i === 0 ? '#E53935' : '#444'"
              small
              fill-dot
              :icon="getTrackingIcon(event.status)"
            >
              <div class="ch-tracking-event">
                <div class="ch-tracking-status">{{ event.status }}</div>
                <div class="ch-tracking-meta">{{ event.date }} • {{ event.location }}</div>
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn text dark color="#E53935" @click="trackingDialog = false" class="ch-btn-text">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Logout Confirm -->
    <v-dialog v-model="logoutDialog" max-width="360" content-class="ch-dialog">
      <v-card class="ch-card" flat>
        <v-card-text class="pa-6 text-center">
          <v-icon size="48" color="#E53935" class="mb-3">mdi-logout-variant</v-icon>
          <div class="ch-confirm-title">Sign Out?</div>
          <div class="ch-confirm-text">Are you sure you want to leave?</div>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-btn text dark class="ch-btn-text" @click="logoutDialog = false">Cancel</v-btn>
          <v-spacer />
          <v-btn dark color="#E53935" class="ch-btn" @click="confirmLogout">Sign Out</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ProfileSection from '~/components/account/ProfileSection.vue'
import OrdersSection from '~/components/account/OrdersSection.vue'
import AddressesSection from '~/components/account/AddressesSection.vue'
import WishlistSection from '~/components/account/WishlistSection.vue'

export default {
  name: 'AccountPage',
  middleware: 'auth',
  components: {
    ProfileSection,
    OrdersSection,
    AddressesSection,
    WishlistSection
  },
  data() {
    return {
      activeSection: 'profile',
      bottomNav: 'profile',
      mobileMenuOpen: false,
      logoutDialog: false,
      trackingDialog: false,
      loading: false,
      loadingOrders: false,
      loadingAddresses: false,
      loadingWishlist: false,
      user: null,
      orders: [],
      addresses: [],
      wishlist: [],
      trackingOrder: null,
      trackingEvents: [],
      menuItems: [
        { id: 'profile', title: 'Profile', icon: 'mdi-account-circle-outline' },
        { id: 'orders', title: 'Orders', icon: 'mdi-package-variant-closed', badge: 0 },
        { id: 'addresses', title: 'Addresses', icon: 'mdi-map-marker-radius-outline' },
        { id: 'wishlist', title: 'Wishlist', icon: 'mdi-heart-outline', badge: 0 },
      ]
    }
  },
  computed: {
    ...mapState({
      authUser: state => state.authUser,
      cart: state => state.cart || []
    }),
    firebaseUid() {
      return this.authUser?.uid || null
    },
    cartCount() {
      return this.cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
    },
    userDisplayName() {
      if (this.user?.full_name) return this.user.full_name
      if (this.authUser?.displayName) return this.authUser.displayName
      return 'Clean Heart Member'
    },
    userEmail() {
      return this.user?.email || this.authUser?.email || 'member@cleanheart.com'
    },
    userInitials() {
      const name = this.userDisplayName
      if (name === 'Clean Heart Member') return 'CH'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
  },
  watch: {
    activeSection(val) {
      this.bottomNav = val
    },
    firebaseUid: {
      immediate: true,
      handler(newUid) {
        if (newUid) this.loadAllData()
      }
    }
  },
  mounted() {
    if (this.firebaseUid) this.loadAllData()
  },
  methods: {
    loadAllData() {
      this.fetchUser()
      this.fetchOrders()
      this.fetchAddresses()
      this.fetchWishlist()
    },

    async fetchUser() {
      if (!this.firebaseUid) return
      this.loading = true
      try {
        const { data } = await this.$axios.get('/api/users/profile', {
          params: { firebaseUid: this.firebaseUid },
          withCredentials: false
        })
        if (data.success) this.user = data.data
      } catch (error) {
        console.error('Fetch user error:', error)
        this.showError('Failed to load profile')
      } finally {
        this.loading = false
      }
    },

    async fetchOrders() {
      if (!this.firebaseUid) return
      this.loadingOrders = true
      try {
        const result = await this.$store.dispatch('fetchOrders', this.firebaseUid)
        if (result) {
          this.orders = result
          const activeOrders = result.filter(o => ['pending', 'processing', 'shipped'].includes(o.status))
          this.menuItems[1].badge = activeOrders.length || 0
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
        const { data } = await this.$axios.get('/api/users/profile', {
          params: { firebaseUid: this.firebaseUid },
          withCredentials: false
        })
        this.addresses = data.success && data.data.addresses ? data.data.addresses : []
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
        const { data } = await this.$axios.get('/api/wishlist', {
          params: { firebaseUid: this.firebaseUid },
          withCredentials: false
        })
        if (data.success) {
          this.wishlist = data.data || []
          this.menuItems[3].badge = this.wishlist.length || 0
        }
      } catch (error) {
        console.error('Fetch wishlist error:', error)
        this.wishlist = []
      } finally {
        this.loadingWishlist = false
      }
    },

    async moveToCart(item) {
      try {
        await this.$axios.post('/api/cart/add', {
          firebaseUid: this.firebaseUid,
          productId: item.product_id,
          variant: item.variant,
          quantity: 1
        })
        this.showSuccess('Added to cart')
        this.fetchWishlist()
        this.$store.dispatch('fetchCart', this.firebaseUid)
      } catch (error) {
        this.showError('Failed to add to cart')
      }
    },

    openTracking(order) {
      this.trackingOrder = order
      this.trackingEvents = order.tracking_events || [
        { status: 'Order Placed', date: order.created_at, location: 'Online' },
        { status: 'Processing', date: order.processed_at, location: 'Warehouse' },
        { status: 'Shipped', date: order.shipped_at, location: 'Distribution Center' },
        { status: 'Out for Delivery', date: order.out_for_delivery_at, location: 'Local Hub' },
        { status: 'Delivered', date: order.delivered_at, location: 'Your Address' }
      ].filter(e => e.date)
      this.trackingDialog = true
    },

    getTrackingIcon(status) {
      const icons = {
        'Order Placed': 'mdi-cart-check',
        'Processing': 'mdi-cog',
        'Shipped': 'mdi-truck',
        'Out for Delivery': 'mdi-map-marker',
        'Delivered': 'mdi-check-circle'
      }
      return icons[status] || 'mdi-circle-small'
    },

    logout() {
      this.logoutDialog = true
    },

    async confirmLogout() {
      try {
        await this.$fire.auth.signOut()
        this.$store.dispatch('logout')
        this.logoutDialog = false
        this.showSuccess('Stay clean.')
        this.$router.push('/')
      } catch (error) {
        console.error('Logout error:', error)
        this.showError('Failed to logout')
      }
    },

    showSuccess(message) {
      this.$nuxt.$emit('show-snackbar', { message, color: '#E53935' })
    },

    showError(message) {
      this.$nuxt.$emit('show-snackbar', { message, color: 'error' })
    },

    formatDate(date) {
      if (!date) return ''
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      })
    }
  },
  head() {
    return { title: 'My Account | Clean Heart' }
  }
}
</script>

<style scoped>
.ch-account-wrapper {
  background: #0a0a0a;
  color: #fff;
  min-height: 100vh;
  padding-bottom: 80px;
}

/* Mobile Header */
.ch-mobile-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.ch-mobile-title {
  flex: 1;
  text-align: center;
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: -0.5px;
  text-transform: uppercase;
}

.ch-mobile-avatar {
  background: #E53935;
  border: 2px solid #E53935;
}

.ch-avatar-text-sm {
  font-size: 0.9rem;
  font-weight: 800;
  color: #fff;
}

/* Desktop Header */
.ch-header {
  align-items: center;
}

.ch-title {
  font-size: 2.2rem;
  font-weight: 900;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: -2px;
  margin: 0;
  line-height: 1;
}

.ch-subtitle {
  color: #666;
  font-size: 0.9rem;
  margin-top: 6px;
  font-weight: 400;
}

/* Cards */
.ch-card {
  background: rgba(20, 20, 20, 0.8) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.06) !important;
  border-radius: 16px !important;
  overflow: hidden;
}

.ch-sidebar-sticky {
  position: sticky;
  top: 90px;
}

/* User Card */
.ch-avatar {
  background: #E53935 !important;
  border: 3px solid #E53935;
  box-shadow: 0 0 30px rgba(229, 57, 53, 0.25);
}

.ch-avatar-text {
  font-size: 2.2rem;
  color: #fff;
  font-weight: 900;
  letter-spacing: -1px;
}

.ch-user-name {
  font-weight: 800;
  font-size: 1.1rem;
  color: #fff;
  letter-spacing: -0.3px;
}

.ch-user-email {
  font-size: 0.8rem;
  color: #888;
  margin-top: 2px;
}

.ch-mobile-user {
  background: linear-gradient(135deg, rgba(229, 57, 53, 0.1) 0%, rgba(20, 20, 20, 0.8) 100%) !important;
}

.ch-mobile-points {
  font-size: 0.8rem;
  color: #E53935;
  font-weight: 600;
  display: flex;
  align-items: center;
}

/* Navigation */
.ch-nav {
  background: transparent !important;
  padding: 8px !important;
}

.ch-nav-item {
  border-radius: 12px !important;
  margin: 4px 8px;
  min-height: 48px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.ch-nav-item:hover {
  background: rgba(255, 255, 255, 0.04) !important;
}

.ch-nav-active {
  background: rgba(229, 57, 53, 0.12) !important;
}

.ch-nav-active .ch-nav-text {
  color: #E53935 !important;
  font-weight: 700;
}

.ch-nav-text {
  font-size: 0.9rem;
  font-weight: 500;
  color: #aaa;
  letter-spacing: 0.2px;
}

.ch-badge {
  font-weight: 700;
  font-size: 0.65rem;
  height: 20px !important;
}

.ch-logout:hover {
  background: rgba(229, 57, 53, 0.08) !important;
}

.ch-divider {
  border-color: rgba(255, 255, 255, 0.06) !important;
}

/* Loyalty Card */
.ch-loyalty-card {
  background: linear-gradient(135deg, rgba(229, 57, 53, 0.08) 0%, rgba(20, 20, 20, 0.8) 100%) !important;
}

.ch-loyalty-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(229, 57, 53, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}

.ch-loyalty-title {
  font-weight: 700;
  font-size: 0.8rem;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.ch-loyalty-points {
  font-size: 2.2rem;
  font-weight: 900;
  color: #E53935;
  line-height: 1;
  margin-top: 4px;
}

.ch-loyalty-label {
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 2px;
}

.ch-loyalty-hint {
  font-size: 0.75rem;
  color: #555;
}

/* Bottom Navigation */
.ch-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(10, 10, 10, 0.95) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  height: 64px !important;
}

.ch-bottom-nav .v-btn {
  color: #666 !important;
  text-transform: none;
  letter-spacing: 0;
  font-size: 0.65rem;
  font-weight: 600;
}

.ch-bottom-nav .v-btn--active {
  color: #E53935 !important;
}

.ch-bottom-nav .v-icon {
  font-size: 22px;
}

.ch-bottom-badge {
  position: absolute;
  top: 4px;
  right: 4px;
}

/* Drawer */
.ch-drawer {
  background: #0a0a0a !important;
}

.ch-drawer-header {
  background: linear-gradient(135deg, rgba(229, 57, 53, 0.15) 0%, #0a0a0a 100%);
}

.ch-drawer-nav {
  background: transparent !important;
}

.ch-drawer-item {
  border-radius: 12px !important;
  margin: 2px 12px;
}

.ch-drawer-text {
  font-size: 0.95rem;
  font-weight: 500;
  color: #ccc;
}

.ch-text-red {
  color: #E53935 !important;
  font-weight: 700;
}

/* Dialogs */
.ch-dialog {
  border-radius: 20px !important;
  overflow: hidden;
}

.ch-tracking-card {
  border-radius: 20px !important;
}

.ch-dialog-title {
  color: #fff;
  font-weight: 800;
  font-size: 1.1rem;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.ch-tracking-number {
  font-size: 0.85rem;
  color: #888;
  font-weight: 600;
  letter-spacing: 1px;
}

.ch-tracking-event {
  padding-bottom: 8px;
}

.ch-tracking-status {
  font-weight: 700;
  color: #fff;
  font-size: 0.95rem;
}

.ch-tracking-meta {
  color: #666;
  font-size: 0.8rem;
  margin-top: 2px;
}

.ch-confirm-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 8px;
}

.ch-confirm-text {
  color: #888;
  font-size: 0.9rem;
}

.ch-btn {
  border-radius: 12px !important;
  text-transform: none;
  font-weight: 700;
  letter-spacing: 0;
  padding: 0 24px !important;
  height: 44px !important;
}

.ch-btn-text {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #0a0a0a;
}

::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #E53935;
}

/* Responsive */
@media (min-width: 960px) {
  .ch-account-wrapper {
    margin-top: 64px;
    padding-bottom: 0;
  }
}

@media (max-width: 959px) {
  .ch-account-wrapper {
    padding-bottom: 80px;
  }
}
</style>