<template>
  <v-app style="background: #ffffff;">
    <!-- NAVIGATION BAR -->
    <v-app-bar
      app
      flat
      color="white"
      height="64"
      style="border-bottom: 1px solid #f0f0f0; z-index: 100;"
    >
      <v-app-bar-nav-icon
        v-show="isMobile"
        @click="drawer = true"
        color="black"
      />

      <!-- Desktop Logo (hidden on mobile) -->
      <v-toolbar-title class="ml-2" v-show="!isMobile">
        <nuxt-link to="/" style="text-decoration: none;">
          <div class="d-flex align-center">
            <div
              class="d-flex align-center justify-center mr-2"
              style="width: 32px; height: 32px; border-radius: 50%; background: #000;"
            >
              <v-icon color="#E53935" size="18">mdi-heart</v-icon>
            </div>
            <span
              style="font-size: 1.1rem; font-weight: 900; letter-spacing: 3px; color: #000; text-transform: uppercase;"
            >
              CLEAN HEART
            </span>
          </div>
        </nuxt-link>
      </v-toolbar-title>

      <!-- Mobile Logo (only icon, hidden on desktop) -->
      <v-toolbar-title class="ml-2" v-show="isMobile">
        <nuxt-link to="/" style="text-decoration: none;">
          <div
            class="d-flex align-center justify-center"
            style="width: 32px; height: 32px; border-radius: 50%; background: #000;"
          >
            <v-icon color="#E53935" size="18">mdi-heart</v-icon>
          </div>
        </nuxt-link>
      </v-toolbar-title>

      <v-spacer />

      <!-- Desktop Navigation Links - HIDDEN ON MOBILE -->
      <div
        v-if="!isMobile"
        class="d-flex align-center"
        style="gap: 40px;"
      >
        <nuxt-link
          v-for="link in navLinks"
          :key="link.title"
          :to="link.to"
          class="nav-link"
          style="text-decoration: none; color: #000; font-size: 0.75rem; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; position: relative;"
        >
          {{ link.title }}
        </nuxt-link>
      </div>

      <v-spacer v-show="!isMobile" />

      <!-- Action Icons - Always visible -->
      <v-btn icon small class="mr-1" to="/search">
        <v-icon color="black" size="20">mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon small class="mr-1" to="/wishlist">
        <v-icon color="black" size="20">mdi-heart-outline</v-icon>
      </v-btn>

      <v-btn icon small class="mr-1" to="/account">
        <v-icon color="black" size="20">mdi-account-outline</v-icon>
      </v-btn>

      <v-btn icon class="cart-btn mr-2" @click="cartDrawer = !cartDrawer">
        <v-badge
          v-if="cartCount > 0"
          :content="cartCount"
          color="#E53935"
          overlap
          offset-x="6"
          offset-y="6"
        >
          <v-icon color="black" size="20">mdi-shopping-outline</v-icon>
        </v-badge>
        <v-icon v-else color="black" size="20">mdi-shopping-outline</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- MOBILE DRAWER - Shows all navigation links on mobile -->
    <v-navigation-drawer v-model="drawer" temporary fixed width="280">
      <div class="pa-6">
        <div class="d-flex align-center">
          <div
            class="d-flex align-center justify-center mr-2"
            style="width: 32px; height: 32px; border-radius: 50%; background: #000;"
          >
            <v-icon color="#E53935" size="18">mdi-heart</v-icon>
          </div>
          <span
            style="font-size: 1.1rem; font-weight: 900; letter-spacing: 3px; color: #000; text-transform: uppercase;"
          >
            CLEAN HEART
          </span>
        </div>
      </div>
      <v-divider />
      <v-list dense class="pt-4">
        <!-- All navigation links appear in the mobile drawer -->
        <v-list-item
          v-for="link in navLinks"
          :key="link.title"
          :to="link.to"
          @click="drawer = false"
          class="px-6"
        >
          <v-list-item-title
            style="font-weight: 600; letter-spacing: 1px; text-transform: uppercase; font-size: 0.8rem;"
          >
            {{ link.title }}
          </v-list-item-title>
        </v-list-item>
        <v-divider class="my-2" />
        <v-list-item to="/account" @click="drawer = false" class="px-6">
          <v-list-item-title style="font-weight: 600; font-size: 0.8rem;">
            <v-icon left size="18">mdi-account-outline</v-icon> My Account
          </v-list-item-title>
        </v-list-item>
        <v-list-item to="/orders" @click="drawer = false" class="px-6">
          <v-list-item-title style="font-weight: 600; font-size: 0.8rem;">
            <v-icon left size="18">mdi-package-variant</v-icon> My Orders
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- CART DRAWER -->
    <v-navigation-drawer
      v-model="cartDrawer"
      right
      temporary
      fixed
      width="400"
    >
      <div class="d-flex align-center justify-space-between pa-6">
        <span
          style="font-size: 1rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;"
        >
          Your Cart ({{ cartCount }})
        </span>
        <v-btn icon @click="cartDrawer = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <v-divider />

      <div
        v-if="cartItems.length === 0"
        class="d-flex flex-column align-center justify-center"
        style="height: 60%;"
      >
        <v-icon size="64" color="grey lighten-1">mdi-shopping-outline</v-icon>
        <p class="mt-4 grey--text text--darken-1">Your cart is empty</p>
        <v-btn
          color="black"
          dark
          class="mt-4"
          style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.75rem;"
          @click="cartDrawer = false"
        >
          Continue Shopping
        </v-btn>
      </div>

      <div v-else class="pa-4" style="height: calc(100% - 180px); overflow-y: auto;">
        <div
          v-for="item in cartItems"
          :key="`${item.product_id}-${item.variant}`"
          class="d-flex align-start mb-4 pb-4"
          style="gap: 16px; border-bottom: 1px solid #f0f0f0;"
        >
          <v-img
            :src="item.image_url || '/placeholder-product.jpg'"
            width="80"
            height="100"
            contain
            style="background: #f5f5f5;"
          />
          <div class="flex-grow-1">
            <div style="font-weight: 600; font-size: 0.85rem;">{{ item.name }}</div>
            <div class="grey--text text--darken-1" style="font-size: 0.75rem;">
              {{ item.variant }}
            </div>
            <div class="d-flex align-center mt-2">
              <v-btn icon x-small @click="updateQty(item, -1)">
                <v-icon size="14">mdi-minus</v-icon>
              </v-btn>
              <span class="mx-2" style="font-size: 0.8rem; font-weight: 600;">{{ item.qty }}</span>
              <v-btn icon x-small @click="updateQty(item, 1)">
                <v-icon size="14">mdi-plus</v-icon>
              </v-btn>
            </div>
          </div>
          <div class="d-flex flex-column align-end">
            <span style="font-weight: 700; font-size: 0.9rem;">${{ (item.price * item.qty).toFixed(2) }}</span>
            <v-btn icon x-small class="mt-2" @click="removeItem(item)">
              <v-icon size="14" color="grey">mdi-delete-outline</v-icon>
            </v-btn>
          </div>
        </div>
      </div>

      <div
        v-if="cartItems.length > 0"
        style="position: absolute; bottom: 0; left: 0; right: 0; background: white; border-top: 1px solid #f0f0f0; padding: 20px;"
      >
        <div class="d-flex justify-space-between mb-3">
          <span style="font-weight: 600; font-size: 0.9rem;">Subtotal</span>
          <span style="font-weight: 700; font-size: 1rem;">${{ cartTotal.toFixed(2) }}</span>
        </div>
        <div class="d-flex justify-space-between mb-4">
          <span style="font-size: 0.8rem; color: #666;">Shipping calculated at checkout</span>
        </div>
        <v-btn
          block
          color="black"
          dark
          height="52"
          style="border-radius: 0; text-transform: uppercase; letter-spacing: 2px; font-size: 0.75rem; font-weight: 600;"
          @click="goToCheckout"
        >
          Checkout
        </v-btn>
        <v-btn
          block
          text
          class="mt-2"
          style="text-transform: uppercase; letter-spacing: 1px; font-size: 0.7rem;"
          @click="cartDrawer = false"
        >
          Continue Shopping
        </v-btn>
      </div>
    </v-navigation-drawer>

    <!-- MAIN CONTENT -->
    <v-main>
      <Nuxt />
    </v-main>

    <!-- FOOTER -->
    <footer style="background: #0a0a0a; padding: 60px 0 30px; border-top: 1px solid #1a1a1a;">
      <v-container>
        <v-row>
          <v-col cols="12" md="3" class="mb-6">
            <div class="d-flex align-center mb-4">
              <div
                class="d-flex align-center justify-center mr-3"
                style="width: 36px; height: 36px; border-radius: 50%; background: #fff;"
              >
                <v-icon color="#E53935" size="20">mdi-heart</v-icon>
              </div>
              <span
                style="font-size: 1rem; font-weight: 900; letter-spacing: 2px; color: #fff; text-transform: uppercase;"
              >
                CLEAN HEART
              </span>
            </div>
            <p style="font-size: 0.8rem; color: rgba(255,255,255,0.4); line-height: 1.7;">
              Premium streetwear merchandise. Wear your heart on your sleeve.
            </p>
          </v-col>
          <v-col cols="6" md="2" class="mb-6">
            <div style="font-size: 0.7rem; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #fff; margin-bottom: 20px;">
              Shop
            </div>
            <nuxt-link
              v-for="cat in categories"
              :key="cat"
              :to="`/shop?category=${cat.toLowerCase()}`"
              class="d-block mb-3"
              style="font-size: 0.8rem; color: rgba(255,255,255,0.4); text-decoration: none;"
            >
              {{ cat }}
            </nuxt-link>
          </v-col>
          <v-col cols="6" md="2" class="mb-6">
            <div style="font-size: 0.7rem; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #fff; margin-bottom: 20px;">
              Company
            </div>
            <nuxt-link
              v-for="link in companyLinks"
              :key="link.title"
              :to="link.to"
              class="d-block mb-3"
              style="font-size: 0.8rem; color: rgba(255,255,255,0.4); text-decoration: none;"
            >
              {{ link.title }}
            </nuxt-link>
          </v-col>
          <v-col cols="6" md="2" class="mb-6">
            <div style="font-size: 0.7rem; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #fff; margin-bottom: 20px;">
              Support
            </div>
            <nuxt-link
              v-for="link in supportLinks"
              :key="link.title"
              :to="link.to"
              class="d-block mb-3"
              style="font-size: 0.8rem; color: rgba(255,255,255,0.4); text-decoration: none;"
            >
              {{ link.title }}
            </nuxt-link>
          </v-col>
          <v-col cols="6" md="3" class="mb-6">
            <div style="font-size: 0.7rem; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #fff; margin-bottom: 20px;">
              Follow Us
            </div>
            <div class="d-flex" style="gap: 12px;">
              <v-btn icon small color="rgba(255,255,255,0.4)" href="https://instagram.com" target="_blank">
                <v-icon size="18">mdi-instagram</v-icon>
              </v-btn>
              <v-btn icon small color="rgba(255,255,255,0.4)" href="https://twitter.com" target="_blank">
                <v-icon size="18">mdi-twitter</v-icon>
              </v-btn>
              <v-btn icon small color="rgba(255,255,255,0.4)" href="https://facebook.com" target="_blank">
                <v-icon size="18">mdi-facebook</v-icon>
              </v-btn>
              <v-btn icon small color="rgba(255,255,255,0.4)" href="https://youtube.com" target="_blank">
                <v-icon size="18">mdi-youtube</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <v-divider dark class="my-6" style="border-color: #1a1a1a;" />
        <div class="d-flex flex-wrap justify-space-between align-center">
          <span style="font-size: 0.75rem; color: rgba(255,255,255,0.3);">
            &copy; 2025 Clean Heart. All rights reserved.
          </span>
          <div class="d-flex" style="gap: 24px;">
            <nuxt-link to="/privacy" style="font-size: 0.75rem; color: rgba(255,255,255,0.3); text-decoration: none;">Privacy Policy</nuxt-link>
            <nuxt-link to="/terms" style="font-size: 0.75rem; color: rgba(255,255,255,0.3); text-decoration: none;">Terms of Service</nuxt-link>
          </div>
        </div>
      </v-container>
    </footer>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" top>
      {{ snackbar.message }}
      <template #action>
        <v-btn text @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'DefaultLayout',
  data() {
    return {
      drawer: false,
      cartDrawer: false,
      snackbar: { show: false, message: '', color: 'black' },
      isMobile: false,
      windowWidth: 0,
      navLinks: [
        { title: 'Shop', to: '/shop' },
        { title: 'New', to: '/new' },
        { title: 'Best Sellers', to: '/best-sellers' },
        { title: 'About', to: '/about' },
      ],
      categories: ['Hoodies', 'Sweatshirts', 'T-Shirts', 'Crop Tops'],
      companyLinks: [
        { title: 'About Us', to: '/about' },
        { title: 'Careers', to: '/careers' },
        { title: 'Press', to: '/press' },
        { title: 'Contact', to: '/contact' },
      ],
      supportLinks: [
        { title: 'FAQ', to: '/faq' },
        { title: 'Shipping', to: '/shipping' },
        { title: 'Returns', to: '/returns' },
        { title: 'Size Guide', to: '/size-guide' },
      ],
    }
  },
  computed: {
    ...mapState({
      cartItems: state => state.cart,
    }),
    ...mapGetters(['getCartCount', 'getCartTotal']),
    cartCount() {
      return this.getCartCount
    },
    cartTotal() {
      return this.getCartTotal
    },
    firebaseUid() {
      return this.$store.state.authUser?.uid || null
    }
  },
  watch: {
    firebaseUid: {
      immediate: true,
      handler(uid) {
        if (uid) {
          this.$store.dispatch('fetchCart', uid)
        }
      }
    }
  },
  mounted() {
    // Initialize screen size detection
    this.checkScreenSize()
    window.addEventListener('resize', this.checkScreenSize)

    // Snackbar event listener
    this.$nuxt.$on('show-snackbar', ({ message, color }) => {
      this.snackbar = { show: true, message, color }
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkScreenSize)
    this.$nuxt.$off('show-snackbar')
  },
  methods: {
    /**
     * Check screen size and update isMobile state
     * Mobile breakpoint: width < 760px (sm breakpoint in Vuetify)
     */
    checkScreenSize() {
      if (process.client) {
        this.windowWidth = window.innerWidth
        this.isMobile = this.windowWidth < 760
      }
    },

    async updateQty(item, delta) {
      const newQty = item.qty + delta
      if (newQty < 1) {
        await this.removeItem(item)
        return
      }
      const result = await this.$store.dispatch('updateCartQty', {
        firebaseUid: this.firebaseUid,
        productId: item.product_id,
        variant: item.variant,
        qty: newQty
      })
      if (!result.success) {
        this.snackbar = { show: true, message: 'Failed to update quantity', color: 'error' }
      }
    },

    async removeItem(item) {
      const result = await this.$store.dispatch('removeFromCart', {
        firebaseUid: this.firebaseUid,
        productId: item.product_id,
        variant: item.variant
      })
      if (result.success) {
        this.snackbar = { show: true, message: 'Item removed from cart', color: 'black' }
      }
    },

    goToCheckout() {
      this.cartDrawer = false
      this.$router.push('/checkout')
    }
  }
}
</script>

<style scoped>
.nav-link {
  position: relative;
  transition: color 0.3s;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: #E53935;
  transition: width 0.3s;
}
.nav-link:hover::after {
  width: 100%;
}
.nav-link:hover {
  color: #E53935 !important;
}
.nav-link.nuxt-link-exact-active {
  color: #E53935 !important;
}
.nav-link.nuxt-link-exact-active::after {
  width: 100%;
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #f1f1f1; }
::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #999; }
</style>