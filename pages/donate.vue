<!-- pages/donate.vue -->
<template>
  <div class="donate-page">
    <v-container class="py-8">
      <!-- Page Header -->
      <div class="text-center mb-8">
        <v-icon size="48" color="#E53935" class="mb-3">mdi-heart</v-icon>
        <h1 class="page-title">Support Clean Heart</h1>
        <p class="page-subtitle">
          Your donation helps us grow and continue bringing you the best fashion.
          Every contribution makes a difference! ❤️
        </p>
      </div>

      <!-- Stats -->
      <v-row class="mb-8">
        <v-col cols="12" sm="4">
          <v-card class="stat-card" flat>
            <div class="stat-content text-center">
              <div class="stat-value">Ksh {{ formatMoney(totalDonations) }}</div>
              <div class="stat-label">Total Donations Raised</div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card class="stat-card" flat>
            <div class="stat-content text-center">
              <div class="stat-value">{{ totalDonors }}</div>
              <div class="stat-label">Total Donors</div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
          <v-card class="stat-card" flat>
            <div class="stat-content text-center">
              <div class="stat-value">
                <v-icon color="#E53935" size="28">mdi-heart</v-icon>
              </div>
              <div class="stat-label">Made with ❤️</div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Main Donation Section -->
      <v-row>
        <v-col cols="12" lg="7">
          <v-card class="donation-form-card" flat>
            <div class="card-header">
              <span class="card-title">Make a Donation</span>
              <v-chip small color="#E53935" text-color="white">Secure</v-chip>
            </div>
            <v-divider />

            <v-card-text class="pa-4 pa-md-6">
              <div class="text-center mb-4">
                <p class="donation-subtitle">
                  Your support helps us create better products and experiences for everyone.
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
                      :class="['amount-btn', { 'amount-btn-active': donationData.amount === amount }]"
                      @click="donationData.amount = amount; customAmount = ''"
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
                  v-model="donationData.full_name"
                  label="Full Name"
                  outlined
                  dense
                  hide-details
                  class="mb-3"
                  placeholder="John Doe"
                />

                <v-text-field
                  v-model="donationData.email"
                  label="Email Address *"
                  outlined
                  dense
                  hide-details
                  class="mb-3"
                  type="email"
                  placeholder="john@example.com"
                  required
                  :error-messages="emailErrors"
                  @input="emailErrors = ''"
                />

                <v-text-field
                  v-model="donationData.phone"
                  label="Phone Number *"
                  outlined
                  dense
                  hide-details
                  class="mb-3"
                  placeholder="07XX XXX XXX"
                  required
                  :error-messages="phoneErrors"
                  @input="phoneErrors = ''"
                  prepend-inner-icon="mdi-phone"
                />

                <v-textarea
                  v-model="donationData.message"
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
                  v-model="donationData.payment_method"
                  :items="paymentMethods"
                  label="Payment Method"
                  outlined
                  dense
                  hide-details
                  class="mb-4"
                />

                <!-- Messages -->
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

                <!-- Submit Button -->
                <v-btn
                  block
                  color="#E53935"
                  dark
                  depressed
                  height="52"
                  class="donate-btn"
                  :loading="loading"
                  type="submit"
                >
                  <v-icon left size="18" v-if="!loading">mdi-heart</v-icon>
                  {{ loading ? 'Processing...' : 'Donate Ksh ' + (donationData.amount || 0) }}
                </v-btn>

                <div class="text-center mt-3">
                  <span class="secure-text">
                    <v-icon size="14" color="#999">mdi-shield-lock</v-icon>
                    Secure payment via M-Pesa
                  </span>
                </div>

                <div class="text-center mt-4">
                  <nuxt-link to="/" class="back-link">
                    <v-icon size="16" class="mr-1">mdi-arrow-left</v-icon>
                    Back to Store
                  </nuxt-link>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right Side - Impact Info -->
        <v-col cols="12" lg="5">
          <v-card class="impact-card" flat>
            <div class="card-header">
              <span class="card-title">Your Impact</span>
              <v-icon color="#E53935">mdi-heart</v-icon>
            </div>
            <v-divider />

            <v-card-text class="pa-4 pa-md-6">
              <div class="impact-item">
                <div class="impact-icon">
                  <v-icon color="#E53935" size="28">mdi-tshirt-crew</v-icon>
                </div>
                <div>
                  <div class="impact-title">Support Local Fashion</div>
                  <div class="impact-desc">Your donation helps us source quality materials from local suppliers.</div>
                </div>
              </div>

              <div class="impact-item">
                <div class="impact-icon">
                  <v-icon color="#E53935" size="28">mdi-leaf</v-icon>
                </div>
                <div>
                  <div class="impact-title">Sustainable Practices</div>
                  <div class="impact-desc">We invest in eco-friendly packaging and sustainable production methods.</div>
                </div>
              </div>

              <div class="impact-item">
                <div class="impact-icon">
                  <v-icon color="#E53935" size="28">mdi-account-group</v-icon>
                </div>
                <div>
                  <div class="impact-title">Community Growth</div>
                  <div class="impact-desc">Your contribution helps us build a stronger community of fashion enthusiasts.</div>
                </div>
              </div>

              <div class="impact-item">
                <div class="impact-icon">
                  <v-icon color="#E53935" size="28">mdi-star</v-icon>
                </div>
                <div>
                  <div class="impact-title">Better Products</div>
                  <div class="impact-desc">Funds go towards design innovation and higher quality materials.</div>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Top Donors -->
          <v-card class="top-donors-card mt-4" flat>
            <div class="card-header">
              <span class="card-title">Top Donors</span>
              <v-chip small color="#E53935" text-color="white">❤️</v-chip>
            </div>
            <v-divider />

            <div v-if="loadingDonors" class="d-flex justify-center pa-6">
              <v-progress-circular indeterminate color="#E53935" size="28" />
            </div>

            <div v-else-if="topDonors.length === 0" class="empty-state pa-6">
              <v-icon size="32" color="grey lighten-1">mdi-heart-outline</v-icon>
              <div class="empty-title">Be the First Donor!</div>
              <div class="empty-text">Your generosity will be featured here.</div>
            </div>

            <div v-else class="table-wrapper">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Donor</th>
                    <th class="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(donor, index) in topDonors" :key="donor.email">
                    <td>
                      <span class="rank-badge" :class="{ 'top-three': index < 3 }">{{ index + 1 }}</span>
                    </td>
                    <td>
                      <div class="d-flex align-center">
                        <v-avatar size="28" color="#fce4ec" class="mr-2">
                          <v-icon size="14" color="#E53935">mdi-account</v-icon>
                        </v-avatar>
                        <div>
                          <div class="font-weight-medium donor-name">{{ donor.full_name || 'Anonymous' }}</div>
                          <div class="text-caption grey--text donor-email">{{ donor.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="text-right font-weight-bold donor-amount">Ksh {{ formatMoney(donor.total_amount) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Donation Modal -->
    <DonationModal 
      v-model="showDonationModal" 
      @donation-success="handleDonationSuccess" 
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DonationModal from '@/components/DonationModal.vue'

export default {
  name: 'DonatePage',
  components: {
    DonationModal
  },
  data() {
    return {
      loading: false,
      loadingDonors: false,
      showDonationModal: false,
      successMessage: '',
      errorMessage: '',
      emailErrors: '',
      phoneErrors: '',
      customAmount: '',
      totalDonations: 0,
      totalDonors: 0,
      topDonors: [],
      presetAmounts: [100, 250, 500, 1000, 2500],
      paymentMethods: [
        { text: 'M-Pesa', value: 'mpesa' },
        { text: 'Card (Coming Soon)', value: 'card', disabled: true }
      ],
      donationData: {
        amount: 100,
        full_name: '',
        email: '',
        phone: '',
        message: '',
        payment_method: 'mpesa'
      }
    }
  },
  computed: {
    ...mapState({
      authUser: state => state.authUser
    }),
    firebaseUid() {
      return this.authUser?.uid || null
    }
  },
  mounted() {
    // Pre-fill user info if logged in
    if (this.authUser) {
      this.donationData.email = this.authUser.email || ''
      this.donationData.full_name = this.authUser.displayName || ''
    }
    this.fetchDonationStats()
  },
  methods: {
    formatMoney(value) {
      return parseFloat(value || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },

    handleCustomAmount() {
      const val = parseFloat(this.customAmount)
      if (val > 0) {
        this.donationData.amount = val
      }
    },

    async fetchDonationStats() {
      this.loadingDonors = true
      try {
        const { data } = await this.$axios.get('/api/donations/total')
        if (data.success) {
          this.totalDonations = data.data.total_amount || 0
          this.totalDonors = data.data.total_count || 0
          this.topDonors = data.data.top_donors || []
        }
      } catch (error) {
        console.error('Error fetching donation stats:', error)
      } finally {
        this.loadingDonors = false
      }
    },

    async submitDonation() {
      this.errorMessage = ''
      this.successMessage = ''
      this.emailErrors = ''
      this.phoneErrors = ''

      // Validate
      if (!this.donationData.amount || this.donationData.amount < 1) {
        this.errorMessage = 'Please enter a valid donation amount'
        return
      }

      if (!this.donationData.email) {
        this.emailErrors = 'Email is required'
        return
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.donationData.email)) {
        this.emailErrors = 'Please enter a valid email'
        return
      }

      if (!this.donationData.phone) {
        this.phoneErrors = 'Phone number is required'
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
          email: this.donationData.email,
          full_name: this.donationData.full_name,
          amount: this.donationData.amount,
          message: this.donationData.message,
          phone: this.donationData.phone,
          payment_method: this.donationData.payment_method
        })

        if (response.data.success) {
          this.successMessage = '✅ Thank you for your generous donation! Check your phone for M-Pesa STK push.'
          
          // Reset form
          this.donationData.amount = 100
          this.donationData.message = ''
          this.customAmount = ''
          
          // Refresh stats
          await this.fetchDonationStats()
          
          // Show success snackbar
          this.$nuxt.$emit('show-snackbar', {
            message: `🎉 Thank you for your donation of Ksh ${this.donationData.amount}!`,
            color: '#E53935'
          })
        } else {
          this.errorMessage = response.data.error || 'Failed to process donation'
        }
      } catch (error) {
        console.error('Donation error:', error)
        this.errorMessage = error.response?.data?.error || 'Something went wrong. Please try again.'
      } finally {
        this.loading = false
      }
    },

    handleDonationSuccess(data) {
      console.log('Donation successful:', data)
      this.$nuxt.$emit('show-snackbar', {
        message: `🎉 Thank you for your donation of Ksh ${data.amount}!`,
        color: '#E53935'
      })
      this.fetchDonationStats()
    }
  },
  head() {
    return {
      title: 'Donate | Clean Heart'
    }
  }
}
</script>

<style scoped>
.donate-page {
  background: #fafafa;
  min-height: 100vh;
  margin-top: 64px;
}

.page-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  color: #0f0f0f;
  letter-spacing: -1px;
}

.page-subtitle {
  font-size: 1rem;
  color: #666;
  max-width: 600px;
  margin: 8px auto 0;
  line-height: 1.7;
}

/* Stats Cards */
.stat-card {
  border-radius: 12px !important;
  background: white;
  border: 1px solid #e8e8e8;
  padding: 24px;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #0f0f0f;
}

.stat-label {
  font-size: 0.85rem;
  color: #888;
  margin-top: 4px;
}

/* Cards */
.donation-form-card,
.impact-card,
.top-donors-card {
  border-radius: 12px !important;
  background: white;
  border: 1px solid #e8e8e8;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
}

.card-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f0f0f;
}

/* Amount Section */
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
  text-transform: none !important;
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

/* Donate Button */
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

.back-link {
  color: #888;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s ease;
  display: inline-flex;
  align-items: center;
}

.back-link:hover {
  color: #E53935;
}

/* Impact Items */
.impact-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.impact-item:last-child {
  border-bottom: none;
}

.impact-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #fce4ec;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.impact-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #0f0f0f;
  margin-bottom: 2px;
}

.impact-desc {
  font-size: 0.8rem;
  color: #888;
  line-height: 1.5;
}

/* Top Donors Table */
.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  text-align: left;
  padding: 10px 16px;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  font-weight: 700;
  color: #888;
  background: #fafafa;
  border-bottom: 1px solid #eee;
}

.data-table td {
  padding: 10px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.82rem;
  color: #333;
  vertical-align: middle;
}

.data-table tbody tr:hover {
  background: #fafafa;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: #f0f0f0;
  font-size: 0.7rem;
  font-weight: 700;
  color: #666;
}

.rank-badge.top-three {
  background: #E53935;
  color: white;
}

.donor-name {
  font-size: 0.82rem;
}

.donor-email {
  font-size: 0.7rem;
}

.donor-amount {
  color: #E53935;
  font-size: 0.85rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 32px;
  color: #999;
}

.empty-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #666;
  margin-top: 10px;
}

.empty-text {
  font-size: 0.8rem;
  color: #999;
  margin-top: 4px;
}

/* Donation Subtitle */
.donation-subtitle {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 599px) {
  .stat-card {
    padding: 16px;
  }
  .stat-value {
    font-size: 1.5rem;
  }
  .amount-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .data-table th,
  .data-table td {
    padding: 8px 10px;
    font-size: 0.72rem;
  }
  .donor-name {
    font-size: 0.72rem;
  }
  .donor-amount {
    font-size: 0.75rem;
  }
  .impact-item {
    gap: 12px;
    padding: 10px 0;
  }
  .impact-icon {
    width: 36px;
    height: 36px;
  }
  .impact-icon .v-icon {
    font-size: 20px !important;
  }
}

@media (min-width: 600px) and (max-width: 959px) {
  .amount-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

/* Animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.donate-page .stat-card,
.donate-page .donation-form-card,
.donate-page .impact-card,
.donate-page .top-donors-card {
  animation: fadeInUp 0.5s ease-out forwards;
}

.donate-page .stat-card:nth-child(2) {
  animation-delay: 0.1s;
}
.donate-page .stat-card:nth-child(3) {
  animation-delay: 0.2s;
}
.donate-page .donation-form-card {
  animation-delay: 0.1s;
}
.donate-page .impact-card {
  animation-delay: 0.2s;
}
.donate-page .top-donors-card {
  animation-delay: 0.3s;
}
</style>