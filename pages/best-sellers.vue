<template>
  <div style="margin-top: 64px;">
    <!-- Page Header -->
    <section style="background: linear-gradient(135deg, #E53935 0%, #B71C1C 100%); padding: 80px 0;">
      <v-container>
        <div class="text-center">
          <div style="font-size: 0.75rem; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,0.7); margin-bottom: 16px;">
            Fan Favorites
          </div>
          <h1 style="font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 900; color: #fff; text-transform: uppercase; letter-spacing: -2px; margin-bottom: 16px;">
            Best Sellers
          </h1>
          <p style="font-size: 0.9rem; color: rgba(255,255,255,0.7); max-width: 500px; margin: 0 auto;">
            The pieces our community can't stop wearing. Tried, tested, and loved.
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
        <div v-else-if="bestSellers.length === 0" class="text-center py-12">
          <v-icon size="64" color="grey lighten-1">mdi-trophy-outline</v-icon>
          <h3 class="mt-4" style="font-size: 1.2rem; font-weight: 600;">No best sellers yet</h3>
          <p class="grey--text mt-2">Products will appear here once they start selling</p>
          <v-btn color="black" dark class="mt-4" style="border-radius: 0; text-transform: uppercase;" to="/shop">
            Browse All Products
          </v-btn>
        </div>

        <!-- Products Grid -->
        <div v-else>
          <v-row>
            <v-col
              v-for="product in bestSellers"
              :key="product.id"
              cols="6"
              md="3"
              class="mb-6"
            >
              <nuxt-link :to="`/product/${product.id}`" style="text-decoration: none;">
                <div class="product-card" style="cursor: pointer; position: relative;">
                  <div
                    class="d-flex align-center justify-center"
                    style="position: absolute; top: 10px; left: 10px; z-index: 2; background: #000; color: white; font-size: 0.6rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 3px 8px;"
                  >
                    BEST SELLER
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
                      <span v-if="product.sold_count" style="font-size: 0.65rem; color: #999;">
                        {{ product.sold_count }} sold
                      </span>
                    </div>
                  </div>
                </div>
              </nuxt-link>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </section>

    <!-- Social Proof -->
    <section style="background: #f8f8f8; padding: 60px 0;">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="10">
            <div class="text-center mb-8">
              <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 8px;">Why People Love Us</h3>
              <p style="font-size: 0.85rem; color: #666;">Real reviews from real customers</p>
            </div>
            <v-row>
              <v-col v-for="review in reviews" :key="review.id" cols="12" md="4">
                <div class="pa-6" style="background: #fff; border: 1px solid #f0f0f0; height: 100%;">
                  <div class="d-flex mb-4">
                    <v-icon v-for="n in 5" :key="n" color="#E53935" size="16">mdi-star</v-icon>
                  </div>
                  <p style="font-size: 0.85rem; color: #333; line-height: 1.7; margin-bottom: 16px;">
                    "{{ review.text }}"
                  </p>
                  <div class="d-flex align-center">
                    <v-avatar size="36" color="#f0f0f0" class="mr-3">
                      <v-icon size="18" color="#999">mdi-account</v-icon>
                    </v-avatar>
                    <div>
                      <div style="font-size: 0.8rem; font-weight: 600;">{{ review.name }}</div>
                      <div style="font-size: 0.7rem; color: #999;">{{ review.product }}</div>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'BestSellersPage',
  data() {
    return {
      reviews: [
        { id: 1, text: "The quality is insane. I've washed my hoodie 20+ times and the print still looks brand new. Will definitely be buying more.", name: 'Alex M.', product: 'Clean Heart Hoodie' },
        { id: 2, text: 'Finally found a streetwear brand that actually fits well. The cotton is thick and the designs are fire.', name: 'Sarah K.', product: 'Heart Logo Tee' },
        { id: 3, text: 'Shipping was fast and the packaging was clean. The red heart logo pops so well on the black tee. 10/10.', name: 'Jordan T.', product: 'Classic Sweatshirt' },
      ]
    }
  },
  computed: {
    ...mapState({
      loading: state => state.loading,
      products: state => state.products,
    }),
    ...mapGetters(['getBestSellers']),
    bestSellers() {
      // ✅ First try getter
      const fromGetter = this.getBestSellers
      if (fromGetter && fromGetter.length > 0) {
        console.log('Best sellers from getter:', fromGetter.length)
        return fromGetter
      }
      
      // ✅ Fallback: Manual filter from products
      console.log('Getter returned empty, falling back to manual filter')
      const filtered = this.products.filter(p => {
        return p.is_best_seller === true || 
               p.is_best_seller === 1 || 
               p.is_bestseller === true || 
               p.is_bestseller === 1
      })
      
      // Sort by sold_count
      return filtered
        .sort((a, b) => {
          const aSold = a.sold_count || 0
          const bSold = b.sold_count || 0
          return bSold - aSold
        })
        .slice(0, 8)
    },
    firebaseUid() {
      return this.$store.state.authUser?.uid || null
    }
  },
  async fetch({ store }) {
    await store.dispatch('fetchProducts')
  },
  mounted() {
    console.log('All products count:', this.products.length)
    console.log('Best sellers found:', this.bestSellers.length)
  },
  methods: {
    async quickAdd(product) {
      if (!this.firebaseUid) {
        this.$router.push('/login?redirect=/best-sellers')
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
    }
  },
  head() {
    return { 
      title: 'Best Sellers | Clean Heart'
    }
  }
}
</script>

<style scoped>
.product-card:hover .product-overlay {
  opacity: 1 !important;
}
</style>