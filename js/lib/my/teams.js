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
    teams: [],
    actionDrawers: {
      primary: false
    },
    modals: { }
  },
  created() { 
    if (dataset.teams) {
      this.teams = dataset.teams;
    }
  },
  computed: {
    isAdmin() {
      // console.log("Checking if user is admin")
      return document.getElementById('main_page_content').getAttribute('data-is-admin');
    },
    isLead() {
      const myTeamsLead = this.currentUser.associations.my_teams.items.map(item => item.hs_object_id);
      return myTeamsLead.includes(this.team.id);
    }
  },
  methods: {
    leaveTeam() {
      console.log("leave team triggered")
      // https://{{ request.domain }}/_hcms/api/team/leave
      // Params: teamId, teamName, teamUrl, teamBannerUrl, contactId, firstname, contactEmail
    }    
  }
});