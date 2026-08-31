<template>
<div class="product-upload container" style="margin-bottom: 20px;">

    <v-card elevation="0">
        <h2>Upload Product</h2>
        <form @submit.prevent="uploadProduct" class="container">
            <div>
                <label>Name:</label>
                <v-text-field type="text" v-model="name" required />
            </div>

            <div>
                <label>Description:</label>
                <v-textarea v-model="description" required></v-textarea>
            </div>

            <div>
                <label>Price:</label>
                <v-text-field type="number" v-model="price" required />
            </div>

            <div>
                <label>Bulk price:</label>
                <v-text-field type="number" v-model="bulk_price" required />
            </div>

            <div>
                <label>Sku:</label>
                <v-text-field type="text" v-model="sku" required />
            </div>

            <div>
                <label>Category:</label>
                <v-text-field type="text" v-model="category" required />
            </div>

            <div>
                <label>Tag:</label>
                <v-text-field type="text" v-model="tag" required />
            </div>

            <div>
                <label>Stock:</label>
                <v-text-field type="number" v-model="stock" required />
            </div>

            <div>
                <label>Minimum Order Quantity (MOQ):</label>
                <v-text-field type="number" v-model="moq" required />
            </div>

            <div>
                <label>Image URL:</label>
                <v-text-field type="text" v-model="image_url" required placeholder="Paste image link here" />
            </div>

            <v-btn type="submit">Upload Product</v-btn>
        </form>
        <p v-if="message">{{ message }}</p>
    </v-card>

</div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            name: "",
            description: "",
            price: 0,
            moq: 1,
            image: "",
            message: "",
            supplier_id: 2,
            sku: "",
            category: "",
            price: "",
            bulk_price: "",
            tag: "",
            moq: "",
            stock: "",
            // image_url:"https://image2url.com/images/1762629613094-8ebcf5d7-1455-4fcb-a823-1c7e62278923.png",
        };
    },
    methods: {
        async uploadProduct() {
            try {
                const response = await axios.post("https://swisslifeserver-production.up.railway.app/api/products/upload", {
                    name: this.name,
                    description: this.description,
                    price: this.price,
                    moq: this.moq,
                    supplier_id: this.supplier_id,
                    sku: this.sku,
                    category: this.category,
                    bulk_price: this.bulk_price,
                    stock: this.stock,
                    image_url: this.image_url,
                    tag: this.tag,

                });
                this.message = "Product uploaded successfully!";
                // Reset form
                this.name = "";
                this.description = "";
                this.price = 0;
                this.moq = 1;
                this.image = "";
            } catch (err) {
                console.error(err);
                this.message = "Failed to upload product.";
            }
        },
    },
};
</script>

<style scoped>
/* Optional: style your form */
</style>
