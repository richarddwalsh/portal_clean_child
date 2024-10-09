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
  mixins: [window.sharedMethods],
  directives: {
    'click-outside': window.clickOutsideDirective,
  },
  data: {
    loading: true,
    currentUser: dataset.userData,
    teams: dataset.userData.associations.my_teams.items,
    dynamicModal: {},
    modals: [
      {
        id:"leave_team_modal",
        visibile: false,
        title: "Leave [[team_name]]",
        message: "Are you sure you would like to leave [[team_name]]?",
        form: {},
        hasFooter: true,
        footerActions: [
          {
            id: "leave_team_modal_cancel",
            label: "Cancel",
            type: "button",
            class: "btn text-btn mr-2",
            method: "hideModal('leave_team_modal')",
            disabled: false,
          },
          {
            id: "leave_team_modal_confirm",
            label: "Yes, leave team",
            type: "button",
            class: "btn create-btn",
            method: "leaveTeam('')",
            disabled: false
          }
        ]
      }
    ],
    actionDrawers: {
      primary: false
    }
  },
  created() { 
    // if (dataset.teams) {
    //   this.teams = dataset.teams;
    // }
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
      console.log("leaveTeam");
      const payload = {
        teamId: this.currentData.hs_object_id,
        teamName: this.currentData.team_name,
        teamUrl: this.currentData.page_slug,
        teamBannerUrl: this.currentData.featured_image,
        // eslint-disable-next-line dot-notation
        contactId: this.currentUser['_metadata'].id,
        firstname: this.currentUser.firstname,
        contactEmail: this.currentUser.email
      }

      $.ajax({
        url: `https://${window.location.hostname}/_hcms/api/team/leave`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: (response) => {
          console.log('Successfully left the team:', response);
          if (response.status === 'success') {
            this.hideModal('leave_team_modal');
            const teamIndex = this.teams.findIndex(team => team.hs_object_id === this.currentData.hs_object_id);
            if (teamIndex !== -1) {
              this.teams.splice(teamIndex, 1);
            }
          }
        },
        error: (error) => {
          console.error('Error leaving the team:', error);
          const activeModal = Object.keys(this.modals).find(modal => this.modals[modal].visible);
          if (activeModal) {
            this.modals[activeModal].error = true;
            this.modals[activeModal].errorMessage = error.responseJSON ? error.responseJSON.message : 'An unexpected error occurred.';
          }
        }
      });
    },
    getTeamLeaders(i) {
      const team = this.teams[i]
      const leaders = team.associations.leaders.items.map(leader => `${leader.firstname} ${leader.lastname}`);
      return leaders.join(", ");
    },
    getServeSchedule(i) {
      const team = this.teams[i];
      const schedule = team.serve_schedule.map(item => item.label);
      return schedule.join(", ");
    },
    getDataObject(i) {
      const team = this.teams[i];
      return JSON.stringify(team);
    }
  }
});