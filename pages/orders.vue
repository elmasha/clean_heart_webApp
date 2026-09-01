<template>
  <div style="margin-top: 64px; min-height: calc(100vh - 64px); background: #fafafa;">
    <v-container class="py-8">
      <h1 style="font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 900; color: #000; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 30px;">
        My Orders
      </h1>

      <!-- Loading -->
      <div v-if="loading" class="d-flex justify-center py-12">
        <v-progress-circular indeterminate color="#E53935" size="48" />
      </div>

      <!-- No Orders -->
      <div v-else-if="orders.length === 0" class="text-center py-12">
        <v-icon size="64" color="grey lighten-1">mdi-package-variant</v-icon>
        <h3 class="mt-4" style="font-size: 1.2rem; font-weight: 600;">No orders yet</h3>
        <p class="grey--text mt-2">Start shopping to see your orders here</p>
        <v-btn color="black" dark class="mt-4" style="border-radius: 0; text-transform: uppercase;" to="/shop">
          Start Shopping
        </v-btn>
      </div>

      <!-- Orders List -->
      <div v-else>
        <v-row>
          <v-col v-for="order in orders" :key="order.id" cols="12" class="mb-4">
            <div style="border: 1px solid #f0f0f0; background: #fff;">
              <!-- Order Header -->
              <div class="d-flex flex-wrap align-center justify-space-between pa-4" style="background: #f8f8f8; border-bottom: 1px solid #f0f0f0;">
                <div class="d-flex flex-wrap align-center" style="gap: 24px;">
                  <div>
                    <div style="font-size: 0.7rem; color: #999; text-transform: uppercase; letter-spacing: 1px;">Order #</div>
                    <div style="font-size: 0.9rem; font-weight: 700;">{{ order.order_number || order.id }}</div>
                  </div>
                  <div>
                    <div style="font-size: 0.7rem; color: #999; text-transform: uppercase; letter-spacing: 1px;">Date</div>
                    <div style="font-size: 0.85rem;">{{ formatDate(order.created_at) }}</div>
                  </div>
                  <div>
                    <div style="font-size: 0.7rem; color: #999; text-transform: uppercase; letter-spacing: 1px;">Total</div>
                    <div style="font-size: 0.9rem; font-weight: 700;">Ksh {{ formatPrice(order.total_amount) }}</div>
                  </div>
                </div>
                <v-chip
                  :color="statusColor(order.status)"
                  text-color="white"
                  small
                  style="border-radius: 0; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;"
                >
                  {{ order.status }}
                </v-chip>
              </div>

              <!-- Order Items -->
              <div class="pa-4">
                <div
                  v-for="item in (order.items || [])"
                  :key="item.id || item.variant_id"
                  class="d-flex align-center mb-3"
                  style="gap: 16px;"
                >
                  <v-img
                    :src="item.image_url || '/placeholder-product.jpg'"
                    width="60"
                    height="75"
                    contain
                    style="background: #f5f5f5; flex-shrink: 0;"
                  >
                    <template #placeholder>
                      <div class="d-flex align-center justify-center fill-height">
                        <v-icon size="24" color="grey lighten-1">mdi-tshirt-crew-outline</v-icon>
                      </div>
                    </template>
                  </v-img>
                  <div class="flex-grow-1">
                    <div style="font-size: 0.85rem; font-weight: 600;">{{ item.product_name || item.name }}</div>
                    <div style="font-size: 0.75rem; color: #666;">{{ getVariantDisplay(item) }} × {{ item.quantity || item.qty || 1 }}</div>
                  </div>
                  <div style="font-size: 0.85rem; font-weight: 700; white-space: nowrap;">
                    Ksh {{ formatPrice((item.price_per_unit || item.price || 0) * (item.quantity || item.qty || 1)) }}
                  </div>
                </div>

                <!-- Show message if no items -->
                <div v-if="!order.items || order.items.length === 0" class="text-center pa-4" style="color: #999; font-size: 0.85rem;">
                  No items in this order
                </div>
              </div>

              <!-- Order Footer -->
              <div class="d-flex justify-end pa-4" style="border-top: 1px solid #f0f0f0;">
                <v-btn
                  text
                  small
                  color="black"
                  style="text-transform: uppercase; letter-spacing: 1px; font-size: 0.7rem; font-weight: 600;"
                  :to="`/myorders/${order.id}`"
                >
                  <v-icon left size="16">mdi-eye</v-icon>
                  View Details
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'OrdersPage',
  middleware: 'auth',
  data() {
    return {
      orders: [],
      loading: true,
    }
  },
  computed: {
    ...mapState({
      authUser: state => state.authUser,
      storeOrders: state => state.orders, // ✅ Watch store orders
    }),
    firebaseUid() {
      return this.authUser?.uid || null
    }
  },
  async mounted() {
    console.log('Orders page mounted')
    await this.fetchOrders()
  },
  watch: {
    // ✅ Watch for auth changes
    firebaseUid: {
      immediate: true,
      handler(newUid, oldUid) {
        console.log('firebaseUid changed:', newUid, oldUid)
        if (newUid && newUid !== oldUid) {
          this.fetchOrders()
        }
      }
    }
  },
  methods: {
    formatPrice(value) {
      const num = parseFloat(value)
      if (isNaN(num)) return '0.00'
      return num.toFixed(2)
    },

    async fetchOrders() {
      if (!this.firebaseUid) {
        console.log('No firebaseUid, skipping fetch')
        this.loading = false
        return
      }

      this.loading = true
      try {
        console.log('Fetching orders for uid:', this.firebaseUid)
        const result = await this.$store.dispatch('fetchOrders', this.firebaseUid)
        console.log('fetchOrders result:', result)
        
        if (result) {
          this.orders = result
        } else {
          // Try to get from store state
          this.orders = this.storeOrders || []
        }
        console.log('Orders loaded:', this.orders.length)
      } catch (error) {
        console.error('Error fetching orders:', error)
        this.$nuxt.$emit('show-snackbar', {
          message: 'Failed to load orders',
          color: 'error'
        })
        this.orders = []
      } finally {
        this.loading = false
      }
    },

    getVariantDisplay(item) {
      if (item.variant_name) return item.variant_name
      if (item.variant) {
        if (typeof item.variant === 'string') return item.variant
        if (item.variant.color && item.variant.size) {
          return `${item.variant.color} / ${item.variant.size}`
        }
      }
      if (item.color && item.size) {
        return `${item.color} / ${item.size}`
      }
      return 'Standard'
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
        completed: '#2E7D32',
        failed: '#C62828',
      }
      return colors[status?.toLowerCase()] || '#666'
    }
  },
  head() {
    return { title: 'My Orders | Clean Heart' }
  }
}
</script>

<style scoped>
.v-chip {
  border-radius: 0 !important;
}
</style>