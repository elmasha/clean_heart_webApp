<template>
  <div style="margin-top: 64px; background: #f5f5f5; min-height: calc(100vh - 64px);">
    <v-container fluid class="pa-4">
      <v-row>
        <!-- Sidebar -->
        <v-col cols="12" md="3" lg="2">
          <v-card class="pa-4" style="border-radius: 0; position: sticky; top: 80px;">
            <div class="text-center mb-6">
              <div
                class="d-flex align-center justify-center mx-auto mb-2"
                style="width: 48px; height: 48px; border-radius: 50%; background: #000;"
              >
                <v-icon color="#E53935" size="24">mdi-heart</v-icon>
              </div>
              <div style="font-weight: 700; font-size: 0.9rem;">Admin Panel</div>
              <div style="font-size: 0.7rem; color: #999;">Clean Heart</div>
            </div>

            <v-divider class="mb-4" />

            <v-list dense nav>
              <v-list-item
                v-for="item in menuItems"
                :key="item.id"
                :active="activeSection === item.id"
                @click="activeSection = item.id"
                style="border-radius: 0;"
              >
                <v-list-item-icon>
                  <v-icon size="20">{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-title style="font-size: 0.8rem; font-weight: 500;">
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <!-- Main Content -->
        <v-col cols="12" md="9" lg="10">
          <!-- Dashboard -->
          <template v-if="activeSection === 'dashboard'">
            <div>
              <div class="d-flex justify-space-between align-center mb-6">
                <h2 style="font-size: 1.5rem; font-weight: 700;">Dashboard</h2>
                <v-btn color="#E53935" dark small style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.7rem;" @click="fetchDashboardData">
                  <v-icon left size="16">mdi-refresh</v-icon>
                  Refresh
                </v-btn>
              </div>

              <v-row>
                <v-col cols="6" sm="3" v-for="stat in stats" :key="stat.label">
                  <v-card style="border-radius: 0; border-left: 4px solid #E53935;">
                    <v-card-text>
                      <div style="font-size: 0.7rem; color: #999; text-transform: uppercase; letter-spacing: 1px;">
                        {{ stat.label }}
                      </div>
                      <div style="font-size: 1.8rem; font-weight: 700; color: #000;">
                        {{ stat.value }}
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <v-card class="mt-4" style="border-radius: 0;">
                <v-card-title style="font-size: 1rem; font-weight: 600;">
                  <v-icon left size="20" color="#E53935">mdi-alert-circle</v-icon>
                  Low Stock Alerts
                </v-card-title>
                <v-divider />
                <v-card-text>
                  <div v-if="loadingDashboard" class="d-flex justify-center pa-4">
                    <v-progress-circular indeterminate color="#E53935" size="24" />
                  </div>
                  <div v-else-if="lowStock.length === 0" class="text-center pa-4" style="color: #999;">
                    All products have sufficient stock ✅
                  </div>
                  <div v-else>
                    <v-simple-table>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>SKU</th>
                          <th>Size</th>
                          <th>Color</th>
                          <th>Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in lowStock" :key="item.variant_id">
                          <td>{{ item.name }}</td>
                          <td>{{ item.sku }}</td>
                          <td>{{ item.size }}</td>
                          <td>{{ item.color }}</td>
                          <td style="color: #E53935; font-weight: 600;">{{ item.stock_quantity }}</td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </div>
                </v-card-text>
              </v-card>

              <v-card class="mt-4" style="border-radius: 0;">
                <v-card-title style="font-size: 1rem; font-weight: 600;">
                  <v-icon left size="20" color="#E53935">mdi-truck-delivery</v-icon>
                  Delivery Settings
                </v-card-title>
                <v-divider />
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="deliverySettings.free_delivery_threshold"
                        label="Free Delivery Threshold (Ksh)"
                        outlined
                        dense
                        hide-details
                        type="number"
                        style="border-radius: 0;"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="deliverySettings.delivery_fee"
                        label="Delivery Fee (Ksh)"
                        outlined
                        dense
                        hide-details
                        type="number"
                        style="border-radius: 0;"
                      />
                    </v-col>
                    <v-col cols="12" md="4" class="d-flex align-center">
                      <v-switch
                        v-model="deliverySettings.is_active"
                        label="Enable Delivery"
                        color="#E53935"
                        hide-details
                      />
                    </v-col>
                  </v-row>
                  <v-btn
                    color="black"
                    dark
                    style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.7rem;"
                    :loading="savingDelivery"
                    @click="saveDeliverySettings"
                  >
                    Save Delivery Settings
                  </v-btn>
                </v-card-text>
              </v-card>

              <v-card class="mt-4" style="border-radius: 0;">
                <v-card-title style="font-size: 1rem; font-weight: 600;">
                  <v-icon left size="20" color="#E53935">mdi-clock</v-icon>
                  Recent Orders
                </v-card-title>
                <v-divider />
                <v-card-text>
                  <div v-if="loadingDashboard" class="d-flex justify-center pa-4">
                    <v-progress-circular indeterminate color="#E53935" size="24" />
                  </div>
                  <div v-else-if="recentOrders.length === 0" class="text-center pa-4" style="color: #999;">
                    No orders yet
                  </div>
                  <div v-else>
                    <v-simple-table>
                      <thead>
                        <tr>
                          <th>Order #</th>
                          <th>Status</th>
                          <th>Total</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in recentOrders" :key="item.id">
                          <td>{{ item.order_number }}</td>
                          <td>
                            <v-chip :color="getStatusColor(item.status)" small dark>
                              {{ item.status }}
                            </v-chip>
                          </td>
                          <td>Ksh {{ parseFloat(item.total_amount || 0).toFixed(2) }}</td>
                          <td>{{ new Date(item.created_at).toLocaleDateString() }}</td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </template>

          <!-- Products -->
          <template v-if="activeSection === 'products'">
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
                  <div v-if="loadingProducts" class="d-flex justify-center pa-8">
                    <v-progress-circular indeterminate color="#E53935" size="40" />
                  </div>
                  <div v-else-if="products.length === 0" class="text-center pa-8" style="color: #999;">
                    <v-icon size="48" color="grey lighten-1">mdi-package-variant</v-icon>
                    <p class="mt-4">No products found. Click "Add Product" to create one.</p>
                  </div>
                  <div v-else>
                    <v-simple-table>
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Variants</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in products" :key="item.id">
                          <td>
                            <v-img
                              :src="item.image_url || '/placeholder-product.jpg'"
                              width="50"
                              height="60"
                              contain
                              style="background: #f5f5f5;"
                            />
                          </td>
                          <td>{{ item.name }}</td>
                          <td>{{ item.category_name }}</td>
                          <td>Ksh {{ parseFloat(item.base_price || 0).toFixed(2) }}</td>
                          <td>{{ item.total_stock || 0 }}</td>
                          <td>{{ item.variant_count || 0 }}</td>
                          <td>
                            <v-chip :color="item.is_active ? 'green' : 'red'" small dark>
                              {{ item.is_active ? 'Active' : 'Inactive' }}
                            </v-chip>
                          </td>
                          <td>
                            <v-btn icon small color="primary" @click="openProductDialog(item)">
                              <v-icon size="18">mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn icon small color="error" @click="deleteProduct(item)">
                              <v-icon size="18">mdi-delete</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Product Dialog -->
              <v-dialog v-model="productDialog" max-width="600" persistent>
                <v-card style="border-radius: 0;">
                  <v-card-title style="background: #000; color: #fff; padding: 16px 24px;">
                    {{ editingProduct ? 'Edit Product' : 'Add Product' }}
                    <v-spacer />
                    <v-btn icon dark @click="productDialog = false">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-card-title>
                  <v-card-text class="pa-6">
                    <v-form ref="productForm" @submit.prevent="saveProduct">
                      <v-row>
                        <v-col cols="12">
                          <v-text-field v-model="productForm.name" label="Product Name" outlined dense hide-details required style="border-radius: 0;" />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field v-model="productForm.slug" label="Slug" outlined dense hide-details style="border-radius: 0;" hint="Auto-generated from name" persistent-hint />
                        </v-col>
                        <v-col cols="12">
                          <v-textarea v-model="productForm.short_description" label="Short Description" outlined dense hide-details rows="2" style="border-radius: 0;" />
                        </v-col>
                        <v-col cols="12">
                          <v-textarea v-model="productForm.description" label="Full Description" outlined dense hide-details rows="4" style="border-radius: 0;" />
                        </v-col>
                        <v-col cols="6">
                          <v-text-field v-model="productForm.base_price" label="Base Price (Ksh)" outlined dense hide-details type="number" step="0.01" required style="border-radius: 0;" />
                        </v-col>
                        <v-col cols="6">
                          <v-text-field v-model="productForm.compare_price" label="Compare Price (Ksh)" outlined dense hide-details type="number" step="0.01" style="border-radius: 0;" />
                        </v-col>
                        <v-col cols="12">
                          <v-select v-model="productForm.category_id" :items="categories" item-text="name" item-value="id" label="Category" outlined dense hide-details style="border-radius: 0;" />
                        </v-col>
                        <v-col cols="6">
                          <v-text-field v-model="productForm.brand" label="Brand" outlined dense hide-details style="border-radius: 0;" />
                        </v-col>
                        <v-col cols="6">
                          <v-select v-model="productForm.gender" :items="['men', 'women', 'unisex']" label="Gender" outlined dense hide-details style="border-radius: 0;" />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field v-model="productForm.image_url" label="Image URL" outlined dense hide-details style="border-radius: 0;" placeholder="https://example.com/image.jpg" />
                        </v-col>
                        <v-col cols="3">
                          <v-switch v-model="productForm.is_active" label="Active" color="#E53935" hide-details />
                        </v-col>
                        <v-col cols="3">
                          <v-switch v-model="productForm.is_featured" label="Featured" color="#E53935" hide-details />
                        </v-col>
                        <v-col cols="3">
                          <v-switch v-model="productForm.is_bestseller" label="Best Seller" color="#E53935" hide-details />
                        </v-col>
                        <v-col cols="3">
                          <v-switch v-model="productForm.is_new" label="New" color="#E53935" hide-details />
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>
                  <v-card-actions class="pa-4" style="border-top: 1px solid #f0f0f0;">
                    <v-spacer />
                    <v-btn text style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px;" @click="productDialog = false">Cancel</v-btn>
                    <v-btn color="black" dark style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px;" :loading="saving" @click="saveProduct">
                      {{ editingProduct ? 'Update' : 'Create' }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </template>

          <!-- Categories -->
          <template v-if="activeSection === 'categories'">
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
                  <div v-if="loadingCategories" class="d-flex justify-center pa-8">
                    <v-progress-circular indeterminate color="#E53935" size="40" />
                  </div>
                  <div v-else-if="categories.length === 0" class="text-center pa-8" style="color: #999;">
                    <v-icon size="48" color="grey lighten-1">mdi-view-list</v-icon>
                    <p class="mt-4">No categories found. Click "Add Category" to create one.</p>
                  </div>
                  <div v-else>
                    <v-simple-table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Slug</th>
                          <th>Products</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in categories" :key="item.id">
                          <td>{{ item.id }}</td>
                          <td>{{ item.name }}</td>
                          <td>{{ item.slug }}</td>
                          <td><v-chip small>{{ item.product_count || 0 }}</v-chip></td>
                          <td>
                            <v-chip :color="item.is_active ? 'green' : 'red'" small dark>
                              {{ item.is_active ? 'Active' : 'Inactive' }}
                            </v-chip>
                          </td>
                          <td>
                            <v-btn icon small color="primary" @click="openCategoryDialog(item)">
                              <v-icon size="18">mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn icon small color="error" @click="deleteCategory(item)">
                              <v-icon size="18">mdi-delete</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Category Dialog -->
              <v-dialog v-model="categoryDialog" max-width="450" persistent>
                <v-card style="border-radius: 0;">
                  <v-card-title style="background: #000; color: #fff; padding: 16px 24px;">
                    {{ editingCategory ? 'Edit Category' : 'Add Category' }}
                    <v-spacer />
                    <v-btn icon dark @click="categoryDialog = false">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-card-title>
                  <v-card-text class="pa-6">
                    <v-form @submit.prevent="saveCategory">
                      <v-text-field v-model="categoryForm.name" label="Category Name" outlined dense hide-details required style="border-radius: 0;" />
                      <v-text-field v-model="categoryForm.slug" label="Slug" outlined dense hide-details class="mt-4" style="border-radius: 0;" hint="Auto-generated from name" persistent-hint />
                      <v-textarea v-model="categoryForm.description" label="Description" outlined dense hide-details class="mt-4" rows="2" style="border-radius: 0;" />
                      <v-text-field v-model="categoryForm.image_url" label="Image URL" outlined dense hide-details class="mt-4" style="border-radius: 0;" placeholder="https://example.com/category.jpg" />
                      <v-switch v-model="categoryForm.is_active" label="Active" color="#E53935" hide-details class="mt-4" />
                    </v-form>
                  </v-card-text>
                  <v-card-actions class="pa-4" style="border-top: 1px solid #f0f0f0;">
                    <v-spacer />
                    <v-btn text style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px;" @click="categoryDialog = false">Cancel</v-btn>
                    <v-btn color="black" dark style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px;" :loading="saving" @click="saveCategory">
                      {{ editingCategory ? 'Update' : 'Create' }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </template>

          <!-- Variants -->
          <template v-if="activeSection === 'variants'">
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
                  <div v-if="loadingVariants" class="d-flex justify-center pa-8">
                    <v-progress-circular indeterminate color="#E53935" size="40" />
                  </div>
                  <div v-else-if="!selectedProduct" class="text-center pa-8" style="color: #999;">
                    <v-icon size="48" color="grey lighten-1">mdi-palette</v-icon>
                    <p class="mt-2">Select a product to manage its variants</p>
                  </div>
                  <div v-else-if="variants.length === 0" class="text-center pa-8" style="color: #999;">
                    <v-icon size="48" color="grey lighten-1">mdi-palette</v-icon>
                    <p class="mt-2">No variants found for this product.</p>
                  </div>
                  <div v-else>
                    <v-simple-table>
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>SKU</th>
                          <th>Size</th>
                          <th>Color</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in variants" :key="item.id">
                          <td>
                            <v-img
                              :src="item.image_url || '/placeholder-product.jpg'"
                              width="40"
                              height="50"
                              contain
                              style="background: #f5f5f5;"
                            />
                          </td>
                          <td>{{ item.sku }}</td>
                          <td>{{ item.size }}</td>
                          <td>{{ item.color }}</td>
                          <td>Ksh {{ parseFloat(item.price_override || 0).toFixed(2) }}</td>
                          <td :style="item.stock_quantity <= item.low_stock_threshold ? 'color: #E53935; font-weight: 600;' : ''">
                            {{ item.stock_quantity }}
                          </td>
                          <td>
                            <v-chip :color="item.is_active ? 'green' : 'red'" small dark>
                              {{ item.is_active ? 'Active' : 'Inactive' }}
                            </v-chip>
                          </td>
                          <td>
                            <v-btn icon small color="primary" @click="openVariantDialog(item)">
                              <v-icon size="18">mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn icon small color="error" @click="deleteVariant(item)">
                              <v-icon size="18">mdi-delete</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Variant Dialog -->
              <v-dialog v-model="variantDialog" max-width="550" persistent>
                <v-card style="border-radius: 0;">
                  <v-card-title style="background: #000; color: #fff; padding: 16px 24px;">
                    {{ editingVariant ? 'Edit Variant' : 'Add Variant' }}
                    <v-spacer />
                    <v-btn icon dark @click="variantDialog = false">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-card-title>
                  <v-card-text class="pa-6">
                    <v-form @submit.prevent="saveVariant">
                      <v-row>
                        <v-col cols="6">
                          <v-text-field v-model="variantForm.sku" label="SKU" outlined dense hide-details required style="border-radius: 0;" />
                        </v-col>
                        <v-col cols="3">
                          <v-text-field v-model="variantForm.size" label="Size" outlined dense hide-details style="border-radius: 0;" />
                        </v-col>
                        <v-col cols="3">
                          <v-text-field v-model="variantForm.color" label="Color" outlined dense hide-details style="border-radius: 0;" />
                        </v-col>
                        <v-col cols="6">
                          <v-text-field v-model="variantForm.color_hex" label="Color HEX" outlined dense hide-details placeholder="#000000" style="border-radius: 0;" />
                        </v-col>
                        <v-col cols="6">
                          <div class="d-flex align-center" style="gap: 12px;">
                            <div :style="`width: 36px; height: 36px; border-radius: 50%; background: ${variantForm.color_hex || '#000'}; border: 1px solid #e0e0e0;`" />
                            <span style="font-size: 0.75rem; color: #999;">Preview</span>
                          </div>
                        </v-col>
                        <v-col cols="6">
                          <v-text-field v-model="variantForm.price_override" label="Price Override (Ksh)" outlined dense hide-details type="number" step="0.01" style="border-radius: 0;" hint="Leave empty to use product base price" persistent-hint />
                        </v-col>
                        <v-col cols="6">
                          <v-text-field v-model="variantForm.stock_quantity" label="Stock Quantity" outlined dense hide-details type="number" required style="border-radius: 0;" />
                        </v-col>
                        <v-col cols="6">
                          <v-text-field v-model="variantForm.low_stock_threshold" label="Low Stock Threshold" outlined dense hide-details type="number" style="border-radius: 0;" />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field v-model="variantForm.image_url" label="Image URL" outlined dense hide-details placeholder="https://example.com/image.jpg" style="border-radius: 0;" />
                        </v-col>
                        <v-col cols="6">
                          <v-switch v-model="variantForm.is_active" label="Active" color="#E53935" hide-details />
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>
                  <v-card-actions class="pa-4" style="border-top: 1px solid #f0f0f0;">
                    <v-spacer />
                    <v-btn text style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px;" @click="variantDialog = false">Cancel</v-btn>
                    <v-btn color="black" dark style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px;" :loading="saving" @click="saveVariant">
                      {{ editingVariant ? 'Update' : 'Create' }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </template>

          <!-- Orders -->
          <template v-if="activeSection === 'orders'">
            <div>
              <div class="d-flex justify-space-between align-center mb-6 flex-wrap" style="gap: 12px;">
                <h2 style="font-size: 1.5rem; font-weight: 700;">Orders</h2>
                <div class="d-flex" style="gap: 8px;">
                  <v-select
                    v-model="statusFilter"
                    :items="['All', 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']"
                    label="Filter by Status"
                    outlined
                    dense
                    hide-details
                    style="min-width: 150px; border-radius: 0;"
                    @change="fetchOrders"
                  />
                  <v-btn color="black" dark style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.7rem;" @click="fetchOrders">
                    <v-icon left size="16">mdi-refresh</v-icon>
                    Refresh
                  </v-btn>
                </div>
              </div>

              <v-card style="border-radius: 0;">
                <v-card-text>
                  <div v-if="loadingOrders" class="d-flex justify-center pa-8">
                    <v-progress-circular indeterminate color="#E53935" size="40" />
                  </div>
                  <div v-else-if="adminOrders.length === 0" class="text-center pa-8" style="color: #999;">
                    <v-icon size="48" color="grey lighten-1">mdi-package-variant</v-icon>
                    <p class="mt-4">No orders found.</p>
                  </div>
                  <div v-else>
                    <v-simple-table>
                      <thead>
                        <tr>
                          <th>Order #</th>
                          <th>Customer</th>
                          <th>Status</th>
                          <th>Total</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in adminOrders" :key="item.id">
                          <td>{{ item.order_number }}</td>
                          <td>{{ item.firebase_uid }}</td>
                          <td>
                            <v-chip :color="getStatusColor(item.status)" small dark>
                              {{ item.status }}
                            </v-chip>
                          </td>
                          <td>Ksh {{ parseFloat(item.total_amount || 0).toFixed(2) }}</td>
                          <td>{{ new Date(item.created_at).toLocaleDateString() }}</td>
                          <td>
                            <v-btn icon small color="primary" @click="viewOrderDetails(item)">
                              <v-icon size="18">mdi-eye</v-icon>
                            </v-btn>
                            <v-menu offset-y>
                              <template #activator="{ on, attrs }">
                                <v-btn icon small color="grey" v-bind="attrs" v-on="on">
                                  <v-icon size="18">mdi-dots-vertical</v-icon>
                                </v-btn>
                              </template>
                              <v-list dense>
                                <v-list-item v-for="status in ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']" :key="status" @click="updateOrderStatus(item, status)">
                                  <v-list-item-title style="font-size: 0.8rem; text-transform: capitalize;">
                                    Mark as {{ status }}
                                  </v-list-item-title>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Order Detail Dialog -->
              <v-dialog v-model="orderDetailDialog" max-width="700" persistent>
                <v-card style="border-radius: 0;">
                  <v-card-title style="background: #000; color: #fff; padding: 16px 24px;">
                    Order #{{ selectedOrder?.order_number }}
                    <v-spacer />
                    <v-btn icon dark @click="orderDetailDialog = false">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-card-title>
                  <v-card-text class="pa-6" v-if="selectedOrder">
                    <v-row>
                      <v-col cols="6">
                        <div style="font-weight: 600; font-size: 0.8rem; color: #999; text-transform: uppercase; letter-spacing: 1px;">Customer</div>
                        <div style="font-weight: 500;">{{ selectedOrder.firebase_uid }}</div>
                      </v-col>
                      <v-col cols="6">
                        <div style="font-weight: 600; font-size: 0.8rem; color: #999; text-transform: uppercase; letter-spacing: 1px;">Status</div>
                        <v-chip :color="getStatusColor(selectedOrder.status)" small dark>
                          {{ selectedOrder.status }}
                        </v-chip>
                      </v-col>
                    </v-row>
                    <v-divider class="my-4" />
                    <div style="font-weight: 600; font-size: 0.8rem; color: #999; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Order Items</div>
                    <div v-if="selectedOrder.items && selectedOrder.items.length > 0">
                      <v-simple-table>
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Variant</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in selectedOrder.items" :key="item.id">
                            <td>{{ item.product_name }}</td>
                            <td>{{ item.variant_name }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>Ksh {{ parseFloat(item.price_per_unit || 0).toFixed(2) }}</td>
                            <td>Ksh {{ parseFloat(item.total_price || 0).toFixed(2) }}</td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </div>
                    <div v-else class="text-center pa-4" style="color: #999;">
                      No items in this order
                    </div>
                    <v-divider class="my-4" />
                    <v-row>
                      <v-col cols="4">
                        <div style="font-weight: 600; font-size: 0.8rem; color: #999; text-transform: uppercase; letter-spacing: 1px;">Subtotal</div>
                        <div>Ksh {{ parseFloat(selectedOrder.subtotal || 0).toFixed(2) }}</div>
                      </v-col>
                      <v-col cols="4">
                        <div style="font-weight: 600; font-size: 0.8rem; color: #999; text-transform: uppercase; letter-spacing: 1px;">Shipping</div>
                        <div>Ksh {{ parseFloat(selectedOrder.shipping_cost || 0).toFixed(2) }}</div>
                      </v-col>
                      <v-col cols="4">
                        <div style="font-weight: 600; font-size: 0.8rem; color: #999; text-transform: uppercase; letter-spacing: 1px;">Total</div>
                        <div style="font-size: 1.2rem; font-weight: 700; color: #000;">Ksh {{ parseFloat(selectedOrder.total_amount || 0).toFixed(2) }}</div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </div>
          </template>

          <!-- Reports -->
          <template v-if="activeSection === 'reports'">
            <div>
              <div class="d-flex justify-space-between align-center mb-6 flex-wrap" style="gap: 12px;">
                <h2 style="font-size: 1.5rem; font-weight: 700;">Reports</h2>
                <div class="d-flex" style="gap: 8px;">
                  <v-text-field v-model="dateFrom" label="From" type="date" outlined dense hide-details style="max-width: 160px; border-radius: 0;" />
                  <v-text-field v-model="dateTo" label="To" type="date" outlined dense hide-details style="max-width: 160px; border-radius: 0;" />
                  <v-btn color="black" dark style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.7rem;" @click="fetchReports">
                    <v-icon left size="16">mdi-refresh</v-icon>
                    Refresh
                  </v-btn>
                </div>
              </div>

              <v-row>
                <!-- Sales Report -->
                <v-col cols="12" md="6">
                  <v-card style="border-radius: 0;">
                    <v-card-title style="font-size: 1rem; font-weight: 600;">
                      <v-icon left size="20" color="#E53935">mdi-chart-line</v-icon>
                      Sales Report
                    </v-card-title>
                    <v-divider />
                    <v-card-text>
                      <div v-if="loadingReports" class="d-flex justify-center pa-4">
                        <v-progress-circular indeterminate color="#E53935" size="24" />
                      </div>
                      <div v-else-if="salesReport.length === 0" class="text-center pa-4" style="color: #999;">
                        No sales data available
                      </div>
                      <div v-else>
                        <v-simple-table>
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Orders</th>
                              <th>Gross Revenue</th>
                              <th>Net Revenue</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="item in salesReport" :key="item.date">
                              <td>{{ new Date(item.date).toLocaleDateString() }}</td>
                              <td>{{ item.orders }}</td>
                              <td>Ksh {{ parseFloat(item.gross_revenue || 0).toFixed(2) }}</td>
                              <td>Ksh {{ parseFloat(item.net_revenue || 0).toFixed(2) }}</td>
                            </tr>
                          </tbody>
                        </v-simple-table>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- Top Products -->
                <v-col cols="12" md="6">
                  <v-card style="border-radius: 0;">
                    <v-card-title style="font-size: 1rem; font-weight: 600;">
                      <v-icon left size="20" color="#E53935">mdi-star</v-icon>
                      Top Products
                    </v-card-title>
                    <v-divider />
                    <v-card-text>
                      <div v-if="loadingReports" class="d-flex justify-center pa-4">
                        <v-progress-circular indeterminate color="#E53935" size="24" />
                      </div>
                      <div v-else-if="topProducts.length === 0" class="text-center pa-4" style="color: #999;">
                        No product sales data
                      </div>
                      <div v-else>
                        <v-simple-table>
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Orders</th>
                              <th>Quantity Sold</th>
                              <th>Revenue</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="item in topProducts" :key="item.id">
                              <td>{{ item.name }}</td>
                              <td>{{ item.total_orders }}</td>
                              <td>{{ item.total_quantity_sold }}</td>
                              <td>Ksh {{ parseFloat(item.total_revenue || 0).toFixed(2) }}</td>
                            </tr>
                          </tbody>
                        </v-simple-table>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- Category Performance -->
                <v-col cols="12">
                  <v-card style="border-radius: 0;">
                    <v-card-title style="font-size: 1rem; font-weight: 600;">
                      <v-icon left size="20" color="#E53935">mdi-view-list</v-icon>
                      Category Performance
                    </v-card-title>
                    <v-divider />
                    <v-card-text>
                      <div v-if="loadingReports" class="d-flex justify-center pa-4">
                        <v-progress-circular indeterminate color="#E53935" size="24" />
                      </div>
                      <div v-else-if="categoryPerformance.length === 0" class="text-center pa-4" style="color: #999;">
                        No category performance data
                      </div>
                      <div v-else>
                        <v-simple-table>
                          <thead>
                            <tr>
                              <th>Category</th>
                              <th>Orders</th>
                              <th>Items Sold</th>
                              <th>Revenue</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="item in categoryPerformance" :key="item.id">
                              <td>{{ item.name }}</td>
                              <td>{{ item.orders }}</td>
                              <td>{{ item.items_sold }}</td>
                              <td>Ksh {{ parseFloat(item.revenue || 0).toFixed(2) }}</td>
                            </tr>
                          </tbody>
                        </v-simple-table>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'AdminPage',
  data() {
    return {
      activeSection: 'dashboard',
      
      loadingDashboard: false,
      loadingProducts: false,
      loadingCategories: false,
      loadingVariants: false,
      loadingOrders: false,
      loadingReports: false,
      saving: false,
      savingDelivery: false,

      // Dashboard
      stats: [
        { label: 'Today\'s Orders', value: 0 },
        { label: 'Today\'s Revenue', value: 'Ksh 0' },
        { label: 'Total Products', value: 0 },
        { label: 'Total Customers', value: 0 },
      ],
      lowStock: [],
      recentOrders: [],
      deliverySettings: { free_delivery_threshold: 7500, delivery_fee: 500, is_active: true },

      // Products
      products: [],
      categories: [],
      search: '',
      productDialog: false,
      editingProduct: null,
      productForm: { 
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

      // Categories
      categoryDialog: false,
      editingCategory: null,
      categoryForm: { name: '', slug: '', description: '', image_url: '', is_active: true },

      // Variants
      selectedProduct: null,
      variants: [],
      variantDialog: false,
      editingVariant: null,
      variantForm: { 
        sku: '', 
        size: '', 
        color: '', 
        color_hex: '#000000', 
        price_override: '', 
        stock_quantity: 0, 
        low_stock_threshold: 5, 
        image_url: '', 
        is_active: true 
      },

      // Orders
      adminOrders: [],
      statusFilter: '',
      orderDetailDialog: false,
      selectedOrder: null,

      // Reports
      dateFrom: '',
      dateTo: '',
      salesReport: [],
      topProducts: [],
      categoryPerformance: [],

      // Menu
      menuItems: [
        { id: 'dashboard', title: 'Dashboard', icon: 'mdi-view-dashboard' },
        { id: 'products', title: 'Products', icon: 'mdi-tshirt-crew' },
        { id: 'categories', title: 'Categories', icon: 'mdi-view-list' },
        { id: 'variants', title: 'Variants', icon: 'mdi-palette' },
        { id: 'orders', title: 'Orders', icon: 'mdi-package-variant' },
        { id: 'reports', title: 'Reports', icon: 'mdi-chart-bar' },
      ],
    }
  },
  mounted() {
    this.fetchDashboardData()
    this.fetchProducts()
    this.fetchCategories()
    this.fetchOrders()
    this.fetchReports()

    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)
    this.dateFrom = thirtyDaysAgo.toISOString().split('T')[0]
    this.dateTo = today.toISOString().split('T')[0]
  },
  watch: {
    'productForm.name'(val) {
      if (!this.editingProduct) {
        this.productForm.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      }
    },
    'categoryForm.name'(val) {
      if (!this.editingCategory) {
        this.categoryForm.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      }
    },
    search() {
      this.fetchProducts()
    },
    statusFilter() {
      this.fetchOrders()
    },
    selectedProduct() {
      this.fetchVariants()
    }
  },
  methods: {
    // ==================== DASHBOARD ====================
    async fetchDashboardData() {
      this.loadingDashboard = true
      try {
        const { data } = await this.$axios.get('/api/admin/dashboard')
        if (data.success) {
          const d = data.data
          this.stats = [
            { label: 'Today\'s Orders', value: d.today?.orders || 0 },
            { label: 'Today\'s Revenue', value: `Ksh ${parseFloat(d.today?.revenue || 0).toFixed(2)}` },
            { label: 'Total Products', value: d.totals?.products || 0 },
            { label: 'Total Customers', value: d.totals?.users || 0 },
          ]
          this.lowStock = d.lowStock || []
          this.recentOrders = d.recentOrders || []
          if (d.deliverySettings) {
            this.deliverySettings = d.deliverySettings
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard:', error)
        this.$nuxt.$emit('show-snackbar', { message: 'Failed to load dashboard', color: 'error' })
      } finally {
        this.loadingDashboard = false
      }
    },

    async saveDeliverySettings() {
      this.savingDelivery = true
      try {
        const { data } = await this.$axios.put('/api/admin/delivery-settings', this.deliverySettings)
        if (data.success) {
          this.$nuxt.$emit('show-snackbar', { message: 'Delivery settings updated!', color: '#E53935' })
        }
      } catch (error) {
        console.error('Error saving delivery settings:', error)
        this.$nuxt.$emit('show-snackbar', { message: 'Failed to save settings', color: 'error' })
      } finally {
        this.savingDelivery = false
      }
    },

    // ==================== PRODUCTS ====================
    async fetchProducts() {
      this.loadingProducts = true
      try {
        const { data } = await this.$axios.get('/api/admin/products', {
          params: { search: this.search, limit: 100 }
        })
        if (data.success) {
          this.products = data.data || []
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        this.products = []
        this.$nuxt.$emit('show-snackbar', { message: 'Failed to load products', color: 'error' })
      } finally {
        this.loadingProducts = false
      }
    },

    openProductDialog(product = null) {
      this.editingProduct = product
      if (product) {
        this.productForm = { 
          ...product, 
          base_price: product.base_price || '', 
          compare_price: product.compare_price || '' 
        }
      } else {
        this.productForm = { 
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
      }
      this.productDialog = true
    },

    async saveProduct() {
      if (!this.productForm.name || !this.productForm.base_price) {
        this.$nuxt.$emit('show-snackbar', { message: 'Name and price are required', color: 'error' })
        return
      }
      this.saving = true
      try {
        let response
        if (this.editingProduct) {
          response = await this.$axios.put(`/api/admin/products/${this.editingProduct.id}`, this.productForm)
        } else {
          response = await this.$axios.post('/api/admin/products', this.productForm)
        }
        if (response.data.success) {
          this.$nuxt.$emit('show-snackbar', { 
            message: `Product ${this.editingProduct ? 'updated' : 'created'} successfully`, 
            color: '#E53935' 
          })
          this.productDialog = false
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
    },

    // ==================== CATEGORIES ====================
    async fetchCategories() {
      this.loadingCategories = true
      try {
        const { data } = await this.$axios.get('/api/admin/categories')
        if (data.success) {
          this.categories = data.data || []
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        this.categories = []
        this.$nuxt.$emit('show-snackbar', { message: 'Failed to load categories', color: 'error' })
      } finally {
        this.loadingCategories = false
      }
    },

    openCategoryDialog(category = null) {
      this.editingCategory = category
      if (category) {
        this.categoryForm = { ...category }
      } else {
        this.categoryForm = { name: '', slug: '', description: '', image_url: '', is_active: true }
      }
      this.categoryDialog = true
    },

    async saveCategory() {
      if (!this.categoryForm.name) {
        this.$nuxt.$emit('show-snackbar', { message: 'Category name is required', color: 'error' })
        return
      }
      this.saving = true
      try {
        let response
        if (this.editingCategory) {
          response = await this.$axios.put(`/api/admin/categories/${this.editingCategory.id}`, this.categoryForm)
        } else {
          response = await this.$axios.post('/api/admin/categories', this.categoryForm)
        }
        if (response.data.success) {
          this.$nuxt.$emit('show-snackbar', { 
            message: `Category ${this.editingCategory ? 'updated' : 'created'} successfully`, 
            color: '#E53935' 
          })
          this.categoryDialog = false
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
          message: `Cannot delete category with ${category.product_count} products.`, 
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
    },

    // ==================== VARIANTS ====================
    async fetchVariants() {
      if (!this.selectedProduct) {
        this.variants = []
        return
      }
      this.loadingVariants = true
      try {
        const { data } = await this.$axios.get(`/api/admin/products/${this.selectedProduct}/variants`)
        if (data.success) {
          this.variants = data.data || []
        }
      } catch (error) {
        console.error('Error fetching variants:', error)
        this.variants = []
        this.$nuxt.$emit('show-snackbar', { message: 'Failed to load variants', color: 'error' })
      } finally {
        this.loadingVariants = false
      }
    },

    openVariantDialog(variant = null) {
      this.editingVariant = variant
      if (variant) {
        this.variantForm = { ...variant }
      } else {
        this.variantForm = { 
          sku: '', 
          size: '', 
          color: '', 
          color_hex: '#000000', 
          price_override: '', 
          stock_quantity: 0, 
          low_stock_threshold: 5, 
          image_url: '', 
          is_active: true 
        }
      }
      this.variantDialog = true
    },

    async saveVariant() {
      if (!this.variantForm.sku || this.variantForm.stock_quantity === undefined) {
        this.$nuxt.$emit('show-snackbar', { message: 'SKU and stock quantity are required', color: 'error' })
        return
      }
      this.saving = true
      try {
        let response
        if (this.editingVariant) {
          response = await this.$axios.put(`/api/admin/variants/${this.editingVariant.id}`, this.variantForm)
        } else {
          response = await this.$axios.post(`/api/admin/products/${this.selectedProduct}/variants`, this.variantForm)
        }
        if (response.data.success) {
          this.$nuxt.$emit('show-snackbar', { 
            message: `Variant ${this.editingVariant ? 'updated' : 'created'} successfully`, 
            color: '#E53935' 
          })
          this.variantDialog = false
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
    },

    // ==================== ORDERS ====================
    async fetchOrders() {
      this.loadingOrders = true
      try {
        const params = this.statusFilter && this.statusFilter !== 'All' ? { status: this.statusFilter } : {}
        const { data } = await this.$axios.get('/api/admin/orders', { params })
        if (data.success) {
          this.adminOrders = data.data || []
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
        this.adminOrders = []
        this.$nuxt.$emit('show-snackbar', { message: 'Failed to load orders', color: 'error' })
      } finally {
        this.loadingOrders = false
      }
    },

    async viewOrderDetails(order) {
      try {
        const { data } = await this.$axios.get(`/api/admin/orders/${order.id}`)
        if (data.success) {
          this.selectedOrder = data.data
          this.orderDetailDialog = true
        }
      } catch (error) {
        console.error('Error fetching order details:', error)
        this.$nuxt.$emit('show-snackbar', { message: 'Failed to load order details', color: 'error' })
      }
    },

    async updateOrderStatus(order, status) {
      try {
        const { data } = await this.$axios.put(`/api/admin/orders/${order.id}/status`, { status })
        if (data.success) {
          this.$nuxt.$emit('show-snackbar', { 
            message: `Order status updated to ${status}`, 
            color: '#E53935' 
          })
          this.fetchOrders()
        }
      } catch (error) {
        this.$nuxt.$emit('show-snackbar', { 
          message: error.response?.data?.error || 'Failed to update status', 
          color: 'error' 
        })
      }
    },

    // ==================== REPORTS ====================
    async fetchReports() {
      this.loadingReports = true
      try {
        const params = { from: this.dateFrom || '2024-01-01', to: this.dateTo || '2030-12-31' }

        const [sales, topProducts, categories] = await Promise.all([
          this.$axios.get('/api/admin/reports/sales', { params }),
          this.$axios.get('/api/admin/reports/top-products', { params, params: { ...params, limit: 10 } }),
          this.$axios.get('/api/admin/reports/category-performance', { params })
        ])

        if (sales.data.success) this.salesReport = sales.data.data || []
        if (topProducts.data.success) this.topProducts = topProducts.data.data || []
        if (categories.data.success) this.categoryPerformance = categories.data.data || []
      } catch (error) {
        console.error('Error fetching reports:', error)
        this.salesReport = []
        this.topProducts = []
        this.categoryPerformance = []
        this.$nuxt.$emit('show-snackbar', { message: 'Failed to load reports', color: 'error' })
      } finally {
        this.loadingReports = false
      }
    },

    getStatusColor(status) {
      const colors = {
        pending: 'orange',
        processing: 'blue',
        shipped: 'purple',
        delivered: 'green',
        cancelled: 'red',
        refunded: 'grey'
      }
      return colors[status] || 'grey'
    }
  }
}
</script>