<!-- components/admin/DashboardSection.vue -->
<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6">
      <h2 style="font-size: 1.5rem; font-weight: 700;">Dashboard</h2>
      <v-btn color="#E53935" dark small style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.7rem;" @click="refreshData">
        <v-icon left size="16">mdi-refresh</v-icon>
        Refresh
      </v-btn>
    </div>

    <!-- Stats Cards -->
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
            <div v-if="stat.change" style="font-size: 0.7rem; color: #4CAF50;">
              <v-icon size="12" color="#4CAF50">mdi-arrow-up</v-icon>
              {{ stat.change }}% from last month
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Low Stock Alerts -->
    <v-card class="mt-4" style="border-radius: 0;">
      <v-card-title style="font-size: 1rem; font-weight: 600;">
        <v-icon left size="20" color="#E53935">mdi-alert-circle</v-icon>
        Low Stock Alerts
      </v-card-title>
      <v-divider />
      <v-card-text>
        <div v-if="loading" class="d-flex justify-center pa-4">
          <v-progress-circular indeterminate color="#E53935" size="24" />
        </div>
        <v-data-table
          v-else
          :headers="stockHeaders"
          :items="lowStock"
          hide-default-footer
          style="font-size: 0.8rem;"
        >
          <template #item.stock_quantity="{ item }">
            <span style="color: #E53935; font-weight: 600;">{{ item.stock_quantity }}</span>
          </template>
        </v-data-table>
        <div v-if="!loading && lowStock.length === 0" class="text-center pa-4" style="color: #999;">
          All products have sufficient stock ✅
        </div>
      </v-card-text>
    </v-card>

    <!-- Delivery Settings -->
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

    <!-- Recent Orders -->
    <v-card class="mt-4" style="border-radius: 0;">
      <v-card-title style="font-size: 1rem; font-weight: 600;">
        <v-icon left size="20" color="#E53935">mdi-clock</v-icon>
        Recent Orders
      </v-card-title>
      <v-divider />
      <v-card-text>
        <div v-if="loading" class="d-flex justify-center pa-4">
          <v-progress-circular indeterminate color="#E53935" size="24" />
        </div>
        <v-data-table
          v-else
          :headers="orderHeaders"
          :items="recentOrders"
          hide-default-footer
          style="font-size: 0.8rem;"
        >
          <template #item.status="{ item }">
            <v-chip :color="getStatusColor(item.status)" small dark>
              {{ item.status }}
            </v-chip>
          </template>
          <template #item.total_amount="{ item }">
            Ksh {{ parseFloat(item.total_amount).toFixed(2) }}
          </template>
        </v-data-table>
        <div v-if="!loading && recentOrders.length === 0" class="text-center pa-4" style="color: #999;">
          No orders yet
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'DashboardSection',
  data() {
    return {
      loading: false,
      savingDelivery: false,
      stats: [
        { label: 'Today\'s Orders', value: 0, change: 0 },
        { label: 'Today\'s Revenue', value: 'Ksh 0', change: 0 },
        { label: 'Total Products', value: 0, change: 0 },
        { label: 'Total Customers', value: 0, change: 0 },
      ],
      lowStock: [],
      recentOrders: [],
      deliverySettings: {
        free_delivery_threshold: 7500,
        delivery_fee: 500,
        is_active: true
      },
      stockHeaders: [
        { title: 'Product', key: 'name' },
        { title: 'SKU', key: 'sku' },
        { title: 'Size', key: 'size' },
        { title: 'Color', key: 'color' },
        { title: 'Stock', key: 'stock_quantity' },
      ],
      orderHeaders: [
        { title: 'Order #', key: 'order_number' },
        { title: 'Status', key: 'status' },
        { title: 'Total', key: 'total_amount' },
        { title: 'Date', key: 'created_at' },
      ]
    }
  },
  mounted() {
    this.fetchDashboardData()
  },
  methods: {
    async fetchDashboardData() {
      this.loading = true
      try {
        const { data } = await this.$axios.get('/api/admin/dashboard')
        if (data.success) {
          const d = data.data
          this.stats = [
            { label: 'Today\'s Orders', value: d.today?.orders || 0, change: 0 },
            { label: 'Today\'s Revenue', value: `Ksh ${parseFloat(d.today?.revenue || 0).toFixed(2)}`, change: 0 },
            { label: 'Total Products', value: d.totals?.products || 0, change: 0 },
            { label: 'Total Customers', value: d.totals?.users || 0, change: 0 },
          ]
          this.lowStock = d.lowStock || []
          this.recentOrders = d.recentOrders || []
          
          if (d.deliverySettings) {
            this.deliverySettings = d.deliverySettings
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard:', error)
        this.$nuxt.$emit('show-snackbar', { message: 'Failed to load dashboard data', color: 'error' })
      } finally {
        this.loading = false
      }
    },
    
    refreshData() {
      this.fetchDashboardData()
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