<template>
  <v-card style="border-radius: 0; border: 1px solid #e0e0e0;">
    <v-card-title style="font-size: 1.1rem; font-weight: 700; border-bottom: 1px solid #f0f0f0; padding: 16px 24px;">
      <v-icon left color="#E53935" size="24">mdi-heart</v-icon>
      Wishlist
      <v-spacer />
      <span v-if="wishlist.length > 0" style="font-size: 0.8rem; color: #666; font-weight: 400;">
        {{ wishlist.length }} item(s)
      </span>
    </v-card-title>
    <v-card-text class="pa-4">
      <div v-if="loading" class="d-flex justify-center pa-8">
        <v-progress-circular indeterminate color="#E53935" size="40" />
      </div>

      <div v-else-if="wishlist.length === 0" class="text-center pa-8">
        <v-icon size="48" color="grey lighten-1">mdi-heart-remove</v-icon>
        <p class="mt-4" style="color: #666;">Your wishlist is empty.</p>
        <v-btn color="black" dark style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.75rem;" to="/shop">
          Browse Products
        </v-btn>
      </div>

      <v-row v-else>
        <v-col v-for="item in wishlist" :key="item.id" cols="6" md="4">
          <div style="position: relative;">
            <v-btn
              icon
              small
              style="position: absolute; top: 4px; right: 4px; z-index: 2; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
              @click.prevent="$emit('remove', item.id)"
            >
              <v-icon size="16" color="#E53935">mdi-close</v-icon>
            </v-btn>

            <nuxt-link :to="`/product/${item.id}`" style="text-decoration: none;">
              <v-card style="border-radius: 0; border: 1px solid #e0e0e0; transition: all 0.3s ease;">
                <v-img
                  :src="item.image_url || '/placeholder-product.jpg'"
                  height="180"
                  contain
                  style="background: #f5f5f5;"
                />
                <v-card-text class="pa-3">
                  <div style="font-weight: 600; font-size: 0.8rem; color: #000; line-height: 1.2; min-height: 38px;">
                    {{ item.name }}
                  </div>
                  <div style="font-size: 0.85rem; font-weight: 700; color: #E53935;">
                    Ksh {{ formatPrice(item.base_price || item.price) }}
                  </div>
                </v-card-text>
              </v-card>
            </nuxt-link>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'WishlistSection',
  props: {
    wishlist: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    formatPrice(value) {
      const num = parseFloat(value)
      if (isNaN(num)) return '0.00'
      return num.toFixed(2)
    }
  }
}
</script>

<style scoped>
.v-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important;
}
</style>