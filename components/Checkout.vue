<template>
<div class="container">
    <v-app-bar light elevation="0" class="" color="white">

        <v-toolbar-title>
            <v-img :src="logo" contain width="120" height="30"></v-img>
        </v-toolbar-title>

    </v-app-bar>

    <v-card elevation="0" class="my-12">
        <div class="d-flex">
            <v-btn icon @click="$router.back()" style="margin-top: 15px;">
                <v-icon large>mdi-arrow-left</v-icon>
            </v-btn>
            <v-card-title class="text-h5
            ">Check out</v-card-title>
        </div>

        <div class="container">
            <v-row>

                <v-col cols="12" md="7">
                    <div class="container">
                        <v-alert border="left" colored-border type="info" elevation="0">

                            Note: Orders are collected on the first working day of each month.
                        </v-alert>
                        <v-row>
                            <v-col cols="12" md="6">
                                <template>

                                    <v-list-item two-line>

                                        <v-list-item-content>
                                            <v-list-item-subtitle>{{ totalItems }} items</v-list-item-subtitle>
                                            <v-list-item-title>
                                                <h2>Ksh/=<b> {{ numeral(total_price).format("0,0.0")  }}</b></h2>
                                            </v-list-item-title>
                                        </v-list-item-content>

                                    </v-list-item>

                                    <div class="">
                                        <div>
                                            <p> Flat rate fee KSh <b>500.00</b></p>
                                        </div>
                                        <p>Select payment method</p>
                                        <v-select v-model="selectedOption" @change="checkPaymentMethod(selectedOption)" :items="['Mpesa', 'Card']" label="Select payment method" dense outlined></v-select>
                                        <!-- <v-btn rounded color="green" :to="`checkout/${uid}`" style="color: aliceblue;">Place Order</v-btn> -->
                                        <br>
                                        <!-- <p style="color: red;">{{ messageError }}</p> -->
                                        <div v-if="selectedOption === 'Mpesa'" class="d-flex" style="padding: 0.8rem;border-radius: 1rem;background-color: antiquewhite;color: black;">
                                            <p style="font-size: 0.9rem;"> An STK push will prompted on the <b>{{ phonePrefix+phone_numer }}</b>
                                                check for an mpesa prompting you to pay <b>{{ numeral(total_price).format("0,0") }}</b> ksh</p>
                                        </div>
                                        <br>
                                        <v-text-field type="number" v-if="selectedOption === 'Mpesa'" v-model="phone_numer" :prefix="phonePrefix" placeholder="(7.. format)" label="Enter Phone Number" dense></v-text-field>
                                        <v-btn v-if="selectedOption === 'Mpesa'" rounded color="green" @click="mpesaSTK()" style="color: aliceblue;">Pay with Mpesa</v-btn>
                                        <div>
                                            <v-alert v-if="message" class="mt-4" type="success" dense outlined>
                                                {{ message }}
                                            </v-alert>
                                            <v-alert v-if="messageError" class="mt-4" type="error" dense outlined>
                                                {{ messageError }}
                                            </v-alert>

                                        </div>

                                        <div v-if="selectedOption === 'Card'">
                                            <div id="payment-element" class="container">
                                                <h2>Please wait......</h2>

                                            </div>
                                            <v-btn rounded color="green" style="color: aliceblue;" @click="payNow">Pay with Card</v-btn>
                                        </div>

                                    </div>
                                </template>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-list three-line id="all_items_checkout">
                                    <v-list-item v-for="item in cart_items" :key="item.title">
                                        <v-list-item-icon>
                                            <div class="d-flex">

                                                <v-img height="50" contain width="50" :src=" item.image_url"></v-img>
                                            </div>
                                        </v-list-item-icon>

                                        <v-list-item-content>
                                            <v-list-item-title>{{ item.name }}</v-list-item-title>
                                            <br>
                                            <v-list-item-subtitle>Qty: {{ item.quantity }} | Ksh {{ item.price }}</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list>
                            </v-col>
                        </v-row>

                    </div>
                </v-col>
                <v-col cols="12" md="5">
                    <v-card color="#eefcdd" elevation="0" class="pa-4 mb-4">

                        <form>
                            <v-row>
                                <v-col cols="12" sm="12">
                                    <h3>Shipping details</h3>
                                    <br>
                                    <h5>Contact information</h5>
                                    <label for="">We'll use this email to send you details and updates about your order.</label>
                                    <br>
                                    <v-text-field v-model="contact_email" label="Email" outlined required></v-text-field>
                                </v-col>
                            </v-row>
                        </form>

                        <v-alert border="top" colored-border type="info" elevation="0">
                            Shipping Time: Estimated delivery in 35 days.Shipping is Covered by SwissLife

                        </v-alert>
                        <div>
                            <h4>Shipping address</h4>
                            Enter the address where you want your order delivered.
                        </div>
                        <form>
                            <v-row>
                                <v-col cols="12" md="12">
                                    <v-text-field v-model="country" label="Country" outlined required></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field v-model="contact_name" label="Full Name" outlined required></v-text-field>
                                </v-col>

                                <v-col cols="12" md="4">
                                    <v-text-field v-model="address" label="Address" outlined required></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field v-model="business_name" label="Company name (optional)" outlined required></v-text-field>
                                </v-col>

                                <v-col cols="12" md="4">
                                    <v-text-field v-model="town" label="Town" outlined required></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field v-model="state" label="State" outlined required></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field v-model="contact_phone" label="Phone" outlined required></v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field v-model="postal_code" label="Postal code / ZIP" outlined required></v-text-field>
                                </v-col>
                            </v-row>
                        </form>
                    </v-card>
                </v-col>
                <v-col cols="12" md="12">
                    <div class="container">
                        <v-btn large rounded width="50%" color="black" style="color: white;" @click="placeOrder()">Place Order</v-btn>
                    </div>
                </v-col>
            </v-row>
        </div>
    </v-card>
    <v-snackbar color="primary accent-8" :timeout="4000" v-model="snackbar_s" centered bottom>
        {{ snackbarText_s }}
    </v-snackbar>
    <v-snackbar color="success" :timeout="4000" v-model="snackbar" outlined center>
        {{ snackbarText }}
    </v-snackbar>
    <v-snackbar color="error" :timeout="4000" v-model="snackbarError" outlined center>
        {{ snackbarTextError }}
    </v-snackbar>
</div>
</template>

<script>
import {
    loadStripe
} from '@stripe/stripe-js';
import axios from "axios";
import numeral from "numeral";
export default {
    name: 'Checkout',
    components: {},
    props: {
        uid: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            CheckoutRequestID: null,
            timerEnabled: false,
            show6: false,
            timerCount: 25,
            message: null,
            messageError: "",
            stripe: null,
            elements: null,
            selectedPaymentMethod: "card",
            clientSecret: "",
            phonePrefix: '254',
            showCard: false,
            showMpesa: false,
            logo: require("@/assets/logo.png"),
            numeral,
            pay_method: '',
            totalItems: 0,
            cart_items: [],
            total_items: 0,
            total_price: 0,
            phone_numer: "",
            user_id: 12,
            order_id: 0,
            selectedOption: '',
            pubKey: null,
            snackbar_s: false,
            snackbarText_s: "",
            snackbar: false,
            snackbarError: false,
            snackbarText: "",
            snackbarTextError: "",
            cart_tag: "reatail",
            UID: "",
            invoice_url: "",
            invoice_message: null,
            bs_data: null,
            registration_number: "",
            business_name: "",
            business_type: "",
            country: "",
            address: "",
            contact_name: "",
            contact_phone: "",
            contact_email: "",
            location: "",
            town: "",
            state: "",
            postal_code: "",
            province: "",
            category: "",
        }
    },
    mounted() {
        this.checkUser();
        this.loadPubKey();
        this.fetchCartItems();
    },
    methods: {
        async placeOrder() {
            let that = this;
            let total = (that.total_price + 500)
            axios
                .post(`https://swisslifeserver-production.up.railway.app/api/orders/place`, {
                    uid: that.UID,
                    user_id: 0,
                    shipping_name: that.contact_name,
                    company_name: that.business_name,
                    country: that.country,
                    state: that.state,
                    town: that.town,
                    address: that.address,
                    phone: that.contact_phone,
                    email: that.contact_email,
                    order_type: "b2c",
                    payment_method: that.selectedOption,
                    total_amount: total,
                    status: "Processing",
                    fulfillment_status: "Pending",
                    tracking_number: "",
                    cartItems: that.cart_items,
                })
                .then(function (response) {
                    console.log("Place order response", response.data);
                    if (response.status == 200) {
                        that.snackbar = true;
                        that.snackbarText = response.data;
                        that.clearCart();
                    } else if (response.status == 400) {
                        that.snackbar2 = true;
                        that.snackbarText2 = response.data.message;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    that.snackbarText2 = error.message;
                    that.snackbar2 = true;
                });

        },
        async clearCart() {
            this.showProgressCart = true;
            try {
                const res = await axios.post("https://swisslifeserver-production.up.railway.app/api/cart/clear/", {
                    uid: this.cart_tag + "_" + this.UID, // 👈 Data must go inside `data`
                });
                this.fetchCartItems();
                this.snackbar = true;
                this.snackbarText = "✅Cart cleard!";
                this.showProgressCart = false;
                this.$router.push("/shop");
                console.log(res.data);
            } catch (err) {
                console.error("❌ Remove failed:", err);
                alert("❌ Failed to remove item from cart.");
                this.showProgressCart = false;
            }
        },
        checkUser() {
            if (this.$fire.auth.currentUser != null) {
                // alert("Auth: " + true + "UID" +this.$fire.auth.currentUser.uid);
                console.log(this.$fire.auth.currentUser.uid);
                this.UID = this.$fire.auth.currentUser.uid;
            } else {
                this.UID = "elmasha";
                console.log(this.UID);
            }
        },
        StkQuery() {
            let that = this;
            that.snackbar_s = true;
            that.snackbarText_s = "Checking payment status...";
            that.message = null;
            axios
                .post("https://swisslifeserver-production.up.railway.app/api/mpesa/stkpush/query", {
                    checkoutRequestId: that.CheckoutRequestID,
                })
                .then(function (response) {
                    console.log("StkPush Query", response.data);

                    if (response.status == 200) {
                        that.progress_bar = false;
                        // that.snackbar = true;
                        // that.snackbarText = response.data.ResultDesc;
                        that.timerCount = 25;
                        that.timerEnabled = false;

                        if (response.data.ResultCode == "2001") {
                            that.messageError = "You provide a wrong pin";
                            that.snackbarError = true;
                            that.snackbarError = "You provide a wrong pin";
                        } else if (response.data.ResultCode == "1032") {
                            that.messageError = "You Cancled this transaction";
                            that.snackbarError = true;
                            that.snackbarError = "You provide a wrong pin";
                        } else if (response.data.ResultCode == "1") {
                            that.messageError = "The balance is insufficient for the transaction."
                            that.snackbarError = true;
                            that.snackbarError = "You provide a wrong pin";
                        }

                    }
                })
                .catch(function (error) {
                    that.snackbarError = true;
                    that.snackbarTextError = error;
                    that.timerCount = 25;
                    that.timerEnabled = false;
                    that.progress_bar = false;
                });
        },
        async loadPubKey() {
            this.pubKey = await axios.get('https://swisslifeserver-production.up.railway.app/api/card').then((res) => {
                console.log(res.data.publicKey);
                this.init(res.data.publicKey);

            });
        },
        async init(val) {
            this.stripe = await loadStripe(val); // Use your Publishable Key

        },
        async initializePayment() {
            this.messageError = null;
            const res = await fetch("https://swisslifeserver-production.up.railway.app/api/card/create-payment-intent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    amount: Number(this.total_price), // Example: $10
                    currency: "usd",
                    paymentMethodType: this.selectedPaymentMethod,
                }),
            });

            const {
                clientSecret
            } = await res.json();
            this.clientSecret = clientSecret;

            // Initialize Stripe Elements with clientSecret
            this.elements = this.stripe.elements({
                clientSecret
            });
            const paymentElement = this.elements.create("payment");
            paymentElement.mount("#payment-element");

        },
        async payNow() {
            const {
                error
            } = await this.stripe.confirmPayment({
                elements: this.elements,
                confirmParams: {
                    return_url: "http://localhost:3000/payment-success"
                },
            });

            if (error) alert(error.message);
        },
        checkPaymentMethod(val) {
            this.messageError = null;
            if (val == "Card") {
                this.initializePayment();
            } else {
                this.viewItemDialog = true;
            }
        },
        async mpesaSTK() {
            this.messageError = null;
            let phone = this.phonePrefix + this.phone_numer;
            if (phone.length != 12) {
                this.snackbarTextError = "Phone number should be 12 digits including country code";
                this.snackbarError = true;
                return;
            }
            try {
                const res = await axios.post("https://swisslifeserver-production.up.railway.app/api/mpesa/stkpush", {
                    user_id: 232,
                    order_id: 5,
                    phone: phone,
                    amount: this.total_price,

                });

                this.timerEnabled = true;
                this.CheckoutRequestID = res.data.CheckoutRequestID;
                this.message = res.data.ResponseDescription + "\nProvide you mpesa pin"
                console.log(res.data.ResponseDescription);
            } catch (err) {
                console.error(err);
                alert("❌ Failed ", err.message);
            }
        },
        async fetchCartItems() {
            try {
                const response = await axios.get(`https://swisslifeserver-production.up.railway.app/api/cart/total/${this.cart_tag+"_"+this.UID}`);
                this.cart_items = response.data.items;
                this.totalItems = response.data.totalItems;
                this.total_price = response.data.totalAmount;
            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
        },
    },
    watch: {
        timerEnabled(value) {
            if (value) {
                setTimeout(() => {
                    this.timerCount--;
                }, 1000);
            }
        },
        timerCount: {
            handler(value) {
                if (value > 0 && this.timerEnabled) {
                    setTimeout(() => {
                        this.timerCount--;
                    }, 1000);
                } else if (value == 0) {
                    this.StkQuery();
                    this.timerCount = 25;
                }
            },
            immediate: true, // This ensures the watcher is triggered upon creation
        },
    },
}
</script>

<style scoped>
/* #all_items_checkout {
    --scrollbarBG: #ffffff;
    --thumbBG: #ffffff;
    scrollbar-width: thin;
    scrollbar-color: var(--thumbBG) var(--scrollbarBG);
    overflow-y: hidden;
    width: 100%;
    align-items: center;
    bottom: 0;
    max-height: 400px;
    justify-content: center;
} */
</style>
