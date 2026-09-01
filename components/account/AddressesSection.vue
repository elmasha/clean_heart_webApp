<!-- components/account/AddressesSection.vue -->
<template>
  <v-card style="border-radius: 0; border: 1px solid #e0e0e0;">
    <v-card-title style="font-size: 1.1rem; font-weight: 700; border-bottom: 1px solid #f0f0f0; padding: 16px 24px;">
      <v-icon left color="#E53935" size="24">mdi-map-marker</v-icon>
      Saved Addresses
      <v-spacer />
      <v-btn small color="#E53935" dark style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.7rem;" @click="showAddAddress = true">
        <v-icon left size="16">mdi-plus</v-icon>
        Add Address
      </v-btn>
    </v-card-title>
    <v-card-text class="pa-4">
      <div v-if="loading" class="d-flex justify-center pa-8">
        <v-progress-circular indeterminate color="#E53935" size="40" />
      </div>

      <div v-else-if="addresses.length === 0" class="text-center pa-8">
        <v-icon size="48" color="grey lighten-1">mdi-map-marker-remove</v-icon>
        <p class="mt-4" style="color: #666;">No saved addresses yet.</p>
      </div>

      <v-row v-else>
        <v-col v-for="address in addresses" :key="address.id" cols="12" md="6">
          <v-card style="border-radius: 0; border: 1px solid #e0e0e0;">
            <v-card-text>
              <div class="d-flex justify-space-between">
                <div>
                  <div style="font-weight: 600;">{{ address.name }}</div>
                  <div style="font-size: 0.85rem; color: #666;">{{ address.street }}</div>
                  <div style="font-size: 0.85rem; color: #666;">
                    {{ address.city }}, {{ address.state || '' }} {{ address.zip || '' }}
                  </div>
                  <div style="font-size: 0.85rem; color: #666;">{{ address.country || 'Kenya' }}</div>
                </div>
                <v-chip v-if="address.is_default" small color="#E53935" dark>
                  Default
                </v-chip>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn text small style="text-transform: uppercase; letter-spacing: 1px; font-size: 0.7rem;" @click="editAddress(address)">
                Edit
              </v-btn>
              <v-btn text small color="error" style="text-transform: uppercase; letter-spacing: 1px; font-size: 0.7rem;" @click="deleteAddress(address.id)">
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>

    <!-- Add/Edit Address Dialog -->
    <v-dialog v-model="showAddAddress" max-width="500" persistent>
      <v-card style="border-radius: 0;">
        <v-card-title style="background: #000; color: #fff; padding: 16px 24px;">
          {{ editingAddress ? 'Edit Address' : 'Add New Address' }}
          <v-spacer />
          <v-btn icon dark @click="showAddAddress = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pa-6">
          <v-form ref="addressForm" @submit.prevent="saveAddress">
            <v-text-field
              v-model="addressForm.name"
              label="Address Label (e.g., Home, Work)"
              outlined
              dense
              hide-details
              class="mb-4"
              style="border-radius: 0;"
              required
            />
            <v-text-field
              v-model="addressForm.street"
              label="Street Address"
              outlined
              dense
              hide-details
              class="mb-4"
              style="border-radius: 0;"
              required
            />
            <v-text-field
              v-model="addressForm.city"
              label="City"
              outlined
              dense
              hide-details
              class="mb-4"
              style="border-radius: 0;"
              required
            />
            <v-text-field
              v-model="addressForm.state"
              label="State/Province"
              outlined
              dense
              hide-details
              class="mb-4"
              style="border-radius: 0;"
            />
            <v-text-field
              v-model="addressForm.zip"
              label="Postal Code"
              outlined
              dense
              hide-details
              class="mb-4"
              style="border-radius: 0;"
            />
            <v-select
              v-model="addressForm.country"
              label="Country"
              outlined
              dense
              hide-details
              class="mb-4"
              style="border-radius: 0;"
              :items="['Kenya', 'United States', 'United Kingdom', 'Canada', 'Australia']"
            />
            <v-switch
              v-model="addressForm.is_default"
              label="Set as default address"
              color="#E53935"
              hide-details
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4" style="border-top: 1px solid #f0f0f0;">
          <v-spacer />
          <v-btn text style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px;" @click="showAddAddress = false">
            Cancel
          </v-btn>
          <v-btn color="#E53935" dark style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px;" :loading="saving" @click="saveAddress">
            {{ editingAddress ? 'Update' : 'Save' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AddressesSection',
  props: {
    addresses: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showAddAddress: false,
      editingAddress: null,
      saving: false,
      addressForm: {
        name: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'Kenya',
        is_default: false
      }
    }
  },
  computed: {
    ...mapState({
      authUser: state => state.authUser,
    }),
    firebaseUid() {
      return this.authUser?.uid || null
    }
  },
  methods: {
    editAddress(address) {
      this.editingAddress = address
      this.addressForm = { ...address }
      this.showAddAddress = true
    },
    async saveAddress() {
      this.saving = true
      try {
        const url = this.editingAddress 
          ? `/api/users/addresses/${this.editingAddress.id}` 
          : '/api/users/addresses'
        const method = this.editingAddress ? 'put' : 'post'
        
        const { data } = await this.$axios[method](url, {
          firebaseUid: this.firebaseUid,
          ...this.addressForm
        })
        
        if (data.success) {
          this.$nuxt.$emit('show-snackbar', {
            message: `Address ${this.editingAddress ? 'updated' : 'added'} successfully!`,
            color: '#E53935'
          })
          this.showAddAddress = false
          this.$emit('refresh')
          this.resetForm()
        }
      } catch (error) {
        console.error('Save address error:', error)
        this.$nuxt.$emit('show-snackbar', {
          message: 'Failed to save address',
          color: 'error'
        })
      } finally {
        this.saving = false
      }
    },
    async deleteAddress(id) {
      if (!confirm('Are you sure you want to delete this address?')) return
      
      try {
        const { data } = await this.$axios.delete(`/api/users/addresses/${id}`, {
          params: { firebaseUid: this.firebaseUid }
        })
        
        if (data.success) {
          this.$nuxt.$emit('show-snackbar', {
            message: 'Address deleted successfully',
            color: '#E53935'
          })
          this.$emit('refresh')
        }
      } catch (error) {
        console.error('Delete address error:', error)
        this.$nuxt.$emit('show-snackbar', {
          message: 'Failed to delete address',
          color: 'error'
        })
      }
    },
    resetForm() {
      this.addressForm = {
        name: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'Kenya',
        is_default: false
      }
      this.editingAddress = null
    }
  }
}
</script>