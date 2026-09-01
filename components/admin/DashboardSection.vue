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
        <v-data-table
          :headers="stockHeaders"
          :items="lowStock"
          :loading="loading"
          loading-text="Loading..."
          hide-default-footer
          style="font-size: 0.8rem;"
        >
          <template #item.stock_quantity="{ item }">
            <span style="color: #E53935; font-weight: 600;">{{ item.stock_quantity }}</span>
          </template>
        </v-data-table>
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
        <v-data-table
          :headers="orderHeaders"
          :items="recentOrders"
          :loading="loading"
          loading-text="Loading..."
          hide-default-footer
          style="font-size: 0.8rem;"
        >
          <template #item.status="{ item }">
            <v-chip :color="getStatusColor(item.status)" small dark>
              {{ item.status }}
            </v-chip>
          </template>
          <template #item.total_amount="{ item }">
            ${{ parseFloat(item.total_amount).toFixed(2) }}
          </template>
        </v-data-table>
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
      stats: [
        { label: 'Today\'s Orders', value: 0, change: 0 },
        { label: 'Today\'s Revenue', value: '$0', change: 0 },
        { label: 'Total Products', value: 0, change: 0 },
        { label: 'Total Customers', value: 0, change: 0 },
      ],
      lowStock: [],
      recentOrders: [],
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
            { label: 'Today\'s Orders', value: d.today.orders, change: 0 },
            { label: 'Today\'s Revenue', value: `$${parseFloat(d.today.revenue).toFixed(2)}`, change: 0 },
            { label: 'Total Products', value: d.totals.products, change: 0 },
            { label: 'Total Customers', value: d.totals.users, change: 0 },
          ]
          this.lowStock = d.lowStock || []
          this.recentOrders = d.recentOrders || []
        }
      } catch (error) {
        console.error('Error fetching dashboard:', error)
      } finally {
        this.loading = false
      }
    },
    refreshData() {
      this.fetchDashboardData()
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