<template>
  <div class='bg' style="min-height: 100vh;">
    <md-button class="md-icon-button" @click="showNavigation = true">
      <router-link to="/mercadolibre"><md-icon>arrow_back</md-icon></router-link>
    </md-button>



    <h3 class="md-title md-center" >¿Qué quieres publicar?</h3>

    <md-list class="md-layout">
      <md-list-item class="md-size-50">
        <div class="md-layout-item">
            <img src="assets/mercadolibre/products.svg"/>
        </div>
        <div class="md-layout-item">
            <div class="md-list-item-text">
                <span>Productos</span>
            </div>
        </div>
      </md-list-item>

      <md-list-item class="md-size-50">
        <div class="md-layout-item">
          <img src="assets/mercadolibre/vehicles.svg"/>
        </div>
        <div class="md-layout-item">
            <div class="md-list-item-text">
                <span>Vehículos</span>
            </div>
        </div>
      </md-list-item>
    </md-list>
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

.bg {
  background-color: #ffea77;

}
.md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

  .md-content {
    padding: 16px;
  }

 .md-center {
    padding-top: 20%;
    width: 100%;

    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  @import "~vue-material/dist/theme/engine"; // Import the theme engine

  @include md-register-theme("mercadolibre", (
    primary: #ffea77, // Mercado libre main color
    theme: light
  ));

  @import "~vue-material/dist/theme/all"; // Apply the theme



</style>