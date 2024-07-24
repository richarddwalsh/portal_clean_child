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
    attendees: [],
    currentView: dataset.currentView,
    currentCategory: dataset.currentCategory,
    categories: dataset.categories,
    currentUser: dataset.userData,
    isLoggedIn: false,
    filters: dataset.filters,
    searchQuery: '',
    defaultLabels: {
      groupType: "Group Type",
      location: "Location Type",
      frequency: "Frequency",
      targetAudience: "Target Audience",
      neighborhood: "Neighborhood | Area",
      timeZone: "Time Zone",
      dayOfWeek: "Day of Week",
      timeOfDay: "Time of Day",
    },
    filterLabels: {
      groupType: "Group Type",
      location: "Location Type",
      frequency: "Frequency",
      targetAudience: "Target Audience",
      neighborhood: "Neighborhood | Area",
      timeZone: "Time Zone",
      dayOfWeek: "Day of Week",
      timeOfDay: "Time of Day",
    },
    activeFilters: [],
    filterTypeMapping: {
      groupType: 'group_type',
      location: 'location_type_preference',
      frequency: 'frequency',
      targetAudience: 'target_audience',
      neighborhood: 'neighborhood___area',
      timeZone: 'time_zone',
      dayOfWeek: 'day_of_week',
      timeOfDay: 'time_of_day'
    },
    menus: [],
    groups: [],
    group: {},
    activeMenu: '',
    modals: {
      detail: [
        {
          id: 'group_join_modal',
          title: 'Join Group',
          visible: false,
          hasFooterAction: true,
          footerActions: [
            { label: 'Cancel', action: 'toggleModal' },
            { label: 'Join', action: 'joinGroup' }
          ]
        },
        {
          id: 'group_message_modal',
          title: 'Send Message',
          visible: false,
          hasFooterAction: true,
          footerActions: [
            { label: 'Cancel', action: 'toggleModal' },
            { label: 'Submit', action: 'sendMessage' }
          ]
        }
      ],
      list: []
    },
    showRegConfirmation: false
  },
  created() {
    this.initializeData();
  },
  computed: {
    contactInitials() {
      let initials = '';
      let firstname = this.currentUser.firstname;
      let lastname = this.currentUser.lastname;
      if (firstname) initials += firstname.charAt(0);
      if (lastname) initials += lastname.charAt(0);
      return initials.toUpperCase();
    },
    filteredGroups() {
      console.log("filtering groups");
      let filteredGroups = this.groups;
      if (this.activeFilters.length > 0) {
        this.activeFilters.forEach(filter => {
          console.log(`Filter: ${filter}`);
          const property = this.filterTypeMapping[filter.type] || filter.type;
          console.log(property, filter.value);
          filteredGroups = filteredGroups.filter(group => group[property] === filter.value);
        });
      }
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filteredGroups = filteredGroups.filter(group => 
          group.name.toLowerCase().includes(query) || 
          group.description.toLowerCase().includes(query)
        );
      }
      
      return filteredGroups;
    },
  },
  filters: {  
    formatDate(date, time, format) {
      if (date && time) {
        // Parse the date timestamp to get a moment object at midnight
        const dateMoment = moment.utc(date).startOf('day');
        
        // Parse the time string, we assume that the time is in h:mm A format
        const timeMoment = moment(time, 'h:mm A');
    
        // Combine the date part with the time part
        const combinedMoment = dateMoment
          .hour(timeMoment.hour())
          .minute(timeMoment.minute());
    
        // Format the combined moment object
        return combinedMoment.format(format);
      }
    
      if (date && !time) {
        // Format the date part only
        return moment(date).format(format);
      }
    
      if (!date && time) {
        // Format the time part only, we assume that the time is in h:mm A format
        return moment(time, 'h:mm A').format(format);
      }
    
      return '';
    },
    
  },
  methods: {
    initializeData() {
      if (Object.prototype.hasOwnProperty.call(this.currentUser, 'hs_object_id')) {
        // Your code goes here
        this.isLoggedIn = true;
      }
      
      if (this.currentView === 'list') {
        const data = {
          query: {
            "limit": 100,
            "orderBy": "name",
            "properties": [
              "announcement",
              "archive_status",
              "archived_at",
              "auto_close",
              "auto_close_by_count",
              "auto_close_by_date",
              "auto_close_count",
              "auto_close_date",
              "communication_enabled",
              "contact_email",
              "day_of_week",
              "description",
              "description_html",
              "dynamic_page_slug",
              "enrollment_open",
              "enrollment_strategy",
              "events_visibility",
              "featured_image",
              "frequency",
              "group_id",
              "group_type",
              "header_image",
              "leader_email",
              "leader_email_2",
              "leader_email_3",
              "leader_name",
              "leader_name_2",
              "leader_name_3",
              "leader_name_visible_on_public_page",
              "location_type_preference",
              "meeting_end_time",
              "meeting_schedule_frequency",
              "meeting_schedule_frequency_count",
              "meeting_schedule_frequency_day",
              "meeting_schedule_frequency_month",
              "meeting_schedule_frequency_weekday",
              "meeting_start_time",
              "members_can_create_forum_topics",
              "membership_count",
              "name",
              "neighborhood___area",
              "planning_center_created_at",
              "planning_center_updated_at",
              "public_church_center_web_url",
              "publicly_display_meeting_schedule",
              "publicly_visible",
              "reminder_email_frequency",
              "request_event_attendance_from_leaders",
              "schedule",
              "send_admin_alert",
              "send_admin_alert_count",
              "send_reminder_emails",
              "show_event_calendar",
              "target_audience",
              "time_of_day",
              "time_zone",
              "virtual_location_url",
              "visibility",
              "widget_status"
            ],
            "filterGroups": [
              {
                "filters": [
                  {
                    "propertyName": "category",
                    "operator": "EQ",
                    "value": this.currentCategory
                  },
                  {
                    "propertyName": "visibility",
                    "operator": "EQ",
                    "value": true
                  }
                ]
              }
            ]
          }
        }
  
        $.ajax({
          type: 'POST',
          url: `${window.location.origin}/_hcms/api/group/getAll`,
          contentType: 'application/json',
          data: JSON.stringify(data),
          success: (result) => {
            console.log(result);
            if (result.status === 'success') {
              result.response.results.forEach(group => {
                const newGroup = {
                  id: group.id,
                  ...group.properties
                }
                this.groups.push(newGroup)
              });
                  
              this.filters.groupType = this.filters.groupType.sort((a, b) => a.displayOrder - b.displayOrder);
              this.filters.location = this.filters.location.sort((a, b) => a.displayOrder - b.displayOrder);
              this.filters.frequency = this.filters.frequency.sort((a, b) => a.displayOrder - b.displayOrder);
              this.filters.targetAudience = this.filters.targetAudience.sort((a, b) => a.displayOrder - b.displayOrder);
              this.filters.neighborhood = this.filters.neighborhood.sort((a, b) => a.displayOrder - b.displayOrder);
              this.filters.timeZone = this.filters.timeZone.sort((a, b) => a.displayOrder - b.displayOrder);
              this.filters.dayOfWeek = this.filters.dayOfWeek.sort((a, b) => a.displayOrder - b.displayOrder);
              this.filters.timeOfDay = this.filters.timeOfDay.sort((a, b) => a.displayOrder - b.displayOrder);
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
      }
      if (this.currentView === 'detail') {
        console.log("detail view");
        this.group = {
          ...dataset.group,
        }
        
        const enrolledGroupIds = this.currentUser.associations.groups.items.map(item => item.hs_object_id);
        this.group.currentlyEnrolled = enrolledGroupIds.includes(this.group.id);

        setTimeout(() => {
          this.loading = false;
        }, 0)
      };
    },
    applyFilter(type, value) {
      console.log(`Apply filter: ${type} ${value}`);
      // Update the filter label or reset to default if value is empty
      this.filterLabels[type] = value || this.defaultLabels[type];
  
      // Find the filter index just once
      const index = this.activeFilters.findIndex(filter => filter.type === type);
  
      if (value) {
        // If there's a value, either update the existing filter or add a new one
        if (index > -1) {
          // Filter exists, update value
          this.$set(this.activeFilters, index, { type, value });
        } else {
          // Filter does not exist, add it
          this.activeFilters.push({ type, value });
        }
      } else {
        // If the value is empty, remove the filter from active filters if it exists
        if (index > -1) {
          this.activeFilters.splice(index, 1);
        }
        // Reset the filter label to default
        this.filterLabels[type] = this.defaultLabels[type];
      }
  
      // Reset the active menu
      this.activeMenu = '';
    },
    updateSearchQuery(event) {
      this.searchQuery = event.target.value;
    },
    toggleModal(modalId, data) {
      console.log(modalId, data);
      const modal = this.modals.detail.find(m => m.id === modalId);
      console.log(modal);
      modal.visible = !modal.visible;
      if (data) {
        modal.data = data;
      }
    },
    getAvatar(contact) {
      if (contact) {
        const names = [
          contact.firstname,
          contact.lastname,
        ];
        let initials = '';
        names.forEach(n => {
          initials += n.charAt(0).toUpperCase();
        });
        return initials;
      }
      return '';
    },
    joinGroup() {
      console.log("joinGroup triggered");
      
      const data = {
        groupId: this.group.id,
        groupName: this.group.name,
        groupUrl: `http://${window.location.host}/my/groups/${this.group.dynamic_page_slug}`,
        groupBannerUrl: this.group.featured_image,
        contactId: this.currentUser._metadata.id,
        firstname: this.currentUser.firstname,
        lastname: this.currentUser.lastname,
        contactEmail: this.currentUser.email
      }
      
      $.ajax({
          type: 'POST',
          url: `${window.location.origin}/_hcms/api/group/join`,
          contentType: 'application/json',
          data: JSON.stringify(data),
          success: (result) => {
            if (result.status === "success") {
              this.group.currentlyEnrolled = true; 
              this.toggleModal('group_join_modal');
            }
          },
          error: (error) => {
            console.error(error);
          }
        });
             
    },
    sendMessage() {
      console.log("sendMessage triggered");
    }    
  }
});