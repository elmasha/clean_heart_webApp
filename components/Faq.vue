<template>
  <div class="container" >
        <div class=" parallax_about" >
            <v-row style="padding-top: 8rem;"  class="container">
                <v-col cols="12" md="2"></v-col>
                <v-col cols="12" md="5">
                    <div class="container">
                        <h1>
                            Frequently <br> Asked <br> Questions
                        </h1>
                    </div>
                </v-col>
                <v-col cols="12" md="5">
                    <v-row>
                        <v-col cols="12" class="my-0">
                            <v-card elevation="0" class="pa-4">
                                <h3>What is SwissLife Africa's return policy?</h3>
                                <p>We offer a 30-day return policy for unopened products. Please contact our support team for assistance.</p>
                            </v-card>
                        </v-col>
                        <v-col cols="12" class="my-0">
                            <v-card elevation="0" class="pa-4">
                                <h3>Do you ship internationally?</h3>
                                <p>Yes, we ship to select countries. Shipping fees and delivery times may vary based on location.</p>
                            </v-card>
                        </v-col>
                        <v-col cols="12" class="my-0">
                            <v-card elevation="0" class="pa-4">
                                <h3>Are your supplements safe and tested?</h3>
                                <p>Absolutely. All our supplements are manufactured in GMP-certified facilities and undergo rigorous quality testing.</p>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script>
export default {
  name: 'EmptyLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
//   head () {
//     const title =
//       this.error.statusCode === 404 ? this.pageNotFound : this.otherError
//     return {
//       title
//     }
//   }
}
</script>

<style scoped>
.parallax_about {
    /* Background image */
    background-image: url('~/assets/p_about.png');
    background-attachment: fixed;
    width: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}
</style>
