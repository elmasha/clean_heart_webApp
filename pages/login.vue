<template>
  <div style="margin-top: 64px; min-height: calc(100vh - 64px); background: #fafafa;">
    <v-container class="py-12">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="5" lg="4">
          <!-- Logo -->
          <div class="text-center mb-8">
            <div
              class="d-flex align-center justify-center mx-auto mb-4"
              style="width: 64px; height: 64px; border-radius: 50%; background: #000;"
            >
              <v-icon color="#E53935" size="32">mdi-heart</v-icon>
            </div>
            <h1 style="font-size: 1.5rem; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; color: #000;">
              CLEAN HEART
            </h1>
            <p style="font-size: 0.85rem; color: #666; margin-top: 8px;">
              Sign in to your account
            </p>
          </div>

          <!-- Login Card -->
          <div style="border: 1px solid #f0f0f0; padding: 32px; background: #fff;">
            <!-- Email/Password Form -->
            <div v-if="loginMethod === 'email'">
              <v-text-field
                v-model="email"
                label="Email"
                outlined
                dense
                hide-details
                class="mb-4"
                style="border-radius: 0;"
                type="email"
                prepend-inner-icon="mdi-email-outline"
                @keyup.enter="loginWithEmail"
              />
              <v-text-field
                v-model="password"
                label="Password"
                outlined
                dense
                hide-details
                class="mb-2"
                style="border-radius: 0;"
                :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline"
                :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="showPassword = !showPassword"
                @keyup.enter="loginWithEmail"
              />
              <div class="d-flex justify-end mb-6">
                <nuxt-link to="/forgot-password" style="font-size: 0.75rem; color: #E53935; text-decoration: none;">
                  Forgot password?
                </nuxt-link>
              </div>
              <v-btn
                block
                color="black"
                dark
                height="48"
                style="border-radius: 0; text-transform: uppercase; letter-spacing: 2px; font-size: 0.75rem; font-weight: 600;"
                :loading="loading"
                @click="loginWithEmail"
              >
                Sign In
              </v-btn>
            </div>

            <!-- Phone OTP Form -->
            <div v-if="loginMethod === 'phone'">
              <v-text-field
                v-model="phone"
                label="Phone Number"
                outlined
                dense
                hide-details
                class="mb-4"
                style="border-radius: 0;"
                placeholder="+254 7XX XXX XXX"
                prepend-inner-icon="mdi-phone-outline"
                @keyup.enter="sendOTP"
              />
              <v-btn
                v-if="!otpSent"
                block
                color="black"
                dark
                height="48"
                style="border-radius: 0; text-transform: uppercase; letter-spacing: 2px; font-size: 0.75rem; font-weight: 600;"
                :loading="loading"
                @click="sendOTP"
              >
                Send Code
              </v-btn>
              <div v-else>
                <v-text-field
                  v-model="otp"
                  label="Enter OTP"
                  outlined
                  dense
                  hide-details
                  class="mb-4"
                  style="border-radius: 0;"
                  maxlength="6"
                  prepend-inner-icon="mdi-numeric"
                  @keyup.enter="verifyOTP"
                />
                <v-btn
                  block
                  color="black"
                  dark
                  height="48"
                  style="border-radius: 0; text-transform: uppercase; letter-spacing: 2px; font-size: 0.75rem; font-weight: 600;"
                  :loading="loading"
                  @click="verifyOTP"
                >
                  Verify & Sign In
                </v-btn>
                <div class="text-center mt-3">
                  <v-btn text small color="#E53935" style="font-size: 0.7rem; text-transform: uppercase;" @click="resendOTP">
                    Resend Code
                  </v-btn>
                </div>
              </div>
            </div>

            <!-- Divider -->
            <div class="d-flex align-center my-6">
              <v-divider />
              <span class="mx-4" style="font-size: 0.7rem; color: #999; text-transform: uppercase; letter-spacing: 1px;">or</span>
              <v-divider />
            </div>

            <!-- Social Login -->
            <v-btn
              block
              outlined
              color="#000"
              height="48"
              class="mb-3"
              style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.7rem; font-weight: 600;"
              :loading="googleLoading"
              @click="loginWithGoogle"
            >
              <v-icon left size="18" color="#E53935">mdi-google</v-icon>
              Continue with Google
            </v-btn>

            <!-- Toggle Login Method -->
            <div class="text-center mt-4">
              <v-btn text small color="#666" style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px;" @click="toggleLoginMethod">
                {{ loginMethod === 'email' ? 'Use phone number instead' : 'Use email instead' }}
              </v-btn>
            </div>
          </div>

          <!-- Sign Up Link -->
          <div class="text-center mt-6">
            <span style="font-size: 0.85rem; color: #666;">Don't have an account? </span>
            <nuxt-link to="/register" style="font-size: 0.85rem; color: #E53935; font-weight: 600; text-decoration: none;">
              Create one
            </nuxt-link>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Hidden reCAPTCHA container for phone auth -->
    <div id="recaptcha-container"></div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      loginMethod: 'email',
      email: '',
      password: '',
      showPassword: false,
      phone: '',
      otp: '',
      otpSent: false,
      loading: false,
      googleLoading: false,
      redirect: '/',
      confirmationResult: null,
    }
  },
  mounted() {
    // Get redirect URL from query params
    const redirect = this.$route.query.redirect
    if (redirect) {
      this.redirect = redirect
    }

    // If already logged in, redirect
    if (this.$store.getters.isAuthenticated) {
      this.$router.push(this.redirect)
    }
  },
  methods: {
    async loginWithEmail() {
      if (!this.email || !this.password) {
        this.showSnackbar('Please enter email and password', 'error')
        return
      }

      this.loading = true
      try {
        const userCredential = await this.$fire.auth.signInWithEmailAndPassword(this.email, this.password)
        await this.handleLoginSuccess(userCredential.user)
      } catch (error) {
        console.error('Login error:', error)
        this.showSnackbar(this.getAuthErrorMessage(error.code), 'error')
      } finally {
        this.loading = false
      }
    },

    async loginWithGoogle() {
      this.googleLoading = true
      try {
        const provider = new this.$fireModule.auth.GoogleAuthProvider()
        const result = await this.$fire.auth.signInWithPopup(provider)
        await this.handleLoginSuccess(result.user)
      } catch (error) {
        console.error('Google login error:', error)
        this.showSnackbar(this.getAuthErrorMessage(error.code), 'error')
      } finally {
        this.googleLoading = false
      }
    },

    async sendOTP() {
      if (!this.phone) {
        this.showSnackbar('Please enter phone number', 'error')
        return
      }

      this.loading = true
      try {
        // Make sure recaptcha container exists
        if (!document.getElementById('recaptcha-container')) {
          const container = document.createElement('div')
          container.id = 'recaptcha-container'
          document.body.appendChild(container)
        }

        const appVerifier = new this.$fireModule.auth.RecaptchaVerifier('recaptcha-container', {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved - allow sending OTP
          }
        })

        const confirmationResult = await this.$fire.auth.signInWithPhoneNumber(this.phone, appVerifier)
        this.confirmationResult = confirmationResult
        this.otpSent = true
        this.showSnackbar('OTP sent to your phone', '#E53935')
      } catch (error) {
        console.error('OTP send error:', error)
        this.showSnackbar(error.message || 'Failed to send OTP. Please try again.', 'error')
        // Reset reCAPTCHA if needed
        this.resetRecaptcha()
      } finally {
        this.loading = false
      }
    },

    async verifyOTP() {
      if (!this.otp) {
        this.showSnackbar('Please enter OTP', 'error')
        return
      }

      if (!this.confirmationResult) {
        this.showSnackbar('Please request a new OTP', 'error')
        return
      }

      this.loading = true
      try {
        const result = await this.confirmationResult.confirm(this.otp)
        await this.handleLoginSuccess(result.user)
        this.otp = ''
        this.otpSent = false
      } catch (error) {
        console.error('OTP verify error:', error)
        this.showSnackbar(error.message || 'Invalid OTP. Please try again.', 'error')
        // Reset confirmation result on error
        this.confirmationResult = null
      } finally {
        this.loading = false
      }
    },

    async resendOTP() {
      this.otpSent = false
      this.otp = ''
      await this.sendOTP()
    },

    async handleLoginSuccess(user) {
      // Get user data from your backend or use Firebase data
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber,
      }

      // Set user in store
      await this.$store.dispatch('setAuthUser', userData)

      // Fetch cart
      await this.$store.dispatch('fetchCart', user.uid)

      this.showSnackbar(`Welcome${user.displayName ? ', ' + user.displayName : ''}!`, '#E53935')

      // Redirect
      this.$router.push(this.redirect)
    },

    toggleLoginMethod() {
      this.loginMethod = this.loginMethod === 'email' ? 'phone' : 'email'
      this.otpSent = false
      this.otp = ''
      this.confirmationResult = null
      this.resetRecaptcha()
    },

    resetRecaptcha() {
      // Clean up reCAPTCHA container
      const container = document.getElementById('recaptcha-container')
      if (container) {
        container.innerHTML = ''
      }
    },

    showSnackbar(message, color = 'black') {
      this.$nuxt.$emit('show-snackbar', { message, color })
    },

    getAuthErrorMessage(code) {
      const messages = {
        'auth/invalid-email': 'Invalid email address',
        'auth/user-disabled': 'This account has been disabled',
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/invalid-credential': 'Invalid email or password',
        'auth/too-many-requests': 'Too many attempts. Please try again later',
        'auth/popup-closed-by-user': 'Sign-in popup was closed',
        'auth/cancelled-popup-request': 'Sign-in was cancelled',
        'auth/invalid-phone-number': 'Invalid phone number. Please use format: +254XXXXXXXXX',
        'auth/missing-phone-number': 'Please enter a phone number',
        'auth/invalid-verification-code': 'Invalid verification code',
        'auth/captcha-check-failed': 'reCAPTCHA verification failed. Please try again.',
        'auth/account-exists-with-different-credential': 'An account already exists with this email. Please sign in using a different method.',
        'auth/email-already-in-use': 'This email is already in use',
      }
      return messages[code] || 'Authentication failed. Please try again.'
    }
  },
  head() {
    return { title: 'Sign In | Clean Heart' }
  }
}
</script>

<style scoped>
/* Reset recaptcha container styles */
#recaptcha-container {
  position: absolute;
  bottom: 0;
  left: 0;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
  overflow: hidden;
}
</style>