<template>
<v-card color="white" max-width="1200">
    <div class="parallax_about">
        <div class="container" style="padding: 10px;">

            <v-row v-resize="onResize">
                <v-col cols="12" md="12">
                    <div class="d-flex">
                        <div class="container" v-show="!showBurger">
                            <v-card class="box" elevation="0" style="padding: 0px;">
                                <v-card-actions>
                                </v-card-actions>
                                <div class="container">

                                    <div v-if="registerLayout === true">

                                        <div>
                                            <v-card-title class="" style="padding-top: 180px;">
                                                <h1>Welcome back</h1>
                                            </v-card-title>
                                            <br>

                                            <!-- <div class="">
                                        <v-img :src="reg" height="200" contain v-show="!showBurger"></v-img>
                                    </div> -->
                                            <v-card-text>
                                                <h3>Don't have an account ?</h3>
                                                <p style="padding-top: 10px;">Create your account and continue shopping with us.</p>
                                            </v-card-text>

                                            <v-card-actions class="text-start">
                                                <v-btn large outlined rounded width="50%" @click="registerLayout = !registerLayout">
                                                    Sign Up
                                                    <v-icon right dark>
                                                        mdi-account
                                                    </v-icon>
                                                </v-btn>
                                            </v-card-actions>
                                        </div>
                                    </div>

                                    <div v-if="registerLayout === false">
                                        <div>
                                            <v-card-title class="" style="padding-top: 180px;">
                                                <h1 style="font-weight: 2000;">Hi!.</h1>
                                            </v-card-title>
                                            <br>

                                            <!-- <div class="">
                                        <v-img :src="reg" height="200" contain v-show="!showBurger"></v-img>
                                    </div> -->
                                            <v-card-text>
                                                <h3>I already have an account ?</h3>
                                                <p style="padding-top: 10px;">Login in back into your account and continue shopping with us.</p>
                                            </v-card-text>

                                            <v-card-actions class="text-start">
                                                <v-btn large outlined rounded width="50%" @click="registerLayout = !registerLayout">
                                                    Log in
                                                    <v-icon right dark>
                                                        mdi-account
                                                    </v-icon>
                                                </v-btn>
                                            </v-card-actions>
                                        </div>
                                    </div>

                                </div>
                            </v-card>
                        </div>
                        <div style="background-color: white;">
                            <v-card class="" elevation="0">

                                <v-card v-show="!registerLayout" elevation="0" color="white">

                                    <v-form ref="form" v-model="isValid" class="container">
                                        <v-card-action>
                                            <div class="d-flex">
                                                <v-card-title>
                                                    <h3>B2b Sign Up</h3>
                                                </v-card-title>

                                                <v-spacer></v-spacer>

                                                <v-card-subtitle @click="registerLayout = true" v-show="showBurger">

                                                    <div class="d-flex">
                                                        <p style="color: grey;margin-top: 15px;">Login</p>
                                                        <v-icon>mdi-chevron-right</v-icon>
                                                    </div>
                                                </v-card-subtitle>

                                            </div>
                                        </v-card-action>

                                        <div class="" style="margin: 20px;">
                                            <v-row class="">
                                                <v-col cols="12" md="12">
                                                    <div class="text-start">
                                                        <span style="font-size: 0.9rem; margin-left: 10px;">Connect with</span>
                                                        <div class="d-flex">
                                                            <v-btn x-large outlined style="margin: 3px;" width="30%">
                                                                <v-icon center dark larg>
                                                                    mdi-google
                                                                </v-icon>
                                                            </v-btn>
                                                            <v-btn x-large outlined style="margin: 3px;" width="30%">
                                                                <v-icon center dark>
                                                                    mdi-apple
                                                                </v-icon>
                                                            </v-btn>
                                                            <v-btn x-large outlined style="margin: 3px;" width="30%">
                                                                <v-icon center dark larg>
                                                                    mdi-facebook
                                                                </v-icon>
                                                            </v-btn>
                                                        </div>
                                                    </div>

                                                </v-col>
                                                <v-col cols="12" md="6">
                                                    <v-text-field v-model="registration_number" label="Registration Number" @change="checkRegNo" :rules="[v => !!v || 'Required']" />
                                                    <v-alert v-if="exists" type="error" dense>
                                                        Business already exists: {{ existingBusiness.business_name }}
                                                    </v-alert>
                                                </v-col>

                                                <v-col cols="12" md="6">
                                                    <v-text-field :rules="[rules.required]" v-model="business_name" label="Business Name" />

                                                </v-col>

                                                <v-col cols="12" md="6">
                                                    <v-select :rules="[rules.required]" v-model="business_type" :items="['Gym','Clinic','Bulk Buyer','Other']" label="Business Type" />

                                                </v-col>

                                                <v-col cols="12" md="6">
                                                    <v-text-field :rules="[rules.required]" v-model="country" label="Country" />

                                                </v-col>
                                                <v-col cols="12" md="6">
                                                    <v-text-field :rules="[rules.required]" v-model="industry_category" label="Industry Category" />

                                                </v-col>

                                                <v-col cols="12" md="6">
                                                    <v-text-field :rules="[rules.required]" v-model="delivery_address" label="Delivery Address" />
                                                </v-col>
                                                <v-col cols="12" md="12">
                                                    <v-textarea :rules="[rules.required]" v-model="description" label="Description" filled dense />

                                                </v-col>
                                                <v-col cols="12" md="6">
                                                    <v-text-field :rules="[rules.required]" v-model="contact_full_name" label="Full Contact Name" />

                                                </v-col>
                                                <v-col cols="12" md="6">
                                                    <v-text-field :rules="[rules.required]" v-model="contact_role" label="Contact Role" />

                                                </v-col>

                                                <v-col cols="12" md="6">
                                                    <v-text-field :rules="[rules.required, rules.phone]" v-model="contact_phone" label="Contact Phone" />

                                                </v-col>

                                                <v-col cols="12" md="6">
                                                    <v-text-field :rules="[rules.required, rules.email]" v-model="contact_email" label="Email" />
                                                </v-col>

                                                <v-col cols="12" md="12">
                                                    <v-text-field :rules="[rules.required]" v-model="password" type="password" label="Password" />
                                                </v-col>
                                                <v-col cols="12" md="12">
                                                    <v-text-field v-model="password2" type="password" label="Retry password." />
                                                    <!-- <div v-if="password != password2">
                                                        <v-alert border="top" colored-border type="error" elevation="0">
                                                            Shipping Time: Estimated delivery in 35 days.Shipping is Covered by SwissLife

                                                        </v-alert>
                                                    </div> -->
                                                </v-col>

                                                <v-col cols="12" md="12">
                                                    <div>
                                                        <v-checkbox v-model="checkbox">
                                                            <template v-slot:label>
                                                                <div>
                                                                    I agree to the
                                                                    <v-tooltip bottom>
                                                                        <template v-slot:activator="{ on }">
                                                                            <a target="_blank" href="https://vuetifyjs.com" @click.stop v-on="on">
                                                                                Terms and conditions
                                                                            </a>
                                                                        </template>
                                                                        Opens in new window
                                                                    </v-tooltip>

                                                                </div>
                                                            </template>
                                                        </v-checkbox>
                                                    </div>
                                                    <div>

                                                    </div>
                                                    <v-btn color="#89C53F" @click="signUp" width="70%" style="color: white;">Register</v-btn>
                                                </v-col>
                                            </v-row>

                                        </div>

                                    </v-form>
                                </v-card>
                                <v-card v-show="registerLayout" elevation="0" color="white" style="margin-top: 50px;">

                                    <v-form ref="form" v-model="valid" class="container">
                                        <v-card-action>
                                            <div class="d-flex">
                                                <v-card-title>
                                                    <h3>Login</h3>
                                                </v-card-title>
                                                <v-spacer></v-spacer>

                                                <v-card-subtitle @click="registerLayout = false" v-show="showBurger">

                                                    <div class="d-flex">
                                                        <p style="color: grey;margin-top: 15px;">Sign Up</p>
                                                        <v-icon>mdi-chevron-right</v-icon>
                                                    </div>
                                                </v-card-subtitle>

                                            </div>
                                        </v-card-action>
                                        <p style="font-size:0.7rem;">Login in back into your account and continue shopping with us.</p>

                                        <v-row class="">

                                            <v-col cols="12" md="12">
                                                <v-text-field @change="checkRegNo()" v-model="registration_number" label="Business Reg No" type="alphanumeric" required />
                                                <div>
                                                    <v-alert v-model="verified_message" dense text type="success">
                                                        Account Exists
                                                    </v-alert>
                                                    <v-alert v-model="verified_message2" dense text type="error">
                                                        Account Does Not Exists
                                                    </v-alert>
                                                </div>
                                            </v-col>

                                            <v-col cols="12" md="12">
                                                <v-text-field v-model="auth.email" label="Email Address" type="email" required />

                                            </v-col>

                                            <v-col cols="12" md="12">
                                                <v-text-field v-model="auth.password" label="Password" type="password" required />
                                            </v-col>
                                            <v-col cols="12" md="12">
                                                <div>
                                                    <div class="container text-center">
                                                        <v-btn color="#89C53F" @click="login" width="100%" style="color: white;">Log in</v-btn>
                                                    </div>
                                                    <div class="text-center">
                                                        Or Login With
                                                    </div>
                                                    <div class="container text-start">
                                                        <div class="d-flex">
                                                            <v-btn x-large outlined style="margin: 2px;" width="30%">
                                                                <v-icon center dark>
                                                                    mdi-google
                                                                </v-icon>
                                                            </v-btn>
                                                            <v-btn x-large outlined style="margin: 2px;" width="30%">
                                                                <v-icon center dark>
                                                                    mdi-apple
                                                                </v-icon>
                                                            </v-btn>
                                                            <v-btn x-large outlined style="margin: 2px;" width="30%">
                                                                <v-icon center dark>
                                                                    mdi-facebook
                                                                </v-icon>
                                                            </v-btn>
                                                        </div>
                                                    </div>
                                                </div>

                                            </v-col>

                                        </v-row>

                                    </v-form>

                                </v-card>
                            </v-card>
                        </div>
                    </div>
                </v-col>

            </v-row>
        </div>
    </div>
    <v-snackbar color="white--text" :timeout="4000" v-model="snackbar" center>
        {{ snackbarText }}
    </v-snackbar>
    <v-snackbar color="red" :timeout="4000" v-model="snackbar2" bottom center>
        {{ snackbarText2 }}
    </v-snackbar>
</v-card>
</template>

<script>
import {
    v4 as uuidv4
} from "uuid";
import axios from "axios";

import logo from "@/assets/logo.png";
import reg from "@/assets/register.svg";

export default {
    data() {
        return {
            verified_message: null,
            verified_message2: null,
            password: null,
            password2: null,
            windowSize: {
                x: window.innerHeight,
                y: window.innerWidth,
            },
            email: "",
            user_uid: null,
            verified: false,
            user_image: "",
            country: "Kenya",
            auth: {
                email: "",
                password: "",
            },
            checkbox: false,
            reg,
            loginLayout: false,
            registerLayout: true,
            showBurger: false,
            logo,
            drawer: false,
            valid: true,
            exists: false,
            existingBusiness: {},
            registration_number: "",
            business_name: "",
            business_type: "",
            industry_category: "",
            description: "",
            contact_full_name: "",
            contact_role: "",
            contact_email: "",
            contact_phone: "",
            delivery_address: "",
            snackbar: false,
            snackbarText: "No error message",
            snackbar2: false,
            showLogin: false,
            snackbarText2: "",
            isValid: false,
            loading: false,

            rules: {
                required: v => !!v || "This field is required",
                email: v => /.+@.+\..+/.test(v) || "Invalid email address",
                phone: v => /^[0-9]{10,15}$/.test(v) || "Phone must be 10–15 digits",
                regNo: v =>
                    /^[A-Za-z0-9\-\/]+$/.test(v) ||
                    "Invalid registration number format"
            }
        };
    },

    methods: {
        checkUser() {
            if (this.$fire.auth.currentUser != null) {
                this.s = true;
            } else {
                this.s = false;
            }
        },
        signUpApple() {
            if (this.registration_number == "") {
                this.snackbar2 = true;
                this.snackbarText2 = "Provide Business registration number";
            } else {
                let that = this;
                const provider = new that.$fireModule.auth.AppleAuthProvider();
                that.$fire.auth
                    .signInWithPopup(provider)
                    .catch((error) => {
                        console.log(error);
                        that.snackbar2 = true;
                        that.snackbarText2 = error;
                    })
                    .then((user) => {
                        that.snackbar = true;
                        that.snackbarText = "Sign up success";
                        that.showauth = true;
                        that.showLogin = true;
                        that.auth_state = true;
                        //that.$router.push(`/estate/${that.estate_id}`);
                    });
            }
        },
        signUpGoogle() {
            if (this.select == null) {
                this.snackbar2 = true;
                this.snackbarText2 = "Provide your estate";
            } else {
                let that = this;
                const provider = new that.$fireModule.auth.GoogleAuthProvider();
                that.$fire.auth
                    .signInWithPopup(provider)
                    .catch((error) => {
                        console.log(error);
                        that.snackbar2 = true;
                        that.snackbarText2 = error;
                    })
                    .then((user) => {
                        that.snackbar = true;
                        that.snackbarText = "Sign up success";
                        that.showauth = true;
                        that.showLogin = true;
                        that.auth_state = true;
                        //that.$router.push(`/estate/${that.estate_id}`);
                    });
            }
        },
        login() {
            if (this.registration_number == '') {
                this.snackbar2 = true;
                this.snackbarText2 = "Provide your registration number";
            } else if (this.exists == false) {
                this.snackbar2 = true;
                this.snackbarText2 = "Your account does not exist ";
            } else {
                let that = this;
                that.progress_bar = true;
                const mAuth = this.$fire.auth;
                mAuth
                    .signInWithEmailAndPassword(that.auth.email, that.auth.password)
                    .catch(function (error) {
                        that.snackbarText = error.message;
                        that.snackbar = true;
                        that.progress_bar = false;
                    })
                    .then((user) => {
                        that.progress_bar = false;
                        //we are signed in
                        that.$router.push(`/bulk`);
                    });
            }
        },
        signUp() {

            if (this.registration_number == '' || this.business_name == '' || this.user_uid == '' ||
                this.business_type == "" || this.industry_category == '' || this.description == '' || this.contact_full_name == '' ||
                this.contact_role == "" || this.contact_email == '' || this.contact_phone == '' || this.delivery_address == ''
            ) {
                this.snackbar2 = true;
                this.snackbarText2 = "Provide any missing field";
            } else if (this.password == "") {
                this.snackbar2 = true;
                this.snackbarText2 = "Provide password";
            } else if (this.password2 != this.password) {
                this.snackbar2 = true;
                this.snackbarText2 = "Password do not match";
            } else {
                const mAuth = this.$fire.auth;
                this.progress_bar2 = true;
                // if (this.password === this.registrationPassword) {
                mAuth
                    .createUserWithEmailAndPassword(this.contact_email, this.password)
                    .catch((error) => {
                        this.snackbar2 = true;
                        this.snackbarText2 = error.message;
                        this.progress_bar2 = false;
                    })
                    .then((user) => {
                        console.log("User", user.user.uid)
                        this.user_uid = user.user.uid;
                        this.submit();
                        // this.$router.push("/905/admin");
                    });
            }
        },
        onResize() {
            this.windowSize = {
                x: window.innerWidth,
                y: window.innerHeight,
            };
            console.log("size", this.windowSize.x);
            if (this.windowSize.x < 950) {
                this.showBurger = true;
            } else {
                this.showBurger = false;
            }
            return this.windowSize;
        },
        async scrollToSection1(val) {
            this.$router.push({
                path: `/${val}`,
            });
        },
        async checkRegNo() {
            this.verified_message = null;
            this.verified_message2 = null;
            if (!this.registration_number) return;

            const res = await axios.get(
                `https://swisslifeserver-production.up.railway.app/api/business/check/reg?regno=${this.registration_number}`
            );

            this.exists = res.data.exists;
            this.existingBusiness = res.data.business || {};

            if (res.data.exists == true) {
                this.verified_message = "Account Exists"
                this.snackbar = true;
                this.snackbarText = this.verified_message;
            } else if (res.data.exists == false) {
                this.verified_message2 = "Account Does Not Exists"
                this.snackbar2 = true;
                this.snackbarText2 = this.verified_message2;
            }
            console.log(res)

        },

        async submit() {
            if (!this.$refs.form.validate()) {
                return;
            }
            if (this.exists) {
                alert("Business already registered.");
                return;
            }

            await axios.post("https://swisslifeserver-production.up.railway.app/api/business/register", {
                uid: this.user_uid,
                registration_number: this.registration_number,
                business_name: this.business_name,
                business_uid: this.user_uid,
                business_type: this.business_type,
                industry_category: this.industry_category,
                description: this.description,
                contact_full_name: this.contact_full_name,
                contact_role: this.contact_role,
                contact_email: this.contact_email,
                contact_phone: this.contact_phone,
                delivery_address: this.delivery_address,
                country: this.country
            });
            this.$router.push(`/bulk`);
            alert("Business registered successfully!");
            //  this.$router.push("/dashboard");
        }
    }
};
</script>

<style scoped>
.box {
    background-color: rgb(255 255 255 / 30%);
    backdrop-filter: blur(5px);
    height: 100vh;
}

.parallax_about {
    /* Background image carousel/2.jpg */
    background-image: url('~/assets/carousel/2.jpg');
    background-attachment: fixed;
    background-position: center;
    width: 100%;
    background-repeat: no-repeat;
    background-size: cover;
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
</style>
