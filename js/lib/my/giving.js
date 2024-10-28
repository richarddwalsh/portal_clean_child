/* eslint-disable default-case */
/* eslint-disable no-self-assign */
/* eslint-disable no-undef */
/* eslint-disable no-new */
Vue.config.devtools = true;
Vue.config.productionTip = true;
Vue.config.silent = false;

const targetData = document.getElementById('json-data');
const dataset = JSON.parse(targetData.textContent);

const { jsPDF } = window.jspdf;

new Vue({
  delimiters: ['[[', ']]'],
  el: '#app',
  directives: {
    'click-outside': window.clickOutsideDirective,
  },
  data: {
    loading: true,
    activeMenu: '',
    currentUser: dataset.userData,
    payments: dataset.userData.associations.payments,
    filters: dataset.filters,
    defaultLabels: {
      transactionDate: 'Transaction Date',
      paymentMethod: 'Payment Method',
      paymentStatus: 'Payment Status',
    },
    filterLabels: { 
      transactionDate: 'Transaction Date',
      paymentMethod: 'Payment Method',
      paymentStatus: 'Payment Status',
    },
    filterTypeMapping: {
    },
    activeFilters: []
  },
  created() {
    console.log('created');
  },
  computed: {
    filteredTransactions() {
      let filteredTransactions = this.payments.items;
    
      if (this.activeFilters.length > 0) {
        this.activeFilters.forEach(filter => {
          if (filter.type === 'transactionDate') {
            const now = new Date().getTime(); // Current time in milliseconds
    
            // Calculate the date range boundaries
            const last7days = now - 7 * 24 * 60 * 60 * 1000; // 7 days ago
            const last30days = now - 30 * 24 * 60 * 60 * 1000; // 30 days ago
            const last90days = now - 90 * 24 * 60 * 60 * 1000; // 90 days ago
            const last180days = now - 180 * 24 * 60 * 60 * 1000; // 180 days ago
            const last365days = now - 365 * 24 * 60 * 60 * 1000; // 365 days ago
    
            switch (filter.value) {
              case 'today':
                filteredTransactions = filteredTransactions.filter(transaction => {
                  const transactionDate = transaction.closedate;
                  const todayStart = new Date().setHours(0, 0, 0, 0);
                  const todayEnd = new Date().setHours(23, 59, 59, 999);
                  return transactionDate >= todayStart && transactionDate <= todayEnd;
                });
                break;
              case 'last7days':
                filteredTransactions = filteredTransactions.filter(transaction => transaction.closedate >= last7days && transaction.closedate <= now);
                break;
              case 'last30days':
                filteredTransactions = filteredTransactions.filter(transaction => transaction.closedate >= last30days && transaction.closedate <= now);
                break;
              case 'last90days':
                filteredTransactions = filteredTransactions.filter(transaction => transaction.closedate >= last90days && transaction.closedate <= now);
                break;
              case 'last180days':
                filteredTransactions = filteredTransactions.filter(transaction => transaction.closedate >= last180days && transaction.closedate <= now);
                break;
              case 'last365days':
                filteredTransactions = filteredTransactions.filter(transaction => {
                  console.log('last365days', last365days);
                  console.log('now', now);
                  console.log('transactionDate', transaction.closedate);
                  return transaction.closedate >= last365days && transaction.closedate <= now;
                });
                break;
            }
          } else if (filter.type === 'paymentMethod') {
            filteredTransactions = filteredTransactions.filter(transaction => transaction.pushpay_payment_method === filter.value);
          } else if (filter.type === 'paymentStatus') {
            filteredTransactions = filteredTransactions.filter(transaction => transaction.dealstage.value === filter.value);
          }
    
          // const property = this.filterTypeMapping[filter.type] || filter.type;
          // filteredTransactions = filteredTransactions.filter(transaction => transaction[property] === filter.value);
        });
      }
    
      return filteredTransactions;
    }
  },
  filters: {
    
  },
  methods: {
    initializeData() {
      console.log("initializeData");
      this.editing = false;
      this.currentUser = dataset.userData;

      this.loading = true;
      // this.applyFilter('transactionDate', 'last365days');
    },
    applyFilter(type, value) {
      console.log(`Apply filter: ${type} ${value}`);
      this.filterLabels[type] = value || this.defaultLabels[type];
      const index = this.activeFilters.findIndex(filter => filter.type === type);
      if (value) {
        if (index > -1) {
          this.$set(this.activeFilters, index, { type, value });
        } else {
          this.activeFilters.push({ type, value });
        }
      } else {
        if (index > -1) {
          this.activeFilters.splice(index, 1);
        }
        this.filterLabels[type] = this.defaultLabels[type];
      }

      this.activeMenu = '';
    },
    exportTransactions() {
      // Example data - replace with actual filtered data
      const transactions = this.filteredTransactions;

      if (transactions.length === 0) {
        // eslint-disable-next-line no-alert
        alert('No transactions to export');
        return;
      }

      // Calculate the date range
      const transactionDates = transactions.map(transaction => new Date(transaction.closedate));
      const minDate = new Date(Math.min(...transactionDates));
      const maxDate = new Date(Math.max(...transactionDates));
      const dateRange = `${minDate.toLocaleDateString()} to ${maxDate.toLocaleDateString()}`;

      // Summarize data by campus and fund
      const campusSummary = {};
      const fundSummary = {};

      transactions.forEach(transaction => {
        // Summarize by campus
        const campus = transaction.pushpay_payment_campus; // Replace with actual data key
        const amount = parseFloat(transaction.amount);
        if (campusSummary[campus]) {
          campusSummary[campus] += amount;
        } else {
          campusSummary[campus] = amount;
        }
  
        // Summarize by fund
        const fund = transaction.pushpay_payment_fund_name; // Replace with actual data key
        if (fundSummary[fund]) {
          fundSummary[fund] += amount;
        } else {
          fundSummary[fund] = amount;
        }
      });

      // Create a new PDF document
      // eslint-disable-next-line new-cap
      const doc = new jsPDF();

      // Header Section
      const logo = 'data:image/png;base64,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'; // Add your logo's base64 string
      doc.addImage(logo, 'PNG', 85, 10, 40, 20); // Adjust position and size as needed
      doc.setFontSize(14);
      doc.text('ONE | A Potter’s House Church', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });
      doc.setFontSize(12);
      doc.text('Contributions Statement', doc.internal.pageSize.getWidth() / 2, 50, { align: 'center' });
      doc.text(`Date Range: ${dateRange}`, doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });

      // Customizable Text Section
      const customText = "Thank you for your generous contributions to our community.";
      doc.text(customText, doc.internal.pageSize.getWidth() / 2, 70, { align: 'center' });

      // Table Section
      const columns = [
        { title: 'Date', dataKey: 'closedate' },
        { title: 'Campus', dataKey: 'campus' },
        { title: 'Fund', dataKey: 'fund' },
        { title: 'Contribution Type', dataKey: 'contributionType' },
        { title: 'Gift Amount', dataKey: 'amount' }
      ];

      const rows = transactions.map(transaction => ({
          closedate: new Date(transaction.closedate).toLocaleDateString(),
          campus: transaction.pushpay_payment_campus,
          fund: transaction.pushpay_payment_fund_name,
          contributionType: transaction.pushpay_payment_method,
          amount: `$${parseFloat(transaction.amount).toFixed(2)}`
        }));

      doc.autoTable({
        head: [columns.map(col => col.title)],
        body: rows.map(row => Object.values(row)),
        startY: 80,
        theme: 'grid',
        styles: { overflow: 'linebreak', cellPadding: 2 },
        headStyles: { fillColor: [200, 200, 200] },
        margin: { top: 60 }
      });

      // Contribution Summary Section
      const summaryY = doc.lastAutoTable.finalY + 10; // Start the summary below the table
      doc.setFontSize(12);
      doc.text('Contribution Summary by Campus & by Fund', 14, summaryY);

      let campusSummaryText = '';
      for (const [campus, total] of Object.entries(campusSummary)) {
        campusSummaryText += `Campus: ${campus} - $${total.toFixed(2)}\n`;
      }

      let fundSummaryText = '';
      for (const [fund, total] of Object.entries(fundSummary)) {
        fundSummaryText += `Fund: ${fund} - $${total.toFixed(2)}\n`;
      }

      doc.setFontSize(10);
      doc.text(campusSummaryText, 14, summaryY + 10);
      doc.text(fundSummaryText, 14, summaryY + 20);

      // Footer Section
      const footerY = doc.internal.pageSize.getHeight() - 40; // Adjust to position above the bottom
      doc.setFontSize(10);
      doc.text('For contributions to ONE | A Potter’s House Church', 14, footerY);
      doc.text('EIN: [Insert EIN]', 14, footerY + 10);
      doc.text('Address: [Insert Address]', 14, footerY + 20);

      doc.text('For contributions to Potter’s House Denver', 14, footerY + 30);
      doc.text('EIN: 27-1834173', 14, footerY + 40);
      doc.text('Address: 9495 East Florida Avenue, Denver, CO 80247', 14, footerY + 50);

      // Save the PDF
      doc.save('contributions_statement.pdf');
    }
  }
});