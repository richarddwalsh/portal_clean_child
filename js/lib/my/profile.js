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
    currentUser: dataset.userData,
    options: {
      emailTypes: ["Home", "Work", "Other"],
      addressTypes: [
        { "text": "Home", "value": "Home", "disabled": false },
        { "text": "Work", "value": "Work", "disabled": false },
        { "text": "Other", "value": "Other", "disabled": false }
      ],
      phoneTypes: ["Home", "Work", "Mobile", "Fax", "Other"],
      emailAddresses: [],
      phoneNumbers: [],
      maritalStatuses: [
        { "text": "Single", "value": "Single" },
        { "text": "Married", "value": "Married" },
        { "text": "Divorced", "value": "Divorced" },
        { "text": "Widowed", "value": "Widowed" },
        { "text": "Separated", "value": "Separated" },
        { "text": "Engaged", "value": "Engaged" },
        { "text": "Other", "value": "Other" },
      ],
      genders: [
        { "text": "Male", "value": "Male" },
        { "text": "Female", "value": "Female" },
      ]
    },
    form: {
      firstname: "",
      lastname: "",
      emails: [],
      phones: [],
      addresses: [],
      location_select_email: "Home",
      primary_select_email: "",
      location_select_phone: "Home",
      primary_select_phone: "",
      location_select_address: "Home",
      medical_notes: "",
      marital_status__new_: "",
      birthday: {
        month: "",
        day: "",
        year: ""
      },
      gender: "",
      anniversary: {
        month: "",
        day: "",
        year: ""
      }
    },
    processing: false
  },
  created() {
    console.log('created');
    if (this.currentUser) {
      this.form.email = this.currentUser.email;
      
  
      this.form.firstname = this.currentUser.firstname;
      this.form.lastname = this.currentUser.lastname;
      // this.form.phone = this.currentUser.phone;

      if (this.currentUser.address) {
        const address = {
          address: this.currentUser.address,
          address2: this.currentUser.address2,
          city: this.currentUser.city,
          state: this.currentUser.state,
          zip: this.currentUser.zip,
          type: "Home"
        };
        this.form.addresses.push(address);
        this.updateAddressTypes();
      }

      if (this.currentUser.work_address) {
        const workAddress = {
          address: this.currentUser.work_address,
          address2: this.currentUser.work_address2,
          city: this.currentUser.work_city,
          state: this.currentUser.work_state,
          zip: this.currentUser.work_zip,
          type: "Work"
        };
        this.form.addresses.push(workAddress);
        this.updateAddressTypes();
      }

      if (this.currentUser.other_address) {
        const otherAddress = {
          address: this.currentUser.other_address,
          address2: this.currentUser.other_address2,
          city: this.currentUser.other_city,
          state: this.currentUser.other_state,
          zip: this.currentUser.other_zip,
          type: "Other"
        };
        this.form.addresses.push(otherAddress);
        this.updateAddressTypes();
      }

      const email = {
        address: this.currentUser.email,
      };
      this.form.emails.push(email);
      
      if (this.currentUser.hs_additional_emails) {
        this.currentUser.hs_additional_emails.split(',').forEach(e => {
          const additionalEmail = {
            address: e.trim()
          };
          console.log(e);
          this.form.emails.push(additionalEmail);
        });
      };
      this.options.emailAddresses = this.form.emails;
      this.form.primary_select_email = this.currentUser.email;
      this.form.location_select_email = "Home";
      
      const phone = {
        number: this.currentUser.phone,
        type: "Home",
        primary: true
      };
      this.form.phones.push(phone);

      if (this.currentUser.mobilephone) {
        const mobilephone = {
          number: this.currentUser.mobilephone,
          type: "Mobile",
          primary: false
        };
        this.form.phones.push(mobilephone);
      }

      if (this.currentUser.fax) {
        const fax = {
          number: this.currentUser.fax,
          type: "Fax",
          primary: false
        };
        this.form.phones.push(fax);
      }
      this.options.phoneNumbers.push(this.form.phones);
      this.form.primary_select_phone = this.currentUser.phone;
      
      this.form.gender = this.currentUser.gender;
      // split this.currentUser.birthday into day, month, year using momentjs
      this.form.birthday.month = moment(this.currentUser.birthday).format('M');
      this.form.birthday.day = moment(this.currentUser.birthday).format('D');
      this.form.birthday.year = moment(this.currentUser.birthday).format('YYYY');

      this.form.medical_notes = this.currentUser.medical_notes;
      // eslint-disable-next-line dot-notation
      this.form['marital_status__new_'] = this.currentUser['marital_status__new_'];

    }
  },
  computed: {
    formattedAddress() {
      const addressParts = [];
  
      if (this.currentUser.address) {
        addressParts.push(this.currentUser.address);
      }
  
      const cityStateZip = [];
  
      if (this.currentUser.city) {
        cityStateZip.push(this.currentUser.city);
      }
      if (this.currentUser.state) {
        cityStateZip.push(this.currentUser.state);
      }
      if (this.currentUser.zip) {
        cityStateZip.push(this.currentUser.zip);
      }
  
      if (cityStateZip.length > 0) {
        addressParts.push(cityStateZip.join(', '));
      }
  
      return addressParts.join('<br>');
    },
    months() {
      const monthArray = [{ value: '', text: 'Month' }];
      for (let i = 1; i <= 12; i += 1) {
        monthArray.push({ value: i, text: moment().month(i - 1).format('MMMM') });
      }
      return monthArray;
    },
    days() {
      const dayArray = [{ value: '', text: 'Day' }];
      for (let i = 1; i <= 31; i += 1) {
        dayArray.push({ value: i, text: i });
      }
      return dayArray;
    },
    years() {
      const yearsArray = [{ value: '', text: 'Year' }];
      // today to 1924

      for (let i = moment().year(); i >= 1924; i -= 1) {
        yearsArray.push({ value: i, text: i });
      }
      return yearsArray;
    },
    canAddPhone() {
      return this.form.phones.length < 4;
    },
    canAddAddress() {
      const types = this.options.addressTypes;
      const {addresses} = this.form;
      let canAdd = false;
      types.forEach(t => {
        const found = addresses.find(a => a.type === t);
        if (!found) {
          canAdd = true;
        }
      });
      return canAdd;
    },

  },
  filters: {
    formatDate(value, format) {
      if (value) {
        return moment(String(value)).format(format);
      }
      return '';
    },
  },
  methods: {
    getInitials(name) {
      const names = name.split(' ');
      let initials = '';
      names.forEach(n => {
        initials += n.charAt(0).toUpperCase();
      });
      return initials;
    },
    addEmail() {
      this.form.emails.push("");
    },
    removeEmail(index) {
      this.form.emails.splice(index, 1);
    },
    addPhone() {
      if (this.form.phones.length < 4) {
        this.form.phones.push("");
      }
    },
    removePhone(index) {
      this.form.phones.splice(index, 1);
    },
    updateAddressTypes() {
      const typesUsed = this.form.addresses.map(a => a.type);
      this.options.addressTypes = this.options.addressTypes.map(option => ({
        ...option,
        disabled: typesUsed.includes(option.value),
      }));
    },
    addAddress() {
      this.form.addresses.push({
        address: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        type: ""
      });
      this.updateAddressTypes();
    },
    removeAddress(index) {
      this.form.addresses.splice(index, 1);
    },
    saveChanges() {
      this.processing = true;
      const data = {
        // eslint-disable-next-line dot-notation
        id: this.currentUser.hs_object_id,
        properties: this.form
      }

      delete data.properties.location_select_email;
      delete data.properties.location_select_phone;
      delete data.properties.location_select_address;
      delete data.properties.primary_select_email;
      delete data.properties.primary_select_phone;
      delete data.properties.primary_select_address;
      
      $.ajax({
        type: 'POST',
        url: `${window.location.origin}/_hcms/api/me/update`,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }
});