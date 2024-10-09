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
    objectName: dataset.teamData.team_name,
    activeButton: undefined,
    objectType: 'teams',
    objectId: dataset.teamData.id,
    loading: true,
    editing: false,
    currentUser: dataset.userData,
    currentEvent: undefined,
    team: dataset.teamData,
    administrators: [],
    messages: dataset.messages.objects,
    actionDrawers: {
      primary: false,
      rsvp: false,
    },
    events: dataset.eventsData,
    processing: {
      resource: false,
      message: false,
    },
    resources: dataset.resources.objects,
    members: [],
    newEvent: emptyEvent,
    newReply: "",
    showComposer: false,
    newResource: emptyResource,
    fileInfoReady: false,
    form: {
      team: {
        team_name: '',
        active: false,
        description: '',
        featured_image: '',
        primary_team_lead: '',
        public: false,
        location: [],
        require_background_check: true,
        requires_experience: true,
        serve_schedule: [],
        communication_enabled: false,
        members_can_create_forum_topics: "leaders",
      }
    },
    tabs: [
      { 
        id: 'messaging',
        label: "Messaging",
        active: true,
        requiresAdmin: false,
        visibility: "team.communication_enabled === true"
      },
      {
        id: 'events',
        label: "Events",
        active: false,
        requiresAdmin: false
      },
      {
        id: 'resources',
        label: "Resources",
        active: false,
        requiresAdmin: false
      },
      {
        id: 'members',
        label: "Members",
        active: false,
        requiresAdmin: false
      },
      {
        id: 'settings',
        label: "Settings",
        active: false,
        requiresAdmin: true
      }
    ],
    sections: [
      {
        id: "team-details-0",
        maxCols: 2,
        showSave: true,
        rows: [
          {
            columns: [
              {
                panes: [
                  {
                    id: "team-details-0-enrollment-status",
                    title: "Enrollment Status",
                    fields: [
                      {
                        title: "Closed",
                        name: "active",
                        label: "Open enrollment",
                        type: "action",
                        method: "openEnrollment",
                        disabled: false
                      },
                    ]
                  },
                  {
                    id: "team-details-0-basic-settings",
                    title: "Basic team info",
                    fields: [
                      {
                        label: "Team Name",
                        name: "team_name",
                        property: "team_name",
                        type: "input",
                        format: "text",
                        placeholder: "Enter a name for your team"
                      },
                      {
                        label: "Team Description",
                        name: "description",
                        property: "description",
                        type: "textarea",
                        disabled: false
                      },
                      {
                        label: "Primary Team Lead",
                        name: "primary_team_lead",
                        property: "primary_team_lead",
                        type: "input",
                        format: "text",
                        placeholder: "Enter the name of the primary team lead"
                      },
                      {
                        label: "Serve Schedule",
                        name: "serve_schedule",
                        property: "serve_schedule",
                        type: "select",
                        multiple: true,
                        options: dataset.options.schedule
                      },
                      {
                        label: "Location",
                        name: "location",
                        property: "location",
                        type: "select",
                        multiple: true,
                        options: dataset.options.location
                      },
                    ]
                  }
                ]
              },
              {
                panes: [
                  {
                    id: "team-details-0-messaging-settings",
                    title: "Messaging",
                    fields: [
                      {
                        label: "Enable Team Messaging",
                        name: "communication_enabled",
                        type: "checkbox",
                        notice: "Names of each member will be visible to other team members.",
                        noticeType: "alert--informative"
                      },
                      {
                        label: "Who can create new messages",
                        name: "members_can_create_forum_topics",
                        type: "radio",
                        options: [
                          {
                            id: "members_can_create_forum_topics_yes",
                            label: "Members and leaders",
                            value: "all",
                            checked: true
                          },
                          {
                            id: "members_can_create_forum_topics_no",
                            label: "Only leaders",
                            value: "leaders",
                            checked: true,
                          }
                        ]
                      }
                    ]
                  },
                  {
                    id: "team-details-0-enrollment-settings",
                    title: "Enrollment Criteria",
                    fields: [
                      {
                        label: "Require Background Check",
                        name: "require_background_check",
                        type: "checkbox",
                        notice: "A background check will be required for all members.",
                        noticeType: "alert--informative"
                      },
                      {
                        label: "Requires Experience",
                        name: "requires_experience",
                        type: "checkbox",
                        notice: "Members must have experience to join this team.",
                        noticeType: "alert--informative"
                      },
                    ]
                  },
                  {
                    id: "team-details-0-visibility-settings",
                    title: "Visibility",
                    fields: [
                      {
                        label: "Public",
                        name: "public",
                        type: "checkbox",
                        notice: "This team will be visible to all members.",
                        noticeType: "alert--informative"
                      },
                    ]
                  }
                ]
              }
            ]
          },
        ]
      }
    ],
    modals: [
      {
        id: "create_event_modal",
        visible: false,
        title: "New Event",
        hasFooter: true,
        footerActions: [
          {
            id: "create_event_modal_cancel",
            label: "Cancel",
            type: "button",
            class: "btn text-btn mr-2",
            method: "hideModal('create_event_modal')",
            disabled: false
          },
          {
            id: "create_event_modal_save",
            label: "Save",
            type: "button",
            class: "btn create-btn",
            method: "save('')",
            disabled: false
          }
        ],
        data: undefined,
        form: {
          rows:[
            {
              visibility: true,
              columns: [
                {
                  type: "label",
                  text: "Event name",
                },
                {
                  type: "field",
                  name: "name",
                }
              ],
              type: 'column'
            },
            {
              visibility: true,
              columns: [
                {
                  type: "label",
                  text: "Starts at",
                },
                {
                  type: "field",
                  name: "starts_at",
                },
                {
                  type: "label",
                  text: "Start Time",
                },
                {
                  type: "field",
                  name: "starts_at_time",
                }
              ],
              type: 'row'
            },
            {
              visibility: true,
              columns: [
                {
                  type: "label",
                  text: "Ends at",
                },
                {
                  type: "field",
                  name: "ends_at",
                },
                {
                  type: "label",
                  text: "End Time",
                },
                {
                  type: "field",
                  name: "ends_at_time",
                }
              ],
              type: 'row'
            },
            {
              visibility: true,
              columns: [
                {
                  type: "label",
                  text: "Repeat",
                },
                {
                  type: "field",
                  name: "repeating",
                }
              ]
            },
            {
              visibility: true,
              columns: [
                {
                  type: "label",
                  text: "Description",
                },
                {
                  type: "field",
                  name: "description",
                }
              ],
              type: 'column'
            },
            {
              visibility: true,
              columns: [
                {
                  type: "label",
                  text: "Location",
                },
                {
                  type: "field",
                  name: "location",
                }
              ],
              type: 'column'
            },
            {
              visibility: true,
              columns: [
                {
                  type: "label",
                  text: "Send reminder emails",
                },
                {
                  type: "field",
                  name: "automated_reminder_enabled",
                }
              ],
              type: 'row'
            }
          ],
          fields: [
            {
              label: "Event name",
              name: "name",
              type: "input",
              format: "text",
              placeholder: "Enter a name for your event",
              disabled: false
            },
            {
              label: "Start date",
              name: "starts_at",
              type: "input",
              format: "date",
              placeholder: "YYYY-MM-DD",
            },
            {
              label: "Start time",
              name: "starts_at_time",
              type: "input",
              format: "text",
              placeholder: "HH:MM",
            },
            {
              label: "End date",
              name: "ends_at",
              type: "input",
              format: "date",
              placeholder: "YYYY-MM-DD",
            },
            {
              label: "End time",
              name: "ends_at_time",
              type: "input",
              format: "text",
              placeholder: "HH:MM",
            },
            {
              label: "Repeat",
              name: "repeating",
              type: "checkbox",
              disabled: false
            },
            {
              label: "Description",
              name: "description",
              type: "textarea",
              disabled: false
            },
            {
              label: "Location",
              name: "location",
              type: "select",
              options: [],
              disabled: false
            },
            {
              label:"Send reminder emails",
              name: "automated_reminder_enabled",
              type: "checkbox",
              disabled: false
            }
          ]
        }
      },
      {
        id: "team_member_modal",
        visible: false,
        title: "Team Member Details",
        hasFooter: true,
        footerActions: [
          {
            id: "team_member_modal_cancel",
            label: "Close",
            type: "button",
            class: "btn text-btn mr-2",
            method: "hideModal('team_member_modal')",
            disabled: false
          },
          {
            id: "team_member_modal_promote",
            label: "Change Volunteer Status",
            type: "button",
            class: "btn create-btn",
            method: "changeVolunteerStatus('')",
            disabled: false
          }
        ],
        data: undefined
      },
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
  },
  created() { 
    this.initializeData();
  },
  watch: {
    'form.team': {
      handler() {
        console.log("loading state:", this.loading)
        if (this.loading) {
          return; // Skip processing if still loading
        }
  
        this.editing = true; // Perform the desired action
      },
      deep: true
    },
  },
  computed: {
    isAdmin() {
      // console.log("Checking if user is admin")
      return document.getElementById('main_page_content').getAttribute('data-is-admin');;
    },
    isLead() {
      const myTeamsLead = this.currentUser.associations.my_teams.items.map(item => item.hs_object_id);
      return myTeamsLead.includes(this.team.id);
    },
    activeTab() {
      // console.log("Getting active tab")
      return this.tabs.find(tab => tab.active);
    },
    filteredMessages() {
      // We need to filter out the replies item.reply = 1
      return this.messages.filter(message => message.reply === 0);
    },
    upcomingEvents() {
      const updatedEvents = this.events.map(event => {
        const startDateTime = moment(this.convertToISO8601(event.starts_at, event.starts_at_time));
        const endDateTime = moment(this.convertToISO8601(event.ends_at, event.ends_at_time));
        return {
          ...event,
          startDateTime,
          endDateTime,
        };
      });
      const now = moment();
      return updatedEvents.filter(event => event.endDateTime.isAfter(now))
        .sort((a, b) => a.startDateTime - b.startDateTime);
    },
    pastEvents() {
      const updatedEvents = this.events.map(event => {
        const startDateTime = moment(this.convertToISO8601(event.starts_at, event.starts_at_time));
        const endDateTime = moment(this.convertToISO8601(event.ends_at, event.ends_at_time));
        console.log(startDateTime, endDateTime);
        return {
          ...event,
          startDateTime,
          endDateTime,
        };
      });
    
      const now = moment();
      return updatedEvents.filter(event => event.endDateTime.isBefore(now))
                         .sort((a, b) => b.endDateTime - a.endDateTime); // Sort in descending order of end date-time
    }
  },
  methods: {
    redirectIfNotMember() {
      const enrolledTeamIds = this.currentUser.associations.my_teams.items.map(item => item.hs_object_id);
      const isMember = enrolledTeamIds.includes(this.team.id);
      if (!isMember) {
        window.location.href = `${window.location.origin}/my/teams`;
      }
    },
    initializeData() {
      this.redirectIfNotMember();
      this.editing = false;
      this.team = dataset.teamData;
      this.currentUser = dataset.userData;
      const { teamData } = dataset
      Object.keys(this.form.team).forEach(key => {
        if (teamData[key]) {
          this.form.team[key] = teamData[key]; 
        }
      });
      
      // if team.active is true, update the enrollment status button
      if (this.form.team.active) {
        const enrollmentStatusButton = this.lookupField("active");
        console.log(enrollmentStatusButton);
        enrollmentStatusButton.title = "Open";
        enrollmentStatusButton.label = "Close enrollment";
        enrollmentStatusButton.method = "closeEnrollment('')";
      }

      // Check if tab is visible and if not, update the first tab available as active
      const activeTab = this.tabs.find(tab => tab.active);
      if (!this.showTab(activeTab)) {
        const visibleTab = this.tabs.find(tab => this.showTab(tab));
        this.setActiveTab(visibleTab);
      }

      this.newResource.objectId = this.team.id;
      this.newResource.objectType = 'teams';
      this.getMembers();

      setTimeout(() => {
        this.loading = false;
      });
    },
    getMembers() {
      const data = {
        "teamId": this.team.id
      };

      $.ajax({
        type: 'POST',
        url: `${window.location.origin}/_hcms/api/team/getMembers`,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: (result) => {
          if (result.status === 'success') {
            result.contacts.sort((a, b) => {
              if (a.role === 'lead' && b.role !== 'lead') {
                return -1;
              } if (a.role !== 'lead' && b.role === 'lead') {
                return 1;
              } 
                if (a.firstname < b.firstname) {
                  return -1;
                } if (a.firstname > b.firstname) {
                  return 1;
                } 
                  if (a.lastname < b.lastname) {
                    return -1;
                  } if (a.lastname > b.lastname) {
                    return 1;
                  } 
                    return 0;
                  
                
              
            });
    
            // Push sorted members to the array
            result.contacts.forEach(member => {
              this.members.push(member);
            });
          } else {
            console.log(result.error);
          }
          setTimeout(() => {
            this.loading = false;
          }, 0)
        },
        error: (error) => {
          console.log(error);
          setTimeout(() => {
            this.loading = false;
          }, 0)
        }
      });
    },
    enableCommunication() {
      // console.log("enabling communication")
      this.form.team.communication_enabled = true;
      this.team.communication_enabled = true;
      this.save();
    }, 
    setSelect(fieldName, selectedValue) {
      // console.log(`set select ${fieldName} to ${selectedValue}`);
      this.$set(this.form.team, fieldName, selectedValue);
      // console.log(this.form.team);
    },    
    openEnrollment() {
      console.log("opening enrollment")
      this.form.team.active = true;
      const enrollmentStatusButton = this.lookupField("active");
      enrollmentStatusButton.title = "Open";
      enrollmentStatusButton.label = "Close enrollment";
      enrollmentStatusButton.method = "closeEnrollment('')";
      // trigger save
      this.save();
    },
    closeEnrollment() {
      console.log("closing enrollment");
      this.form.team.active = false;
      // TODO: COFIRM IF OC WANTS IT TO STILL DISPLAY IF NOT ACTIVE
      this.form.team.public = false;
      const enrollmentStatusButton = this.lookupField("active");
      enrollmentStatusButton.title = "Closed";
      enrollmentStatusButton.label = "Open enrollment";
      enrollmentStatusButton.method = "openEnrollment('')";
      // trigger save
      this.save();
    },
    save() {
      // close all modals if open
      this.modals = this.modals.map(modal => ({ ...modal, visible: false }));

      // Call the update team function
      console.log(`saving data for team ${this.team.id}`);
      console.log(this.form.team);
      const endpoint = `${window.location.origin}/_hcms/api/updateObject`;

      const formTeam = {...this.form.team};
      Object.keys(formTeam).forEach(key => {
        if (Array.isArray(formTeam[key])) {
          formTeam[key] = formTeam[key].join(';');
        }
      });

      // Prepare the data to be sent to the server
      const teamData = {
        objectType: 'teams',
        objectId: this.team.id,
        updateAssocation: false,
        assocations: [...(this.form.team.associations || [])],  // Convert observable to normal array
        properties: formTeam
      };

      // Submit the form data to the endpoint
      $.ajax({
        type: 'POST',
        url: endpoint,
        contentType: 'application/json',
        data: JSON.stringify(teamData),
        success: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.log(error);
        }
      });
    },
    changeVolunteerStatus() {
      const data = {
        teamId: this.team.id, 
        contactId: parseInt(this.currentData.hs_object_id),
        firstname: this.currentData.firstname, 
        contactEmail: this.currentData.email, 
        teamUrl: `${window.location.origin}/my/teams/${this.team.page_slug}`, 
        teamName: this.team.team_name,
        teamBannerUrl: this.team.featured_image
      }

      let state = 'promote';
      let endpoint = `${window.location.origin}/_hcms/api/team/promoteMember`
      if (this.currentData.role === 'lead') {
        state = 'demote';
        endpoint = `${window.location.origin}/_hcms/api/team/demoteMember`
      }

      $.ajax({
        type: 'POST',
        url: endpoint,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: (result) => {
          if (result.status === 'success') {
            console.log(result);
            if (state === 'promote') {
              this.currentData.role = 'lead';
            } else {
              this.currentData.role = 'member';
            }
            
          } else {
            console.log(result.error);
          }
          setTimeout(() => {
            this.loading = false;
          }, 0)
        },
        error: (error) => {
          console.log(error);
          setTimeout(() => {
            this.loading = false;
          }, 0)
        }
      });
    },
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
            window.location.href = `https://${window.location.hostname}/my/teams`
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
    getDataObject(data) {
      return JSON.stringify(data);
    }
  }
});