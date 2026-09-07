<!-- pages/rider/dashboard.vue -->
<template>
  <div class="rider-wrapper">
    <!-- Mobile Header -->
    <v-app-bar
      flat
      color="white"
      height="56"
      class="rider-header"
      style="border-bottom: 1px solid #e8e8e8;"
    >
      <div class="d-flex align-center">
        <div class="brand-icon-small mr-2">
          <v-icon color="white" size="16">mdi-heart</v-icon>
        </div>
        <span class="brand-title-small">Rider Dashboard</span>
      </div>

      <v-spacer />

      <v-menu offset-y left>
        <template #activator="{ on, attrs }">
          <v-btn icon small v-bind="attrs" v-on="on">
            <v-avatar size="32" color="#fce4ec">
              <v-icon size="16" color="#E53935">mdi-account</v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item @click="logout">
            <v-list-item-icon class="mr-2">
              <v-icon size="18" color="error">mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-container fluid class="pt-4 px-3 px-md-6 pb-6">
      <!-- Rider Profile Banner -->
      <v-card class="profile-banner mb-4" flat v-if="riderProfile">
        <v-row align="center" no-gutters>
          <v-col cols="12" sm="8">
            <div class="d-flex align-center">
              <v-avatar size="56" color="#fce4ec" class="mr-3">
                <v-icon size="28" color="#E53935">mdi-account</v-icon>
              </v-avatar>
              <div>
                <div class="profile-name">{{ riderProfile.full_name || 'Rider' }}</div>
                <div class="profile-subtitle">
                  <v-icon size="14" color="#E53935" class="mr-1">mdi-motorbike</v-icon>
                  {{ riderProfile.vehicle_type || 'Boda' }}
                  <span class="mx-2">•</span>
                  <v-icon size="14" color="#E53935" class="mr-1">mdi-star</v-icon>
                  {{ riderProfile.rating || '5.0' }}
                  <span class="mx-2">•</span>
                  <span class="grey--text">ID: {{ riderProfile.id_number || 'Not set' }}</span>
                </div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" sm="4" class="text-sm-right mt-2 mt-sm-0">
            <div class="status-badge">
              <v-chip 
                :color="riderProfile.status === 'active' ? 'success' : 'warning'" 
                label 
                small 
                text-color="white"
                class="status-chip"
              >
                <v-icon left size="14" v-if="riderProfile.status === 'active'">mdi-check-circle</v-icon>
                <v-icon left size="14" v-else>mdi-clock</v-icon>
                {{ riderProfile.status === 'active' ? 'Online' : 'Offline' }}
              </v-chip>
              <v-btn 
                :color="riderProfile.status === 'active' ? 'error' : 'success'" 
                small 
                depressed
                class="ml-2 toggle-btn"
                @click="toggleStatus"
              >
                {{ riderProfile.status === 'active' ? 'Go Offline' : 'Go Online' }}
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card>

      <!-- Loading State -->
      <div v-if="loading" class="d-flex justify-center pa-8">
        <v-progress-circular indeterminate color="#E53935" size="40" />
      </div>

      <!-- Stats Cards -->
      <v-row class="stats-row mb-4" v-if="!loading">
        <v-col cols="6" sm="3" v-for="stat in stats" :key="stat.label">
          <v-card class="stat-card" flat>
            <div class="stat-icon-wrapper" :style="{ background: stat.bg }">
              <v-icon size="18" :color="stat.iconColor">{{ stat.icon }}</v-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Tabs for Deliveries -->
      <v-card class="content-card" flat v-if="!loading">
        <v-tabs
          v-model="activeTab"
          color="#E53935"
          class="delivery-tabs"
          grow
        >
          <v-tab>
            <v-icon left size="18">mdi-clock</v-icon>
            Active
            <v-badge
              v-if="activeDeliveries.length > 0"
              :content="activeDeliveries.length"
              color="#E53935"
              offset-x="8"
              offset-y="8"
              class="ml-2"
            />
          </v-tab>
          <v-tab>
            <v-icon left size="18">mdi-history</v-icon>
            History
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="activeTab">
          <!-- Active Deliveries Tab -->
          <v-tab-item>
            <div v-if="activeDeliveries.length === 0" class="empty-state pa-8">
              <v-icon size="56" color="grey lighten-2">mdi-motorbike-off</v-icon>
              <div class="empty-title">No Active Deliveries</div>
              <div class="empty-text">You don't have any active deliveries right now</div>
            </div>
            <div v-else>
              <v-card
                v-for="delivery in activeDeliveries"
                :key="delivery.id"
                class="delivery-card mb-3"
                flat
              >
                <v-card-text class="pa-4">
                  <div class="d-flex justify-space-between align-start flex-wrap">
                    <div>
                      <div class="delivery-order">
                        <span class="order-label">Order #</span>
                        <span class="order-number font-weight-bold">{{ delivery.order_number }}</span>
                      </div>
                      <div class="delivery-customer mt-1">
                        <v-icon size="14" color="#666" class="mr-1">mdi-account</v-icon>
                        <span class="customer-name">{{ delivery.customer_name || 'Customer' }}</span>
                      </div>
                      <div class="delivery-address mt-1">
                        <v-icon size="14" color="#666" class="mr-1">mdi-map-marker</v-icon>
                        <span class="address-text">{{ delivery.dropoff_address || 'Address' }}</span>
                      </div>
                      <div class="delivery-payment mt-1" v-if="delivery.payment_method">
                        <v-chip x-small outlined :color="delivery.payment_method === 'cod' ? '#E53935' : '#1976d2'">
                          {{ delivery.payment_method === 'cod' ? '💰 Cash on Delivery' : '💳 M-Pesa' }}
                        </v-chip>
                      </div>
                    </div>
                    <div class="text-right mt-2 mt-sm-0">
                      <div class="delivery-amount font-weight-bold">Ksh {{ formatMoney(delivery.total_amount || delivery.order_total) }}</div>
                      <div class="delivery-status mt-1">
                        <v-chip 
                          :color="getDeliveryStatusColor(delivery.status)" 
                          label 
                          x-small 
                          text-color="white"
                          class="status-chip"
                        >
                          {{ delivery.status || 'pending' }}
                        </v-chip>
                      </div>
                      <div class="delivery-actions mt-2">
                        <v-menu offset-y left v-if="delivery.status !== 'delivered' && delivery.status !== 'cancelled'">
                          <template #activator="{ on, attrs }">
                            <v-btn 
                              color="#E53935" 
                              small 
                              depressed 
                              v-bind="attrs" 
                              v-on="on"
                              class="action-btn"
                            >
                              Update Status
                            </v-btn>
                          </template>
                          <v-list dense>
                            <v-list-item 
                              v-for="status in getAvailableStatuses(delivery.status)" 
                              :key="status"
                              @click="updateDeliveryStatus(delivery, status)"
                            >
                              <v-list-item-icon class="mr-2 my-1">
                                <v-icon size="12" :color="getDeliveryStatusColor(status)">mdi-circle</v-icon>
                              </v-list-item-icon>
                              <v-list-item-title class="text-caption text-capitalize">{{ status }}</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                        <!-- Confirm Payment Button (only for COD orders that are delivered) -->
                        <v-btn
                          v-if="delivery.payment_method === 'cod' && delivery.status === 'delivered' && delivery.payment_status !== 'paid'"
                          color="success"
                          small
                          depressed
                          class="ml-2 action-btn"
                          @click="confirmPayment(delivery)"
                        >
                          <v-icon left size="14">mdi-currency-ksh</v-icon>
                          Confirm Payment
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </v-tab-item>

          <!-- History Tab -->
          <v-tab-item>
            <div v-if="deliveryHistory.length === 0" class="empty-state pa-8">
              <v-icon size="56" color="grey lighten-2">mdi-history</v-icon>
              <div class="empty-title">No Delivery History</div>
              <div class="empty-text">Your completed deliveries will appear here</div>
            </div>
            <div v-else>
              <v-card
                v-for="delivery in deliveryHistory"
                :key="delivery.id"
                class="delivery-card mb-3"
                flat
              >
                <v-card-text class="pa-4">
                  <div class="d-flex justify-space-between align-start flex-wrap">
                    <div>
                      <div class="delivery-order">
                        <span class="order-label">Order #</span>
                        <span class="order-number font-weight-bold">{{ delivery.order_number }}</span>
                      </div>
                      <div class="delivery-customer mt-1">
                        <v-icon size="14" color="#666" class="mr-1">mdi-account</v-icon>
                        <span class="customer-name">{{ delivery.customer_name || 'Customer' }}</span>
                      </div>
                      <div class="delivery-amount mt-1">
                        <span class="amount-label">Amount:</span>
                        <span class="amount-value font-weight-bold">Ksh {{ formatMoney(delivery.total_amount || delivery.order_total) }}</span>
                      </div>
                    </div>
                    <div class="text-right mt-2 mt-sm-0">
                      <div class="delivery-status">
                        <v-chip 
                          :color="getDeliveryStatusColor(delivery.status)" 
                          label 
                          x-small 
                          text-color="white"
                          class="status-chip"
                        >
                          {{ delivery.status || 'completed' }}
                        </v-chip>
                      </div>
                      <div class="delivery-date grey--text text--darken-1 mt-1">
                        <v-icon size="12" class="mr-1">mdi-calendar</v-icon>
                        {{ formatDate(delivery.updated_at || delivery.created_at) }}
                      </div>
                      <!-- Show payment confirmation status -->
                      <div v-if="delivery.payment_method === 'cod'" class="mt-1">
                        <v-chip 
                          :color="delivery.payment_status === 'paid' ? 'success' : 'warning'" 
                          x-small 
                          label
                          class="payment-chip"
                        >
                          {{ delivery.payment_status === 'paid' ? '✅ Payment Confirmed' : '⏳ Payment Pending' }}
                        </v-chip>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-container>

    <!-- Confirm Payment Dialog -->
    <v-dialog v-model="paymentDialog" max-width="450" persistent>
      <v-card class="dialog-card" flat>
        <div class="dialog-header" style="background: linear-gradient(135deg, #0f0f0f, #1a1a1a);">
          <span class="dialog-title">
            <v-icon color="#E53935" size="20" class="mr-2">mdi-currency-ksh</v-icon>
            Confirm Payment
          </span>
          <v-btn icon small dark @click="paymentDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-divider />
        <v-card-text class="pa-4 pa-md-6">
          <div class="text-center mb-4">
            <v-icon size="48" color="success" class="mb-2">mdi-check-circle</v-icon>
            <h3 class="text-h6 font-weight-bold">Confirm Cash Collection</h3>
            <p class="body-2 grey--text mt-2">
              You are about to confirm that you have collected payment for this order.
            </p>
          </div>

          <div v-if="selectedDelivery" class="payment-summary">
            <div class="summary-item">
              <span class="summary-label">Order #</span>
              <span class="summary-value font-weight-bold">{{ selectedDelivery.order_number }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Amount</span>
              <span class="summary-value font-weight-bold">Ksh {{ formatMoney(selectedDelivery.total_amount || selectedDelivery.order_total) }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Customer</span>
              <span class="summary-value">{{ selectedDelivery.customer_name || 'Customer' }}</span>
            </div>
          </div>

          <v-text-field
            v-model="receiptNumber"
            label="Receipt Number (Optional)"
            outlined
            dense
            hide-details
            class="mt-4"
            placeholder="Enter receipt number"
          />

          <v-alert type="warning" dense text class="mt-4" border="left" colored-border>
            <div class="d-flex align-center">
              <v-icon left size="16" color="#E53935">mdi-alert</v-icon>
              <span>By confirming, you verify that the customer has paid the full amount in cash.</span>
            </div>
          </v-alert>
        </v-card-text>
        <v-divider />
        <v-card-actions class="pa-3 pa-md-4">
          <v-spacer />
          <v-btn text class="mr-2" @click="paymentDialog = false">Cancel</v-btn>
          <v-btn 
            color="#E53935" 
            dark 
            depressed 
            :loading="confirmingPayment"
            @click="confirmPaymentSubmit"
            class="confirm-btn"
          >
            <v-icon left size="16" v-if="!confirmingPayment">mdi-check</v-icon>
            Confirm Payment
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'RiderDashboard',
  middleware: 'auth',
  data() {
    return {
      activeTab: 0,
      loading: true,
      confirmingPayment: false,
      paymentDialog: false,
      selectedDelivery: null,
      receiptNumber: '',
      
      riderProfile: null,
      
      stats: [
        { label: 'Active Deliveries', value: 0, icon: 'mdi-truck-delivery', bg: '#fce4ec', iconColor: '#E53935' },
        { label: 'Completed', value: 0, icon: 'mdi-check-circle', bg: '#e8f5e9', iconColor: '#388e3c' },
        { label: 'Earnings', value: 'Ksh 0', icon: 'mdi-currency-ksh', bg: '#fff3e0', iconColor: '#f57c00' },
        { label: 'Rating', value: '5.0 ⭐', icon: 'mdi-star', bg: '#e3f2fd', iconColor: '#1976d2' },
      ],
      
      activeDeliveries: [],
      deliveryHistory: [],
      
      refreshInterval: null
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
    if (this.firebaseUid) {
      this.fetchRiderProfile()
      this.fetchDeliveries()
      // Refresh every 30 seconds
      this.refreshInterval = setInterval(() => {
        this.fetchDeliveries()
      }, 30000)
    } else {
      this.$router.push('/login')
    }
  },
  beforeDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  },
  methods: {
    // ===== API Helper =====
    async apiRequest(url, options = {}) {
      try {
        const config = {
          url,
          method: options.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
          }
        }

        if (options.body) {
          config.data = options.body
        }

        if (this.$axios && typeof this.$axios === 'function') {
          const response = await this.$axios(config)
          return response.data
        }
        
        const response = await fetch(url, {
          method: options.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
          },
          body: options.body ? JSON.stringify(options.body) : undefined
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        return await response.json()
      } catch (error) {
        console.error(`API Error (${url}):`, error)
        throw error
      }
    },

    // ===== Format Helpers =====
    formatMoney(value) {
      return parseFloat(value || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    // ===== Rider Profile =====
    async fetchRiderProfile() {
      try {
        const data = await this.apiRequest(`/api/delivery/rider/profile?firebaseUid=${this.firebaseUid}`)
        if (data.success) {
          this.riderProfile = data.data
          // Update stats with real data
          this.updateStats()
        }
      } catch (error) {
        console.error('Error fetching rider profile:', error)
        this.showSnackbar('Failed to load profile', 'error')
      }
    },

    updateStats() {
      const completed = this.deliveryHistory.length
      this.stats = [
        { label: 'Active Deliveries', value: this.activeDeliveries.length, icon: 'mdi-truck-delivery', bg: '#fce4ec', iconColor: '#E53935' },
        { label: 'Completed', value: completed, icon: 'mdi-check-circle', bg: '#e8f5e9', iconColor: '#388e3c' },
        { label: 'Earnings', value: `Ksh ${this.formatMoney(this.riderProfile?.total_earnings || 0)}`, icon: 'mdi-currency-ksh', bg: '#fff3e0', iconColor: '#f57c00' },
        { label: 'Rating', value: `${this.riderProfile?.rating || 5.0} ⭐`, icon: 'mdi-star', bg: '#e3f2fd', iconColor: '#1976d2' },
      ]
    },

    // ===== Deliveries =====
    async fetchDeliveries() {
      try {
        const data = await this.apiRequest(`/api/delivery/assignments?firebase_uid=${this.firebaseUid}&limit=100`)
        if (data.success) {
          const assignments = data.data || []
          // Separate active and history
          const activeStatuses = ['pending', 'accepted', 'picked_up', 'in_transit', 'arrived']
          this.activeDeliveries = assignments.filter(a => activeStatuses.includes(a.status))
          this.deliveryHistory = assignments.filter(a => ['delivered', 'cancelled', 'failed'].includes(a.status))
          this.updateStats()
        }
      } catch (error) {
        console.error('Error fetching deliveries:', error)
        // Don't show error on every refresh
      } finally {
        this.loading = false
      }
    },

    // ===== Toggle Status =====
    async toggleStatus() {
      if (!this.riderProfile) return
      
      const newStatus = this.riderProfile.status === 'active' ? 'offline' : 'active'
      try {
        const data = await this.apiRequest(`/api/admin/riders/${this.riderProfile.id}/status`, {
          method: 'PUT',
          body: { status: newStatus }
        })
        if (data.success) {
          this.riderProfile.status = newStatus
          this.showSnackbar(`You are now ${newStatus === 'active' ? 'online' : 'offline'}`, 'success')
        }
      } catch (error) {
        this.showSnackbar('Failed to update status', 'error')
      }
    },

    // ===== Update Delivery Status =====
    getAvailableStatuses(currentStatus) {
      const statusMap = {
        'pending': ['accepted'],
        'accepted': ['picked_up'],
        'picked_up': ['in_transit'],
        'in_transit': ['arrived'],
        'arrived': ['delivered']
      }
      return statusMap[currentStatus] || []
    },

    async updateDeliveryStatus(delivery, status) {
      try {
        const data = await this.apiRequest('/api/delivery/assignment/status', {
          method: 'PUT',
          body: {
            assignment_id: delivery.id,
            status: status,
            firebase_uid: this.firebaseUid,
            notes: `Status updated to ${status} by rider`
          }
        })
        if (data.success) {
          this.showSnackbar(`Delivery status updated to ${status}`, 'success')
          this.fetchDeliveries()
          this.fetchRiderProfile()
        }
      } catch (error) {
        console.error('Error updating delivery status:', error)
        this.showSnackbar('Failed to update status', 'error')
      }
    },

    // ===== Confirm COD Payment =====
    confirmPayment(delivery) {
      this.selectedDelivery = delivery
      this.receiptNumber = ''
      this.paymentDialog = true
    },

    async confirmPaymentSubmit() {
      if (!this.selectedDelivery) return
      
      this.confirmingPayment = true
      try {
        const data = await this.apiRequest('/api/delivery/confirm-payment', {
          method: 'POST',
          body: {
            order_id: this.selectedDelivery.order_id || this.selectedDelivery.id,
            rider_firebase_uid: this.firebaseUid,
            receipt_number: this.receiptNumber || `COD-${Date.now()}`
          }
        })
        
        if (data.success) {
          this.showSnackbar('✅ Payment confirmed successfully!', '#E53935')
          this.paymentDialog = false
          this.selectedDelivery = null
          this.receiptNumber = ''
          this.fetchDeliveries()
          this.fetchRiderProfile()
        } else {
          this.showSnackbar(data.error || 'Failed to confirm payment', 'error')
        }
      } catch (error) {
        console.error('Error confirming payment:', error)
        this.showSnackbar(error.message || 'Failed to confirm payment', 'error')
      } finally {
        this.confirmingPayment = false
      }
    },

    // ===== Status Colors =====
    getDeliveryStatusColor(status) {
      const colors = {
        pending: '#ff9800',
        accepted: '#2196f3',
        picked_up: '#9c27b0',
        in_transit: '#1976d2',
        arrived: '#4caf50',
        delivered: '#388e3c',
        cancelled: '#f44336',
        failed: '#d32f2f'
      }
      return colors[status] || '#757575'
    },

    // ===== Snackbar =====
    showSnackbar(message, color = '#E53935') {
      this.$nuxt.$emit('show-snackbar', { message, color })
    },

    // ===== Logout =====
    async logout() {
      await this.$store.dispatch('logout')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
/* ===== Global Wrapper ===== */
.rider-wrapper {
  min-height: 100vh;
  background: #fafafa;
}

/* ===== Header ===== */
.rider-header {
  z-index: 1000 !important;
}
.brand-icon-small {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: #0f0f0f;
  display: flex;
  align-items: center;
  justify-content: center;
}
.brand-title-small {
  font-weight: 700;
  font-size: 0.9rem;
  color: #0f0f0f;
}

/* ===== Profile Banner ===== */
.profile-banner {
  background: white !important;
  border-radius: 12px !important;
  padding: 16px 20px;
  border: 1px solid #e8e8e8;
}
.profile-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f0f0f;
}
.profile-subtitle {
  font-size: 0.85rem;
  color: #666;
}
.status-badge {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
}
.status-chip {
  font-weight: 600 !important;
  font-size: 0.75rem !important;
}
.toggle-btn {
  border-radius: 6px !important;
  font-weight: 600 !important;
  text-transform: none !important;
}

/* ===== Stats Cards ===== */
.stats-row {
  margin-bottom: 4px;
}
.stat-card {
  border-radius: 12px !important;
  padding: 14px;
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e8e8e8;
  transition: transform 0.2s ease;
}
.stat-card:hover {
  transform: translateY(-2px);
}
.stat-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}
.stat-content {
  flex: 1;
  min-width: 0;
}
.stat-value {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0f0f0f;
  line-height: 1.2;
}
.stat-label {
  font-size: 0.65rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

/* ===== Content Card ===== */
.content-card {
  border-radius: 12px !important;
  background: white;
  border: 1px solid #e8e8e8;
  overflow: hidden;
}

/* ===== Delivery Tabs ===== */
.delivery-tabs {
  border-bottom: 1px solid #e8e8e8;
}
.delivery-tabs .v-tab {
  font-weight: 600 !important;
  font-size: 0.8rem !important;
  text-transform: none !important;
  letter-spacing: 0.3px !important;
}

/* ===== Delivery Cards ===== */
.delivery-card {
  border-radius: 8px !important;
  border: 1px solid #f0f0f0 !important;
  margin: 0 4px !important;
  transition: border-color 0.2s ease;
}
.delivery-card:hover {
  border-color: #e0e0e0 !important;
}
.delivery-order {
  font-size: 0.9rem;
}
.order-label {
  color: #888;
  font-weight: 500;
}
.order-number {
  color: #0f0f0f;
}
.delivery-customer {
  font-size: 0.85rem;
  color: #555;
}
.delivery-address {
  font-size: 0.8rem;
  color: #666;
}
.address-text {
  word-break: break-word;
}
.delivery-amount {
  font-size: 1rem;
  color: #E53935;
}
.delivery-status {
  display: inline-block;
}
.delivery-date {
  font-size: 0.7rem;
}
.delivery-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px;
}
.action-btn {
  border-radius: 6px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  font-size: 0.7rem !important;
}
.amount-label {
  color: #888;
  font-size: 0.8rem;
}
.amount-value {
  color: #0f0f0f;
  font-size: 0.9rem;
}
.payment-chip {
  font-weight: 600 !important;
  font-size: 0.65rem !important;
}
.delivery-payment {
  font-size: 0.7rem;
}

/* ===== Payment Dialog ===== */
.dialog-card {
  border-radius: 12px !important;
  overflow: hidden;
}
.dialog-header {
  background: linear-gradient(135deg, #0f0f0f, #1a1a1a);
  color: white;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dialog-title {
  font-weight: 700;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
}
.confirm-btn {
  border-radius: 8px !important;
  font-weight: 700 !important;
}
.payment-summary {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px 16px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
}
.summary-item {
  text-align: center;
}
.summary-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #999;
  font-weight: 600;
  display: block;
}
.summary-value {
  font-size: 0.9rem;
  color: #333;
  margin-top: 2px;
  display: block;
}

/* ===== Empty State ===== */
.empty-state {
  text-align: center;
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

/* ===== Responsive ===== */
@media (max-width: 599px) {
  .profile-banner {
    padding: 12px 16px;
  }
  .profile-name {
    font-size: 0.95rem;
  }
  .status-badge {
    justify-content: flex-start;
    margin-top: 8px;
  }
  .stat-card {
    padding: 10px;
  }
  .stat-icon-wrapper {
    width: 32px;
    height: 32px;
    margin-right: 8px;
  }
  .stat-value {
    font-size: 0.95rem;
  }
  .stat-label {
    font-size: 0.55rem;
  }
  .delivery-card .pa-4 {
    padding: 12px !important;
  }
  .delivery-actions {
    justify-content: flex-start;
    margin-top: 8px;
  }
  .payment-summary {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 959px) {
  .profile-banner .v-col.text-sm-right {
    text-align: left !important;
  }
}

/* ===== Touch-friendly ===== */
@media (hover: none) and (pointer: coarse) {
  .stat-card:hover {
    transform: none;
  }
  .delivery-card:hover {
    border-color: #f0f0f0 !important;
  }
}
</style>