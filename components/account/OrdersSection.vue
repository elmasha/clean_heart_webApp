<!-- components/account/OrdersSection.vue -->
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

      <div v-else>
        <v-data-table
          :headers="headers"
          :items="orders"
          :items-per-page="10"
          style="font-size: 0.85rem;"
          class="elevation-0"
        >
          <template #item.order_number="{ item }">
            <nuxt-link :to="`/orders/${item.id}`" style="color: #E53935; text-decoration: none; font-weight: 600;">
              {{ item.order_number }}
            </nuxt-link>
          </template>

          <template #item.status="{ item }">
            <v-chip :color="getStatusColor(item.status)" small dark>
              {{ item.status }}
            </v-chip>
          </template>

          <template #item.total_amount="{ item }">
            ${{ parseFloat(item.total_amount).toFixed(2) }}
          </template>

          <template #item.created_at="{ item }">
            {{ formatDate(item.created_at) }}
          </template>

          <template #item.actions="{ item }">
            <v-btn icon small color="#E53935" :to="`/orders/${item.id}`">
              <v-icon size="18">mdi-eye</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </div>
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
  data() {
    return {
      headers: [
        { title: 'Order #', key: 'order_number' },
        { title: 'Status', key: 'status' },
        { title: 'Total', key: 'total_amount' },
        { title: 'Date', key: 'created_at' },
        { title: 'Actions', key: 'actions', sortable: false }
      ]
    }
  },
  methods: {
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
    },
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  }
}
</script>