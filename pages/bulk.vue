<template>
<div>
    <div>
        <v-app-bar light elevation="0" class="" color="white" fixed>

            <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">

                    <v-app-bar-nav-icon v-show="showBurger" light v-bind="attrs" v-on="on" color="black"></v-app-bar-nav-icon>
                </template>
                <v-list>
                    <!-- <v-list-item v-for="(item, index) in items" :key="item.title">
                                <v-list-item-action @click="checkNav(item.title)">{{ item.title }}</v-list-item-action>
                                <v-list-item-title></v-list-item-title>
                            </v-list-item> -->

                    <v-list-item> <a id="link" @click.prevent="scrollToSection1('')" style="margin: 8px;">Home</a></v-list-item>
                    <v-list-item><a id="link" @click.prevent="scrollToSection1('')" style="margin: 8px;">About</a></v-list-item>
                    <v-list-item><a id="link" @click.prevent="scrollToSection1('shop')" style="margin: 8px;">Shop</a></v-list-item>
                    <v-list-item> <a id="link" @click.prevent="scrollToSection1('')" style="margin: 8px;">Team</a></v-list-item>
                    <v-list-item> <a id="link" @click.prevent="scrollToSection1('certifications')" style="margin: 8px;">Certifications</a></v-list-item>
                    <v-list-item> <a id="link" @click.prevent="scrollToSection1('')" style="margin: 8px;">FAQ</a></v-list-item>
                    <v-list-item> <a id="link" @click.prevent="scrollToSection1('')" style="margin: 8px;">Contact</a></v-list-item>
                    <v-list-item><a id="link" @click.prevent="scrollToSection1('')" style="margin: 8px;">terms</a></v-list-item>

                </v-list>
            </v-menu>

            <v-toolbar-title>
                 <nuxt-link style="text-decoration: none;" to="/"><v-img :src="logo" contain width="120" height="30"></v-img></nuxt-link>  
            </v-toolbar-title>

            <v-spacer></v-spacer>
            <div v-show="!showBurger" id="nav_bar_links">
                <a id="link" @click.prevent="scrollToSection1('')" style="margin: 8px;">Home</a>
                <a id="link" @click.prevent="scrollToSection1('')" style="margin: 8px;">About</a>
                <a id="link" @click.prevent="scrollToSection1('shop')" style="margin: 8px;">Shop</a>
                <a id="link" @click.prevent="scrollToSection1('')" style="margin: 8px;">Team</a>
                <a id="link" @click.prevent="scrollToSection1('certifications')" style="margin: 8px;">Certifications</a>
                <a id="link" @click.prevent="scrollToSection1('')" style="margin: 8px;">FAQ</a>
                <a id="link" @click.prevent="scrollToSection1('')" style="margin: 8px;">Contact</a>
                <a id="link" @click.prevent="scrollToSection1('')" style="margin: 8px;">terms</a>
            </div>
            <v-spacer></v-spacer>

            <v-btn icon>
                <v-icon>mdi-account</v-icon>
            </v-btn>

            <div class="cart-container d-flex align-center">
                <v-btn icon class="cart-btn" color="primary" @click="drawer2 = !drawer2">
                    <v-icon medium>mdi-cart-outline</v-icon>
                    <span v-if="totalItems > 0" style="background-color: red; color: white; border-radius: 360px;padding: 3px; font-size: 0.7rem; font-weight: 1000;">{{ totalItems}}</span>

                    <!-- <v-badge v-if="totalItems > 0" :content="totalItems" style="margin-right: 30px;margin-top: 10px; width: 100%;" color="red" overlap bordered class="cart-badge">{{ totalItems}}</v-badge> -->
                </v-btn>
            </div>
            <!-- <v-btn icon @click="$fire.auth.signOut()" v-if="show_auth">
                <v-icon>mdi-logout</v-icon>
            </v-btn> -->

        </v-app-bar>
        <v-navigation-drawer v-model="drawer" absolute right style="margin-top: 120px;" elevation="0">
        </v-navigation-drawer>
    </div>
    <v-card color="white" elevation="0" style="margin-top: 40px;">
        <v-row v-resize="onResize">

            <v-col cols="12" sm="12" md="12"> </v-col>

            <v-col cols="12" sm="12" md="12">

                <div class="container my-0">
                    <div class="d-flex">
                        <div>

                            <h1 style="font-size: 1.9rem;">B2b Shop</h1>
                            <div>
                                <div>
                                    <span style="font-size: smaller;">
                                        <h3>{{ business_name }}</h3>
                                    </span>
                                    <span style="font-size: smaller;"> {{ registration_number.substring(0,8) }}</span>

                                </div>
                            </div>
                            <br>

                            <label for="">Product Categories</label>
                            <v-chip-group column style="padding: 12px;">
                                <v-chip color="black" text-color="white" small @click="Fetch_Products">All</v-chip>
                                <v-chip color="black" text-color="white" small @click="search_with_categories('Energy')">Energy</v-chip>
                                <v-chip color="black" outlined text-color="black" @click="search_with_categories('anti-aging')" small>anti-aging</v-chip>
                                <v-chip color="black" outlined text-color="black" @click="search_with_categories('Bones')" small>Bones</v-chip>
                                <v-chip color="black" outlined text-color="black" @click="search_with_categories('Omega 3')" small>Omega 3</v-chip>
                            </v-chip-group>
                        </div>
                        <v-spacer></v-spacer>
                        <div class="my-8 text-right">

                        </div>
                    </div>
                    <div class="">
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field @change="Search_Products(searchProduct)" v-model="searchProduct" placeholder="Search products" prepend-inner-icon="mdi-magnify" clearable filled rounded dense></v-text-field>
                            </v-col>
                        </v-row>

                    </div>
                    <v-card v-scroll.self="onScroll" class="overflow-x-auto" max-height="1000" elevation="0">
                        <div class="text-start">

                            <v-simple-table>
                                <template v-slot:default>
                                    <thead>
                                        <tr>
                                            <th class="text-center">
                                                Product
                                            </th>
                                            
                                            <th class="text-left">
                                                Unit price
                                            </th>
                                            <th class="text-left">
                                                SKU
                                            </th>
                                            <th class="text-left">
                                                MOQ
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in products" :key="item.name">
                                            <td>
                                                <div style="margin: 8px;" class="text-start">
                                                    
                                                    <v-img style="margin-left: 0px;" :src="item.image_url" width="50" contain height="80"></v-img>
                                                    <b style="font-size: 1.0rem;" class="text-center">{{ item.name }}</b>
                                                    <div style="margin-top: 8px;">
                                                        <v-btn small @click="add_Cart = true,quantity=1,cartProduct = item,checkMOQ(item.moq)" outlined>Add <v-icon>mdi-plus</v-icon>
                                                        </v-btn>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{{ item.price }}</td>
                                            <td>{{ item.sku }}</td>

                                            <td>{{ item.moq }} Units</td>

                                        </tr>
                                    </tbody>
                                </template>
                            </v-simple-table>

                        </div>

                    </v-card>

                </div>
            </v-col>
            <v-col cols="12" sm="12" md="12"> </v-col>
        </v-row>
        <div>
            <v-bottom-sheet v-model="drawer2" inset>

                <v-sheet class="text-sart " height="700px">
                    <v-progress-linear color="#89C53F" indeterminate v-show="showProgressCart" rounded height="6"></v-progress-linear>
                    <v-card elevation="0">
                        <div class="d-flex">
                            <v-card-title><b>{{ business_name }} Cart List</b></v-card-title>
                            <v-spacer></v-spacer>
                            <v-btn style="margin: 12px;" icon @click="drawer2 = false">
                                <v-icon color="red">mdi-close</v-icon>
                            </v-btn>
                        </div>
                        <v-divider></v-divider>
                        <div class="container">
                            <div class="">

                                <v-list-item-content>
                                    <v-list-item-subtitle>
                                        <p>{{ totalItems }} Units</p>
                                    </v-list-item-subtitle>
                                    <p>For</p>
                                    <v-list-item-title>
                                        <h3>Ksh/=<b> {{ numeral(total_price).format("0,0.0")  }}</b></h3>
                                    </v-list-item-title>

                                </v-list-item-content>

                                <div>

                                    <v-btn rounded color="green" :to="`b2b/${user_uid}`" style="color: white;">Check Out</v-btn>
                                    <v-btn text color="red" @click="clearB2BCart">Clear cart</v-btn>
                                </div>
                            </div>

                        </div>
                        <v-list>

                        </v-list>

                        <v-card elevation="0" class="text-sart overflow-x-auto" height="700px" v-scroll.self="onScroll">
                            <div class="row">
                                <div v-for="(item, id) in cart_items" :key="id" class="col-md-3">
                                    <v-list-item>
                                        <v-list-item-icon>
                                            <div class="d-flex">
                                                <v-btn icon small @click="removeFromB2BCart(item)">
                                                    <v-icon color="red">mdi-close-circle</v-icon>
                                                </v-btn>
                                                <v-img height="50" contain width="50" :src=" item.image_url"></v-img>
                                            </div>
                                        </v-list-item-icon>

                                        <v-list-item-content>
                                            <v-list-item-title>{{ item.name }}</v-list-item-title>
                                            <br>
                                            <v-list-item-subtitle>Qty: {{ item.quantity }} | Ksh {{ item.price }}</v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-list-item>
                                </div>
                            </div>

                        </v-card>

                    </v-card>

                </v-sheet>
            </v-bottom-sheet>
        </div>
        <v-snackbar color="primary accent-8" :timeout="6000" v-model="snackbar_s" centered bottom>
            {{ snackbarText_s }}
        </v-snackbar>
        <v-snackbar color="success" :timeout="2000" v-model="snackbar" outlined center>
            {{ snackbarText }}
        </v-snackbar>
        <v-snackbar color="error" :timeout="2500" v-model="snackbar2" outlined center>
            {{ snackbarText2 }}
        </v-snackbar>

        <v-dialog v-model="add_Cart" elevation="0" class="text-center" :scrollable="false" max-width="400">

            <v-card>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="add_Cart = false">
                        <v-icon color="red">mdi-close</v-icon>
                    </v-btn>
                </v-card-actions>
                <v-img :src="cartProduct.image_url" contain height="150"></v-img>
                <v-card-subtitle style=" margin-top: 20px;">
                    <b style="font-size: 1.3rem; font-weight: 700; color: black;"> {{ cartProduct.name }}
                    </b>
                </v-card-subtitle>
                <v-card-text>
                      <b style="font-size: 0.7rem;">Description:</b> <br>
                    <p style="font-size: 1.1rem;">{{ cartProduct.description }}</p> <br>
                    Now
                    <br>
                    <b style="font-size: 1.2rem; font-weight: 700; color: black;">Ksh {{ numeral(cartProduct.price * quantity).format("0,0")}}</b>

                </v-card-text>
                <v-card-text>
                    <div class="d-flex">
                        <p>SKU - </p> <b>{{ cartProduct.sku }}</b>
                    </div>
                    <div class="d-flex">
                        <p>MOQ - </p> <b> {{ cartProduct.moq }} Units</b>
                    </div>
                    <div class="d-flex">
                        <v-alert v-model="stock_message" dense text type="warning">
                            Minimum Order Quantity is {{ cartProduct.moq }} per Unit
                        </v-alert>
                    </div>
                </v-card-text>
                <v-card-actions>

                    <div>
                        <p>Quantity per Unit</p>
                        <div class="d-flex">
                            <v-btn icon @click="Minus(cartProduct.moq,quantity)" :disabled="stopQuantity_">
                                <v-icon>mdi-minus</v-icon>
                            </v-btn>
                            <p><b style="margin-top: 8px;  font-size: 1.3rem; margin-left: 6px;margin-right: 6px;"> {{ quantity }}</b></p>
                            <v-btn icon @click="Add(cartProduct.moq)" :disabled="stopQuantity">
                                <v-icon>mdi-plus</v-icon>
                            </v-btn>
                        </div>
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn rounded color="black" style="color: aliceblue;" @click="addToB2BCart(cartProduct)">Add Item <v-icon>mdi-cart</v-icon>
                    </v-btn>

                </v-card-actions>
            </v-card>

        </v-dialog>

        <v-dialog v-model="BsAuth" elevation="0" class="text-center auth" light :scrollable="false" max-width="1200">
            <business-auth></business-auth>
        </v-dialog>

    </v-card>
</div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import numeral from "numeral";
import logo from "@/assets/logo.png";
import BusinessAuth from "../components/BusinessAuth.vue"

import {
    uuid
} from "vue-uuid";
import {
    _
} from "core-js";

const keyValue = "fd85b4945YF'i"; // your key value (eg: key)
const ivKey = "smslt";

export default {
    name: "shop",
    components: {
        BusinessAuth,
    },
    data() {
        return {
            cart_tag: "bulk",
            stock_message: null,
            stopQuantity: false,
            stopQuantity_: false,
            registration_number: "",
            business_name: "",
            business_type: "",
            industry_category: "",
            scrollInvoked: 0,
            BsAuth: false,
            showProgressCart: false,
            add_Cart: false,
            cartProduct: false,
            showBurger: false,
            showHeroCard: false,
            heroHeight: 700,
            backToTop: false,
            windowSize: {
                x: window.innerHeight,
                y: window.innerWidth,
            },
            numeral,
            user_id: 1,
            uid: "grace",
            searchProduct: "",

            product_id: null,
            quantity: 1,
            price: null,
            products: [],
            totalItems: 0,
            cart_items: [],
            total_items: 0,
            total_price: 0,
            b2c: false,
            errorResponse: "",
            successResponse: "",
            Amount: "",
            Phone: null,
            bs_date: null,
            UserName: "",
            snackbar_s: false,
            snackbarText_s: "",
            snackbar: false,
            snackbar2: false,
            snackbarText: "",
            snackbarText2: "",
            status: false,
            drawer2: false,
            drawer: false,
            logo,
            b2bCart: [],
            user_uid: null,
            show_auth:false,
        };
    },
    methods: {
        checkUser() {
            if (this.$fire.auth.currentUser != null) {
                this.user_uid = this.$fire.auth.currentUser.uid;
                this.show_auth = true;
                console.log("UID", this.user_uid);
            } else {
                this.s = false;
            }
        },
        async Add(val) {
            if (val <= 1) {
                this.stock_message = "Minimums";
                this.stopQuantity = true;
                this.stopQuantity_ = true;
            } else if (val > 1) {
                this.stopQuantity = false;
                this.stock_message = null;
                this.stopQuantity_ = false;
                if (val === this.quantity) {
                    this.stock_message = "Minimums";
                    this.stopQuantity = true;
                    this.stopQuantity_ = false;
                    return
                }
                this.quantity++;

            }
        },
        async Minus(val, val2) {
            if (val2 === 1) {
                this.stopQuantity_ = true;
            } else {
                this.quantity--;
                if (val <= 1) {
                    this.stock_message = "Minimums";
                    this.stopQuantity = true;
                    this.stopQuantity_ = true;

                } else if (val > 1) {
                    this.stopQuantity = false;
                    this.stopQuantity_ = false;
                    this.stock_message = null;

                }
            }

        },
        async checkMOQ(val) {
            if (val <= 1) {
                this.stock_message = "Minimums";
                this.stopQuantity = true;
                this.stopQuantity_ = true;
            } else if (val > 1) {
                this.stopQuantity = false;
                this.stopQuantity_ = false;
                this.stock_message = null;
            }

        },
        async removeFromB2BCart(item) {
            try {
                const payload = {
                    uid: this.cart_tag + "_" + this.user_uid,
                    product_id: item.product_id
                };

                const res = await axios.post(
                    "https://swisslifeserver-production.up.railway.app/api/b2b/cart/remove",
                    payload
                );

                this.fetchB2BCart();
                console.log("Removed:", res);
            } catch (err) {
                console.error("Remove error:", err);
            }
        },
        async saveAllToCart() {
            try {
                const items = this.productList
                    .filter(p => p.quantity && p.quantity > 0)
                    .map(p => ({
                        product_id: p.id,
                        quantity: p.quantity,
                        price: p.wholesale_price,
                        image_url: p.image_url,
                        moq: p.moq
                    }));

                if (items.length === 0) {
                    console.warn("No items selected.");
                    return;
                }

                const payload = {
                    uid: this.cart_tag + "_" + this.user_uid,
                    items
                };

                const res = await axios.post(
                    "https://swisslifeserver-production.up.railway.app/api/b2b/cart/add-bulk",
                    payload
                );

                this.fetchB2BCart();
                console.log("Bulk saved:", res);
            } catch (err) {
                console.error("Bulk add error:", err);
            }
        },
        async clearB2BCart() {
            try {
                const payload = {
                    uid: this.cart_tag + "_" + this.user_uid,
                };

                const res = await axios.post(
                    "https://swisslifeserver-production.up.railway.app/api/b2b/cart/clear",
                    payload
                );

                this.fetchB2BCart();
                console.log("Cart cleared:", res);
            } catch (err) {
                console.error("Clear cart error:", err);
            }
        },
        async addToB2BCart(item) {
            let that = this;
            try {
                const payload = {
                    uid: this.cart_tag + "_" + this.user_uid,
                    product_id: item.id,
                    quantity: this.quantity,
                    price: item.bulk_price,
                    image_url: item.image_url,
                    moq: item.moq,
                };

                const res = await axios.post(
                    "https://swisslifeserver-production.up.railway.app/api/b2b/cart/add",
                    payload
                );

                that.fetchB2BCart(); // Refresh cart
                console.log("Saved:", res);
                that.add_Cart = false;
                that.snackbar = true;
                that.snackbarText = res.data.message;
            } catch (err) {
                console.error("Add to B2B cart error:", err);
            }
        },
        async fetchB2BCart() {
            let that = this;
            that.cart_items.splice(0, that.cart_items.length);
            axios
                .get(`https://swisslifeserver-production.up.railway.app/api/b2b/cart/get-id/${this.cart_tag+"_"+this.user_uid}`, {})
                .then(function (response) {
                    if (response.status == 200) {
                        // that.snackbar = true;
                        // that.snackbarText = response.data;
                        that.cart_items = response.data.items;
                        that.totalItems = response.data.totalItems;
                        that.total_price = response.data.totalAmount;

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
        onScroll() {
            this.scrollInvoked++
        },
        async scrollToSection1(val) {
            this.$router.push({
                path: `/${val}`,
            });
        },
        onResize() {
            this.windowSize = {
                x: window.innerWidth,
                y: window.innerHeight,
            };
            console.log("size", this.windowSize.x);
            if (this.windowSize.x < 950) {
                this.showBurger = true;
                this.showHeroCard = true;
            } else {
                this.showBurger = false;
            }
            return this.windowSize;
        },
        logout() {
            this.$fire.auth.signOut();
            window.location.reload(true);
        },

        async Fetch_Products() {
            let that = this;
            that.products.splice(that.products);
            axios
                .get("https://swisslifeserver-production.up.railway.app/api/products/getAll", {})
                .then(function (response) {
                    if (response.status == 200) {
                        // that.snackbar = true;
                        // that.snackbarText = response.data;
                        that.products = response.data;
                    } else if (response.status == 400) {
                        that.snackbar2 = true;
                        that.snackbarText2 = response.data;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    that.snackbarText2 = error;
                    that.snackbar2 = true;
                });
        },
        async Search_Products(val) {
            if (val === "") {
                this.Fetch_Products();
            }
            let that = this;
            that.products.splice(that.products);
            axios
                .get("https://swisslifeserver-production.up.railway.app/api/products/search/?query=" + val, {})
                .then(function (response) {
                    if (response.status == 200) {
                        // that.snackbar = true;
                        // that.snackbarText = response.data;
                        if (that.products.length === 0) {
                            that.snackbar = true;
                            that.snackbarText = " Items not available";
                        } else {

                        }
                        that.products = response.data;
                    } else if (response.status == 400) {
                        that.Fetch_Products();
                        that.snackbar2 = true;
                        that.snackbarText2 = response.data;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    that.snackbarText2 = error;
                    that.snackbar2 = true;
                });
        },
        async search_with_categories(val) {
            if (val === "") {
                this.Fetch_Products();
            }
            let that = this;
            that.products.splice(that.products);
            axios
                .get("https://swisslifeserver-production.up.railway.app/api/products/search/?query=" + val, {})
                .then(function (response) {
                    if (response.status == 200) {
                        // that.snackbar = true;
                        // that.snackbarText = response.data;
                        that.products = response.data;
                        if (that.products.length === 0) {
                            that.snackbar = true;
                            that.snackbarText = " Items not available";
                        } else {

                        }
                    } else if (response.status == 400) {
                        that.Fetch_Products();
                        that.snackbar2 = true;
                        that.snackbarText2 = response.data;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    that.snackbarText2 = error;
                    that.snackbar2 = true;
                });
        },
        async Fetch_CartList() {
            let that = this;
            that.cart_items.splice(0, that.cart_items.length);
            axios
                .get(`https://swisslifeserver-production.up.railway.app/api/b2b/cart/get-id/${this.cart_tag+"_"+this.user_uid}`, {})
                .then(function (response) {
                    if (response.status == 200) {
                        // that.snackbar = true;
                        // that.snackbarText = response.data;
                        that.cart_items = response.data.items;
                        that.totalItems = response.data.totalItems;
                        that.total_price = response.data.totalAmount;

                    } else if (response.status == 400) {
                        that.snackbar2 = true;
                        that.snackbarText2 = response.data;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    that.snackbarText2 = error;
                    that.snackbar2 = true;
                });
        },
        async Fetch_Bs() {
            let that = this;
            axios
                .get("https://swisslifeserver-production.up.railway.app/api/business/get-id/"+that.user_uid, {})
                .then(function (response) {
                    if (response.status == 200) {
                        // that.snackbar = true;
                        // that.snackbarText = response.data;
                        that.bs_date = response.data;
                        that.business_name = response.data.business_name;
                        that.registration_number = response.data.registration_number;
                        that.business_type = response.data.business_type;
                        that.user_uid = response.data.uid;
                        console.log("Bs", that.bs_date);

                    } else if (response.status == 400) {
                        that.snackbar2 = true;
                        that.snackbarText2 = response.data;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    that.snackbarText2 = error;
                    that.snackbar2 = true;
                });
        },
        loginAnonymously1() {
            this.$fire.auth
                .signInAnonymously()
                .catch(function (error) {
                    this.snackbarText = error.message;
                    this.snackbar = true;
                    this.showLogin = false;
                })
                .then((user) => {
                    //we are signed in
                    const start_time = this.$dayjs(new Date()).format("YYYY/MM/DD HH:mm:ss");
                    let ID = uuid.v1();
                    console.log(uuid.v1());

                });
        },
        generateRandomNumber() {
            const digits = "DY*1234FA6789";
            let randomNumber = "";
            const length = 9;

            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * digits.length);
                randomNumber += digits[randomIndex];
            }

            this.randomNineDigitNumber = randomNumber;

            return randomNumber;
        },

    },
    mounted() {
        this.checkUser();
        this.Fetch_Products();
        this.Fetch_CartList();
        this.fetchB2BCart();
        this.Fetch_Bs();
        // window.addEventListener('scroll', this.handleScroll);
    },
    computed: {
        b2bCartCount() {
            return this.b2bCart.length || 0;
        }
    },
    created() {},
    watch: {
        // timerEnabled(value) {
        //   if (value) {
        //     setTimeout(() => {
        //       this.timerCount--;
        //     }, 1000);
        //   }
        // },
        // timerCount: {
        //   handler(value) {
        //     if (value > 0 && this.timerEnabled) {
        //       setTimeout(() => {
        //         this.timerCount--;
        //       }, 1000);
        //     } else if (value == 0) {
        //       console.log("Done", this.Query);
        //       this.StkQuery();
        //     }
        //   },
        //   immediate: true, // This ensures the watcher is triggered upon creation
        // },
        // timerEnabled3(value) {
        //   if (value) {
        //     setTimeout(() => {
        //       this.timerCount3--;
        //     }, 1000);
        //   }
        // },
        // timerCount3: {
        //   handler(value) {
        //     if (value > 0 && this.timerEnabled3) {
        //       setTimeout(() => {
        //         this.timerCount3--;
        //       }, 1000);
        //     } else if (value == 0) {
        //       this.FetchUserPin2();
        //     }
        //   },
        //   immediate: true, // This ensures the watcher is triggered upon creation
        // },
        // timerEnabled2(value) {
        //   if (value) {
        //     setTimeout(() => {
        //       this.timerCount2--;
        //     }, 1000);
        //   }
        // },
        // timerCount2: {
        //   handler(value) {
        //     if (value > 0 && this.timerEnabled2) {
        //       setTimeout(() => {
        //         this.timerCount2--;
        //       }, 1000);
        //     } else if (value == 0) {
        //       this.resetPin2();
        //     }
        //   },
        //   immediate: true, // This ensures the watcher is triggered upon creation
        // },
    },
};
</script>

<style>
#all_items2 {
    --scrollbarBG: #00000000;
    --thumbBG: #2f2c2c00;
    scrollbar-width: thin;
    scrollbar-color: var(--thumbBG) var(--scrollbarBG);
    overflow-x: auto;
    width: 100%;
    align-items: start;
    bottom: 0;
    padding: 3px;
    height: 700px;
}

#all_items2::-webkit-scrollbar {
    width: 8px;
}

#all_items2::-webkit-scrollbar-track {
    background: var(--scrollbarBG);
}

#all_items2::-webkit-scrollbar-thumb {
    background-color: var(--thumbBG);
    border-radius: 8px;
    border: 3px solid var(--scrollbarBG);
}

.cart-container {
    position: relative;
    display: flex;
    align-items: center;
}

.cart-btn {
    position: relative;
    background-color: transparent !important;
    transition: transform 0.2s ease;
}

.cart-btn:hover {
    transform: scale(1.1);
}

.cart-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    font-weight: 600;
    font-size: 0.75rem;
}

#cartCount {
    font-size: 1.3rem;
}

#CountCart {
    color: black;
    padding: 5px;
    border-radius: 100px;
    border: none;
}

.CartBtn {
    height: 40px;
    border-radius: 12px;
    border: none;
    background-color: #00DF82;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition-duration: 0.5s;
    overflow: hidden;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.103);
    position: relative;
}

#nav_bar_links {
    color: black;
    font-weight: 500;

    font-size: 16px;
    transition: color 0.3s;
    background-color: rgba(206, 243, 211, 0.226);
    padding: 8px;
    border-radius: 10px;
}

#link {
    color: #000;
    font-weight: 800;
    transition: 0.3s;
}

#link:hover {
    color: red;
    font-weight: 800;
}

#all_items2 {
    --scrollbarBG: #000;
    --thumbBG: #2f2c2ce0;
    scrollbar-width: thin;
    scrollbar-color: var(--thumbBG) var(--scrollbarBG);
    overflow-y: scroll;
    width: 100%;
    align-items: start;
    bottom: 0;
    padding: 3px;
    height: 700px;
}

#all_items2::-webkit-scrollbar {
    width: 8px;
}

#all_items2::-webkit-scrollbar-track {
    background: var(--scrollbarBG);
}

#all_items2::-webkit-scrollbar-thumb {
    background-color: var(--thumbBG);
    border-radius: 8px;
    border: 3px solid var(--scrollbarBG);
}

.blur {
    filter: blur(9px);
    /* Adjust the value (5px) to increase or decrease the blur intensity */
}

#charter {
    transition: 0.5s ease;
    background-image: url("@/assets/bg.png");
    background-attachment: fixed;
    background-position: center;
    background-size: contain;
    background-color: black;
    width: 100%;
    height: 260px;
}
</style>
