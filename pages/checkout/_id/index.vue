<template>
<checkout :uid="uid"></checkout>
</template>

<script>
import Checkout from "/components/Checkout.vue";
export default {
    components: {
        Checkout,
    },
    data(){
        return{
             uid: this.$route.params.id,
        }
    }
}
</script>

<style>
.vuetify-logo {
    height: 180px;
    width: 180px;
    transform: rotateY(560deg);
    animation: turn 3.5s ease-out forwards 1s;
}

@keyframes turn {
    100% {
        transform: rotateY(0deg);
    }
}
</style>
