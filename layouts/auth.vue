<template>
  <v-app style="background: #ffffff;">
    <v-main>
      <Nuxt />
    </v-main>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" top>
      {{ snackbar.message }}
      <template #action>
        <v-btn text @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  name: 'AuthLayout',
  data() {
    return {
      snackbar: { show: false, message: '', color: 'black' }
    }
  },
  mounted() {
    this.$nuxt.$on('show-snackbar', ({ message, color }) => {
      this.snackbar = { show: true, message, color }
    })
  },
  beforeDestroy() {
    this.$nuxt.$off('show-snackbar')
  }
}
</script>