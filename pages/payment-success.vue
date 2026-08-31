<template>
<v-container>
    <br>
    <br>
    <div class="container">

        <v-row>
            <v-col cols="12" sm="12" md="12">
                <div class="container">
                    <nuxt-link style="text-decoration: none; color: red;" to="/">
                        <v-chip class="ma-2" color="red">
                            <v-icon color="white">mdi-chevron-left</v-icon>
                        </v-chip>
                    </nuxt-link>
                </div>
            </v-col>
            <v-col cols="12" md="4" sm="4"></v-col>
            <v-col cols="12" md="4" sm="4">
                <div class="container">
                    <v-img :src="payment" contain height="300"></v-img>
                    <div class="container">
                        <h1 style="color:green">Payment Successful! 🎉</h1>
                        <div class="container">
                            <p><strong style="color:green">Payment receipt:</strong> {{ paymentIntent }}</p>
                        </div>
                        <div class="container">
                            <p><strong style="color:green">Amount Paid:</strong> ${{ amount }}</p>
                        </div>
                        <div class="container">
                            <p><strong style="color:green">Payment Status:</strong> {{ redirectStatus }}</p>
                        </div>
                    </div>
                </div>
            </v-col>
            <v-col cols="12" md="4" sm="4"></v-col>
        </v-row>
        <v-card-actions>
            <v-spacer></v-spacer>

            <v-spacer></v-spacer>
        </v-card-actions>

    </div>
</v-container>
</template>

<script>
export default {

    data() {
        return {
            payment: require("@/assets/succesPay.svg"),
            paymentIntent: null,
            clientSecret: null,
            redirectStatus: null,
            amount: null
        };
    },
    mounted() {
        this.paymentIntent = this.$route.query.payment_intent;
        this.clientSecret = this.$route.query.payment_intent_client_secret;
        this.redirectStatus = this.$route.query.redirect_status;

        console.log("Payment Intent:", this.paymentIntent);
        console.log("Client Secret:", this.clientSecret);
        console.log("Redirect Status:", this.redirectStatus);

        // Fetch payment details from the backend
        this.confirmPayment();
    },
    methods: {
        async confirmPayment() {
            try {
                const response = await fetch("http://localhost:4000/payments/confirm-payment", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        paymentIntent: this.paymentIntent,
                        uid: this.$fire.auth.currentUser.uid,
                    }),
                });

                const data = await response.json();
                if (data.success) {
                    this.amount = data.amount;
                } else {
                    console.error("Payment not confirmed:", data.message);
                }
            } catch (error) {
                console.error("Error confirming payment:", error);
            }
        }
    }
};
</script>

<style>
* {
    font-family: "Quicksand";
}
</style>
