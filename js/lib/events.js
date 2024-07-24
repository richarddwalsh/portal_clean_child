/* eslint-disable no-undef */
/* eslint-disable no-new */
Vue.config.devtools = true;
Vue.config.productionTip = true;
Vue.config.silent = false;

const targetData = document.getElementById('json-data');
const dataset = JSON.parse(targetData.textContent);

console.log("targetData", targetData);
console.log("dataset", dataset);

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
    currentUser: dataset.userData,
    isLoggedIn: false,
    household: {},
    members: [],
    events: [],
    event: {},
    filters: dataset.filters,
    defaultLabels: {
      campus: 'All Campuses',
      category: 'All Categories',
    },
    filterLabels: {
      campus: 'All Campuses',
      category: 'All Categories',
    },
    activeFilters: [],
    menus: [],
    activeMenu: '',
    modals: {
      detail: [
        {
          id: "event_register_modal",
          title: "Register for ",
          visible: false,
          hasFooterAction: true,
          footerActions: []
        },
        {
          id: "event_checkin_modal",
          title: "Check in for ",
          visible: false,
          hasFooterAction: true,
          footerActions: []
        }
      ],
      list: [],
    },
    showRegConfirmation: false
  },
  created() {
    this.initializeData();
  },
  computed: {
    filteredEvents() {
      console.log("filtering events");
      let filteredEvents = this.events;
      if (this.activeFilters.length > 0) {
        this.activeFilters.forEach(filter => {
          console.log(`Filter: ${filter}`);
          console.log(filter.type);
          filteredEvents = filteredEvents.filter(event => event[filter.type] === filter.value);
        });
      }
      return filteredEvents;
    },
    isRegisteredForEvent() {
      if (this.currentView === 'detail' && this.isLoggedIn) {
        // when currentUser.associations.events.items is empty match hs_object_id to event.id,if match return true
        if (this.currentUser.associations.events.items.length === 0) {
          return false;
        }
        const registered = this.currentUser.associations.events.items.find(item => item.hs_object_id === this.event.id);
        return !!registered;
      }
      return false;
    },
    canRegister() {
      // Can Register if:
      // - registration_status is open, or
      // - registration_open_date is today or the future, or
      // - registration_close_date is less than today
      if (this.currentView === 'detail') {
        moment.tz.add('America/Los_Angeles|PST PDT|80 70|0101|1Lzm0 1zb0 Op0');
        const now = moment();

        const registrationOpenDate = moment(this.convertTimestampToDate(this.event.registration_open_date, this.event.registration_open_time));
        const registrationCloseDate = moment(this.convertTimestampToDate(this.event.close_registration_date, this.event.close_registration_time));
        
        // if registrationOpenDate && registrationOpenDate are set use them
        // if not use registration status
        if (registrationOpenDate && registrationCloseDate) {
          return this.event.registration_status === 'open' || registrationOpenDate.isSameOrBefore(now) || registrationCloseDate.isBefore(now);
        }
        return this.event.registration_status === 'open';
      }
      return false
    },
    canCheckIn() {
      // Can Check In If:
      //  - this.isRegisteredForEvent is true, and
      // - the event ends in the future (or is ongoing)
      if (this.currentView === 'detail' && this.isLoggedIn) {
        moment.tz.add('America/Los_Angeles|PST PDT|80 70|0101|1Lzm0 1zb0 Op0');
        const now = moment();
        const endTime = moment(this.convertTimestampToDate(this.event.ends_at, this.event.ends_at_time));
        return this.isRegisteredForEvent && endTime.isSameOrAfter(now);
      }
      return false;
    },
    registrationBarText() {
      // If I can register, "Registration is open"
      // If I cannot register "Registration is closed."
      // If I am registered but cannot check in, "You are registered for this event."
      // If I can check in, "You are registered for this event. Check in now."
      if (this.currentView === 'detail') {
        if (this.canRegister) {
          return 'Registration is open';
        }
        if (this.isRegisteredForEvent) {
          if (this.canCheckIn) {
            return 'You are registered for this event. Check in now.';
          }
          return 'You are registered for this event.';
        }
        return 'Registration is closed.';
      }
      return 'Registration is closed';
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
      console.log(this.currentUser);
      if (Object.prototype.hasOwnProperty.call(this.currentUser, 'hs_object_id')) {
        // Your code goes here
        this.isLoggedIn = true;
      }
  
      if (this.currentView === 'list') {
        const data = {
          query: {
            limit: 100,
            properties: [
              "name",
              "description",
              "dynamic_page_slug",
              "banner_image",
              "featured",
              "registration_status",
              "include_on_signup_page",
              "starts_at",
              "starts_at_time",
              "ends_at",
              "ends_at_time",
              "campus",
              "category"
            ],
            filterGroups: [
              {
                filters: [
                  {
                    propertyName: "include_on_signup_page",
                    operator: "NOT_IN",
                    values: [
                      "Do not include (direct link only)"
                    ]
                  }
                ]
              }
            ]
          }
        }
  
        $.ajax({
          type: 'POST',
          url: `${window.location.origin}/_hcms/api/event/getAll`,
          contentType: 'application/json',
          data: JSON.stringify(data),
          success: (result) => {
            if (result.status === 'success') {
              result.response.results.forEach(event => {
                const newEvent = {
                  id: event.id,
                  ...event.properties
                }
                this.events.push(newEvent)
              });
              this.filters.campus = this.filters.campus.sort((a, b) => a.displayOrder - b.displayOrder);
              this.filters.category = this.filters.category.sort((a, b) => a.displayOrder - b.displayOrder);
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
        this.event = {
          ...dataset.event,
          selections: dataset.selections,
          initialSelection: dataset.selections[0],
          minGradeOptions: dataset.minGradeOptions,
          maxGradeOptions: dataset.maxGradeOptions,
          attendees: []
        }

        // Get the currentUser's households and add them to the members array
        const households = this.currentUser.associations.households.items;
        households.forEach(household => {
          const members = household.associations.members.items.filter(member => member.hs_object_id !== this.currentUser.hs_object_id);
          this.members = [...this.members, ...members];
        });

        // filter our current user from the members array, we already add them separately
        this.members = this.members.filter(member => member.email !== this.currentUser.email);
  
        if (this.members) {
          this.event.registrations = this.members
        }

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
    toggleModal(modalId, data) {
      const modal = this.modals.detail.find(m => m.id === modalId);
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
    addParticipant() {
      const newReg = {
        firstname: '',
        lastname: '',
        email: '',
        address: '',
        addres2: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        gender: '',
        household: false,
        relationship: '',
        newMember: true
      }
      this.event.attendees.push(newReg);
    },
    toggleAttendee(member) {
      // find the member by hs_object_id in the event.attendees array
      // - if they dont exist, add them
      // - if they do exist, remove them
      const index = this.event.attendees.findIndex(reg => reg.hs_object_id === member.hs_object_id);
      if (index === -1) {
        const newReg = {
          ...member,
          newMember: false
        };
        this.event.attendees.push(newReg);
      } else {
        this.event.attendees.splice(index, 1);
      }
    },
    toggleNewAttendee(index) {
      this.event.attendees[index].newMember = !this.event.attendees[index].newMember;
    },
    isAttending(member) {
      // Check if member hs_object_id is in event.atteendees
      const index = this.event.attendees.findIndex(reg => reg.hs_object_id === member.hs_object_id);
      return index > -1;
    },
    confirmRegistration() {
      console.log('confirmRegistration');
      // Loop through attendees
      // - we need to create a contact for each attendee that is newMember = true
      // - we need to pass each contact to event register api
      // Then show success message
      const {attendees} = this.event;
      const newAttendees = attendees.filter(reg => reg.newMember);
      const existingAttendees = attendees.filter(reg => !reg.newMember);
      console.log("newAttendees", newAttendees);
      console.log("existingAttendees", existingAttendees);
      const newContactPromises = [];

    },
    confirmCheckIn() {

    }
  }
});