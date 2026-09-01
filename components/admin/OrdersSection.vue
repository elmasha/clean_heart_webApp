<!-- components/admin/OrdersSection.vue -->
<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6 flex-wrap" style="gap: 12px;">
      <h2 style="font-size: 1.5rem; font-weight: 700;">Orders</h2>
      <div class="d-flex" style="gap: 8px;">
        <v-select
          v-model="statusFilter"
          :items="statusOptions"
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
        <v-data-table
          :headers="headers"
          :items="orders"
          :loading="loading"
          loading-text="Loading orders..."
          :items-per-page="20"
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

          <template #item.created_at="{ item }">
            {{ new Date(item.created_at).toLocaleDateString() }}
          </template>

          <template #item.actions="{ item }">
            <v-btn icon small color="primary" @click="viewOrder(item)">
              <v-icon size="18">mdi-eye</v-icon>
            </v-btn>
            <v-menu offset-y>
              <template #activator="{ on, attrs }">
                <v-btn icon small color="grey" v-bind="attrs" v-on="on">
                  <v-icon size="18">mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item v-for="status in availableStatuses" :key="status" @click="updateStatus(item, status)">
                  <v-list-item-title style="font-size: 0.8rem; text-transform: capitalize;">
                    Mark as {{ status }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Order Detail Dialog -->
    <v-dialog v-model="detailDialog" max-width="700" persistent>
      <v-card style="border-radius: 0;">
        <v-card-title style="background: #000; color: #fff; padding: 16px 24px;">
          Order #{{ selectedOrder?.order_number }}
          <v-spacer />
          <v-btn icon dark @click="detailDialog = false">
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
          <v-data-table
            :headers="itemHeaders"
            :items="selectedOrder.items || []"
            hide-default-footer
            style="font-size: 0.8rem;"
          />

          <v-divider class="my-4" />

          <v-row>
            <v-col cols="4">
              <div style="font-weight: 600; font-size: 0.8rem; color: #999; text-transform: uppercase; letter-spacing: 1px;">Subtotal</div>
              <div>${{ parseFloat(selectedOrder.subtotal || 0).toFixed(2) }}</div>
            </v-col>
            <v-col cols="4">
              <div style="font-weight: 600; font-size: 0.8rem; color: #999; text-transform: uppercase; letter-spacing: 1px;">Shipping</div>
              <div>${{ parseFloat(selectedOrder.shipping_cost || 0).toFixed(2) }}</div>
            </v-col>
            <v-col cols="4">
              <div style="font-weight: 600; font-size: 0.8rem; color: #999; text-transform: uppercase; letter-spacing: 1px;">Total</div>
              <div style="font-size: 1.2rem; font-weight: 700; color: #000;">${{ parseFloat(selectedOrder.total_amount || 0).toFixed(2) }}</div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'OrdersSection',
  data() {
    return {
      orders: [],
      loading: false,
      statusFilter: '',
      statusOptions: ['All', 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
      availableStatuses: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
      detailDialog: false,
      selectedOrder: null,
      headers: [
        { title: 'Order #', key: 'order_number' },
        { title: 'Customer', key: 'firebase_uid' },
        { title: 'Status', key: 'status' },
        { title: 'Total', key: 'total_amount' },
        { title: 'Date', key: 'created_at' },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
      itemHeaders: [
        { title: 'Product', key: 'product_name' },
        { title: 'Variant', key: 'variant_name' },
        { title: 'Qty', key: 'quantity' },
        { title: 'Price', key: 'price_per_unit' },
        { title: 'Total', key: 'total_price' },
      ]
    }
  },
  mounted() {
    this.fetchOrders()
  },
  methods: {
    async fetchOrders() {
      this.loading = true
      try {
        const params = this.statusFilter && this.statusFilter !== 'All' ? { status: this.statusFilter } : {}
        const { data } = await this.$axios.get('/api/admin/orders', { params })
        if (data.success) {
          this.orders = data.data || []
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
        this.$nuxt.$emit('show-snackbar', { message: 'Failed to load orders', color: 'error' })
      } finally {
        this.loading = false
      }
    },

    async viewOrder(order) {
      try {
        const { data } = await this.$axios.get(`/api/admin/orders/${order.id}`)
        if (data.success) {
          this.selectedOrder = data.data
          this.detailDialog = true
        }
      } catch (error) {
        console.error('Error fetching order details:', error)
        this.$nuxt.$emit('show-snackbar', { message: 'Failed to load order details', color: 'error' })
      }
    },

    async updateStatus(order, status) {
      try {
        const { data } = await this.$axios.put(`/api/admin/orders/${order.id}/status`, { status })
        if (data.success) {
          this.$nuxt.$emit('show-snackbar', {
            message: `Order status updated to ${status}`,
            color: '#E53935'
          })
          this.fetchOrders()
          if (this.detailDialog) {
            await this.viewOrder(order)
          }
        }
      } catch (error) {
        this.$nuxt.$emit('show-snackbar', {
          message: error.response?.data?.error || 'Failed to update status',
          color: 'error'
        })
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