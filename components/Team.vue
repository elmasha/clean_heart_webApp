<template>
<div class="parallax_about">
    <div class="container ">

        <h1 class="container" style="padding-top: 80px;">Our Dedicated team</h1>

        <div class="container">
            <v-row class="text-center">
                <v-col cols="6" md="6" class="">
                    <v-card elevation="0" color="transparent">
                        <v-img :src="t4" contain height="150"></v-img>
                        <v-card-subtitle>
                            <b style="font-size: 1.1rem; font-weight: 700; color: black;">Kevin Kamau Njeri
                            </b>
                            <p>Founder & Managing Director
                                <br>
                                Europe / Kenya</p>
                        </v-card-subtitle>

                    </v-card>

                </v-col>
                <v-col cols="6" md="6" class="">
                    <v-card elevation="0" color="transparent">
                        <v-img :src="t7" contain height="150"></v-img>
                        <v-card-subtitle>
                            <b style="font-size: 1.1rem; font-weight: 700; color: black;">Lucy Muchene Schumacher
                            </b>
                            <p>Director and Shareholder
                                <br>

                                Europe / Kenya</p>
                        </v-card-subtitle>

                    </v-card>

                </v-col>
                <v-col cols="6" md="6" class="">
                    <v-card elevation="0" color="transparent">
                        <v-img :src="t1" contain height="150"></v-img>
                        <v-card-subtitle>
                            <b style="font-size: 1.1rem; font-weight: 700; color: black;">Allan Mwema
                            </b>
                            <p>Chief Executive Officer (CEO) <br>

                                Nairobi, Kenya</p>
                        </v-card-subtitle>

                    </v-card>

                </v-col>
                <v-col cols="6" md="6" class="">
                    <v-card elevation="0" color="transparent">
                        <v-img :src="t5" contain height="150"></v-img>
                        <v-card-subtitle>
                            <b style="font-size: 1.1rem; font-weight: 700; color: black;">Stella
                                Wmabui</b>
                            <p>Head of Human Resources &
                                Training
                                <br>
                                Nairobi, Kenya</p>
                        </v-card-subtitle>

                    </v-card>

                </v-col>
                <v-col cols="6" md="6" class="">
                    <v-card elevation="0" color="transparent">
                        <v-img :src="t2" contain height="150"></v-img>
                        <v-card-subtitle>
                            <b style="font-size: 1.1rem; font-weight: 700; color: black;">Husna Abdulhalim
                            </b>
                            <p>Chief Financial Officer (CFO)
                                & Board Member Assistant
                                <br>
                                Mombasa/ Nairobi, Kenya</p>
                        </v-card-subtitle>

                    </v-card>

                </v-col>
                <v-col cols="6" md="6" class="">
                    <v-card elevation="0" color="transparent">
                        <v-img :src="t3" contain height="150"></v-img>
                        <v-card-subtitle>
                            <b style="font-size: 1.1rem; font-weight: 700; color: black;">Jefferson Teddy Kasingu
                            </b>
                            <p>Chairperson – East Africa
                                <br>
                                Nairobi, Kenya</p>
                        </v-card-subtitle>

                    </v-card>

                </v-col>
                <v-col cols="6" md="6" class="">
                    <v-card elevation="0" color="transparent">
                        <v-img :src="t6" contain height="150"></v-img>
                        <v-card-subtitle>
                            <b style="font-size: 1.1rem; font-weight: 700; color: black;">Elmasha Omondi
                            </b>
                            <p>Heat of IT
                                <br>
                                Nairobi / Kenya</p>
                        </v-card-subtitle>

                    </v-card>

                </v-col>

                <v-col cols="6" md="6" class="">
                    <!-- <v-card elevation="0" color="transparent">
                        <v-img :src="t6" contain height="150"></v-img>
                        <v-card-subtitle>
                            <b style="font-size: 1.1rem; font-weight: 700; color: black;">Elmasha Omondi
                            </b>
                            <p>Heat of IT
                                <br>
                                Nairobi / Kenya</p>
                        </v-card-subtitle>

                    </v-card> -->

                </v-col>
            </v-row>
        </div>

    </div>

</div>
</template>

<script>
import t1 from "@/assets/team/1.jpg";
import t2 from "@/assets/team/2.jpg";
import t3 from "@/assets/team/3.jpg";
import t4 from "@/assets/team/4.jpg";
import t5 from "@/assets/team/5.jpg";
import t6 from "@/assets/team/6.jpeg";
import t7 from "@/assets/team/7.jpg";

export default {
    name: 'EmptyLayout',
    layout: 'empty',
    props: {
        error: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            pageNotFound: '404 Not Found',
            otherError: 'An error occurred',
            t1,
            t2,
            t3,
            t4,
            t5,
            t6,
            t7,
        }
    },
    // head() {
    //     const title =
    //         this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    //     return {
    //         title
    //     }
    // }
}
</script>

<style scoped>
.parallax_about {
    /* Background image */
    background-image: url('~/assets/p_about.png');
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}
</style>
