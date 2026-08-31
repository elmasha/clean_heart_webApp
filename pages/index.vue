<template>
  <div>
    <!-- HERO SECTION -->
    <section style="margin-top: 64px; min-height: 85vh;">
      <v-container fluid class="pa-0">
        <v-row no-gutters>
          <!-- Left Sidebar Categories -->
          <v-col
            cols="12"
            md="2"
            class="d-none d-md-flex flex-column"
            style="border-right: 1px solid #f0f0f0; padding: 60px 30px;"
          >
            <div style="font-size: 0.7rem; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #999; margin-bottom: 30px;">
              Shop
            </div>
            <nuxt-link
              v-for="cat in categories"
              :key="cat"
              :to="`/shop?category=${cat.toLowerCase()}`"
              class="mb-4"
              style="text-decoration: none;"
            >
              <span style="font-weight: 500; color: #333; font-size: 0.85rem; letter-spacing: 0.5px;">
                {{ cat }}
              </span>
            </nuxt-link>

            <div style="margin-top: auto;">
              <div style="font-size: 0.7rem; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #999; margin-bottom: 20px;">
                Info
              </div>
              <nuxt-link
                v-for="info in infoLinks"
                :key="info.title"
                :to="info.to"
                class="d-block mb-3"
                style="font-size: 0.75rem; color: #666; text-decoration: none;"
              >
                {{ info.title }}
              </nuxt-link>
            </div>
          </v-col>

          <!-- Main Hero Content -->
          <v-col cols="12" md="7" class="pa-0">
            <div class="d-flex flex-column justify-center" style="min-height: 85vh; padding: 40px 60px;">
              <div class="mb-6" style="font-size: 0.7rem; color: #999; letter-spacing: 1px; text-transform: uppercase;">
                Streetwear Clothing / Clean Heart
              </div>

              <h1 style="font-size: clamp(4rem, 10vw, 8rem); font-weight: 900; line-height: 0.9; text-transform: uppercase; letter-spacing: -4px; color: #000; margin-bottom: 30px;">
                Clean<br />
                <span style="color: #E53935;">Heart</span>
              </h1>

              <p style="font-size: 0.9rem; color: #666; line-height: 1.8; max-width: 400px; margin-bottom: 40px;">
                Premium streetwear merch built for those who wear their heart on their sleeve.
                Bold designs, quality cotton, made to stand out.
              </p>

              <!-- Size Selector -->
              <div class="mb-6">
                <div style="font-size: 0.7rem; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #999; margin-bottom: 12px;">
                  Size
                </div>
                <div class="d-flex" style="gap: 10px;">
                  <v-btn
                    v-for="size in sizes"
                    :key="size"
                    :outlined="selectedSize !== size"
                    :color="selectedSize === size ? 'black' : 'grey lighten-3'"
                    :dark="selectedSize === size"
                    height="40"
                    min-width="40"
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
                <div style="font-size: 0.7rem; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #999; margin-bottom: 12px;">
                  Color
                </div>
                <div class="d-flex align-center" style="gap: 12px;">
                  <div
                    v-for="color in colorOptions"
                    :key="color.name"
                    class="d-flex align-center justify-center"
                    style="width: 32px; height: 32px; border-radius: 50%; cursor: pointer; border: 2px solid transparent;"
                    :style="selectedColor === color.name ? 'border-color: #E53935;' : ''"
                    @click="selectedColor = color.name"
                  >
                    <div :style="`width: 24px; height: 24px; border-radius: 50%; background: ${color.hex}; border: 1px solid #e0e0e0;`" />
                  </div>
                  <span style="font-size: 0.75rem; color: #666; margin-left: 8px;">{{ selectedColor }}</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="d-flex align-center flex-wrap" style="gap: 16px;">
                <v-btn
                  color="black"
                  dark
                  height="52"
                  class="px-8"
                  style="border-radius: 0; text-transform: uppercase; letter-spacing: 2px; font-size: 0.75rem; font-weight: 600;"
                  :loading="addingToCart"
                  @click="addFeaturedToCart"
                >
                  <v-icon left size="16">mdi-shopping-outline</v-icon>
                  Add to Cart
                </v-btn>
                <v-btn
                  outlined
                  color="black"
                  height="52"
                  class="px-6"
                  style="border-radius: 0; text-transform: uppercase; letter-spacing: 2px; font-size: 0.75rem; font-weight: 600;"
                  @click="scrollToProducts"
                >
                  <v-icon left size="16">mdi-arrow-right</v-icon>
                  View All
                </v-btn>
              </div>

              <!-- Product Number -->
              <div class="mt-auto pt-12 d-flex align-center" style="gap: 40px;">
                <div>
                  <div style="font-size: 2rem; font-weight: 900; color: #E53935;">01</div>
                  <div style="font-size: 0.7rem; color: #999; letter-spacing: 1px;">FEATURED</div>
                </div>
                <div style="width: 60px; height: 2px; background: #e0e0e0;" />
                <div><div style="font-size: 2rem; font-weight: 300; color: #ccc;">02</div></div>
                <div><div style="font-size: 2rem; font-weight: 300; color: #ccc;">03</div></div>
                <div><div style="font-size: 2rem; font-weight: 300; color: #ccc;">04</div></div>
              </div>
            </div>
          </v-col>

          <!-- Right Hero Image -->
          <v-col cols="12" md="3" class="pa-0 d-none d-md-block">
            <div style="height: 85vh; background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%); position: relative; overflow: hidden;">
              <div class="d-flex align-center justify-center" style="height: 100%;">
                <div class="text-center">
                  <v-icon size="120" color="grey lighten-2">mdi-tshirt-crew-outline</v-icon>
                  <div class="mt-4" style="font-size: 0.75rem; color: #999; letter-spacing: 2px; text-transform: uppercase;">
                    Clean Heart Tee
                  </div>
                  <div class="mt-2" style="font-size: 1.5rem; font-weight: 700;">$45.00</div>
                </div>
              </div>
              <div class="d-flex" style="position: absolute; bottom: 0; right: 0;">
                <v-btn icon tile large style="border-radius: 0; background: #000;" dark>
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn icon tile large style="border-radius: 0; background: #E53935;" dark>
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- CATEGORY BANNERS -->
    <section style="background: #0a0a0a;">
      <v-container fluid class="pa-0">
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <div class="d-flex flex-column justify-center align-start pa-8 pa-md-12" style="min-height: 400px; background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'); background-size: cover; background-position: center;">
              <h2 style="font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 700; color: #fff; margin-bottom: 16px;">New Arrivals</h2>
              <p style="font-size: 0.85rem; color: rgba(255,255,255,0.7); max-width: 350px; line-height: 1.7; margin-bottom: 30px;">
                Fresh drops just landed. Limited quantities on our latest hoodies and sweatshirts.
              </p>
              <div class="d-flex" style="gap: 12px;">
                <v-btn outlined color="white" height="42" class="px-6" style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.7rem; font-weight: 600;" to="/new">
                  Shop New
                </v-btn>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="d-flex flex-column justify-center align-start pa-8 pa-md-12" style="min-height: 400px; background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800'); background-size: cover; background-position: center;">
              <h2 style="font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 700; color: #fff; margin-bottom: 16px;">Best Sellers</h2>
              <p style="font-size: 0.85rem; color: rgba(255,255,255,0.7); max-width: 350px; line-height: 1.7; margin-bottom: 30px;">
                Our most loved pieces. The hoodies and tees that keep selling out.
              </p>
              <div class="d-flex" style="gap: 12px;">
                <v-btn outlined color="white" height="42" class="px-6" style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.7rem; font-weight: 600;" to="/best-sellers">
                  Shop Now
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- PRODUCTS SECTION -->
    <section id="products" style="padding: 100px 0; background: #ffffff;">
      <v-container>
        <div class="text-center mb-12">
          <h2 style="font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; color: #000; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 16px;">
            Our Products
          </h2>
          <p style="font-size: 0.9rem; color: #666; max-width: 500px; margin: 0 auto; line-height: 1.7;">
            Our focus is on producing high-quality streetwear that brings comfort and style to everyday life.
          </p>
        </div>

        <!-- Filter Tabs -->
        <div class="d-flex justify-center mb-10 flex-wrap" style="gap: 0;">
          <v-btn
            v-for="filter in productFilters"
            :key="filter"
            :text="activeFilter !== filter"
            :color="activeFilter === filter ? 'black' : 'grey'"
            :dark="activeFilter === filter"
            height="48"
            class="px-6"
            style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.7rem; font-weight: 600;"
            @click="activeFilter = filter"
          >
            {{ filter }}
          </v-btn>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="d-flex justify-center py-12">
          <v-progress-circular indeterminate color="#E53935" size="48" />
        </div>

        <!-- Product Grid -->
        <v-row v-else>
          <v-col
            v-for="product in filteredProducts"
            :key="product.id"
            cols="6"
            md="3"
            class="mb-8"
          >
            <nuxt-link :to="`/product/${product.id}`" style="text-decoration: none;">
              <div class="product-card" style="cursor: pointer; position: relative;">
                <div
                  v-if="product.badge || product.is_new || product.is_best_seller"
                  class="d-flex align-center justify-center"
                  style="position: absolute; top: 12px; left: 12px; z-index: 2; background: #E53935; color: white; font-size: 0.65rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 4px 10px;"
                >
                  {{ product.badge || (product.is_new ? 'New' : product.is_best_seller ? 'Best Seller' : '') }}
                </div>

                <div class="d-flex align-center justify-center mb-4" style="background: #f5f5f5; aspect-ratio: 3/4; position: relative; overflow: hidden;">
                  <v-img
                    :src="product.image_url || product.image || '/placeholder-product.jpg'"
                    aspect-ratio="3/4"
                    contain
                    style="width: 100%; height: 100%;"
                  >
                    <template #placeholder>
                      <div class="d-flex align-center justify-center fill-height">
                        <v-icon size="64" color="grey lighten-1">mdi-tshirt-crew-outline</v-icon>
                      </div>
                    </template>
                  </v-img>
                  <div class="product-overlay d-flex align-center justify-center" style="position: absolute; inset: 0; background: rgba(0,0,0,0.4); opacity: 0; transition: opacity 0.3s;">
                    <v-btn
                      color="white"
                      dark
                      height="44"
                      class="px-6"
                      style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.7rem; font-weight: 600;"
                      @click.prevent="quickAdd(product)"
                    >
                      Quick Add
                    </v-btn>
                  </div>
                </div>

                <div>
                  <div style="font-size: 0.8rem; font-weight: 600; color: #000; margin-bottom: 4px; letter-spacing: 0.3px;">
                    {{ product.name }}
                  </div>
                  <div class="d-flex align-center justify-space-between">
                    <span style="font-size: 0.85rem; font-weight: 700; color: #000;">
                      ${{ parseFloat(product.price).toFixed(2) }}
                    </span>
                    <div v-if="product.colors" class="d-flex" style="gap: 4px;">
                      <div
                        v-for="c in product.colors.split(',')"
                        :key="c"
                        style="width: 12px; height: 12px; border-radius: 50%; border: 1px solid #ddd;"
                        :style="`background: ${c.trim()};`"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </nuxt-link>
          </v-col>
        </v-row>

        <div class="text-center mt-8">
          <v-btn
            outlined
            color="black"
            height="48"
            class="px-8"
            style="border-radius: 0; text-transform: uppercase; letter-spacing: 2px; font-size: 0.75rem; font-weight: 600;"
            to="/shop"
          >
            View All Products
          </v-btn>
        </div>
      </v-container>
    </section>

    <!-- BRAND STORY -->
    <section style="background: #f8f8f8; padding: 100px 0;">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="5">
            <div style="font-size: clamp(3rem, 8vw, 5rem); font-weight: 900; color: #e0e0e0; text-transform: uppercase; line-height: 0.9; letter-spacing: -3px; margin-bottom: 30px;">
              Clean<br />Heart
            </div>
            <h3 style="font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 700; color: #000; margin-bottom: 20px;">Streetwear With Soul</h3>
            <p style="font-size: 0.9rem; color: #666; line-height: 1.8; margin-bottom: 30px;">
              Born from a passion for authentic street culture, Clean Heart represents more than just clothing.
              It's a movement. Every piece is designed to make a statement.
            </p>
            <div class="d-flex" style="gap: 40px;">
              <div>
                <div style="font-size: 2rem; font-weight: 900; color: #E53935;">10K+</div>
                <div style="font-size: 0.75rem; color: #999; letter-spacing: 1px; text-transform: uppercase;">Happy Customers</div>
              </div>
              <div>
                <div style="font-size: 2rem; font-weight: 900; color: #E53935;">4</div>
                <div style="font-size: 0.75rem; color: #999; letter-spacing: 1px; text-transform: uppercase;">Core Categories</div>
              </div>
              <div>
                <div style="font-size: 2rem; font-weight: 900; color: #E53935;">100%</div>
                <div style="font-size: 0.75rem; color: #999; letter-spacing: 1px; text-transform: uppercase;">Cotton</div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="7">
            <v-row>
              <v-col cols="6">
                <div class="d-flex flex-column justify-center pa-6" style="background: #000; min-height: 280px;">
                  <v-icon color="#E53935" size="32" class="mb-4">mdi-fire</v-icon>
                  <h4 style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 12px;">Premium Quality</h4>
                  <p style="font-size: 0.8rem; color: rgba(255,255,255,0.6); line-height: 1.7;">Heavyweight cotton, reinforced stitching, and prints that last wash after wash.</p>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="d-flex flex-column justify-center pa-6" style="background: #E53935; min-height: 280px;">
                  <v-icon color="white" size="32" class="mb-4">mdi-truck-fast-outline</v-icon>
                  <h4 style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 12px;">Fast Shipping</h4>
                  <p style="font-size: 0.8rem; color: rgba(255,255,255,0.8); line-height: 1.7;">Worldwide delivery. Track your order from our door to yours in real-time.</p>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="d-flex flex-column justify-center pa-6" style="background: #E53935; min-height: 280px;">
                  <v-icon color="white" size="32" class="mb-4">mdi-refresh</v-icon>
                  <h4 style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 12px;">Easy Returns</h4>
                  <p style="font-size: 0.8rem; color: rgba(255,255,255,0.8); line-height: 1.7;">Not the right fit? No problem. 30-day hassle-free returns on all orders.</p>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="d-flex flex-column justify-center pa-6" style="background: #000; min-height: 280px;">
                  <v-icon color="#E53935" size="32" class="mb-4">mdi-shield-check</v-icon>
                  <h4 style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 12px;">Secure Payment</h4>
                  <p style="font-size: 0.8rem; color: rgba(255,255,255,0.6); line-height: 1.7;">Encrypted checkout. Your data is protected with industry-standard security.</p>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- NEWSLETTER -->
    <section style="background: #000; padding: 80px 0;">
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="12" md="8" class="text-center">
            <div class="d-flex align-center justify-center mb-6">
              <div class="d-flex align-center justify-center mr-4" style="width: 50px; height: 50px; border-radius: 50%; background: #fff;">
                <v-icon color="#E53935" size="28">mdi-heart</v-icon>
              </div>
              <span style="font-size: 1.5rem; font-weight: 900; letter-spacing: 3px; color: #fff; text-transform: uppercase;">CLEAN HEART</span>
            </div>
            <h3 style="font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 700; color: #fff; margin-bottom: 16px;">Join the Movement</h3>
            <p style="font-size: 0.9rem; color: rgba(255,255,255,0.5); max-width: 450px; margin: 0 auto 30px; line-height: 1.7;">
              Be the first to know about new drops, exclusive offers, and behind-the-scenes content.
            </p>
            <div class="d-flex justify-center flex-wrap" style="gap: 0; max-width: 500px; margin: 0 auto;">
              <v-text-field
                v-model="email"
                placeholder="Enter your email"
                outlined
                hide-details
                height="52"
                dark
                class="flex-grow-1"
                style="border-radius: 0;"
                background-color="rgba(255,255,255,0.1)"
              />
              <v-btn
                color="#E53935"
                dark
                height="52"
                class="px-6"
                style="border-radius: 0; text-transform: uppercase; letter-spacing: 2px; font-size: 0.7rem; font-weight: 600;"
                @click="subscribe"
              >
                Subscribe
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
  name: 'IndexPage',
  data() {
    return {
      email: '',
      selectedSize: 'M',
      selectedColor: 'Black',
      activeFilter: 'All',
      addingToCart: false,
      categories: ['Hoodies', 'Sweatshirts', 'T-Shirts', 'Crop Tops'],
      infoLinks: [
        { title: 'Shipping', to: '/shipping' },
        { title: 'Returns', to: '/returns' },
        { title: 'Size Guide', to: '/size-guide' },
        { title: 'Contact', to: '/contact' },
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colorOptions: [
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#ffffff' },
        { name: 'Red', hex: '#E53935' },
        { name: 'Gray', hex: '#9e9e9e' },
      ],
      productFilters: ['All', 'Hoodies', 'Sweatshirts', 'T-Shirts', 'Crop Tops'],
    }
  },
  computed: {
    ...mapState({
      products: state => state.products,
      loading: state => state.loading,
    }),
    ...mapGetters(['getCartCount']),
    filteredProducts() {
      if (this.activeFilter === 'All') return this.products.slice(0, 8)
      return this.products.filter(p => p.category === this.activeFilter).slice(0, 8)
    },
    firebaseUid() {
      return this.$store.state.authUser?.uid || null
    }
  },
  async fetch({ store }) {
    await store.dispatch('fetchProducts')
    await store.dispatch('fetchCategories')
  },
  methods: {
    scrollToProducts() {
      const el = document.getElementById('products')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    },
    async addFeaturedToCart() {
      if (!this.firebaseUid) {
        this.$router.push('/login?redirect=/')
        return
      }
      this.addingToCart = true
      const result = await this.$store.dispatch('addToCart', {
        firebaseUid: this.firebaseUid,
        productId: 1,
        qty: 1,
        variant: `${this.selectedColor} / ${this.selectedSize}`
      })
      this.addingToCart = false
      if (result.success) {
        this.$nuxt.$emit('show-snackbar', { message: 'Added to cart!', color: 'black' })
      } else {
        this.$nuxt.$emit('show-snackbar', { message: result.error || 'Failed to add', color: 'error' })
      }
    },
    async quickAdd(product) {
      if (!this.firebaseUid) {
        this.$router.push('/login?redirect=/')
        return
      }
      const result = await this.$store.dispatch('addToCart', {
        firebaseUid: this.firebaseUid,
        productId: product.id,
        qty: 1,
        variant: 'M'
      })
      if (result.success) {
        this.$nuxt.$emit('show-snackbar', { message: `${product.name} added!`, color: 'black' })
      }
    },
    subscribe() {
      if (!this.email) {
        this.$nuxt.$emit('show-snackbar', { message: 'Please enter your email', color: 'error' })
        return
      }
      this.$nuxt.$emit('show-snackbar', { message: 'Welcome to the Clean Heart family!', color: '#E53935' })
      this.email = ''
    }
  }
}
</script>

<style scoped>
.product-card:hover .product-overlay {
  opacity: 1 !important;
}
</style>