<template>
  <div style="margin-top: 64px;">
    <!-- Hero -->
    <section style="background: #000; padding: 100px 0; position: relative; overflow: hidden;">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="6">
            <div style="font-size: 0.75rem; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: #E53935; margin-bottom: 20px;">
              Our Story
            </div>
            <h1 style="font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 900; color: #fff; text-transform: uppercase; letter-spacing: -2px; line-height: 1; margin-bottom: 24px;">
              Wear Your<br />Heart
            </h1>
            <p style="font-size: 0.95rem; color: rgba(255,255,255,0.6); line-height: 1.8; max-width: 450px;">
              Clean Heart was born from a simple idea: streetwear should mean something.
              Every piece we create carries the bold red heart — a symbol of passion, authenticity, and staying true to yourself.
            </p>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-center">
            <div
              class="d-flex align-center justify-center"
              style="width: 300px; height: 300px; border-radius: 50%; background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%); border: 2px solid #E53935;"
            >
              <div class="text-center">
                  <v-avatar
                      color="primary"
                      size="80"> 
                      <v-img :src="logo"></v-img>
                    </v-avatar>
                <div class="mt-2" style="font-size: 1.2rem; font-weight: 900; color: #fff; letter-spacing: 3px; text-transform: uppercase;">CLEAN HEART</div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Mission -->
    <section style="padding: 80px 0;">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" md="8" class="text-center">
            <h2 style="font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight: 700; color: #000; margin-bottom: 20px;">Our Mission</h2>
            <p style="font-size: 1rem; color: #666; line-height: 1.8;">
              We believe that what you wear is an extension of who you are. Clean Heart isn't just about clothes —
              it's about creating a community of people who aren't afraid to show what they stand for.
              Every stitch, every print, every design is crafted with intention.
            </p>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Values -->
    <section style="background: #f8f8f8; padding: 80px 0;">
      <v-container>
        <div class="text-center mb-12">
          <h2 style="font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight: 700; color: #000; margin-bottom: 12px;">What We Stand For</h2>
          <p style="font-size: 0.9rem; color: #666;">The principles that drive everything we do</p>
        </div>
        <v-row>
          <v-col v-for="value in values" :key="value.title" cols="12" md="4" class="mb-6">
            <div class="pa-6 text-center" style="background: #fff; border: 1px solid #f0f0f0; height: 100%;">
              <div
                class="d-flex align-center justify-center mx-auto mb-4"
                style="width: 60px; height: 60px; border-radius: 50%; background: #000;"
              >
                <v-icon color="#E53935" size="28">{{ value.icon }}</v-icon>
              </div>
              <h3 style="font-size: 1.1rem; font-weight: 700; color: #000; margin-bottom: 12px;">{{ value.title }}</h3>
              <p style="font-size: 0.85rem; color: #666; line-height: 1.7;">{{ value.description }}</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Product Categories -->
    <section style="padding: 80px 0;">
      <v-container>
        <div class="text-center mb-12">
          <h2 style="font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight: 700; color: #000; margin-bottom: 12px;">Our Collection</h2>
          <p style="font-size: 0.9rem; color: #666;">Four core categories, one bold identity</p>
        </div>
        <v-row>
          <v-col v-for="cat in categories" :key="cat.name" cols="6" md="3">
            <nuxt-link :to="`/shop?category=${cat.slug}`" style="text-decoration: none;">
              <div
                class="d-flex flex-column justify-end pa-6"
                style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'); background-size: cover; background-position: center; min-height: 300px; position: relative; overflow: hidden;"
              >

              
                <div style="position: relative; z-index: 2;">
                  <div style="font-size: 1.2rem; font-weight: 700; color: #fff; margin-bottom: 4px;">{{ cat.name }}</div>
                  <div style="font-size: 0.75rem; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 1px;">{{ cat.count }} products</div>
                </div>
              </div>
            </nuxt-link>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Stats -->
    <section style="background: #000; padding: 80px 0;">
      <v-container>
        <v-row justify="center" align="center">
          <v-col v-for="stat in stats" :key="stat.label" cols="6" md="3" class="text-center">
            <div style="font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 900; color: #E53935; margin-bottom: 8px;">{{ stat.value }}</div>
            <div style="font-size: 0.8rem; color: rgba(255,255,255,0.5); letter-spacing: 2px; text-transform: uppercase;">{{ stat.label }}</div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Quality Promise -->
    <section style="padding: 80px 0;">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="6">
            <div style="font-size: 0.75rem; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: #E53935; margin-bottom: 16px;">
              Quality Promise
            </div>
            <h2 style="font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 700; color: #000; margin-bottom: 20px;">Built to Last</h2>
            <p style="font-size: 0.9rem; color: #666; line-height: 1.8; margin-bottom: 30px;">
              We don't cut corners. Every Clean Heart piece is made from premium heavyweight cotton,
              with reinforced seams and high-quality prints that won't crack or fade.
              This is merch you can wear for years.
            </p>
            <div class="d-flex flex-column" style="gap: 16px;">
              <div v-for="feature in qualityFeatures" :key="feature" class="d-flex align-center">
                <v-icon color="#E53935" size="20" class="mr-3">mdi-check-circle</v-icon>
                <span style="font-size: 0.85rem; color: #333; font-weight: 500;">{{ feature }}</span>
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6">
            <div class="d-flex align-center justify-center" style="background: #f5f5f5; min-height: 400px;">
              <v-icon size="120" color="grey lighten-2">mdi-tshirt-crew-outline</v-icon>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- CTA -->
    <section style="background: #E53935; padding: 80px 0;">
      <v-container>
        <div class="text-center">
          <h2 style="font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight: 900; color: #fff; margin-bottom: 16px;">Ready to Wear Your Heart?</h2>
          <p style="font-size: 0.9rem; color: rgba(255,255,255,0.8); max-width: 450px; margin: 0 auto 30px;">
            Join thousands of people who've made Clean Heart their go-to streetwear brand.
          </p>
          <v-btn
            color="black"
            dark
            height="52"
            class="px-8"
            style="border-radius: 0; text-transform: uppercase; letter-spacing: 2px; font-size: 0.75rem; font-weight: 600;"
            to="/shop"
          >
            Shop Now
          </v-btn>
        </div>
      </v-container>
    </section>
  </div>
</template>

<script>

import logo from '@/assets/logo.jpg'


export default {
  name: 'AboutPage',
  data() {
    return {
      logo,
      values: [
        { title: 'Authenticity', icon: 'mdi-heart', description: "We keep it real. No gimmicks, no fake hype. Just quality streetwear that speaks for itself." },
        { title: 'Community', icon: 'mdi-account-group', description: "Clean Heart is more than a brand — it's a family. We build connections, not just customers." },
        { title: 'Quality', icon: 'mdi-shield-check', description: "Every piece is crafted to the highest standards. If it doesn't meet our bar, it doesn't leave the door." },
      ],
      categories: [
        { name: 'Hoodies', slug: 'hoodies', count: 12 },
        { name: 'Sweatshirts', slug: 'sweatshirts', count: 8 },
        { name: 'T-Shirts', slug: 'tshirts', count: 15 },
        { name: 'Crop Tops', slug: 'crop-tops', count: 6 },
      ],
      stats: [
        { value: '10K+', label: 'Customers' },
        { value: '4', label: 'Categories' },
        { value: '50+', label: 'Designs' },
        { value: '100%', label: 'Cotton' },
      ],
      qualityFeatures: [
        'Heavyweight 100% cotton fabric',
        'Reinforced double-stitched seams',
        'Premium screen-printed designs',
        'Pre-shrunk for consistent fit',
        'Machine washable, fade-resistant',
      ]
    }
  },
  head() {
    return {
      title: 'About'
    }
  }
}
</script>