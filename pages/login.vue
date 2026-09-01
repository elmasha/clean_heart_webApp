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
              {{ isLogin ? 'Sign in to your account' : 'Create your account' }}
            </p>
          </div>

          <!-- Login/Register Card -->
          <div style="border: 1px solid #f0f0f0; padding: 32px; background: #fff;">
            <!-- Email/Password Form -->
            <div v-if="loginMethod === 'email'">
              <!-- Full Name - Only for Registration -->
              <v-text-field
                v-if="!isLogin"
                v-model="fullName"
                label="Full Name"
                outlined
                dense
                hide-details
                class="mb-4"
                style="border-radius: 0;"
                prepend-inner-icon="mdi-account-outline"
                required
              />

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
                @keyup.enter="handleSubmit"
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
                @keyup.enter="handleSubmit"
              />

              <!-- Confirm Password - Only for Registration -->
              <v-text-field
                v-if="!isLogin"
                v-model="confirmPassword"
                label="Confirm Password"
                outlined
                dense
                hide-details
                class="mb-4"
                style="border-radius: 0;"
                :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-check-outline"
                @keyup.enter="handleSubmit"
              />

              <!-- Forgot Password - Only for Login -->
              <div v-if="isLogin" class="d-flex justify-end mb-6">
                <nuxt-link to="/forgot-password" style="font-size: 0.75rem; color: #E53935; text-decoration: none;">
                  Forgot password?
                </nuxt-link>
              </div>

              <!-- Phone Number - Only for Registration -->
              <v-text-field
                v-if="!isLogin"
                v-model="phone"
                label="Phone Number (Optional)"
                outlined
                dense
                hide-details
                class="mb-4"
                style="border-radius: 0;"
                placeholder="+254 7XX XXX XXX"
                prepend-inner-icon="mdi-phone-outline"
              />

              <v-btn
                block
                color="black"
                dark
                height="48"
                style="border-radius: 0; text-transform: uppercase; letter-spacing: 2px; font-size: 0.75rem; font-weight: 600;"
                :loading="loading"
                @click="handleSubmit"
              >
                {{ isLogin ? 'Sign In' : 'Create Account' }}
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
                  Verify & {{ isLogin ? 'Sign In' : 'Register' }}
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
              {{ isLogin ? 'Continue with Google' : 'Sign up with Google' }}
            </v-btn>

            <!-- Toggle Login Method -->
            <div class="text-center mt-4">
              <v-btn text small color="#666" style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px;" @click="toggleLoginMethod">
                {{ loginMethod === 'email' ? 'Use phone number instead' : 'Use email instead' }}
              </v-btn>
            </div>
          </div>

          <!-- Toggle Login/Register -->
          <div class="text-center mt-6">
            <span style="font-size: 0.85rem; color: #666;">
              {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
            </span>
            <v-btn text small style="font-size: 0.85rem; color: #E53935; font-weight: 600; text-decoration: none; text-transform: none;" @click="toggleAuthMode">
              {{ isLogin ? 'Create one' : 'Sign in' }}
            </v-btn>
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
      isLogin: true,
      loginMethod: 'email',
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      phone: '',
      showPassword: false,
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

    // Check if we should show registration
    const mode = this.$route.query.mode
    if (mode === 'register') {
      this.isLogin = false
    }

    // If already logged in, redirect
    if (this.$store.getters.isAuthenticated) {
      this.$router.push(this.redirect)
    }
  },
  methods: {
    async handleSubmit() {
      if (this.isLogin) {
        await this.loginWithEmail()
      } else {
        await this.registerWithEmail()
      }
    },

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

    async registerWithEmail() {
      if (!this.email || !this.password || !this.fullName) {
        this.showSnackbar('Please fill in all required fields', 'error')
        return
      }

      if (this.password !== this.confirmPassword) {
        this.showSnackbar('Passwords do not match', 'error')
        return
      }

      if (this.password.length < 6) {
        this.showSnackbar('Password must be at least 6 characters', 'error')
        return
      }

      this.loading = true
      try {
        // Create user with email and password
        const userCredential = await this.$fire.auth.createUserWithEmailAndPassword(this.email, this.password)
        const user = userCredential.user

        // Update profile with display name
        await user.updateProfile({
          displayName: this.fullName
        })

        // Reload user to get updated profile
        await user.reload()

        // Sync user with database
        await this.syncUserToDatabase(user)

        this.showSnackbar('Account created successfully! Welcome to Clean Heart.', '#E53935')

        // Redirect
        this.$router.push(this.redirect)
      } catch (error) {
        console.error('Registration error:', error)
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

    async syncUserToDatabase(user) {
      try {
        const userData = {
          firebaseUid: user.uid,
          email: user.email,
          displayName: user.displayName || this.fullName,
          phone: this.phone || user.phoneNumber || null,
          photoURL: user.photoURL
        }

        const { data } = await this.$axios.post('/api/users/sync', userData)
        if (data.success) {
          console.log('User synced to database:', data.data)
          return data.data
        }
        return null
      } catch (error) {
        console.error('Sync user error:', error)
        return null
      }
    },

    async handleLoginSuccess(user) {
      try {
        // Sync user with database
        const dbUser = await this.syncUserToDatabase(user)

        // Prepare user data for store
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || this.fullName,
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber || this.phone,
          dbUser: dbUser // Store full user data from database
        }

        // Set user in store
        await this.$store.dispatch('setAuthUser', userData)

        // Fetch cart
        await this.$store.dispatch('fetchCart', user.uid)

        this.showSnackbar(`Welcome${user.displayName ? ', ' + user.displayName : ''}!`, '#E53935')

        // Redirect
        this.$router.push(this.redirect)
      } catch (error) {
        console.error('Login handler error:', error)
        this.showSnackbar('Failed to complete login. Please try again.', 'error')
      }
    },

    async sendOTP() {
      if (!this.phone) {
        this.showSnackbar('Please enter phone number', 'error')
        return
      }

      this.loading = true
      try {
        if (!document.getElementById('recaptcha-container')) {
          const container = document.createElement('div')
          container.id = 'recaptcha-container'
          document.body.appendChild(container)
        }

        const appVerifier = new this.$fireModule.auth.RecaptchaVerifier('recaptcha-container', {
          size: 'invisible',
          callback: () => {}
        })

        const confirmationResult = await this.$fire.auth.signInWithPhoneNumber(this.phone, appVerifier)
        this.confirmationResult = confirmationResult
        this.otpSent = true
        this.showSnackbar('OTP sent to your phone', '#E53935')
      } catch (error) {
        console.error('OTP send error:', error)
        this.showSnackbar(error.message || 'Failed to send OTP. Please try again.', 'error')
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
        
        // After phone verification, handle the user
        // For registration, you might want to collect email separately
        if (this.isLogin) {
          await this.handleLoginSuccess(result.user)
        } else {
          // For registration via phone, you'd typically collect email first
          // For now, we'll treat it as login
          await this.handleLoginSuccess(result.user)
        }
        
        this.otp = ''
        this.otpSent = false
      } catch (error) {
        console.error('OTP verify error:', error)
        this.showSnackbar(error.message || 'Invalid OTP. Please try again.', 'error')
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

    toggleLoginMethod() {
      this.loginMethod = this.loginMethod === 'email' ? 'phone' : 'email'
      this.otpSent = false
      this.otp = ''
      this.confirmationResult = null
      this.resetRecaptcha()
    },

    toggleAuthMode() {
      this.isLogin = !this.isLogin
      this.resetForm()
    },

    resetForm() {
      this.password = ''
      this.confirmPassword = ''
      this.otp = ''
      this.otpSent = false
      this.confirmationResult = null
    },

    resetRecaptcha() {
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
        // Login errors
        'auth/invalid-email': 'Invalid email address',
        'auth/user-disabled': 'This account has been disabled',
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/invalid-credential': 'Invalid email or password',
        'auth/too-many-requests': 'Too many attempts. Please try again later',
        
        // Registration errors
        'auth/email-already-in-use': 'This email is already registered',
        'auth/weak-password': 'Password is too weak. Use at least 6 characters',
        'auth/operation-not-allowed': 'Email/password accounts are not enabled',
        
        // Social login errors
        'auth/popup-closed-by-user': 'Sign-in popup was closed',
        'auth/cancelled-popup-request': 'Sign-in was cancelled',
        'auth/account-exists-with-different-credential': 'An account already exists with this email. Please sign in using a different method.',
        
        // Phone errors
        'auth/invalid-phone-number': 'Invalid phone number. Please use format: +254XXXXXXXXX',
        'auth/missing-phone-number': 'Please enter a phone number',
        'auth/invalid-verification-code': 'Invalid verification code',
        'auth/captcha-check-failed': 'reCAPTCHA verification failed. Please try again.',
      }
      return messages[code] || 'Authentication failed. Please try again.'
    }
  },
  head() {
    return { 
      title: this.isLogin ? 'Sign In | Clean Heart' : 'Sign Up | Clean Heart'
    }
  }
}
</script>

<style scoped>
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