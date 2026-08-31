export const state = () => ({
  products: [],
  categories: [],
  cart: [],
  cartCount: 0,
  cartTotal: 0,
  orders: [],
  adminOrders: [],
  loading: false,
  error: null,
  user: null,
  authUser: null,
})

export const getters = {
  isAuthenticated: (state) => !!state.authUser,
  getProductById: (state) => (id) => {
    return state.products.find(p => p.id === parseInt(id))
  },
  getProductsByCategory: (state) => (category) => {
    if (!category || category === 'all' || category === 'All') return state.products
    return state.products.filter(p =>
      p.category?.toLowerCase() === category.toLowerCase() ||
      p.category_name?.toLowerCase() === category.toLowerCase()
    )
  },
  getNewArrivals: (state) => {
    return state.products.filter(p => p.is_new === true).slice(0, 8)
  },
  getBestSellers: (state) => {
    return state.products
      .filter(p => p.is_best_seller === true || p.is_bestseller === true)
      .slice(0, 8)
  },
  getCartItems: (state) => state.cart,
  getCartCount: (state) => state.cartCount,
  getCartTotal: (state) => state.cartTotal,
}

export const mutations = {
  SET_PRODUCTS(state, products) {
    state.products = products
  },
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  SET_CART(state, cartData) {
    // Handle both formats: { items: [], itemCount: 0, subtotal: 0 } or direct array
    if (cartData && typeof cartData === 'object') {
      if (cartData.items) {
        state.cart = cartData.items || []
        state.cartCount = cartData.totalQuantity || cartData.itemCount || 0
        state.cartTotal = cartData.subtotal || 0
      } else {
        state.cart = cartData
        state.cartCount = cartData.reduce((sum, item) => sum + item.quantity, 0)
        state.cartTotal = cartData.reduce((sum, item) => sum + (item.lineTotal || 0), 0)
      }
    }
  },
  SET_ORDERS(state, orders) {
    state.orders = orders
  },
  SET_ADMIN_ORDERS(state, orders) {
    state.adminOrders = orders
  },
  SET_LOADING(state, status) {
    state.loading = status
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  SET_USER(state, user) {
    state.user = user
  },
  SET_AUTH_USER(state, user) {
    state.authUser = user
  },
  ADD_TO_CART(state, item) {
    const existing = state.cart.find(i =>
      i.product_id === item.product_id && i.variant === item.variant
    )
    if (existing) {
      existing.qty += item.qty
    } else {
      state.cart.push(item)
    }
    state.cartCount += item.qty
  },
  REMOVE_FROM_CART(state, { productId, variant }) {
    const idx = state.cart.findIndex(i =>
      i.product_id === productId && i.variant === variant
    )
    if (idx > -1) {
      state.cartCount -= state.cart[idx].qty
      state.cart.splice(idx, 1)
    }
  },
  CLEAR_CART(state) {
    state.cart = []
    state.cartCount = 0
    state.cartTotal = 0
  },
}

export const actions = {
  // ========== PRODUCTS ==========
  async fetchProducts({ commit }) {
    commit('SET_LOADING', true)
    try {
      const { data } = await this.$axios.get('/api/products')
      if (data.success) {
        commit('SET_PRODUCTS', data.data || [])
      } else {
        commit('SET_PRODUCTS', data || [])
      }
      commit('SET_ERROR', null)
    } catch (err) {
      commit('SET_ERROR', err.response?.data?.error || 'Failed to load products')
      console.error('fetchProducts error:', err)
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchProduct({ commit }, id) {
    commit('SET_LOADING', true)
    try {
      const { data } = await this.$axios.get(`/api/products/${id}`)
      commit('SET_ERROR', null)
      return data.data || data
    } catch (err) {
      commit('SET_ERROR', err.response?.data?.error || 'Failed to load product')
      console.error('fetchProduct error:', err)
      return null
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // ========== CATEGORIES ==========
  async fetchCategories({ commit }) {
    try {
      const { data } = await this.$axios.get('/api/categories')
      if (data.success) {
        commit('SET_CATEGORIES', data.data || [])
      } else {
        commit('SET_CATEGORIES', data || [])
      }
    } catch (err) {
      console.error('fetchCategories error:', err)
    }
  },

  // ========== CART ==========
  async fetchCart({ commit }, firebaseUid) {
    if (!firebaseUid) {
      console.warn('fetchCart: No firebaseUid provided')
      return
    }
    try {
      const { data } = await this.$axios.get(`/api/cart?firebaseUid=${firebaseUid}`)
      if (data.success) {
        commit('SET_CART', data.data)
      } else {
        console.error('fetchCart failed:', data.error)
      }
    } catch (err) {
      console.error('fetchCart error:', err)
    }
  },

  async addToCart({ commit, dispatch }, { firebaseUid, productId, qty, variant }) {
    if (!firebaseUid) {
      return { success: false, error: 'User not authenticated' }
    }

    try {
      // First find the variant ID for this product and variant
      let variantId = null
      let product = await dispatch('fetchProduct', productId)
      
      // If product not in store, try to get it
      if (!product) {
        const { data } = await this.$axios.get(`/api/products/${productId}`)
        product = data.data || data
      }

      if (product && product.variants && product.variants.all) {
        // Find the variant matching selected size and color
        const matchingVariant = product.variants.all.find(v => 
          v.size === variant.split('/')[1]?.trim() && 
          v.color === variant.split('/')[0]?.trim()
        )
        if (matchingVariant) {
          variantId = matchingVariant.id
        }
      }

      // If we couldn't find the variant, use a fallback
      if (!variantId) {
        // Try to get first variant
        const { data } = await this.$axios.get(`/api/products/${productId}`)
        const productData = data.data || data
        if (productData && productData.variants && productData.variants.all && productData.variants.all.length > 0) {
          variantId = productData.variants.all[0].id
        } else {
          return { success: false, error: 'No variants available for this product' }
        }
      }

      const { data } = await this.$axios.post('/api/cart', {
        firebaseUid,
        variantId,
        quantity: qty
      })

      if (data.success) {
        // Refresh cart
        await dispatch('fetchCart', firebaseUid)
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Failed to add to cart' }
      }
    } catch (err) {
      console.error('addToCart error:', err)
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to add to cart' 
      }
    }
  },

  async updateCartQty({ dispatch }, { firebaseUid, variantId, qty }) {
    if (!firebaseUid || !variantId) {
      return { success: false, error: 'Missing required fields' }
    }

    try {
      const { data } = await this.$axios.put(`/api/cart/${variantId}`, {
        firebaseUid,
        quantity: qty
      })

      if (data.success) {
        await dispatch('fetchCart', firebaseUid)
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Failed to update quantity' }
      }
    } catch (err) {
      console.error('updateCartQty error:', err)
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to update quantity' 
      }
    }
  },

  async removeFromCart({ dispatch }, { firebaseUid, variantId }) {
    if (!firebaseUid || !variantId) {
      return { success: false, error: 'Missing required fields' }
    }

    try {
      const { data } = await this.$axios.delete(`/api/cart/${variantId}`, {
        data: { firebaseUid }
      })

      if (data.success) {
        await dispatch('fetchCart', firebaseUid)
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Failed to remove item' }
      }
    } catch (err) {
      console.error('removeFromCart error:', err)
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to remove item' 
      }
    }
  },

  async clearCart({ commit, dispatch }, firebaseUid) {
    if (!firebaseUid) {
      return { success: false, error: 'User not authenticated' }
    }

    try {
      const { data } = await this.$axios.delete('/api/cart', {
        data: { firebaseUid }
      })

      if (data.success) {
        commit('CLEAR_CART')
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Failed to clear cart' }
      }
    } catch (err) {
      console.error('clearCart error:', err)
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to clear cart' 
      }
    }
  },

  // ========== ORDERS ==========
  async createOrder({ commit, dispatch }, orderData) {
    try {
      const { data } = await this.$axios.post('/api/orders', orderData)
      if (data.success) {
        commit('CLEAR_CART')
        return { success: true, data: data.data }
      } else {
        return { success: false, error: data.error || 'Failed to create order' }
      }
    } catch (err) {
      console.error('createOrder error:', err)
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to create order' 
      }
    }
  },

  async fetchOrders({ commit }, firebaseUid) {
    if (!firebaseUid) return

    try {
      const { data } = await this.$axios.get(`/api/orders?firebaseUid=${firebaseUid}`)
      if (data.success) {
        commit('SET_ORDERS', data.data || [])
      }
    } catch (err) {
      console.error('fetchOrders error:', err)
    }
  },

  async fetchOrderById({ commit }, { firebaseUid, orderId }) {
    try {
      const { data } = await this.$axios.get(`/api/orders/${orderId}?firebaseUid=${firebaseUid}`)
      return data.data || data
    } catch (err) {
      console.error('fetchOrderById error:', err)
      return null
    }
  },

  // ========== ADMIN ==========
  async fetchAdminOrders({ commit }) {
    try {
      const { data } = await this.$axios.get('/api/admin/orders')
      if (data.success) {
        commit('SET_ADMIN_ORDERS', data.data || [])
      }
    } catch (err) {
      console.error('fetchAdminOrders error:', err)
    }
  },

  async updateOrderStatus({ dispatch }, { orderId, status }) {
    try {
      const { data } = await this.$axios.put(`/api/admin/orders/${orderId}/status`, { status })
      if (data.success) {
        await dispatch('fetchAdminOrders')
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (err) {
      console.error('updateOrderStatus error:', err)
      return { success: false }
    }
  },

  // ========== AUTH ==========
  setAuthUser({ commit, dispatch }, user) {
    commit('SET_AUTH_USER', user)
    if (user && user.uid) {
      dispatch('fetchCart', user.uid)
    }
  },

  logout({ commit }) {
    commit('SET_AUTH_USER', null)
    commit('CLEAR_CART')
  },
}