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
    loading: true,
    teams: [],
    teamFields: dataset.teamFields,
    includeClosed: false,
    currentView: dataset.currentView,
    currentUser: dataset.userData,
    filters: dataset.filters,
    isLoggedIn: false,
    searchQuery: '',
    defaultLabels: {
      serve_schedule: "Schedule",
      location: "Location",
      requires_experience: "Requires Experience",
      require_background_check: "Requires Background Check"
    },
    filterLabels: {
      serve_schedule: "Schedule",
      location: "Location",
      requires_experience: "Requires Experience",
      require_background_check: "Requires Background Check"
    },
    activeFilters: [],
    menus: [],
    activeMenu: '',
    modals: {},
    actionDrawers: {
      primary: false
    }
  },
  created() { 
    this.initializeData();
  },
  computed: {
    isAdmin() {
      // console.log("Checking if user is admin")
      return document.getElementById('main_page_content').getAttribute('data-is-admin');;
    },
    filteredTeams() {
      let filteredTeams = this.teams;
      
      if (this.activeFilters.length > 0) {
        this.activeFilters.forEach(filter => {
          if (filter.type === 'serve_schedule') {
            filteredTeams = filteredTeams.filter(team => 
              team.serve_schedule && team.serve_schedule.split(';').map(item => item.trim()).includes(filter.value)
            );
          } else {
            filteredTeams = filteredTeams.filter(team => team[filter.type] === filter.value);
          }
        });
      }
    
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filteredTeams = filteredTeams.filter(team => 
          team.team_name.toLowerCase().includes(query)
        );
      }
    
      return filteredTeams;
    }    
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
            limit: 100,
            orderBy: "team_name",
            properties: this.teamFields,
            filterGroups: [
              {
                filters: [
                  {
                    propertyName: "public",
                    operator: "EQ",
                    value: true
                  }
                ]
              }
            ]
          }
        }

        if (this.includeClosed) {
          const closedFilterGroup = {
            propertyName: "active",
            operator: "EQ",
            value: false
          }
          
          data.query.filterGroups[0].filters.push(closedFilterGroup);
        } else {
          const openFilterGroup = {
            propertyName: "active",
            operator: "EQ",
            value: true
          }
          
          data.query.filterGroups[0].filters.push(openFilterGroup);
        }
  
        $.ajax({
          type: 'POST',
          url: `${window.location.origin}/_hcms/api/team/getAll`,
          contentType: 'application/json',
          data: JSON.stringify(data),
          success: (result) => {
            if (result.status === 'success') {
              result.response.results.forEach(team => {
                const newTeam = {
                  id: team.id,
                  ...team.properties
                }
                this.teams.push(newTeam)
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
      }
      if (this.currentView === 'detail') {
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
    } 
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
    }
  }
});