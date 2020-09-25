import Android from './components/android.vue';

// Mercado Libre

import MercadolibreHome from './components/mercadolibre/home.vue';
import MercadolibreHelp from './components/mercadolibre/help.vue';
import MercadolibreList from './components/mercadolibre/list.vue';
import MercadolibreProduct from './components/mercadolibre/product.vue';
import MercadolibreSell from './components/mercadolibre/sell.vue';


// Banco Estado

import BancoEstadoHome from './components/bancoestado/home.vue';
import BancoEstadoLog from './components/bancoestado/log.vue';
import BancoEstadoTransfer from './components/bancoestado/transfer.vue';


// Whatsapp

import Profile from './components/whatsapp/Profile.vue';
import Chat from './components/whatsapp/Chat.vue';
import Chats from './components/whatsapp/Chats.vue';
    

// Games
import game2048 from './components/games/2048/2048.vue'

const routes = [
    { path: '/', component: Android },

    { path: '/mercadolibre', component: MercadolibreHome },
    { path: '/mercadolibre/help', component: MercadolibreHelp },
    { path: '/mercadolibre/list', component: MercadolibreList },
    { path: '/mercadolibre/product', component: MercadolibreProduct },
    { path: '/mercadolibre/sell', component: MercadolibreSell },

    { path: '/bancoestado', component: BancoEstadoHome },
    { path: '/bancoestado/transfer', component: BancoEstadoTransfer },
    { path: '/bancoestado/log', component: BancoEstadoLog },


    { path: '/profile', name: 'profile', component: Profile },
    { path: '/chat', name: 'chat', component: Chat },
    { path: '/chats', name: 'chats', component: Chats },
    
    { path: '/2048', component: game2048 },
];

export default routes;