<template>
  <div>
    <!-- HERO SECTION - Full-width background image with right product card -->
    <section style="margin-top: 4px; min-height: 85vh; background: #1a1a1a; position: relative; overflow: hidden;">
      <!-- Decorative background (CSS only, no image) -->
      <div class="hero-decor" style="position: absolute; inset: 0; background: radial-gradient(ellipse at 18% 30%, rgba(229,57,53,0.10) 0%, transparent 55%), #ffffff; overflow: hidden;">
        <!-- Giant outlined typographic watermark -->
        <div class="hero-watermark" aria-hidden="true">CLEAN HEART</div>
        <!-- Diagonal red accent panel on the right (behind product card) -->
        <div class="hero-accent" aria-hidden="true" />
      </div>

      <v-container fluid class="pa-0 fill-height">
        <v-row no-gutters align="center" style="min-height: 85vh; position: relative; z-index: 1;">
          <!-- Left Content -->
          <v-col cols="12" md="7" class="pa-8 pa-md-12">
            <div class="mb-4" style="font-size: 0.7rem; color: rgba(0,0,0,0.55); letter-spacing: 3px; text-transform: uppercase;">
              STREETWEAR CLOTHING / CLEAN HEART
            </div>

            <h1 style="font-size: clamp(3.5rem, 8vw, 7rem); font-weight: 900; line-height: 0.9; text-transform: uppercase; letter-spacing: -3px; color: #000; margin-bottom: 20px;">
              CLEAN<br />
              <span style="color: #E53935;">HEART</span>
            </h1>

            <div style="font-size: 1rem; font-weight: 600; color: #000; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 16px;">
              WEAR YOUR HEART.
            </div>

            <p style="font-size: 0.9rem; color: rgba(0,0,0,0.6); line-height: 1.8; max-width: 400px; margin-bottom: 40px;">
              Premium streetwear made to wear your heart.<br />
              More than clothing — it's a movement.
            </p>

            <!-- Action Buttons -->
            <div class="d-flex align-center flex-wrap" style="gap: 16px;">
              <v-btn
                color="#E53935"
                dark
                height="52"
                class="px-8"
                style="border-radius: 0; text-transform: uppercase; letter-spacing: 2px; font-size: 0.75rem; font-weight: 600;"
                @click="scrollToProducts"
              >
                SHOP COLLECTION
                <v-icon right size="16">mdi-arrow-right</v-icon>
              </v-btn>
              <v-btn
                outlined
                color="black"
                height="52"
                class="px-6"
                style="border-radius: 0; text-transform: uppercase; letter-spacing: 2px; font-size: 0.75rem; font-weight: 600; border: 2px solid #000;"
                to="/donate"
              >
                <v-icon left size="16" color="#E53935">mdi-heart</v-icon>
                DONATE
              </v-btn>
            </div>
          </v-col>

          <!-- Right Product Carousel Card -->
          <v-col cols="12" md="5" class="pa-4 pa-md-8 d-none d-md-block">
            <div style="background: white; padding: 24px; max-width: 420px; margin-left: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
              <!-- Product Image -->
              <div style="background: #f8f8f8; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; position: relative; overflow: hidden;">
                <v-img
                  :src="featuredProduct?.image_url || featuredProduct?.image || '/placeholder-product.jpg'"
                  contain
                  style="width: 100%; height: 100%;"
                >
                  <template #placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-icon size="80" color="grey lighten-1">mdi-tshirt-crew-outline</v-icon>
                    </div>
                  </template>
                </v-img>
              </div>

              <!-- Thumbnail Strip -->
              <div class="d-flex mb-4" style="gap: 8px; overflow-x: auto;">
                <div
                  v-for="(product, index) in carouselProducts.slice(0, 5)"
                  :key="'thumb-' + product.id"
                  style="width: 60px; height: 60px; background: #f0f0f0; cursor: pointer; flex-shrink: 0; border: 2px solid transparent; transition: all 0.3s;"
                  :style="{ borderColor: currentSlide === index ? '#E53935' : 'transparent' }"
                  @click="currentSlide = index"
                >
                  <v-img
                    :src="product.image_url || product.image || '/placeholder-product.jpg'"
                    contain
                    style="width: 100%; height: 100%;"
                  />
                </div>
              </div>

              <!-- Product Info -->
              <div style="font-size: 0.9rem; font-weight: 600; color: #000; margin-bottom: 4px;">
                {{ featuredProduct?.name || 'Classic Heavyweight Hoodie' }}
              </div>
              <div style="font-size: 1rem; font-weight: 700; color: #E53935; margin-bottom: 16px;">
                Ksh {{ parseFloat(featuredProduct?.price || 4000).toFixed(2) }}
              </div>

              <!-- Shop Now Button -->
              <v-btn
                block
                color="black"
                dark
                height="44"
                style="border-radius: 0; text-transform: uppercase; letter-spacing: 2px; font-size: 0.7rem; font-weight: 600;"
                :to="featuredProduct ? `/product/${featuredProduct.id}` : '/shop'"
              >
                SHOP NOW
              </v-btn>

              <!-- Carousel Navigation -->
              <div class="d-flex align-center justify-space-between mt-4">
                <v-btn icon small @click="prevSlide">
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <div style="font-size: 0.8rem; color: #666; font-weight: 600;">
                  {{ String(currentSlide + 1).padStart(2, '0') }} / {{ String(carouselProducts.length).padStart(2, '0') }}
                </div>
                <v-btn icon small @click="nextSlide">
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- CATEGORY STRIP -->
    <section style="background: white; padding: 40px 0; border-bottom: 1px solid #f0f0f0;">
      <v-container>
        <v-row align="center" justify="space-between" class="text-center">
          <v-col
            v-for="cat in categories"
            :key="cat"
            cols="6"
            md="3"
            class="d-flex align-center justify-center"
            style="cursor: pointer; gap: 12px;"
            @click="$router.push(`/shop?category=${cat.toLowerCase()}`)"
          >
            <v-icon size="32" color="#000">mdi-tshirt-crew-outline</v-icon>
            <span style="font-size: 0.8rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #000;">
              {{ cat }}
            </span>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- CATEGORY BANNERS -->
    <section style="background: #0a0a0a;">
      <v-container fluid class="pa-0">
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <nuxt-link :to="newArrivalProduct ? `/product/${newArrivalProduct.id}` : '/new'" style="text-decoration: none; display: block;">
              <div class="d-flex flex-wrap" style="min-height: 400px; background: #0a0a0a;">
                <div class="d-flex flex-column justify-center align-start pa-8 pa-md-10" style="flex: 1 1 55%; min-width: 260px;">
                  <div class="mb-3" style="font-size: 0.65rem; letter-spacing: 3px; color: #E53935; font-weight: 700; text-transform: uppercase;">Just Dropped</div>
                  <h2 style="font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 700; color: #fff; margin-bottom: 10px;">New Arrivals</h2>
                  <template v-if="newArrivalProduct">
                    <div style="font-size: 0.9rem; font-weight: 600; color: #fff;">{{ newArrivalProduct.name }}</div>
                    <div style="font-size: 0.85rem; font-weight: 700; color: #E53935; margin-bottom: 14px;">Ksh {{ parseFloat(newArrivalProduct.price).toFixed(2) }}</div>
                  </template>
                  <p v-else style="font-size: 0.85rem; color: rgba(255,255,255,0.7); max-width: 350px; line-height: 1.7; margin-bottom: 14px;">
                    Fresh drops just landed. Limited quantities on our latest hoodies and sweatshirts.
                  </p>
                  <v-btn outlined color="white" height="42" class="px-6 mt-2" style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.7rem; font-weight: 600;">
                    Shop New
                  </v-btn>
                </div>
                <div class="d-flex align-center justify-center pa-6" style="flex: 1 1 45%; min-width: 240px; min-height: 260px; background: #f5f5f5;"
                     :style="newArrivalProduct ? {} : { background: 'url(\'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800\') center/cover' }">
                  <v-img
                    v-if="newArrivalProduct"
                    :src="newArrivalProduct.image_url || newArrivalProduct.image || '/placeholder-product.jpg'"
                    contain
                    style="max-width: 280px; max-height: 320px; width: 100%;"
                  />
                </div>
              </div>
            </nuxt-link>
          </v-col>
          <v-col cols="12" md="6">
            <nuxt-link :to="bestSellerProduct ? `/product/${bestSellerProduct.id}` : '/best-sellers'" style="text-decoration: none; display: block;">
              <div class="d-flex flex-wrap" style="min-height: 400px; background: #E53935;">
                <div class="d-flex flex-column justify-center align-start pa-8 pa-md-10" style="flex: 1 1 55%; min-width: 260px;">
                  <div class="mb-3" style="font-size: 0.65rem; letter-spacing: 3px; color: rgba(255,255,255,0.85); font-weight: 700; text-transform: uppercase;">Most Loved</div>
                  <h2 style="font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 700; color: #fff; margin-bottom: 10px;">Best Sellers</h2>
                  <template v-if="bestSellerProduct">
                    <div style="font-size: 0.9rem; font-weight: 600; color: #fff;">{{ bestSellerProduct.name }}</div>
                    <div style="font-size: 0.85rem; font-weight: 700; color: #0a0a0a; margin-bottom: 14px;">Ksh {{ parseFloat(bestSellerProduct.price).toFixed(2) }}</div>
                  </template>
                  <p v-else style="font-size: 0.85rem; color: rgba(255,255,255,0.85); max-width: 350px; line-height: 1.7; margin-bottom: 14px;">
                    Our most loved pieces. The hoodies and tees that keep selling out.
                  </p>
                  <v-btn outlined color="white" height="42" class="px-6 mt-2" style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.7rem; font-weight: 600;">
                    Shop Now
                  </v-btn>
                </div>
                <div class="d-flex align-center justify-center pa-6" style="flex: 1 1 45%; min-width: 240px; min-height: 260px; background: #f5f5f5;"
                     :style="bestSellerProduct ? {} : { background: 'url(\'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800\') center/cover' }">
                  <v-img
                    v-if="bestSellerProduct"
                    :src="bestSellerProduct.image_url || bestSellerProduct.image || '/placeholder-product.jpg'"
                    contain
                    style="max-width: 280px; max-height: 320px; width: 100%;"
                  />
                </div>
              </div>
            </nuxt-link>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- BRAND STORY -->
    <section style="background: #f8f8f8; padding: 100px 0;">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="5">
            <div style="font-size: clamp(3rem, 8vw, 5rem); font-weight: 900; color: #e0e0e0; text-transform: uppercase; line-height: 0.9; letter-spacing: -3px; margin-bottom: 30px;">
              Clean<br />Heart
            </div>
            <h3 style="font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 700; color: #000; margin-bottom: 20px;">Streetwear With Soul</h3>
            <p style="font-size: 0.9rem; color: #666; line-height: 1.8; margin-bottom: 30px;">
              Born from a passion for authentic street culture, Clean Heart represents more than just clothing.
              It's a movement. Every piece is designed to make a statement.
            </p>
            <div class="d-flex" style="gap: 40px;">
              <div>
                <div style="font-size: 2rem; font-weight: 900; color: #E53935;">10K+</div>
                <div style="font-size: 0.75rem; color: #999; letter-spacing: 1px; text-transform: uppercase;">Happy Customers</div>
              </div>
              <div>
                <div style="font-size: 2rem; font-weight: 900; color: #E53935;">4</div>
                <div style="font-size: 0.75rem; color: #999; letter-spacing: 1px; text-transform: uppercase;">Core Categories</div>
              </div>
              <div>
                <div style="font-size: 2rem; font-weight: 900; color: #E53935;">100%</div>
                <div style="font-size: 0.75rem; color: #999; letter-spacing: 1px; text-transform: uppercase;">Cotton</div>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="7">
            <v-row>
              <v-col cols="6">
                <div class="d-flex flex-column justify-center pa-6" style="background: #000; min-height: 280px;">
                  <v-icon color="#E53935" size="32" class="mb-4">mdi-fire</v-icon>
                  <h4 style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 12px;">Premium Quality</h4>
                  <p style="font-size: 0.8rem; color: rgba(255,255,255,0.6); line-height: 1.7;">Heavyweight cotton, reinforced stitching, and prints that last wash after wash.</p>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="d-flex flex-column justify-center pa-6" style="background: #E53935; min-height: 280px;">
                  <v-icon color="white" size="32" class="mb-4">mdi-truck-fast-outline</v-icon>
                  <h4 style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 12px;">Fast Shipping</h4>
                  <p style="font-size: 0.8rem; color: rgba(255,255,255,0.8); line-height: 1.7;">Worldwide delivery. Track your order from our door to yours in real-time.</p>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="d-flex flex-column justify-center pa-6" style="background: #E53935; min-height: 280px;">
                  <v-icon color="white" size="32" class="mb-4">mdi-refresh</v-icon>
                  <h4 style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 12px;">Easy Returns</h4>
                  <p style="font-size: 0.8rem; color: rgba(255,255,255,0.8); line-height: 1.7;">Not the right fit? No problem. 30-day hassle-free returns on all orders.</p>
                </div>
              </v-col>
              <v-col cols="6">
                <div class="d-flex flex-column justify-center pa-6" style="background: #000; min-height: 280px;">
                  <v-icon color="#E53935" size="32" class="mb-4">mdi-shield-check</v-icon>
                  <h4 style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 12px;">Secure Payment</h4>
                  <p style="font-size: 0.8rem; color: rgba(255,255,255,0.6); line-height: 1.7;">Encrypted checkout. Your data is protected with industry-standard security.</p>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- PRODUCTS SECTION -->
    <section id="products" style="padding: 100px 0; background: #ffffff;">
      <v-container>
        <div class="text-center mb-12">
          <h2 style="font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; color: #000; text-transform: uppercase; letter-spacing: -1px; margin-bottom: 16px;">
            Our Products
          </h2>
          <p style="font-size: 0.9rem; color: #666; max-width: 500px; margin: 0 auto; line-height: 1.7;">
            Our focus is on producing high-quality streetwear that brings comfort and style to everyday life.
          </p>
        </div>

        <!-- Filter Tabs -->
        <div class="d-flex justify-center mb-10 flex-wrap" style="gap: 0;">
          <v-btn
            v-for="filter in productFilters"
            :key="filter"
            :text="activeFilter !== filter"
            :color="activeFilter === filter ? 'black' : 'grey'"
            :dark="activeFilter === filter"
            height="48"
            class="px-6"
            style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.7rem; font-weight: 600;"
            @click="applyFilter(filter)"
          >
            {{ filter }}
          </v-btn>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="d-flex justify-center py-12">
          <v-progress-circular indeterminate color="#E53935" size="48" />
        </div>

        <!-- Product Grid -->
        <v-row v-else>
          <v-col
            v-for="product in filteredProducts"
            :key="product.id"
            cols="6"
            md="3"
            class="mb-8"
          >
            <nuxt-link :to="`/product/${product.id}`" style="text-decoration: none;">
              <div class="product-card" style="cursor: pointer; position: relative;">
                <div
                  v-if="product.badge || product.is_new || product.is_best_seller"
                  class="d-flex align-center justify-center"
                  style="position: absolute; top: 12px; left: 12px; z-index: 2; background: #E53935; color: white; font-size: 0.65rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 4px 10px;"
                >
                  {{ product.badge || (product.is_new ? 'New' : product.is_best_seller ? 'Best Seller' : '') }}
                </div>

                <div class="d-flex align-center justify-center mb-4" style="background: #f5f5f5; aspect-ratio: 3/4; position: relative; overflow: hidden;">
                  <v-img
                    :src="product.image_url || product.image || '/placeholder-product.jpg'"
                    aspect-ratio="3/4"
                    contain
                    style="width: 100%; height: 100%;"
                  >
                    <template #placeholder>
                      <div class="d-flex align-center justify-center fill-height">
                        <v-icon size="64" color="grey lighten-1">mdi-tshirt-crew-outline</v-icon>
                      </div>
                    </template>
                  </v-img>
                  <div class="product-overlay d-flex align-center justify-center" style="position: absolute; inset: 0; background: rgba(0,0,0,0.4); opacity: 0; transition: opacity 0.3s;">
                    <v-btn
                      color="black"
                      dark
                      height="44"
                      class="px-6"
                      style="border-radius: 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.7rem; font-weight: 600;"
                      @click.prevent="quickAdd(product)"
                    >
                      Quick Add
                    </v-btn>
                  </div>
                </div>

                <div>
                  <div style="font-size: 0.8rem; font-weight: 600; color: #000; margin-bottom: 4px; letter-spacing: 0.3px;">
                    {{ product.name }}
                  </div>
                  <div class="d-flex align-center justify-space-between">
                    <span style="font-size: 0.85rem; font-weight: 700; color: #000;">
                      Ksh {{ parseFloat(product.price).toFixed(2) }}
                    </span>
                    <div v-if="product.colors" class="d-flex" style="gap: 4px;">
                      <div
                        v-for="c in product.colors.split(',')"
                        :key="c"
                        style="width: 12px; height: 12px; border-radius: 50%; border: 1px solid #ddd;"
                        :style="`background: ${c.trim()};`"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </nuxt-link>
          </v-col>
        </v-row>

        <div class="text-center mt-8">
          <v-btn
            outlined
            color="black"
            height="48"
            class="px-8"
            style="border-radius: 0; text-transform: uppercase; letter-spacing: 2px; font-size: 0.75rem; font-weight: 600;"
            to="/shop"
          >
            View All Products
          </v-btn>
        </div>
      </v-container>
    </section>

    <!-- NEWSLETTER -->
    <section style="background: #000; padding: 80px 0;">
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="12" md="8" class="text-center">
            <div class="d-flex align-center justify-center mb-6">
              <div class="d-flex align-center justify-center mr-4" style="width: 50px; height: 50px; border-radius: 50%; background: #fff;">
                 <v-avatar
                      color="primary"
                      size="28"> 
                      <v-img :src="logo"></v-img>
                    </v-avatar>
              </div>
              <span style="font-size: 1.5rem; font-weight: 900; letter-spacing: 3px; color: #fff; text-transform: uppercase;">CLEAN HEART</span>
            </div>
            <h3 style="font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 700; color: #fff; margin-bottom: 16px;">Join the Movement</h3>
            <p style="font-size: 0.9rem; color: rgba(255,255,255,0.5); max-width: 450px; margin: 0 auto 30px; line-height: 1.7;">
              Be the first to know about new drops, exclusive offers, and behind-the-scenes content.
            </p>
            <div class="d-flex justify-center flex-wrap" style="gap: 0; max-width: 500px; margin: 0 auto;">
              <v-text-field
                v-model="email"
                placeholder="Enter your email"
                outlined
                hide-details
                height="52"
                dark
                class="flex-grow-1"
                style="border-radius: 0;"
                background-color="rgba(255,255,255,0.1)"
              />
              <v-btn
                color="#E53935"
                dark
                height="52"
                class="px-6"
                style="border-radius: 0; text-transform: uppercase; letter-spacing: 2px; font-size: 0.7rem; font-weight: 600;"
                @click="subscribe"
              >
                Subscribe
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- 🔥 NEWSLETTER POPUP - Shows on EVERY page load -->
    <v-dialog v-model="showNewsletterPopup" max-width="440" persistent>
      <v-card class="newsletter-popup-dark" flat>
        <div class="popup-header-dark">
          <div class="popup-brand-dark">
            <div class="popup-icon-dark">
              <v-avatar
                color="primary"
                size="20"> 
                <v-img :src="logo"></v-img>
              </v-avatar>
            </div>
            <span class="popup-brand-text-dark">Clean Heart</span>
          </div>
          <v-btn icon small dark @click="closeNewsletterPopup">
            <v-icon size="18" color="rgba(255,255,255,0.3)">mdi-close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="pa-5 pa-md-7 text-center">
          <div class="popup-badge-dark">🎉 10% OFF</div>
          
          <h2 class="popup-title-dark">Join the Family</h2>
          <p class="popup-subtitle-dark">
            Subscribe to get <span class="highlight-dark">10% off</span> your first order and stay updated on new drops.
          </p>

          <div class="popup-benefits-dark">
            <div class="benefit-item-dark">
              <v-icon size="14" color="#E53935">mdi-check-circle</v-icon>
              <span>Early access</span>
            </div>
            <div class="benefit-item-dark">
              <v-icon size="14" color="#E53935">mdi-check-circle</v-icon>
              <span>Exclusive offers</span>
            </div>
            <div class="benefit-item-dark">
              <v-icon size="14" color="#E53935">mdi-check-circle</v-icon>
              <span>Behind-the-scenes</span>
            </div>
          </div>

          <div class="mt-5">
            <v-text-field
              v-model="popupEmail"
              placeholder="Enter your email"
              outlined
              dense
              hide-details
              class="popup-input-dark"
              prepend-inner-icon="mdi-email-outline"
              dark
            />
            <v-btn
              block
              color="#E53935"
              dark
              depressed
              height="50"
              class="mt-3 popup-btn-dark"
              :loading="popupLoading"
              @click="submitPopupSubscribe"
            >
              Subscribe Now
            </v-btn>
          </div>

          <div class="mt-3">
            <span class="popup-note-dark">No spam. Unsubscribe anytime.</span>
          </div>

          <div class="mt-2">
            <v-btn text small class="popup-skip-dark" @click="closeNewsletterPopup">
              No thanks
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- 🔥 Floating Donate Button - Redirects to /donate page -->
    <v-btn
      fab
      color="#E53935"
      dark
      fixed
      bottom
      right
      style="bottom: 80px; right: 16px; z-index: 100; box-shadow: 0 4px 20px rgba(229, 57, 53, 0.35);"
      to="/donate"
    >
      <v-icon>mdi-heart</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import logo from '@/assets/logo.jpg'

export default {
  name: 'IndexPage',
  components: {
    // 🔥 Removed DonationModal import
  },
  data() {
    return {
      email: '',
      logo,
      activeFilter: 'All',
      addingToCart: false,
      currentSlide: 0,
      slideInterval: null,
      categories: ['Hoodies', 'Sweatshirts', 'T-Shirts', 'Crop Tops'],
      infoLinks: [
        { title: 'Shipping', to: '/shipping' },
        { title: 'Returns', to: '/returns' },
        { title: 'Size Guide', to: '/size-guide' },
        { title: 'Contact', to: '/contact' },
      ],
      productFilters: ['All', 'Hoodies', 'Sweatshirts', 'T-Shirts', 'Crop Tops'],
      
      // 🔥 Removed showDonationModal
      
      // Newsletter Popup
      showNewsletterPopup: false,
      popupEmail: '',
      popupLoading: false,
    }
  },
  computed: {
    ...mapState({
      products: state => state.products,
      loading: state => state.loading,
      authUser: state => state.authUser,
    }),
    ...mapGetters(['getCartCount']),
    
    carouselProducts() {
      const featured = this.products.filter(p => p.is_featured === true || p.is_featured === 1)
      return featured.length > 0 ? featured : this.products.slice(0, 8)
    },
    
    featuredProduct() {
      if (this.carouselProducts.length === 0) return null
      return this.carouselProducts[this.currentSlide] || this.carouselProducts[0]
    },

    // 🔥 Banner products
    newArrivalProduct() {
      const fresh = this.products.find(p => p.is_new === true || p.is_new === 1)
      return fresh || this.products[0] || null
    },

    bestSellerProduct() {
      const best = this.products.find(p => p.is_best_seller === true || p.is_best_seller === 1)
      return best || this.products[1] || this.products[0] || null
    },
    
    filteredProducts() {
      if (this.activeFilter === 'All') {
        return this.products.slice(0, 8)
      }
      
      const filtered = this.products.filter(p => {
        const productCategory = p.category || p.category_name || p.category_slug || ''
        return productCategory.toLowerCase() === this.activeFilter.toLowerCase()
      })
      
      return filtered.slice(0, 8)
    },
    
    firebaseUid() {
      return this.authUser?.uid || null
    }
  },
  async fetch({ store }) {
    await store.dispatch('fetchProducts')
    await store.dispatch('fetchCategories')
  },
  mounted() {
    if (this.firebaseUid) {
      this.$store.dispatch('fetchCart', this.firebaseUid)
    }

    // Start carousel autoplay
    this.startCarousel()

    // Show newsletter popup after 5 seconds on EVERY page load
    const hasSubscribed = localStorage.getItem('cleanheart_subscribed')
    
    if (!hasSubscribed) {
      setTimeout(() => {
        this.showNewsletterPopup = true
      }, 5000)
    }
  },
  beforeDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval)
    }
  },
  watch: {
    firebaseUid: {
      immediate: true,
      handler(newUid, oldUid) {
        if (newUid && newUid !== oldUid) {
          this.$store.dispatch('fetchCart', newUid)
        }
      }
    }
  },
  methods: {
    scrollToProducts() {
      const el = document.getElementById('products')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    },

    applyFilter(filter) {
      this.activeFilter = filter
      this.scrollToProducts()
    },

    nextSlide() {
      if (this.carouselProducts.length === 0) return
      this.currentSlide = (this.currentSlide + 1) % this.carouselProducts.length
    },
    
    prevSlide() {
      if (this.carouselProducts.length === 0) return
      this.currentSlide = (this.currentSlide - 1 + this.carouselProducts.length) % this.carouselProducts.length
    },

    startCarousel() {
      if (this.slideInterval) {
        clearInterval(this.slideInterval)
      }
      this.slideInterval = setInterval(() => {
        this.nextSlide()
      }, 4000)
    },

    async quickAdd(product) {
      if (!this.firebaseUid) {
        this.$router.push('/login?redirect=/')
        return
      }

      try {
        const fullProduct = await this.getFullProduct(product.id)
        
        if (!fullProduct) {
          this.$nuxt.$emit('show-snackbar', { 
            message: 'Product not found', 
            color: 'error' 
          })
          return
        }

        let variantId = null
        let variantDisplay = 'M'
        
        if (fullProduct.variants && fullProduct.variants.all && fullProduct.variants.all.length > 0) {
          const firstVariant = fullProduct.variants.all[0]
          variantId = firstVariant.id
          variantDisplay = `${firstVariant.color || 'Black'} / ${firstVariant.size || 'M'}`
        } else if (fullProduct.colors) {
          const colorList = fullProduct.colors.split(',')
          const firstColor = colorList[0]?.trim() || 'Black'
          variantDisplay = `${firstColor} / M`
        }

        const result = await this.$store.dispatch('addToCart', {
          firebaseUid: this.firebaseUid,
          productId: product.id,
          qty: 1,
          variant: variantDisplay,
          variantId: variantId
        })

        if (result.success) {
          this.$nuxt.$emit('show-snackbar', { 
            message: `${product.name} added to cart!`, 
            color: 'black' 
          })
        } else {
          this.$nuxt.$emit('show-snackbar', { 
            message: result.error || 'Failed to add to cart', 
            color: 'error' 
          })
        }
      } catch (error) {
        console.error('Quick add error:', error)
        this.$nuxt.$emit('show-snackbar', { 
          message: 'Something went wrong. Please try again.', 
          color: 'error' 
        })
      }
    },

    async getFullProduct(productId) {
      let product = this.products.find(p => p.id === productId)
      
      if (!product || !product.variants) {
        const result = await this.$store.dispatch('fetchProduct', productId)
        if (result) {
          product = result
        }
      }
      
      return product
    },

    subscribe() {
      if (!this.email) {
        this.$nuxt.$emit('show-snackbar', { 
          message: 'Please enter your email', 
          color: 'error' 
        })
        return
      }
      this.$nuxt.$emit('show-snackbar', { 
        message: 'Welcome to the Clean Heart family!', 
        color: '#E53935' 
      })
      this.email = ''
    },

    // 🔥 Removed handleDonationSuccess

    closeNewsletterPopup() {
      this.showNewsletterPopup = false
    },

    async submitPopupSubscribe() {
      if (!this.popupEmail) {
        this.$nuxt.$emit('show-snackbar', {
          message: 'Please enter your email',
          color: 'error'
        })
        return
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.popupEmail)) {
        this.$nuxt.$emit('show-snackbar', {
          message: 'Please enter a valid email',
          color: 'error'
        })
        return
      }

      this.popupLoading = true

      try {
        localStorage.setItem('cleanheart_subscribed', 'true')
        
        this.$nuxt.$emit('show-snackbar', {
          message: '🎉 Welcome to the Clean Heart family! Check your email for 10% off!',
          color: '#E53935'
        })
        
        this.popupEmail = ''
        this.showNewsletterPopup = false
      } catch (error) {
        console.error('Subscribe error:', error)
        this.$nuxt.$emit('show-snackbar', {
          message: 'Something went wrong. Please try again.',
          color: 'error'
        })
      } finally {
        this.popupLoading = false
      }
    }
  }
}
</script>

<style scoped>
/* Hero decorative background (no image) */
.hero-watermark {
  position: absolute;
  bottom: -4%;
  left: 50%;
  transform: translateX(-50%);
  font-size: clamp(5rem, 17vw, 15rem);
  font-weight: 900;
  line-height: 0.8;
  letter-spacing: -6px;
  text-transform: uppercase;
  white-space: nowrap;
  color: transparent;
  -webkit-text-stroke: 1px rgba(0, 0, 0, 0.06);
  pointer-events: none;
  user-select: none;
}

.hero-accent {
  position: absolute;
  top: 0;
  right: 0;
  width: 42%;
  height: 100%;
  background: linear-gradient(160deg, #E53935 0%, #b71c1c 100%);
  clip-path: polygon(22% 0, 100% 0, 100% 100%, 0% 100%);
  opacity: 0.95;
}

@media (max-width: 959px) {
  .hero-accent {
    display: none;
  }
  .hero-watermark {
    font-size: clamp(4rem, 24vw, 9rem);
    letter-spacing: -3px;
  }
}

.product-card:hover .product-overlay {
  opacity: 1 !important;
}

/* Carousel Styles */
.carousel-slide-active {
  opacity: 1 !important;
  transform: scale(1) !important;
  z-index: 5;
}

.carousel-dot-active {
  background: #E53935 !important;
  width: 20px !important;
  border-radius: 4px !important;
}

.carousel-image:hover {
  transform: scale(1.05);
}

/* Dark Newsletter Popup Styles */
.newsletter-popup-dark {
  border-radius: 16px !important;
  overflow: hidden;
  background: #0f0f0f !important;
  border: 1px solid rgba(255,255,255,0.06);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5) !important;
}

.popup-header-dark {
  background: rgba(255,255,255,0.03);
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.popup-brand-dark {
  display: flex;
  align-items: center;
  gap: 10px;
}

.popup-icon-dark {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #E53935;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.popup-brand-text-dark {
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.5px;
}

.popup-badge-dark {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 20px;
  background: rgba(229, 57, 53, 0.15);
  color: #E53935;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 14px;
}

.popup-title-dark {
  font-size: 1.4rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.popup-subtitle-dark {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.5);
  line-height: 1.6;
}

.highlight-dark {
  color: #E53935;
  font-weight: 700;
}

.popup-benefits-dark {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.benefit-item-dark {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.4);
}

.benefit-item-dark .v-icon {
  flex-shrink: 0;
}

.popup-input-dark ::v-deep .v-input__slot {
  border-radius: 10px !important;
  background: rgba(255,255,255,0.05) !important;
  border-color: rgba(255,255,255,0.1) !important;
}

.popup-input-dark ::v-deep .v-input__slot:focus-within {
  border-color: #E53935 !important;
  background: rgba(255,255,255,0.08) !important;
}

.popup-input-dark ::v-deep .v-label {
  color: rgba(255,255,255,0.3) !important;
}

.popup-input-dark ::v-deep input {
  color: #fff !important;
}

.popup-input-dark ::v-deep .v-icon {
  color: rgba(255,255,255,0.2) !important;
}

.popup-btn-dark {
  border-radius: 10px !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px !important;
  box-shadow: 0 4px 20px rgba(229, 57, 53, 0.3) !important;
  text-transform: none !important;
  font-size: 0.9rem !important;
}

.popup-btn-dark:hover {
  box-shadow: 0 6px 28px rgba(229, 57, 53, 0.5) !important;
}

.popup-note-dark {
  font-size: 0.65rem;
  color: rgba(255,255,255,0.2);
}

.popup-skip-dark {
  color: rgba(255,255,255,0.2) !important;
  font-size: 0.7rem !important;
  text-transform: none !important;
  font-weight: 400 !important;
}

.popup-skip-dark:hover {
  color: rgba(255,255,255,0.4) !important;
}

@media (max-width: 599px) {
  .popup-title-dark {
    font-size: 1.2rem;
  }
  .popup-subtitle-dark {
    font-size: 0.8rem;
  }
  .popup-benefits-dark {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
}
</style>