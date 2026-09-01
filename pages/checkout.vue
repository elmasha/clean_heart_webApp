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
              <v-text-field 
                v-model="mpesaPhone" 
                label="M-Pesa Phone Number" 
                outlined 
                dense 
                hide-details 
                placeholder="2547XX XXX XXX" 
                style="border-radius: 0;" 
              />
              <p class="mt-2 mb-0" style="font-size: 0.75rem; color: #666;">
                You will receive an STK push on your phone to complete payment.
              </p>
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
                ${{ formatPrice(getItemTotal(item)) }}
              </div>
            </div>

            <!-- Totals -->
            <div class="d-flex justify-space-between mb-2">
              <span style="font-size: 0.85rem; color: #666;">Subtotal</span>
              <span style="font-size: 0.85rem; font-weight: 600;">${{ formatPrice(cartTotal) }}</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span style="font-size: 0.85rem; color: #666;">Shipping</span>
              <span style="font-size: 0.85rem; font-weight: 600;">
                {{ shippingCost > 0 ? '$' + formatPrice(shippingCost) : 'Free' }}
              </span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span style="font-size: 0.85rem; color: #666;">Tax (16%)</span>
              <span style="font-size: 0.85rem; font-weight: 600;">${{ formatPrice(tax) }}</span>
            </div>
            <v-divider class="my-3" />
            <div class="d-flex justify-space-between mb-6">
              <span style="font-size: 1rem; font-weight: 700;">Total</span>
              <span style="font-size: 1.2rem; font-weight: 900; color: #E53935;">
                ${{ formatPrice(orderTotal) }}
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
      mpesaPhone: '',
      card: { 
        number: '', 
        expiry: '', 
        cvv: '' 
      },
      placingOrder: false,
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
      return this.cartTotal >= 75 ? 0 : 10
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
    }
  },
  mounted() {
    // Redirect to cart if cart is empty
    if (this.isCartEmpty) {
      this.$nuxt.$emit('show-snackbar', {
        message: 'Your cart is empty. Add some items first!',
        color: 'error'
      })
      this.$router.push('/shop')
    }
  },
  methods: {
    /**
     * Format price to 2 decimal places
     */
    formatPrice(value) {
      const num = parseFloat(value)
      if (isNaN(num)) return '0.00'
      return num.toFixed(2)
    },

    /**
     * Get product name from cart item
     */
    getProductName(item) {
      if (item.product?.name) return item.product.name
      if (item.product_name) return item.product_name
      if (item.name) return item.name
      return 'Product'
    },

    /**
     * Get product image from cart item
     */
    getProductImage(item) {
      if (item.product?.image) return item.product.image
      if (item.image_url) return item.image_url
      if (item.variant?.imageUrl) return item.variant.imageUrl
      return '/placeholder-product.jpg'
    },

    /**
     * Get quantity from cart item
     */
    getQuantity(item) {
      return parseInt(item.quantity || item.qty || 0) || 0
    },

    /**
     * Get unit price from cart item
     */
    getUnitPrice(item) {
      const price = item.variant?.unitPrice || item.price || item.unit_price || 0
      return parseFloat(price) || 0
    },

    /**
     * Get item total
     */
    getItemTotal(item) {
      return this.getUnitPrice(item) * this.getQuantity(item)
    },

    /**
     * Get variant display text
     */
    getVariantDisplay(item) {
      // If item has a direct variant string
      if (item.variant && typeof item.variant === 'string') {
        return item.variant
      }
      
      // If item has variant object
      if (item.variant) {
        const parts = []
        if (item.variant.color) parts.push(item.variant.color)
        if (item.variant.size) parts.push(item.variant.size)
        if (parts.length > 0) return parts.join(' / ')
      }
      
      // If item has separate fields
      if (item.color && item.size) {
        return `${item.color} / ${item.size}`
      }
      if (item.color) return item.color
      if (item.size) return `Size ${item.size}`
      if (item.variant_name) return item.variant_name
      
      return 'Standard'
    },

    /**
     * Generate unique key for cart items
     */
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

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.shipping.email)) {
        this.$nuxt.$emit('show-snackbar', { 
          message: 'Please enter a valid email address', 
          color: 'error' 
        })
        return false
      }

      // Validate phone
      const phoneRegex = /^[0-9+\-\s()]{8,15}$/
      if (!phoneRegex.test(this.shipping.phone)) {
        this.$nuxt.$emit('show-snackbar', { 
          message: 'Please enter a valid phone number', 
          color: 'error' 
        })
        return false
      }

      if (this.paymentMethod === 'mpesa' && !this.mpesaPhone.trim()) {
        this.$nuxt.$emit('show-snackbar', { 
          message: 'Please enter M-Pesa phone number', 
          color: 'error' 
        })
        return false
      }

      if (this.paymentMethod === 'mpesa') {
        const mpesaRegex = /^[0-9]{10,12}$/
        if (!mpesaRegex.test(this.mpesaPhone.replace(/[^0-9]/g, ''))) {
          this.$nuxt.$emit('show-snackbar', { 
            message: 'Please enter a valid M-Pesa phone number (e.g., 2547XX XXX XXX)', 
            color: 'error' 
          })
          return false
        }
      }

      if (this.paymentMethod === 'card') {
        if (!this.card.number || this.card.number.replace(/\s/g, '').length < 16) {
          this.$nuxt.$emit('show-snackbar', { 
            message: 'Please enter a valid card number', 
            color: 'error' 
          })
          return false
        }
        if (!this.card.expiry || this.card.expiry.length < 5) {
          this.$nuxt.$emit('show-snackbar', { 
            message: 'Please enter card expiry date (MM/YY)', 
            color: 'error' 
          })
          return false
        }
        if (!this.card.cvv || this.card.cvv.length < 3) {
          this.$nuxt.$emit('show-snackbar', { 
            message: 'Please enter CVV', 
            color: 'error' 
          })
          return false
        }
      }

      return true
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
        // Prepare order data for backend
        const orderData = {
          firebaseUid: this.firebaseUid,
          shipping_address: this.shipping,
          billing_address: this.shipping, // Using same as shipping for simplicity
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

        console.log('Placing order with data:', orderData)

        const result = await this.$store.dispatch('createOrder', orderData)

        if (result.success) {
          this.$nuxt.$emit('show-snackbar', {
            message: '🎉 Order placed successfully!',
            color: '#E53935'
          })
          
          // Redirect to order confirmation
          const orderId = result.data?.order_id || result.data?.id || 'confirmation'
          this.$router.push(`/orders/${orderId}`)
        } else {
          this.$nuxt.$emit('show-snackbar', {
            message: result.error || 'Failed to place order. Please try again.',
            color: 'error'
          })
        }
      } catch (error) {
        console.error('Order placement error:', error)
        this.$nuxt.$emit('show-snackbar', {
          message: 'Something went wrong. Please try again.',
          color: 'error'
        })
      } finally {
        this.placingOrder = false
      }
    }
  },
  head() {
    return { 
      title: 'Checkout | Clean Heart'
    }
  }
}
</script>

<style scoped>
/* Override Vuetify input styles for cleaner look */
.v-text-field >>> .v-input__slot {
  border-radius: 0 !important;
}

.v-text-field >>> .v-label {
  font-size: 0.8rem;
}

.v-radio >>> .v-label {
  font-size: 0.85rem;
}
</style>