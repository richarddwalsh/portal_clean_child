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
  },
  created() {
    console.log('created');
  },
  computed: {
    formattedAddress() {
      const addressParts = [];
  
      if (this.currentUser.address) {
        addressParts.push(this.currentUser.address);
      }
  
      const cityStateZip = [];
  
      if (this.currentUser.city) {
        cityStateZip.push(this.currentUser.city);
      }
      if (this.currentUser.state) {
        cityStateZip.push(this.currentUser.state);
      }
      if (this.currentUser.zip) {
        cityStateZip.push(this.currentUser.zip);
      }
  
      if (cityStateZip.length > 0) {
        addressParts.push(cityStateZip.join(', '));
      }
  
      return addressParts.join('<br>');
    }
  },
  filters: {
    formatDate(value, format) {
      if (value) {
        return moment(String(value)).format(format);
      }
      return '';
    },
  },
  methods: {
    getInitials(name) {
      const names = name.split(' ');
      let initials = '';
      names.forEach(n => {
        initials += n.charAt(0).toUpperCase();
      });
      return initials;
    },
  }
});