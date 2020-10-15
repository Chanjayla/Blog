<template>
    <div></div>
</template>
<script>
export default {
    layout: 'blog',
    mounted() {
        this.$store.dispatch('app/toggleLoading', 2)
    }
}
</script>