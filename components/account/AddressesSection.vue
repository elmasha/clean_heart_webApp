<template>
  <v-card style="border-radius: 0; border: 1px solid #e0e0e0;">
    <v-card-title style="font-size: 1.1rem; font-weight: 700; border-bottom: 1px solid #f0f0f0; padding: 16px 24px;">
      <v-icon left color="#E53935" size="24">mdi-map-marker</v-icon>
      Saved Addresses
      <v-spacer />
      <v-btn small color="#E53935" dark style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.7rem;" @click="$emit('add')">
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
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
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
  }
}
</script>