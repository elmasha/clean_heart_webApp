<template>
  <div class="admin-login-wrapper">
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card class="admin-login-card pa-6 pa-md-8" flat>
            <!-- Brand -->
            <div class="text-center mb-6">
              <div class="brand-icon mx-auto mb-3">
                <v-icon color="white" size="32">mdi-heart</v-icon>
              </div>
              <h1 class="admin-title">Admin Login</h1>
              <p class="admin-subtitle">Secure access for administrators only</p>
            </div>

            <!-- Login Form -->
            <v-form @submit.prevent="loginAdmin" ref="loginForm">
              <v-text-field
                v-model="email"
                label="Email Address"
                outlined
                dense
                hide-details
                class="mb-4"
                type="email"
                placeholder="cleanheartt6@gmail.com"
                :error-messages="emailErrors"
                @input="emailErrors = ''"
                prepend-inner-icon="mdi-email"
              />

              <v-text-field
                v-model="password"
                label="Password"
                outlined
                dense
                hide-details
                class="mb-4"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                :error-messages="passwordErrors"
                @input="passwordErrors = ''"
                prepend-inner-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="showPassword = !showPassword"
                @keyup.enter="loginAdmin"
              />

              <!-- Error Message -->
              <v-alert
                v-if="loginError"
                type="error"
                dense
                text
                class="mb-4"
                border="left"
                colored-border
              >
                <div class="d-flex align-center">
                  <v-icon left size="18" color="error">mdi-alert-circle</v-icon>
                  {{ loginError }}
                </div>
              </v-alert>

              <!-- Login Button -->
              <v-btn
                block
                color="#E53935"
                dark
                depressed
                height="52"
                class="login-btn"
                :loading="loading"
                type="submit"
              >
                <v-icon left size="18" v-if="!loading">mdi-login</v-icon>
                {{ loading ? 'Logging in...' : 'Login to Admin' }}
              </v-btn>

              <!-- Back to Store -->
              <div class="text-center mt-4">
                <nuxt-link to="/" class="back-link">
                  <v-icon size="16" class="mr-1">mdi-arrow-left</v-icon>
                  Back to Store
                </nuxt-link>
              </div>

              <!-- Security Badge -->
              <div class="d-flex align-center justify-center mt-4" style="gap: 8px;">
                <v-icon size="16" color="#999">mdi-shield-lock</v-icon>
                <span class="security-text">Secure admin access</span>
              </div>
            </v-form>
          </v-card>

          <!-- Footer -->
          <div class="text-center mt-4">
            <p class="footer-text">
              <v-icon size="14" color="#E53935">mdi-heart</v-icon>
              Clean Heart Admin
            </p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'AdminLogin',
  layout: 'empty',
  auth: false, // 🔥 Disable auth for login page
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      loading: false,
      loginError: '',
      emailErrors: '',
      passwordErrors: '',
    }
  },
  mounted() {
    // 🔥 Check if already logged in as admin
    const user = this.$store.state.authUser
    const ADMIN_EMAILS = ['cleanheartt6@gmail.com']
    
    if (user && ADMIN_EMAILS.includes(user.email)) {
      this.$router.push('/admin')
    }
  },
  methods: {
    validateForm() {
      let valid = true
      
      if (!this.email) {
        this.emailErrors = 'Email is required'
        valid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
        this.emailErrors = 'Please enter a valid email address'
        valid = false
      }
      
      if (!this.password) {
        this.passwordErrors = 'Password is required'
        valid = false
      } else if (this.password.length < 6) {
        this.passwordErrors = 'Password must be at least 6 characters'
        valid = false
      }
      
      return valid
    },

    async loginAdmin() {
      this.loginError = ''
      
      if (!this.validateForm()) {
        return
      }

      this.loading = true

      try {
        const userCredential = await this.$fire.auth.signInWithEmailAndPassword(
          this.email,
          this.password
        )
        
        const user = userCredential.user
        
        // Check if user is admin
        const ADMIN_EMAILS = ['cleanheartt6@gmail.com']
        if (!ADMIN_EMAILS.includes(user.email)) {
          await this.$fire.auth.signOut()
          this.loginError = '🚫 Access Denied. Only authorized administrators can access this page.'
          this.loading = false
          return
        }

        // Set user in store
        await this.$store.dispatch('setAuthUser', {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        })

        // Redirect to admin dashboard
        this.$router.push('/admin')
        
        // Show success message
        this.$nuxt.$emit('show-snackbar', {
          message: '✅ Welcome back, Admin!',
          color: '#E53935'
        })

      } catch (error) {
        console.error('Admin login error:', error)
        
        switch (error.code) {
          case 'auth/user-not-found':
            this.loginError = 'No account found with this email address.'
            break
          case 'auth/wrong-password':
            this.loginError = 'Incorrect password. Please try again.'
            break
          case 'auth/too-many-requests':
            this.loginError = 'Too many failed attempts. Please try again later.'
            break
          case 'auth/invalid-email':
            this.loginError = 'Invalid email address format.'
            break
          default:
            this.loginError = 'Login failed. Please check your credentials and try again.'
        }
      } finally {
        this.loading = false
      }
    }
  },
  head() {
    return {
      title: 'Admin Login | Clean Heart'
    }
  }
}
</script>

<style scoped>
.admin-login-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%);
  display: flex;
  align-items: center;
}

.admin-login-card {
  background: rgba(255, 255, 255, 0.98) !important;
  border-radius: 20px !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5) !important;
}

.brand-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, #E53935, #c62828);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(229, 57, 53, 0.3);
}

.admin-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #0f0f0f;
  letter-spacing: -0.5px;
}

.admin-subtitle {
  font-size: 0.85rem;
  color: #888;
  margin-top: 4px;
}

.login-btn {
  border-radius: 10px !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px !important;
  text-transform: none !important;
  font-size: 0.95rem !important;
  box-shadow: 0 4px 20px rgba(229, 57, 53, 0.35) !important;
}

.login-btn:hover {
  box-shadow: 0 6px 28px rgba(229, 57, 53, 0.5) !important;
}

.back-link {
  color: #888;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s ease;
  display: inline-flex;
  align-items: center;
}

.back-link:hover {
  color: #E53935;
}

.security-text {
  font-size: 0.7rem;
  color: #999;
  font-weight: 500;
}

.footer-text {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 1px;
}

@media (max-width: 599px) {
  .admin-login-card {
    padding: 24px !important;
    border-radius: 16px !important;
  }
  
  .brand-icon {
    width: 52px;
    height: 52px;
  }
  
  .admin-title {
    font-size: 1.3rem;
  }
  
  .admin-subtitle {
    font-size: 0.75rem;
  }
}

@media (min-width: 600px) and (max-width: 959px) {
  .admin-login-card {
    padding: 36px !important;
  }
}
</style>