/* eslint-disable no-undef */
/* eslint-disable no-new */
Vue.config.devtools = true;
Vue.config.productionTip = true;
Vue.config.silent = false;

const targetData = document.getElementById('json-data');
const dataset = JSON.parse(targetData.textContent);

new Vue({
  delimiters: ['[[', ']]'],
  el: '#main_page_content',
  data: {
    loading: true,
    currentUser: dataset.userData,
    group: dataset.groupData,
    events: {
      upcoming: dataset.upcomingEventsData,
      past: dataset.pastEventsData,
    },
    messages: dataset.messages.objects,
    resources: dataset.resources.objects,
    newEvent: {},
    newReply: "",
    showComposer: false,
    categoryData: dataset.categoryData,
    uneditableFields: [
      "id",
      "hs_object_id",
      "group_id",
      "hs_lastmodifieddate",
      "hs_updated_by_user_id",
      "group_category",
      "hs_object_source_id",
      "hs_created_by_user_id",
      "hs_createdate",
      "hs_object_source",
      "hs_object_source_user_id",
      "hs_user_ids_of_all_owners",
      "hubspot_owner_assigneddate",
      "number_of_associated_contacts",
    ],
    administrators: [],
    form: {
      group: { },
    },
    group_category: null,
    tabs: [
      { 
        id: 'messaging',
        label: "Messaging",
        active: true,
        requiresAdmin: false
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
        id: "group-details-0",
        maxCols: 2,
        showSave: true,
        rows: [
          {
            columns: [
              {
                panes: [
                  {
                    id: "group-details-0-basic-settings",
                    title: "Basic info",
                    fields: [
                      {
                        label: "Group Name",
                        name: "name",
                        property: "name",
                        type: "input",
                        format: "text",
                        plaeholder: "Enter a name for your group"
                      },
                      {
                        label: "Group Category",
                        name: "group_category",
                        assoication: "group_categories",
                        type: "select",
                        options: [],
                      },
                      {
                        label: "Image",
                        name: "feature_image",
                        property: "feature_image",
                        type: "upload",
                      }
                    ]
                  }
                ],
              },
              {
                panes: [
                  {
                    id: "group-details-0-messaging-settings",
                    title: "Messaging",
                    fields: [
                      {
                        label: "Enable Group Messaging",
                        name: "communication_enabled",
                        type: "checkbox",
                        notice: "Names of each member will be visible to other group members.",
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
                            checked: false,
                          }
                        ]
                      }
                    ]
                  },
                  {
                    id: "group-details-0-helper-settings",
                    title: "Contact person for leader",
                    fields: [
                      {
                        label: "Leader replies to",
                        name: "hubspot_owner_id",
                        type: "select",
                        options: []
                      }
                    ]
                  },
                  {
                    id: "group-details-0-attendance-settings",
                    title: "Attendance reminder",
                    fields: [
                      {
                        label: "Ask leaders to take attendance",
                        name: "request_event_attendance_from_leaders",
                        type: "checkbox",
                        disabled: false
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
      },
      {
        id: "group-details-1",
        title: "Promote on Portal",
        subtitle: "Help potential members find and learn about the group.",
        maxCols: 2,
        showSave: true,
        rows: [
          {
            columns: [
              {
                panes: [
                  {
                    id: "group-details-1-description-settings",
                    title: "Description",
                    fields: [
                      {
                        name: "description",
                        type: "textarea",
                        disabled: false
                      }
                    ]
                  },
                  {
                    id: "group-details-1-tag-settings",
                    fields: [
                      {
                        label: "Group type",
                        name: "group_type",
                        type: "select",
                        options: dataset.groupTypes,
                        disabled: false
                      },
                      {
                        label: "Target Audience",
                        name: "target_audience",
                        type: "select",
                        options: dataset.targetAudiences,
                        disabled: false
                      },
                      {
                        label: "Neighborhood | Area",
                        name: "neighborhood___area",
                        type: "select",
                        options: dataset.neighborhoodAreas,
                        disabled: false
                      },
                      {
                        label: "Timezone",
                        name: "time_zone",
                        type: "select",
                        options: dataset.timeZones,
                        disabled: false
                      },
                      {
                        label: "Day of the week",
                        name: "day_of_week",
                        type: "select",
                        options: dataset.daysOfWeek,
                        disabled: false
                      },
                      {
                        label: "Time of day",
                        name: "time_of_day",
                        type: "select",
                        options: dataset.timesOfDay,
                        disabled: false
                      },
                      {
                        label: "Frequency",
                        name: "frequency",
                        type: "select",
                        options: dataset.frequencies,
                        disabled: false
                      }
                    ]
                  }
                ] 
              },
              {
                panes: [
                  {
                    id: "group-details-1-listing-settings",
                    title: "Display on listed page",
                    fields: [
                      {
                        label: "Group contact",
                        name: "contact_email",
                        type: "input",
                        format: "text",
                        disabled: false
                      },
                      {
                        label: "Show leader's name",
                        name: "leader_name_visible_on_public_page",
                        type: "checkbox",
                        disabled: false
                      },
                      {
                        label: "Show event calendar",
                        name: "show_event_calendar",
                        type: "checkbox",
                        disabled: false
                      },
                      {
                        label: "Show meeting schedule",
                        name: "publicly_display_meeting_schedule",
                        type: "checkbox",
                        disabled: false
                      },
                      {
                        label: "Schedule",
                        name: "schedule",
                        type: "input",
                        format: "text",
                        disabled: true
                      },
                    ]
                  }
                ] 
              }
            ]
          }
        ]
      },
      {
        id: "group-details-2",
        title: "Location",
        maxCols: 1,
        showSave: true,
        rows: [
          {
            columns: [
              {
                panes: [
                  {
                    id: "group-details-2-locatoon-settings",
                    fields: [
                      {
                        cols: 2,
                        label: "Type of location",
                        name: "location_type_preference",
                        type: "radio",
                        options: [
                          {
                            id: "location_type_preference_physical",
                            label: "Physical address",
                            value: "Physical",
                            checked: false
                          },
                          {
                            id: "location_type_preference_virtual",
                            label: "Virtual (link)",
                            value: "Virtual",
                            checked: false
                          }
                        ],
                        disabled: false
                      },
                      {
                        name: "location",
                        type: "select",
                        placeholder: "Enter a location",
                        visibility: "form.group.location_type_preference === 'Physical'",
                        options: dataset.locations,
                        disabled: false
                      },
                      {
                        name: "virtual_location_url",
                        type: "input",
                        format: "text",
                        placeholder: "https://",
                        visibility: "form.group.location_type_preference === 'Virtual'",
                        disabled: false
                      }
                    ],
                  }
                ] 
              }
            ]
          }
        ]
      },
      {
        id: "group-details-3",
        title: "Availability on Portal",
        subtitle: "Once ready, choose how and when members join the group.",
        maxCols: 2,
        showSave: true,
        rows: [
          {
            columns: [
              {
                panes: [
                  {
                    id: "group-details-3-enrollment-status-settings",
                    title: "Enrollment status",
                    fields: [
                      {
                        title: "Closed",
                        label: "Open enrollment",
                        type: "action",
                        method: "openEnrollment",
                        disabled: false
                      },
                    ]
                  },
                  {
                    id: "group-details-3-enrollment-settings",
                    title: "Enrollment settings",
                    fields: [
                      {
                        id: "enrollment_strategy",
                        label: "Open strategy",
                        name: "enrollment_strategy",
                        type: "radio-detail",
                        options: [
                          {
                            id: "enrollment_strategy_request_to_join",
                            label: "Request to join",
                            value: "Request to Join",
                            badge: "Recommended",
                            class: "info-alert",
                            hint: 'A potential member will see a "request to join" button on the group\'s publicly listed page. A leader will need to accept them before they become a member.'
                          },
                          {
                            id: "enrollment_strategy_open_sign_up",
                            label: "Open signup",
                            value: "Open Sign Up",
                            badge: "Not recommended",
                            class: "error-alert",
                            hint: "Any person will be able to automatically add themselves to a group. They will immediately have access to the group's location, calendar, resources, messaging (if enabled), and personal information (if chosen to share), without any protection from the leader. This creates security risks as malicious people can exploit the group's information."
                          }
                        ],
                        disabled: false
                      },
                      {
                        id: "auto_close",
                        type: "hidden",
                        name: "auto_close",
                        disabled: false
                      },
                      {
                        name: "auto_close_by_date",
                        type: "checkbox",
                        label: "Close automatically by date",
                        disabled: false
                      },
                      {
                        name: "auto_close_date",
                        type: "input",
                        format: "date",
                        placeholder: "YYYY-MM-DD",
                        visibility: "form.group.auto_close_by_date",
                        disabled: false
                      },
                      {
                        name: "auto_close_by_count",
                        type: "checkbox",
                        label: "Close automatically by membership count",
                        disabled: false
                      },
                      {
                        name: "auto_close_count",
                        type: "input",
                        format: "number",
                        placeholder: "0",
                        visibility: "form.group.auto_close_by_count",
                        disabled: false
                      },
                      {
                        name: "send_admin_alert",
                        type: "checkbox",
                        label: "Send admin alert when membership count reaches...",
                        disabled: false
                      },
                      {
                        name: "send_admin_alert_count",
                        type: "input",
                        format: "number",
                        placeholder: "0",
                        visibility: "form.group.send_admin_alert",
                        disabled: false
                      }
                    ]
                  }
                ] 
              },
              {
                panes: [
                  {
                    id: "group-details-3-visibility-settings",
                    title: "visibility",
                    fields: [
                      {
                        cols: 2,
                        label: "Visibility on Portal",
                        name: "publicly_visible",
                        type: "radio",
                        options: [
                          {
                            id: "publicly_visible_yes",
                            label: "Listed",
                            value: true,
                            checked: false
                          },
                          {
                            id: "publicly_visible_no",
                            label: "Unlisted",
                            value: false,
                            checked: false
                          }
                        ],
                        disabled: false
                      },
                    ]
                  }
                ] 
              }
            ]
          }
        ]
      },
      {
        id: "group-details-4",
        title: "Event defaults",
        subtitle: "Make future event creation easy by setting up defaults for new events.",
        maxCols: 2,
        showSave: true,
        rows: [
          {
            columns: [
              {
                panes: [
                  {
                    id: "group-details-4-event-settings",
                    title: "Event reminder",
                    fields: [
                      {
                        name: "send_reminder_emails",
                        type: "checkbox",
                        label: "Send reminder emails",
                        disabled: false
                      },
                      {
                        name: "reminder_email_frequency",
                        type: "select",
                        label: "This sets the default for new events. If you want to change existing reminders edit the event directly.",
                        labelClass: "fs-4 fw-400",
                        options: dataset.reminderEmailFrequencies,
                        visibility: "form.group.send_reminder_emails",
                        disabled: false
                      },
                    ]
                  }
                ]
              },
              {
                panes: [
                  {
                    id: "group-details-4-meeting-settings",
                    title: "Meeting schedule",
                    fields: [
                      {
                        title: "Set Default meeting schedule.",
                        type: "action",
                        label: "Add meeting schedule",
                        disabled: false,
                        method: "showModal('meeting_schedule_modal')",
                      }
                    ]
                  }
                ]
              },
            ]
          }
        ]
      }       
    ],
    modals: [
      {
        id: "meeting_schedule_modal",
        visible: false,
        status: "new",
        newTitle: "Add Meeting Schedule",
        editTitle: "Edit Meeting Schedule",
        subtitle: "Default schedule for",
        hasFooter: true,
        footerActions: [
          {
            id: "meeting_schedule_modal_delete",
            label: "Delete",
            type: "button",
            class: "btn quiet-destroy-btn mr-a",
            method: "deleteSchedule()",
            disabled: false
          },
          {
            id: "meeting_schedule_modal_cancel",
            label: "Cancel",
            type: "button",
            class: "btn text-btn mr-2",
            method: "hideModal('meeting_schedule_modal')",
            disabled: false
          },
          {
            id: "meeting_schedule_modal_save",
            label: "Save",
            type: "button",
            class: "btn create-btn",
            method: "save('')",
            disabled: false
          },
        ],
        form: {
          rows: [
            {
              visibility: "true",
              columns: [
                {
                  type: "label",
                  text: "Meets"
                },
                {
                  type: "field",
                  name: "meeting_schedule_frequency"
                }
              ],
              type: 'row'
            },
            {
              visibility: "form.group.meeting_schedule_frequency !== 'YEARLY' && form.group.meeting_schedule_frequency !== 'DAY_OF_WEEK' && form.group.meeting_schedule_frequency !== 'SPECIFIC_DAY'",
              columns: [
                {
                  type: "label",
                  text: "On"
                },
                {
                  type: "field",
                  name: "meeting_schedule_frequency_weekday"
                }
              ],
              type: 'row'
            },
            {
              visibility: "form.group.meeting_schedule_frequency === 'DAY_OF_WEEK'",
              columns: [
                {
                  type: "label",
                  text: "On the"
                },
                {
                  type: "field",
                  name: "meeting_schedule_frequency_count"
                },
                {
                  type: "field",
                  name: "meeting_schedule_frequency_weekday"
                }
              ],
              type: 'row'
            },
            {
              visibility: "form.group.meeting_schedule_frequency === 'SPECIFIC_DAY'",
              columns: [
                {
                  type: "label",
                  text: "On the"
                },
                {
                  type: "field",
                  name: "meeting_schedule_frequency_day"
                },
                {
                  type: "label",
                  text: "of the month"
                }
              ],
              type: 'row'
            },
            {
              visibility: "form.group.meeting_schedule_frequency === 'YEARLY'",
              columns: [
                {
                  type: "label",
                  text: "On"
                },
                {
                  type: "field",
                  name: "meeting_schedule_frequency_month"
                },
                {
                  type: "field",
                  name: "meeting_schedule_frequency_day"
                }
              ]
            },
            {
              visibility: "true",
              columns: [
                {
                  type: "label",
                  text: "From"
                },
                {
                  type: "field",
                  name: "meeting_start_time"
                },
                {
                  type: "label",
                  text: "To"
                },
                {
                  type: "field",
                  name: "meeting_end_time"
                }
              ],
              type: 'row'
            }
          ],
          fields: [
            {
              label: "Meets",
              name: "meeting_schedule_frequency",
              type: "select",
              options: dataset.meetingScheduleFrequencies ? dataset.meetingScheduleFrequencies : [],
              disabled: false
            },
            {
              label: "Count",
              name: "meeting_schedule_frequency_count",
              type: "select",
              options: dataset.meetingScheduleFrequencyCounts ? dataset.meetingScheduleFrequencyCounts : [],
              disabled: false
            },
            {
              label: "Day",
              name: "meeting_schedule_frequency_day",
              type: "select",
              options: dataset.meetingScheduleFrequencyDays ? dataset.meetingScheduleFrequencyDays : [],
              disabled: false
            },
            {
              label: "Month",
              name: "meeting_schedule_frequency_month",
              type: "select",
              options: dataset.meetingScheduleFrequencyMonths ? dataset.meetingScheduleFrequencyMonths : [],
              disabled: false
            },
            {
              label: "Weekday",
              name: "meeting_schedule_frequency_weekday",
              type: "select",
              options: dataset.meetingScheduleFrequenciesWeekdays ? dataset.meetingScheduleFrequenciesWeekdays : [],
              disabled: false
            },
            {
              label: "From",
              name: "meeting_start_time",
              type: "select",
              options: dataset.meetingScheduleStartTimes ? dataset.meetingScheduleStartTimes : [],
              disabled: false
            },
            {
              label: "To",
              name: "meeting_end_time",
              type: "select",
              options: dataset.meetingScheduleEndTimes ? dataset.meetingScheduleEndTimes : [],
              disabled: false
            }
          ]
        }
      },
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
                  name: "event_name",
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
                  name: "send_reminder_emails",
                }
              ],
              type: 'row'
            }
          ],
          fields: [
            {
              label: "Event name",
              name: "event_name",
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
              name: "send_reminder_emails",
              type: "checkbox",
              disabled: false
            }
          ]
        }
      }
    ],
  },
  created() {
    this.group = dataset.groupData;
    this.currentUser = dataset.userData;
    this.form.group = dataset.groupData;
    const categoryId = this.categoryData.id;
    this.sections[0].rows[0].columns[0].panes[0].fields[1].options = dataset.groupCategories.map(category => ({
      value: category.id,
      label: category.name,
      selected: category.id === categoryId
    }));

    this.form.group.group_category = categoryId;
    $.ajax({
      type: 'POST',
      url: `${window.location.origin}/_hcms/api/getAdministrators`,
      contentType: 'application/json',
      data: JSON.stringify({}),
      success: (response) => {
        console.log("Administrators", response);
        if (response.status === "success") {
          // TODO: CHECK WHY THIS ISN'T SET
          this.sections[0].rows[0].columns[1].panes[1].fields[0].options = response.results;
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
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
    groupCategories() {
      // console.log("Getting group categories")
      return dataset.groupCategories.map(category => ({
        value: category.id,
        label: category.name,
      }));
    },
    formattedAutoCloseDate() {
      return moment(Number(this.form.group.auto_close_date)).format('YYYY-MM-DD');
    },
    filteredMessages() {
      // We need to filter out the replies item.reply = 1
      return this.messages.filter(message => message.reply === 0);
    },
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
    setSelect(fieldName, selectedValue, model) {
      if (model) {
        this.$set(this.form[model], fieldName, selectedValue);
        return;
      }
      // console.log(`set select ${fieldName} to ${selectedValue}`);
      this.$set(this.form.group, fieldName, selectedValue);
      // console.log(this.form.group);
    },
    showTab(tab) {
      // console.log(`showing tab ${tab.id}`)
      if (tab.requiresAdmin && !this.isAdmin) {
        return false
      }
      return true;
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
      return moment(value).format(format);
    },
    openEnrollment() {
      console.log("opening enrollment")
    },
    leaveGroup(groupId, userId) {
      console.log(`leaving group ${groupId}`)
      const url = `/api/groups/${groupId}/members/${userId}`;
      console.log(groupId, userId, url);
    },
    addImage() {
      console.log("adding image")
      // Call the add image function
    },
    archive() {
      console.log("archiving group")
      // Call the archive group function
    },
    save() {
      // close all modals if open
      this.modals = this.modals.map(modal => ({ ...modal, visible: false }));

      // Call the update group function
      console.log(`saving data for group ${this.group.id}`);
      console.log(this.form.group);
      const endpoint = `${window.location.origin}/_hcms/api/updateObject`;

      // We need to parse out unneeded data from the form object
      const groupData = {
        objectType: 'groups',
        objectId: this.group.id,
        updateAssocation: false,
        assocations: [303],
        properties: {
          ...this.form.group,
        }
      };

      this.uneditableFields.forEach(field => {
        delete groupData.properties[field];
      });

      // Update the schedule
      let schedule = "";
      if (this.form.group.meeting_schedule_frequency) {
        // Get the label from the dataset
        const frequency = dataset.meetingScheduleFrequencies.find(f => f.value === this.form.group.meeting_schedule_frequency);
        schedule += `${frequency.label} | `;
      }

      if (this.form.group.meeting_schedule_frequency === 'DAY_OF_WEEK') {
        schedule += `On the ${this.form.group.meeting_schedule_frequency_count} `;
      }

      if (this.form.group.meeting_schedule_frequency === 'SPECIFIC_DAY') {
        schedule += `On the ${this.form.group.meeting_schedule_frequency_day} of the month at `;
      }

      if (this.form.group.meeting_schedule_frequency_weekday) {
        // get the label from the dataset
        const weekday = dataset.meetingScheduleFrequenciesWeekdays.find(w => w.value === this.form.group.meeting_schedule_frequency_weekday);
        schedule += `${weekday.label}s at `;
      }

      if (this.form.group.meeting_schedule_frequency === 'YEARLY') {
        schedule += `${this.form.group.meeting_schedule_frequency_month} ${this.form.group.meeting_schedule_frequency_day} at `;
      }

      if (this.form.group.meeting_start_time) {
        schedule += `${this.form.group.meeting_start_time} to `;
      }

      if (this.form.group.meeting_end_time) {
        schedule += `${this.form.group.meeting_end_time} ${this.form.group.time_zone}`;
      }

      if (this.form.group.location_type_preference === 'Physical') {
        schedule += " | In Person";
      } else {
        schedule += " | Online";
      }

      this.form.group.schedule = schedule;

      groupData.properties.schedule = schedule;

      if (this.form.group.group_category !== this.categoryData.id) {
        groupData.updateAssocation = true
      }

      if (groupData.properties.hubspot_owner_id) {
        groupData.properties.hubspot_owner_id = Number(groupData.properties.hubspot_owner_id);
      }

      console.log(groupData);

      // Submit the form data to the endpoint
      $.ajax({
        type: 'POST',
        url: endpoint,
        contentType: 'application/json',
        data: JSON.stringify(groupData),
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
        name: this.group.name,
        originalId,
        message: this.newReply,
        reply,
        // eslint-disable-next-line no-underscore-dangle
        createdById: Number(this.currentUser._metadata.id),
        createdByName: `${this.currentUser.firstname} ${this.currentUser.lastname}`,
        createByEmail: this.currentUser.email,
        objectType: 'groups',
        objectId: this.group.id
      };
      
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
    }
  }
});