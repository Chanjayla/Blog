<template>
    <div>
        <MusicList></MusicList>
    </div>
</template>
<script>
import MusicList from '~/components/List/MusicList'
export default {
    layout: 'admin',
    middleware: 'authenticated',
    asyncData({ error }) {
        // error({ statusCode: 400, message: 'Developing...' }) 
    },
    components: {
        MusicList
    }
}
</script>