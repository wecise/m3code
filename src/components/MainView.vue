<template>

  <FsView style="height:calc(100vh - 0px);"></FsView>
  
</template>

<script>
import FsView from './api/FsView';


export default {
  name: 'MainView',
  props: {
    global: Object
  },
  components:{
    FsView
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .gutter.gutter-horizontal {
      background:#f2f2f2;
}
</style>
