<template>
  <div>
      <div class="app-footer">
        <p class="copyright">Copyright © 2020 Genos.</p>
        <a class="contact" href="mailto:541444869@qq.com">Contact Me</a>
      </div>
  </div>

</template>
<script> 
export default {}
</script>
<style lang="scss" scoped>
.app-footer {
  display: flex;
  justify-content: space-between;
  width: 1200px;
  @media screen and (max-width: 1200px) {
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
  .contact {
    margin-top: 10px;
    color: rgb(130, 130, 130);
    font-size: 14px;
  }
  
}
</style>
