<template>
    <div>
        <RsList></RsList>
    </div>
</template>
<script>
import RsList from '~/components/List/ResourcesList'
export default {
    layout: 'admin',
    middleware: 'authenticated',
    asyncData({ error }) {
        // error({ statusCode: 400, message: 'Developing...' }) 
    },
    components: {
        RsList
    }
}
</script>