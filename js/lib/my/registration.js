/* eslint-disable no-undef */
/* eslint-disable no-new */
Vue.config.devtools = true;
Vue.config.productionTip = true;
Vue.config.silent = false;

const targetData = document.getElementById('json-data');
const dataset = JSON.parse(targetData.textContent);

new Vue({
  delimiters: ['[[', ']]'],
  el: '#app',
  directives: {
    'click-outside': window.clickOutsideDirective,
  },
  data: {
    currentUser: dataset.userData,
    objectId: dataset.objectId,
    registration: {},
    actionDrawers: {
      primary: false
    }
  },
  created() { 
    if (dataset) {
      // find the registration in the dataset.userData.associations.registrations.items
      this.registration = dataset.userData.associations.registrations.items.find(item => item.hs_object_id === this.objectId);
    }
  },
  computed: {
    isAdmin() {
      return document.getElementById('main_page_content').getAttribute('data-is-admin');;
    },
    event() {
      return this.registration.associations.events.items[0];
    },
    primaryContact() {
      return this.event.associations.contact_collection__event_to_contact.items[0]
    }
  },
  methods: {  
  }
});