<template>
  <v-card style="border-radius: 0; border: 1px solid #e0e0e0;">
    <v-card-title style="font-size: 1.1rem; font-weight: 700; border-bottom: 1px solid #f0f0f0; padding: 16px 24px;">
      <v-icon left color="#E53935" size="24">mdi-package-variant</v-icon>
      My Orders
    </v-card-title>
    <v-card-text class="pa-0">
      <div v-if="loading" class="d-flex justify-center pa-8">
        <v-progress-circular indeterminate color="#E53935" size="40" />
      </div>

      <div v-else-if="orders.length === 0" class="text-center pa-8">
        <v-icon size="48" color="grey lighten-1">mdi-package-variant-remove</v-icon>
        <p class="mt-4" style="color: #666;">You haven't placed any orders yet.</p>
        <v-btn color="black" dark style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.75rem;" to="/shop">
          Start Shopping
        </v-btn>
      </div>

      <v-list v-else>
        <v-list-item
          v-for="order in orders"
          :key="order.id"
          :to="`/myorders/${order.id}`"
          class="px-4"
        >
          <v-list-item-avatar>
            <v-icon color="#E53935">mdi-receipt</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              Order #{{ order.order_number || order.id }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ formatDate(order.created_at) }} · Ksh {{ formatPrice(order.total_amount) }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-chip :color="statusColor(order.status)" text-color="white" small style="border-radius: 0;">
              {{ order.status }}
            </v-chip>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'OrdersSection',
  props: {
    orders: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    formatPrice(value) {
      const num = parseFloat(value)
      if (isNaN(num)) return '0.00'
      return num.toFixed(2)
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    statusColor(status) {
      const colors = {
        pending: '#F57C00',
        processing: '#2196F3',
        shipped: '#9C27B0',
        delivered: '#2E7D32',
        cancelled: '#C62828',
        refunded: '#666',
        paid: '#2E7D32',
        completed: '#2E7D32'
      }
      return colors[status?.toLowerCase()] || '#666'
    }
  }
}
</script>