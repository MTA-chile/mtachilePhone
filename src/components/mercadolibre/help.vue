<template>
  <div>
  
    <md-toolbar class="md-primary">
      <md-button class="md-icon-button" @click="showNavigation = true">
        <router-link to="/mercadolibre"><md-icon>arrow_back</md-icon></router-link>
      </md-button>
      <span class="md-title">Ayuda</span>

    </md-toolbar>





    <h3 class="md-title md-center" >¿Con que podemos ayudarte?</h3>
    <md-toolbar class="md-medium">

   <md-table md-card>

      <md-table-row >
        <md-table-cell style="width:10000px">Comprando</md-table-cell>
      </md-table-row>

      <md-table-row>
        <md-table-cell >Vendiendo</md-table-cell>
      </md-table-row>

    </md-table>


    </md-toolbar>

  
  </div>
</template>

<script>


  export default {
    name: 'Help',
    mounted: function() {
      this.$material.theming.theme = "mercadolibre"; 
    },
  }
</script>


<style lang="scss" scoped>

.md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

  .md-content {
    padding: 16px;
  }

 .md-center {
       width: 100%;

    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  @import "~vue-material/dist/theme/engine"; // Import the theme engine

  @include md-register-theme("mercadolibre", (
    primary: #ffe700, // Mercado libre main color
    theme: light
  ));

  @import "~vue-material/dist/theme/all"; // Apply the theme



</style>