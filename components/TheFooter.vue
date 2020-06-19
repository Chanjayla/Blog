<template>
  <div class="app-footer">
    <p class="copyright">Copyright © 2020 Genos.</p>
  </div>
</template>
<style lang="scss" scoped>
.app-footer {
  width: 900px;
  @media screen and (max-width: 640px) {
    width: 100%;
  }
  height: 60px;
  margin: 0 auto 0 auto;
  border-top: 1px dashed rgb(102, 102, 102);
  color: rgb(130, 130, 130);
  font-family: Ubuntu, sans-serif;
  .copyright {
    margin-top: 10px;
    font-size: 14px;
    overflow: auto;
  }
}
</style>
