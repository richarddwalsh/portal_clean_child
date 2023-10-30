/* eslint-disable no-undef */
/* eslint-disable no-new */
Vue.config.devtools = true;
Vue.config.productionTip = true;
Vue.config.silent = false;

const targetData = document.getElementById('json-data');
const dataset = JSON.parse(targetData.textContent);

const emptyEvent = {
  event_name: '',
  starts_at: '',
  starts_at_time: '',
  ends_at: '',
  ends_at_time: '',
  repeating: false,
  description: '',
  location: '',
  send_reminder_emails: '',
}

const emptyResource = {
  objectId: '',
  objectType: '',
  name: '',
  description: '',
  type: '',
  binary: ''
}

new Vue({
  delimiters: ['[[', ']]'],
  el: '#main_page_content',
  data: {
    currentUser: dataset.userData,
    team: dataset.teamData,
    administrators: [],
    messages: dataset.messages.objects,
    resources: dataset.resources.objects,
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
        active: false,
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
        active: true,
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
        footerActions: [],
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
                  type: "input",
                  name: "event_name",
                  placeholder: "Enter a name for your event",
                  format: "text",
                  value: ""
                }
              ]
            }
          ]
        }
      }
    ],
  },
  created() { 
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
  },
  computed: {
    isAdmin() {
      // console.log("Checking if user is admin")
      return document.getElementById('main_page_content').getAttribute('data-is-admin');;
    },
    activeTab() {
      // console.log("Getting active tab")
      return this.tabs.find(tab => tab.active);
    },
    filteredMessages() {
      // We need to filter out the replies item.reply = 1
      return this.messages.filter(message => message.reply === 0);
    }
  },
  methods: {
    setActiveTab(selectedTab) {
      // console.log(`setting active tab to ${selectedTab}`)
      const updatedTabs = this.tabs.map(tab => ({
        ...tab,
        active: tab === selectedTab,
      }));
      this.tabs = updatedTabs;
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
    showTab(tab) {
      // console.log(`showing tab ${tab.id}`)
      if (tab.requiresAdmin && !this.isAdmin) {
        return false
      }

      if (tab.visibility && !this.isAdmin) {
        // eslint-disable-next-line no-new-func
        const result = new Function('form', `with(form) { return ${tab.visibility}; }`)(this.form);
        return result
      }

      return true
    },
    showModal(modalId) {
      // console.log(`showing modal ${modalId}`);
      this.modals = this.modals.map(modal => {
        if (modal.id === modalId) {
          return { ...modal, visible: true };
        } 
        return { ...modal, visible: false };
      });
    },
    hideModal(modalId) {
      console.log(`hiding modal ${modalId}`);
      this.modals = this.modals.map(modal => {
        if (modal.id === modalId) {
          return { ...modal, visible: false };
        } 
        return modal;
      });
    },
    lookupField(fieldName, modalId) {
      if (modalId) {
        // Get the modal
        const modal = this.modals.find(m => m.id === modalId);
        // Get the field from modal.form.fields
        return modal.form.fields.find(field => field.name === fieldName);
      }

      // Okay now we have to parse through sections to find this field which we have accomodate for columns,panes and rows
      let field;

      try {
        this.sections.forEach(section => {
          section.rows.forEach(row => {
            row.columns.forEach(column => {
              column.panes.forEach(pane => {
                field = pane.fields.find(f => f.name === fieldName);
                if (field) {
                  throw new Error('Field found');
                }
              });
            });
          });
        });
      } catch (e) {
        if (e.message !== 'Field found') {
          throw e;
        }
      }

      return field;
    },
    evaluateCondition(condition) {
      // console.log(`evaluating condition ${condition}`)
      // eslint-disable-next-line no-new-func
      const result = new Function('form', `with(form) { return ${condition}; }`)(this.form);
      // console.log(`evaluating condition ${condition}: ${result}`)
      return result;
    },
    callDynamicMethod(methodCall) {
      console.log(`calling dynamic method ${methodCall}`);
      const match = methodCall.match(/^([a-zA-Z0-9_]+)\(('([^']*)')\)$/);
      if (match) {
        const methodName = match[1];
        const arg = match[3];
        if (this[methodName]) {
          this[methodName](arg);
        } else {
          console.warn(`Method ${methodName} does not exist`);
        }
      } else {
        console.warn(`Invalid method call format: ${methodCall}`);
      }
    },
    formatDateIfNeeded(fieldName, fieldValue) {
      if (fieldName === 'auto_close_date') {
        return moment(Number(fieldValue)).format('YYYY-MM-DD');
      }
      return fieldValue;
    },
    formatDate(value, format) {
      console.log(value, format);
      return moment(value).format(format);
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
    leaveTeam(teamId, userId) {
      console.log(`leaving team ${teamId}`)
      const url = `/api/teams/${teamId}/members/${userId}`;
      console.log(teamId, userId, url);
    },
    addImage() {
      console.log("adding image")
      // Call the add image function
    },
    archive() {
      console.log("archiving team")
      // Call the archive team function
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
    createEvent() {
      console.log("creating event")
    },
    cancelEvent(eventId) {
      console.log(`cancelling event ${eventId}`)
    },
    getInitials(name) {
      const names = name.split(' ');
      let initials = '';
      names.forEach(n => {
        initials += n.charAt(0).toUpperCase();
      });
      return initials;
    },
    getMessageReplies(messageId) {
      console.log(`getting replies for message ${messageId}`);
      const replies = this.messages.filter(message => message.reply === 1 && message.original_id === messageId);
      return replies.sort((a, b) => {
        const aDate = new Date(a.date_added);
        const bDate = new Date(b.date_added);
        return bDate - aDate;
      });
    },
    submitMessage(reply,originalId) {
      const message = {
        name: this.team.team_name,
        message: this.newReply,
        reply,
        // eslint-disable-next-line no-underscore-dangle
        createdById: Number(this.currentUser._metadata.id),
        createdByName: `${this.currentUser.firstname} ${this.currentUser.lastname}`,
        createByEmail: this.currentUser.email,
        objectType: 'teams',
        objectId: this.team.id
      };

      if (originalId) {
        message.original_id = originalId;
      }
      
      $.ajax({
        type: 'POST',
        url: `${window.location.origin}/_hcms/api/addMessage`,
        contentType: 'application/json',
        data: JSON.stringify(message),
        success: (response) => {
          console.log(response);
          if (response.status === 'success') {
            this.newReply = '';
            this.messages.unshift(response.response.values);
          }
        },
        error: (error) => {
          console.log(error);
        }
      });
    },
    convertFileToBinary(event) {
      return new Promise((resolve, reject) => {
        // Get the selected file from the input element
        const file = event.target.files[0];

        console.log(file);
        
        // Create a new FileReader instance
        const reader = new FileReader();
        
        // Setup the FileReader
        reader.onload = (e) => {
          // Get the binary data once the file is loaded
          const binaryString = e.target.result;
    
          // Create an object to hold the file information
          const fileInfo = {
            binary: binaryString,
            type: file.type,
            name: file.name
          };

          this.newResource.name = file.name;
          this.newResource.type = file.type;
          this.newResource.binary = binaryString;
          
          // Resolve the promise with the fileInfo
          resolve(fileInfo);
        };
        
        reader.onerror = () => {
          reject(new Error("Failed to read file"));
        };
        
        // Read the file as binary string
        reader.readAsBinaryString(file);

        this.fileInfoReady = true;
      });
    },    
    addResource() {
      console.log("creating resource");
      const resourceData = {...this.newResource};
      resourceData.objectId = this.team.id;
      resourceData.objectType = 'teams';

      // Send the resource to API
      const endpoint = `${window.location.origin}/_hcms/api/addResource`;
      $.ajax({
        type: 'POST',
        url: endpoint,
        contentType: 'application/json',
        data: JSON.stringify(resourceData),
        success: (response) => {
          console.log(response);
          if (response.status === 'success') {
            console.log(response);
            // this.resources.unshift(response.response.values);
            this.newResource = emptyResource;
            this.fileInfoReady = false;
          }
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }
});