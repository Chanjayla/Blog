<template>
    <div>theme</div>
</template>
<script>
export default {
    layout: 'admin',
    middleware: 'authenticated',
    asyncData({ error }) {
        // error({ statusCode: 400, message: 'Developing...' }) 
    }
}
</script>