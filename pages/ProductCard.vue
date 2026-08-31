<template>
  <div class="product-card">
    <img :src="product.image_url" :alt="product.name" class="w-full h-48 object-cover rounded-lg" />
    <h3 class="mt-2 font-semibold">{{ product.name }}</h3>
    <p class="text-gray-600">{{ product.price }} KSh</p>
    <button
      class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mt-3"
      @click="addToCart(product)"
    >
      Add to Cart
    </button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    product: { type: Object, required: true },
    userId: { type: Number, default: 1 } // temporary user id
  },
  methods: {
    async addToCart(product) {
      try {
        const res = await axios.post("http://localhost:5000/cart/add", {
          user_id: this.userId,
          product_id: product.id,
          quantity: 1
        });
        alert("✅ Item added to cart!");
        console.log(res.data);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to add item to cart.");
      }
    }
  }
};
</script>

<style scoped>
.product-card {
  @apply border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition;
}
</style>
