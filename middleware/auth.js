// middleware/auth.js - Simplified Version
export default function ({ store, app, route, redirect }) {
  const currentUser = app.$fire.auth.currentUser
  
  // Protected routes that require authentication
  const protectedRoutes = ['/account', '/orders', '/checkout', '/wishlist', '/admin']
  
  const isProtected = protectedRoutes.some(path => 
    route.path === path || route.path.startsWith(path + '/')
  )
  
  // If on protected route and not logged in
  if (isProtected && !currentUser) {
    return redirect({
      path: '/login',
      query: { redirect: route.fullPath }
    })
  }
  
  // If on login/register and already logged in
  if ((route.path === '/login' || route.path === '/register') && currentUser) {
    return redirect(route.query.redirect || '/')
  }
  
  // If logged in, ensure store has user
  if (currentUser && !store.state.authUser) {
    store.dispatch('setAuthUser', {
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL,
      phoneNumber: currentUser.phoneNumber
    })
  }
  
  // Fetch cart if logged in and not already fetched
  if (currentUser && !store.state.cartFetched) {
    store.dispatch('fetchCart', currentUser.uid)
    store.commit('SET_CART_FETCHED', true)
  }
}