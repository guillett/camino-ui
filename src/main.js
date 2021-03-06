import './styles/styles.css'
import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import * as SentryIntegrations from '@sentry/integrations'

import VueMatomo from './stats'
import App from './app.vue'

import router from './router'
import store from './store'
import mixins from './mixins'

import { dateFormat } from './utils'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://c8050c650ac54b04bbc47175763446c0@sentry.io/1332560',
    integrations: [
      new SentryIntegrations.Vue({
        Vue,
        attachProps: true
      }),
      new SentryIntegrations.RewriteFrames()
    ],
    /* global npmVersion */
    // @ts-ignore
    release: `camino-ui-${npmVersion}`
  })
}

Vue.use(VueMatomo, {
  host: '/matomo',
  siteId: 'matomo-site-id',
  router,
  store,
  requireConsent: false,
  trackInitialView: true,
  trackerFileName: 'piwik',
  enableHeartBeatTimer: true,
  enableLinkTracking: true
})

Vue.config.productionTip = false

Vue.filter('dateFormat', dateFormat)

Vue.mixin(mixins)

const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// only available during E2E tests
if (window.Cypress) {
  window.app = app
}
