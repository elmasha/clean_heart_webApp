<!-- components/DonationModal.vue -->
<template>
  <v-dialog v-model="dialog" max-width="500" persistent>
    <v-card class="donation-card">
      <v-card-title class="donation-header">
        <div class="d-flex align-center">
          <v-icon color="#E53935" size="28" class="mr-3">mdi-heart</v-icon>
          <span class="donation-title">Support Clean Heart</span>
        </div>
        <v-btn icon dark @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-4 pa-md-6">
        <div class="text-center mb-4">
          <p class="donation-subtitle">
            Your donation helps us grow and serve you better. 
            Every contribution makes a difference! ❤️
          </p>
        </div>

        <v-form ref="donationForm" @submit.prevent="submitDonation">
          <!-- Amount Selection -->
          <div class="amount-section mb-4">
            <div class="amount-label">Choose Amount (Ksh)</div>
            <div class="amount-grid">
              <v-btn
                v-for="amount in presetAmounts"
                :key="amount"
                :class="['amount-btn', { 'amount-btn-active': donationForm.amount === amount }]"
                @click="donationForm.amount = amount"
                small
              >
                Ksh {{ amount }}
              </v-btn>
            </div>
            <v-text-field
              v-model="customAmount"
              label="Custom Amount"
              type="number"
              outlined
              dense
              hide-details
              class="mt-3 custom-amount"
              prefix="Ksh"
              min="1"
              @input="handleCustomAmount"
            />
          </div>

          <!-- Personal Info -->
          <v-text-field
            v-model="donationForm.full_name"
            label="Full Name (Optional)"
            outlined
            dense
            hide-details
            class="mb-3"
          />

          <v-text-field
            v-model="donationForm.email"
            label="Email *"
            outlined
            dense
            hide-details
            class="mb-3"
            type="email"
            required
          />

          <v-text-field
            v-model="donationForm.phone"
            label="Phone Number *"
            outlined
            dense
            hide-details
            class="mb-3"
            placeholder="07XX XXX XXX"
            required
          />

          <v-textarea
            v-model="donationForm.message"
            label="Message (Optional)"
            outlined
            dense
            hide-details
            rows="2"
            class="mb-3"
            placeholder="Leave a message of support..."
          />

          <!-- Payment Method -->
          <v-select
            v-model="donationForm.payment_method"
            :items="paymentMethods"
            label="Payment Method"
            outlined
            dense
            hide-details
            class="mb-3"
          />

          <!-- Success Message -->
          <v-alert
            v-if="successMessage"
            type="success"
            dense
            text
            class="mb-3"
            border="left"
            colored-border
          >
            <div class="d-flex align-center">
              <v-icon left size="18" color="success">mdi-check-circle</v-icon>
              {{ successMessage }}
            </div>
          </v-alert>

          <!-- Error Message -->
          <v-alert
            v-if="errorMessage"
            type="error"
            dense
            text
            class="mb-3"
            border="left"
            colored-border
          >
            <div class="d-flex align-center">
              <v-icon left size="18" color="error">mdi-alert-circle</v-icon>
              {{ errorMessage }}
            </div>
          </v-alert>

          <v-btn
            block
            color="#E53935"
            dark
            depressed
            height="50"
            class="donate-btn"
            :loading="loading"
            type="submit"
          >
            <v-icon left size="18" v-if="!loading">mdi-heart</v-icon>
            {{ loading ? 'Processing...' : 'Donate Ksh ' + (donationForm.amount || 0) }}
          </v-btn>

          <div class="text-center mt-3">
            <span class="secure-text">
              <v-icon size="14" color="#999">mdi-shield-lock</v-icon>
              Secure payment via M-Pesa
            </span>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DonationModal',
  props: {
    value: Boolean
  },
  data() {
    return {
      dialog: false,
      loading: false,
      successMessage: '',
      errorMessage: '',
      presetAmounts: [100, 250, 500, 1000, 2500],
      customAmount: '',
      paymentMethods: [
        { text: 'M-Pesa', value: 'mpesa' },
        { text: 'Card (Coming Soon)', value: 'card', disabled: true }
      ],
      donationForm: {
        amount: 100,
        full_name: '',
        email: '',
        phone: '',
        message: '',
        payment_method: 'mpesa'
      }
    }
  },
  watch: {
    value(val) {
      this.dialog = val
    },
    dialog(val) {
      if (!val) {
        this.$emit('input', false)
        this.resetForm()
      }
    }
  },
  computed: {
    firebaseUid() {
      return this.$store.state.authUser?.uid || null
    },
    authUser() {
      return this.$store.state.authUser
    }
  },
  mounted() {
    // Pre-fill user info if logged in
    if (this.authUser) {
      this.donationForm.email = this.authUser.email || ''
      this.donationForm.full_name = this.authUser.displayName || ''
    }
  },
  methods: {
    handleCustomAmount() {
      const val = parseFloat(this.customAmount)
      if (val > 0) {
        this.donationForm.amount = val
        // Deselect preset buttons
        this.presetAmounts.forEach(amount => {
          // Just set the custom value
        })
      }
    },
    resetForm() {
      this.donationForm.amount = 100
      this.donationForm.message = ''
      this.donationForm.payment_method = 'mpesa'
      this.customAmount = ''
      this.successMessage = ''
      this.errorMessage = ''
      this.loading = false
      if (this.authUser) {
        this.donationForm.email = this.authUser.email || ''
        this.donationForm.full_name = this.authUser.displayName || ''
      }
    },
    closeDialog() {
      this.dialog = false
      this.$emit('input', false)
    },
    async submitDonation() {
      this.errorMessage = ''
      this.successMessage = ''

      // Validate
      if (!this.donationForm.amount || this.donationForm.amount < 1) {
        this.errorMessage = 'Please enter a valid donation amount'
        return
      }

      if (!this.donationForm.email) {
        this.errorMessage = 'Please enter your email'
        return
      }

      if (!this.donationForm.phone) {
        this.errorMessage = 'Please enter your phone number'
        return
      }

      if (!this.firebaseUid) {
        this.errorMessage = 'Please log in to donate'
        return
      }

      this.loading = true

      try {
        const response = await this.$axios.post('/api/donations/create', {
          firebaseUid: this.firebaseUid,
          email: this.donationForm.email,
          full_name: this.donationForm.full_name,
          amount: this.donationForm.amount,
          message: this.donationForm.message,
          phone: this.donationForm.phone,
          payment_method: this.donationForm.payment_method
        })

        if (response.data.success) {
          this.successMessage = '✅ Thank you for your generous donation! Check your phone for M-Pesa STK push.'
          
          // Close dialog after delay
          setTimeout(() => {
            this.closeDialog()
            // Emit event for parent
            this.$emit('donation-success', {
              amount: this.donationForm.amount,
              donationId: response.data.data.donationId
            })
          }, 4000)
        } else {
          this.errorMessage = response.data.error || 'Failed to process donation'
        }
      } catch (error) {
        console.error('Donation error:', error)
        this.errorMessage = error.response?.data?.error || 'Something went wrong. Please try again.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.donation-card {
  border-radius: 16px !important;
  overflow: hidden;
}

.donation-header {
  background: linear-gradient(135deg, #0f0f0f, #1a1a1a);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
}

.donation-title {
  font-size: 1.1rem;
  font-weight: 700;
}

.donation-subtitle {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.amount-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.amount-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.amount-btn {
  border-radius: 8px !important;
  border: 2px solid #e0e0e0 !important;
  background: white !important;
  color: #333 !important;
  font-weight: 600 !important;
  height: 38px !important;
  font-size: 0.8rem !important;
}

.amount-btn-active {
  border-color: #E53935 !important;
  background: #fce4ec !important;
  color: #E53935 !important;
}

.amount-btn:hover {
  border-color: #E53935 !important;
}

.custom-amount ::v-deep .v-input__slot {
  border-radius: 8px !important;
}

.donate-btn {
  border-radius: 10px !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px !important;
  box-shadow: 0 4px 20px rgba(229, 57, 53, 0.35) !important;
}

.donate-btn:hover {
  box-shadow: 0 6px 28px rgba(229, 57, 53, 0.5) !important;
}

.secure-text {
  font-size: 0.7rem;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

@media (max-width: 599px) {
  .amount-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>