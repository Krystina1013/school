<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>
<style lang="scss">
* {
  margin: 0px;
  padding: 0px;
}
#app {
  background-color: #f8f8f8;
}
.login-container {
  input:-webkit-autofill,
  textarea:-webkit-autofill,
  select:-webkit-autofill {
    -webkit-text-fill-color: #5f6368 !important;
    -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
    background-color: transparent;
    background-image: none;
    transition: background-color 50000s ease-in-out 0s;
  }
}
body {
  overflow: hidden;
}
body .el-table th.gutter {
  display: table-cell !important;
}
</style>
