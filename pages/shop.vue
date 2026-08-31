<template>
  <div style="margin-top: 64px;">
    <!-- Page Header -->
    <section style="background: #f8f8f8; padding: 60px 0;">
      <v-container>
        <div class="text-center">
          <h1 style="font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 900; color: #000; text-transform: uppercase; letter-spacing: -2px; margin-bottom: 12px;">
            Shop
          </h1>
          <p style="font-size: 0.9rem; color: #666;">
            {{ filteredProducts.length }} products available
          </p>
        </div>
      </v-container>
    </section>

    <!-- Filters & Products -->
    <section style="padding: 40px 0 80px;">
      <v-container>
        <v-row>
          <!-- Sidebar Filters -->
          <v-col cols="12" md="3" class="d-none d-md-block">
            <div style="position: sticky; top: 80px;">
              <!-- Categories -->
              <div class="mb-8">
                <div style="font-size: 0.75rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #000; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
                  Categories
                </div>
                <div
                  v-for="cat in categories"
                  :key="cat"
                  class="d-flex align-center justify-space-between py-2"
                  style="cursor: pointer; border-bottom: 1px solid #f0f0f0;"
                  @click="toggleCategory(cat)"
                >
                  <span :style="selectedCategories.includes(cat) ? 'font-weight: 700; color: #E53935;' : 'font-weight: 500; color: #333;'" style="font-size: 0.85rem;">
                    {{ cat }}
                  </span>
                  <v-icon v-if="selectedCategories.includes(cat)" color="#E53935" size="16">mdi-check</v-icon>
                </div>
              </div>

              <!-- Price Range -->
              <div class="mb-8">
                <div style="font-size: 0.75rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #000; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
                  Price Range
                </div>
                <v-range-slider
                  v-model="priceRange"
                  :max="maxPrice"
                  :min="0"
                  hide-details
                  class="mb-4"
                  color="#E53935"
                  track-color="#e0e0e0"
                />
                <div class="d-flex justify-space-between">
                  <span style="font-size: 0.8rem; font-weight: 600;">${{ priceRange[0] }}</span>
                  <span style="font-size: 0.8rem; font-weight: 600;">${{ priceRange[1] }}</span>
                </div>
              </div>

              <!-- Sizes -->
              <div class="mb-8">
                <div style="font-size: 0.75rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #000; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
                  Size
                </div>
                <div class="d-flex flex-wrap" style="gap: 8px;">
                  <v-btn
                    v-for="size in sizes"
                    :key="size"
                    :outlined="!selectedSizes.includes(size)"
                    :color="selectedSizes.includes(size) ? 'black' : 'grey lighten-3'"
                    :dark="selectedSizes.includes(size)"
                    height="36"
                    min-width="36"
                    class="pa-0"
                    style="border-radius: 0; font-size: 0.7rem; font-weight: 600;"
                    @click="toggleSize(size)"
                  >
                    {{ size }}
                  </v-btn>
                </div>
              </div>

              <!-- Colors -->
              <div class="mb-8">
                <div style="font-size: 0.75rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #000; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
                  Colors
                </div>
                <div class="d-flex flex-wrap" style="gap: 10px;">
                  <div
                    v-for="color in colorOptions"
                    :key="color.name"
                    class="d-flex align-center justify-center"
                    style="width: 28px; height: 28px; border-radius: 50%; cursor: pointer; border: 2px solid transparent;"
                    :style="selectedColors.includes(color.name) ? 'border-color: #E53935;' : ''"
                    @click="toggleColor(color.name)"
                  >
                    <div :style="`width: 20px; height: 20px; border-radius: 50%; background: ${color.hex}; border: 1px solid #e0e0e0;`" />
                  </div>
                </div>
              </div>

              <!-- Sort -->
              <div>
                <div style="font-size: 0.75rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #000; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
                  Sort By
                </div>
                <v-select
                  v-model="sortBy"
                  :items="sortOptions"
                  dense
                  outlined
                  hide-details
                  style="border-radius: 0; font-size: 0.8rem;"
                />
              </div>
            </div>
          </v-col>

          <!-- Mobile Filters -->
          <v-col cols="12" class="d-md-none mb-4">
            <v-btn
              block
              outlined
              color="black"
              height="48"
              style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.75rem;"
              @click="mobileFilters = true"
            >
              <v-icon left size="18">mdi-filter-variant</v-icon>
              Filters
            </v-btn>
          </v-col>

          <!-- Product Grid -->
          <v-col cols="12" md="9">
            <!-- Active Filters -->
            <div v-if="hasActiveFilters" class="d-flex flex-wrap align-center mb-4" style="gap: 8px;">
              <span style="font-size: 0.75rem; color: #666;">Active filters:</span>
              <v-chip
                v-for="filter in activeFilterChips"
                :key="filter"
                small
                close
                style="border-radius: 0; font-size: 0.7rem;"
                @click:close="removeFilter(filter)"
              >
                {{ filter }}
              </v-chip>
              <v-btn text small color="#E53935" style="font-size: 0.7rem; text-transform: uppercase;" @click="clearAllFilters">
                Clear All
              </v-btn>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="d-flex justify-center py-12">
              <v-progress-circular indeterminate color="#E53935" size="48" />
            </div>

            <!-- No Results -->
            <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
              <v-icon size="64" color="grey lighten-1">mdi-package-variant-remove</v-icon>
              <h3 class="mt-4" style="font-size: 1.2rem; font-weight: 600;">No products found</h3>
              <p class="grey--text mt-2">Try adjusting your filters</p>
              <v-btn color="black" dark class="mt-4" style="border-radius: 0; text-transform: uppercase;" @click="clearAllFilters">
                Clear Filters
              </v-btn>
            </div>

            <!-- Products -->
            <v-row v-else>
              <v-col
                v-for="product in paginatedProducts"
                :key="product.id"
                cols="6"
                md="4"
                class="mb-6"
              >
                <nuxt-link :to="`/product/${product.id}`" style="text-decoration: none;">
                  <div class="product-card" style="cursor: pointer; position: relative;">
                    <div
                      v-if="product.badge || product.is_new || product.is_best_seller"
                      class="d-flex align-center justify-center"
                      style="position: absolute; top: 10px; left: 10px; z-index: 2; background: #E53935; color: white; font-size: 0.6rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 3px 8px;"
                    >
                      {{ product.badge || (product.is_new ? 'New' : 'Best Seller') }}
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
                        <v-btn color="white" dark height="40" class="px-5" style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.65rem; font-weight: 600;" @click.prevent="quickAdd(product)">
                          Quick Add
                        </v-btn>
                      </div>
                    </div>

                    <div>
                      <div style="font-size: 0.75rem; font-weight: 600; color: #000; margin-bottom: 3px;">{{ product.name }}</div>
                      <div class="d-flex align-center justify-space-between">
                        <span style="font-size: 0.8rem; font-weight: 700; color: #000;">${{ parseFloat(product.price).toFixed(2) }}</span>
                        <div v-if="product.colors" class="d-flex" style="gap: 3px;">
                          <div v-for="c in product.colors.split(',').slice(0,3)" :key="c" style="width: 10px; height: 10px; border-radius: 50%; border: 1px solid #ddd;" :style="`background: ${c.trim()};`" />
                        </div>
                      </div>
                    </div>
                  </div>
                </nuxt-link>
              </v-col>
            </v-row>

            <!-- Pagination -->
            <div v-if="filteredProducts.length > itemsPerPage" class="d-flex justify-center mt-8">
              <v-pagination
                v-model="currentPage"
                :length="totalPages"
                :total-visible="7"
                color="black"
                style="border-radius: 0;"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Mobile Filter Drawer -->
    <v-bottom-sheet v-model="mobileFilters">
      <v-sheet class="pa-6" style="border-radius: 16px 16px 0 0;">
        <div class="d-flex justify-space-between align-center mb-6">
          <span style="font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Filters</span>
          <v-btn icon @click="mobileFilters = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <div class="mb-6">
          <div style="font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px;">Categories</div>
          <v-chip-group v-model="selectedCategories" multiple column>
            <v-chip v-for="cat in categories" :key="cat" :value="cat" filter style="border-radius: 0;">{{ cat }}</v-chip>
          </v-chip-group>
        </div>

        <div class="mb-6">
          <div style="font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px;">Size</div>
          <v-chip-group v-model="selectedSizes" multiple column>
            <v-chip v-for="size in sizes" :key="size" :value="size" filter style="border-radius: 0;">{{ size }}</v-chip>
          </v-chip-group>
        </div>

        <div class="mb-6">
          <div style="font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px;">Sort By</div>
          <v-select v-model="sortBy" :items="sortOptions" dense outlined hide-details />
        </div>

        <v-btn block color="black" dark height="48" style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px;" @click="mobileFilters = false">
          Apply Filters
        </v-btn>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ShopPage',
  data() {
    return {
      mobileFilters: false,
      currentPage: 1,
      itemsPerPage: 12,
      selectedCategories: [],
      selectedSizes: [],
      selectedColors: [],
      priceRange: [0, 200],
      sortBy: 'Featured',
      categories: ['Hoodies', 'Sweatshirts', 'T-Shirts', 'Crop Tops'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colorOptions: [
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#ffffff' },
        { name: 'Red', hex: '#E53935' },
        { name: 'Gray', hex: '#9e9e9e' },
      ],
      sortOptions: ['Featured', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Best Selling'],
    }
  },
  computed: {
    ...mapState({
      products: state => state.products,
      loading: state => state.loading,
    }),
    maxPrice() {
      if (!this.products.length) return 200
      return Math.ceil(Math.max(...this.products.map(p => parseFloat(p.price) || 0)))
    },
    filteredProducts() {
      let result = [...this.products]

      if (this.selectedCategories.length > 0) {
        result = result.filter(p => this.selectedCategories.includes(p.category))
      }

      result = result.filter(p => {
        const price = parseFloat(p.price) || 0
        return price >= this.priceRange[0] && price <= this.priceRange[1]
      })

      switch (this.sortBy) {
        case 'Price: Low to High':
          result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
          break
        case 'Price: High to Low':
          result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
          break
        case 'Newest':
          result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          break
        case 'Best Selling':
          result.sort((a, b) => (b.sold_count || 0) - (a.sold_count || 0))
          break
      }

      return result
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      return this.filteredProducts.slice(start, start + this.itemsPerPage)
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage)
    },
    hasActiveFilters() {
      return this.selectedCategories.length > 0 || this.selectedSizes.length > 0 ||
             this.selectedColors.length > 0 || this.priceRange[0] > 0 || this.priceRange[1] < this.maxPrice
    },
    activeFilterChips() {
      const chips = []
      this.selectedCategories.forEach(c => chips.push(c))
      this.selectedSizes.forEach(s => chips.push(`Size: ${s}`))
      this.selectedColors.forEach(c => chips.push(`Color: ${c}`))
      if (this.priceRange[0] > 0 || this.priceRange[1] < this.maxPrice) {
        chips.push(`$${this.priceRange[0]} - $${this.priceRange[1]}`)
      }
      return chips
    },
    firebaseUid() {
      return this.$store.state.authUser?.uid || null
    }
  },
  watch: {
    filteredProducts() {
      this.currentPage = 1
    }
  },
  async fetch({ store, query }) {
    await store.dispatch('fetchProducts')
    await store.dispatch('fetchCategories')
  },
  mounted() {
    const category = this.$route.query.category
    if (category && this.categories.map(c => c.toLowerCase()).includes(category.toLowerCase())) {
      const matched = this.categories.find(c => c.toLowerCase() === category.toLowerCase())
      if (matched) this.selectedCategories = [matched]
    }
  },
  methods: {
    toggleCategory(cat) {
      const idx = this.selectedCategories.indexOf(cat)
      if (idx > -1) {
        this.selectedCategories.splice(idx, 1)
      } else {
        this.selectedCategories.push(cat)
      }
    },
    toggleSize(size) {
      const idx = this.selectedSizes.indexOf(size)
      if (idx > -1) {
        this.selectedSizes.splice(idx, 1)
      } else {
        this.selectedSizes.push(size)
      }
    },
    toggleColor(color) {
      const idx = this.selectedColors.indexOf(color)
      if (idx > -1) {
        this.selectedColors.splice(idx, 1)
      } else {
        this.selectedColors.push(color)
      }
    },
    removeFilter(filter) {
      if (this.selectedCategories.includes(filter)) {
        this.selectedCategories = this.selectedCategories.filter(c => c !== filter)
      }
      if (filter.startsWith('Size:')) {
        const size = filter.replace('Size: ', '')
        this.selectedSizes = this.selectedSizes.filter(s => s !== size)
      }
      if (filter.startsWith('Color:')) {
        const color = filter.replace('Color: ', '')
        this.selectedColors = this.selectedColors.filter(c => c !== color)
      }
    },
    clearAllFilters() {
      this.selectedCategories = []
      this.selectedSizes = []
      this.selectedColors = []
      this.priceRange = [0, this.maxPrice]
      this.sortBy = 'Featured'
    },
    async quickAdd(product) {
      if (!this.firebaseUid) {
        this.$router.push('/login?redirect=/shop')
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
    }
  }
}
</script>

<style scoped>
.product-card:hover .product-overlay {
  opacity: 1 !important;
}
</style>