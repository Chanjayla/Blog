<template>
    <div>
        <PicList></PicList>
    </div>
</template>
<script>
import PicList from '~/components/List/PicList'
export default {
    layout: 'admin',
    middleware: 'authenticated',
    asyncData({ error }) {
        // error({ statusCode: 400, message: 'Developing...' }) 
    },
    components: {
        PicList
    }
}
</script>