<template>
  <div style="margin-top: 64px; min-height: calc(100vh - 64px); background: #fafafa;">
    <v-container class="py-8">
      <div class="d-flex align-center justify-space-between mb-6">
        <h1 style="font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 900; color: #000; text-transform: uppercase; letter-spacing: -1px;">
          My Wishlist
        </h1>
        <div v-if="wishlistItems.length > 0" style="font-size: 0.85rem; color: #666;">
          {{ wishlistItems.length }} item(s)
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="d-flex justify-center py-12">
        <v-progress-circular indeterminate color="#E53935" size="48" />
      </div>

      <!-- Not Logged In -->
      <div v-else-if="!firebaseUid" class="text-center py-12">
        <v-icon size="64" color="grey lighten-1">mdi-heart-remove</v-icon>
        <h3 class="mt-4" style="font-size: 1.2rem; font-weight: 600;">Please Log In</h3>
        <p class="grey--text mt-2">Log in to view and manage your wishlist</p>
        <v-btn color="black" dark class="mt-4" style="border-radius: 0; text-transform: uppercase;" to="/login">
          Log In
        </v-btn>
      </div>

      <!-- Empty Wishlist -->
      <div v-else-if="wishlistItems.length === 0" class="text-center py-12">
        <v-icon size="64" color="grey lighten-1">mdi-heart-remove</v-icon>
        <h3 class="mt-4" style="font-size: 1.2rem; font-weight: 600;">Your wishlist is empty</h3>
        <p class="grey--text mt-2">Start adding your favorite products to your wishlist</p>
        <v-btn color="black" dark class="mt-4" style="border-radius: 0; text-transform: uppercase;" to="/shop">
          Start Shopping
        </v-btn>
      </div>

      <!-- Wishlist Items -->
      <v-row v-else>
        <v-col
          v-for="item in wishlistItems"
          :key="item.id"
          cols="6"
          sm="4"
          md="3"
          class="mb-6"
        >
          <div class="wishlist-card" style="position: relative; background: #fff; border: 1px solid #f0f0f0; padding: 16px; transition: all 0.3s ease;">
            <!-- Remove Button -->
            <v-btn
              icon
              small
              class="remove-btn"
              style="position: absolute; top: 8px; right: 8px; z-index: 2; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
              @click="removeFromWishlist(item.id)"
            >
              <v-icon size="18" color="#E53935">mdi-close</v-icon>
            </v-btn>

            <nuxt-link :to="`/product/${item.id}`" style="text-decoration: none;">
              <div style="cursor: pointer;">
                <!-- Product Image -->
                <div class="d-flex align-center justify-center mb-3" style="background: #f5f5f5; aspect-ratio: 3/4; position: relative; overflow: hidden;">
                  <v-img
                    :src="item.image_url || item.thumbnail || '/placeholder-product.jpg'"
                    aspect-ratio="3/4"
                    contain
                    style="width: 100%; height: 100%;"
                  >
                    <template #placeholder>
                      <div class="d-flex align-center justify-center fill-height">
                        <v-icon size="48" color="grey lighten-1">mdi-tshirt-crew-outline</v-icon>
                      </div>
                    </template>
                  </v-img>
                  
                  <!-- Wishlist Heart Badge -->
                  <div style="position: absolute; top: 8px; left: 8px;">
                    <v-icon color="#E53935" size="20">mdi-heart</v-icon>
                  </div>
                </div>

                <!-- Product Info -->
                <div>
                  <div style="font-size: 0.8rem; font-weight: 600; color: #000; margin-bottom: 4px; line-height: 1.2;">
                    {{ item.name }}
                  </div>
                  <div style="font-size: 0.85rem; font-weight: 700; color: #E53935;">
                    Ksh {{ formatPrice(item.base_price || item.price) }}
                  </div>
                  <div v-if="item.compare_price" style="font-size: 0.7rem; color: #999; text-decoration: line-through;">
                    Ksh {{ formatPrice(item.compare_price) }}
                  </div>
                  <div style="font-size: 0.7rem; color: #999; margin-top: 4px;">
                    Added {{ timeAgo(item.created_at) }}
                  </div>
                </div>
              </div>
            </nuxt-link>

            <!-- Add to Cart Button -->
            <v-btn
              block
              color="black"
              dark
              height="36"
              class="mt-3"
              style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.65rem; font-weight: 600;"
              :loading="addingToCart === item.id"
              @click="addToCart(item)"
            >
              <v-icon left size="16">mdi-shopping-outline</v-icon>
              Add to Cart
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'WishlistPage',
  middleware: 'auth',
  data() {
    return {
      wishlistItems: [],
      loading: false,
      addingToCart: null,
    }
  },
  computed: {
    ...mapState({
      authUser: state => state.authUser,
    }),
    firebaseUid() {
      return this.authUser?.uid || null
    }
  },
  async mounted() {
    if (this.firebaseUid) {
      await this.fetchWishlist()
    }
  },
  watch: {
    firebaseUid: {
      immediate: true,
      handler(newUid) {
        if (newUid) {
          this.fetchWishlist()
        }
      }
    }
  },
  methods: {
    formatPrice(value) {
      const num = parseFloat(value)
      if (isNaN(num)) return '0.00'
      return num.toFixed(2)
    },

    timeAgo(dateString) {
      if (!dateString) return 'Recently'
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 1) return 'Just now'
      if (diffMins < 60) return `${diffMins}m ago`
      if (diffHours < 24) return `${diffHours}h ago`
      if (diffDays < 7) return `${diffDays}d ago`
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    },

    async fetchWishlist() {
      if (!this.firebaseUid) return

      this.loading = true
      try {
        const { data } = await this.$axios.get('/api/wishlist', {
          params: { firebaseUid: this.firebaseUid },
          withCredentials: false
        })
        
        if (data.success) {
          this.wishlistItems = data.data || []
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error)
        this.$nuxt.$emit('show-snackbar', {
          message: 'Failed to load wishlist',
          color: 'error'
        })
      } finally {
        this.loading = false
      }
    },

    async addToCart(item) {
      if (!this.firebaseUid) {
        this.$router.push('/login?redirect=/wishlist')
        return
      }

      this.addingToCart = item.id
      try {
        // Get product with variants
        const { data: productData } = await this.$axios.get(`/api/products/${item.id}`)
        const product = productData.data || productData
        
        // Find first available variant
        let variantId = null
        let variantDisplay = 'Standard'
        
        if (product.variants && product.variants.all && product.variants.all.length > 0) {
          const firstVariant = product.variants.all[0]
          variantId = firstVariant.id
          variantDisplay = `${firstVariant.color || ''} / ${firstVariant.size || ''}`.trim() || 'Standard'
        }

        if (!variantId) {
          this.$nuxt.$emit('show-snackbar', {
            message: 'No variant available for this product',
            color: 'error'
          })
          this.addingToCart = null
          return
        }

        const result = await this.$store.dispatch('addToCart', {
          firebaseUid: this.firebaseUid,
          productId: item.id,
          qty: 1,
          variant: variantDisplay,
          variantId: variantId
        })

        if (result.success) {
          this.$nuxt.$emit('show-snackbar', {
            message: `${item.name} added to cart!`,
            color: 'black'
          })
        } else {
          this.$nuxt.$emit('show-snackbar', {
            message: result.error || 'Failed to add to cart',
            color: 'error'
          })
        }
      } catch (error) {
        console.error('Add to cart error:', error)
        this.$nuxt.$emit('show-snackbar', {
          message: 'Failed to add to cart',
          color: 'error'
        })
      } finally {
        this.addingToCart = null
      }
    },

    async removeFromWishlist(productId) {
      if (!this.firebaseUid) return

      try {
        const { data } = await this.$axios.delete(`/api/wishlist/${productId}`, {
          params: { firebaseUid: this.firebaseUid },
          withCredentials: false
        })

        if (data.success) {
          this.wishlistItems = this.wishlistItems.filter(item => item.id !== productId)
          this.$nuxt.$emit('show-snackbar', {
            message: 'Removed from wishlist',
            color: '#E53935'
          })
        }
      } catch (error) {
        console.error('Remove from wishlist error:', error)
        this.$nuxt.$emit('show-snackbar', {
          message: 'Failed to remove from wishlist',
          color: 'error'
        })
      }
    }
  },
  head() {
    return { title: 'My Wishlist | Clean Heart' }
  }
}
</script>

<style scoped>
.wishlist-card {
  background: #fff;
  padding: 16px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.wishlist-card:hover {
  border-color: #E53935;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.remove-btn {
  transition: all 0.3s ease;
}

.remove-btn:hover {
  transform: scale(1.1);
  background: #fff !important;
}
</style>