<template>

<div>

  <md-toolbar class="md-primary">
      <div class="md-toolbar-row">
        <div class="md-toolbar-section-start">
          <md-button class="md-icon-button" @click="showNavigation = true">
            <md-icon>menu</md-icon>
          </md-button>
          
        </div>

      

        <div class="md-toolbar-section-end">

        </div>
      </div>
  </md-toolbar>

  <md-drawer :md-active.sync="showNavigation" md-swipeable>
      <md-toolbar class="md-transparent" md-elevation="0">
        <span class="md-title">Hola</span>
      </md-toolbar>

      <md-list>
        <md-list-item>
          <md-icon>home</md-icon>
          <span class="md-list-item-text">Inicio</span>
        </md-list-item>

        <md-list-item>
          <md-icon>search</md-icon>
          <span class="md-list-item-text">Buscar</span>
        </md-list-item>

        <router-link to="/mercadolibre/sell">
          <md-list-item>
            <md-icon>local_offer</md-icon>
            <span class="md-list-item-text">Vender</span>
          </md-list-item>
        </router-link>

        <md-list-item>
          <md-icon>local_mall</md-icon>
          <span class="md-list-item-text">Mis Compras</span>
        </md-list-item>

        <md-list-item>
          <md-icon>list</md-icon>
          <span class="md-list-item-text">Catergorias</span>
        </md-list-item>

        <router-link to="/mercadolibre/help">
        <md-list-item>
          <md-icon>help_outline</md-icon>
          <span class="md-list-item-text">Ayuda</span>
          </md-list-item>
        </router-link>
      </md-list>
    </md-drawer>

</div>
</template>


<script>
  export default {
    name: 'Header',
    mounted: function() {
      //this.$material.theming.theme = "bancoestado"; 
    },
    data: () => ({
      showNavigation: false,
      showSidepanel: false
    }),
    methods: {

    }
  }
</script>


<style lang="scss" scoped>


  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

  .search {
    background: white!important;
    max-width: 500px;
  }
</style>
