<!-- components/admin/ProductsSection.vue -->
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

    <!-- Products Table -->
    <v-card style="border-radius: 0;">
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="products"
          :loading="loading"
          loading-text="Loading products..."
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
            ${{ parseFloat(item.base_price).toFixed(2) }}
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

    <!-- Product Dialog -->
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card style="border-radius: 0;">
        <v-card-title style="background: #000; color: #fff; padding: 16px 24px;">
          {{ editingProduct ? 'Edit Product' : 'Add Product' }}
          <v-spacer />
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form ref="productForm" @submit.prevent="saveProduct">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.name"
                  label="Product Name"
                  outlined
                  dense
                  hide-details
                  required
                  style="border-radius: 0;"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="form.slug"
                  label="Slug"
                  outlined
                  dense
                  hide-details
                  style="border-radius: 0;"
                  hint="Auto-generated from name"
                  persistent-hint
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="form.short_description"
                  label="Short Description"
                  outlined
                  dense
                  hide-details
                  rows="2"
                  style="border-radius: 0;"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="form.description"
                  label="Full Description"
                  outlined
                  dense
                  hide-details
                  rows="4"
                  style="border-radius: 0;"
                />
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model="form.base_price"
                  label="Base Price"
                  outlined
                  dense
                  hide-details
                  type="number"
                  step="0.01"
                  prefix="$"
                  required
                  style="border-radius: 0;"
                />
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model="form.compare_price"
                  label="Compare Price"
                  outlined
                  dense
                  hide-details
                  type="number"
                  step="0.01"
                  prefix="$"
                  style="border-radius: 0;"
                />
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="form.category_id"
                  :items="categories"
                  item-text="name"
                  item-value="id"
                  label="Category"
                  outlined
                  dense
                  hide-details
                  style="border-radius: 0;"
                />
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model="form.brand"
                  label="Brand"
                  outlined
                  dense
                  hide-details
                  style="border-radius: 0;"
                />
              </v-col>

              <v-col cols="6">
                <v-select
                  v-model="form.gender"
                  :items="['men', 'women', 'unisex']"
                  label="Gender"
                  outlined
                  dense
                  hide-details
                  style="border-radius: 0;"
                />
              </v-col>

              <v-col cols="3">
                <v-switch
                  v-model="form.is_active"
                  label="Active"
                  color="#E53935"
                  hide-details
                />
              </v-col>

              <v-col cols="3">
                <v-switch
                  v-model="form.is_featured"
                  label="Featured"
                  color="#E53935"
                  hide-details
                />
              </v-col>

              <v-col cols="3">
                <v-switch
                  v-model="form.is_bestseller"
                  label="Best Seller"
                  color="#E53935"
                  hide-details
                />
              </v-col>

              <v-col cols="3">
                <v-switch
                  v-model="form.is_new"
                  label="New"
                  color="#E53935"
                  hide-details
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4" style="border-top: 1px solid #f0f0f0;">
          <v-spacer />
          <v-btn text style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px;" @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn color="black" dark style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px;" :loading="saving" @click="saveProduct">
            {{ editingProduct ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
          params: { search: this.search }
        })
        if (data.success) {
          this.products = data.data
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        this.$nuxt.$emit('show-snackbar', { message: 'Failed to load products', color: 'error' })
      } finally {
        this.loading = false
      }
    },

    async fetchCategories() {
      try {
        const { data } = await this.$axios.get('/api/admin/categories')
        if (data.success) {
          this.categories = data.data
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    },

    openProductDialog(product = null) {
      this.editingProduct = product
      if (product) {
        this.form = { ...product }
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
      if (!confirm(`Delete "${product.name}"?`)) return

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