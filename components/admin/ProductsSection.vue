<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6 flex-wrap" style="gap: 12px;">
      <h2 style="font-size: 1.5rem; font-weight: 700;">Products</h2>
      <div class="d-flex" style="gap: 8px;">
        <v-text-field
          v-model="search"
          placeholder="Search products..."
          dense
          outlined
          hide-details
          style="max-width: 250px; border-radius: 0;"
          prepend-inner-icon="mdi-magnify"
          @input="fetchProducts"
        />
        <v-btn color="black" dark style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.7rem;" @click="openProductDialog()">
          <v-icon left size="16">mdi-plus</v-icon>
          Add Product
        </v-btn>
      </div>
    </div>

    <v-card style="border-radius: 0;">
      <v-card-text>
        <div v-if="loading" class="d-flex justify-center pa-8">
          <v-progress-circular indeterminate color="#E53935" size="40" />
        </div>
        <div v-else-if="products.length === 0" class="text-center pa-8" style="color: #999;">
          <v-icon size="48" color="grey lighten-1">mdi-package-variant</v-icon>
          <p class="mt-4">No products found. Click "Add Product" to create one.</p>
        </div>
        <v-data-table
          v-else
          :headers="headers"
          :items="products"
          :items-per-page="20"
          :search="search"
          style="font-size: 0.8rem;"
        >
          <template #item.image_url="{ item }">
            <v-img
              :src="item.image_url || '/placeholder-product.jpg'"
              width="50"
              height="60"
              contain
              style="background: #f5f5f5;"
            />
          </template>

          <template #item.base_price="{ item }">
            Ksh {{ parseFloat(item.base_price || 0).toFixed(2) }}
          </template>

          <template #item.total_stock="{ item }">
            {{ item.total_stock || 0 }}
          </template>

          <template #item.variant_count="{ item }">
            {{ item.variant_count || 0 }}
          </template>

          <template #item.is_active="{ item }">
            <v-chip :color="item.is_active ? 'green' : 'red'" small dark>
              {{ item.is_active ? 'Active' : 'Inactive' }}
            </v-chip>
          </template>

          <template #item.actions="{ item }">
            <v-btn icon small color="primary" @click="openProductDialog(item)">
              <v-icon size="18">mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon small color="error" @click="deleteProduct(item)">
              <v-icon size="18">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Product Dialog (same as before) -->
    <!-- ... product dialog code ... -->
  </div>
</template>

<script>
export default {
  name: 'ProductsSection',
  data() {
    return {
      products: [],
      categories: [],
      loading: false,
      saving: false,
      search: '',
      dialog: false,
      editingProduct: null,
      form: {
        name: '',
        slug: '',
        short_description: '',
        description: '',
        base_price: '',
        compare_price: '',
        category_id: null,
        brand: '',
        gender: 'unisex',
        is_active: true,
        is_featured: false,
        is_bestseller: false,
        is_new: true,
        image_url: ''
      },
      headers: [
        { title: 'Image', key: 'image_url', sortable: false },
        { title: 'Name', key: 'name' },
        { title: 'Category', key: 'category_name' },
        { title: 'Price', key: 'base_price' },
        { title: 'Stock', key: 'total_stock' },
        { title: 'Variants', key: 'variant_count' },
        { title: 'Status', key: 'is_active' },
        { title: 'Actions', key: 'actions', sortable: false },
      ]
    }
  },
  mounted() {
    this.fetchProducts()
    this.fetchCategories()
  },
  watch: {
    'form.name'(val) {
      if (!this.editingProduct) {
        this.form.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      }
    }
  },
  methods: {
    async fetchProducts() {
      this.loading = true
      try {
        const { data } = await this.$axios.get('/api/admin/products', {
          params: { search: this.search, limit: 100 }
        })
        if (data.success) {
          this.products = data.data || []
        } else {
          this.products = []
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        this.products = []
        this.$nuxt.$emit('show-snackbar', { 
          message: error.response?.data?.error || 'Failed to load products', 
          color: 'error' 
        })
      } finally {
        this.loading = false
      }
    },

    async fetchCategories() {
      try {
        const { data } = await this.$axios.get('/api/admin/categories')
        if (data.success) {
          this.categories = data.data || []
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    },

    openProductDialog(product = null) {
      this.editingProduct = product
      if (product) {
        this.form = { 
          ...product,
          base_price: product.base_price || '',
          compare_price: product.compare_price || ''
        }
      } else {
        this.resetForm()
      }
      this.dialog = true
    },

    resetForm() {
      this.form = {
        name: '',
        slug: '',
        short_description: '',
        description: '',
        base_price: '',
        compare_price: '',
        category_id: null,
        brand: '',
        gender: 'unisex',
        is_active: true,
        is_featured: false,
        is_bestseller: false,
        is_new: true,
        image_url: ''
      }
    },

    async saveProduct() {
      if (!this.form.name || !this.form.base_price) {
        this.$nuxt.$emit('show-snackbar', { message: 'Name and price are required', color: 'error' })
        return
      }

      this.saving = true
      try {
        let response
        if (this.editingProduct) {
          response = await this.$axios.put(`/api/admin/products/${this.editingProduct.id}`, this.form)
        } else {
          response = await this.$axios.post('/api/admin/products', this.form)
        }

        if (response.data.success) {
          this.$nuxt.$emit('show-snackbar', {
            message: `Product ${this.editingProduct ? 'updated' : 'created'} successfully`,
            color: '#E53935'
          })
          this.dialog = false
          this.fetchProducts()
        }
      } catch (error) {
        this.$nuxt.$emit('show-snackbar', {
          message: error.response?.data?.error || 'Failed to save product',
          color: 'error'
        })
      } finally {
        this.saving = false
      }
    },

    async deleteProduct(product) {
      if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return

      try {
        const { data } = await this.$axios.delete(`/api/admin/products/${product.id}`)
        if (data.success) {
          this.$nuxt.$emit('show-snackbar', { message: 'Product deleted', color: '#E53935' })
          this.fetchProducts()
        }
      } catch (error) {
        this.$nuxt.$emit('show-snackbar', {
          message: error.response?.data?.error || 'Failed to delete product',
          color: 'error'
        })
      }
    }
  }
}
</script>