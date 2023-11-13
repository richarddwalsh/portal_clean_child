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
    attendees: [],
    currentView: dataset.currentView,
    currentUser: dataset.userData,
    isLoggedIn: false,
    household: {},
    members: [],
    events: [],
    event: {},
    filters: {
      campus: [],
      category: [],     
    },
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
    console.log('created');
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
            this.events = result.response.results;
            this.filters = result.response.filters;
            // sort filters by displayOrder
            this.filters.campus = this.filters.campus.sort((a, b) => a.displayOrder - b.displayOrder);
            this.filters.category = this.filters.category.sort((a, b) => a.displayOrder - b.displayOrder);
          } else {
            console.log(result.error);
          }
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
    if (this.currentView === 'detail') {
      this.event = {
        ...dataset.event,
        selections: dataset.selections,
        initialSelection: dataset.selections[0],
        minGradeOptions: dataset.minGradeOptions,
        maxGradeOptions: dataset.maxGradeOptions,
        attendees: []
      }

      if (this.members) {
        this.event.registrations = this.members
      }
    };
  },
  computed: {
    filteredEvents() {
      let filteredEvents = this.events;
      if (this.activeFilters.length > 0) {
        this.activeFilters.forEach(filter => {
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

        // ex: registration_open_date "1698883200000", registration_open_time "12:00 AM"
        const openDate = `${moment.utc(this.event.registration_open_date).format('YYYY-MM-DD').toString()} ${this.event.registration_open_time}`;
        const openTime = moment(openDate);
        const closeDate = `${moment.utc(this.event.registration_close_date).format('YYYY-MM-DD').toString()} ${this.event.registration_close_time}`;
        const closeTime = moment(closeDate);
        return this.event.registration_status === 'open' || openTime.isSameOrBefore(now) || closeTime.isBefore(now);
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
        const endDate = `${moment.utc(this.event.ends_at).format('YYYY-MM-DD').toString()} ${this.event.ends_at_time}`;
        const endTime = moment(endDate);
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
    getInitials() {
      if (this.currentUser) {
        const names = [
          this.currentUser.firstname,
          this.currentUser.lastname,
        ];
        let initials = '';
        names.forEach(n => {
          initials += n.charAt(0).toUpperCase();
        });
        return initials;
      }
      return '';
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
    applyFilter(type, value) {
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