<template>
  <div>

  <Header></Header>

    <md-list>
      <md-list-item class="md-layout product" v-for="product in products" :key="product.id">
        <div class="md-layout-item md-size-40">
            <img class="productimg" :src="'http://localhost:3000/products/'+product.productid+'.png'" alt="imagen del producto">
        </div>
        <div class="md-layout-item md-size-60">
            <div class="md-list-item-text">
                <span>{{product.title}}</span>
                <span class="price">$ {{formatPrice(product.price)}}</span>
            </div>
        </div>

        <md-button class="md-icon-button md-list-action">
          <md-icon class="md-secundary">favorite</md-icon>
        </md-button>

      </md-list-item>

    </md-list>


  </div>
</template>

<script>

  import Header from './header'

  export default {
    name: 'Home',
    data: () => ({
        products: []
    }),
    components: {
      Header
    },
    mounted: function() {
      var self = this;

      this.$material.theming.theme = "mercadolibre"; 
      this.$api
        .get('mercadolibre/products')
        .then( function(response) {
            self.products = response.data
        })
    },
    methods: {
        formatPrice(val) {
             while (/(\d+)(\d{3})/.test(val.toString())){
                val = val.toString().replace(/(\d+)(\d{3})/, '$1'+'.'+'$2');
                }
            return val;
        }
    }
    
  }
</script>


<style lang="scss" scoped>

</style>
