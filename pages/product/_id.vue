<template>
  <div style="margin-top: 64px;">
    <!-- Loading -->
    <div v-if="loading" class="d-flex justify-center align-center" style="min-height: 80vh;">
      <v-progress-circular indeterminate color="#E53935" size="64" />
    </div>

    <!-- Error -->
    <div v-else-if="!product" class="d-flex flex-column justify-center align-center" style="min-height: 80vh;">
      <v-icon size="64" color="grey lighten-1">mdi-package-variant-remove</v-icon>
      <h2 class="mt-4" style="font-size: 1.5rem; font-weight: 600;">Product Not Found</h2>
      <v-btn color="black" dark class="mt-4" style="border-radius: 0; text-transform: uppercase;" to="/shop">
        Back to Shop
      </v-btn>
    </div>

    <!-- Product Detail -->
    <div v-else>
      <!-- Breadcrumb -->
      <v-container class="py-4">
        <div style="font-size: 0.75rem; color: #999;">
          <nuxt-link to="/" style="text-decoration: none; color: #999;">Home</nuxt-link>
          <span class="mx-2">/</span>
          <nuxt-link to="/shop" style="text-decoration: none; color: #999;">Shop</nuxt-link>
          <span class="mx-2">/</span>
          <span style="color: #333;">{{ product.name }}</span>
        </div>
      </v-container>

      <!-- Main Product -->
      <section style="padding: 20px 0 60px;">
        <v-container>
          <v-row>
            <!-- Image -->
            <v-col cols="12" md="6">
              <div style="background: #f5f5f5; aspect-ratio: 1; position: relative;">
                <v-img
                  :src="productImage"
                  contain
                  style="width: 100%; height: 100%;"
                >
                  <template #placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-icon size="120" color="grey lighten-1">mdi-tshirt-crew-outline</v-icon>
                    </div>
                  </template>
                  <template #error>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-icon size="120" color="grey lighten-1">mdi-tshirt-crew-outline</v-icon>
                    </div>
                  </template>
                </v-img>
                <div
                  v-if="product.is_new || product.is_bestseller"
                  class="d-flex align-center justify-center"
                  style="position: absolute; top: 16px; left: 16px; background: #E53935; color: white; font-size: 0.7rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 6px 14px; z-index: 2;"
                >
                  {{ product.is_new ? 'New' : 'Best Seller' }}
                </div>
              </div>
            </v-col>

            <!-- Info -->
            <v-col cols="12" md="6" class="d-flex flex-column justify-center">
              <div style="font-size: 0.75rem; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #E53935; margin-bottom: 12px;">
                {{ product.category_name || product.category || 'Streetwear' }}
              </div>
              <h1 style="font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight: 900; color: #000; margin-bottom: 16px;">
                {{ product.name }}
              </h1>
              <div style="font-size: 1.5rem; font-weight: 700; color: #000; margin-bottom: 24px;">
                ${{ parseFloat(product.price || product.base_price).toFixed(2) }}
              </div>
              <p style="font-size: 0.9rem; color: #666; line-height: 1.8; margin-bottom: 30px;">
                {{ product.description || product.short_description || 'Premium streetwear piece from Clean Heart. Made with 100% heavyweight cotton for maximum comfort and durability. Features our signature red heart logo.' }}
              </p>

              <!-- Size Selector -->
              <div class="mb-6">
                <div class="d-flex align-center justify-space-between mb-3">
                  <span style="font-size: 0.75rem; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #999;">Size</span>
                  <nuxt-link to="/size-guide" style="font-size: 0.7rem; color: #E53935; text-decoration: underline;">Size Guide</nuxt-link>
                </div>
                <div class="d-flex flex-wrap" style="gap: 10px;">
                  <v-btn
                    v-for="size in availableSizes"
                    :key="size"
                    :outlined="selectedSize !== size"
                    :color="selectedSize === size ? 'black' : 'grey lighten-3'"
                    :dark="selectedSize === size"
                    height="44"
                    min-width="44"
                    class="pa-0"
                    style="border-radius: 0; font-size: 0.75rem; font-weight: 600;"
                    @click="selectedSize = size"
                  >
                    {{ size }}
                  </v-btn>
                </div>
              </div>

              <!-- Color Selector -->
              <div class="mb-8">
                <div style="font-size: 0.75rem; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #999; margin-bottom: 12px;">Color</div>
                <div class="d-flex align-center" style="gap: 12px;">
                  <div
                    v-for="color in availableColors"
                    :key="color.name"
                    class="d-flex align-center justify-center"
                    style="width: 36px; height: 36px; border-radius: 50%; cursor: pointer; border: 2px solid transparent;"
                    :style="selectedColor === color.name ? 'border-color: #E53935;' : ''"
                    @click="selectedColor = color.name"
                  >
                    <div 
                      :style="`width: 28px; height: 28px; border-radius: 50%; background: ${color.hex}; border: 1px solid #e0e0e0;`" 
                      :class="color.name.toLowerCase() === 'white' ? 'border' : ''"
                    />
                  </div>
                  <span style="font-size: 0.8rem; color: #666; margin-left: 8px;">{{ selectedColor }}</span>
                </div>
              </div>

              <!-- Quantity + Add to Cart -->
              <div class="d-flex align-center flex-wrap" style="gap: 16px;">
                <div class="d-flex align-center" style="border: 1px solid #e0e0e0;">
                  <v-btn icon tile height="48" width="48" style="border-radius: 0;" @click="qty > 1 ? qty-- : null">
                    <v-icon size="16">mdi-minus</v-icon>
                  </v-btn>
                  <span class="px-4" style="font-size: 0.9rem; font-weight: 600; min-width: 40px; text-align: center;">{{ qty }}</span>
                  <v-btn icon tile height="48" width="48" style="border-radius: 0;" @click="qty++">
                    <v-icon size="16">mdi-plus</v-icon>
                  </v-btn>
                </div>
                <v-btn
                  color="black"
                  dark
                  height="52"
                  class="px-8 flex-grow-1"
                  style="border-radius: 0; text-transform: uppercase; letter-spacing: 2px; font-size: 0.75rem; font-weight: 600;"
                  :loading="addingToCart"
                  @click="addToCart"
                >
                  <v-icon left size="18">mdi-shopping-outline</v-icon>
                  Add to Cart
                </v-btn>
                <v-btn icon outlined height="52" width="52" style="border-radius: 0;">
                  <v-icon size="20">mdi-heart-outline</v-icon>
                </v-btn>
              </div>

              <!-- Product Meta -->
              <div class="mt-8 pt-6" style="border-top: 1px solid #f0f0f0;">
                <div class="d-flex flex-wrap" style="gap: 24px;">
                  <div class="d-flex align-center">
                    <v-icon size="18" color="#999" class="mr-2">mdi-truck-fast-outline</v-icon>
                    <span style="font-size: 0.75rem; color: #666;">Free shipping over $75</span>
                  </div>
                  <div class="d-flex align-center">
                    <v-icon size="18" color="#999" class="mr-2">mdi-refresh</v-icon>
                    <span style="font-size: 0.75rem; color: #666;">30-day returns</span>
                  </div>
                  <div class="d-flex align-center">
                    <v-icon size="18" color="#999" class="mr-2">mdi-shield-check</v-icon>
                    <span style="font-size: 0.75rem; color: #666;">Secure checkout</span>
                  </div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Related Products -->
      <section v-if="relatedProducts.length > 0" style="background: #f8f8f8; padding: 60px 0;">
        <v-container>
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #000; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 1px;">
            You May Also Like
          </h2>
          <v-row>
            <v-col
              v-for="p in relatedProducts"
              :key="p.id"
              cols="6"
              md="3"
            >
              <nuxt-link :to="`/product/${p.id}`" style="text-decoration: none;">
                <div style="cursor: pointer;">
                  <div class="d-flex align-center justify-center mb-3" style="background: #fff; aspect-ratio: 3/4;">
                    <v-img
                      :src="p.image_url || p.image || '/placeholder-product.jpg'"
                      aspect-ratio="3/4"
                      contain
                      style="width: 100%; height: 100%;"
                    >
                      <template #placeholder>
                        <div class="d-flex align-center justify-center fill-height">
                          <v-icon size="48" color="grey lighten-1">mdi-tshirt-crew-outline</v-icon>
                        </div>
                      </template>
                      <template #error>
                        <div class="d-flex align-center justify-center fill-height">
                          <v-icon size="48" color="grey lighten-1">mdi-tshirt-crew-outline</v-icon>
                        </div>
                      </template>
                    </v-img>
                  </div>
                  <div style="font-size: 0.8rem; font-weight: 600; color: #000; margin-bottom: 4px;">{{ p.name }}</div>
                  <div style="font-size: 0.85rem; font-weight: 700; color: #000;">${{ parseFloat(p.price || p.base_price).toFixed(2) }}</div>
                </div>
              </nuxt-link>
            </v-col>
          </v-row>
        </v-container>
      </section>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'ProductDetailPage',
  data() {
    return {
      product: null,
      loading: true,
      qty: 1,
      selectedSize: 'M',
      selectedColor: 'Black',
      defaultSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      defaultColors: [
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#ffffff' },
        { name: 'Red', hex: '#E53935' },
        { name: 'Gray', hex: '#9e9e9e' },
      ],
      addingToCart: false,
    }
  },
  computed: {
    ...mapState({
      products: state => state.products,
    }),
    
    // Get available sizes from product variants or use defaults
    availableSizes() {
      if (this.product && this.product.variants && this.product.variants.sizes) {
        return this.product.variants.sizes
      }
      return this.defaultSizes
    },
    
    // Get available colors from product variants or use defaults
    availableColors() {
      if (this.product && this.product.variants && this.product.variants.colors) {
        // Map color names to objects with hex values
        return this.product.variants.colors.map(color => {
          const found = this.defaultColors.find(c => c.name.toLowerCase() === color.toLowerCase())
          return found || { name: color, hex: '#000000' }
        })
      }
      return this.defaultColors
    },
    
    // Get product image (from variants or product)
    productImage() {
      if (this.product) {
        // Check if product has image_url directly
        if (this.product.image_url) return this.product.image_url
        
        // Check if variants have images
        if (this.product.variants && this.product.variants.all) {
          const firstVariantWithImage = this.product.variants.all.find(v => v.imageUrl)
          if (firstVariantWithImage) return firstVariantWithImage.imageUrl
        }
      }
      return '/placeholder-product.jpg'
    },

    relatedProducts() {
      if (!this.product || !this.products.length) return []
      const category = this.product.category_id || this.product.category
      return this.products
        .filter(p => {
          const pCategory = p.category_id || p.category
          return pCategory === category && p.id !== this.product.id
        })
        .slice(0, 4)
    },
    
    firebaseUid() {
      return this.$store.state.authUser?.uid || null
    }
  },
  
  async fetch() {
    const productId = this.$route.params.id
    
    // Try to find in cached products
    const cached = this.products.find(p => p.id === parseInt(productId))
    if (cached) {
      this.product = cached
      this.loading = false
      return
    }

    // Fetch from API
    this.loading = true
    try {
      const result = await this.$store.dispatch('fetchProduct', productId)
      if (result) {
        this.product = result
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    }
    this.loading = false
  },
  
  head() {
    return {
      title: this.product ? `${this.product.name} | Clean Heart` : 'Product | Clean Heart',
      meta: [
        { hid: 'description', name: 'description', content: this.product?.description || this.product?.short_description || 'Premium streetwear from Clean Heart' }
      ]
    }
  },
  
  watch: {
    // Reset quantity when product changes
    product(newVal) {
      if (newVal) {
        this.qty = 1
        // Set default size to first available size
        if (this.availableSizes.length > 0) {
          this.selectedSize = this.availableSizes[0]
        }
        // Set default color to first available color
        if (this.availableColors.length > 0) {
          this.selectedColor = this.availableColors[0].name
        }
      }
    }
  },
  
  methods: {
    ...mapActions(['addToCartAction']),
    
    async addToCart() {
      if (!this.firebaseUid) {
        this.$router.push(`/login?redirect=/product/${this.product.id}`)
        return
      }
      
      this.addingToCart = true
      
      try {
        const result = await this.$store.dispatch('addToCart', {
          firebaseUid: this.firebaseUid,
          productId: this.product.id,
          qty: this.qty,
          variant: `${this.selectedColor} / ${this.selectedSize}`
        })
        
        if (result.success) {
          this.$nuxt.$emit('show-snackbar', {
            message: `${this.qty}x ${this.product.name} added to cart!`,
            color: 'black'
          })
        } else {
          this.$nuxt.$emit('show-snackbar', {
            message: result.error || 'Failed to add to cart',
            color: 'error'
          })
        }
      } catch (error) {
        this.$nuxt.$emit('show-snackbar', {
          message: 'Something went wrong. Please try again.',
          color: 'error'
        })
      }
      
      this.addingToCart = false
    }
  }
}
</script>

<style scoped>
.border {
  border: 1px solid #e0e0e0 !important;
}
</style>