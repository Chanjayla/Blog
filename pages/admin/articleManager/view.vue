<template>
    <div class="article-view">
        <ArticleTable />
    </div>
</template>
<script>
import ArticleTable from '~/components/Table/ArticleTable'
export default {
    layout: 'admin',
    middleware: 'authenticated',
    components: {
        ArticleTable
    }
}
</script>
<style lang="scss" scoped>
.article-view {
    box-sizing: border-box;
    padding: 10px 20px;
}
</style>