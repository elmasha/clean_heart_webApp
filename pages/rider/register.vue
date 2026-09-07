<!-- pages/rider/register.vue -->
<template>
  <div class="register-wrapper">
    <v-container class="py-8" style="max-width: 500px;">
      <v-card class="pa-6">
        <div class="text-center mb-6">
          <div class="brand-icon mx-auto mb-3">
            <v-icon color="white" size="32">mdi-heart</v-icon>
          </div>
          <h1 class="text-h5 font-weight-bold">Rider Registration</h1>
          <p class="grey--text">Register to start delivering</p>
        </div>

        <v-form @submit.prevent="registerRider">
          <v-text-field
            v-model="form.full_name"
            label="Full Name *"
            outlined
            dense
            required
          />
          <v-text-field
            v-model="form.email"
            label="Email"
            outlined
            dense
            type="email"
          />
          <v-text-field
            v-model="form.phone"
            label="Phone *"
            outlined
            dense
            required
          />
          <v-text-field
            v-model="form.id_number"
            label="ID Number"
            outlined
            dense
          />
          <v-select
            v-model="form.vehicle_type"
            :items="['boda', 'bicycle', 'car', 'van']"
            label="Vehicle Type"
            outlined
            dense
          />
          <v-text-field
            v-model="form.vehicle_registration"
            label="Vehicle Registration"
            outlined
            dense
          />

          <v-btn
            block
            color="#E53935"
            dark
            depressed
            height="48"
            :loading="loading"
            type="submit"
            class="mt-4"
          >
            Register as Rider
          </v-btn>
        </v-form>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'RiderRegister',
  middleware: 'auth',
  data() {
    return {
      loading: false,
      form: {
        full_name: '',
        email: '',
        phone: '',
        id_number: '',
        vehicle_type: 'boda',
        vehicle_registration: ''
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
    // Check if already a rider
    this.checkIfRider()
  },
  methods: {
    async checkIfRider() {
      try {
        const { data } = await this.$axios.get(`/api/delivery/rider/profile?firebaseUid=${this.firebaseUid}`)
        if (data.success) {
          this.$router.push('/rider/dashboard')
        }
      } catch (error) {
        // Rider not found, show registration form
        console.log('Rider not found, showing registration form')
      }
    },

    async registerRider() {
      if (!this.form.full_name || !this.form.phone) {
        this.$nuxt.$emit('show-snackbar', {
          message: 'Please fill in all required fields',
          color: 'error'
        })
        return
      }

      this.loading = true
      try {
        const { data } = await this.$axios.post('/api/delivery/rider/register', {
          firebaseUid: this.firebaseUid,
          ...this.form
        })

        if (data.success) {
          this.$nuxt.$emit('show-snackbar', {
            message: '🎉 Rider registration successful!',
            color: '#E53935'
          })
          this.$router.push('/rider/dashboard')
        }
      } catch (error) {
        this.$nuxt.$emit('show-snackbar', {
          message: error.response?.data?.error || 'Registration failed',
          color: 'error'
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.register-wrapper {
  min-height: 100vh;
  background: #fafafa;
}
.brand-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: #0f0f0f;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>