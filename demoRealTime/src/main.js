import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { faPause } from '@fortawesome/free-solid-svg-icons'
import { faStop } from '@fortawesome/free-solid-svg-icons'
library.add(faPlay, faPause, faStop)


const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app');