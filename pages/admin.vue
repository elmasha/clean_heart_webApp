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
          <keep-alive>
            <component :is="currentComponent" />
          </keep-alive>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import DashboardSection from '~/components/admin/DashboardSection.vue'
import ProductsSection from '~/components/admin/ProductsSection.vue'
import CategoriesSection from '~/components/admin/CategoriesSection.vue'
import VariantsSection from '~/components/admin/VariantsSection.vue'
import OrdersSection from '~/components/admin/OrdersSection.vue'
import ReportsSection from '~/components/admin/ReportsSection.vue'

export default {
  name: 'AdminPage',
  components: {
    DashboardSection,
    ProductsSection,
    CategoriesSection,
    VariantsSection,
    OrdersSection,
    ReportsSection
  },
  data() {
    return {
      activeSection: 'dashboard',
      menuItems: [
        { id: 'dashboard', title: 'Dashboard', icon: 'mdi-view-dashboard' },
        { id: 'products', title: 'Products', icon: 'mdi-tshirt-crew' },
        { id: 'categories', title: 'Categories', icon: 'mdi-view-list' },
        { id: 'variants', title: 'Variants', icon: 'mdi-palette' },
        { id: 'orders', title: 'Orders', icon: 'mdi-package-variant' },
        { id: 'reports', title: 'Reports', icon: 'mdi-chart-bar' },
      ]
    }
  },
  computed: {
    currentComponent() {
      const map = {
        dashboard: 'DashboardSection',
        products: 'ProductsSection',
        categories: 'CategoriesSection',
        variants: 'VariantsSection',
        orders: 'OrdersSection',
        reports: 'ReportsSection'
      }
      return map[this.activeSection] || 'DashboardSection'
    }
  }
}
</script>