<template>
    <div>
        <vinfinite> </vinfinite>
    </div>
</template>
<script>
export default {
    layout: 'blog',
    data() {
        return {

        }
    },
    methods: {
        
    },
    components: {
        vinfinite: () => import('~/components/List/InfiniteList.vue')
    }
}
</script>