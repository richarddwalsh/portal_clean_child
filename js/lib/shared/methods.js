console.log('loading shared methods');
const emptyEvent = {
  name: '',
  starts_at: '',
  starts_at_time: '',
  ends_at: '',
  ends_at_time: '',
  repeating: false,
  description: '',
  location: '',
  automated_reminder_enabled: '',
  banner_image: '',
}

const emptyResource = {
  objectId: '',
  objectType: '',
  name: '',
  description: '',
  retain: 0,
  type: '',
  file: ''
}

window.sharedMethods = {
  methods: {
    closeActionDrawer() {
      Object.keys(this.actionDrawers).forEach(key => {
        this.$set(this.actionDrawers, key, false);
      });
    },
    getInitials(name) {
      const names = name.split(' ');
      let initials = '';
      names.forEach(n => {
        initials += n.charAt(0).toUpperCase();
      });
      return initials;
    },
    setActiveTab(selectedTab) {
      // console.log(`setting active tab to ${selectedTab}`)
      const updatedTabs = this.tabs.map(tab => ({
        ...tab,
        active: tab === selectedTab,
      }));
      this.tabs = updatedTabs;
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
      // console.log(`hiding modal ${modalId}`);
      this.modals = this.modals.map(modal => {
        if (modal.id === modalId) {
          return { ...modal, visible: false };
        } 
        return modal;
      });
    },
    evaluateCondition(condition) {
      // console.log(`evaluating condition ${condition}`)
      // eslint-disable-next-line no-new-func
      const result = new Function('form', `with(form) { return ${condition}; }`)(this.form);
      // console.log(`evaluating condition ${condition}: ${result}`)
      return result;
    },
    callDynamicMethod(methodCall) {
      // console.log(`calling dynamic method ${methodCall}`);
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
    convertFileToBinary(event) {
      console.log('triggered from shared methods', event.target.files[0]);
      return new Promise((resolve, reject) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64String = e.target.result.split(',')[1];
            const fileInfo = {
              file: base64String,
              type: file.type,
              name: file.name
            };
            this.newResource.file = base64String;
            this.newResource.type = file.type;
            this.newResource.name = file.name;
            resolve(fileInfo);
          };
          reader.onerror = () => {
            reject(new Error("Failed to read file"));
          };
          this.fileInfoReady = true;
          reader.readAsDataURL(file);
        } else {
          reject(new Error("No file selected"));
        }
      });
    },
    addResource() {
      this.processing.resource = true;

      console.log("creating resource", this.newResource);
      const resourceData = {
        ...this.newResource,
        description: this.newResource.description,
        retain: this.newResource.retain,
        objectType: this.newResource.objectType,
        objectId: this.newResource.objectId
      };
      const endpoint = `${window.location.origin}/_hcms/api/addResource`;
      $.ajax({
        type: 'POST',
        url: endpoint,
        contentType: 'application/json',
        data: JSON.stringify(resourceData),
        success: (response) => {
          this.processing.resource = false;
          if (response.status === 'success') {
            this.newResource = emptyResource;  // Reset to an empty object
            this.newResource.objectId = this.objectId;
            this.newResource.objectType = this.objectType;
            this.resources.unshift(response.response.values);
          }
        },
        error: (error) => {
          console.log(error);
          this.processing.resource = false;
        }
      });
    },
    removeResource() {

    },
    createEvent() {
      console.log("creating event...")
      console.log(this.newEvent);
      const id = this.objectId;
      let associationTypeId = '';
      switch(this.objectType) {
        case 'teams':
          associationTypeId = 347;
          break;
        case 'groups':
          associationTypeId = 220;
          break;
        default:
          break;
      }
      const eventData = {
        payload: {
          properties: {
            ...this.newEvent,
            timezone: 'PST',
            include_on_signup_page: 'Do not include (direct link only)'
          },
          associations: [
            {
              to: {
                id
              },
              types: [
                {
                  associationCategory: "USER_DEFINED",
                  associationTypeId
                }
              ]
            }
          ]
        }
      };
      const endpoint = `${window.location.origin}/_hcms/api/event/create`;
      console.log(endpoint, eventData);
      $.ajax({
        type: 'POST',
        url: endpoint,
        contentType: 'application/json',
        data: JSON.stringify(eventData),
        success: (response) => {
          console.log(response);
          if (response.status === 'success') {
            this.newEvent = emptyEvent;  // Reset to an empty object
            this.newEvent.objectId = this.objectId;
            this.newEvent.objectType = this.objectType;
            this.events.unshift(response.response.properties);
            this.hideModal('create_event_modal');
          }
        },
        error: (error) => {
          console.log(error);
        }
      });
    },
    cancelEvent() {
      console.log("canceling event...")
    },
    setCurrentEvent(event) {
      const newEvent = {
        ...event,
        attending: {
          yes: false,
          no: false,
          maybe: false,
        },
        responded: false,
      }
      this.$set(this, 'currentEvent', newEvent);
    },
    updateEventStatus(status) {
      console.log(`updating event attending status to ${status}`)
      const newAttending = {
        yes: false,
        no: false,
        maybe: false,
      };
      newAttending[status] = true;
      this.$set(this.currentEvent, 'attending', newAttending);
      this.$set(this.currentEvent, 'responded', true);

      // Trigger Registration Update
      this.closeActionDrawer();
    },
    createICS(event) {
      const uid = `${event.id}@${window.location.hostname}`;
      const startDate = this.convertToICSDateTime(event.starts_at, event.starts_at_time);
      const endDate = this.convertToICSDateTime(event.ends_at, event.ends_at_time);
      const dtStamp = `${this.formatDate(new Date(), 'YYYYMMDDTHHmmss')  }Z`;
    
      return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Your Organization//Your Product//EN',
        'CALSCALE:GREGORIAN',
        // VTIMEZONE component as needed
        'BEGIN:VEVENT',
        `DTSTAMP:${dtStamp}`,
        `UID:${uid}`,
        `DTSTART;TZID=America/Los_Angeles:${startDate}`,
        `DTEND;TZID=America/Los_Angeles:${endDate}`,
        'CLASS:PUBLIC',
        `DESCRIPTION:${event.description}`,
        `LOCATION:${event.location}`,
        'STATUS:CONFIRMED',
        `SUMMARY:${event.name}`,
        `URL:${event.url}`,
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\n');
    },
    convertToISO8601(date, time) {
      // Assuming date format is 'MM/DD/YY' and time is 'HH:MM AM/PM'
      const [month, day, year] = date.split('/');
      const [hourMin, period] = time.split(' ');
      // eslint-disable-next-line prefer-const
      let [hour, minute] = hourMin.split(':');
    
      if (period === 'PM' && hour !== '12') {
        hour = (parseInt(hour, 10) + 12).toString();
      } else if (period === 'AM' && hour === '12') {
        hour = '00';
      } else {
        hour = hour.toString();
      }
    
      // Convert to 'YYYYMMDDTHHmmss' format for iCalendar
      return `20${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
    },
    convertToICSDateTime(date, time) {
      // Assuming date format is 'MM/DD/YY' and time is 'HH:MM AM/PM'
      const [month, day, year] = date.split('/');
      const [hourMin, period] = time.split(' ');
      // eslint-disable-next-line prefer-const
      let [hour, minute] = hourMin.split(':');
    
      if (period === 'PM' && hour !== '12') {
        hour = (parseInt(hour, 10) + 12).toString();
      } else if (period === 'AM' && hour === '12') {
        hour = '00';
      } else {
        hour = hour.toString();
      }
    
      // Convert to 'YYYYMMDDTHHmmss' format for iCalendar
      return `20${year}${month.padStart(2, '0')}${day.padStart(2, '0')}T${hour.padStart(2, '0')}${minute.padStart(2, '0')}`;
    },
    downloadICS(event) {
      const icsData = this.createICS(event);
      const blob = new Blob([icsData], { type: 'text/calendar' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'event.ics');
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
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
        name: this.objectName,
        originalId,
        message: this.newReply,
        reply,
        // eslint-disable-next-line no-underscore-dangle
        createdById: Number(this.currentUser._metadata.id),
        createdByName: `${this.currentUser.firstname} ${this.currentUser.lastname}`,
        createByEmail: this.currentUser.email,
        objectType: this.objectType,
        objectId: this.objectId,
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
    },
    showIcon(mimeType, iconType) {
      const imageMimeTypes = ["image/jpeg","image/png","image/gif","image/svg+xml","image/tiff","image/webp","image/bmp","image/vnd.microsoft.icon"];
      const videoMimeTypes = ["video/mp4","video/webm","video/ogg","video/quicktime","video/x-msvideo","video/x-ms-wmv","video/x-flv","video/x-matroska"];
      const audioMimeTypes = ["audio/mpeg","audio/ogg","audio/wav","audio/webm","audio/x-m4a","audio/x-realaudio","audio/x-wav","audio/x-ms-wma"];
      const textMimeTypes = ["text/plain","text/html","text/css","text/javascript","application/json","application/xml","text/csv","text/tab-separated-values","application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      const pdfMimeTypes = ["application/pdf"];
      
      switch(iconType) {
        case 'image':
          return imageMimeTypes.includes(mimeType);
        case 'video':
          return videoMimeTypes.includes(mimeType);
        case 'audio':
          return audioMimeTypes.includes(mimeType);
        case 'text':
          return textMimeTypes.includes(mimeType);
        case 'pdf':
          return pdfMimeTypes.includes(mimeType);
        default:
          return false;
      }
    },
    leaveObject(objectType, objectId, userId) {
      console.log(`User: ${userId} leaving ${objectType} ${objectId}...`)
    },
    archiveObject(objectType, objectId) {
      console.log(`Archiving ${objectType} ${objectId}...`)
    },
    
  }
}