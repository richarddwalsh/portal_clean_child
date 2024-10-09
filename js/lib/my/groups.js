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
    groups: dataset.userData.associations.my_groups.items,
    actionDrawers: {
      primary: false
    },
    modals: [
      {
        id:"leave_group_modal",
        visibile: false,
        title: "Leave [[name]]",
        message: "Are you sure you would like to leave [[name]]?",
        form: {},
        hasFooter: true,
        footerActions: [
          {
            id: "leave_team_modal_cancel",
            label: "Cancel",
            type: "button",
            class: "btn text-btn mr-2",
            method: "hideModal('leave_group_modal')",
            disabled: false,
          },
          {
            id: "leave_team_modal_confirm",
            label: "Yes, leave group",
            type: "button",
            class: "btn create-btn",
            method: "leaveGroup('')",
            disabled: false
          }
        ]
      }
    ]
  },
  created() {
    console.log("lib.my.groups.js");
  },
  computed: {
    isAdmin() {
      // console.log("Checking if user is admin")
      return document.getElementById('main_page_content').getAttribute('data-is-admin');;
    },
    isLead() {
      const myGroupsLead = this.currentUser.associations.my_groups_lead.items.map(item => item.hs_object_id);
      return myGroupsLead.includes(this.team.id);
    }
  },
  methods: {
    leaveGroup() {
      console.log("leaveGroup");
      const payload = {
        groupId: this.currentData.hs_object_id,
        groupName: this.currentData.name,
        groupUrl: this.currentData.dynamic_page_slug,
        groupBannerUrl: this.currentData.featured_image,
        // eslint-disable-next-line dot-notation
        contactId: this.currentUser['_metadata'].id,
        firstname: this.currentUser.firstname,
        contactEmail: this.currentUser.email
      }

      $.ajax({
        url: `https://${window.location.hostname}/_hcms/api/group/leave`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: (response) => {
          console.log('Successfully left the team:', response);
          if (response.status === 'success') {
            this.hideModal('leave_group_modal');
            const groupIndex = this.groups.findIndex(team => team.hs_object_id === this.currentData.hs_object_id);
            if (groupIndex !== -1) {
              this.groups.splice(groupIndex, 1);
            }
          }
        },
        error: (error) => {
          console.error('Error leaving the group:', error);
          const activeModal = Object.keys(this.modals).find(modal => this.modals[modal].visible);
          if (activeModal) {
            this.modals[activeModal].error = true;
            this.modals[activeModal].errorMessage = error.responseJSON ? error.responseJSON.message : 'An unexpected error occurred.';
          }
        }
      });
    },
    getTeamLeaders(i) {
      const group = this.groups[i]
      const leaders = group.associations.leaders.items.map(leader => `${leader.firstname} ${leader.lastname}`);
      return leaders.join(", ");
    },
    getSchedule(i) {
      const group = this.groups[i];
      // const schedule = group.schedule.map(item => item.label);
      return group.schedule
    },
    getDataObject(i) {
      const group = this.groups[i];
      return JSON.stringify(group);
    }   
  }
});