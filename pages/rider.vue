<template>
  <div style="margin-top: 64px; min-height: calc(100vh - 64px); background: #fafafa;">
    <v-container class="py-8">
      <h1 style="font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 900; color: #000; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 30px;">
        Checkout
      </h1>

      <v-row>
        <!-- Left: Shipping & Payment -->
        <v-col cols="12" md="7">
          <!-- Shipping Info -->
          <div class="mb-8" style="background: #fff; padding: 24px;">
            <div style="font-size: 0.75rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #000; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
              Shipping Information
            </div>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field 
                  v-model="shipping.firstName" 
                  label="First Name" 
                  outlined 
                  dense 
                  hide-details 
                  class="mb-4" 
                  style="border-radius: 0;" 
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field 
                  v-model="shipping.lastName" 
                  label="Last Name" 
                  outlined 
                  dense 
                  hide-details 
                  class="mb-4" 
                  style="border-radius: 0;" 
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-text-field 
                  v-model="shipping.email" 
                  label="Email" 
                  outlined 
                  dense 
                  hide-details 
                  class="mb-4" 
                  style="border-radius: 0;" 
                  type="email"
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-text-field 
                  v-model="shipping.phone" 
                  label="Phone" 
                  outlined 
                  dense 
                  hide-details 
                  class="mb-4" 
                  style="border-radius: 0;" 
                  required
                />
              </v-col>
              <v-col cols="12">
                <v-text-field 
                  v-model="shipping.address" 
                  label="Address" 
                  outlined 
                  dense 
                  hide-details 
                  class="mb-4" 
                  style="border-radius: 0;" 
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field 
                  v-model="shipping.city" 
                  label="City" 
                  outlined 
                  dense 
                  hide-details 
                  class="mb-4" 
                  style="border-radius: 0;" 
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field 
                  v-model="shipping.postalCode" 
                  label="Postal Code" 
                  outlined 
                  dense 
                  hide-details 
                  class="mb-4" 
                  style="border-radius: 0;" 
                />
              </v-col>
            </v-row>

            <!-- Delivery Notes -->
            <v-textarea
              v-model="deliveryNotes"
              label="Delivery Notes (Optional)"
              outlined
              dense
              hide-details
              class="mt-4"
              style="border-radius: 0;"
              placeholder="Any special instructions for the rider..."
              rows="2"
            />
          </div>

          <!-- Payment -->
          <div class="mb-8" style="background: #fff; padding: 24px;">
            <div style="font-size: 0.75rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #000; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
              Payment Method
            </div>
            <v-radio-group v-model="paymentMethod" hide-details class="mb-4">
              <v-radio value="mpesa" label="M-Pesa" />
              <v-radio value="card" label="Credit/Debit Card" />
              <v-radio value="cod" label="Cash on Delivery" />
            </v-radio-group>

            <!-- M-Pesa -->
            <div v-if="paymentMethod === 'mpesa'" class="pa-4" style="background: #f8f8f8; border: 1px solid #e0e0e0;">
              <div class="d-flex align-center" style="gap: 12px;">
                <v-icon color="#E53935" size="28">mdi-cellphone-check</v-icon>
                <div>
                  <div style="font-weight: 600; font-size: 0.9rem; color: #000;">M-Pesa Payment</div>
                  <p class="mt-1 mb-0" style="font-size: 0.75rem; color: #666;">
                    You will enter your phone number in the payment dialog to receive an STK push.
                  </p>
                </div>
              </div>
            </div>

            <!-- Card -->
            <div v-if="paymentMethod === 'card'" class="pa-4" style="background: #f8f8f8; border: 1px solid #e0e0e0;">
              <v-text-field 
                v-model="card.number" 
                label="Card Number" 
                outlined 
                dense 
                hide-details 
                class="mb-3" 
                style="border-radius: 0;" 
                placeholder="4111 1111 1111 1111"
              />
              <v-row>
                <v-col cols="6">
                  <v-text-field 
                    v-model="card.expiry" 
                    label="MM/YY" 
                    outlined 
                    dense 
                    hide-details 
                    style="border-radius: 0;" 
                    placeholder="12/25"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field 
                    v-model="card.cvv" 
                    label="CVV" 
                    outlined 
                    dense 
                    hide-details 
                    style="border-radius: 0;" 
                    placeholder="123"
                    type="password"
                    maxlength="4"
                  />
                </v-col>
              </v-row>
            </div>

            <!-- Cash on Delivery -->
            <div v-if="paymentMethod === 'cod'" class="pa-4" style="background: #f8f8f8; border: 1px solid #e0e0e0;">
              <div class="d-flex align-center" style="gap: 12px;">
                <v-icon color="#E53935" size="28">mdi-truck-delivery</v-icon>
                <div>
                  <div style="font-weight: 600; font-size: 0.9rem; color: #000;">Cash on Delivery</div>
                  <p class="mt-1 mb-0" style="font-size: 0.75rem; color: #666;">
                    Pay when you receive your order. A rider will deliver your items.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </v-col>

        <!-- Right: Order Summary -->
        <v-col cols="12" md="5">
          <div style="background: #fff; padding: 24px; position: sticky; top: 80px; border: 1px solid #e0e0e0;">
            <div style="font-size: 0.75rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #000; margin-bottom: 20px;">
              Order Summary
            </div>

            <!-- Cart Items -->
            <div
              v-for="(item, index) in cartItems"
              :key="getCartItemKey(item, index)"
              class="d-flex align-center mb-4 pb-4"
              style="gap: 12px; border-bottom: 1px solid #e0e0e0;"
            >
              <v-img
                :src="getProductImage(item)"
                width="60"
                height="75"
                contain
                style="background: #f5f5f5; flex-shrink: 0;"
              />
              <div class="flex-grow-1" style="min-width: 0;">
                <div style="font-size: 0.8rem; font-weight: 600; color: #000; line-height: 1.2;">
                  {{ getProductName(item) }}
                </div>
                <div style="font-size: 0.7rem; color: #666;">
                  {{ getVariantDisplay(item) }}
                </div>
                <div style="font-size: 0.7rem; color: #666; font-weight: 600;">
                  Qty: {{ getQuantity(item) }}
                </div>
              </div>
              <div style="font-size: 0.85rem; font-weight: 700; color: #000; white-space: nowrap;">
                Ksh {{ formatPrice(getItemTotal(item)) }}
              </div>
            </div>

            <!-- Totals -->
            <div class="d-flex justify-space-between mb-2">
              <span style="font-size: 0.85rem; color: #666;">Subtotal</span>
              <span style="font-size: 0.85rem; font-weight: 600;">Ksh {{ formatPrice(cartTotal) }}</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span style="font-size: 0.85rem; color: #666;">Delivery</span>
              <span style="font-size: 0.85rem; font-weight: 600;">
                {{ deliveryFee > 0 ? 'Ksh ' + formatPrice(deliveryFee) : 'Free' }}
              </span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span style="font-size: 0.85rem; color: #666;">Tax (16%)</span>
              <span style="font-size: 0.85rem; font-weight: 600;">Ksh {{ formatPrice(tax) }}</span>
            </div>
            <v-divider class="my-3" />
            <div class="d-flex justify-space-between mb-6">
              <span style="font-size: 1rem; font-weight: 700;">Total</span>
              <span style="font-size: 1.2rem; font-weight: 900; color: #E53935;">
                Ksh {{ formatPrice(orderTotal) }}
              </span>
            </div>

            <v-btn
              block
              color="black"
              dark
              height="52"
              style="border-radius: 0; text-transform: uppercase; letter-spacing: 2px; font-size: 0.75rem; font-weight: 600;"
              :loading="placingOrder"
              :disabled="cartItems.length === 0"
              @click="placeOrder"
            >
              {{ cartItems.length === 0 ? 'Cart is Empty' : 'Place Order' }}
            </v-btn>

            <div class="d-flex align-center justify-center mt-4" style="gap: 8px;">
              <v-icon size="16" color="#999">mdi-shield-check</v-icon>
              <span style="font-size: 0.7rem; color: #999;">Secure checkout</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- RESULT DIALOG -->
    <v-dialog v-model="resultDialog" max-width="450" persistent>
      <v-card class="cinematic-card text-center pa-6">
        <v-scale-transition>
          <div>
            <v-icon size="64" :color="resultIconColor" class="mb-3">{{ resultIcon }}</v-icon>
            <h2 :class="statusClass" class="mb-2">{{ resultTitle }}</h2>
            <p class="result-message body-2">{{ resultMessage }}</p>

            <v-alert v-if="resultDetails" :type="resultType" text class="mt-4 text-left" dense>
              {{ resultDetails }}
            </v-alert>

            <!-- Rider Info (if assigned) -->
            <div v-if="assignedRider" class="rider-info mt-4">
              <v-divider class="my-3" />
              <div class="d-flex align-center" style="gap: 12px;">
                <v-avatar size="48" color="#E53935">
                  <v-icon color="white" size="24">mdi-motorbike</v-icon>
                </v-avatar>
                <div class="text-left">
                  <div style="font-weight: 700; font-size: 0.9rem;">{{ assignedRider.name }}</div>
                  <div style="font-size: 0.8rem; color: #666;">{{ assignedRider.vehicle }} · {{ assignedRider.phone }}</div>
                  <div style="font-size: 0.75rem; color: #E53935;">
                    <v-icon x-small color="#E53935">mdi-clock-outline</v-icon>
                    Estimated delivery: {{ estimatedDelivery }}
                  </div>
                </div>
              </div>
            </div>

            <div class="d-flex gap-2 mt-5" style="gap: 12px;">
              <v-btn v-if="isSuccess" block class="pay-btn" @click="goToOrderConfirmation">
                <v-icon left>mdi-check</v-icon>
                View Order
              </v-btn>
              <v-btn v-else-if="isRetryable" block class="pay-btn" @click="resultDialog = false">
                <v-icon left>mdi-refresh</v-icon>
                Try Again
              </v-btn>
              <v-btn v-else block text color="#E53935" @click="resultDialog = false">
                Close
              </v-btn>
            </div>
          </div>
        </v-scale-transition>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'CheckoutPage',
  middleware: 'auth',
  data() {
    return {
      shipping: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
      },
      deliveryNotes: '',
      paymentMethod: 'cod',
      card: { 
        number: '', 
        expiry: '', 
        cvv: '' 
      },
      placingOrder: false,
      
      // Result dialog states
      resultDialog: false,
      resultTitle: '',
      resultMessage: '',
      resultDetails: '',
      resultIcon: 'mdi-information',
      resultIconColor: '#E53935',
      resultType: 'info',
      isSuccess: false,
      isRetryable: false,
      
      paymentOrderId: null,
      paymentOrderNumber: '',
      assignedRider: null,
      estimatedDelivery: '',
    }
  },
  computed: {
    ...mapState({
      cartItems: state => state.cart,
      authUser: state => state.authUser,
    }),
    ...mapGetters(['getCartTotal']),
    cartTotal() {
      return this.getCartTotal || 0
    },
    deliveryFee() {
      const total = this.cartTotal
      if (total >= 7500) {
        return 0
      }
      return 500
    },
    tax() {
      return this.cartTotal * 0.16
    },
    orderTotal() {
      return this.cartTotal + this.deliveryFee + this.tax
    },
    firebaseUid() {
      return this.authUser?.uid || null
    },
    isCartEmpty() {
      return this.cartItems.length === 0
    },
    statusClass() {
      if (this.isSuccess) return 'success-text';
      if (this.resultType === 'warning') return 'warning-text';
      return 'error-text';
    },
  },
  mounted() {
    if (this.isCartEmpty) {
      this.$nuxt.$emit('show-snackbar', {
        message: 'Your cart is empty. Add some items first!',
        color: 'error'
      })
      this.$router.push('/shop')
    }
  },
  methods: {
    // ===== Helper Methods =====
    formatPrice(value) {
      const num = parseFloat(value)
      if (isNaN(num)) return '0.00'
      return num.toFixed(2)
    },

    getProductName(item) {
      if (item.product?.name) return item.product.name
      if (item.product_name) return item.product_name
      if (item.name) return item.name
      return 'Product'
    },

    getProductImage(item) {
      if (item.product?.image) return item.product.image
      if (item.image_url) return item.image_url
      if (item.variant?.imageUrl) return item.variant.imageUrl
      if (item.product?.image_url) return item.product.image_url
      return '/placeholder-product.jpg'
    },

    getQuantity(item) {
      return parseInt(item.quantity || item.qty || 0) || 0
    },

    getUnitPrice(item) {
      const price = item.variant?.unitPrice || item.price || item.unit_price || 0
      return parseFloat(price) || 0
    },

    getItemTotal(item) {
      return this.getUnitPrice(item) * this.getQuantity(item)
    },

    getVariantDisplay(item) {
      if (item.variant && typeof item.variant === 'string') return item.variant
      if (item.variant) {
        const parts = []
        if (item.variant.color) parts.push(item.variant.color)
        if (item.variant.size) parts.push(item.variant.size)
        if (parts.length > 0) return parts.join(' / ')
      }
      if (item.color && item.size) return `${item.color} / ${item.size}`
      if (item.color) return item.color
      if (item.size) return `Size ${item.size}`
      if (item.variant_name) return item.variant_name
      return 'Standard'
    },

    getCartItemKey(item, index) {
      if (item.cartItemId) return `cart-${item.cartItemId}`
      if (item.variantId) return `cart-${item.variantId}`
      if (item.variant?.id) return `cart-${item.variant.id}`
      const productId = item.product?.id || item.product_id || 'unknown'
      const variant = item.variant?.size || item.size || item.variant?.color || item.color || 'default'
      return `cart-${productId}-${variant}`
    },

    validateForm() {
      const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city']
      for (const field of required) {
        if (!this.shipping[field] || !this.shipping[field].trim()) {
          this.$nuxt.$emit('show-snackbar', { 
            message: `Please fill in ${field.replace(/([A-Z])/g, ' $1').trim()}`, 
            color: 'error' 
          })
          return false
        }
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.shipping.email)) {
        this.$nuxt.$emit('show-snackbar', { 
          message: 'Please enter a valid email address', 
          color: 'error' 
        })
        return false
      }

      const phoneRegex = /^[0-9+\-\s()]{8,15}$/
      if (!phoneRegex.test(this.shipping.phone)) {
        this.$nuxt.$emit('show-snackbar', { 
          message: 'Please enter a valid phone number', 
          color: 'error' 
        })
        return false
      }

      return true
    },

    showResult(title, msg, type = 'info', retryable = false) {
      this.resultDialog = true;
      this.resultTitle = title;
      this.resultMessage = msg;
      this.isRetryable = retryable;
      this.isSuccess = type === 'success';
      this.resultType = type;

      const icons = {
        success: { icon: 'mdi-check-circle', color: '#2E7D32' },
        error: { icon: 'mdi-close-circle', color: '#C62828' },
        warning: { icon: 'mdi-alert-circle', color: '#F26522' },
        info: { icon: 'mdi-information', color: '#E53935' },
      };
      const cfg = icons[type] || icons.info;
      this.resultIcon = cfg.icon;
      this.resultIconColor = cfg.color;

      if (type === 'success') {
        this.resultDetails = `Order #${this.paymentOrderNumber} has been placed. You will pay Ksh ${this.formatPrice(this.orderTotal)} on delivery.`;
      } else {
        this.resultDetails = '';
      }
    },

    async placeOrder() {
      if (this.isCartEmpty) {
        this.$nuxt.$emit('show-snackbar', { 
          message: 'Your cart is empty', 
          color: 'error' 
        })
        return
      }

      if (!this.firebaseUid) {
        this.$nuxt.$emit('show-snackbar', { 
          message: 'Please log in to place an order', 
          color: 'error' 
        })
        this.$router.push('/login')
        return
      }

      if (!this.validateForm()) return

      this.placingOrder = true

      try {
        const orderData = {
          firebaseUid: this.firebaseUid,
          shipping_address: this.shipping,
          billing_address: this.shipping,
          payment_method: this.paymentMethod,
          delivery_notes: this.deliveryNotes,
          items: this.cartItems.map(item => ({
            variant_id: item.variantId || item.variant?.id || item.variant_id,
            product_id: item.product_id || item.product?.id,
            quantity: this.getQuantity(item),
            price: this.getUnitPrice(item),
            name: this.getProductName(item),
            variant: this.getVariantDisplay(item)
          })),
          subtotal: this.cartTotal,
          shipping_cost: this.deliveryFee,
          tax_amount: this.tax,
          total_amount: this.orderTotal,
        }

        const { data } = await this.$axios.post('/api/checkout/initiate', orderData, {
          withCredentials: false
        })

        if (data.success) {
          this.paymentOrderId = data.data.orderId
          this.paymentOrderNumber = data.data.orderNumber
          
          if (data.data.assigned_rider) {
            this.assignedRider = data.data.assigned_rider
            this.estimatedDelivery = data.data.estimated_delivery || '1 hour'
          }
          
          this.showResult(
            'Order Placed Successfully! 🎉',
            `Your order #${this.paymentOrderNumber} has been placed. ${data.data.assigned_rider ? 'A rider has been assigned to your delivery.' : 'We will assign a rider shortly.'}`,
            'success'
          )
          
          // Clear cart
          await this.$store.dispatch('clearCart', this.firebaseUid)
        } else {
          this.showResult(
            'Order Failed',
            data.error || 'Failed to place order. Please try again.',
            'error',
            true
          )
        }
      } catch (error) {
        console.error('Order placement error:', error)
        this.showResult(
          'Error',
          error.response?.data?.error || 'Something went wrong. Please try again.',
          'error',
          true
        )
      } finally {
        this.placingOrder = false
      }
    },

    goToOrderConfirmation() {
      this.resultDialog = false;
      this.$router.push(`/myorders/${this.paymentOrderId}`);
    },
  },
  head() {
    return { 
      title: 'Checkout | Clean Heart'
    }
  }
}
</script>

<style scoped>
.v-text-field >>> .v-input__slot {
  border-radius: 0 !important;
}
.v-text-field >>> .v-label {
  font-size: 0.8rem;
}
.v-radio >>> .v-label {
  font-size: 0.85rem;
}

/* Cinematic Card Styles */
.cinematic-card {
  background: white !important;
  border-radius: 20px !important;
}

.pay-btn {
  background: #E53935 !important;
  color: white !important;
  font-weight: 900 !important;
  letter-spacing: 0.5px !important;
  box-shadow: 0 4px 20px rgba(229, 57, 53, 0.35) !important;
}
.pay-btn:hover {
  box-shadow: 0 6px 28px rgba(229, 57, 53, 0.5) !important;
}

.glow-text {
  color: #E53935;
  text-shadow: 0 0 14px rgba(229, 57, 53, 0.25);
}

.success-text { color: #2E7D32; }
.error-text { color: #C62828; }
.warning-text { color: #F26522; }
.result-message { opacity: 0.85; line-height: 1.5; color: #666; }

.rider-info {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 12px 16px;
}
</style>