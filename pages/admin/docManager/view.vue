<template>
    <div class="docs-view">
        <docs-list :routerPath="'/admin/docManager/edit'"></docs-list>
    </div>
</template>
<script>

import DocsList from '~/components/List/DocsList'
export default {
    layout: 'admin',
    middleware: 'authenticated',
    data() {
        return {
            docsData: [],
            page: 1,
            pageSize: 10,
        }
    },
    components: {
        DocsList,
    },
    mounted() {
        
    },
}
</script>
<style lang="scss" scoped>
.docs-view {
    height: 100%;
    background: $adminViewBg;
}
</style>