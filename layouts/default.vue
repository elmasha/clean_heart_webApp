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
      <v-avatar
      color="primary"
      size="30"> 
      <v-img :src="logo"></v-img>
    </v-avatar>
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
             <v-avatar
      color="primary"
      size="30"> 
      <v-img :src="logo"></v-img>
    </v-avatar>
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
          v-for="(item, index) in cartItems"
          :key="getCartItemKey(item, index)"
          class="d-flex align-start mb-4 pb-4"
          style="gap: 16px; border-bottom: 1px solid #f0f0f0;"
        >
          <!-- Product Image -->
          <v-img
            :src="getProductImage(item)"
            width="80"
            height="100"
            contain
            style="background: #f5f5f5; flex-shrink: 0;"
          />
          
          <div class="flex-grow-1" style="min-width: 0;">
            <!-- Product Name -->
            <div style="font-weight: 600; font-size: 0.85rem; color: #000; line-height: 1.2;">
              {{ getProductName(item) }}
            </div>
            
            <!-- Variant Details -->
            <div class="grey--text text--darken-1" style="font-size: 0.75rem; margin-top: 2px;">
              {{ getVariantDisplay(item) }}
            </div>
            
            <!-- Price -->
            <div style="font-weight: 700; font-size: 0.9rem; color: #000; margin-top: 4px;">
              Ksh {{ formatPrice(getUnitPrice(item)) }}
            </div>
            
            <!-- Quantity Controls -->
            <div class="d-flex align-center mt-2">
              <v-btn 
                icon 
                x-small 
                @click="updateQty(item, -1)"
                style="border: 1px solid #e0e0e0; border-radius: 0;"
              >
                <v-icon size="14">mdi-minus</v-icon>
              </v-btn>
              <span class="mx-3" style="font-size: 0.85rem; font-weight: 600; min-width: 24px; text-align: center;">
                {{ getQuantity(item) }}
              </span>
              <v-btn 
                icon 
                x-small 
                @click="updateQty(item, 1)"
                style="border: 1px solid #e0e0e0; border-radius: 0;"
              >
                <v-icon size="14">mdi-plus</v-icon>
              </v-btn>
            </div>
          </div>
          
          <!-- Item Total & Remove -->
          <div class="d-flex flex-column align-end" style="flex-shrink: 0;">
            <span style="font-weight: 700; font-size: 0.95rem; color: #000;">
              Ksh {{ formatPrice(getItemTotal(item)) }}
            </span>
            <v-btn 
              icon 
              x-small 
              class="mt-2" 
              @click="removeItem(item)"
              style="color: #999;"
            >
              <v-icon size="16">mdi-close</v-icon>
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
          <span style="font-weight: 700; font-size: 1rem;">Ksh {{ formatPrice(cartTotal) }}</span>
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
                <v-avatar
                      color="primary"
                      size="20"> 
                      <v-img :src="logo"></v-img>
                    </v-avatar>


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
        <!-- ✅ Added Designed by Elmasha Omondi -->
        <div class="text-center mt-4">
          <span style="font-size: 0.7rem; color: rgba(255,255,255,0.2); letter-spacing: 1px;">
            Designed by <span style="color: rgba(255,255,255,0.4);">Elmasha Omondi</span>
          </span>
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
import logo from '@/assets/logo.jpg'

export default {
  name: 'DefaultLayout',
  data() {
    return {
      logo,
      drawer: false,
      cartDrawer: false,
      snackbar: { show: false, message: '', color: 'black' },
      isMobile: false,
      windowWidth: 0,
      navLinks: [
        { title: 'Home', to: '/' },        // ✅ Added Home link
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
      authUser: state => state.authUser,
    }),
    ...mapGetters(['getCartCount', 'getCartTotal']),
    cartCount() {
      return this.getCartCount
    },
    cartTotal() {
      return this.getCartTotal
    },
    firebaseUid() {
      return this.authUser?.uid || null
    }
  },
  watch: {
    firebaseUid: {
      immediate: true,
      handler(uid) {
        if (uid) {
          console.log('Layout - Fetching cart for uid:', uid)
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
    
    // If user is already logged in, fetch cart
    if (this.firebaseUid) {
      console.log('Layout mounted - Fetching cart for:', this.firebaseUid)
      this.$store.dispatch('fetchCart', this.firebaseUid)
    }
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

    /**
     * Format price to 2 decimal places
     */
    formatPrice(value) {
      const num = parseFloat(value)
      if (isNaN(num)) return '0.00'
      return num.toFixed(2)
    },

    /**
     * Get product name from cart item
     */
    getProductName(item) {
      if (item.product?.name) return item.product.name
      if (item.product_name) return item.product_name
      if (item.name) return item.name
      return 'Product'
    },

    /**
     * Get product image from cart item
     */
    getProductImage(item) {
      if (item.product?.image) return item.product.image
      if (item.image_url) return item.image_url
      if (item.variant?.imageUrl) return item.variant.imageUrl
      return '/placeholder-product.jpg'
    },

    /**
     * Get unit price from cart item
     */
    getUnitPrice(item) {
      const price = item.variant?.unitPrice || item.price || item.unit_price || 0
      return parseFloat(price) || 0
    },

    /**
     * Get quantity from cart item
     */
    getQuantity(item) {
      return parseInt(item.quantity || item.qty || 0) || 0
    },

    /**
     * Get item total
     */
    getItemTotal(item) {
      return this.getUnitPrice(item) * this.getQuantity(item)
    },

    /**
     * Get variant display text
     */
    getVariantDisplay(item) {
      // If item has a direct variant string
      if (item.variant && typeof item.variant === 'string') {
        return item.variant
      }
      
      // If item has variant object
      if (item.variant) {
        const parts = []
        if (item.variant.color) parts.push(item.variant.color)
        if (item.variant.size) parts.push(item.variant.size)
        if (parts.length > 0) return parts.join(' / ')
      }
      
      // If item has separate fields
      if (item.color && item.size) {
        return `${item.color} / ${item.size}`
      }
      if (item.color) return item.color
      if (item.size) return `Size ${item.size}`
      if (item.variant_name) return item.variant_name
      
      return 'Standard'
    },

    /**
     * Generate unique key for cart items
     */
    getCartItemKey(item, index) {
      if (item.cartItemId) return `cart-${item.cartItemId}`
      if (item.variantId) return `cart-${item.variantId}`
      if (item.variant?.id) return `cart-${item.variant.id}`
      
      const productId = item.product?.id || item.product_id || 'unknown'
      const variant = item.variant?.size || item.size || item.variant?.color || item.color || 'default'
      return `cart-${productId}-${variant}`
    },

    async updateQty(item, delta) {
      const currentQty = this.getQuantity(item)
      const newQty = currentQty + delta
      
      if (newQty < 1) {
        await this.removeItem(item)
        return
      }
      
      // Use variantId if available
      const variantId = item.variantId || item.variant?.id || item.variant_id
      
      if (!variantId) {
        this.snackbar = { show: true, message: 'Cannot update item', color: 'error' }
        return
      }
      
      const result = await this.$store.dispatch('updateCartQty', {
        firebaseUid: this.firebaseUid,
        variantId: variantId,
        qty: newQty
      })
      
      if (!result.success) {
        this.snackbar = { show: true, message: 'Failed to update quantity', color: 'error' }
      }
    },

    async removeItem(item) {
      const variantId = item.variantId || item.variant?.id || item.variant_id
      
      if (!variantId) {
        this.snackbar = { show: true, message: 'Cannot remove item', color: 'error' }
        return
      }
      
      const result = await this.$store.dispatch('removeFromCart', {
        firebaseUid: this.firebaseUid,
        variantId: variantId
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