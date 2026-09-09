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
                <!-- 🔥 Main Product Image - Changes with color -->
                <v-img
                  :src="currentProductImage"
                  contain
                  style="width: 100%; height: 100%;"
                  :key="currentProductImage"
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
                
                <!-- Badge -->
                <div
                  v-if="product.is_new || product.is_bestseller"
                  class="d-flex align-center justify-center"
                  style="position: absolute; top: 16px; left: 16px; background: #E53935; color: white; font-size: 0.7rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 6px 14px; z-index: 2;"
                >
                  {{ product.is_new ? 'New' : 'Best Seller' }}
                </div>

                <!-- Color Thumbnails Below Image -->
                <div v-if="colorVariants.length > 1" class="color-thumbnails" style="position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; z-index: 5; background: rgba(255,255,255,0.9); padding: 8px 16px; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
                  <div
                    v-for="variant in colorVariants"
                    :key="variant.id"
                    class="color-thumb"
                    :class="{ 'color-thumb-active': selectedColor === variant.color }"
                    @click="selectedColor = variant.color; selectedColorVariantId = variant.id"
                    style="width: 40px; height: 40px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; overflow: hidden; transition: all 0.2s ease;"
                    :style="selectedColor === variant.color ? 'border-color: #E53935;' : ''"
                  >
                    <v-img
                      :src="variant.image_url || productImage"
                      contain
                      style="width: 100%; height: 100%;"
                    />
                  </div>
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
              
              <!-- Price with Ksh -->
              <div style="font-size: 1.5rem; font-weight: 700; color: #E53935; margin-bottom: 24px;">
                Ksh {{ parseFloat(product.price || product.base_price).toFixed(2) }}
              </div>
              
              <!-- Compare price if available -->
              <div v-if="product.compare_price" style="font-size: 1rem; color: #999; text-decoration: line-through; margin-top: -16px; margin-bottom: 24px;">
                Ksh {{ parseFloat(product.compare_price).toFixed(2) }}
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
                <v-btn icon outlined height="52" width="52" style="border-radius: 0;" @click="toggleWishlist">
                  <v-icon size="20" :color="inWishlist ? '#E53935' : '#000'">
                    {{ inWishlist ? 'mdi-heart' : 'mdi-heart-outline' }}
                  </v-icon>
                </v-btn>
              </div>

              <!-- Product Meta -->
              <div class="mt-8 pt-6" style="border-top: 1px solid #f0f0f0;">
                <div class="d-flex flex-wrap" style="gap: 24px;">
                  <div class="d-flex align-center">
                    <v-icon size="18" color="#999" class="mr-2">mdi-truck-fast-outline</v-icon>
                    <span style="font-size: 0.75rem; color: #666;">Free shipping over Ksh 7,500</span>
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
                  <div style="font-size: 0.85rem; font-weight: 700; color: #E53935;">
                    Ksh {{ parseFloat(p.price || p.base_price).toFixed(2) }}
                  </div>
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
      selectedColorVariantId: null,
      defaultSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      defaultColors: [
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#ffffff' },
        { name: 'Red', hex: '#E53935' },
        { name: 'Gray', hex: '#9e9e9e' },
      ],
      addingToCart: false,
      inWishlist: false,
    }
  },
  computed: {
    ...mapState({
      products: state => state.products,
      authUser: state => state.authUser,
    }),
    
    availableSizes() {
      if (this.product && this.product.variants && this.product.variants.sizes) {
        return this.product.variants.sizes
      }
      return this.defaultSizes
    },
    
    availableColors() {
      if (this.product && this.product.variants && this.product.variants.colors) {
        return this.product.variants.colors.map(color => {
          const found = this.defaultColors.find(c => c.name.toLowerCase() === color.toLowerCase())
          return found || { name: color, hex: '#000000' }
        })
      }
      return this.defaultColors
    },

    // 🔥 Get color variants with images
    colorVariants() {
      if (!this.product || !this.product.variants || !this.product.variants.all) {
        return []
      }
      
      // Get unique color variants with images
      const colorMap = new Map()
      this.product.variants.all.forEach(v => {
        if (v.color && !colorMap.has(v.color)) {
          colorMap.set(v.color, {
            id: v.id,
            color: v.color,
            image_url: v.image_url || this.product.image_url || '/placeholder-product.jpg'
          })
        }
      })
      
      return Array.from(colorMap.values())
    },

    // 🔥 Main product image - changes based on selected color
    productImage() {
      if (this.product) {
        if (this.product.image_url) return this.product.image_url
        if (this.product.variants && this.product.variants.all) {
          const firstVariantWithImage = this.product.variants.all.find(v => v.imageUrl)
          if (firstVariantWithImage) return firstVariantWithImage.imageUrl
        }
      }
      return '/placeholder-product.jpg'
    },

    // 🔥 Current image based on selected color
    currentProductImage() {
      if (!this.product) return '/placeholder-product.jpg'
      
      // If we have color variants, find the image for selected color
      if (this.colorVariants.length > 0) {
        const selectedVariant = this.colorVariants.find(v => v.color === this.selectedColor)
        if (selectedVariant && selectedVariant.image_url) {
          return selectedVariant.image_url
        }
      }
      
      // Fallback to product image
      return this.productImage
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
      return this.authUser?.uid || null
    }
  },
  
  async fetch() {
    const productId = this.$route.params.id
    
    // Try to find in cached products
    const cached = this.products.find(p => p.id === parseInt(productId))
    if (cached && cached.variants) {
      this.product = cached
      this.loading = false
      this.initializeSelections()
      this.checkWishlist()
      return
    }

    // Fetch from API
    this.loading = true
    try {
      const result = await this.$store.dispatch('fetchProduct', productId)
      if (result) {
        this.product = result
        this.initializeSelections()
        this.checkWishlist()
        console.log('Product loaded with variants:', result.variants)
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
    product(newVal) {
      if (newVal) {
        this.initializeSelections()
        this.checkWishlist()
      }
    }
  },
  
  methods: {
    ...mapActions(['addToCartAction']),
    
    initializeSelections() {
      if (!this.product) return
      
      this.qty = 1
      
      // Set default size to first available size
      if (this.availableSizes.length > 0) {
        this.selectedSize = this.availableSizes[0]
      }
      
      // Set default color to first available color
      if (this.availableColors.length > 0) {
        this.selectedColor = this.availableColors[0].name
      }
      
      // Set selected color variant ID
      if (this.colorVariants.length > 0) {
        this.selectedColorVariantId = this.colorVariants[0].id
      }
      
      console.log('Selections initialized:', {
        size: this.selectedSize,
        color: this.selectedColor,
        availableSizes: this.availableSizes,
        availableColors: this.availableColors,
        colorVariants: this.colorVariants
      })
    },
    
    // Helper to find variant ID from selected size and color
    getSelectedVariantId() {
      if (!this.product || !this.product.variants || !this.product.variants.all) {
        return null
      }
      
      // Find the variant matching selected color and size
      const variant = this.product.variants.all.find(v => {
        const colorMatch = v.color && v.color.toLowerCase() === this.selectedColor.toLowerCase()
        const sizeMatch = v.size && v.size.toLowerCase() === this.selectedSize.toLowerCase()
        return colorMatch && sizeMatch
      })
      
      if (variant) {
        console.log('Found variant for selection:', variant)
        return variant.id
      }
      
      // Fallback: return first variant
      if (this.product.variants.all.length > 0) {
        console.log('No exact match, using first variant:', this.product.variants.all[0])
        return this.product.variants.all[0].id
      }
      
      return null
    },

    // Check if product is in wishlist
    async checkWishlist() {
      if (!this.firebaseUid || !this.product) return
      
      try {
        const { data } = await this.$axios.post('/api/wishlist/check', {
          firebaseUid: this.firebaseUid,
          productId: this.product.id
        })
        if (data.success) {
          this.inWishlist = data.inWishlist
        }
      } catch (error) {
        console.error('Check wishlist error:', error)
      }
    },

    // Toggle wishlist
    async toggleWishlist() {
      if (!this.firebaseUid) {
        this.$router.push(`/login?redirect=/product/${this.product.id}`)
        return
      }

      try {
        if (this.inWishlist) {
          await this.$axios.delete(`/api/wishlist/${this.product.id}`, {
            params: { firebaseUid: this.firebaseUid }
          })
          this.inWishlist = false
          this.$nuxt.$emit('show-snackbar', {
            message: 'Removed from wishlist',
            color: '#E53935'
          })
        } else {
          await this.$axios.post('/api/wishlist', {
            firebaseUid: this.firebaseUid,
            productId: this.product.id
          })
          this.inWishlist = true
          this.$nuxt.$emit('show-snackbar', {
            message: 'Added to wishlist',
            color: '#E53935'
          })
        }
      } catch (error) {
        console.error('Toggle wishlist error:', error)
        this.$nuxt.$emit('show-snackbar', {
          message: 'Failed to update wishlist',
          color: 'error'
        })
      }
    },
    
    async addToCart() {
      if (!this.firebaseUid) {
        this.$router.push(`/login?redirect=/product/${this.product.id}`)
        return
      }
      
      // Find the variant ID
      const variantId = this.getSelectedVariantId()
      
      if (!variantId) {
        this.$nuxt.$emit('show-snackbar', {
          message: 'No variant available for this product',
          color: 'error'
        })
        return
      }
      
      this.addingToCart = true
      
      try {
        const variantString = `${this.selectedColor} / ${this.selectedSize}`
        console.log('Adding to cart:', {
          variantString,
          variantId,
          qty: this.qty
        })
        
        const result = await this.$store.dispatch('addToCart', {
          firebaseUid: this.firebaseUid,
          productId: this.product.id,
          qty: this.qty,
          variant: variantString,
          variantId: variantId
        })
        
        console.log('Add to cart result:', result)
        
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
        console.error('Add to cart error:', error)
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

/* Color Thumbnails */
.color-thumbnails {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(8px);
}

.color-thumb {
  transition: all 0.2s ease;
}

.color-thumb:hover {
  transform: scale(1.1);
}

.color-thumb-active {
  border-color: #E53935 !important;
  transform: scale(1.1);
  box-shadow: 0 0 16px rgba(229, 57, 53, 0.3);
}
</style>