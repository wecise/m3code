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

<style scoped>

</style>
