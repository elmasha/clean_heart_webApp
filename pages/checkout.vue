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
              <span style="font-size: 0.85rem; color: #666;">Shipping</span>
              <span style="font-size: 0.85rem; font-weight: 600;">
                {{ shippingCost > 0 ? 'Ksh ' + formatPrice(shippingCost) : 'Free' }}
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

    <!-- PAYMENT DIALOG -->
    <v-dialog v-model="paymentDialog" max-width="460" persistent>
      <v-card class="cinematic-card pa-6 text-center">
        <v-btn icon small absolute top right @click="closePaymentDialog">
          <v-icon color="#5C3A21">mdi-close</v-icon>
        </v-btn>

        <!-- State: Entering Phone -->
        <div v-if="!timerEnabled && !processingResult">
          <v-icon size="48" color="#E53935" class="mb-3">mdi-cellphone-message</v-icon>
          <h3 class="glow-text mb-2">M-Pesa Payment</h3>
          <p class="body-2 mb-4" style="color: #666; opacity: 0.8;">
            Enter your M-Pesa number to receive an STK push. Confirm payment by entering your PIN.
          </p>

          <v-text-field
            v-model="mpesaPhoneInput"
            label="M-Pesa Number"
            outlined
            hide-details
            class="mb-4 light-input"
            prepend-inner-icon="mdi-phone"
            placeholder="7XX XXX XXX"
          />

          <div class="summary-box mb-4">
            <div class="d-flex justify-space-between caption">
              <span style="color: #666;">Order #</span>
              <span style="color: #000; font-weight: 600;">{{ paymentOrderNumber || 'Processing...' }}</span>
            </div>
            <div class="d-flex justify-space-between caption mt-1">
              <span style="color: #666;">Items</span>
              <span style="color: #000; font-weight: 600;">{{ cartItems.length }}</span>
            </div>
            <v-divider class="my-2" style="border-color: rgba(0,0,0,0.1);" />
            <div class="d-flex justify-space-between">
              <span class="subtitle-2" style="color: #666;">Total</span>
              <span class="subtitle-1 font-weight-bold" style="color: #E53935;">Ksh {{ formatPrice(orderTotal) }}</span>
            </div>
          </div>

          <v-btn block class="pay-btn" height="48" :loading="loading" :disabled="loading || !mpesaPhoneInput || mpesaPhoneInput.length < 9" @click="processPayment">
            <v-icon left>mdi-send</v-icon>
            Pay Now
          </v-btn>
          
          <p v-if="mpesaPhoneInput && mpesaPhoneInput.length < 9" style="font-size: 0.7rem; color: #E53935; margin-top: 8px;">
            Please enter a valid phone number (at least 9 digits)
          </p>
        </div>

        <!-- State: STK Sent / Waiting -->
        <div v-else-if="timerEnabled && !processingResult" class="payment-wait">
          <v-icon size="48" color="#E53935" class="mb-3 pulsing-icon">mdi-cellphone-sound</v-icon>
          <h3 class="glow-text mb-2">Check Your Phone</h3>
          <p class="body-2 mb-4" style="color: #666; opacity: 0.8;">
            An M-Pesa prompt has been sent to <strong style="color: #000;">254{{ mpesaPhoneInput }}</strong>. Enter your PIN to complete payment.
          </p>

          <div class="timer-container">
            <svg class="timer-svg" viewBox="0 0 100 100">
              <circle class="timer-bg" cx="50" cy="50" r="45" />
              <circle
                class="timer-progress"
                cx="50"
                cy="50"
                r="45"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="timerOffset"
              />
            </svg>
            <div class="timer-text">{{ timerCount }}</div>
          </div>

          <h4 class="mt-3" style="color: #E53935;">Waiting for Confirmation</h4>
          <p class="caption" style="color: #666; opacity: 0.6;">Please do not close this window</p>

          <v-progress-linear indeterminate color="#E53935" class="mt-4" rounded />

          <div class="mt-4 caption" style="color: #666; opacity: 0.6;">
            <v-icon x-small left color="#E53935">mdi-information</v-icon>
            If you don't see the prompt, dial <strong>*126#</strong> to check pending transactions.
          </div>
        </div>

        <!-- State: Querying / Processing -->
        <div v-else-if="processingResult" class="py-4">
          <v-progress-circular indeterminate size="64" color="#E53935" width="3" class="mb-4" />
          <h3 class="glow-text">Confirming Payment</h3>
          <p class="body-2 mt-2" style="color: #666; opacity: 0.8;">Verifying your transaction with M-Pesa...</p>
        </div>
      </v-card>
    </v-dialog>

    <!-- RESULT DIALOG -->
    <v-dialog v-model="resultDialog" max-width="420" persistent>
      <v-card class="cinematic-card text-center pa-6">
        <v-scale-transition>
          <div>
            <v-icon size="64" :color="resultIconColor" class="mb-3">{{ resultIcon }}</v-icon>
            <h2 :class="statusClass" class="mb-2">{{ resultTitle }}</h2>
            <p class="result-message body-2">{{ resultMessage }}</p>

            <v-alert v-if="resultDetails" :type="resultType" text class="mt-4 text-left" dense>
              {{ resultDetails }}
            </v-alert>

            <div class="d-flex gap-2 mt-5">
              <v-btn v-if="isSuccess" block class="pay-btn" @click="goToOrderConfirmation">
                <v-icon left>mdi-check</v-icon>
                View Order
              </v-btn>
              <v-btn v-else-if="isRetryable" block class="pay-btn" @click="retryPayment">
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
      paymentMethod: 'mpesa',
      mpesaPhoneInput: '',
      card: { 
        number: '', 
        expiry: '', 
        cvv: '' 
      },
      placingOrder: false,
      
      // Payment dialog states
      paymentDialog: false,
      resultDialog: false,
      loading: false,
      processingResult: false,
      
      timerCount: 25,
      timerEnabled: false,
      timerInterval: null,
      circumference: 2 * Math.PI * 45,
      
      CheckoutRequestID: null,
      queryLocked: false,
      queryAttempts: 0,
      maxQueryAttempts: 3,
      
      paymentOrderId: null,
      paymentOrderNumber: '',
      
      resultTitle: '',
      resultMessage: '',
      resultDetails: '',
      resultIcon: 'mdi-information',
      resultIconColor: '#E53935',
      resultType: 'info',
      isSuccess: false,
      isRetryable: false,
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
    shippingCost() {
      // Free shipping for orders over 7500 Ksh (approx $50)
      return this.cartTotal >= 1 ? 0 : 1
    },
    tax() {
      return this.cartTotal * 0.16
    },
    orderTotal() {
      return this.cartTotal + this.shippingCost + this.tax
    },
    firebaseUid() {
      return this.authUser?.uid || null
    },
    isCartEmpty() {
      return this.cartItems.length === 0
    },
    timerOffset() {
      const progress = (25 - this.timerCount) / 25;
      return this.circumference * progress;
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
  beforeDestroy() {
    this.clearTimer();
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

      // Accept various phone formats
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

    // ===== Payment Methods =====
    clearTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      this.timerEnabled = false;
      this.processingResult = false;
    },

    showResult(title, msg, processing = false, type = 'info', retryable = false) {
      this.resultDialog = true;
      this.resultTitle = title;
      this.resultMessage = msg;
      this.processingResult = processing;
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
        this.resultDetails = `Order #${this.paymentOrderNumber} confirmed. You will receive a confirmation email shortly.`;
      } else if (type === 'warning' && retryable) {
        this.resultDetails = 'No money was deducted. You can safely try again.';
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

      // If M-Pesa, show payment dialog
      if (this.paymentMethod === 'mpesa') {
        this.paymentDialog = true;
        this.mpesaPhoneInput = '';
        return;
      }

      // For other payment methods, proceed normally
      await this.createOrder()
    },

    async processPayment() {
      if (!this.mpesaPhoneInput || this.mpesaPhoneInput.length < 9) {
        this.showResult('Invalid Number', 'Please enter a valid M-Pesa number (at least 9 digits).', false, 'warning');
        return;
      }

      this.loading = true;
      this.CheckoutRequestID = null;
      this.queryLocked = false;
      this.queryAttempts = 0;

      try {
        const orderData = {
          firebaseUid: this.firebaseUid,
          shipping_address: this.shipping,
          billing_address: this.shipping,
          payment_method: this.paymentMethod,
          mpesaPhone: this.mpesaPhoneInput,
          items: this.cartItems.map(item => ({
            variant_id: item.variantId || item.variant?.id || item.variant_id,
            product_id: item.product_id || item.product?.id,
            quantity: this.getQuantity(item),
            price: this.getUnitPrice(item),
            name: this.getProductName(item),
            variant: this.getVariantDisplay(item)
          })),
          subtotal: this.cartTotal,
          shipping_cost: this.shippingCost,
          tax_amount: this.tax,
          total_amount: this.orderTotal,
        }

        const { data } = await this.$axios.post('/api/checkout/initiate', orderData, {
          withCredentials: false
        })

        if (data.success) {
          const resultData = data.data
          this.paymentOrderId = resultData.orderId
          this.paymentOrderNumber = resultData.orderNumber
          this.CheckoutRequestID = resultData.checkout_request_id

          if (this.CheckoutRequestID) {
            this.loading = false;
            this.timerEnabled = true;
            this.startTimer();
          } else {
            this.loading = false;
            this.showResult('Payment Failed', 'Failed to initiate M-Pesa payment. Please try again.', false, 'error');
          }
        } else {
          this.loading = false;
          this.showResult('Payment Failed', data.error || 'Failed to process payment.', false, 'error');
        }
      } catch (err) {
        this.loading = false;
        console.error('Payment error:', err);
        this.showResult('Payment Error', err.response?.data?.error || 'Failed to start payment. Please try again.', false, 'error');
      }
    },

    async createOrder() {
      this.placingOrder = true

      try {
        const orderData = {
          firebaseUid: this.firebaseUid,
          shipping_address: this.shipping,
          billing_address: this.shipping,
          payment_method: this.paymentMethod,
          items: this.cartItems.map(item => ({
            variant_id: item.variantId || item.variant?.id || item.variant_id,
            product_id: item.product_id || item.product?.id,
            quantity: this.getQuantity(item),
            price: this.getUnitPrice(item),
            name: this.getProductName(item),
            variant: this.getVariantDisplay(item)
          })),
          subtotal: this.cartTotal,
          shipping_cost: this.shippingCost,
          tax_amount: this.tax,
          total_amount: this.orderTotal,
        }

        const { data } = await this.$axios.post('/api/orders', orderData, {
          withCredentials: false
        })

        if (data.success) {
          this.$nuxt.$emit('show-snackbar', {
            message: '🎉 Order placed successfully!',
            color: '#E53935'
          })
          this.$router.push(`/myorders/${data.data.id}`)
        } else {
          this.$nuxt.$emit('show-snackbar', {
            message: data.error || 'Failed to place order.',
            color: 'error'
          })
        }
      } catch (error) {
        console.error('Order creation error:', error)
        this.$nuxt.$emit('show-snackbar', {
          message: 'Something went wrong. Please try again.',
          color: 'error'
        })
      } finally {
        this.placingOrder = false
      }
    },

    startTimer() {
      this.timerCount = 25;
      this.timerInterval = setInterval(() => {
        this.timerCount--;
        if (this.timerCount <= 0) {
          this.clearTimer();
          if (!this.queryLocked && this.CheckoutRequestID) {
            this.queryLocked = true;
            this.processingResult = true;
            this.stkQuery();
          }
        }
      }, 1000);
    },

    async stkQuery() {
      this.queryAttempts++;
      
      try {
        const { data } = await this.$axios.post('/api/checkout/query-stk', {
          checkout_request_id: this.CheckoutRequestID,
        });

        console.log('STK Query Response:', data);
        
        if (!data.success) {
          this.showResult('Error', data.message || 'Could not verify payment status.', false, 'error');
          return;
        }

        const result = data.data;
        const resultCode = String(result.ResultCode);
        const resultDesc = result.ResultDesc || '';

        // Check if payment was successful
        if (resultCode === '0') {
          // Payment successful - check payment status
          await this.checkPaymentStatus();
          return;
        }

        // Handle known error codes
        if (resultCode === '1032') {
          this.showResult('Cancelled', 'You cancelled the payment on your phone. No money was deducted.', false, 'warning', true);
          return;
        }

        if (resultCode === '2001') {
          this.showResult('Wrong PIN', 'You entered the wrong M-Pesa PIN. Please try again.', false, 'warning', true);
          return;
        }

        if (resultCode === '1') {
          this.showResult('Insufficient Balance', 'Your M-Pesa balance is too low for this transaction.', false, 'warning', true);
          return;
        }

        // If still pending and we haven't exceeded max attempts, try again
        if (resultCode === '2002' && this.queryAttempts < this.maxQueryAttempts) {
          setTimeout(() => {
            this.stkQuery();
          }, 5000);
          return;
        }

        this.showResult('Payment Failed', resultDesc || 'The payment could not be completed. Please try again.', false, 'warning', true);
      } catch (error) {
        console.error('STK Query Error:', error);
        
        if (this.queryAttempts < this.maxQueryAttempts) {
          setTimeout(() => {
            this.stkQuery();
          }, 5000);
          return;
        }
        
        this.paymentDialog = false;
        this.processingResult = false;
        this.showResult(
          'Network Error',
          'Could not reach the payment server. Please check your internet and verify your M-Pesa balance/SMS for confirmation.',
          false,
          'warning',
          true
        );
      }
    },

    async checkPaymentStatus() {
      try {
        const response = await this.$axios.get(`/api/checkout/payment-status/${this.paymentOrderId}`, {
          params: { firebaseUid: this.firebaseUid },
          withCredentials: false
        });

        if (response.data.success) {
          const status = response.data.data;
          
          if (status.payment_status === 'success' || status.payment_status === 'paid') {
            this.paymentDialog = false;
            this.processingResult = false;
            this.showResult(
              'Payment Successful!',
              `Your order #${this.paymentOrderNumber} has been confirmed.`,
              false,
              'success'
            );
          } else if (status.payment_status === 'pending') {
            // Still pending - try again after delay
            this.paymentDialog = false;
            this.processingResult = false;
            this.showResult(
              'Payment Processing',
              'Your payment is being processed. Please check your order status.',
              false,
              'info'
            );
          } else {
            this.paymentDialog = false;
            this.processingResult = false;
            this.showResult(
              'Payment Status Unknown',
              `Payment status: ${status.payment_status}. Please check your orders.`,
              false,
              'warning',
              true
            );
          }
        } else {
          this.paymentDialog = false;
          this.processingResult = false;
          this.showResult(
            'Error',
            'Could not verify payment status. Please check your orders.',
            false,
            'warning',
            true
          );
        }
      } catch (error) {
        console.error('Check payment status error:', error);
        this.paymentDialog = false;
        this.processingResult = false;
        this.showResult(
          'Error',
          'Could not verify payment status. Please check your orders.',
          false,
          'warning',
          true
        );
      }
    },

    goToOrderConfirmation() {
      this.resultDialog = false;
      this.$router.push(`/myorders/${this.paymentOrderId}`);
    },

    retryPayment() {
      this.resultDialog = false;
      this.paymentDialog = true;
      this.clearTimer();
      this.queryLocked = false;
      this.loading = false;
      this.processingResult = false;
      this.queryAttempts = 0;
    },

    closePaymentDialog() {
      if (this.timerEnabled) {
        if (!confirm('Payment is in progress. Closing will cancel the check. Continue?')) return;
      }
      this.paymentDialog = false;
      this.clearTimer();
      this.queryLocked = false;
      this.CheckoutRequestID = null;
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

.light-input ::v-deep .v-input__slot {
  background: #FAF8F4 !important;
  border-color: rgba(229, 57, 53, 0.25) !important;
}
.light-input ::v-deep .v-input__slot:hover {
  border-color: rgba(229, 57, 53, 0.5) !important;
}
.light-input ::v-deep .v-icon {
  color: #E53935 !important;
}
.light-input.v-input--is-focused ::v-deep .v-input__slot {
  border-color: #E53935 !important;
  box-shadow: 0 0 0 3px rgba(229, 57, 53, 0.1) !important;
}

.summary-box {
  background: rgba(229, 57, 53, 0.04);
  border: 1px solid rgba(229, 57, 53, 0.12);
  border-radius: 12px;
  padding: 14px 16px;
  text-align: left;
}

.timer-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
}
.timer-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}
.timer-bg {
  fill: none;
  stroke: rgba(229, 57, 53, 0.12);
  stroke-width: 4;
}
.timer-progress {
  fill: none;
  stroke: #E53935;
  stroke-width: 4;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s linear;
}
.timer-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #E53935;
  font-weight: 900;
  font-size: 1.6rem;
}
.pulsing-icon {
  animation: pulse 1.5s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
}

.success-text { color: #2E7D32; }
.error-text { color: #C62828; }
.warning-text { color: #F26522; }
.result-message { opacity: 0.85; line-height: 1.5; color: #666; }
</style>