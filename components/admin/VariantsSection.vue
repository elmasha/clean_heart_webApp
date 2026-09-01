<!-- components/admin/VariantsSection.vue -->
<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6 flex-wrap" style="gap: 12px;">
      <h2 style="font-size: 1.5rem; font-weight: 700;">Variants</h2>
      <div class="d-flex" style="gap: 8px;">
        <v-select
          v-model="selectedProduct"
          :items="products"
          item-text="name"
          item-value="id"
          label="Select Product"
          outlined
          dense
          hide-details
          style="min-width: 200px; border-radius: 0;"
          @change="fetchVariants"
        />
        <v-btn color="black" dark style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.7rem;" :disabled="!selectedProduct" @click="openVariantDialog()">
          <v-icon left size="16">mdi-plus</v-icon>
          Add Variant
        </v-btn>
      </div>
    </div>

    <v-card style="border-radius: 0;">
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="variants"
          :loading="loading"
          loading-text="Loading variants..."
          style="font-size: 0.8rem;"
        >
          <template #item.image_url="{ item }">
            <v-img
              :src="item.image_url || '/placeholder-product.jpg'"
              width="40"
              height="50"
              contain
              style="background: #f5f5f5;"
            />
          </template>

          <template #item.price_override="{ item }">
            ${{ parseFloat(item.price_override || item.base_price || 0).toFixed(2) }}
          </template>

          <template #item.is_active="{ item }">
            <v-chip :color="item.is_active ? 'green' : 'red'" small dark>
              {{ item.is_active ? 'Active' : 'Inactive' }}
            </v-chip>
          </template>

          <template #item.stock_quantity="{ item }">
            <span :style="item.stock_quantity <= item.low_stock_threshold ? 'color: #E53935; font-weight: 600;' : ''">
              {{ item.stock_quantity }}
            </span>
          </template>

          <template #item.actions="{ item }">
            <v-btn icon small color="primary" @click="openVariantDialog(item)">
              <v-icon size="18">mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon small color="error" @click="deleteVariant(item)">
              <v-icon size="18">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>

        <div v-if="!selectedProduct" class="text-center pa-8" style="color: #999;">
          <v-icon size="48" color="grey lighten-1">mdi-palette</v-icon>
          <p class="mt-2">Select a product to manage its variants</p>
        </div>
      </v-card-text>
    </v-card>

    <!-- Variant Dialog -->
    <v-dialog v-model="dialog" max-width="550" persistent>
      <v-card style="border-radius: 0;">
        <v-card-title style="background: #000; color: #fff; padding: 16px 24px;">
          {{ editingVariant ? 'Edit Variant' : 'Add Variant' }}
          <v-spacer />
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form @submit.prevent="saveVariant">
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="form.sku"
                  label="SKU"
                  outlined
                  dense
                  hide-details
                  required
                  style="border-radius: 0;"
                />
              </v-col>

              <v-col cols="3">
                <v-text-field
                  v-model="form.size"
                  label="Size"
                  outlined
                  dense
                  hide-details
                  style="border-radius: 0;"
                />
              </v-col>

              <v-col cols="3">
                <v-text-field
                  v-model="form.color"
                  label="Color"
                  outlined
                  dense
                  hide-details
                  style="border-radius: 0;"
                />
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model="form.color_hex"
                  label="Color HEX"
                  outlined
                  dense
                  hide-details
                  placeholder="#000000"
                  style="border-radius: 0;"
                />
              </v-col>

              <v-col cols="6">
                <div class="d-flex align-center" style="gap: 12px;">
                  <div
                    :style="`width: 36px; height: 36px; border-radius: 50%; background: ${form.color_hex || '#000'}; border: 1px solid #e0e0e0;`"
                  />
                  <span style="font-size: 0.75rem; color: #999;">Preview</span>
                </div>
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model="form.price_override"
                  label="Price Override"
                  outlined
                  dense
                  hide-details
                  type="number"
                  step="0.01"
                  prefix="$"
                  style="border-radius: 0;"
                  hint="Leave empty to use product base price"
                  persistent-hint
                />
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model="form.stock_quantity"
                  label="Stock Quantity"
                  outlined
                  dense
                  hide-details
                  type="number"
                  required
                  style="border-radius: 0;"
                />
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model="form.low_stock_threshold"
                  label="Low Stock Threshold"
                  outlined
                  dense
                  hide-details
                  type="number"
                  style="border-radius: 0;"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="form.image_url"
                  label="Image URL"
                  outlined
                  dense
                  hide-details
                  placeholder="https://example.com/image.jpg"
                  style="border-radius: 0;"
                />
              </v-col>

              <v-col cols="6">
                <v-switch
                  v-model="form.is_active"
                  label="Active"
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
          <v-btn color="black" dark style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px;" :loading="saving" @click="saveVariant">
            {{ editingVariant ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'VariantsSection',
  data() {
    return {
      products: [],
      variants: [],
      selectedProduct: null,
      loading: false,
      saving: false,
      dialog: false,
      editingVariant: null,
      form: {
        sku: '',
        size: '',
        color: '',
        color_hex: '#000000',
        price_override: '',
        stock_quantity: 0,
        low_stock_threshold: 5,
        image_url: '',
        is_active: true,
      },
      headers: [
        { title: 'Image', key: 'image_url', sortable: false },
        { title: 'SKU', key: 'sku' },
        { title: 'Size', key: 'size' },
        { title: 'Color', key: 'color' },
        { title: 'Price', key: 'price_override' },
        { title: 'Stock', key: 'stock_quantity' },
        { title: 'Status', key: 'is_active' },
        { title: 'Actions', key: 'actions', sortable: false },
      ]
    }
  },
  mounted() {
    this.fetchProducts()
  },
  methods: {
    async fetchProducts() {
      try {
        const { data } = await this.$axios.get('/api/admin/products', { params: { limit: 100 } })
        if (data.success) {
          this.products = data.data
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    },

    async fetchVariants() {
      if (!this.selectedProduct) {
        this.variants = []
        return
      }

      this.loading = true
      try {
        const { data } = await this.$axios.get(`/api/admin/products/${this.selectedProduct}/variants`)
        if (data.success) {
          this.variants = data.data
        }
      } catch (error) {
        console.error('Error fetching variants:', error)
      } finally {
        this.loading = false
      }
    },

    openVariantDialog(variant = null) {
      this.editingVariant = variant
      if (variant) {
        this.form = { ...variant }
      } else {
        this.form = {
          sku: '',
          size: '',
          color: '',
          color_hex: '#000000',
          price_override: '',
          stock_quantity: 0,
          low_stock_threshold: 5,
          image_url: '',
          is_active: true,
        }
      }
      this.dialog = true
    },

    async saveVariant() {
      if (!this.form.sku || this.form.stock_quantity === undefined) {
        this.$nuxt.$emit('show-snackbar', { message: 'SKU and stock quantity are required', color: 'error' })
        return
      }

      this.saving = true
      try {
        let response
        if (this.editingVariant) {
          response = await this.$axios.put(`/api/admin/variants/${this.editingVariant.id}`, this.form)
        } else {
          response = await this.$axios.post(`/api/admin/products/${this.selectedProduct}/variants`, this.form)
        }

        if (response.data.success) {
          this.$nuxt.$emit('show-snackbar', {
            message: `Variant ${this.editingVariant ? 'updated' : 'created'} successfully`,
            color: '#E53935'
          })
          this.dialog = false
          this.fetchVariants()
        }
      } catch (error) {
        this.$nuxt.$emit('show-snackbar', {
          message: error.response?.data?.error || 'Failed to save variant',
          color: 'error'
        })
      } finally {
        this.saving = false
      }
    },

    async deleteVariant(variant) {
      if (!confirm(`Delete variant "${variant.sku}"?`)) return

      try {
        const { data } = await this.$axios.delete(`/api/admin/variants/${variant.id}`)
        if (data.success) {
          this.$nuxt.$emit('show-snackbar', { message: 'Variant deleted', color: '#E53935' })
          this.fetchVariants()
        }
      } catch (error) {
        this.$nuxt.$emit('show-snackbar', {
          message: error.response?.data?.error || 'Failed to delete variant',
          color: 'error'
        })
      }
    }
  }
}
</script>