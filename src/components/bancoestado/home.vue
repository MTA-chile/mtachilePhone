<template>
  <div>
    <Header></Header>
    <md-card> 
      <md-card-content>
            <md-toolbar class="md-transparent">
            <h2 class="md-display-1 md-center">${{money}}</h2>
            <h3 class="md-title md-center">Saldo disponible</h3>
          </md-toolbar>
      </md-card-content>

    </md-card>



     <div class="phone-viewport">
      <md-bottom-bar class="md-accent" md-sync-route>
        <md-bottom-bar-item to="/components/bottom-bar" exact md-label="Inicio" md-icon="home"></md-bottom-bar-item>
        <md-bottom-bar-item to="/components/bottom-bar/posts" md-label="Movimientos" md-icon="swap_horiz"></md-bottom-bar-item>
        <md-bottom-bar-item to="/components/bottom-bar/posts" md-label="Transferir" md-icon="swap_horiz"></md-bottom-bar-item>
        <md-bottom-bar-item to="/components/bottom-bar/favorites" md-label="Pagar" md-icon="attach_money"></md-bottom-bar-item>
      </md-bottom-bar>
    </div>

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
