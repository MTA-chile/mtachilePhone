<template>
  <div>
    <Header></Header>
    
 <div>
    <md-table>
      <md-table-row>
        <md-table-head>Destinatario</md-table-head>
        <md-table-head md-numeric>Plata</md-table-head>
        <md-table-head>Descripcion</md-table-head>
        <md-table-head md-numeric>Fecha</md-table-head>
      </md-table-row>

      <md-table-row v-for="transaction in transactions" :key="transaction.id">
        <md-table-cell>{{transaction.to}}</md-table-cell>
        <md-table-cell md-numeric>${{transaction.amount}}</md-table-cell>
        <md-table-cell>{{transaction.desc}}</md-table-cell>
        <md-table-cell md-numeric>{{transaction.date}}</md-table-cell>
      </md-table-row>

    </md-table>
  </div>
  </div>
</template>

<script>

  import Header from './header'
  //this.$material.theming.theme = "mercadolibre"; 

  export default {
    name: 'Log',
    components: {
      Header
    },
    data: () => ({
     transactions: [
       {
         date:'27/2/2018',
         to: 'Rodrigo',
         amount: 6000,
         desc: 'aaaaaaaaaa'
       },{
         date:'27/2/2018',
         to: 'Rodrigo',
         amount: 6000,
         desc: 'aaaaaaaaaa'
       },{
         date:'27/2/2018',
         to: 'Rodrigo',
         amount: 6000,
         desc: 'aaaaaaaaaa'
       },{
         date:'27/2/2018',
         to: 'Rodrigo',
         amount: 6000,
         desc: 'aaaaaaaaaa'
       }
     ]
    }),
    methods: {

      }
    
  }
</script>


<style lang="scss" scoped>
 .md-center {
       width: 100%;

    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

</style>
