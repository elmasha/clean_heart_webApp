<template>
  <div style="margin-top: 64px;">
    <!-- Page Header -->
    <section style="background: #000; padding: 80px 0;">
      <v-container>
        <div class="text-center">
          <div style="font-size: 0.75rem; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: #E53935; margin-bottom: 16px;">
            Just Dropped
          </div>
          <h1 style="font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 900; color: #fff; text-transform: uppercase; letter-spacing: -2px; margin-bottom: 16px;">
            New Arrivals
          </h1>
          <p style="font-size: 0.9rem; color: rgba(255,255,255,0.5); max-width: 500px; margin: 0 auto;">
            The latest drops from Clean Heart. Limited quantities — grab them before they're gone.
          </p>
        </div>
      </v-container>
    </section>

    <!-- Products -->
    <section style="padding: 60px 0;">
      <v-container>
        <!-- Loading -->
        <div v-if="loading" class="d-flex justify-center py-12">
          <v-progress-circular indeterminate color="#E53935" size="48" />
        </div>

        <!-- No Results -->
        <div v-else-if="newProducts.length === 0" class="text-center py-12">
          <v-icon size="64" color="grey lighten-1">mdi-clock-outline</v-icon>
          <h3 class="mt-4" style="font-size: 1.2rem; font-weight: 600;">No new arrivals yet</h3>
          <p class="grey--text mt-2">Check back soon for fresh drops</p>
          <v-btn color="black" dark class="mt-4" style="border-radius: 0; text-transform: uppercase;" to="/shop">
            Browse All Products
          </v-btn>
        </div>

        <!-- Product Grid -->
        <v-row v-else>
          <v-col
            v-for="product in newProducts"
            :key="product.id"
            cols="6"
            md="3"
            class="mb-8"
          >
            <nuxt-link :to="`/product/${product.id}`" style="text-decoration: none;">
              <div class="product-card" style="cursor: pointer; position: relative;">
                <div
                  class="d-flex align-center justify-center"
                  style="position: absolute; top: 10px; left: 10px; z-index: 2; background: #E53935; color: white; font-size: 0.6rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 3px 8px;"
                >
                  NEW
                </div>

                <div class="d-flex align-center justify-center mb-3" style="background: #f5f5f5; aspect-ratio: 3/4; position: relative; overflow: hidden;">
                  <v-img
                    :src="product.image_url || product.image || '/placeholder-product.jpg'"
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
                  <div class="product-overlay d-flex align-center justify-center" style="position: absolute; inset: 0; background: rgba(0,0,0,0.4); opacity: 0; transition: opacity 0.3s;">
                    <v-btn color="black" dark height="40" class="px-5" style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.65rem; font-weight: 600;" @click.prevent="quickAdd(product)">
                      Quick Add
                    </v-btn>
                  </div>
                </div>

                <div>
                  <div style="font-size: 0.75rem; font-weight: 600; color: #000; margin-bottom: 3px;">
                    {{ product.name }}
                  </div>
                  <div class="d-flex align-center justify-space-between">
                    <span style="font-size: 0.8rem; font-weight: 700; color: #E53935;">
                      Ksh {{ parseFloat(product.price || product.base_price || 0).toFixed(2) }}
                    </span>
                    <span v-if="product.created_at" style="font-size: 0.65rem; color: #999; font-weight: 500;">
                      {{ daysSince(product.created_at) }} days ago
                    </span>
                  </div>
                </div>
              </div>
            </nuxt-link>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Newsletter CTA -->
    <section style="background: #f8f8f8; padding: 60px 0;">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="8" class="text-center">
            <v-icon color="#E53935" size="40" class="mb-4">mdi-bell-ring-outline</v-icon>
            <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 12px;">Never Miss a Drop</h3>
            <p style="font-size: 0.85rem; color: #666; margin-bottom: 24px;">
              Subscribe to get notified when new items arrive. Be the first to cop the latest.
            </p>
            <div class="d-flex justify-center flex-wrap" style="gap: 0; max-width: 450px; margin: 0 auto;">
              <v-text-field
                v-model="email"
                placeholder="Your email"
                outlined
                hide-details
                height="48"
                class="flex-grow-1"
                style="border-radius: 0;"
              />
              <v-btn
                color="black"
                dark
                height="48"
                class="px-6"
                style="border-radius: 0; text-transform: uppercase; letter-spacing: 2px; font-size: 0.7rem; font-weight: 600;"
                @click="subscribe"
              >
                Notify Me
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'NewArrivalsPage',
  data() {
    return {
      email: ''
    }
  },
  computed: {
    ...mapState({
      loading: state => state.loading,
      products: state => state.products,
    }),
    ...mapGetters(['getNewArrivals']),
    newProducts() {
      // ✅ Try getter first
      const fromGetter = this.getNewArrivals
      if (fromGetter && fromGetter.length > 0) {
        return fromGetter
      }
      
      // ✅ Fallback: Manual filter
      return this.products
        .filter(p => p.is_new === true || p.is_new === 1)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 8)
    },
    firebaseUid() {
      return this.$store.state.authUser?.uid || null
    }
  },
  async fetch({ store }) {
    await store.dispatch('fetchProducts')
  },
  methods: {
    daysSince(dateString) {
      if (!dateString) return 0
      const date = new Date(dateString)
      const now = new Date()
      const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24))
      return diff
    },
    async quickAdd(product) {
      if (!this.firebaseUid) {
        this.$router.push('/login?redirect=/new')
        return
      }
      
      try {
        // ✅ Get the full product with variants
        const result = await this.$store.dispatch('fetchProduct', product.id)
        const fullProduct = result || product
        
        let variantId = null
        let variantDisplay = 'Standard'
        
        if (fullProduct.variants && fullProduct.variants.all && fullProduct.variants.all.length > 0) {
          const firstVariant = fullProduct.variants.all[0]
          variantId = firstVariant.id
          variantDisplay = `${firstVariant.color || ''} / ${firstVariant.size || ''}`.trim() || 'Standard'
        }

        if (!variantId) {
          this.$nuxt.$emit('show-snackbar', { 
            message: 'No variant available', 
            color: 'error' 
          })
          return
        }

        const cartResult = await this.$store.dispatch('addToCart', {
          firebaseUid: this.firebaseUid,
          productId: product.id,
          qty: 1,
          variant: variantDisplay,
          variantId: variantId
        })
        
        if (cartResult.success) {
          this.$nuxt.$emit('show-snackbar', { 
            message: `${product.name} added to cart!`, 
            color: 'black' 
          })
        } else {
          this.$nuxt.$emit('show-snackbar', { 
            message: cartResult.error || 'Failed to add to cart', 
            color: 'error' 
          })
        }
      } catch (error) {
        console.error('Quick add error:', error)
        this.$nuxt.$emit('show-snackbar', { 
          message: 'Something went wrong', 
          color: 'error' 
        })
      }
    },
    subscribe() {
      if (!this.email) {
        this.$nuxt.$emit('show-snackbar', { 
          message: 'Please enter your email', 
          color: 'error' 
        })
        return
      }
      this.$nuxt.$emit('show-snackbar', { 
        message: "You'll be notified of new drops!", 
        color: '#E53935' 
      })
      this.email = ''
    }
  },
  head() {
    return { 
      title: 'New Arrivals | Clean Heart'
    }
  }
}
</script>

<style scoped>
.product-card:hover .product-overlay {
  opacity: 1 !important;
}
</style>