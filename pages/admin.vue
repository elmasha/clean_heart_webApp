<template>
  <div class="admin-wrapper">
    <!-- Mobile Header -->
    <v-app-bar
      v-if="$vuetify.breakpoint.smAndDown"
      flat
      color="white"
      height="56"
      class="mobile-header"
      style="border-bottom: 1px solid #e8e8e8;"
    >
      <v-app-bar-nav-icon @click="mobileDrawer = !mobileDrawer">
        <v-icon>mdi-menu</v-icon>
      </v-app-bar-nav-icon>

      <div class="d-flex align-center">
        <div class="brand-icon-small mr-2">
          <v-icon color="white" size="16">mdi-heart</v-icon>
        </div>
        <span class="brand-title-small">Clean Heart</span>
      </div>

      <v-spacer />

      <v-btn icon small @click="activeSection = 'dashboard'">
        <v-icon size="20" color="#E53935">mdi-view-dashboard</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer
      v-model="mobileDrawer"
      temporary
      width="280"
      class="mobile-drawer"
    >
      <div class="drawer-header">
        <div class="brand-section">
          <div class="brand-icon">
            <v-icon color="white" size="22">mdi-heart</v-icon>
          </div>
          <div class="brand-text">
            <div class="brand-title">Clean Heart</div>
            <div class="brand-subtitle">Admin Panel</div>
          </div>
        </div>
        <v-btn icon small dark @click="mobileDrawer = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <v-divider />

      <v-list nav dense class="drawer-list">
        <v-list-item
          v-for="item in menuItems"
          :key="item.id"
          :class="{ 'active-nav-item': activeSection === item.id }"
          @click="activeSection = item.id; mobileDrawer = false"
          class="nav-item"
        >
          <v-list-item-icon class="mr-3">
            <v-icon size="22" :color="activeSection === item.id ? '#E53935' : '#666'">
              {{ item.icon }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-title class="nav-title" :class="{ 'active-text': activeSection === item.id }">
            {{ item.title }}
          </v-list-item-title>
          <v-badge
            v-if="item.id === 'orders' && pendingOrdersCount > 0"
            :content="pendingOrdersCount"
            color="#E53935"
            offset-x="8"
            offset-y="8"
            class="badge-mobile"
          />
        </v-list-item>
      </v-list>

      <div class="drawer-footer">
        <div class="text-caption text-center grey--text">v2.0 &mdash; {{ currentYear }}</div>
      </div>
    </v-navigation-drawer>

    <v-container fluid class="pt-0 px-3 px-md-6 pb-3 pb-md-6">
      <v-row>
        <!-- Desktop Sidebar -->
        <v-col cols="12" md="3" lg="2" class="sidebar-col" v-if="$vuetify.breakpoint.mdAndUp">
          <v-card class="sidebar-card" flat>
            <div class="brand-section">
              <div class="brand-icon">
                <v-icon color="white" size="22">mdi-heart</v-icon>
              </div>
              <div class="brand-text">
                <div class="brand-title">Clean Heart</div>
                <div class="brand-subtitle">Admin Panel</div>
              </div>
            </div>

            <v-divider class="my-0" />

            <v-list nav dense class="sidebar-list">
              <v-list-item
                v-for="item in menuItems"
                :key="item.id"
                :class="{ 'active-nav-item': activeSection === item.id }"
                @click="activeSection = item.id"
                class="nav-item"
              >
                <v-list-item-icon class="mr-3">
                  <v-icon size="20" :color="activeSection === item.id ? '#E53935' : '#666'">
                    {{ item.icon }}
                  </v-icon>
                </v-list-item-icon>
                <v-list-item-title class="nav-title" :class="{ 'active-text': activeSection === item.id }">
                  {{ item.title }}
                </v-list-item-title>
                <v-badge
                  v-if="item.id === 'orders' && pendingOrdersCount > 0"
                  :content="pendingOrdersCount"
                  color="#E53935"
                  offset-x="12"
                  offset-y="12"
                  class="badge-desktop"
                />
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <!-- Main Content -->
        <v-col cols="12" md="9" lg="10">
          <!-- Mobile Tab Navigation -->
          <div v-if="$vuetify.breakpoint.smAndDown" class="mobile-tabs mb-4">
            <v-slide-group
              :value="menuItems.findIndex(i => i.id === activeSection)"
              @change="idx => { if(idx >= 0) activeSection = menuItems[idx].id }"
              mandatory
              show-arrows
            >
              <v-slide-item
                v-for="(item, idx) in menuItems"
                :key="item.id"
                v-slot="{ active, toggle }"
              >
                <v-btn
                  :class="['tab-btn', { 'tab-active': active }]"
                  @click="activeSection = item.id; toggle()"
                  small
                  text
                  class="px-2"
                >
                  <v-icon size="16" class="mr-1">{{ item.icon }}</v-icon>
                  <span class="tab-label">{{ item.title }}</span>
                  <v-badge
                    v-if="item.id === 'orders' && pendingOrdersCount > 0"
                    :content="pendingOrdersCount"
                    color="#E53935"
                    offset-x="4"
                    offset-y="4"
                    class="badge-tab"
                  />
                </v-btn>
              </v-slide-item>
            </v-slide-group>
          </div>

          <!-- Dashboard -->
          <template v-if="activeSection === 'dashboard'">
            <div class="fade-in">
              <div class="section-header mb-4 mb-md-6">
                <div>
                  <h1 class="section-title">Dashboard</h1>
                  <p class="section-subtitle">Overview of your store performance</p>
                </div>
                <v-btn
                  color="#E53935"
                  dark
                  depressed
                  class="refresh-btn"
                  :loading="loadingDashboard"
                  @click="fetchDashboardData"
                  small
                  v-if="$vuetify.breakpoint.smAndDown"
                >
                  <v-icon left size="14">mdi-refresh</v-icon>
                </v-btn>
                <v-btn
                  color="#E53935"
                  dark
                  depressed
                  class="refresh-btn"
                  :loading="loadingDashboard"
                  @click="fetchDashboardData"
                  v-else
                >
                  <v-icon left size="16">mdi-refresh</v-icon>
                  Refresh
                </v-btn>
              </div>

              <v-row class="stats-row">
                <v-col cols="6" sm="3" v-for="stat in stats" :key="stat.label">
                  <v-card class="stat-card" flat>
                    <div class="stat-icon-wrapper" :style="{ background: stat.bg }">
                      <v-icon size="16" :color="stat.iconColor" v-if="$vuetify.breakpoint.smAndDown">{{ stat.icon }}</v-icon>
                      <v-icon size="20" :color="stat.iconColor" v-else>{{ stat.icon }}</v-icon>
                    </div>
                    <div class="stat-content">
                      <div class="stat-label">{{ stat.label }}</div>
                      <div class="stat-value" :class="{ 'stat-value-sm': $vuetify.breakpoint.smAndDown }">{{ stat.value }}</div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Rider Stats Row -->
              <v-row class="mt-2">
                <v-col cols="12" sm="6" lg="3">
                  <v-card class="content-card" flat>
                    <div class="card-header">
                      <div class="d-flex align-center">
                        <v-icon size="18" color="#E53935" class="mr-2">mdi-motorbike</v-icon>
                        <span class="card-header-title">Active Riders</span>
                      </div>
                    </div>
                    <v-divider />
                    <div class="pa-4 text-center">
                      <div class="display-1 font-weight-bold">{{ riderStats.active || 0 }}</div>
                      <div class="caption grey--text">Available for deliveries</div>
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="12" sm="6" lg="3">
                  <v-card class="content-card" flat>
                    <div class="card-header">
                      <div class="d-flex align-center">
                        <v-icon size="18" color="#E53935" class="mr-2">mdi-truck-delivery</v-icon>
                        <span class="card-header-title">Today's Deliveries</span>
                      </div>
                    </div>
                    <v-divider />
                    <div class="pa-4 text-center">
                      <div class="display-1 font-weight-bold">{{ riderStats.today_deliveries || 0 }}</div>
                      <div class="caption grey--text">Completed today</div>
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="12" sm="6" lg="3">
                  <v-card class="content-card" flat>
                    <div class="card-header">
                      <div class="d-flex align-center">
                        <v-icon size="18" color="#E53935" class="mr-2">mdi-clock</v-icon>
                        <span class="card-header-title">Pending Assignments</span>
                      </div>
                    </div>
                    <v-divider />
                    <div class="pa-4 text-center">
                      <div class="display-1 font-weight-bold">{{ riderStats.pending_assignments || 0 }}</div>
                      <div class="caption grey--text">Awaiting rider assignment</div>
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="12" sm="6" lg="3">
                  <v-card class="content-card" flat>
                    <div class="card-header">
                      <div class="d-flex align-center">
                        <v-icon size="18" color="#E53935" class="mr-2">mdi-currency-ksh</v-icon>
                        <span class="card-header-title">Rider Earnings</span>
                      </div>
                    </div>
                    <v-divider />
                    <div class="pa-4 text-center">
                      <div class="display-1 font-weight-bold">Ksh {{ formatMoney(riderStats.total_earnings || 0) }}</div>
                      <div class="caption grey--text">Total rider earnings</div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>

              <v-row class="mt-2">
                <v-col cols="12" lg="8">
                  <v-card class="content-card" flat>
                    <div class="card-header">
                      <div class="d-flex align-center">
                        <v-icon size="18" color="#E53935" class="mr-2">mdi-alert-circle</v-icon>
                        <span class="card-header-title">Low Stock Alerts</span>
                      </div>
                      <v-chip x-small color="error" text-color="white" v-if="lowStock.length > 0">
                        {{ lowStock.length }} items
                      </v-chip>
                    </div>
                    <v-divider />
                    <div class="pa-0">
                      <div v-if="loadingDashboard" class="d-flex justify-center pa-6">
                        <v-progress-circular indeterminate color="#E53935" size="28" />
                      </div>
                      <div v-else-if="lowStock.length === 0" class="empty-state">
                        <v-icon size="32" color="success">mdi-check-circle</v-icon>
                        <div class="empty-title">All Good</div>
                        <div class="empty-text">All products have sufficient stock</div>
                      </div>
                      <div v-else class="table-wrapper">
                          <table class="data-table">
                            <thead>
                              <tr>
                                <th>Product</th>
                                <th v-if="!$vuetify.breakpoint.smAndDown">SKU</th>
                                <th>Size</th>
                                <th>Color</th>
                                <th class="text-right">Stock</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="item in lowStock" :key="item.variant_id">
                                <td class="font-weight-medium">{{ item.name }}</td>
                                <td v-if="!$vuetify.breakpoint.smAndDown"><code class="sku-tag">{{ item.sku }}</code></td>
                                <td>{{ item.size || '-' }}</td>
                                <td>
                                  <div class="d-flex align-center">
                                    <span v-if="item.color" class="color-dot mr-2" :style="{ background: item.color_hex || '#ccc' }"></span>
                                    {{ item.color || '-' }}
                                  </div>
                                </td>
                                <td class="text-right">
                                  <span class="stock-alert">{{ item.stock_quantity }}</span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="12" lg="4">
                  <v-card class="content-card" flat>
                    <div class="card-header">
                      <div class="d-flex align-center">
                        <v-icon size="18" color="#E53935" class="mr-2">mdi-truck-delivery</v-icon>
                        <span class="card-header-title">Delivery Settings</span>
                      </div>
                    </div>
                    <v-divider />
                    <div class="pa-3 pa-md-4">
                      <v-text-field
                        v-model="deliverySettings.free_delivery_threshold"
                        label="Free Delivery Threshold (Ksh)"
                        outlined
                        dense
                        hide-details
                        type="number"
                        class="mb-3 compact-field"
                        prefix="Ksh"
                      />
                      <v-text-field
                        v-model="deliverySettings.delivery_fee"
                        label="Delivery Fee (Ksh)"
                        outlined
                        dense
                        hide-details
                        type="number"
                        class="mb-3 compact-field"
                        prefix="Ksh"
                      />
                      <v-switch
                        v-model="deliverySettings.is_active"
                        label="Enable Delivery"
                        color="#E53935"
                        hide-details
                        class="mt-0 mb-4"
                      />
                      <v-btn
                        color="#0f0f0f"
                        dark
                        depressed
                        block
                        class="action-btn"
                        :loading="savingDelivery"
                        @click="saveDeliverySettings"
                      >
                        Save Settings
                      </v-btn>
                    </div>
                  </v-card>
                </v-col>
              </v-row>

              <v-card class="content-card mt-4" flat>
                <div class="card-header">
                  <div class="d-flex align-center">
                    <v-icon size="18" color="#E53935" class="mr-2">mdi-clock-outline</v-icon>
                    <span class="card-header-title">Recent Orders</span>
                  </div>
                </div>
                <v-divider />
                <div class="pa-0">
                  <div v-if="loadingDashboard" class="d-flex justify-center pa-6">
                    <v-progress-circular indeterminate color="#E53935" size="28" />
                  </div>
                  <div v-else-if="recentOrders.length === 0" class="empty-state">
                    <v-icon size="32" color="grey lighten-1">mdi-package-variant</v-icon>
                    <div class="empty-title">No Orders Yet</div>
                    <div class="empty-text">Orders will appear here once customers start buying</div>
                  </div>
                  <div v-else class="table-wrapper">
                      <table class="data-table">
                        <thead>
                          <tr>
                            <th>Order #</th>
                            <th v-if="!$vuetify.breakpoint.smAndDown">Status</th>
                            <th class="text-right">Total</th>
                            <th class="text-right">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in recentOrders" :key="item.id">
                            <td class="font-weight-medium">#{{ item.order_number }}</td>
                            <td v-if="!$vuetify.breakpoint.smAndDown">
                              <v-chip :color="getStatusColor(item.status)" x-small label dark class="status-chip">
                                {{ item.status }}
                              </v-chip>
                            </td>
                            <td class="text-right font-weight-bold">Ksh {{ formatMoney(item.total_amount) }}</td>
                            <td class="text-right grey--text text--darken-1">{{ formatDate(item.created_at) }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                </div>
              </v-card>
            </div>
          </template>

          <!-- Products -->
          <template v-if="activeSection === 'products'">
            <div class="fade-in">
              <div class="section-header mb-4 mb-md-6">
                <div>
                  <h1 class="section-title">Products</h1>
                  <p class="section-subtitle">Manage your product catalog</p>
                </div>
                <div class="d-flex" style="gap: 8px;" :style="{ flexDirection: $vuetify.breakpoint.smAndDown ? 'column' : 'row' }">
                  <v-text-field
                    v-model="search"
                    placeholder="Search products..."
                    dense
                    outlined
                    hide-details
                    clearable
                    prepend-inner-icon="mdi-magnify"
                    class="search-field"
                    @input="debouncedFetchProducts"
                    :style="{ minWidth: $vuetify.breakpoint.smAndDown ? '100%' : '200px' }"
                  />
                  <v-btn color="#0f0f0f" dark depressed class="action-btn" @click="openProductDialog()" block v-if="$vuetify.breakpoint.smAndDown">
                    <v-icon left size="16">mdi-plus</v-icon>
                    Add Product
                  </v-btn>
                  <v-btn color="#0f0f0f" dark depressed class="action-btn" @click="openProductDialog()" v-else>
                    <v-icon left size="16">mdi-plus</v-icon>
                    Add Product
                  </v-btn>
                </div>
              </div>

              <v-card class="content-card" flat>
                <div v-if="loadingProducts" class="d-flex justify-center pa-8">
                  <v-progress-circular indeterminate color="#E53935" size="40" />
                </div>
                <div v-else-if="products.length === 0" class="empty-state pa-8">
                  <v-icon size="56" color="grey lighten-2">mdi-package-variant</v-icon>
                  <div class="empty-title">No Products Found</div>
                  <div class="empty-text">Click "Add Product" to create your first product</div>
                </div>
                <div v-else class="table-wrapper">
                    <table class="data-table product-table">
                      <thead>
                        <tr>
                          <th style="width: 50px;">Image</th>
                          <th>Product</th>
                          <th v-if="!$vuetify.breakpoint.smAndDown">Category</th>
                          <th class="text-right">Price</th>
                          <th class="text-center" v-if="!$vuetify.breakpoint.smAndDown">Stock</th>
                          <th class="text-center" v-if="!$vuetify.breakpoint.smAndDown">Variants</th>
                          <th class="text-center">Status</th>
                          <th class="text-center" style="width: 80px;">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in products" :key="item.id">
                          <td>
                            <v-img
                              :src="item.image_url || '/placeholder-product.jpg'"
                              width="40"
                              height="40"
                              contain
                              class="product-thumb"
                            />
                          </td>
                          <td>
                            <div class="font-weight-medium">{{ item.name }}</div>
                            <div class="text-caption grey--text" v-if="item.brand">{{ item.brand }}</div>
                          </td>
                          <td v-if="!$vuetify.breakpoint.smAndDown">
                            <v-chip x-small outlined color="grey darken-1">{{ item.category_name || 'Uncategorized' }}</v-chip>
                          </td>
                          <td class="text-right font-weight-bold">Ksh {{ formatMoney(item.base_price) }}</td>
                          <td class="text-center" v-if="!$vuetify.breakpoint.smAndDown">
                            <span :class="item.total_stock < 5 ? 'error--text font-weight-bold' : ''">{{ item.total_stock || 0 }}</span>
                          </td>
                          <td class="text-center" v-if="!$vuetify.breakpoint.smAndDown">
                            <v-chip x-small color="#f5f5f5">{{ item.variant_count || 0 }}</v-chip>
                          </td>
                          <td class="text-center">
                            <v-chip x-small label :color="item.is_active ? 'success' : 'error'" text-color="white" class="status-chip">
                              {{ item.is_active ? 'Active' : 'Inactive' }}
                            </v-chip>
                          </td>
                          <td class="text-center">
                            <v-btn icon x-small color="primary" class="mr-1" @click="openProductDialog(item)">
                              <v-icon size="14">mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn icon x-small color="error" @click="confirmDelete('product', item)">
                              <v-icon size="14">mdi-delete</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
              </v-card>
            </div>
          </template>

          <!-- Categories -->
          <template v-if="activeSection === 'categories'">
            <div class="fade-in">
              <div class="section-header mb-4 mb-md-6">
                <div>
                  <h1 class="section-title">Categories</h1>
                  <p class="section-subtitle">Organize your product catalog</p>
                </div>
                <v-btn color="#0f0f0f" dark depressed class="action-btn" @click="openCategoryDialog()" block v-if="$vuetify.breakpoint.smAndDown">
                  <v-icon left size="16">mdi-plus</v-icon>
                  Add Category
                </v-btn>
                <v-btn color="#0f0f0f" dark depressed class="action-btn" @click="openCategoryDialog()" v-else>
                  <v-icon left size="16">mdi-plus</v-icon>
                  Add Category
                </v-btn>
              </div>

              <v-card class="content-card" flat>
                <div v-if="loadingCategories" class="d-flex justify-center pa-8">
                  <v-progress-circular indeterminate color="#E53935" size="40" />
                </div>
                <div v-else-if="categories.length === 0" class="empty-state pa-8">
                  <v-icon size="56" color="grey lighten-2">mdi-view-list</v-icon>
                  <div class="empty-title">No Categories</div>
                  <div class="empty-text">Create categories to organize your products</div>
                </div>
                <div v-else class="table-wrapper">
                    <table class="data-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th v-if="!$vuetify.breakpoint.smAndDown">Slug</th>
                          <th class="text-center" v-if="!$vuetify.breakpoint.smAndDown">Products</th>
                          <th class="text-center">Status</th>
                          <th class="text-center" style="width: 80px;">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in categories" :key="item.id">
                          <td>
                            <div class="d-flex align-center">
                              <v-avatar size="28" class="mr-2" v-if="item.image_url" tile>
                                <v-img :src="item.image_url" />
                              </v-avatar>
                              <div class="font-weight-medium">{{ item.name }}</div>
                            </div>
                          </td>
                          <td v-if="!$vuetify.breakpoint.smAndDown"><code class="slug-tag">{{ item.slug }}</code></td>
                          <td class="text-center" v-if="!$vuetify.breakpoint.smAndDown">
                            <v-chip x-small color="#f5f5f5">{{ item.product_count || 0 }}</v-chip>
                          </td>
                          <td class="text-center">
                            <v-chip x-small label :color="item.is_active ? 'success' : 'error'" text-color="white" class="status-chip">
                              {{ item.is_active ? 'Active' : 'Inactive' }}
                            </v-chip>
                          </td>
                          <td class="text-center">
                            <v-btn icon x-small color="primary" class="mr-1" @click="openCategoryDialog(item)">
                              <v-icon size="14">mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn icon x-small color="error" @click="confirmDelete('category', item)">
                              <v-icon size="14">mdi-delete</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
              </v-card>
            </div>
          </template>

          <!-- Variants -->
          <template v-if="activeSection === 'variants'">
            <div class="fade-in">
              <div class="section-header mb-4 mb-md-6">
                <div>
                  <h1 class="section-title">Variants</h1>
                  <p class="section-subtitle">Manage size and color variants</p>
                </div>
                <div class="d-flex" style="gap: 8px;" :style="{ flexDirection: $vuetify.breakpoint.smAndDown ? 'column' : 'row' }">
                  <v-select
                    v-model="selectedProduct"
                    :items="products"
                    item-text="name"
                    item-value="id"
                    label="Select Product"
                    outlined
                    dense
                    hide-details
                    clearable
                    class="product-select"
                    @change="fetchVariants"
                    :style="{ minWidth: $vuetify.breakpoint.smAndDown ? '100%' : '200px' }"
                  />
                  <v-btn color="#0f0f0f" dark depressed class="action-btn" :disabled="!selectedProduct" @click="openVariantDialog()" block v-if="$vuetify.breakpoint.smAndDown">
                    <v-icon left size="16">mdi-plus</v-icon>
                    Add Variant
                  </v-btn>
                  <v-btn color="#0f0f0f" dark depressed class="action-btn" :disabled="!selectedProduct" @click="openVariantDialog()" v-else>
                    <v-icon left size="16">mdi-plus</v-icon>
                    Add Variant
                  </v-btn>
                </div>
              </div>

              <v-card class="content-card" flat>
                <div v-if="loadingVariants" class="d-flex justify-center pa-8">
                  <v-progress-circular indeterminate color="#E53935" size="40" />
                </div>
                <div v-else-if="!selectedProduct" class="empty-state pa-8">
                  <v-icon size="56" color="grey lighten-2">mdi-palette</v-icon>
                  <div class="empty-title">Select a Product</div>
                  <div class="empty-text">Choose a product from the dropdown to manage its variants</div>
                </div>
                <div v-else-if="variants.length === 0" class="empty-state pa-8">
                  <v-icon size="56" color="grey lighten-2">mdi-palette</v-icon>
                  <div class="empty-title">No Variants</div>
                  <div class="empty-text">This product doesn't have any variants yet</div>
                </div>
                <div v-else class="table-wrapper">
                    <table class="data-table">
                      <thead>
                        <tr>
                          <th style="width: 40px;">Img</th>
                          <th v-if="!$vuetify.breakpoint.smAndDown">SKU</th>
                          <th>Size</th>
                          <th>Color</th>
                          <th class="text-right" v-if="!$vuetify.breakpoint.smAndDown">Price</th>
                          <th class="text-center">Stock</th>
                          <th class="text-center">Status</th>
                          <th class="text-center" style="width: 80px;">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in variants" :key="item.id">
                          <td>
                            <v-img
                              :src="item.image_url || '/placeholder-product.jpg'"
                              width="32"
                              height="32"
                              contain
                              class="variant-thumb"
                            />
                          </td>
                          <td v-if="!$vuetify.breakpoint.smAndDown"><code class="sku-tag">{{ item.sku }}</code></td>
                          <td>{{ item.size || '-' }}</td>
                          <td>
                            <div class="d-flex align-center">
                              <span class="color-dot mr-2" :style="{ background: item.color_hex || '#ccc' }"></span>
                              {{ item.color || '-' }}
                            </div>
                          </td>
                          <td class="text-right font-weight-bold" v-if="!$vuetify.breakpoint.smAndDown">Ksh {{ formatMoney(item.price_override || 0) }}</td>
                          <td class="text-center">
                            <span :class="item.stock_quantity <= item.low_stock_threshold ? 'stock-alert' : ''">
                              {{ item.stock_quantity }}
                            </span>
                          </td>
                          <td class="text-center">
                            <v-chip x-small label :color="item.is_active ? 'success' : 'error'" text-color="white" class="status-chip">
                              {{ item.is_active ? 'Active' : 'Inactive' }}
                            </v-chip>
                          </td>
                          <td class="text-center">
                            <v-btn icon x-small color="primary" class="mr-1" @click="openVariantDialog(item)">
                              <v-icon size="14">mdi-pencil</v-icon>
                            </v-btn>
                            <v-btn icon x-small color="error" @click="confirmDelete('variant', item)">
                              <v-icon size="14">mdi-delete</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
              </v-card>
            </div>
          </template>

          <!-- Orders -->
          <template v-if="activeSection === 'orders'">
            <div class="fade-in">
              <div class="section-header mb-4 mb-md-6">
                <div>
                  <h1 class="section-title">Orders</h1>
                  <p class="section-subtitle">Manage and track customer orders</p>
                </div>
                <div class="d-flex" style="gap: 8px;" :style="{ flexDirection: $vuetify.breakpoint.smAndDown ? 'column' : 'row' }">
                  <v-select
                    v-model="statusFilter"
                    :items="['All', 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']"
                    label="Filter by Status"
                    outlined
                    dense
                    hide-details
                    clearable
                    class="status-select"
                    @change="fetchOrders"
                    :style="{ minWidth: $vuetify.breakpoint.smAndDown ? '100%' : '150px' }"
                  />
                  <v-btn color="#0f0f0f" dark depressed class="action-btn" @click="fetchOrders" block v-if="$vuetify.breakpoint.smAndDown">
                    <v-icon left size="16">mdi-refresh</v-icon>
                    Refresh
                  </v-btn>
                  <v-btn color="#0f0f0f" dark depressed class="action-btn" @click="fetchOrders" v-else>
                    <v-icon left size="16">mdi-refresh</v-icon>
                    Refresh
                  </v-btn>
                </div>
              </div>

              <v-card class="content-card" flat>
                <div v-if="loadingOrders" class="d-flex justify-center pa-8">
                  <v-progress-circular indeterminate color="#E53935" size="40" />
                </div>
                <div v-else-if="adminOrders.length === 0" class="empty-state pa-8">
                  <v-icon size="56" color="grey lighten-2">mdi-package-variant</v-icon>
                  <div class="empty-title">No Orders</div>
                  <div class="empty-text">No orders match your current filters</div>
                </div>
                <div v-else class="table-wrapper">
                    <table class="data-table">
                      <thead>
                        <tr>
                          <th>Order #</th>
                          <th v-if="!$vuetify.breakpoint.smAndDown">Customer</th>
                          <th>Status</th>
                          <th>Payment</th>
                          <th>Delivery</th>
                          <th class="text-right">Total</th>
                          <th class="text-right" v-if="!$vuetify.breakpoint.smAndDown">Date</th>
                          <th class="text-center" style="width: 110px;">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in adminOrders" :key="item.id">
                          <td class="font-weight-medium">#{{ item.order_number }}</td>
                          <td v-if="!$vuetify.breakpoint.smAndDown">
                            <div class="d-flex align-center">
                              <v-avatar size="24" color="#f5f5f5" class="mr-2">
                                <v-icon size="12" color="#666">mdi-account</v-icon>
                              </v-avatar>
                              <span class="text-truncate" style="max-width: 80px;">{{ item.customer_name || item.firebase_uid }}</span>
                            </div>
                          </td>
                          <td>
                            <v-chip :color="getStatusColor(item.status)" x-small label dark class="status-chip">
                              {{ item.status }}
                            </v-chip>
                          </td>
                          <td>
                            <v-chip x-small label :color="item.payment_status === 'paid' ? 'success' : 'warning'">
                              {{ item.payment_status || 'pending' }}
                            </v-chip>
                          </td>
                          <td>
                            <v-chip x-small label :color="getDeliveryStatusColor(item.delivery_status)">
                              {{ item.delivery_status || 'pending' }}
                            </v-chip>
                          </td>
                          <td class="text-right font-weight-bold">Ksh {{ formatMoney(item.total_amount) }}</td>
                          <td class="text-right grey--text text--darken-1" v-if="!$vuetify.breakpoint.smAndDown">{{ formatDate(item.created_at) }}</td>
                          <td class="text-center">
                            <v-btn icon x-small color="primary" class="mr-1" @click="viewOrderDetails(item)">
                              <v-icon size="14">mdi-eye</v-icon>
                            </v-btn>
                            <!-- Assign Delivery Button for COD orders -->
                            <v-btn 
                              v-if="item.payment_method === 'cod' && (item.delivery_status === 'pending' || !item.delivery_status)" 
                              icon 
                              x-small 
                              color="#E53935" 
                              class="mr-1" 
                              @click="openAssignDeliveryDialog(item)"
                              title="Assign Rider"
                            >
                              <v-icon size="14">mdi-truck-delivery</v-icon>
                            </v-btn>
                            <v-menu offset-y left>
                              <template #activator="{ on, attrs }">
                                <v-btn icon x-small color="grey" v-bind="attrs" v-on="on">
                                  <v-icon size="14">mdi-dots-vertical</v-icon>
                                </v-btn>
                              </template>
                              <v-list dense class="py-1">
                                <v-subheader class="text-caption">Update Status</v-subheader>
                                <v-list-item v-for="status in orderStatuses" :key="status" @click="updateOrderStatus(item, status)" dense>
                                  <v-list-item-icon class="mr-2 my-1">
                                    <v-icon size="12" :color="getStatusColor(status)">mdi-circle</v-icon>
                                  </v-list-item-icon>
                                  <v-list-item-title class="text-caption text-capitalize">{{ status }}</v-list-item-title>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
              </v-card>
            </div>
          </template>

          <!-- Riders Section -->
          <template v-if="activeSection === 'riders'">
            <div class="fade-in">
              <div class="section-header mb-4 mb-md-6">
                <div>
                  <h1 class="section-title">Riders</h1>
                  <p class="section-subtitle">Manage your delivery riders</p>
                </div>
                <div class="d-flex" style="gap: 8px;" :style="{ flexDirection: $vuetify.breakpoint.smAndDown ? 'column' : 'row' }">
                  <v-btn color="#0f0f0f" dark depressed class="action-btn" @click="openRiderDialog()" block v-if="$vuetify.breakpoint.smAndDown">
                    <v-icon left size="16">mdi-plus</v-icon>
                    Add Rider
                  </v-btn>
                  <v-btn color="#0f0f0f" dark depressed class="action-btn" @click="openRiderDialog()" v-else>
                    <v-icon left size="16">mdi-plus</v-icon>
                    Add Rider
                  </v-btn>
                </div>
              </div>

              <v-card class="content-card" flat>
                <div v-if="loadingRiders" class="d-flex justify-center pa-8">
                  <v-progress-circular indeterminate color="#E53935" size="40" />
                </div>
                <div v-else-if="riders.length === 0" class="empty-state pa-8">
                  <v-icon size="56" color="grey lighten-2">mdi-motorbike</v-icon>
                  <div class="empty-title">No Riders Found</div>
                  <div class="empty-text">Click "Add Rider" to register your first delivery rider</div>
                </div>
                <div v-else class="table-wrapper">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>Rider</th>
                        <th>Contact</th>
                        <th>Vehicle</th>
                        <th class="text-center">Status</th>
                        <th class="text-center">Rating</th>
                        <th class="text-center">Deliveries</th>
                        <th class="text-center" style="width: 120px;">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="rider in riders" :key="rider.id">
                        <td>
                          <div class="d-flex align-center">
                            <v-avatar size="32" color="#fce4ec" class="mr-2">
                              <v-icon size="16" color="#E53935">mdi-account</v-icon>
                            </v-avatar>
                            <div>
                              <div class="font-weight-medium">{{ rider.full_name }}</div>
                              <div class="text-caption grey--text" v-if="rider.id_number">ID: {{ rider.id_number }}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>{{ rider.phone }}</div>
                          <div class="text-caption grey--text">{{ rider.email }}</div>
                        </td>
                        <td>
                          <v-chip x-small outlined color="grey darken-1">
                            {{ rider.vehicle_type }}
                          </v-chip>
                          <div class="text-caption grey--text" v-if="rider.vehicle_registration">{{ rider.vehicle_registration }}</div>
                        </td>
                        <td class="text-center">
                          <v-chip x-small label :color="getRiderStatusColor(rider.status)" text-color="white" class="status-chip">
                            {{ rider.status }}
                          </v-chip>
                        </td>
                        <td class="text-center">
                          <div class="d-flex align-center justify-center">
                            <v-icon small color="#ff9800" class="mr-1">mdi-star</v-icon>
                            <span>{{ rider.rating || 0 }}</span>
                          </div>
                        </td>
                        <td class="text-center">
                          <div>{{ rider.total_deliveries || 0 }}</div>
                          <div class="text-caption grey--text">Ksh {{ formatMoney(rider.total_earnings || 0) }}</div>
                        </td>
                        <td class="text-center">
                          <v-btn icon x-small color="primary" class="mr-1" @click="openRiderDialog(rider)">
                            <v-icon size="16">mdi-pencil</v-icon>
                          </v-btn>
                          <v-btn icon x-small color="error" @click="confirmDelete('rider', rider)">
                            <v-icon size="16">mdi-delete</v-icon>
                          </v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </v-card>
            </div>
          </template>

          <!-- Revenue Section -->
          <template v-if="activeSection === 'revenue'">
            <div class="fade-in">
              <div class="section-header mb-4 mb-md-6">
                <div>
                  <h1 class="section-title">Revenue Dashboard</h1>
                  <p class="section-subtitle">Track your revenue from confirmed deliveries</p>
                </div>
                <div class="d-flex" style="gap: 8px;" :style="{ flexDirection: $vuetify.breakpoint.smAndDown ? 'column' : 'row' }">
                  <v-btn-toggle v-model="revenuePeriod" mandatory dense class="period-toggle">
                    <v-btn value="today" small>Today</v-btn>
                    <v-btn value="week" small>Week</v-btn>
                    <v-btn value="month" small>Month</v-btn>
                    <v-btn value="year" small>Year</v-btn>
                  </v-btn-toggle>
                  <v-btn color="#0f0f0f" dark depressed class="action-btn" @click="fetchRevenue" block v-if="$vuetify.breakpoint.smAndDown">
                    <v-icon left size="16">mdi-refresh</v-icon>
                    Refresh
                  </v-btn>
                  <v-btn color="#0f0f0f" dark depressed class="action-btn" @click="fetchRevenue" v-else>
                    <v-icon left size="16">mdi-refresh</v-icon>
                    Refresh
                  </v-btn>
                </div>
              </div>

              <!-- Summary Cards -->
              <v-row class="mb-4">
                <v-col cols="6" sm="3" v-for="stat in revenueStats" :key="stat.label">
                  <v-card class="stat-card" flat>
                    <div class="stat-icon-wrapper" :style="{ background: stat.bg }">
                      <v-icon size="18" :color="stat.iconColor">{{ stat.icon }}</v-icon>
                    </div>
                    <div class="stat-content">
                      <div class="stat-value" :class="{ 'stat-value-sm': $vuetify.breakpoint.smAndDown }">{{ stat.value }}</div>
                      <div class="stat-label">{{ stat.label }}</div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Payment Method Breakdown -->
              <v-row class="mb-4">
                <v-col cols="12" md="6">
                  <v-card class="content-card" flat>
                    <div class="card-header">
                      <span class="card-header-title">Payment Methods</span>
                    </div>
                    <v-divider />
                    <div class="pa-4">
                      <v-row>
                        <v-col cols="6">
                          <div class="payment-stat">
                            <div class="payment-label">COD</div>
                            <div class="payment-value">Ksh {{ formatMoney(revenueSummary.cod_revenue) }}</div>
                            <div class="payment-count">{{ revenueSummary.cod_orders }} orders</div>
                          </div>
                        </v-col>
                        <v-col cols="6">
                          <div class="payment-stat">
                            <div class="payment-label">M-Pesa</div>
                            <div class="payment-value">Ksh {{ formatMoney(revenueSummary.mpesa_revenue) }}</div>
                            <div class="payment-count">{{ revenueSummary.mpesa_orders }} orders</div>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="12" md="6">
                  <v-card class="content-card" flat>
                    <div class="card-header">
                      <span class="card-header-title">COD Payment Status</span>
                    </div>
                    <v-divider />
                    <div class="pa-4">
                      <v-row>
                        <v-col cols="4">
                          <div class="cod-stat">
                            <div class="cod-label">Total</div>
                            <div class="cod-value">{{ revenueCodStatus.total_cod_orders }}</div>
                          </div>
                        </v-col>
                        <v-col cols="4">
                          <div class="cod-stat paid">
                            <div class="cod-label">✅ Paid</div>
                            <div class="cod-value">{{ revenueCodStatus.cod_paid }}</div>
                          </div>
                        </v-col>
                        <v-col cols="4">
                          <div class="cod-stat pending">
                            <div class="cod-label">⏳ Pending</div>
                            <div class="cod-value">{{ revenueCodStatus.cod_pending }}</div>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Top Products -->
              <v-card class="content-card mb-4" flat>
                <div class="card-header">
                  <span class="card-header-title">Top Selling Products</span>
                </div>
                <v-divider />
                <div class="pa-0">
                  <div v-if="loadingRevenue" class="d-flex justify-center pa-6">
                    <v-progress-circular indeterminate color="#E53935" size="28" />
                  </div>
                  <div v-else-if="revenueTopProducts.length === 0" class="empty-state">
                    <v-icon size="32" color="grey lighten-1">mdi-package-variant</v-icon>
                    <div class="empty-title">No Products Sold</div>
                  </div>
                  <div v-else class="table-wrapper">
                    <table class="data-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Product</th>
                          <th class="text-center">Sold</th>
                          <th class="text-right">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in revenueTopProducts" :key="item.id">
                          <td>
                            <span class="rank-badge" :class="{ 'top-three': index < 3 }">{{ index + 1 }}</span>
                          </td>
                          <td>
                            <div class="d-flex align-center">
                              <v-img
                                :src="item.image_url || '/placeholder-product.jpg'"
                                width="40"
                                height="40"
                                contain
                                class="mr-3"
                                style="border-radius: 4px; background: #f5f5f5;"
                              />
                              <div>
                                <div class="font-weight-medium">{{ item.name }}</div>
                                <div class="text-caption grey--text">{{ item.quantity_sold }} units sold</div>
                              </div>
                            </div>
                          </td>
                          <td class="text-center">{{ item.total_sold || item.quantity_sold }}</td>
                          <td class="text-right font-weight-bold">Ksh {{ formatMoney(item.revenue) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </v-card>

              <!-- Confirmed Orders List -->
              <v-card class="content-card" flat>
                <div class="card-header">
                  <span class="card-header-title">Confirmed Orders</span>
                  <v-chip small color="#E53935" text-color="white">Paid</v-chip>
                </div>
                <v-divider />
                <div class="pa-0">
                  <div v-if="loadingRevenue" class="d-flex justify-center pa-6">
                    <v-progress-circular indeterminate color="#E53935" size="28" />
                  </div>
                  <div v-else-if="revenueConfirmedOrders.length === 0" class="empty-state">
                    <v-icon size="32" color="grey lighten-1">mdi-package-variant</v-icon>
                    <div class="empty-title">No Confirmed Orders</div>
                    <div class="empty-text">Orders will appear here once they are delivered and payment is confirmed</div>
                  </div>
                  <div v-else class="table-wrapper">
                    <table class="data-table">
                      <thead>
                        <tr>
                          <th>Order #</th>
                          <th>Customer</th>
                          <th>Payment</th>
                          <th class="text-right">Amount</th>
                          <th>Rider</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in revenueConfirmedOrders" :key="item.id">
                          <td class="font-weight-medium">#{{ item.order_number }}</td>
                          <td>
                            <div>{{ item.customer_name }}</div>
                            <div class="text-caption grey--text">{{ item.customer_phone }}</div>
                          </td>
                          <td>
                            <v-chip x-small :color="item.payment_method === 'cod' ? '#E53935' : '#1976d2'" text-color="white">
                              {{ item.payment_method === 'cod' ? '💰 COD' : '📱 M-Pesa' }}
                            </v-chip>
                            <div class="text-caption grey--text" v-if="item.mpesa_receipt">Receipt: {{ item.mpesa_receipt }}</div>
                          </td>
                          <td class="text-right font-weight-bold">Ksh {{ formatMoney(item.total_amount) }}</td>
                          <td>
                            <div class="text-caption">{{ item.rider_name || 'N/A' }}</div>
                            <div class="text-caption grey--text">{{ item.rider_phone || '' }}</div>
                          </td>
                          <td class="text-caption">{{ formatDate(item.created_at) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </v-card>
            </div>
          </template>

          <!-- Reports -->
          <template v-if="activeSection === 'reports'">
            <div class="fade-in">
              <div class="section-header mb-4 mb-md-6">
                <div>
                  <h1 class="section-title">Reports</h1>
                  <p class="section-subtitle">Sales analytics and performance insights</p>
                </div>
                <div class="d-flex" style="gap: 8px;" :style="{ flexDirection: $vuetify.breakpoint.smAndDown ? 'column' : 'row' }">
                  <v-text-field v-model="dateFrom" label="From" type="date" outlined dense hide-details class="date-field" :style="{ minWidth: $vuetify.breakpoint.smAndDown ? '100%' : '140px' }" />
                  <v-text-field v-model="dateTo" label="To" type="date" outlined dense hide-details class="date-field" :style="{ minWidth: $vuetify.breakpoint.smAndDown ? '100%' : '140px' }" />
                  <v-btn color="#0f0f0f" dark depressed class="action-btn" @click="fetchReports" block v-if="$vuetify.breakpoint.smAndDown">
                    <v-icon left size="16">mdi-refresh</v-icon>
                    Refresh
                  </v-btn>
                  <v-btn color="#0f0f0f" dark depressed class="action-btn" @click="fetchReports" v-else>
                    <v-icon left size="16">mdi-refresh</v-icon>
                    Refresh
                  </v-btn>
                </div>
              </div>

              <v-row>
                <v-col cols="12" md="6">
                  <v-card class="content-card" flat>
                    <div class="card-header">
                      <div class="d-flex align-center">
                        <v-icon size="18" color="#E53935" class="mr-2">mdi-chart-line</v-icon>
                        <span class="card-header-title">Sales Report</span>
                      </div>
                    </div>
                    <v-divider />
                    <div class="pa-0">
                      <div v-if="loadingReports" class="d-flex justify-center pa-6">
                        <v-progress-circular indeterminate color="#E53935" size="28" />
                      </div>
                      <div v-else-if="salesReport.length === 0" class="empty-state">
                        <v-icon size="32" color="grey lighten-1">mdi-chart-line</v-icon>
                        <div class="empty-title">No Data</div>
                        <div class="empty-text">No sales data for the selected period</div>
                      </div>
                      <div v-else class="table-wrapper">
                          <table class="data-table compact">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th class="text-center">Orders</th>
                                <th class="text-right">Gross</th>
                                <th class="text-right" v-if="!$vuetify.breakpoint.smAndDown">Net</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="item in salesReport" :key="item.date">
                                <td>{{ formatDate(item.date) }}</td>
                                <td class="text-center">{{ item.orders }}</td>
                                <td class="text-right">Ksh {{ formatMoney(item.gross_revenue) }}</td>
                                <td class="text-right font-weight-bold" v-if="!$vuetify.breakpoint.smAndDown">Ksh {{ formatMoney(item.net_revenue) }}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="12" md="6">
                  <v-card class="content-card" flat>
                    <div class="card-header">
                      <div class="d-flex align-center">
                        <v-icon size="18" color="#E53935" class="mr-2">mdi-star</v-icon>
                        <span class="card-header-title">Top Products</span>
                      </div>
                    </div>
                    <v-divider />
                    <div class="pa-0">
                      <div v-if="loadingReports" class="d-flex justify-center pa-6">
                        <v-progress-circular indeterminate color="#E53935" size="28" />
                      </div>
                      <div v-else-if="topProducts.length === 0" class="empty-state">
                        <v-icon size="32" color="grey lighten-1">mdi-star</v-icon>
                        <div class="empty-title">No Data</div>
                        <div class="empty-text">No product sales data for the selected period</div>
                      </div>
                      <div v-else class="table-wrapper">
                          <table class="data-table compact">
                            <thead>
                              <tr>
                                <th>Product</th>
                                <th class="text-center">Orders</th>
                                <th class="text-center" v-if="!$vuetify.breakpoint.smAndDown">Qty</th>
                                <th class="text-right">Revenue</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(item, index) in topProducts" :key="item.id">
                                <td>
                                  <div class="d-flex align-center">
                                    <span class="rank-badge mr-2" :class="{ 'top-three': index < 3 }">{{ index + 1 }}</span>
                                    <span class="font-weight-medium text-truncate" style="max-width: 100px;">{{ item.name }}</span>
                                  </div>
                                </td>
                                <td class="text-center">{{ item.total_orders }}</td>
                                <td class="text-center" v-if="!$vuetify.breakpoint.smAndDown">{{ item.total_quantity_sold }}</td>
                                <td class="text-right font-weight-bold">Ksh {{ formatMoney(item.total_revenue) }}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="12">
                  <v-card class="content-card" flat>
                    <div class="card-header">
                      <div class="d-flex align-center">
                        <v-icon size="18" color="#E53935" class="mr-2">mdi-view-list</v-icon>
                        <span class="card-header-title">Category Performance</span>
                      </div>
                    </div>
                    <v-divider />
                    <div class="pa-0">
                      <div v-if="loadingReports" class="d-flex justify-center pa-6">
                        <v-progress-circular indeterminate color="#E53935" size="28" />
                      </div>
                      <div v-else-if="categoryPerformance.length === 0" class="empty-state">
                        <v-icon size="32" color="grey lighten-1">mdi-view-list</v-icon>
                        <div class="empty-title">No Data</div>
                        <div class="empty-text">No category performance data for the selected period</div>
                      </div>
                      <div v-else class="table-wrapper">
                          <table class="data-table">
                            <thead>
                              <tr>
                                <th>Category</th>
                                <th class="text-center">Orders</th>
                                <th class="text-center" v-if="!$vuetify.breakpoint.smAndDown">Items Sold</th>
                                <th class="text-right">Revenue</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="item in categoryPerformance" :key="item.id">
                                <td class="font-weight-medium">{{ item.name }}</td>
                                <td class="text-center">{{ item.orders }}</td>
                                <td class="text-center" v-if="!$vuetify.breakpoint.smAndDown">{{ item.items_sold }}</td>
                                <td class="text-right font-weight-bold">Ksh {{ formatMoney(item.revenue) }}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </template>
        </v-col>
      </v-row>
    </v-container>

    <!-- ===== ASSIGN DELIVERY DIALOG ===== -->
    <v-dialog v-model="assignDeliveryDialog" :max-width="$vuetify.breakpoint.smAndDown ? undefined : 550" :fullscreen="$vuetify.breakpoint.smAndDown" persistent>
      <v-card class="dialog-card" flat>
        <div class="dialog-header" style="background: linear-gradient(135deg, #0f0f0f, #1a1a1a);">
          <span class="dialog-title">
            <v-icon color="#E53935" size="20" class="mr-2">mdi-truck-delivery</v-icon>
            Assign Delivery
          </span>
          <v-btn icon small dark @click="assignDeliveryDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-divider />
        <v-card-text class="pa-4 pa-md-6" v-if="selectedOrderForDelivery">
          <!-- Order Summary -->
          <div class="order-summary">
            <div class="summary-grid">
              <div class="summary-item">
                <div class="summary-label">Order #</div>
                <div class="summary-value font-weight-bold">#{{ selectedOrderForDelivery.order_number }}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Customer</div>
                <div class="summary-value">{{ selectedOrderForDelivery.customer_name || 'N/A' }}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Total Amount</div>
                <div class="summary-total">Ksh {{ formatMoney(selectedOrderForDelivery.total_amount) }}</div>
              </div>
            </div>
          </div>

          <v-divider class="my-4" />

          <!-- Rider Selection -->
          <div class="rider-selection">
            <div class="detail-label mb-2">
              <v-icon size="16" color="#E53935" class="mr-1">mdi-motorbike</v-icon>
              Select Rider
            </div>
            <v-select
              v-model="selectedRiderId"
              :items="availableRiders"
              item-text="full_name"
              item-value="id"
              label="Choose a rider"
              outlined
              dense
              hide-details
              class="mb-4"
              :loading="loadingRiders"
            >
              <template #item="{ item }">
                <div class="d-flex align-center">
                  <v-icon small color="#E53935" class="mr-2">mdi-motorbike</v-icon>
                  <span>{{ item.full_name }}</span>
                  <v-chip x-small class="ml-2" :color="item.status === 'active' ? 'success' : 'warning'">
                    {{ item.status }}
                  </v-chip>
                  <span class="ml-2 grey--text text-caption">({{ item.vehicle_type }})</span>
                  <span class="ml-auto grey--text text-caption">
                    ⭐ {{ item.rating || 0 }}
                  </span>
                </div>
              </template>
              <template #no-data>
                <div class="pa-4 text-center">
                  <v-icon size="32" color="grey lighten-1">mdi-motorbike-off</v-icon>
                  <div class="mt-2 grey--text">No riders available</div>
                  <div class="caption grey--text">Please add riders or check their status</div>
                </div>
              </template>
            </v-select>

            <v-text-field
              v-model="deliveryFee"
              label="Delivery Fee (Ksh)"
              outlined
              dense
              hide-details
              type="number"
              class="mb-4"
              prefix="Ksh"
              hint="Default: 200 Ksh"
              persistent-hint
            />
          </div>

          <v-alert type="info" dense text class="mt-4" border="left" colored-border>
            <div class="d-flex align-center">
              <v-icon left size="18" color="#E53935">mdi-information</v-icon>
              <span>This will assign a rider to deliver this order. The rider will be notified via SMS.</span>
            </div>
          </v-alert>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-3 pa-md-4">
          <v-spacer />
          <v-btn text class="mr-2" @click="assignDeliveryDialog = false">Cancel</v-btn>
          <v-btn 
            color="#E53935" 
            dark 
            depressed 
            :loading="assigningDelivery" 
            :disabled="!selectedRiderId"
            @click="assignDelivery"
            class="assign-btn"
          >
            <v-icon left size="16" v-if="!assigningDelivery">mdi-check</v-icon>
            Assign Rider
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Rider Dialog -->
    <v-dialog v-model="riderDialog" :max-width="$vuetify.breakpoint.smAndDown ? undefined : 500" :fullscreen="$vuetify.breakpoint.smAndDown" persistent>
      <v-card class="dialog-card" flat>
        <div class="dialog-header" style="background: linear-gradient(135deg, #0f0f0f, #1a1a1a);">
          <span class="dialog-title">
            <v-icon color="#E53935" size="20" class="mr-2">mdi-account-plus</v-icon>
            {{ editingRider ? 'Edit Rider' : 'Add Rider' }}
          </span>
          <v-btn icon small dark @click="riderDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-divider />
        <v-card-text class="pa-4 pa-md-6">
          <v-form ref="riderForm" @submit.prevent="saveRider">
            <v-text-field v-model="riderForm.full_name" label="Full Name *" outlined dense hide-details required />
            <v-text-field v-model="riderForm.email" label="Email" outlined dense hide-details class="mt-4" type="email" />
            <v-text-field v-model="riderForm.phone" label="Phone *" outlined dense hide-details class="mt-4" required />
            <v-text-field v-model="riderForm.id_number" label="ID Number" outlined dense hide-details class="mt-4" />
            <v-select v-model="riderForm.vehicle_type" :items="['boda', 'bicycle', 'car', 'van']" label="Vehicle Type" outlined dense hide-details class="mt-4" />
            <v-text-field v-model="riderForm.vehicle_registration" label="Vehicle Registration" outlined dense hide-details class="mt-4" />
            <v-select v-model="riderForm.status" :items="['active', 'inactive', 'offline']" label="Status" outlined dense hide-details class="mt-4" />
            <v-switch v-model="riderForm.is_verified" label="Verified" color="#E53935" hide-details class="mt-4" />
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-3 pa-md-4">
          <v-spacer />
          <v-btn text class="mr-2" @click="riderDialog = false">Cancel</v-btn>
          <v-btn color="#0f0f0f" dark depressed :loading="saving" @click="saveRider">
            {{ editingRider ? 'Update Rider' : 'Create Rider' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Product Dialog -->
    <v-dialog v-model="productDialog" :max-width="$vuetify.breakpoint.smAndDown ? undefined : 650" :fullscreen="$vuetify.breakpoint.smAndDown" persistent scrollable>
      <v-card class="dialog-card" flat>
        <div class="dialog-header" style="background: linear-gradient(135deg, #0f0f0f, #1a1a1a);">
          <span class="dialog-title">
            <v-icon color="#E53935" size="20" class="mr-2">mdi-package-variant</v-icon>
            {{ editingProduct ? 'Edit Product' : 'Add Product' }}
          </span>
          <v-btn icon small dark @click="productDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-divider />
        <v-card-text class="pa-4 pa-md-6">
          <v-form ref="productForm" @submit.prevent="saveProduct">
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="productForm.name" label="Product Name *" outlined dense hide-details required />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="productForm.slug" label="Slug" outlined dense hide-details hint="Auto-generated from name" persistent-hint />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="productForm.category_id" :items="categories" item-text="name" item-value="id" label="Category" outlined dense hide-details clearable />
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="productForm.short_description" label="Short Description" outlined dense hide-details rows="2" />
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="productForm.description" label="Full Description" outlined dense hide-details rows="3" />
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field v-model="productForm.base_price" label="Base Price (Ksh) *" outlined dense hide-details type="number" step="0.01" required prefix="Ksh" />
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field v-model="productForm.compare_price" label="Compare Price (Ksh)" outlined dense hide-details type="number" step="0.01" prefix="Ksh" />
              </v-col>
              <v-col cols="12" sm="4">
                <v-text-field v-model="productForm.brand" label="Brand" outlined dense hide-details />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="productForm.gender" :items="['men', 'women', 'unisex']" label="Gender" outlined dense hide-details />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="productForm.image_url" label="Image URL" outlined dense hide-details placeholder="https://example.com/image.jpg" />
              </v-col>
              <v-col cols="12" v-if="productForm.image_url">
                <div class="image-preview">
                  <v-img :src="productForm.image_url" max-height="120" contain class="preview-img" />
                </div>
              </v-col>
              <v-col cols="12">
                <div class="switch-group">
                  <v-switch v-model="productForm.is_active" label="Active" color="#E53935" hide-details class="mr-4" />
                  <v-switch v-model="productForm.is_featured" label="Featured" color="#E53935" hide-details class="mr-4" />
                  <v-switch v-model="productForm.is_bestseller" label="Best Seller" color="#E53935" hide-details class="mr-4" />
                  <v-switch v-model="productForm.is_new" label="New" color="#E53935" hide-details />
                </div>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-3 pa-md-4">
          <v-spacer />
          <v-btn text class="mr-2" @click="productDialog = false">Cancel</v-btn>
          <v-btn color="#0f0f0f" dark depressed :loading="saving" @click="saveProduct">
            {{ editingProduct ? 'Update Product' : 'Create Product' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Category Dialog -->
    <v-dialog v-model="categoryDialog" :max-width="$vuetify.breakpoint.smAndDown ? undefined : 500" :fullscreen="$vuetify.breakpoint.smAndDown" persistent>
      <v-card class="dialog-card" flat>
        <div class="dialog-header" style="background: linear-gradient(135deg, #0f0f0f, #1a1a1a);">
          <span class="dialog-title">
            <v-icon color="#E53935" size="20" class="mr-2">mdi-view-list</v-icon>
            {{ editingCategory ? 'Edit Category' : 'Add Category' }}
          </span>
          <v-btn icon small dark @click="categoryDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-divider />
        <v-card-text class="pa-4 pa-md-6">
          <v-form @submit.prevent="saveCategory">
            <v-text-field v-model="categoryForm.name" label="Category Name *" outlined dense hide-details required />
            <v-text-field v-model="categoryForm.slug" label="Slug" outlined dense hide-details class="mt-4" hint="Auto-generated from name" persistent-hint />
            <v-textarea v-model="categoryForm.description" label="Description" outlined dense hide-details class="mt-4" rows="2" />
            <v-text-field v-model="categoryForm.image_url" label="Image URL" outlined dense hide-details class="mt-4" placeholder="https://example.com/category.jpg" />
            <div class="image-preview mt-4" v-if="categoryForm.image_url">
              <v-img :src="categoryForm.image_url" max-height="100" contain class="preview-img" />
            </div>
            <v-switch v-model="categoryForm.is_active" label="Active" color="#E53935" hide-details class="mt-4" />
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-3 pa-md-4">
          <v-spacer />
          <v-btn text class="mr-2" @click="categoryDialog = false">Cancel</v-btn>
          <v-btn color="#0f0f0f" dark depressed :loading="saving" @click="saveCategory">
            {{ editingCategory ? 'Update Category' : 'Create Category' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Variant Dialog -->
    <v-dialog v-model="variantDialog" :max-width="$vuetify.breakpoint.smAndDown ? undefined : 550" :fullscreen="$vuetify.breakpoint.smAndDown" persistent>
      <v-card class="dialog-card" flat>
        <div class="dialog-header" style="background: linear-gradient(135deg, #0f0f0f, #1a1a1a);">
          <span class="dialog-title">
            <v-icon color="#E53935" size="20" class="mr-2">mdi-palette</v-icon>
            {{ editingVariant ? 'Edit Variant' : 'Add Variant' }}
          </span>
          <v-btn icon small dark @click="variantDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-divider />
        <v-card-text class="pa-4 pa-md-6">
          <v-form @submit.prevent="saveVariant">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="variantForm.sku" label="SKU *" outlined dense hide-details required />
              </v-col>
              <v-col cols="6" sm="3">
                <v-text-field v-model="variantForm.size" label="Size" outlined dense hide-details />
              </v-col>
              <v-col cols="6" sm="3">
                <v-text-field v-model="variantForm.color" label="Color" outlined dense hide-details />
              </v-col>
              <v-col cols="8" sm="6">
                <v-text-field v-model="variantForm.color_hex" label="Color HEX" outlined dense hide-details placeholder="#000000">
                  <template #append>
                    <div class="hex-preview" :style="{ background: variantForm.color_hex || '#000' }"></div>
                  </template>
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="variantForm.price_override" label="Price Override (Ksh)" outlined dense hide-details type="number" step="0.01" prefix="Ksh" hint="Leave empty for base price" persistent-hint />
              </v-col>
              <v-col cols="6" sm="6">
                <v-text-field v-model="variantForm.stock_quantity" label="Stock Quantity *" outlined dense hide-details type="number" required />
              </v-col>
              <v-col cols="6" sm="6">
                <v-text-field v-model="variantForm.low_stock_threshold" label="Low Stock Alert" outlined dense hide-details type="number" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="variantForm.image_url" label="Image URL" outlined dense hide-details placeholder="https://example.com/image.jpg" />
              </v-col>
              <v-col cols="12" v-if="variantForm.image_url">
                <div class="image-preview">
                  <v-img :src="variantForm.image_url" max-height="100" contain class="preview-img" />
                </div>
              </v-col>
              <v-col cols="12">
                <v-switch v-model="variantForm.is_active" label="Active" color="#E53935" hide-details />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-3 pa-md-4">
          <v-spacer />
          <v-btn text class="mr-2" @click="variantDialog = false">Cancel</v-btn>
          <v-btn color="#0f0f0f" dark depressed :loading="saving" @click="saveVariant">
            {{ editingVariant ? 'Update Variant' : 'Create Variant' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Order Detail Dialog -->
    <v-dialog v-model="orderDetailDialog" :max-width="$vuetify.breakpoint.smAndDown ? undefined : 700" :fullscreen="$vuetify.breakpoint.smAndDown" persistent>
      <v-card class="dialog-card" flat v-if="selectedOrder">
        <div class="dialog-header" style="background: linear-gradient(135deg, #0f0f0f, #1a1a1a);">
          <span class="dialog-title">
            <v-icon color="#E53935" size="20" class="mr-2">mdi-package-variant</v-icon>
            Order #{{ selectedOrder.order_number }}
          </span>
          <v-btn icon small dark @click="orderDetailDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-divider />
        <v-card-text class="pa-4 pa-md-6">
          <v-row>
            <v-col cols="12" sm="4">
              <div class="detail-label">Customer</div>
              <div class="detail-value">{{ selectedOrder.customer_name || 'N/A' }}</div>
            </v-col>
            <v-col cols="12" sm="4">
              <div class="detail-label">Payment</div>
              <v-chip x-small label :color="selectedOrder.payment_status === 'paid' ? 'success' : 'warning'">
                {{ selectedOrder.payment_status || 'pending' }}
              </v-chip>
            </v-col>
            <v-col cols="12" sm="4" class="text-sm-right">
              <div class="detail-label">Status</div>
              <v-chip :color="getStatusColor(selectedOrder.status)" label dark class="status-chip">
                {{ selectedOrder.status }}
              </v-chip>
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <div class="detail-label mb-3">Order Items</div>
          <div v-if="selectedOrder.items && selectedOrder.items.length > 0" class="table-wrapper">
              <table class="data-table compact">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th v-if="!$vuetify.breakpoint.smAndDown">Variant</th>
                    <th class="text-center">Qty</th>
                    <th class="text-right">Price</th>
                    <th class="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in selectedOrder.items" :key="item.id">
                    <td class="font-weight-medium">{{ item.product_name }}</td>
                    <td v-if="!$vuetify.breakpoint.smAndDown">{{ item.variant_name || '-' }}</td>
                    <td class="text-center">{{ item.quantity }}</td>
                    <td class="text-right">Ksh {{ formatMoney(item.price_per_unit) }}</td>
                    <td class="text-right font-weight-bold">Ksh {{ formatMoney(item.total_price) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          <div v-else class="empty-state small">
            <div class="empty-text">No items in this order</div>
          </div>

          <v-divider class="my-4" />

          <v-row class="order-totals">
            <v-col cols="4">
              <div class="detail-label">Subtotal</div>
              <div class="detail-value">Ksh {{ formatMoney(selectedOrder.subtotal) }}</div>
            </v-col>
            <v-col cols="4">
              <div class="detail-label">Shipping</div>
              <div class="detail-value">Ksh {{ formatMoney(selectedOrder.shipping_cost) }}</div>
            </v-col>
            <v-col cols="4" class="text-right">
              <div class="detail-label">Total</div>
              <div class="detail-total">Ksh {{ formatMoney(selectedOrder.total_amount) }}</div>
            </v-col>
          </v-row>

          <!-- Delivery Assignment Info -->
          <div v-if="selectedOrder.delivery_assignment" class="mt-4">
            <v-divider class="my-4" />
            <div class="detail-label">Delivery Assignment</div>
            <div class="d-flex align-center mt-2">
              <v-icon color="#E53935" class="mr-2">mdi-motorbike</v-icon>
              <span class="font-weight-medium">{{ selectedOrder.delivery_assignment.rider_name || 'Assigned' }}</span>
              <v-chip x-small class="ml-2" :color="getDeliveryStatusColor(selectedOrder.delivery_assignment.status)">
                {{ selectedOrder.delivery_assignment.status }}
              </v-chip>
            </div>
            <div class="text-caption grey--text mt-1">
              {{ selectedOrder.delivery_assignment.rider_phone || '' }}
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" :max-width="$vuetify.breakpoint.smAndDown ? 320 : 400" persistent>
      <v-card class="dialog-card" flat>
        <div class="pa-4 pa-md-6 text-center">
          <div class="delete-icon-wrapper">
            <v-icon size="56" color="error" class="mb-3">mdi-alert-circle-outline</v-icon>
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">Confirm Delete</h3>
          <p class="body-2 grey--text text--darken-1 mb-4">
            {{ deleteMessage }}
          </p>
          <div class="d-flex justify-center" style="gap: 12px;">
            <v-btn text @click="deleteDialog = false">Cancel</v-btn>
            <v-btn color="error" dark depressed :loading="saving" @click="executeDelete" class="delete-btn">
              Delete
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" top right timeout="4000" class="snackbar-custom">
      <div class="d-flex align-center">
        <v-icon left size="20" v-if="snackbar.color === 'error'">mdi-alert-circle</v-icon>
        <v-icon left size="20" v-else-if="snackbar.color === 'success' || snackbar.color === '#E53935'">mdi-check-circle</v-icon>
        <span class="snackbar-text">{{ snackbar.message }}</span>
      </div>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: 'AdminPage',
  data() {
    return {
      mobileDrawer: false,
      activeSection: 'dashboard',
      
      loadingDashboard: false,
      loadingProducts: false,
      loadingCategories: false,
      loadingVariants: false,
      loadingOrders: false,
      loadingReports: false,
      loadingRiders: false,
      loadingRevenue: false,
      saving: false,
      savingDelivery: false,
      assigningDelivery: false,

      // Dashboard
      stats: [
        { label: 'Today\'s Orders', value: 0, icon: 'mdi-cart', bg: '#fff3e0', iconColor: '#f57c00' },
        { label: 'Today\'s Revenue', value: 'Ksh 0', icon: 'mdi-currency-ksh', bg: '#e8f5e9', iconColor: '#388e3c' },
        { label: 'Total Products', value: 0, icon: 'mdi-package-variant', bg: '#e3f2fd', iconColor: '#1976d2' },
        { label: 'Total Customers', value: 0, icon: 'mdi-account-group', bg: '#fce4ec', iconColor: '#c2185b' },
      ],
      riderStats: {
        active: 0,
        today_deliveries: 0,
        pending_assignments: 0,
        total_earnings: 0,
      },
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

      // Riders
      riders: [],
      riderDialog: false,
      editingRider: null,
      riderForm: {
        full_name: '',
        email: '',
        phone: '',
        id_number: '',
        vehicle_type: 'boda',
        vehicle_registration: '',
        status: 'active',
        is_verified: true,
      },

      // Orders
      adminOrders: [],
      statusFilter: '',
      orderDetailDialog: false,
      selectedOrder: null,
      orderStatuses: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],

      // ===== Delivery Assignment =====
      assignDeliveryDialog: false,
      selectedOrderForDelivery: null,
      selectedRiderId: null,
      availableRiders: [],
      deliveryFee: 200,

      // ===== Revenue =====
      revenuePeriod: 'month',
      revenueStats: [
        { label: 'Total Revenue', value: 'Ksh 0', icon: 'mdi-currency-ksh', bg: '#e8f5e9', iconColor: '#388e3c' },
        { label: 'Total Orders', value: 0, icon: 'mdi-package-variant', bg: '#e3f2fd', iconColor: '#1976d2' },
        { label: 'Avg Order Value', value: 'Ksh 0', icon: 'mdi-cash-multiple', bg: '#fff3e0', iconColor: '#f57c00' },
        { label: 'Delivery Fees', value: 'Ksh 0', icon: 'mdi-truck-delivery', bg: '#fce4ec', iconColor: '#E53935' },
      ],
      revenueSummary: {
        total_revenue: 0,
        total_orders: 0,
        average_order_value: 0,
        cod_revenue: 0,
        cod_orders: 0,
        mpesa_revenue: 0,
        mpesa_orders: 0,
        total_delivery_fees: 0
      },
      revenueCodStatus: {
        total_cod_orders: 0,
        cod_paid: 0,
        cod_pending: 0,
        cod_failed: 0
      },
      revenueTopProducts: [],
      revenueConfirmedOrders: [],

      // Reports
      dateFrom: '',
      dateTo: '',
      salesReport: [],
      topProducts: [],
      categoryPerformance: [],

      // Delete
      deleteDialog: false,
      deleteType: '',
      deleteTarget: null,
      deleteMessage: '',

      // Snackbar
      snackbar: { show: false, message: '', color: 'success' },

      // Menu
      menuItems: [
        { id: 'dashboard', title: 'Dashboard', icon: 'mdi-view-dashboard' },
        { id: 'products', title: 'Products', icon: 'mdi-tshirt-crew' },
        { id: 'categories', title: 'Categories', icon: 'mdi-view-list' },
        { id: 'variants', title: 'Variants', icon: 'mdi-palette' },
        { id: 'orders', title: 'Orders', icon: 'mdi-package-variant' },
        { id: 'riders', title: 'Riders', icon: 'mdi-motorbike' },
        { id: 'revenue', title: 'Revenue', icon: 'mdi-currency-ksh' },
        { id: 'reports', title: 'Reports', icon: 'mdi-chart-bar' },
      ],

      searchDebounce: null,
    }
  },
  computed: {
    currentYear() {
      return new Date().getFullYear()
    },
    isAdmin() {
      return this.$store?.state?.authUser?.isAdmin || true
    },
    firebaseUid() {
      return this.$store?.state?.authUser?.uid || 'admin-uid-here'
    },
    pendingOrdersCount() {
      return this.adminOrders.filter(o => o.status === 'pending').length
    }
  },
  mounted() {
    this.fetchDashboardData()
    this.fetchProducts()
    this.fetchCategories()
    this.fetchOrders()
    this.fetchReports()
    this.fetchRiders()
    this.fetchRevenue()

    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)
    this.dateFrom = thirtyDaysAgo.toISOString().split('T')[0]
    this.dateTo = today.toISOString().split('T')[0]
  },
  watch: {
    'productForm.name'(val) {
      if (!this.editingProduct) {
        this.productForm.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      }
    },
    'categoryForm.name'(val) {
      if (!this.editingCategory) {
        this.categoryForm.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      }
    },
    statusFilter() {
      this.fetchOrders()
    },
    selectedProduct() {
      this.fetchVariants()
    },
    revenuePeriod() {
      this.fetchRevenue()
    }
  },
  methods: {
    // ===== API Helper =====
    async apiRequest(url, options = {}) {
      try {
        const config = {
          url,
          method: options.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
          }
        }

        if (options.body) {
          config.data = options.body
        }

        if (this.$axios && typeof this.$axios === 'function') {
          const response = await this.$axios(config)
          return response.data
        }
        
        const response = await fetch(url, {
          method: options.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
          },
          body: options.body ? JSON.stringify(options.body) : undefined
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        return await response.json()
      } catch (error) {
        console.error(`API Error (${url}):`, error)
        throw error
      }
    },

    // Utilities
    showSnackbar(message, color = '#E53935') {
      this.snackbar = { show: true, message, color }
    },
    formatMoney(value) {
      return parseFloat(value || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    },
    debouncedFetchProducts() {
      clearTimeout(this.searchDebounce)
      this.searchDebounce = setTimeout(() => this.fetchProducts(), 300)
    },

    getRiderStatusColor(status) {
      const colors = {
        active: 'success',
        inactive: 'error',
        offline: 'warning',
        busy: 'orange'
      }
      return colors[status] || 'grey'
    },

    getDeliveryStatusColor(status) {
      const colors = {
        pending: 'warning',
        assigned: 'info',
        picked_up: 'primary',
        in_transit: 'primary',
        delivered: 'success',
        cancelled: 'error',
        failed: 'error'
      }
      return colors[status] || 'grey'
    },

    // ===== RIDERS =====
    async fetchRiders() {
      this.loadingRiders = true
      try {
        const data = await this.apiRequest('/api/admin/riders')
        if (data.success) {
          this.riders = data.data || []
        }
      } catch (error) {
        console.error('Error fetching riders:', error)
        this.riders = []
        this.showSnackbar('Failed to load riders', 'error')
      } finally {
        this.loadingRiders = false
      }
    },

    async fetchAvailableRiders() {
      try {
        const data = await this.apiRequest('/api/delivery/available-riders')
        if (data.success) {
          this.availableRiders = data.data || []
          console.log('✅ Available riders loaded:', this.availableRiders.length)
        } else {
          this.availableRiders = []
        }
      } catch (error) {
        console.error('❌ Error fetching available riders:', error)
        this.availableRiders = []
        this.showSnackbar('Failed to load available riders', 'error')
      }
    },

    openRiderDialog(rider = null) {
      this.editingRider = rider
      if (rider) {
        this.riderForm = { ...rider }
      } else {
        this.riderForm = {
          full_name: '',
          email: '',
          phone: '',
          id_number: '',
          vehicle_type: 'boda',
          vehicle_registration: '',
          status: 'active',
          is_verified: true,
        }
      }
      this.riderDialog = true
    },

    async saveRider() {
      if (!this.riderForm.full_name || !this.riderForm.phone) {
        this.showSnackbar('Name and phone are required', 'error')
        return
      }
      this.saving = true
      try {
        let url = '/api/admin/riders'
        let method = 'POST'
        
        if (this.editingRider) {
          url = `/api/admin/riders/${this.editingRider.id}`
          method = 'PUT'
        }
        
        const data = await this.apiRequest(url, {
          method,
          body: this.riderForm
        })
        
        if (data.success) {
          this.showSnackbar(`Rider ${this.editingRider ? 'updated' : 'created'} successfully`, '#E53935')
          this.riderDialog = false
          this.fetchRiders()
          this.fetchDashboardData()
        }
      } catch (error) {
        this.showSnackbar(error.message || 'Failed to save rider', 'error')
      } finally {
        this.saving = false
      }
    },

    // ===== Delivery Assignment =====
    async openAssignDeliveryDialog(order) {
      this.selectedOrderForDelivery = order
      this.selectedRiderId = null
      this.deliveryFee = 200
      this.assignDeliveryDialog = true
      await this.fetchAvailableRiders()
    },

    async assignDelivery() {
      if (!this.selectedRiderId || !this.selectedOrderForDelivery) {
        this.showSnackbar('Please select a rider', 'error')
        return
      }

      this.assigningDelivery = true
      try {
        const payload = {
          order_id: this.selectedOrderForDelivery.id,
          rider_id: this.selectedRiderId,
          admin_firebase_uid: null,
          delivery_fee: parseFloat(this.deliveryFee) || 200
        }

        console.log('📦 Sending assignment request:', payload)

        const data = await this.apiRequest('/api/delivery/assign', {
          method: 'POST',
          body: payload
        })

        console.log('📦 Response:', data)

        if (data.success) {
          this.showSnackbar(`✅ Delivery assigned to rider successfully!`, '#E53935')
          this.assignDeliveryDialog = false
          this.selectedOrderForDelivery = null
          this.selectedRiderId = null
          this.fetchOrders()
          this.fetchDashboardData()
        } else {
          this.showSnackbar(data.error || 'Failed to assign delivery', 'error')
        }
      } catch (error) {
        console.error('❌ Assignment error:', error)
        const errorMsg = error.response?.data?.error || error.message || 'Failed to assign delivery'
        this.showSnackbar(errorMsg, 'error')
      } finally {
        this.assigningDelivery = false
      }
    },

    // ===== Delete =====
    confirmDelete(type, item) {
      this.deleteType = type
      this.deleteTarget = item
      const names = { 
        product: item.name, 
        category: item.name, 
        variant: item.sku,
        rider: item.full_name,
      }
      this.deleteMessage = `Are you sure you want to delete "${names[type]}"? This action cannot be undone.`
      this.deleteDialog = true
    },
    async executeDelete() {
      this.saving = true
      try {
        let url = ''
        if (this.deleteType === 'product') {
          url = `/api/admin/products/${this.deleteTarget.id}`
        } else if (this.deleteType === 'category') {
          if (this.deleteTarget.product_count > 0) {
            this.showSnackbar(`Cannot delete category with ${this.deleteTarget.product_count} products.`, 'error')
            this.deleteDialog = false
            this.saving = false
            return
          }
          url = `/api/admin/categories/${this.deleteTarget.id}`
        } else if (this.deleteType === 'variant') {
          url = `/api/admin/variants/${this.deleteTarget.id}`
        } else if (this.deleteType === 'rider') {
          url = `/api/admin/riders/${this.deleteTarget.id}`
        }
        
        const data = await this.apiRequest(url, { method: 'DELETE' })
        
        if (data.success) {
          this.showSnackbar(`${this.deleteType} deleted`, '#E53935')
          if (this.deleteType === 'product') this.fetchProducts()
          else if (this.deleteType === 'category') this.fetchCategories()
          else if (this.deleteType === 'variant') this.fetchVariants()
          else if (this.deleteType === 'rider') {
            this.fetchRiders()
            this.fetchDashboardData()
          }
        }
        this.deleteDialog = false
      } catch (error) {
        this.showSnackbar(error.message || `Failed to delete ${this.deleteType}`, 'error')
      } finally {
        this.saving = false
      }
    },

    // ==================== DASHBOARD ====================
    async fetchDashboardData() {
      this.loadingDashboard = true
      try {
        const data = await this.apiRequest('/api/admin/dashboard')
        if (data.success) {
          const d = data.data
          this.stats = [
            { label: 'Today\'s Orders', value: d.today?.orders || 0, icon: 'mdi-cart', bg: '#fff3e0', iconColor: '#f57c00' },
            { label: 'Today\'s Revenue', value: `Ksh ${this.formatMoney(d.today?.revenue)}`, icon: 'mdi-cash-multiple', bg: '#e8f5e9', iconColor: '#388e3c' },
            { label: 'Total Products', value: d.totals?.products || 0, icon: 'mdi-package-variant', bg: '#e3f2fd', iconColor: '#1976d2' },
            { label: 'Total Customers', value: d.totals?.users || 0, icon: 'mdi-account-group', bg: '#fce4ec', iconColor: '#c2185b' },
          ]
          this.riderStats = d.riders || { active: 0, today_deliveries: 0, pending_assignments: 0, total_earnings: 0 }
          this.lowStock = d.lowStock || []
          this.recentOrders = d.recentOrders || []
          if (d.deliverySettings) {
            this.deliverySettings = d.deliverySettings
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard:', error)
        this.showSnackbar('Failed to load dashboard', 'error')
      } finally {
        this.loadingDashboard = false
      }
    },

    async saveDeliverySettings() {
      this.savingDelivery = true
      try {
        const data = await this.apiRequest('/api/admin/delivery-settings', {
          method: 'PUT',
          body: this.deliverySettings
        })
        if (data.success) {
          this.showSnackbar('Delivery settings updated!', '#E53935')
        }
      } catch (error) {
        console.error('Error saving delivery settings:', error)
        this.showSnackbar('Failed to save settings', 'error')
      } finally {
        this.savingDelivery = false
      }
    },

    // ==================== PRODUCTS ====================
    async fetchProducts() {
      this.loadingProducts = true
      try {
        const data = await this.apiRequest(`/api/admin/products?search=${encodeURIComponent(this.search)}&limit=100`)
        if (data.success) {
          this.products = data.data || []
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        this.products = []
        this.showSnackbar('Failed to load products', 'error')
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
        this.showSnackbar('Name and price are required', 'error')
        return
      }
      this.saving = true
      try {
        let url = '/api/admin/products'
        let method = 'POST'
        
        if (this.editingProduct) {
          url = `/api/admin/products/${this.editingProduct.id}`
          method = 'PUT'
        }
        
        const data = await this.apiRequest(url, {
          method,
          body: this.productForm
        })
        
        if (data.success) {
          this.showSnackbar(`Product ${this.editingProduct ? 'updated' : 'created'} successfully`, '#E53935')
          this.productDialog = false
          this.fetchProducts()
        }
      } catch (error) {
        this.showSnackbar(error.message || 'Failed to save product', 'error')
      } finally {
        this.saving = false
      }
    },

    // ==================== CATEGORIES ====================
    async fetchCategories() {
      this.loadingCategories = true
      try {
        const data = await this.apiRequest('/api/admin/categories')
        if (data.success) {
          this.categories = data.data || []
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        this.categories = []
        this.showSnackbar('Failed to load categories', 'error')
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
        this.showSnackbar('Category name is required', 'error')
        return
      }
      this.saving = true
      try {
        let url = '/api/admin/categories'
        let method = 'POST'
        
        if (this.editingCategory) {
          url = `/api/admin/categories/${this.editingCategory.id}`
          method = 'PUT'
        }
        
        const data = await this.apiRequest(url, {
          method,
          body: this.categoryForm
        })
        
        if (data.success) {
          this.showSnackbar(`Category ${this.editingCategory ? 'updated' : 'created'} successfully`, '#E53935')
          this.categoryDialog = false
          this.fetchCategories()
        }
      } catch (error) {
        this.showSnackbar(error.message || 'Failed to save category', 'error')
      } finally {
        this.saving = false
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
        const data = await this.apiRequest(`/api/admin/products/${this.selectedProduct}/variants`)
        if (data.success) {
          this.variants = data.data || []
        }
      } catch (error) {
        console.error('Error fetching variants:', error)
        this.variants = []
        this.showSnackbar('Failed to load variants', 'error')
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
        this.showSnackbar('SKU and stock quantity are required', 'error')
        return
      }
      this.saving = true
      try {
        let url, method
        if (this.editingVariant) {
          url = `/api/admin/variants/${this.editingVariant.id}`
          method = 'PUT'
        } else {
          url = `/api/admin/products/${this.selectedProduct}/variants`
          method = 'POST'
        }
        
        const data = await this.apiRequest(url, {
          method,
          body: this.variantForm
        })
        
        if (data.success) {
          this.showSnackbar(`Variant ${this.editingVariant ? 'updated' : 'created'} successfully`, '#E53935')
          this.variantDialog = false
          this.fetchVariants()
        }
      } catch (error) {
        this.showSnackbar(error.message || 'Failed to save variant', 'error')
      } finally {
        this.saving = false
      }
    },

    // ==================== ORDERS ====================
    async fetchOrders() {
      this.loadingOrders = true
      try {
        const params = this.statusFilter && this.statusFilter !== 'All' ? `?status=${this.statusFilter}` : ''
        const data = await this.apiRequest(`/api/admin/orders${params}`)
        if (data.success) {
          this.adminOrders = data.data || []
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
        this.adminOrders = []
        this.showSnackbar('Failed to load orders', 'error')
      } finally {
        this.loadingOrders = false
      }
    },

    async viewOrderDetails(order) {
      try {
        const data = await this.apiRequest(`/api/admin/orders/${order.id}`)
        if (data.success) {
          this.selectedOrder = data.data
          this.orderDetailDialog = true
        }
      } catch (error) {
        console.error('Error fetching order details:', error)
        this.showSnackbar('Failed to load order details', 'error')
      }
    },

    async updateOrderStatus(order, status) {
      try {
        const data = await this.apiRequest(`/api/admin/orders/${order.id}/status`, {
          method: 'PUT',
          body: { status }
        })
        if (data.success) {
          this.showSnackbar(`Order status updated to ${status}`, '#E53935')
          this.fetchOrders()
        }
      } catch (error) {
        this.showSnackbar(error.message || 'Failed to update status', 'error')
      }
    },

    // ==================== REVENUE ====================
    async fetchRevenue() {
      this.loadingRevenue = true
      try {
        const data = await this.apiRequest(`/api/admin/revenue?period=${this.revenuePeriod}`)
        if (data.success) {
          this.revenueSummary = data.data.summary
          this.revenueCodStatus = data.data.cod_status
          this.revenueTopProducts = data.data.top_products || []
          
          // Update stats
          this.revenueStats = [
            { label: 'Total Revenue', value: `Ksh ${this.formatMoney(this.revenueSummary.total_revenue)}`, icon: 'mdi-currency-ksh', bg: '#e8f5e9', iconColor: '#388e3c' },
            { label: 'Total Orders', value: this.revenueSummary.total_orders, icon: 'mdi-package-variant', bg: '#e3f2fd', iconColor: '#1976d2' },
            { label: 'Avg Order Value', value: `Ksh ${this.formatMoney(this.revenueSummary.average_order_value)}`, icon: 'mdi-cash-multiple', bg: '#fff3e0', iconColor: '#f57c00' },
            { label: 'Delivery Fees', value: `Ksh ${this.formatMoney(this.revenueSummary.total_delivery_fees)}`, icon: 'mdi-truck-delivery', bg: '#fce4ec', iconColor: '#E53935' },
          ]
          
          // Fetch confirmed orders
          const confirmedData = await this.apiRequest('/api/admin/revenue/confirmed')
          if (confirmedData.success) {
            this.revenueConfirmedOrders = confirmedData.data.orders || []
          }
        }
      } catch (error) {
        console.error('Error fetching revenue:', error)
        this.showSnackbar('Failed to load revenue data', 'error')
      } finally {
        this.loadingRevenue = false
      }
    },

    // ==================== REPORTS ====================
    async fetchReports() {
      this.loadingReports = true
      try {
        const params = `?from=${this.dateFrom || '2024-01-01'}&to=${this.dateTo || '2030-12-31'}`
        
        const [salesData, topProductsData, categoriesData] = await Promise.all([
          this.apiRequest(`/api/admin/reports/sales${params}`),
          this.apiRequest(`/api/admin/reports/top-products${params}&limit=10`),
          this.apiRequest(`/api/admin/reports/category-performance${params}`)
        ])

        if (salesData.success) this.salesReport = salesData.data || []
        if (topProductsData.success) this.topProducts = topProductsData.data || []
        if (categoriesData.success) this.categoryPerformance = categoriesData.data || []
      } catch (error) {
        console.error('Error fetching reports:', error)
        this.salesReport = []
        this.topProducts = []
        this.categoryPerformance = []
        this.showSnackbar('Failed to load reports', 'error')
      } finally {
        this.loadingReports = false
      }
    },

    getStatusColor(status) {
      const colors = {
        pending: '#ff9800',
        processing: '#2196f3',
        shipped: '#9c27b0',
        delivered: '#4caf50',
        cancelled: '#f44336',
        refunded: '#757575'
      }
      return colors[status] || '#757575'
    }
  }
}
</script>

<style scoped>
/* ============================================================
   ADMIN PANEL STYLES
   ============================================================ */

/* ========== SIDEBAR (Desktop) ========== */
.sidebar-col {
  position: relative;
}
.sidebar-card {
  border-radius: 12px !important;
  position: sticky;
  top: 8px;
  background: white;
  border: 1px solid #e0e0e0;
  padding: 16px 10px;
  min-height: calc(100vh - 16px);
  display: flex;
  flex-direction: column;
}
.brand-section {
  display: flex;
  align-items: center;
  padding: 0 6px;
  margin-bottom: 6px;
}
.brand-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #0f0f0f;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  flex-shrink: 0;
}
.brand-title {
  font-weight: 800;
  font-size: 1rem;
  line-height: 1.2;
  color: #0f0f0f;
}
.brand-subtitle {
  font-size: 0.7rem;
  color: #999;
  font-weight: 500;
}
.sidebar-list {
  flex: 1;
}
.nav-item {
  border-radius: 8px !important;
  margin-bottom: 2px;
  transition: all 0.2s ease;
  min-height: 40px !important;
}
.nav-item:hover {
  background: #f5f5f5;
}
.active-nav-item {
  background: #fce4ec !important;
}
.active-text {
  color: #E53935 !important;
  font-weight: 600 !important;
}
.nav-title {
  font-size: 0.8rem;
  font-weight: 500;
  color: #555;
}
.badge-desktop {
  margin-left: auto;
}
.badge-mobile {
  margin-left: auto;
}
.badge-tab .v-badge__badge {
  font-size: 9px !important;
  min-width: 18px !important;
  height: 18px !important;
}

/* ========== MOBILE HEADER ========== */
.mobile-header {
  z-index: 1000 !important;
}
.brand-icon-small {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: #0f0f0f;
  display: flex;
  align-items: center;
  justify-content: center;
}
.brand-title-small {
  font-weight: 700;
  font-size: 0.9rem;
  color: #0f0f0f;
}

/* ========== MOBILE DRAWER ========== */
.mobile-drawer {
  padding-top: 0 !important;
}
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: #0f0f0f;
  color: white;
}
.drawer-list {
  padding: 6px 0;
}
.drawer-footer {
  padding: 14px 18px;
  border-top: 1px solid #e8e8e8;
  margin-top: auto;
}

/* ========== MOBILE TABS ========== */
.mobile-tabs {
  background: white;
  border-radius: 10px;
  padding: 6px 4px;
  border: 1px solid #e8e8e8;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.mobile-tabs ::-webkit-scrollbar {
  height: 0;
  background: transparent;
}
.v-slide-group {
  padding: 2px 4px;
}
.v-slide-group .v-slide-group__prev,
.v-slide-group .v-slide-group__next {
  min-width: 28px !important;
}
.tab-btn {
  font-size: 0.72rem !important;
  text-transform: none !important;
  letter-spacing: 0.2px !important;
  color: #666 !important;
  min-width: auto !important;
  padding: 6px 12px !important;
  border-radius: 8px !important;
  transition: all 0.2s ease !important;
  height: 36px !important;
}
.tab-btn .tab-label {
  font-weight: 500;
}
.tab-btn.tab-active {
  background: #fce4ec !important;
  color: #E53935 !important;
}
.tab-btn:hover {
  background: #f5f5f5 !important;
}

/* ========== SECTION HEADERS ========== */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
}
.section-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #0f0f0f;
  line-height: 1.2;
  margin-bottom: 4px;
}
.section-subtitle {
  font-size: 0.85rem;
  color: #888;
  margin: 0;
}

/* ========== STATS CARDS ========== */
.stats-row {
  margin-bottom: 4px;
}
.stat-card {
  border-radius: 12px !important;
  padding: 14px;
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e8e8e8;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}
.stat-icon-wrapper {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}
.stat-label {
  font-size: 0.7rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  margin-bottom: 4px;
  white-space: nowrap;
}
.stat-value {
  font-size: 1.3rem;
  font-weight: 800;
  color: #0f0f0f;
  line-height: 1;
}
.stat-value-sm {
  font-size: 1rem !important;
}

/* ========== CONTENT CARDS ========== */
.content-card {
  border-radius: 12px !important;
  background: white;
  border: 1px solid #e8e8e8;
  overflow: hidden;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  flex-wrap: wrap;
  gap: 8px;
}
.card-header-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f0f0f;
}

/* ========== TABLES ========== */
.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 100%;
}
.data-table th {
  text-align: left;
  padding: 10px 16px;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  font-weight: 700;
  color: #888;
  background: #fafafa;
  border-bottom: 1px solid #eee;
  white-space: nowrap;
}
.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.82rem;
  color: #333;
  vertical-align: middle;
}
.data-table tbody tr {
  transition: background 0.15s ease;
}
.data-table tbody tr:hover {
  background: #fafafa;
}
.data-table.compact td,
.data-table.compact th {
  padding: 8px 12px;
}

/* ========== TAGS & CHIPS ========== */
.sku-tag,
.slug-tag {
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.72rem;
  font-family: monospace;
  color: #666;
}
.status-chip {
  font-weight: 600 !important;
  font-size: 0.68rem !important;
  letter-spacing: 0.3px;
}
.color-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: inline-block;
  border: 1px solid rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}
.stock-alert {
  color: #E53935;
  font-weight: 700;
  background: #ffebee;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.78rem;
  white-space: nowrap;
}
.rank-badge {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  color: #666;
  flex-shrink: 0;
}
.rank-badge.top-three {
  background: #E53935;
  color: white;
}

/* ========== PRODUCT IMAGES ========== */
.product-thumb,
.variant-thumb {
  border-radius: 6px;
  background: #f5f5f5;
}

/* ========== EMPTY STATES ========== */
.empty-state {
  text-align: center;
  padding: 40px 16px;
  color: #999;
}
.empty-state.small {
  padding: 20px 16px;
}
.empty-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #666;
  margin-top: 10px;
}
.empty-text {
  font-size: 0.8rem;
  color: #999;
  margin-top: 4px;
}

/* ========== DIALOGS ========== */
.dialog-card {
  border-radius: 12px !important;
  overflow: hidden;
}
.dialog-header {
  background: linear-gradient(135deg, #0f0f0f, #1a1a1a);
  color: white;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dialog-title {
  font-weight: 700;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
}
.image-preview {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 8px;
  border: 1px dashed #ddd;
  text-align: center;
}
.preview-img {
  border-radius: 4px;
}
.switch-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.hex-preview {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* ========== ORDER SUMMARY IN DELIVERY DIALOG ========== */
.order-summary {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}
.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
}
.summary-item {
  text-align: center;
}
.summary-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #999;
  font-weight: 600;
}
.summary-value {
  font-size: 0.9rem;
  color: #333;
  margin-top: 2px;
}
.summary-total {
  font-size: 1.1rem;
  font-weight: 800;
  color: #E53935;
  margin-top: 2px;
}

/* ========== DETAIL VIEW ========== */
.detail-label {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #999;
  font-weight: 600;
  margin-bottom: 4px;
}
.detail-value {
  font-size: 0.9rem;
  font-weight: 500;
  color: #0f0f0f;
}
.detail-total {
  font-size: 1.2rem;
  font-weight: 800;
  color: #E53935;
}
.order-totals {
  background: #fafafa;
  border-radius: 8px;
  padding: 10px 0;
}

/* ========== REVENUE STYLES ========== */
.period-toggle {
  background: white;
  border-radius: 8px !important;
  border: 1px solid #e0e0e0;
}
.period-toggle .v-btn {
  font-weight: 600 !important;
  text-transform: none !important;
}
.period-toggle .v-btn--active {
  background: #0f0f0f !important;
  color: white !important;
}

.payment-stat {
  text-align: center;
  padding: 8px;
}
.payment-label {
  font-size: 0.75rem;
  color: #888;
  text-transform: uppercase;
  font-weight: 600;
}
.payment-value {
  font-size: 1.2rem;
  font-weight: 800;
  color: #0f0f0f;
}
.payment-count {
  font-size: 0.7rem;
  color: #999;
}

.cod-stat {
  text-align: center;
  padding: 4px;
}
.cod-stat.paid .cod-value {
  color: #2E7D32;
}
.cod-stat.pending .cod-value {
  color: #F26522;
}
.cod-label {
  font-size: 0.7rem;
  color: #888;
  font-weight: 600;
}
.cod-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: #0f0f0f;
}

/* ========== BUTTONS ========== */
.action-btn {
  border-radius: 8px !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
}
.refresh-btn {
  border-radius: 8px !important;
  font-weight: 600 !important;
  text-transform: none !important;
}
.assign-btn {
  border-radius: 8px !important;
  font-weight: 700 !important;
  text-transform: none !important;
}
.delete-btn {
  border-radius: 8px !important;
}

/* ========== SNACKBAR ========== */
.snackbar-custom {
  border-radius: 8px !important;
}
.snackbar-text {
  font-weight: 500;
}

/* ========== ANIMATIONS ========== */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ============================================================
   RESPONSIVE BREAKPOINTS
   ============================================================ */

/* ---------- Mobile: 0 - 599px ---------- */
@media (max-width: 599px) {
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .section-title {
    font-size: 1.25rem !important;
  }
  .section-subtitle {
    font-size: 0.75rem !important;
  }

  .stat-card {
    padding: 10px 8px !important;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  .stat-icon-wrapper {
    width: 32px;
    height: 32px;
    margin-right: 0 !important;
  }
  .stat-value {
    font-size: 1.1rem !important;
  }
  .stat-label {
    font-size: 0.6rem !important;
  }

  .card-header {
    padding: 10px 12px !important;
  }
  .card-header-title {
    font-size: 0.82rem !important;
  }

  .data-table th,
  .data-table td {
    padding: 8px 10px !important;
    font-size: 0.72rem !important;
  }
  .data-table .font-weight-medium {
    font-size: 0.72rem !important;
  }

  .empty-state {
    padding: 24px 12px !important;
  }
  .empty-title {
    font-size: 0.9rem !important;
  }

  .dialog-header {
    padding: 12px 16px !important;
  }
  .dialog-title {
    font-size: 0.9rem !important;
  }

  .switch-group {
    flex-direction: column;
    gap: 0;
  }
  .switch-group .v-switch {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    margin-right: 0 !important;
  }

  .order-totals {
    padding: 8px 0 !important;
  }
  .order-totals .col-4 {
    padding: 0 6px;
  }
  .order-totals .detail-value {
    font-size: 0.78rem !important;
  }
  .detail-total {
    font-size: 1rem !important;
  }
  
  .summary-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* ---------- Tablet: 600px - 959px ---------- */
@media (min-width: 600px) and (max-width: 959px) {
  .section-title {
    font-size: 1.5rem !important;
  }
  .stat-card {
    padding: 12px !important;
  }
  .stat-icon-wrapper {
    width: 38px;
    height: 38px;
    margin-right: 10px !important;
  }
  .stat-value {
    font-size: 1.15rem !important;
  }
  .sidebar-col {
    display: none;
  }
}

/* ---------- Small Desktop: 960px - 1263px ---------- */
@media (min-width: 960px) and (max-width: 1263px) {
  .sidebar-card {
    padding: 14px 8px;
  }
  .brand-icon {
    width: 32px;
    height: 32px;
  }
  .brand-title {
    font-size: 0.9rem;
  }
  .nav-title {
    font-size: 0.75rem;
  }
  .stat-value {
    font-size: 1.15rem !important;
  }
}

/* ---------- Hide sidebar on mobile/tablet ---------- */
@media (max-width: 959px) {
  .sidebar-col {
    display: none;
  }
}

/* ---------- Touch-friendly improvements ---------- */
@media (hover: none) and (pointer: coarse) {
  .nav-item {
    min-height: 48px !important;
  }
  .tab-btn {
    min-height: 40px !important;
  }
  .data-table tbody tr:hover {
    background: transparent;
  }
  .stat-card:hover {
    transform: none;
    box-shadow: none;
  }
}

/* ---------- Print Styles ---------- */
@media print {
  .sidebar-col,
  .mobile-header,
  .mobile-tabs,
  .refresh-btn,
  .action-btn {
    display: none !important;
  }
  .content-card {
    border: 1px solid #ddd !important;
    break-inside: avoid;
  }
}
</style>