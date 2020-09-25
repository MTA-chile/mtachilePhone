<template>
  <div>
    <Header></Header>
    
    <md-toolbar class="md-transparent">
      <h3 class="md-title md-center">Saldo: ${{money}}</h3>
    </md-toolbar>
  </div>
</template>

<script>

  import Header from './header'
  //this.$material.theming.theme = "mercadolibre"; 

  export default {
    name: 'Home',
    components: {
      Header
    },
    data: () => ({
      money: 0
    }),
    methods: {

    },
    mounted: function(){
      var self = this;
      this.$api
        .get('bank/money/1')
        .then( function(response) {
          self.money = response.data.money
      })
    }
    
  }
</script>


<style lang="scss" scoped>
  .margin{
    padding-left:20px;
    padding-right:20px;
  }
  
 .md-center {
       width: 100%;

    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

</style>
