<template>

  <EditView style="height:calc(100vh - 0px);"></EditView>
  
</template>

<script>
import EditView from './edit/EditView';


export default {
  name: 'MainView',
  props: {
    global: Object
  },
  components:{
    EditView
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .gutter.gutter-horizontal {
      background:#f2f2f2;
}
</style>
