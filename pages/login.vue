<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      isLogin: true,
      loginMethod: 'email',
      emailPanelOpen: 0, // 🚨 NEW: Keeps the email panel open by default
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
        const userCredential = await this.$fire.auth.createUserWithEmailAndPassword(this.email, this.password)
        const user = userCredential.user

        await user.updateProfile({
          displayName: this.fullName
        })

        await user.reload()

        const dbUser = await this.syncUserToDatabase(user)

        if (!dbUser) {
          throw new Error('Database sync failed. Please try again.')
        }

        this.showSnackbar('Account created successfully! Welcome to Clean Heart.', '#E53935')

        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || this.fullName,
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber || this.phone,
          dbUser: dbUser 
        }

        await this.$store.dispatch('setAuthUser', userData)
        await this.$store.dispatch('fetchCart', user.uid)

        this.$router.push(this.redirect)
      } catch (error) {
        console.error('Registration error:', error)
        this.showSnackbar(error.message || this.getAuthErrorMessage(error.code), 'error')
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
        const resolvedName = user.displayName || this.fullName || 'Anonymous'
        const resolvedPhone = this.phone || user.phoneNumber || null

        const userData = {
          firebaseUid: user.uid,
          email: user.email || null,
          displayName: resolvedName,
          phone: resolvedPhone,
          photoURL: user.photoURL || null,
          provider: user.providerData[0]?.providerId || null,
          fullName: resolvedName 
        }

        const { data } = await this.$axios.post('/api/users/sync', userData)
        
        if (data.success && data.data) {
          console.log('User synced to database successfully:', data.data)
          return data.data
        } else {
          console.error('Sync failed: Server did not return success', data)
          return null
        }
      } catch (error) {
        console.error('Sync user error:', error)
        return null
      }
    },

    async handleLoginSuccess(user) {
      try {
        const dbUser = await this.syncUserToDatabase(user)

        if (!dbUser) {
          throw new Error('Unable to save user data to the server.')
        }

        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || this.fullName,
          photoURL: user.photoURL,
          phoneNumber: user.phoneNumber || this.phone,
          dbUser: dbUser 
        }

        await this.$store.dispatch('setAuthUser', userData)
        await this.$store.dispatch('fetchCart', user.uid)

        this.showSnackbar(`Welcome${user.displayName ? ', ' + user.displayName : ''}!`, '#E53935')

        this.$router.push(this.redirect)
      } catch (error) {
        console.error('Login handler error:', error)
        this.showSnackbar(error.message || 'Failed to complete login. Please try again.', 'error')
        try { await this.$fire.auth.signOut() } catch(e) {}
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
        
        if (this.isLogin) {
          await this.handleLoginSuccess(result.user)
        } else {
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
        'auth/invalid-email': 'Invalid email address',
        'auth/user-disabled': 'This account has been disabled',
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/invalid-credential': 'Invalid email or password',
        'auth/too-many-requests': 'Too many attempts. Please try again later',
        
        'auth/email-already-in-use': 'This email is already registered',
        'auth/weak-password': 'Password is too weak. Use at least 6 characters',
        'auth/operation-not-allowed': 'Email/password accounts are not enabled',
        
        'auth/popup-closed-by-user': 'Sign-in popup was closed',
        'auth/cancelled-popup-request': 'Sign-in was cancelled',
        'auth/account-exists-with-different-credential': 'An account already exists with this email. Please sign in using a different method.',
        
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
.google-btn .v-icon {
  color: #EA4335 !important; /* Forces the red/blue/green Google colors */
}
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