<!-- components/account/WishlistSection.vue -->
<template>
  <v-card style="border-radius: 0; border: 1px solid #e0e0e0;">
    <v-card-title style="font-size: 1.1rem; font-weight: 700; border-bottom: 1px solid #f0f0f0; padding: 16px 24px;">
      <v-icon left color="#E53935" size="24">mdi-heart</v-icon>
      Wishlist
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
        <v-col v-for="item in wishlist" :key="item.id" cols="6" md="3">
          <nuxt-link :to="`/product/${item.product_id}`" style="text-decoration: none;">
            <v-card style="border-radius: 0; border: 1px solid #e0e0e0;">
              <v-img
                :src="item.image_url || '/placeholder-product.jpg'"
                height="200"
                contain
                style="background: #f5f5f5;"
              />
              <v-card-text>
                <div style="font-weight: 600; font-size: 0.85rem; color: #000;">{{ item.name }}</div>
                <div style="font-size: 0.85rem; font-weight: 700; color: #E53935;">
                  ${{ parseFloat(item.price).toFixed(2) }}
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn small color="#E53935" dark style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.65rem;" @click.prevent="addToCart(item)">
                  Add to Cart
                </v-btn>
                <v-btn icon small color="red" @click.prevent="removeFromWishlist(item.id)">
                  <v-icon size="16">mdi-delete</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </nuxt-link>
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
    addToCart(item) {
      this.$nuxt.$emit('show-snackbar', {
        message: `Added ${item.name} to cart!`,
        color: '#E53935'
      })
    },
    removeFromWishlist(id) {
      this.$nuxt.$emit('show-snackbar', {
        message: 'Removed from wishlist',
        color: '#E53935'
      })
      this.$emit('refresh')
    }
  }
}
</script>