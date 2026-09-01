<template>
  <div style="margin-top: 64px; min-height: calc(100vh - 64px); background: #fafafa;">
    <v-container class="py-8">
      <!-- Search Header -->
      <div class="mb-6">
        <h1 style="font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 900; color: #000; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 8px;">
          Search Products
        </h1>
        <p v-if="searchQuery" style="font-size: 0.9rem; color: #666;">
          {{ totalResults }} result(s) for "<strong>{{ searchQuery }}</strong>"
        </p>
      </div>

      <!-- Search Bar -->
      <div class="mb-8">
        <v-text-field
          v-model="searchQuery"
          placeholder="Search for products..."
          outlined
          dense
          hide-details
          class="search-input"
          style="border-radius: 0;"
          prepend-inner-icon="mdi-magnify"
          append-icon="mdi-close"
          @click:append="clearSearch"
          @keyup.enter="performSearch"
          @input="debouncedSearch"
        />
        
        <!-- Search Tips -->
        <div v-if="!searchQuery" class="mt-4 d-flex flex-wrap" style="gap: 8px;">
          <span style="font-size: 0.75rem; color: #999;">Popular searches:</span>
          <v-chip
            v-for="tag in popularSearches"
            :key="tag"
            small
            outlined
            style="border-radius: 0; font-size: 0.7rem; cursor: pointer;"
            @click="searchQuery = tag; performSearch()"
          >
            {{ tag }}
          </v-chip>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="d-flex justify-center py-12">
        <v-progress-circular indeterminate color="#E53935" size="48" />
      </div>

      <!-- No Results -->
      <div v-else-if="searchQuery && products.length === 0" class="text-center py-12">
        <v-icon size="64" color="grey lighten-1">mdi-file-search-outline</v-icon>
        <h3 class="mt-4" style="font-size: 1.2rem; font-weight: 600;">No products found</h3>
        <p class="grey--text mt-2">
          We couldn't find any products matching "<strong>{{ searchQuery }}</strong>"
        </p>
        <p class="grey--text" style="font-size: 0.85rem;">
          Try using different keywords or browse our categories below.
        </p>
        <v-btn color="black" dark class="mt-4" style="border-radius: 0; text-transform: uppercase;" @click="clearSearch">
          Clear Search
        </v-btn>
      </div>

      <!-- Initial State - Show Categories -->
      <div v-else-if="!searchQuery && !loading" class="py-4">
        <h3 style="font-size: 1.1rem; font-weight: 700; color: #000; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;">
          Browse Categories
        </h3>
        <v-row>
          <v-col
            v-for="category in categories"
            :key="category.id"
            cols="6"
            sm="4"
            md="3"
          >
            <v-card
              class="category-card"
              style="border-radius: 0; border: 1px solid #f0f0f0; cursor: pointer;"
              @click="searchByCategory(category)"
            >
              <v-card-text class="text-center pa-6">
                <v-icon size="36" color="#E53935" class="mb-2">
                  {{ getCategoryIcon(category.name) }}
                </v-icon>
                <div style="font-weight: 600; font-size: 0.9rem; color: #000;">
                  {{ category.name }}
                </div>
                <div style="font-size: 0.7rem; color: #999;">
                  {{ category.product_count || 0 }} products
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <!-- Results Grid -->
      <div v-else-if="!loading && products.length > 0">
        <!-- Filter Bar -->
        <div class="d-flex flex-wrap align-center justify-space-between mb-6" style="gap: 12px;">
          <div class="d-flex flex-wrap" style="gap: 8px;">
            <v-btn
              v-for="filter in filters"
              :key="filter.value"
              small
              :outlined="activeFilter !== filter.value"
              :color="activeFilter === filter.value ? 'black' : 'grey'"
              :dark="activeFilter === filter.value"
              style="border-radius: 0; text-transform: uppercase; font-size: 0.65rem; letter-spacing: 1px; font-weight: 600;"
              @click="activeFilter = filter.value; performSearch()"
            >
              {{ filter.label }}
            </v-btn>
          </div>
          <div style="font-size: 0.8rem; color: #999;">
            {{ products.length }} products
          </div>
        </div>

        <!-- Product Grid -->
        <v-row>
          <v-col
            v-for="product in paginatedProducts"
            :key="product.id"
            cols="6"
            sm="4"
            md="3"
            class="mb-6"
          >
            <nuxt-link :to="`/product/${product.id}`" style="text-decoration: none;">
              <div class="product-card" style="cursor: pointer; position: relative;">
                <div
                  v-if="product.is_new || product.is_best_seller"
                  class="d-flex align-center justify-center"
                  style="position: absolute; top: 10px; left: 10px; z-index: 2; background: #E53935; color: white; font-size: 0.6rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 3px 8px;"
                >
                  {{ product.is_new ? 'New' : 'Best Seller' }}
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
                    <v-btn
                      color="black"
                      dark
                      height="40"
                      class="px-5"
                      style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.65rem; font-weight: 600;"
                      @click.prevent="quickAdd(product)"
                    >
                      Quick Add
                    </v-btn>
                  </div>
                </div>

                <div>
                  <div style="font-size: 0.75rem; font-weight: 600; color: #000; margin-bottom: 3px; line-height: 1.2;">
                    {{ product.name }}
                  </div>
                  <div class="d-flex align-center justify-space-between">
                    <span style="font-size: 0.8rem; font-weight: 700; color: #E53935;">
                      Ksh {{ formatPrice(product.price) }}
                    </span>
                    <div v-if="product.colors" class="d-flex" style="gap: 3px;">
                      <div
                        v-for="c in product.colors.split(',').slice(0,3)"
                        :key="c"
                        style="width: 10px; height: 10px; border-radius: 50%; border: 1px solid #ddd;"
                        :style="`background: ${c.trim()};`"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </nuxt-link>
          </v-col>
        </v-row>

        <!-- Pagination -->
        <div v-if="products.length > itemsPerPage" class="d-flex justify-center mt-8">
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="7"
            color="black"
            style="border-radius: 0;"
          />
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'SearchPage',
  data() {
    return {
      searchQuery: '',
      products: [],
      categories: [],
      loading: false,
      currentPage: 1,
      itemsPerPage: 12,
      activeFilter: 'all',
      searchTimeout: null,
      popularSearches: ['Hoodie', 'T-Shirt', 'Sweatshirt', 'Crop Top', 'Black', 'White'],
      filters: [
        { label: 'All', value: 'all' },
        { label: 'Featured', value: 'featured' },
        { label: 'New', value: 'new' },
        { label: 'Best Sellers', value: 'bestsellers' },
        { label: 'Price: Low to High', value: 'price_asc' },
        { label: 'Price: High to Low', value: 'price_desc' },
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
    totalResults() {
      return this.products.length
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      return this.products.slice(start, start + this.itemsPerPage)
    },
    totalPages() {
      return Math.ceil(this.products.length / this.itemsPerPage)
    }
  },
  async mounted() {
    // Check if there's a search query in the URL
    const query = this.$route.query.q
    if (query) {
      this.searchQuery = query
      await this.performSearch()
    }

    // Fetch categories
    await this.fetchCategories()
  },
  watch: {
    '$route.query.q': {
      handler(newQuery) {
        if (newQuery && newQuery !== this.searchQuery) {
          this.searchQuery = newQuery
          this.performSearch()
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

    getCategoryIcon(name) {
      const icons = {
        'Hoodies': 'mdi-tshirt-crew',
        'T-Shirts': 'mdi-tshirt-v',
        'Sweatshirts': 'mdi-hoodie',
        'Crop Tops': 'mdi-tshirt-crew-outline',
      }
      return icons[name] || 'mdi-tag'
    },

    async fetchCategories() {
      try {
        const { data } = await this.$axios.get('/api/categories')
        if (data.success) {
          this.categories = data.data || []
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    },

    async performSearch() {
      if (!this.searchQuery || this.searchQuery.trim().length < 2) {
        this.products = []
        return
      }

      this.loading = true
      try {
        const params = {
          search: this.searchQuery.trim(),
          limit: 100
        }

        // Apply filter
        if (this.activeFilter === 'featured') {
          params.featured = 'true'
        } else if (this.activeFilter === 'new') {
          params.new = 'true'
        }

        const { data } = await this.$axios.get('/api/products', { params })
        
        if (data.success) {
          let results = data.data || []
          
          // Apply sorting for price filters
          if (this.activeFilter === 'price_asc') {
            results.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
          } else if (this.activeFilter === 'price_desc') {
            results.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
          } else if (this.activeFilter === 'bestsellers') {
            results = results.filter(p => p.is_best_seller || p.is_bestseller)
          }

          this.products = results
          this.currentPage = 1

          // Update URL with search query
          if (this.searchQuery) {
            this.$router.replace({
              query: { q: this.searchQuery }
            })
          }
        }
      } catch (error) {
        console.error('Search error:', error)
        this.products = []
      } finally {
        this.loading = false
      }
    },

    debouncedSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      
      if (this.searchQuery && this.searchQuery.length >= 2) {
        this.searchTimeout = setTimeout(() => {
          this.performSearch()
        }, 500)
      } else if (this.searchQuery.length === 0) {
        this.clearSearch()
      }
    },

    clearSearch() {
      this.searchQuery = ''
      this.products = []
      this.currentPage = 1
      this.$router.replace({ query: {} })
    },

    searchByCategory(category) {
      this.searchQuery = category.name
      this.activeFilter = 'all'
      this.performSearch()
    },

    async quickAdd(product) {
      if (!this.firebaseUid) {
        this.$router.push('/login?redirect=/search')
        return
      }

      try {
        // Fetch product with variants
        const { data } = await this.$axios.get(`/api/products/${product.id}`)
        const fullProduct = data.data || data
        
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

        const result = await this.$store.dispatch('addToCart', {
          firebaseUid: this.firebaseUid,
          productId: product.id,
          qty: 1,
          variant: variantDisplay,
          variantId: variantId
        })

        if (result.success) {
          this.$nuxt.$emit('show-snackbar', {
            message: `${product.name} added to cart!`,
            color: 'black'
          })
        } else {
          this.$nuxt.$emit('show-snackbar', {
            message: result.error || 'Failed to add to cart',
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
      title: this.searchQuery ? `Search: ${this.searchQuery} | Clean Heart` : 'Search | Clean Heart',
      meta: [
        { hid: 'description', name: 'description', content: this.searchQuery ? `Search results for "${this.searchQuery}"` : 'Search for products at Clean Heart' }
      ]
    }
  }
}
</script>

<style scoped>
.search-input ::v-deep .v-input__slot {
  border-radius: 0 !important;
  border: 2px solid #e0e0e0 !important;
}
.search-input ::v-deep .v-input__slot:hover {
  border-color: #000 !important;
}
.search-input ::v-deep .v-input__slot:focus-within {
  border-color: #E53935 !important;
}
.search-input ::v-deep .v-icon {
  color: #999 !important;
}

.category-card {
  transition: all 0.3s ease;
}
.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  border-color: #E53935 !important;
}

.product-card {
  transition: all 0.3s ease;
}
.product-card:hover .product-overlay {
  opacity: 1 !important;
}
.product-card:hover {
  transform: translateY(-3px);
}

.product-overlay {
  transition: opacity 0.3s ease;
}
</style>