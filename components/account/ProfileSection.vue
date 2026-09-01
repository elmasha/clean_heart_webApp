<template>
  <v-card style="border-radius: 0; border: 1px solid #e0e0e0;">
    <v-card-title style="font-size: 1.1rem; font-weight: 700; border-bottom: 1px solid #f0f0f0; padding: 16px 24px;">
      <v-icon left color="#E53935" size="24">mdi-account-edit</v-icon>
      Profile Information
    </v-card-title>
    <v-card-text class="pa-6">
      <v-form ref="form" @submit.prevent="saveProfile">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.full_name"
              label="Full Name"
              outlined
              dense
              hide-details
              style="border-radius: 0;"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.email"
              label="Email"
              outlined
              dense
              hide-details
              style="border-radius: 0;"
              type="email"
              disabled
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.phone"
              label="Phone Number"
              outlined
              dense
              hide-details
              style="border-radius: 0;"
              placeholder="+254 7XX XXX XXX"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="form.avatar_url"
              label="Avatar URL"
              outlined
              dense
              hide-details
              style="border-radius: 0;"
              placeholder="https://example.com/avatar.jpg"
            />
          </v-col>
        </v-row>
        
        <v-btn
          color="#E53935"
          dark
          height="44"
          class="mt-4"
          style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.75rem; font-weight: 600;"
          type="submit"
          :loading="loading"
        >
          Save Changes
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'ProfileSection',
  props: {
    user: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      form: {
        full_name: '',
        email: '',
        phone: '',
        avatar_url: ''
      },
      loading: false
    }
  },
  watch: {
    user: {
      immediate: true,
      handler(newUser) {
        if (newUser) {
          this.form = {
            full_name: newUser.full_name || '',
            email: newUser.email || '',
            phone: newUser.phone || '',
            avatar_url: newUser.avatar_url || ''
          }
        }
      }
    }
  },
  methods: {
    async saveProfile() {
      this.loading = true
      try {
        // Call your update endpoint
        this.$nuxt.$emit('show-snackbar', {
          message: 'Profile updated successfully!',
          color: '#E53935'
        })
        this.$emit('update')
      } catch (error) {
        console.error('Update profile error:', error)
        this.$nuxt.$emit('show-snackbar', {
          message: 'Failed to update profile',
          color: 'error'
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>