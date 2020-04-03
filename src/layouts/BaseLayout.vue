<template>
    <div id="app">
        <header functional>
            <slot name="header">header</slot>
        </header>
        <slot name="content">article</slot>
        <footer>
             <slot name="footer">footer</slot>
        </footer>
    </div>
</template>
<style lang="scss">

</style>
