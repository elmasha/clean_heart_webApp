<template>
  <div style="margin-top: 64px;">
    <v-container class="py-8">
      <h1 style="font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 900; color: #000; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 30px;">
        Checkout
      </h1>

      <v-row>
        <!-- Left: Shipping & Payment -->
        <v-col cols="12" md="7">
          <!-- Shipping Info -->
          <div class="mb-8">
            <div style="font-size: 0.75rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #000; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px;">
              Shipping Information
            </div>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="shipping.firstName" label="First Name" outlined dense hide-details class="mb-4" style="border-radius: 0;" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="shipping.lastName" label="Last Name" outlined dense hide-details class="mb-4" style="border-radius: 0;" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="shipping.email" label="Email" outlined dense hide-details class="mb-4" style="border-radius: 0;" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="shipping.phone" label="Phone" outlined dense hide-details class="mb-4" style="border-radius: 0;" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="shipping.address" label="Address" outlined dense hide-details class="mb-4" style="border-radius: 0;" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="shipping.city" label="City" outlined dense hide-details class="mb-4" style="border-radius: 0;" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="shipping.postalCode" label="Postal Code" outlined dense hide-details class="mb-4" style="border-radius: 0;" />
              </v-col>
            </v-row>
          </div>

          <!-- Payment -->
          <div class="mb-8">
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
              <v-text-field v-model="mpesaPhone" label="M-Pesa Phone Number" outlined dense hide-details placeholder="2547XX XXX XXX" style="border-radius: 0;" />
              <p class="mt-2 mb-0" style="font-size: 0.75rem; color: #666;">You will receive an STK push on your phone to complete payment.</p>
            </div>

            <!-- Card -->
            <div v-if="paymentMethod === 'card'" class="pa-4" style="background: #f8f8f8; border: 1px solid #e0e0e0;">
              <v-text-field v-model="card.number" label="Card Number" outlined dense hide-details class="mb-3" style="border-radius: 0;" />
              <v-row>
                <v-col cols="6">
                  <v-text-field v-model="card.expiry" label="MM/YY" outlined dense hide-details style="border-radius: 0;" />
                </v-col>
                <v-col cols="6">
                  <v-text-field v-model="card.cvv" label="CVV" outlined dense hide-details style="border-radius: 0;" />
                </v-col>
              </v-row>
            </div>
          </div>
        </v-col>

        <!-- Right: Order Summary -->
        <v-col cols="12" md="5">
          <div style="background: #f8f8f8; padding: 24px; position: sticky; top: 80px;">
            <div style="font-size: 0.75rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #000; margin-bottom: 20px;">
              Order Summary
            </div>

            <!-- Cart Items -->
            <div
              v-for="item in cartItems"
              :key="`${item.product_id}-${item.variant}`"
              class="d-flex align-center mb-4 pb-4"
              style="gap: 12px; border-bottom: 1px solid #e0e0e0;"
            >
              <v-img
                :src="item.image_url || '/placeholder-product.jpg'"
                width="60"
                height="75"
                contain
                style="background: #fff;"
              />
              <div class="flex-grow-1">
                <div style="font-size: 0.8rem; font-weight: 600;">{{ item.name }}</div>
                <div style="font-size: 0.7rem; color: #666;">{{ item.variant }} x {{ item.qty }}</div>
              </div>
              <div style="font-size: 0.85rem; font-weight: 700;">${{ (item.price * item.qty).toFixed(2) }}</div>
            </div>

            <!-- Totals -->
            <div class="d-flex justify-space-between mb-2">
              <span style="font-size: 0.85rem; color: #666;">Subtotal</span>
              <span style="font-size: 0.85rem; font-weight: 600;">${{ cartTotal.toFixed(2) }}</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span style="font-size: 0.85rem; color: #666;">Shipping</span>
              <span style="font-size: 0.85rem; font-weight: 600;">{{ shippingCost > 0 ? '$' + shippingCost.toFixed(2) : 'Free' }}</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span style="font-size: 0.85rem; color: #666;">Tax</span>
              <span style="font-size: 0.85rem; font-weight: 600;">${{ tax.toFixed(2) }}</span>
            </div>
            <v-divider class="my-3" />
            <div class="d-flex justify-space-between mb-6">
              <span style="font-size: 1rem; font-weight: 700;">Total</span>
              <span style="font-size: 1.2rem; font-weight: 900; color: #E53935;">${{ orderTotal.toFixed(2) }}</span>
            </div>

            <v-btn
              block
              color="black"
              dark
              height="52"
              style="border-radius: 0; text-transform: uppercase; letter-spacing: 2px; font-size: 0.75rem; font-weight: 600;"
              :loading="placingOrder"
              @click="placeOrder"
            >
              Place Order
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
      card: { number: '', expiry: '', cvv: '' },
      placingOrder: false,
    }
  },
  computed: {
    ...mapState({
      cartItems: state => state.cart,
    }),
    ...mapGetters(['getCartTotal']),
    cartTotal() {
      return this.getCartTotal
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
      return this.$store.state.authUser?.uid || null
    }
  },
  methods: {
    async placeOrder() {
      if (!this.validateForm()) return

      this.placingOrder = true

      const orderData = {
        firebase_uid: this.firebaseUid,
        shipping_address: this.shipping,
        payment_method: this.paymentMethod,
        items: this.cartItems.map(item => ({
          product_id: item.product_id,
          qty: item.qty,
          variant: item.variant,
          price: item.price
        })),
        subtotal: this.cartTotal,
        shipping_cost: this.shippingCost,
        tax_amount: this.tax,
        total_amount: this.orderTotal,
      }

      const result = await this.$store.dispatch('createOrder', orderData)
      this.placingOrder = false

      if (result.success) {
        this.$nuxt.$emit('show-snackbar', {
          message: 'Order placed successfully!',
          color: '#E53935'
        })
        this.$router.push(`/orders/${result.data.order_id || result.data.id}`)
      } else {
        this.$nuxt.$emit('show-snackbar', {
          message: result.error || 'Failed to place order',
          color: 'error'
        })
      }
    },
    validateForm() {
      const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city']
      for (const field of required) {
        if (!this.shipping[field]) {
          this.$nuxt.$emit('show-snackbar', { message: `Please fill in ${field}`, color: 'error' })
          return false
        }
      }
      if (this.paymentMethod === 'mpesa' && !this.mpesaPhone) {
        this.$nuxt.$emit('show-snackbar', { message: 'Please enter M-Pesa phone number', color: 'error' })
        return false
      }
      return true
    }
  },
  head() {
    return { title: 'Checkout' }
  }
}
</script>