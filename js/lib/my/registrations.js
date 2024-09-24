/* eslint-disable no-param-reassign */
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
    registrations: [],
    actionDrawers: {
      primary: false
    }
  },
  created() { 
    if (dataset) {
      const registrations = []
      if (dataset.userData.associations.registrations) {
        dataset.userData.associations.registrations.items.forEach(registration => {
          if (registration.associations.contacts) {
            registration.participants = registration.associations.contacts.items.map(contact => `${contact.firstname} ${contact.lastname}`).join(', ');
          }
          if (registration.associations.events) {
            registration.event_image = registration.associations.events.items[0].banner_image;
            registration.event_id = registration.associations.events.items[0].hs_object_id;
          }
          registrations.push(registration);
        });
      }
      this.registrations = registrations;
    }
  },
  computed: {
    isAdmin() {
      return document.getElementById('main_page_content').getAttribute('data-is-admin');;
    },
    upcomingRegistrations() {
      // registrations where the event_date is in the future or the event_date is today
      return this.registrations.filter(registration => new Date(registration.event_date) >= new Date());
    },
    ongoingRegistrations() {
      return this.registrations.filter(registration => registration.status === 'ONGOING');
    },
    pastRegistrations() {
      // registrations where the event_date is in the past
      return this.registrations.filter(registration => new Date(registration.event_date) < new Date());
    }
  },
  methods: {  
  }
});