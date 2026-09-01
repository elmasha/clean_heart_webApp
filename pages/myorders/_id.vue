<template>
  <div style="margin-top: 64px; min-height: calc(100vh - 64px); background: #fafafa;">
    <v-container class="py-8">
      <!-- Back Button -->
      <div class="mb-4">
        <v-btn
          text
          small
          color="black"
          style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.7rem;"
          @click="$router.push('/orders')"
        >
          <v-icon left size="16">mdi-arrow-left</v-icon>
          Back to Orders
        </v-btn>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="d-flex justify-center py-12">
        <v-progress-circular indeterminate color="#E53935" size="48" />
      </div>

      <!-- Order Not Found -->
      <div v-else-if="!order" class="text-center py-12">
        <v-icon size="64" color="grey lighten-1">mdi-package-variant-remove</v-icon>
        <h3 class="mt-4" style="font-size: 1.2rem; font-weight: 600;">Order not found</h3>
        <p class="grey--text mt-2">The order you're looking for doesn't exist</p>
        <v-btn color="black" dark class="mt-4" style="border-radius: 0; text-transform: uppercase;" to="/orders">
          Back to Orders
        </v-btn>
      </div>

      <!-- Order Details -->
      <div v-else>
        <!-- Order Header -->
        <div class="d-flex flex-wrap align-center justify-space-between mb-6">
          <div>
            <h1 style="font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 900; color: #000; text-transform: uppercase; letter-spacing: -1px;">
              Order #{{ order.order_number || order.id }}
            </h1>
            <div style="font-size: 0.85rem; color: #666; margin-top: 4px;">
              Placed on {{ formatDate(order.created_at) }}
            </div>
          </div>
          <v-chip
            :color="statusColor(order.status)"
            text-color="white"
            style="border-radius: 0; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; padding: 8px 16px;"
          >
            {{ order.status }}
          </v-chip>
        </div>

        <v-row>
          <!-- Order Items -->
          <v-col cols="12" md="8">
            <!-- Order Items List -->
            <div style="background: #fff; border: 1px solid #e0e0e0; margin-bottom: 24px;">
              <div style="padding: 16px 24px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Order Items</span>
                <span style="font-size: 0.8rem; color: #666;">{{ order.items ? order.items.length : 0 }} item(s)</span>
              </div>
              
              <div class="pa-4">
                <div
                  v-for="(item, index) in order.items"
                  :key="item.id || index"
                  class="d-flex align-center mb-4 pb-4"
                  style="gap: 16px; border-bottom: 1px solid #f0f0f0;"
                >
                  <!-- Product Image -->
                  <v-img
                    :src="item.image_url || '/placeholder-product.jpg'"
                    width="80"
                    height="100"
                    contain
                    style="background: #f5f5f5; flex-shrink: 0;"
                  />
                  
                  <!-- Product Info -->
                  <div class="flex-grow-1">
                    <div style="font-size: 0.9rem; font-weight: 600; color: #000;">
                      {{ item.product_name || item.name }}
                    </div>
                    <div style="font-size: 0.8rem; color: #666;">
                      {{ getVariantDisplay(item) }}
                    </div>
                    <div style="font-size: 0.8rem; color: #666;">
                      SKU: {{ item.sku }}
                    </div>
                    <div class="d-flex align-center mt-1" style="gap: 8px;">
                      <span style="font-size: 0.8rem; color: #666;">Qty: {{ item.quantity || item.qty }}</span>
                      <span style="font-size: 0.8rem; color: #666;">×</span>
                      <span style="font-size: 0.85rem; font-weight: 600; color: #000;">
                        Ksh {{ formatPrice(item.price_per_unit || item.price) }}
                      </span>
                    </div>
                  </div>
                  
                  <!-- Item Total -->
                  <div style="font-size: 1rem; font-weight: 700; color: #000; white-space: nowrap;">
                    Ksh {{ formatPrice(item.total_price || (item.price * item.qty)) }}
                  </div>
                </div>

                <!-- Order Notes -->
                <div v-if="order.notes" style="margin-top: 8px; padding-top: 12px; border-top: 1px solid #f0f0f0;">
                  <div style="font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 4px;">
                    Notes
                  </div>
                  <div style="font-size: 0.85rem; color: #666;">{{ order.notes }}</div>
                </div>
              </div>
            </div>

            <!-- Order Status History -->
            <div style="background: #fff; border: 1px solid #e0e0e0;">
              <div style="padding: 16px 24px; border-bottom: 1px solid #f0f0f0;">
                <span style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Status History</span>
              </div>
              <div class="pa-4">
                <div v-if="order.history && order.history.length > 0">
                  <div
                    v-for="(entry, index) in order.history"
                    :key="index"
                    class="d-flex align-start mb-3"
                    style="gap: 12px;"
                  >
                    <div style="min-width: 140px;">
                      <span style="font-size: 0.75rem; color: #999;">
                        {{ formatDateTime(entry.created_at) }}
                      </span>
                    </div>
                    <div style="flex-grow: 1;">
                      <v-chip
                        :color="statusColor(entry.status)"
                        text-color="white"
                        small
                        style="border-radius: 0; font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;"
                      >
                        {{ entry.status }}
                      </v-chip>
                      <div v-if="entry.notes" style="font-size: 0.75rem; color: #666; margin-top: 2px;">
                        {{ entry.notes }}
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center pa-4" style="color: #999; font-size: 0.85rem;">
                  No status history available
                </div>
              </div>
            </div>
          </v-col>

          <!-- Order Summary Sidebar -->
          <v-col cols="12" md="4">
            <div style="background: #fff; border: 1px solid #e0e0e0; position: sticky; top: 80px;">
              <div style="padding: 16px 24px; border-bottom: 1px solid #f0f0f0;">
                <span style="font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Order Summary</span>
              </div>

              <div class="pa-4">
                <!-- Shipping Address -->
                <div class="mb-4">
                  <div style="font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px;">
                    Shipping Address
                  </div>
                  <div style="font-size: 0.85rem; color: #333; line-height: 1.6;">
                    <div v-if="shippingAddress">
                      {{ shippingAddress.firstName || shippingAddress.name || '' }}
                      {{ shippingAddress.lastName || '' }}
                    </div>
                    <div v-if="shippingAddress">{{ shippingAddress.address || shippingAddress.street || '' }}</div>
                    <div v-if="shippingAddress">
                      {{ shippingAddress.city || '' }}
                      {{ shippingAddress.state || shippingAddress.county || '' }}
                      {{ shippingAddress.postalCode || shippingAddress.zip || '' }}
                    </div>
                    <div v-if="shippingAddress">{{ shippingAddress.country || 'Kenya' }}</div>
                    <div v-if="shippingAddress?.phone || order.phone" class="mt-2">
                      Phone: {{ shippingAddress?.phone || order.phone }}
                    </div>
                    <div v-if="shippingAddress?.email || order.email" class="mt-1">
                      Email: {{ shippingAddress?.email || order.email }}
                    </div>
                  </div>
                </div>

                <v-divider class="my-3" />

                <!-- Payment Method -->
                <div class="mb-4">
                  <div style="font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #999; margin-bottom: 8px;">
                    Payment Method
                  </div>
                  <div style="font-size: 0.85rem; color: #333; text-transform: capitalize;">
                    {{ order.payment_method || order.paymentMethod || 'N/A' }}
                  </div>
                  <div v-if="order.payment_status" style="font-size: 0.8rem; color: #666; text-transform: capitalize;">
                    Status: {{ order.payment_status }}
                  </div>
                  <div v-if="order.mpesa_receipt" style="font-size: 0.8rem; color: #666;">
                    Receipt: {{ order.mpesa_receipt }}
                  </div>
                </div>

                <v-divider class="my-3" />

                <!-- Totals -->
                <div class="mb-2 d-flex justify-space-between">
                  <span style="font-size: 0.85rem; color: #666;">Subtotal</span>
                  <span style="font-size: 0.85rem; font-weight: 600;">Ksh {{ formatPrice(order.subtotal || 0) }}</span>
                </div>
                <div v-if="order.discount_amount > 0" class="mb-2 d-flex justify-space-between">
                  <span style="font-size: 0.85rem; color: #666;">Discount</span>
                  <span style="font-size: 0.85rem; font-weight: 600; color: #E53935;">-Ksh {{ formatPrice(order.discount_amount) }}</span>
                </div>
                <div class="mb-2 d-flex justify-space-between">
                  <span style="font-size: 0.85rem; color: #666;">Shipping</span>
                  <span style="font-size: 0.85rem; font-weight: 600;">
                    {{ parseFloat(order.shipping_cost || 0) > 0 ? 'Ksh ' + formatPrice(order.shipping_cost) : 'Free' }}
                  </span>
                </div>
                <div class="mb-2 d-flex justify-space-between">
                  <span style="font-size: 0.85rem; color: #666;">Tax</span>
                  <span style="font-size: 0.85rem; font-weight: 600;">Ksh {{ formatPrice(order.tax_amount || 0) }}</span>
                </div>
                <v-divider class="my-3" />
                <div class="d-flex justify-space-between">
                  <span style="font-size: 1rem; font-weight: 700;">Total</span>
                  <span style="font-size: 1.2rem; font-weight: 900; color: #E53935;">
                    Ksh {{ formatPrice(order.total_amount || 0) }}
                  </span>
                </div>

                <!-- Actions -->
                <div class="mt-4">
                  <v-btn
                    block
                    color="black"
                    dark
                    height="44"
                    style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.7rem; font-weight: 600;"
                    @click="$router.push('/shop')"
                  >
                    <v-icon left size="16">mdi-shopping</v-icon>
                    Continue Shopping
                  </v-btn>
                  <v-btn
                    v-if="order.status === 'delivered' || order.status === 'completed'"
                    block
                    text
                    class="mt-2"
                    style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.7rem; font-weight: 600;"
                    @click="reorder"
                  >
                    Reorder Items
                  </v-btn>
                </div>
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
  name: 'MyOrderDetailPage',
  middleware: 'auth',
  data() {
    return {
      order: null,
      loading: true,
    }
  },
  computed: {
    ...mapState({
      authUser: state => state.authUser,
    }),
    firebaseUid() {
      return this.authUser?.uid || null
    },
    shippingAddress() {
      if (!this.order) return null
      // Try to parse shipping_address if it's a JSON string
      if (this.order.shipping_address && typeof this.order.shipping_address === 'string') {
        try {
          return JSON.parse(this.order.shipping_address)
        } catch (e) {
          return this.order.shipping_address
        }
      }
      return this.order.shipping_address || this.order.shippingAddress || {}
    }
  },
  async mounted() {
    await this.fetchOrder()
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.fetchOrder()
      }
    }
  },
  methods: {
    formatPrice(value) {
      const num = parseFloat(value)
      if (isNaN(num)) return '0.00'
      return num.toFixed(2)
    },

    async fetchOrder() {
      const orderId = this.$route.params.id
      
      if (!orderId || !this.firebaseUid) {
        this.loading = false
        return
      }

      this.loading = true
      try {
        const result = await this.$store.dispatch('fetchOrderById', {
          firebaseUid: this.firebaseUid,
          orderId: orderId
        })
        
        if (result) {
          this.order = result
          console.log('Order details:', this.order)
        }
      } catch (error) {
        console.error('Error fetching order:', error)
        this.$nuxt.$emit('show-snackbar', {
          message: 'Failed to load order details',
          color: 'error'
        })
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
        month: 'long',
        day: 'numeric'
      })
    },

    formatDateTime(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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
    },

    reorder() {
      // Add all items from this order to cart
      this.$nuxt.$emit('show-snackbar', {
        message: 'Items added to cart!',
        color: '#E53935'
      })
      this.$router.push('/cart')
    }
  },
  head() {
    const orderNumber = this.order?.order_number || this.order?.id || 'Order'
    return { 
      title: `Order #${orderNumber} | Clean Heart`
    }
  }
}
</script>

<style scoped>
.v-chip {
  border-radius: 0 !important;
}
</style>