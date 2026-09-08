// middleware/auth.js
export default function ({ store, app, route, redirect }) {
  // 🔥 Get current user from Firebase
  const currentUser = app.$fire.auth.currentUser
  
  // Protected routes that require authentication
  const protectedRoutes = ['/account', '/orders', '/checkout', '/wishlist', '/admin']
  
  // 🔥 Admin only - Restricted emails
  const ADMIN_EMAILS = ['cleanheartt6@gmail.com']
  
  const isProtected = protectedRoutes.some(path => 
    route.path === path || route.path.startsWith(path + '/')
  )
  
  // 🔥 Check if route is admin route
  const isAdminRoute = route.path === '/admin' || route.path.startsWith('/admin/')
  
  // 🔥 If on admin login page, don't redirect
  if (route.path === '/admin/login') {
    // If already logged in as admin, redirect to admin
    if (currentUser) {
      const userEmail = currentUser.email || store.state.authUser?.email
      if (userEmail && ADMIN_EMAILS.includes(userEmail)) {
        return redirect('/admin')
      }
    }
    // Allow access to admin login page
    return
  }
  
  // 🔥 If on admin route and no user, redirect to admin login
  if (isAdminRoute && !currentUser) {
    return redirect('/admin/login')
  }
  
  // If on other protected route and not logged in
  if (isProtected && !currentUser) {
    return redirect({
      path: '/login',
      query: { redirect: route.fullPath }
    })
  }
  
  // 🔥 If on admin route, check if user is authorized
  if (isAdminRoute && currentUser) {
    const userEmail = currentUser.email || store.state.authUser?.email
    
    if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
      // Sign out the user
      app.$fire.auth.signOut()
      alert('🚫 Access Denied. Admin access restricted to cleanheartt6@gmail.com')
      return redirect('/')
    }
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