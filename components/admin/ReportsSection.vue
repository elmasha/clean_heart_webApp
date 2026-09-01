<!-- components/admin/ReportsSection.vue -->
<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6 flex-wrap" style="gap: 12px;">
      <h2 style="font-size: 1.5rem; font-weight: 700;">Reports</h2>
      <div class="d-flex" style="gap: 8px;">
        <v-text-field
          v-model="dateFrom"
          label="From"
          type="date"
          outlined
          dense
          hide-details
          style="max-width: 160px; border-radius: 0;"
        />
        <v-text-field
          v-model="dateTo"
          label="To"
          type="date"
          outlined
          dense
          hide-details
          style="max-width: 160px; border-radius: 0;"
        />
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
            <v-data-table
              :headers="salesHeaders"
              :items="salesReport"
              :loading="loading"
              loading-text="Loading..."
              :items-per-page="10"
              style="font-size: 0.8rem;"
            >
              <template #item.date="{ item }">
                {{ new Date(item.date).toLocaleDateString() }}
              </template>
              <template #item.gross_revenue="{ item }">
                ${{ parseFloat(item.gross_revenue || 0).toFixed(2) }}
              </template>
              <template #item.net_revenue="{ item }">
                ${{ parseFloat(item.net_revenue || 0).toFixed(2) }}
              </template>
            </v-data-table>
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
            <v-data-table
              :headers="topProductsHeaders"
              :items="topProducts"
              :loading="loading"
              loading-text="Loading..."
              :items-per-page="10"
              style="font-size: 0.8rem;"
            >
              <template #item.total_revenue="{ item }">
                ${{ parseFloat(item.total_revenue || 0).toFixed(2) }}
              </template>
            </v-data-table>
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
            <v-data-table
              :headers="categoryHeaders"
              :items="categoryPerformance"
              :loading="loading"
              loading-text="Loading..."
              :items-per-page="10"
              style="font-size: 0.8rem;"
            >
              <template #item.revenue="{ item }">
                ${{ parseFloat(item.revenue || 0).toFixed(2) }}
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'ReportsSection',
  data() {
    return {
      loading: false,
      dateFrom: '',
      dateTo: '',
      salesReport: [],
      topProducts: [],
      categoryPerformance: [],
      salesHeaders: [
        { title: 'Date', key: 'date' },
        { title: 'Orders', key: 'orders' },
        { title: 'Gross Revenue', key: 'gross_revenue' },
        { title: 'Net Revenue', key: 'net_revenue' },
        { title: 'Shipping', key: 'shipping' },
        { title: 'Tax', key: 'tax' },
      ],
      topProductsHeaders: [
        { title: 'Product', key: 'name' },
        { title: 'Orders', key: 'total_orders' },
        { title: 'Quantity Sold', key: 'total_quantity_sold' },
        { title: 'Revenue', key: 'total_revenue' },
      ],
      categoryHeaders: [
        { title: 'Category', key: 'name' },
        { title: 'Orders', key: 'orders' },
        { title: 'Items Sold', key: 'items_sold' },
        { title: 'Revenue', key: 'revenue' },
      ]
    }
  },
  mounted() {
    // Set default date range (last 30 days)
    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)
    this.dateFrom = thirtyDaysAgo.toISOString().split('T')[0]
    this.dateTo = today.toISOString().split('T')[0]
    this.fetchReports()
  },
  methods: {
    async fetchReports() {
      this.loading = true
      try {
        const params = {
          from: this.dateFrom || '2024-01-01',
          to: this.dateTo || '2030-12-31'
        }

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
        this.$nuxt.$emit('show-snackbar', { message: 'Failed to load reports', color: 'error' })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>