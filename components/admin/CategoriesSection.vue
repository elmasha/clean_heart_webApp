<!-- components/admin/CategoriesSection.vue -->
<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6 flex-wrap" style="gap: 12px;">
      <h2 style="font-size: 1.5rem; font-weight: 700;">Categories</h2>
      <v-btn color="black" dark style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.7rem;" @click="openCategoryDialog()">
        <v-icon left size="16">mdi-plus</v-icon>
        Add Category
      </v-btn>
    </div>

    <v-card style="border-radius: 0;">
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="categories"
          :loading="loading"
          loading-text="Loading categories..."
          style="font-size: 0.8rem;"
        >
          <template #item.product_count="{ item }">
            <v-chip small>{{ item.product_count || 0 }}</v-chip>
          </template>

          <template #item.actions="{ item }">
            <v-btn icon small color="primary" @click="openCategoryDialog(item)">
              <v-icon size="18">mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon small color="error" @click="deleteCategory(item)">
              <v-icon size="18">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Category Dialog -->
    <v-dialog v-model="dialog" max-width="450" persistent>
      <v-card style="border-radius: 0;">
        <v-card-title style="background: #000; color: #fff; padding: 16px 24px;">
          {{ editingCategory ? 'Edit Category' : 'Add Category' }}
          <v-spacer />
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form @submit.prevent="saveCategory">
            <v-text-field
              v-model="form.name"
              label="Category Name"
              outlined
              dense
              hide-details
              required
              style="border-radius: 0;"
            />

            <v-text-field
              v-model="form.slug"
              label="Slug"
              outlined
              dense
              hide-details
              class="mt-4"
              style="border-radius: 0;"
              hint="Auto-generated from name"
              persistent-hint
            />
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4" style="border-top: 1px solid #f0f0f0;">
          <v-spacer />
          <v-btn text style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px;" @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn color="black" dark style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px;" :loading="saving" @click="saveCategory">
            {{ editingCategory ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'CategoriesSection',
  data() {
    return {
      categories: [],
      loading: false,
      saving: false,
      dialog: false,
      editingCategory: null,
      form: {
        name: '',
        slug: '',
      },
      headers: [
        { title: 'ID', key: 'id' },
        { title: 'Name', key: 'name' },
        { title: 'Slug', key: 'slug' },
        { title: 'Products', key: 'product_count' },
        { title: 'Actions', key: 'actions', sortable: false },
      ]
    }
  },
  mounted() {
    this.fetchCategories()
  },
  watch: {
    'form.name'(val) {
      if (!this.editingCategory) {
        this.form.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      }
    }
  },
  methods: {
    async fetchCategories() {
      this.loading = true
      try {
        const { data } = await this.$axios.get('/api/admin/categories')
        if (data.success) {
          this.categories = data.data
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        this.loading = false
      }
    },

    openCategoryDialog(category = null) {
      this.editingCategory = category
      this.form = category ? { ...category } : { name: '', slug: '' }
      this.dialog = true
    },

    async saveCategory() {
      if (!this.form.name) {
        this.$nuxt.$emit('show-snackbar', { message: 'Category name is required', color: 'error' })
        return
      }

      this.saving = true
      try {
        let response
        if (this.editingCategory) {
          response = await this.$axios.put(`/api/admin/categories/${this.editingCategory.id}`, this.form)
        } else {
          response = await this.$axios.post('/api/admin/categories', this.form)
        }

        if (response.data.success) {
          this.$nuxt.$emit('show-snackbar', {
            message: `Category ${this.editingCategory ? 'updated' : 'created'} successfully`,
            color: '#E53935'
          })
          this.dialog = false
          this.fetchCategories()
        }
      } catch (error) {
        this.$nuxt.$emit('show-snackbar', {
          message: error.response?.data?.error || 'Failed to save category',
          color: 'error'
        })
      } finally {
        this.saving = false
      }
    },

    async deleteCategory(category) {
      if (category.product_count > 0) {
        this.$nuxt.$emit('show-snackbar', {
          message: `Cannot delete category with ${category.product_count} products. Reassign products first.`,
          color: 'error'
        })
        return
      }

      if (!confirm(`Delete category "${category.name}"?`)) return

      try {
        const { data } = await this.$axios.delete(`/api/admin/categories/${category.id}`)
        if (data.success) {
          this.$nuxt.$emit('show-snackbar', { message: 'Category deleted', color: '#E53935' })
          this.fetchCategories()
        }
      } catch (error) {
        this.$nuxt.$emit('show-snackbar', {
          message: error.response?.data?.error || 'Failed to delete category',
          color: 'error'
        })
      }
    }
  }
}
</script>