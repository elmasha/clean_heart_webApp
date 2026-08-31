<!-- Please remove this file from your project -->
<template>
<div>
    <v-img with="100%" :src="bg" height="700" style="margin-top: 0px;">

        <div style="background: linear-gradient(to right, rgba(140, 198, 63, 0.8),rgba(139, 198, 63, 0.685), rgba(255, 255, 255, 0.1));
                                    padding: 30px 50px;
                                    display: flex;
                                    height: 100vh;
                                    background-size: cover;
                                    background-position: center;
                                    background-repeat: no-repeat;">
            <v-row>

                <v-col cols="12" md="8" class="fade-in-right">
                    <div class=" container">

                        <v-card color="transparent" v-show="!showBurger" height="90" elevation="0">

                        </v-card>

                        <div class="">

                            <h1 class="" style="font-size: 1.9rem; font-weight: 900;">Your Wellness. <br> Our
                                Mission</h1>
                            <p class=" mb-4" style="font-size: 1.2rem;">SwissLife Africa help you find solutions for your
                                health <br>

                                Your trusted partner in health and wellness.<br>
                                From prescriptions to expert advice, we’ve got you <br>
                                covered. Helping you and your family stay healthy,
                                every day.</p>
                            <v-btn rounded style="color: black;" color="white" large to="/shop">Shop Now <v-icon right dark>
                                    mdi-cart
                                </v-icon>
                            </v-btn>
                        </div>

                    </div>
                </v-col>
                <v-col cols="12" md="4" v-show="!showBurger">
                    <div class="">

                        <v-card color="transparent" elevation="0" min-width="400">

                            <v-carousel cycle hide-delimiters :show-arrows="false">

                                <v-carousel-item v-for="(item,i) in products" :key="i">

                                    <v-card class="box">

                                        <div>

                                            <v-card-actions>
                                                <v-card-subtitle>
                                                    <b style="font-size: 1.8rem; font-weight: 700; color: black;"> {{ item.name }}
                                                        <br></b>
                                                    <br>

                                                </v-card-subtitle>
                                                <v-spacer></v-spacer>
                                                <v-chip color="green" text-color="white" small>{{ item.category }}</v-chip>
                                            </v-card-actions>
                                            <v-img :src="item.image_url" contain height="270"></v-img>

                                        </div>
                                        <v-card>

                                            <v-card-subtitle>

                                                <v-row align="start" class="mx-0">
                                                    <v-rating :value="4.5" color="amber" dense half-increments readonly size="14"></v-rating>

                                                    <div class="grey--text ms-4">
                                                        4.5 
                                                    </div>
                                                </v-row><br>
                                                <div class="d-flex">
                                                    <div>
                                                        NOw <br>
                                                        <b style="font-size: 1.7rem; font-weight: 700; color: black;">Ksh {{ numeral(item.price).format("0,0") }}</b>

                                                    </div>
                                                    <v-spacer></v-spacer>
                                                    <div>
                                                        <v-btn text color="transparent" @click="sendData(item)">
                                                            <div class="d-flex">
                                                                <span style="color: black;">
                                                                    Add<v-icon>mdi-plus</v-icon>
                                                                </span>
                                                            </div>
                                                        </v-btn>
                                                    </div>

                                                </div>
                                            </v-card-subtitle>
                                        </v-card>
                                    </v-card>

                                </v-carousel-item>

                            </v-carousel>

                        </v-card>

                    </div>

                </v-col>
                <v-col cols="12" md="4" v-show="showBurger">
                    <div class="">

                        <v-card color="transparent" elevation="0" min-width="300">

                            <v-carousel cycle hide-delimiters :show-arrows="false">
                                <v-carousel-item v-for="(item,i) in products" :key="i">
                                    <div class="d-flex">
                                        <v-card class="box" width="190">

                                            <div>

                                                <v-card-actions>
                                                    <v-card-subtitle>
                                                        <div class="">
                                                            <v-img :src="item.image_url" contain height="70" width="100"></v-img>

                                                            <div>
                                                                <br>
                                                                <b style="font-size: 1.2rem; font-weight: 700; color: black;"> {{ item.name }}
                                                                    <br></b>
                                                                <br>
                                                            </div>

                                                        </div>

                                                    </v-card-subtitle>

                                                </v-card-actions>

                                            </div>
                                        </v-card>
                                        <v-card class="">

                                            <v-card-subtitle>
                                                <v-row align="start" class="mx-0">
                                                    <v-rating :value="4.5" color="amber" dense half-increments readonly size="14"></v-rating>

                                                    <div class="grey--text ms-4">
                                                        4.5
                                                    </div>
                                                </v-row> <br>
                                                NOw <br>
                                                <b style="font-size: 1.5rem; font-weight: 700; color: black;">Ksh {{ numeral(item.price).format("0,0") }}</b>
                                                <br>
                                                <v-chip-group>
                                                    <v-chip color="green" text-color="white" small>20% OFF</v-chip>
                                                </v-chip-group>
                                                <div>
                                                    <v-btn text color="transparent" @click="sendData(item)">
                                                        <div class="d-flex">
                                                            <span style="color: black;">
                                                                Add<v-icon>mdi-plus</v-icon>
                                                            </span>
                                                        </div>
                                                    </v-btn>
                                                </div>
                                            </v-card-subtitle>

                                        </v-card>
                                    </div>

                                </v-carousel-item>

                            </v-carousel>

                        </v-card>

                    </div>

                </v-col>
            </v-row>
        </div>
    </v-img>
</div>
</template>

<script>
import p1 from "@/assets/product/p1.png";
import bg from "@/assets/carousel/2.jpg";
import axios from "axios";
import numeral from "numeral";

export default {
    name: 'NuxtTutorial',
    props: {
        showBurger: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            products: [],
            numeral,
            items_c: [{
                    src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
                },
                {
                    src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
                },
                {
                    src: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
                },
                {
                    src: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
                },
            ],
            p1,
            bg,
            pageNotFound: '404 Not Found',
            otherError: 'An error occurred'
        }
    },
    methods: {
        sendData(val) {
            this.$emit("send-data", val);
        },
        async Fetch_Products() {
            let that = this;
            that.products.splice(that.products);
            axios
                .get("https://swisslifeserver-production.up.railway.app/api/products/products/tag/home", {})
                .then(function (response) {
                    if (response.status == 200) {
                        // that.snackbar = true;
                        // that.snackbarText = response.data;
                        that.products = response.data;
                        console.log("products", that.products);
                    } else if (response.status == 400) {

                    }
                })
                .catch(function (error) {
                    console.log(error);

                });
        },
    },
    mounted() {
        this.Fetch_Products();
    }
}
</script>

<style scoped>
.box {
    background-color: rgb(255 255 255 / 30%);
    backdrop-filter: blur(5px);
}

.fade-section {
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.8s ease;
    text-align: center;
    padding: 60px;
    background: #f4f4f4;
    margin: 10px;
    border-radius: 10px;
}

/* Active animation */
.fade-in {
    opacity: 1;
    transform: translateY(0);
}

.fade-demo {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    padding: 40px;
}

/* Fade In from Top */
.fade-in-up {
    opacity: 0;
    transform: translateY(30px);
    animation: fadeInUp 1.5s ease forwards;
}

@keyframes fadeInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Fade In from Bottom */
.fade-in-down {
    opacity: 0;
    transform: translateY(-30px);
    animation: fadeInDown 1.5s ease forwards;
}

@keyframes fadeInDown {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Fade In from Left */
.fade-in-left {
    opacity: 0;
    transform: translateX(-30px);
    animation: fadeInLeft 1.5s ease forwards;
}

@keyframes fadeInLeft {
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* Fade In from Right */
.fade-in-right {
    opacity: 0;
    transform: translateX(30px);
    animation: fadeInRight 1.5s ease forwards;
}

@keyframes fadeInRight {
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
</style>
