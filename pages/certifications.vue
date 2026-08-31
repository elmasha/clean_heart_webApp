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
                    <span style="background-color: red; color: white; border-radius: 360px;padding: 3px; font-size: 0.7rem; font-weight: 1000;">{{ totalItems}}</span>

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
    <v-card color="white" elevation="0" style="margin-top: 40px;" class="parallax_about">
        <v-row justify="" v-resize="onResize">
            <v-col cols="12" sm="12" md="12"></v-col>
            <v-col cols="12" sm="12" md="12"></v-col>
            <v-col cols="12" sm="12" md="12">
                <div class="container">
                    <div class="d-flex">
                        <div>
                            <h1 style="font-size: 1.9rem;">Certifications</h1>
                        </div>
                        <v-spacer></v-spacer>

                    </div>
                </div>
            </v-col>

            <v-col cols="12" sm="12" md="12">
                <div class="container">
                    <v-row justify="">

                        <v-col cols="12" sm="12" md="4">
                            <div class="container">
                                <h4>Certified for Quality You Can Trust</h4>

                                <p>
                                    G&G are proud to be certified by the MHRA (Medicines
                                    and Healthcare products Regulatory Agency), who
                                    validate our Good Manufacturing Practices (GMP)
                                    procedures.
                                </p>
                                <p>
                                    In addition, G&G are members of the Health
                                    Food Manufacturer’s Association, and are certified by
                                    the Soil Association for the manufacture of organic
                                    products, and the Vegetarian Society for the production
                                    of vegan and vegetarian products.
                                </p>
                                <p>
                                    passed inspections from a number of private and
                                    government agencies, including the Food and Drug
                                    Administration, Health Canada, and Environmental
                                    Health
                                </p>
                                <p>

                                </p>
                                <div class="container">

                                    <div class="row">

                                        <v-img :src="ct1" contain height="100" />

                                        <v-img :src="ct2" contain height="100" />

                                        <v-img :src="ct3" contain height="100" />

                                        <v-img :src="ct4" contain height="100" />

                                        <v-img :src="ct5" contain height="100" />

                                        <v-img :src="ct6" contain height="100" />

                                        <v-img :src="ct7" contain height="100" />

                                        <v-img :src="ct8" contain height="100" />

                                        <v-img :src="ct9" contain height="100" />

                                        <v-img :src="ct10" contain height="100" />

                                    </div>
                                </div>

                            </div>
                        </v-col>
                        <v-col cols="12" sm="12" md="4">
                            <div class="container">
                                <v-img :src="ct" contain height="700">

                                </v-img>
                            </div>
                        </v-col>
                        <v-col cols="12" sm="12" md="4">
                            <div class="container"></div>
                        </v-col>

                    </v-row>
                </div>

            </v-col>

        </v-row>
        <div>
            <v-bottom-sheet v-model="drawer2" inset>

                <v-sheet class="text-sart" height="700px">

                    <v-card elevation="0">
                        <div class="d-flex">
                            <v-card-title><b>Cart List</b></v-card-title>
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
                                        <p>{{ totalItems }} items</p>
                                    </v-list-item-subtitle>
                                    <p>For</p>
                                    <v-list-item-title>
                                        <h3>Ksh/=<b> {{ numeral(total_price).format("0,0.0")  }}</b></h3>
                                    </v-list-item-title>

                                </v-list-item-content>

                                <div>

                                    <v-btn rounded color="green" :to="`checkout/${uid}`" style="color: white;">Check Out</v-btn>
                                    <v-btn text color="red" @click="clearCart">Clear cart</v-btn>
                                </div>
                            </div>

                        </div>
                        <v-list>

                        </v-list>

                        <div class="row" id="all_items2">
                            <div v-for="(item, id) in cart_items" :key="id" class="col-md-3">
                                <v-list-item>
                                    <v-list-item-icon>
                                        <div class="d-flex">
                                            <v-btn icon small @click="removeFromCart(item)">
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

    </v-card>
</div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import numeral from "numeral";
import logo from "@/assets/logo.png";
import ct from "@/assets/ct.jpg";
import ct1 from "@/assets/cat/1.png";
import ct2 from "@/assets/cat/2.png";
import ct3 from "@/assets/cat/3.png";
import ct4 from "@/assets/cat/4.png";
import ct5 from "@/assets/cat/5.png";
import ct6 from "@/assets/cat/6.png";
import ct7 from "@/assets/cat/7.png";
import ct8 from "@/assets/cat/8.png";
import ct9 from "@/assets/cat/9.png";
import ct10 from "@/assets/cat/10.png";

import {
    uuid
} from "vue-uuid";

const keyValue = "fd85b4945YF'i"; // your key value (eg: key)
const ivKey = "smslt";

export default {
    name: "accounts",
    data() {
        return {
            ct,
            ct1,
            ct2,
            ct3,
            ct4,
            ct5,
            ct6,
            ct7,
            ct8,
            ct9,
            ct10,
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

        };
    },
    methods: {
        async Fetch_CartList() {
            let that = this;
            that.cart_items.splice(0, that.cart_items.length);
            axios
                .get("http://localhost:5000/api/cart/total/grace", {})
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
        // this.Fetch_Products();
        this.Fetch_CartList();
        // window.addEventListener('scroll', this.handleScroll);
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


.parallax_about {
    /* Background image */
    background-image: url('~/assets/p_about.png');
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
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
