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
  directives: {
    'click-outside': window.clickOutsideDirective,
  },
  data: {
    loading: true,
    currentUser: dataset.userData,
    household: dataset.userData.associations.households.items[0],
    members: dataset.userData.associations.households.items[0].associations.members.items,
    dynamicModel:{
      newMember: {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        birthday: '',
        member_type: '',
        using_household_email: false
      },
      editMember: {
        hs_object_id: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        birthday: '',
        member_type: '',
        using_household_email: false
      }
    },
    modals: [
      {
        id:"create_member_modal",
        visible: false,
        title: "New Household Member",
        hasFooter: true,
        footerActions: [
          {
            id: "create_member_modal_cancel",
            label: "Cancel",
            type: "button",
            class: "btn text-btn mr-2",
            method: "hideModal('create_member_modal')",
            disabled: false
          },
          {
            id: "create_member_modal_save",
            label: "Save",
            type: "button",
            class: "btn create-btn",
            method: "addMember('')",
            disabled: false
          }
        ],
        form: {
          model: "newMember",
          fields: [
            {
              label: "First name",
              name: "first_name",
              property: "firstname",
              type: "input",
              format: "text"
            },
            {
              label: "Last name",
              name: "last_name",
              property: "lastname",
              type: "input",
              format: "text"
            },
            {
              label: "Email",
              name: "email",
              property: "email",
              type: "input",
              format: "email",
              notice: "This email address will be used to send reminders and other important information."
            },
            {
              label: "Use Parent/Guardian Email for Communications",
              name: "using_household_email",
              property: "using_household_email",
              type: "checkbox",
            },
            {
              label: "Phone",
              name: "phone",
              property: "phone",
              type: "input",
              format: "tel"
            },
            {
              label: "Birthday",
              name: "birthday",
              property: "birthday",
              type: "input",
              format: "date",
              placeholder: "YYYY-MM-DD"
            },
            {
              label: "Member type",
              name: "member_type",
              property: "member_type",
              type: "select",
              options: [
                {
                  label: "Parent",
                  value: 316
                },
                {
                  label: "Guardian",
                  value: 318
                },
                {
                  label: "Child",
                  value: 320
                }
              ]
            }
          ],
          rows: [
            {
              visibility: true,
              columns: [
                {
                  type: "label",
                  text: "First name"
                },
                {
                  type: "field",
                  name: "first_name"
                },
                {
                  type: "label",
                  text: "Last name"
                },
                {
                  type: "field",
                  name: "last_name"
                }
              ],
              type: "row"
            },
            {
              visibility: true,
              columns: [
                {
                  type: "label",
                  text: "Phone"
                },
                {
                  type: "field",
                  name: "phone"
                },
                {
                  type: "label",
                  text: "Birthday"
                },
                {
                  type: "field",
                  name: "birthday"
                }
              ],
              type: "row"
            },
            {
              visibility: true,
              columns: [
                {
                  type: "label",
                  text: "Email"
                },
                {
                  type: "field",
                  name: "email"
                },
              ],
              type: "column"
            },
            {
              visibility: true,
              columns: [
                {
                  type: "field",
                  name: "using_household_email"
                }
              ],
              type: "column"
            },
            {
              visibility: true,
              columns: [
                {
                  type: "label",
                  text: "Member type"
                },
                {
                  type: "field",
                  name: "member_type"
                }
              ],
              type: "column"
            }
          ]
        }
      },
      {
        id:"edit_member_modal",
        visible: false,
        title: "Edit Household Member",
        hasFooter: true,
        footerActions: [
          {
            id: "create_member_modal_cancel",
            label: "Cancel",
            type: "button",
            class: "btn text-btn mr-2",
            method: "hideModal('create_member_modal')",
            disabled: false
          },
          {
            id: "create_member_modal_save",
            label: "Save",
            type: "button",
            class: "btn create-btn",
            method: "updateMember('')",
            disabled: false
          }
        ],
        form: {
          model: "editMember",
          fields: [
            {
              label: "First name",
              name: "first_name",
              property: "firstname",
              type: "input",
              format: "text"
            },
            {
              label: "Last name",
              name: "last_name",
              property: "lastname",
              type: "input",
              format: "text"
            },
            {
              label: "Email",
              name: "email",
              property: "email",
              type: "input",
              format: "email",
              notice: "This email address will be used to send reminders and other important information."
            },
            {
              label: "Use Parent/Guardian Email for Communications",
              name: "using_household_email",
              property: "using_household_email",
              type: "checkbox",
            },
            {
              label: "Phone",
              name: "phone",
              property: "phone",
              type: "input",
              format: "tel"
            },
            {
              label: "Birthday",
              name: "birthday",
              property: "birthday",
              type: "input",
              format: "date",
              placeholder: "YYYY-MM-DD"
            },
            {
              label: "Member type",
              name: "member_type",
              property: "member_type",
              type: "select",
              options: [
                {
                  label: "Parent",
                  value: 316
                },
                {
                  label: "Guardian",
                  value: 318
                },
                {
                  label: "Child",
                  value: 320
                }
              ]
            }
          ],
          rows: [
            {
              visibility: true,
              columns: [
                {
                  type: "label",
                  text: "First name"
                },
                {
                  type: "field",
                  name: "first_name"
                },
                {
                  type: "label",
                  text: "Last name"
                },
                {
                  type: "field",
                  name: "last_name"
                }
              ],
              type: "row"
            },
            {
              visibility: true,
              columns: [
                {
                  type: "label",
                  text: "Phone"
                },
                {
                  type: "field",
                  name: "phone"
                },
                {
                  type: "label",
                  text: "Birthday"
                },
                {
                  type: "field",
                  name: "birthday"
                }
              ],
              type: "row"
            },
            {
              visibility: true,
              columns: [
                {
                  type: "label",
                  text: "Email"
                },
                {
                  type: "field",
                  name: "email"
                },
              ],
              type: "column"
            },
            {
              visibility: true,
              columns: [
                {
                  type: "field",
                  name: "using_household_email"
                }
              ],
              type: "column"
            },
            {
              visibility: true,
              columns: [
                {
                  type: "label",
                  text: "Member type"
                },
                {
                  type: "field",
                  name: "member_type"
                }
              ],
              type: "column"
            }
          ]
        }
      }
    ],
    actionDrawers: {
      primary: false
    }
  },
  created() {
    
  },
  computed: {
    isAdmin() {
      // console.log("Checking if user is admin")
      return document.getElementById('main_page_content').getAttribute('data-is-admin');;
    }
  },
  methods: {
    setSelect(fieldName, selectedValue, model) {
      if (model) {
        this.$set(this[model], fieldName, selectedValue);
        return;
      }
      // console.log(`set select ${fieldName} to ${selectedValue}`);
      this.$set(this.form.group, fieldName, selectedValue);
      // console.log(this.form.group);
    },
    showModal(modalId, data) {

      if (data) {
        this.dynamicModel.editMember = {
          first_name: data.firstname,
          last_name: data.lastname,
          ...data
        };
      }
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
      // Get the modal
      const modal = this.modals.find(m => m.id === modalId);
      // Get the field from modal.form.fields
      return modal.form.fields.find(field => field.name === fieldName);
    },
    evaluateCondition(condition) {
      console.log(`evaluating condition ${condition}`)
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
    getInitials(name) {
      const names = name.split(' ');
      let initials = '';
      names.forEach(n => {
        initials += n.charAt(0).toUpperCase();
      });
      return initials;
    },
    addMember() {
      this.actionDrawers.primary = false;
      const { newMember } = this.dynamicModel;
      if (!newMember.email) {
        let {email} = this.currentUser
        const atSymbol = email.indexOf('@');
        const emailName = email.slice(0, atSymbol);
        const emailDomain = email.slice(atSymbol);
        // make sure that email is properly formatted, cannot contain spaces, so if firstname is 'Test 2' it should be test-2
        email = `${emailName}+${newMember.first_name.toLowerCase()}${emailDomain}`;
        email = email.replace(/\s/g, '-');
        newMember.email = email;
      }

      // Need to set the household_contact_type based on the member_type's label
      // eslint-disable-next-line camelcase
      const household_contact_type = this.lookupField('member_type', 'create_member_modal').options.find(option => option.value === newMember.member_type).label;

      // Now we can submit to the api to create the contact and add the assiociation.
      const householdId = this.household.hs_object_id;
      const payload = {
        householdId,
        // eslint-disable-next-line camelcase
        household_contact_type,
        ...newMember
      };

      console.log(payload);

      const endpoint = `${window.location.origin}/_hcms/api/household/add`;

      $.ajax({
        type: 'POST',
        url: endpoint,
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: (response) => {
          console.log(response);
          if (response.status === "success") {
            this.hideModal('create_member_modal');
            const newContact = {
              ...response.response.properties,
              hs_object_id: response.response.id
            }
            this.members.push(newContact);
          }
        },
        error: (error) => {
          console.log(error);
        }
      });
    },
    removeMember(id) {
      console.log(`Removing member ${id}`);
      const endpoint = `${window.location.origin}/_hcms/api/household/remove`;
      const payload = {
        householdId: this.household.hs_object_id,
        memberId: id,
        associationId: 320
      };
      $.ajax({
        type: 'POST',
        url: endpoint,
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: (response) => {
          console.log(response);
          if (response.status === "success") {
            const index = this.members.findIndex(member => member.hs_object_id === id);
            this.members.splice(index, 1);
          }
        },
        error: (error) => {
          console.log(error);
        }
      });

    },
    updateMember() {
      console.log("Updating member");
      this.actionDrawers.primary = false;
      const { editMember } = this.dynamicModel;

      // Need to set the household_contact_type based on the member_type's label
      // eslint-disable-next-line camelcase
      const household_contact_type = this.lookupField('member_type', 'create_member_modal').options.find(option => option.value === editMember.member_type).label;

      // Now we can submit to the api to create the contact and add the assiociation.
      const householdId = this.household.hs_object_id;
      const payload = {
        householdId,
        // eslint-disable-next-line camelcase
        household_contact_type,
        ...editMember
      };

      const endpoint = `${window.location.origin}/_hcms/api/household/update`;
      
      $.ajax({
        type: 'POST',
        url: endpoint,
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: (response) => {
          console.log(response);
          if (response.status === "success") {
            this.hideModal('edit_member_modal');
            const index = this.members.findIndex(member => member.hs_object_id === editMember.hs_object_id);
            this.members.splice(index, 1, editMember);
          }
        },
        error: (error) => {
          console.log(error);
        }
      });
    },
  }
});