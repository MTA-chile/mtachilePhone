<template>
  <div>
    <Header></Header>
    <h3 style="padding-top:20px" class="md-title md-center" >Transferencia a terceros</h3>

    <md-dialog-alert
      :md-active.sync="notmoney"
      md-content="¡Dinero insuficiente!"
      md-confirm-text="Ok" />

      <md-dialog-alert
      :md-active.sync="success"
      md-content="¡Transferencia exitosa!"
      md-confirm-text="Ok" />

    <div class="margin">
      <div class="md-layout md-gutter">
        <div class="md-layout-item">
          <md-autocomplete v-model="selected" :md-options="players" :md-open-on-focus="false">
            <label>Jugadores</label>
          </md-autocomplete>

         <md-field>
            <label>Monto</label>
            <md-input v-model="amount" type="number"></md-input>
             <md-icon>attach_money</md-icon>
          </md-field>
        </div>

        <div class="md-layout-item">
          
           <md-field>
            <label>Comentario</label>
            <md-textarea v-model="desc"></md-textarea>
          </md-field>
        </div>
      </div>
      <md-button class="md-primary md-raised" @click="pay">Pagar</md-button>

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
      selected: null,
      amount: 0,
      desc: '',
      font: null,
      notmoney: false,
      success: false,
      players: [
        {id:1,name:'aa'},
        {id:2,name:'bb'}
      ]
    }),
    methods: {
      pay(){
        var self = this;
        this.$api
          .get('bank/transfer/1/2/'+self.amount+'/'+self.desc)
          .then( function(response) {
            let status = response.data

            if(status){
              self.success = true
            }else{
              self.notmoney = true
            }
        })

      }
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
