<template>
<div class="container">
    <div class="container">
        <v-row>
            <v-col cols="12" md="5" class="fade-in-right">
                <div class="container" style="padding: 10px;">
                    <h1>
                        Contact Us <br>
                    </h1>
                    <p> <b>Let's Connect - Your Health Journey Starts Here</b> </p>
                    <p>
                        Have a question, need assistance, or ready to
                        partner with us? <br>
                        We’d love to hear from you! Reach out for

                        product inquiries, partnership opportunities, or <br>
                        support. Our dedicated team is here to assist you
                        personally and promptly.</p>
                    <p>
                        <b>
                            Business Hours: <br>
                            Monday to Friday: 08:00 AM 17:30 PM <br>
                            Saturday: 09:00 AM 12:00PM <br>

                            Phone: +254 796 604 941 <br>

                            P.O. BOX 22420 00505 Nairobi, Kenya <br>

                            Location: Ngong Lane Plaza, Ngong Road <br>

                            Email: info@swisslifeafrica.com <br>

                            Online shop and WhatsApp support: Available 24/7 <br>
                        </b>

                    </p>
                </div>
            </v-col>
            <v-col cols="12" md="7">
                <v-card color="#eefcdd" elevation="0" class="pa-4">
                    <v-card-title>
                        <h2>Get in Touch</h2>
                    </v-card-title>
                    <v-form v-model="valid" style="margin-top: 10px;">
                    <v-container>
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field outlined rounded v-model="firstname" :counter="10" label="Full name" required></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field outlined rounded v-model="email" label="E-mail" required></v-text-field>
                            </v-col>
                            <v-col cols="12" md="12">
                                <v-textarea outlined rounded v-model="email" label="Send a Message" required></v-textarea>
                            </v-col>
                            <v-col cols="12" md="12">
                                <v-btn large outlined rounded>
                                    Send us a Message
                                    <v-icon right dark>
                                        mdi-arrow-top-right
                                    </v-icon>
                                </v-btn>
                            </v-col>

                        </v-row>
                    </v-container>
                </v-form>

                </v-card>
                
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
    data() {
        return {
            pageNotFound: '404 Not Found',
            otherError: 'An error occurred'
        }
    },
    // head () {
    //   const title =
    //     this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    //   return {
    //     title
    //   }
    // }
}
</script>

<style scoped>

</style>
