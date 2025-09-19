/**
 * Enhanced Restaurant Order Management System
 *
 * CHANGES MADE:
 * - Implemented a carousel/slider view for customer cards in the management modal.
 * - Added navigateToCustomer() and updateCustomerCarouselView() to control the carousel.
 * - Updated showTableCustomers, addCustomer, and removeCustomer to work with the new view.
 * - MODIFIED: Relocated "Reset to Available" button to the modal header via JS.
 * - MODIFIED: Removed the carousel's top header (customer name and counter).
 */

class RestaurantPOS {
  constructor() {
    // ... (rest of the constructor remains the same)
    this.menu = [
      {
        id: 1,
        name: "French Fries",
        price: 80.0,
        category: "Appetizers",
        description: "Classic crispy potato french fries served with ketchup.",
        available: true,
      },
      {
        id: 2,
        name: "Honey Chilli Potato",
        price: 110.0,
        category: "Appetizers",
        description:
          "Crispy fried potatoes tossed in a sweet and spicy honey chilli sauce.",
        available: true,
      },
      {
        id: 3,
        name: "Grill Sandwich",
        price: 90.0,
        category: "Snacks",
        description:
          "A classic grilled sandwich with a mixed vegetable filling.",
        available: true,
      },
      {
        id: 4,
        name: "Paneer Sandwich",
        price: 100.0,
        category: "Snacks",
        description:
          "Grilled sandwich stuffed with spiced paneer and vegetables.",
        available: true,
      },
      {
        id: 5,
        name: "Veg Burger",
        price: 95.0,
        category: "Main Course",
        description:
          "A delicious vegetable patty in a soft bun with lettuce and sauces.",
        available: true,
      },
      {
        id: 6,
        name: "Cheese Burger",
        price: 105.0,
        category: "Main Course",
        description:
          "A vegetable patty with an extra slice of cheese for a creamy taste.",
        available: true,
      },
      {
        id: 7,
        name: "Steamed Momo",
        price: 90.0,
        category: "Appetizers",
        description:
          "Soft steamed dumplings filled with a savory vegetable mix.",
        available: true,
      },
      {
        id: 8,
        name: "Darjeeling Momo",
        price: 100.0,
        category: "Appetizers",
        description:
          "Authentic Darjeeling-style dumplings with a distinct flavor.",
        available: true,
      },
      {
        id: 9,
        name: "Masala Chai",
        price: 50.0,
        category: "Beverages",
        description: "Aromatic and spiced Indian tea, brewed with milk.",
        available: true,
      },
      {
        id: 10,
        name: "Mojito",
        price: 85.0,
        category: "Beverages",
        description: "A refreshing muddled drink with mint and lime.",
        available: true,
      },
      {
        id: 11,
        name: "Chocolate Cake",
        price: 115.0,
        category: "Desserts",
        description: "A rich and moist slice of chocolate layer cake.",
        available: true,
      },
      {
        id: 12,
        name: "Sweet Corn Soup",
        price: 75.0,
        category: "Soups",
        description:
          "A creamy and comforting soup made with sweet corn kernels.",
        available: true,
      },
      {
        id: 13,
        name: "Chowmein",
        price: 110.0,
        category: "Main Course",
        description:
          "Stir-fried noodles with a mix of fresh vegetables and sauces.",
        available: true,
      },
      {
        id: 14,
        name: "Hakka Noodles",
        price: 115.0,
        category: "Main Course",
        description: "Indo-Chinese style noodles with a garlic and soy flavor.",
        available: true,
      },
      {
        id: 15,
        name: "White Sauce Pasta",
        price: 120.0,
        category: "Main Course",
        description: "Pasta in a creamy white sauce with vegetables and herbs.",
        available: true,
      },
      {
        id: 16,
        name: "Spring Roll",
        price: 85.0,
        category: "Appetizers",
        description:
          "Crispy fried rolls stuffed with a savory vegetable filling.",
        available: true,
      },
      {
        id: 17,
        name: "Fried Rice",
        price: 100.0,
        category: "Main Course",
        description: "Wok-tossed rice with assorted vegetables and soy sauce.",
        available: true,
      },
      {
        id: 18,
        name: "Thukpa",
        price: 110.0,
        category: "Soups",
        description: "A hearty Himalayan noodle soup with vegetables.",
        available: true,
      },
    ];

    this.tables = [];
    this.orders = [];
    this.orderHistory = [];
    this.customers = []; // Enhanced: Customer database
    this.dueExpenses = []; // Enhanced: Due expenses tracking
    this.currentTable = null;
    this.currentCustomer = 0; // Will now track the visible customer in the carousel
    this.taxRate = 0.0;

    this.initializeTables();
    this.loadData();
    this.bindEvents();
    this.renderTables();
    this.updateReports();

    this.populateCustomerSelect();
    this.populateExpenseCustomerSelect();
  }

  // ... (initializeTables, loadData, saveData remain the same)
  initializeTables() {
    const capacities = [2, 4, 4, 6, 2, 4, 8, 2, 4, 6, 4, 2];
    for (let i = 1; i <= 12; i++) {
      this.tables.push({
        id: i,
        name: `Table ${i}`,
        capacity: capacities[i - 1],
        status: "available", // available, occupied, cleaning
        customers: [], // Enhanced: Individual customer orders for groups
        orders: [], // Legacy: Single customer orders
        occupiedSince: null,
        isGroup: false,
        customerCount: 1,
        currentCustomerId: null, // Enhanced: Link to customer database
        customerPayments: [], // Enhanced: Track individual customer payments
      });
    }
  }

  loadData() {
    try {
      const savedData = localStorage?.getItem("restaurantPOS");
      if (savedData) {
        const data = JSON.parse(savedData);
        this.tables = data.tables || this.tables;
        this.orders = data.orders || [];
        this.orderHistory = data.orderHistory || [];
        this.menu = data.menu || this.menu;
        this.customers = data.customers || []; // Enhanced
        this.dueExpenses = data.dueExpenses || []; // Enhanced
      }
    } catch (error) {
      console.log("No saved data found or localStorage unavailable");
    }
  }

  saveData() {
    try {
      const data = {
        tables: this.tables,
        orders: this.orders,
        orderHistory: this.orderHistory,
        menu: this.menu,
        customers: this.customers, // Enhanced
        dueExpenses: this.dueExpenses, // Enhanced
      };
      localStorage?.setItem("restaurantPOS", JSON.stringify(data));
    } catch (error) {
      console.log("Could not save data");
    }
  }

  bindEvents() {
    // ... (most of bindEvents remains the same)
    // Header navigation
    const kitchenBtn = document.getElementById("kitchenBtn");
    const reportsBtn = document.getElementById("reportsBtn");
    const exportBtn = document.getElementById("exportBtn");
    const menuEditorBtn = document.getElementById("menuEditorBtn");
    const tableEditorBtn = document.getElementById("tableEditorBtn");
    const customersBtn = document.getElementById("customersBtn"); // Enhanced
    const dueExpensesBtn = document.getElementById("dueExpensesBtn"); // Enhanced
    const importExportBtn = document.getElementById("importExportBtn"); // Enhanced

    if (kitchenBtn)
      kitchenBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.showKitchenView();
      });
    if (reportsBtn)
      reportsBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.showReportsView();
      });
    if (exportBtn)
      exportBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.showExportModal();
      });
    if (menuEditorBtn)
      menuEditorBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.showMenuEditor();
      });
    if (tableEditorBtn)
      tableEditorBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.showTableEditor();
      });
    if (customersBtn)
      customersBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.showCustomersView();
      }); // Enhanced
    if (dueExpensesBtn)
      dueExpensesBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.showDueExpensesView();
      }); // Enhanced
    if (importExportBtn)
      importExportBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.showImportExportModal();
      }); // Enhanced

    // Back buttons
    const backToDashboard = document.getElementById("backToDashboard");
    const backToDashboardFromReports = document.getElementById(
      "backToDashboardFromReports"
    );
    const backToDashboardFromMenu = document.getElementById(
      "backToDashboardFromMenu"
    );
    const backToDashboardFromTables = document.getElementById(
      "backToDashboardFromTables"
    );
    const backToDashboardFromCustomers = document.getElementById(
      "backToDashboardFromCustomers"
    ); // Enhanced
    const backToDashboardFromDueExpenses = document.getElementById(
      "backToDashboardFromDueExpenses"
    ); // Enhanced

    if (backToDashboard)
      backToDashboard.addEventListener("click", (e) => {
        e.preventDefault();
        this.showDashboard();
      });
    if (backToDashboardFromReports)
      backToDashboardFromReports.addEventListener("click", (e) => {
        e.preventDefault();
        this.showDashboard();
      });
    if (backToDashboardFromMenu)
      backToDashboardFromMenu.addEventListener("click", (e) => {
        e.preventDefault();
        this.showDashboard();
      });
    if (backToDashboardFromTables)
      backToDashboardFromTables.addEventListener("click", (e) => {
        e.preventDefault();
        this.showDashboard();
      });
    if (backToDashboardFromCustomers)
      backToDashboardFromCustomers.addEventListener("click", (e) => {
        e.preventDefault();
        this.showDashboard();
      }); // Enhanced
    if (backToDashboardFromDueExpenses)
      backToDashboardFromDueExpenses.addEventListener("click", (e) => {
        e.preventDefault();
        this.showDashboard();
      }); // Enhanced

    const summaryHeader = document.getElementById("summaryHeader");
    if (summaryHeader) {
      summaryHeader.addEventListener("click", () => {
        const footer = document.getElementById("tableSummaryFooter");
        footer.classList.toggle("collapsed");
      });
    }

    // Modal controls
    const closeTableModal = document.getElementById("closeTableModal");
    const closePaymentModal = document.getElementById("closePaymentModal");
    const closeBillSplitModal = document.getElementById("closeBillSplitModal");
    const closeExportModal = document.getElementById("closeExportModal");
    const closeMenuEditorModal = document.getElementById(
      "closeMenuEditorModal"
    );
    const closeTableEditorModal = document.getElementById(
      "closeTableEditorModal"
    );
    const closeImportExportModal = document.getElementById(
      "closeImportExportModal"
    ); // Enhanced
    const closeTableCustomersModal = document.getElementById(
      "closeTableCustomersModal"
    ); // Enhanced

    if (closeTableModal)
      closeTableModal.addEventListener("click", (e) => {
        e.preventDefault();
        this.closeModal("tableModal");
      });
    if (closePaymentModal)
      closePaymentModal.addEventListener("click", (e) => {
        e.preventDefault();
        this.closeModal("paymentModal");
      });
    if (closeBillSplitModal)
      closeBillSplitModal.addEventListener("click", (e) => {
        e.preventDefault();
        this.closeModal("billSplitModal");
      });
    if (closeExportModal)
      closeExportModal.addEventListener("click", (e) => {
        e.preventDefault();
        this.closeModal("exportModal");
      });
    if (closeMenuEditorModal)
      closeMenuEditorModal.addEventListener("click", (e) => {
        e.preventDefault();
        this.closeModal("menuEditorModal");
      });
    if (closeTableEditorModal)
      closeTableEditorModal.addEventListener("click", (e) => {
        e.preventDefault();
        this.closeModal("tableEditorModal");
      });
    if (closeImportExportModal)
      closeImportExportModal.addEventListener("click", (e) => {
        e.preventDefault();
        this.closeModal("importExportModal");
      }); // Enhanced
    if (closeTableCustomersModal)
      closeTableCustomersModal.addEventListener("click", (e) => {
        e.preventDefault();
        this.closeModal("tableCustomersModal");
      }); // Enhanced

    const addNewCustomerToTableBtn = document.getElementById(
      "addNewCustomerToTableBtn"
    );
    if (addNewCustomerToTableBtn) {
      addNewCustomerToTableBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.addCustomerToOccupiedTable();
      });
    }

    // Customer type toggle
    document.querySelectorAll('input[name="customerType"]').forEach((radio) => {
      radio.addEventListener("change", (e) => {
        this.toggleCustomerType(e.target.value);
      });
    });

    // Group customer management
    const updateCustomerCount = document.getElementById("updateCustomerCount");
    if (updateCustomerCount) {
      updateCustomerCount.addEventListener("click", (e) => {
        e.preventDefault();
        this.updateCustomerCount();
      });
    }

    // Menu search and filter for the main table modal
    const menuSearch = document.getElementById("menuSearch");
    const categoryFilter = document.getElementById("categoryFilter");
    if (menuSearch)
      menuSearch.addEventListener("input", () =>
        this.renderMenu("menuList", "menuSearch", "categoryFilter")
      );
    if (categoryFilter)
      categoryFilter.addEventListener("change", () =>
        this.renderMenu("menuList", "menuSearch", "categoryFilter")
      );

    // Order actions
    const splitBillBtn = document.getElementById("splitBillBtn");
    const processPaymentBtn = document.getElementById("processPaymentBtn");
    const markCleaningBtn = document.getElementById("markCleaningBtn");
    const clearTableBtn = document.getElementById("clearTableBtn");
    const clearCart = document.getElementById("clearCart"); // Enhanced: Clear cart button

    if (splitBillBtn)
      splitBillBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.showBillSplitModal();
      });
    if (processPaymentBtn)
      processPaymentBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.showPaymentModal();
      });
    if (markCleaningBtn)
      markCleaningBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.markTableForCleaning();
      });
    if (clearTableBtn)
      clearTableBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.clearTable();
      });
    if (clearCart)
      clearCart.addEventListener("click", (e) => {
        e.preventDefault();
        this.clearCurrentCart();
      }); // Enhanced

    // Payment
    const confirmPayment = document.getElementById("confirmPayment");
    if (confirmPayment) {
      confirmPayment.addEventListener("click", (e) => {
        e.preventDefault();
        this.processPayment();
      });
    }

    const paidAmount = document.getElementById("paidAmount");
    if (paidAmount) {
      paidAmount.addEventListener("input", () => this.updatePaymentDetails());
    }

    // Bill split
    const applySplit = document.getElementById("applySplit");
    if (applySplit) {
      applySplit.addEventListener("click", (e) => {
        e.preventDefault();
        this.applySplit();
      });
    }

    // Export
    const exportDataBtn = document.getElementById("exportData");
    if (exportDataBtn) {
      exportDataBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.exportData();
      });
    }

    // Menu editor
    const addMenuItem = document.getElementById("addMenuItem");
    if (addMenuItem) {
      addMenuItem.addEventListener("click", (e) => {
        e.preventDefault();
        this.addMenuItem();
      });
    }

    // Table editor
    const addTable = document.getElementById("addTable");
    if (addTable) {
      addTable.addEventListener("click", (e) => {
        e.preventDefault();
        this.addTable();
      });
    }

    // Enhanced: Customer management
    const saveCustomer = document.getElementById("saveCustomer");
    if (saveCustomer) {
      saveCustomer.addEventListener("click", (e) => {
        e.preventDefault();
        this.saveCustomer();
      });
    }

    // Enhanced: Due expenses management
    const addDueExpense = document.getElementById("addDueExpense");
    if (addDueExpense) {
      addDueExpense.addEventListener("click", (e) => {
        e.preventDefault();
        this.addDueExpense();
      });
    }

    // Enhanced: Import/Export functionality
    const importJsonData = document.getElementById("importJsonData");
    const exportJsonData = document.getElementById("exportJsonData");
    const exportCsvData = document.getElementById("exportCsvData");
    const importFileInput = document.getElementById("importFile");

    if (importJsonData)
      importJsonData.addEventListener("click", (e) => {
        e.preventDefault();
        this.importJsonData();
      });
    if (exportJsonData)
      exportJsonData.addEventListener("click", (e) => {
        e.preventDefault();
        this.exportJsonData();
      });
    if (exportCsvData)
      exportCsvData.addEventListener("click", (e) => {
        e.preventDefault();
        this.exportCsvData();
      });
    if (importFileInput)
      importFileInput.addEventListener("change", (e) =>
        this.handleFileImport(e)
      );

    // Customer selection in table modal
    const existingCustomerSelect = document.getElementById("existingCustomer");
    if (existingCustomerSelect) {
      existingCustomerSelect.addEventListener("change", (e) => {
        this.handleCustomerSelection(e.target.value);
      });
    }

    // Enhanced: Table customers modal actions
    const resetTableStatus = document.getElementById("resetTableStatus");
    if (resetTableStatus)
      resetTableStatus.addEventListener("click", (e) => {
        e.preventDefault();
        this.resetTableToAvailable();
      });

    // NEW: Add customer to table modal events
    const closeAddCustomerModal = document.getElementById(
      "closeAddCustomerModal"
    );
    if (closeAddCustomerModal) {
      closeAddCustomerModal.addEventListener("click", () =>
        this.closeModal("addCustomerToTableModal")
      );
    }

    const confirmAddCustomerBtn = document.getElementById(
      "confirmAddCustomerBtn"
    );
    if (confirmAddCustomerBtn) {
      confirmAddCustomerBtn.addEventListener("click", () =>
        this.confirmAddCustomerToTable()
      );
    }

    // NEW: Carousel navigation events
    const prevCustomerBtn = document.getElementById("prevCustomerBtn");
    if (prevCustomerBtn)
      prevCustomerBtn.addEventListener("click", () =>
        this.navigateToCustomer(-1)
      );

    const nextCustomerBtn = document.getElementById("nextCustomerBtn");
    if (nextCustomerBtn)
      nextCustomerBtn.addEventListener("click", () =>
        this.navigateToCustomer(1)
      );

    // Modal backdrop clicks
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.add("hidden");
          if (modal.id === "tableModal") {
            this.saveData();
            this.renderTables();
          }
        }
      });
    });
  }

  // ... (all other functions up to showTableCustomers)
  clearCurrentCart() {
    if (!this.currentTable) return;

    if (confirm("Are you sure you want to clear the current cart?")) {
      if (this.currentTable.isGroup) {
        if (this.currentTable.customers[this.currentCustomer]) {
          this.currentTable.customers[this.currentCustomer].orders = [];
        }
      } else {
        this.currentTable.orders = [];
      }

      this.renderCurrentOrder();
      this.updateOrderSummary();
      this.saveData();
    }
  }

  renderTables() {
    const tablesGrid = document.getElementById("tablesGrid");
    if (!tablesGrid) {
      console.error("tablesGrid element not found");
      return;
    }

    tablesGrid.innerHTML = "";

    this.tables.forEach((table) => {
      const tableCard = document.createElement("div");
      tableCard.className = `table-card table-card--${table.status}`;

      if (table.status === "occupied") {
        tableCard.addEventListener("click", () =>
          this.showTableCustomers(table.id)
        );
      } else {
        tableCard.addEventListener("click", () =>
          this.openTableModal(table.id)
        );
      }

      const occupiedTime = table.occupiedSince
        ? this.formatDuration(new Date() - new Date(table.occupiedSince))
        : "";
      const billTotal = this.calculateTableTotal(table);

      tableCard.innerHTML = `
                <div class="table-card__header">
                    <h3 class="table-card__title">${table.name}</h3>
                    <div class="table-card__status table-card__status--${
                      table.status
                    }">${table.status}</div>
                </div>
                <div class="table-card__body">
                    <div class="table-card__info">
                        <span class="table-card__capacity">Capacity: ${
                          table.capacity
                        }</span>
                        ${
                          table.status === "occupied"
                            ? `
                            <span class="table-card__customers">${
                              table.isGroup
                                ? `Group (${table.customerCount})`
                                : "1 Customer"
                            }</span>
                            <span class="table-card__time">Occupied: ${occupiedTime}</span>
                            <span class="table-card__total">Bill: ₹${billTotal.toFixed(
                              2
                            )}</span>
                        `
                            : ""
                        }
                    </div>
                </div>
            `;

      tablesGrid.appendChild(tableCard);
    });
  }

  populateAddCustomerSelect() {
    const select = document.getElementById("existingCustomerSelect");
    if (!select) return;

    const customersAtTable = new Set(
      this.currentTable.customers.map((c) => c.customerId)
    );

    select.innerHTML = '<option value="">-- Or Add New Below --</option>';

    this.customers
      .filter((customer) => !customersAtTable.has(customer.id))
      .forEach((customer) => {
        const option = document.createElement("option");
        option.value = customer.id;
        option.textContent = `${customer.name}${
          customer.phone ? ` (${customer.phone})` : ""
        }`;
        select.appendChild(option);
      });
  }

  confirmAddCustomerToTable() {
    if (!this.currentTable) return;

    const existingCustomerId = document.getElementById(
      "existingCustomerSelect"
    ).value;
    const newCustomerName = document
      .getElementById("newCustomerName")
      .value.trim();
    const newCustomerPhone = document
      .getElementById("newCustomerPhone")
      .value.trim();

    let customerToAdd = {
      customerId: null,
      name: "",
      orders: [],
      paymentStatus: "unpaid",
    };

    if (existingCustomerId) {
      const customer = this.customers.find(
        (c) => c.id === parseInt(existingCustomerId)
      );
      if (customer) {
        customerToAdd.customerId = customer.id;
        customerToAdd.name = customer.name;
      }
    } else if (newCustomerName) {
      const uniqueName = this.generateUniqueCustomerName(newCustomerName);
      const newCustomer = {
        id: Date.now(),
        name: uniqueName,
        phone: newCustomerPhone,
        isGroup: false,
        createdAt: new Date().toISOString(),
        totalSpent: 0,
        dueAmount: 0,
        orderHistory: [],
      };
      this.customers.push(newCustomer);
      customerToAdd.customerId = newCustomer.id;
      customerToAdd.name = newCustomer.name;
    } else {
      alert(
        "Please either select an existing customer or enter a name for a new customer."
      );
      return;
    }

    if (!this.currentTable.isGroup) {
      this.currentTable.isGroup = true;

      const originalCustomer = this.customers.find(
        (c) => c.id === this.currentTable.currentCustomerId
      );
      const firstCustomerData = {
        orders: this.currentTable.orders,
        name: originalCustomer ? originalCustomer.name : "Guest",
        customerId: this.currentTable.currentCustomerId,
        paymentStatus: "unpaid",
      };

      this.currentTable.customers = [firstCustomerData];
      this.currentTable.orders = [];
    }

    this.currentTable.customers.push(customerToAdd);
    this.currentTable.customerCount = this.currentTable.customers.length;

    // Navigate to the newly added customer
    this.currentCustomer = this.currentTable.customers.length - 1;

    this.closeModal("addCustomerToTableModal");
    this.renderAllCustomerOrders();
    this.updateCustomerCarouselView();
    this.saveData();
  }

  // MODIFIED: This function now initializes the carousel and moves the reset button
  showTableCustomers(tableId) {
    const table = this.tables.find((t) => t.id === tableId);
    if (!table) return;

    this.currentTable = table;
    this.currentCustomer = 0; // Always start at the first customer

    const modal = document.getElementById("tableCustomersModal");
    const title = document.getElementById("tableCustomersTitle");

    if (title) {
      title.textContent = `${table.name} - Management`;
      // Move the reset button to the header
      const modalHeader = title.parentElement;
      const resetButton = document.getElementById("resetTableStatus");
      if (modalHeader && resetButton) {
        modalHeader.appendChild(resetButton);
      }
    }

    this.renderAllCustomerOrders(); // Render all cards
    this.updateCustomerCarouselView(); // Position the carousel correctly

    this.renderMenu("menuListMgmt", "menuSearchMgmt", "categoryFilterMgmt");
    this.updateTablePaymentSummary();

    const menuSearchMgmt = document.getElementById("menuSearchMgmt");
    const categoryFilterMgmt = document.getElementById("categoryFilterMgmt");

    if (menuSearchMgmt)
      menuSearchMgmt.oninput = () =>
        this.renderMenu("menuListMgmt", "menuSearchMgmt", "categoryFilterMgmt");
    if (categoryFilterMgmt)
      categoryFilterMgmt.onchange = () =>
        this.renderMenu("menuListMgmt", "menuSearchMgmt", "categoryFilterMgmt");

    if (modal) modal.classList.remove("hidden");
  }

  // NEW: Function to navigate the customer carousel
  navigateToCustomer(direction) {
    if (!this.currentTable) return;
    const customerCount = this.currentTable.customers.length;
    if (customerCount <= 1) return;

    // Update current customer index
    this.currentCustomer += direction;

    // Loop around
    if (this.currentCustomer >= customerCount) {
      this.currentCustomer = 0;
    }
    if (this.currentCustomer < 0) {
      this.currentCustomer = customerCount - 1;
    }

    this.updateCustomerCarouselView();
  }

  // MODIFIED: Function to update the visual state of the carousel (header removed)
  updateCustomerCarouselView() {
    if (!this.currentTable) return;

    const customerList = document.getElementById("tableCustomersList");
    const prevBtn = document.getElementById("prevCustomerBtn");
    const nextBtn = document.getElementById("nextCustomerBtn");

    const customers = this.currentTable.customers;
    const totalCustomers = customers.length;

    if (totalCustomers > 0 && customerList) {
      const offset = -this.currentCustomer * 100;
      customerList.style.transform = `translateX(${offset}%)`;
    }

    // Disable/enable arrows
    if (prevBtn && nextBtn) {
      prevBtn.disabled = totalCustomers <= 1;
      nextBtn.disabled = totalCustomers <= 1;
    }
  }

  // MODIFIED: renderAllCustomerOrders now creates cards for the carousel
  renderAllCustomerOrders() {
    const customersList = document.getElementById("tableCustomersList");
    if (!customersList || !this.currentTable) return;

    // Clear previous transform to prevent rendering glitches
    customersList.style.transform = "translateX(0%)";
    customersList.innerHTML = "";

    if (this.currentTable.customers.length === 0) {
      customersList.innerHTML =
        '<div class="table-customer-card empty-state">No customers at this table. Add one to begin.</div>';
    }

    this.currentTable.customers.forEach((customer, index) => {
      const customerCard = document.createElement("div");
      customerCard.className = "table-customer-card";

      const subtotal = (customer.orders || []).reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const tax = subtotal * this.taxRate;
      const grandTotal = subtotal + tax;
      const isPaid = customer.paymentStatus === "paid";

      // Card structure is now Header, Body (scrollable), Footer
      customerCard.innerHTML = `
          <div class="customer-card-header">
              <h4>${customer.name || `Customer ${index + 1}`}</h4>
              <span class="payment-status ${isPaid ? "paid" : "unpaid"}">${
        isPaid ? "PAID" : "UNPAID"
      }</span>
              <button class="remove-customer-btn" onclick="pos.removeCustomerFromTable(${index})" title="Remove Customer">×</button>
          </div>

          <div class="customer-orders-editable">
              ${
                customer.orders && customer.orders.length > 0
                  ? customer.orders
                      .map(
                        (item, itemIndex) => `
                  <div class="cart-item">
                      <div class="cart-item__info">
                          <span class="cart-item__name">${item.name}</span>
                          <span class="cart-item__price">₹${item.price.toFixed(
                            2
                          )}</span>
                      </div>
                      <div class="cart-item__controls">
                          <button class="quantity-btn" onclick="pos.changeQuantityForCustomer(${index}, ${itemIndex}, -1)">−</button>
                          <span class="quantity-display">${item.quantity}</span>
                          <button class="quantity-btn" onclick="pos.changeQuantityForCustomer(${index}, ${itemIndex}, 1)">+</button>
                          <button class="remove-btn" onclick="pos.removeFromOrderForCustomer(${index}, ${itemIndex})">×</button>
                      </div>
                  </div>`
                      )
                      .join("")
                  : '<div class="empty-order">No items ordered yet.</div>'
              }
          </div>
          <div class="customer-card-footer">
              <div class="customer-total">
                  <div class="total-line">Subtotal: ₹${subtotal.toFixed(
                    2
                  )}</div>
                  <div class="total-line grand-total">Total (inc. tax): ₹${grandTotal.toFixed(
                    2
                  )}</div>
              </div>
              
              <div class="card-footer-actions">
                  <button class="btn btn--primary btn--full" onclick="pos.setActiveCustomer(${index})">
                      Add Item to ${customer.name || `Customer ${index + 1}`}
                  </button>
                  ${
                    !isPaid
                      ? `<button onclick="pos.markCustomerPaid(${index})" class="btn btn--secondary btn--sm">Mark as Paid</button>`
                      : `<button onclick="pos.markCustomerUnpaid(${index})" class="btn btn--outline btn--sm">Mark as Unpaid</button>`
                  }
              </div>
          </div>
      `;
      customersList.appendChild(customerCard);
    });
  }

  // MODIFIED: Needs to update carousel view after removing a customer
  removeCustomerFromTable(customerIndex) {
    if (!this.currentTable || !this.currentTable.customers[customerIndex])
      return;

    const customer = this.currentTable.customers[customerIndex];
    let confirmationMessage = `Are you sure you want to remove ${
      customer.name || `Customer ${customerIndex + 1}`
    }?`;
    if (customer.orders && customer.orders.length > 0) {
      confirmationMessage +=
        "\n\nWARNING: This customer has items in their order. This action cannot be undone.";
    }

    if (confirm(confirmationMessage)) {
      this.currentTable.customers.splice(customerIndex, 1);
      this.currentTable.customerCount = this.currentTable.customers.length;

      if (this.currentTable.customers.length === 0) {
        this.currentTable.isGroup = false;
        this.currentTable.orders = [];
      }

      // Adjust the currentCustomer index to avoid being out of bounds
      if (this.currentCustomer >= this.currentTable.customers.length) {
        this.currentCustomer = Math.max(
          0,
          this.currentTable.customers.length - 1
        );
      }

      this.renderAllCustomerOrders();
      this.updateCustomerCarouselView();
      this.updateTablePaymentSummary();
      this.saveData();
    }
  }

  // MODIFIED: setActiveCustomer now just sets the index. The view is handled by the carousel.
  setActiveCustomer(customerIndex) {
    // This function will add an item to the CURRENTLY VISIBLE customer.
    // So we just need to ensure our main index is set correctly.
    this.currentCustomer = customerIndex;
    alert(
      `Active for adding items: ${
        this.currentTable.customers[customerIndex].name ||
        `Customer ${customerIndex + 1}`
      }. Click an item from the menu.`
    );
  }

  // ... (The rest of the file remains the same)
  markCustomerPaid(customerIndex) {
    if (!this.currentTable) return;

    // We can now directly target the customer in the customers array.
    if (this.currentTable.customers[customerIndex]) {
      this.currentTable.customers[customerIndex].paymentStatus = "paid";
      this.currentTable.customers[customerIndex].paidAt =
        new Date().toISOString();
    }

    this.renderAllCustomerOrders();
    this.updateTablePaymentSummary();
    this.saveData();
  }

  markCustomerUnpaid(customerIndex) {
    if (!this.currentTable) return;

    if (this.currentTable.isGroup) {
      if (this.currentTable.customers[customerIndex]) {
        this.currentTable.customers[customerIndex].paymentStatus = "unpaid";
        delete this.currentTable.customers[customerIndex].paidAt;
      }
    } else {
      this.currentTable.paymentStatus = "unpaid";
      delete this.currentTable.paidAt;
    }

    this.renderAllCustomerOrders();
    this.updateTablePaymentSummary();
    this.saveData();
  }

  checkAllCustomersPaid() {
    if (!this.currentTable) return;

    let allPaid = true;

    const customers = this.currentTable.isGroup
      ? this.currentTable.customers
      : [
          {
            orders: this.currentTable.orders,
            paymentStatus: this.currentTable.paymentStatus,
          },
        ];

    if (customers.length === 0) {
      allPaid = true; // An empty table is considered "paid" for reset purposes
    } else {
      for (const customer of customers) {
        if (
          customer.orders &&
          customer.orders.length > 0 &&
          customer.paymentStatus !== "paid"
        ) {
          allPaid = false;
          break;
        }
      }
    }

    const resetButton = document.getElementById("resetTableStatus");
    if (resetButton) {
      resetButton.disabled = !allPaid;
      resetButton.textContent = allPaid
        ? "Reset to Available"
        : "All customers must pay first";
    }
  }

  resetTableToAvailable() {
    if (!this.currentTable) return;

    this.checkAllCustomersPaid(); // Ensure status is up-to-date
    const resetButton = document.getElementById("resetTableStatus");
    if (resetButton && resetButton.disabled) {
      alert("All customers must complete payment before resetting the table.");
      return;
    }

    if (
      confirm(
        "Reset table to available status? This will clear all order data and record it in history."
      )
    ) {
      const allOrders = [];
      const customers = this.currentTable.isGroup
        ? this.currentTable.customers
        : [{ orders: this.currentTable.orders }];
      customers.forEach((customer) => {
        if (customer.orders) {
          allOrders.push(...customer.orders);
        }
      });

      if (allOrders.length > 0) {
        const orderData = {
          tableId: this.currentTable.id,
          timestamp: new Date().toISOString(),
          total: this.calculateTableTotal(this.currentTable),
          paid: this.calculateTableTotal(this.currentTable),
          change: 0,
          paymentMethod: "Mixed",
          orders: allOrders,
          isGroup: this.currentTable.isGroup,
          customerCount: this.currentTable.customerCount,
          customerId: this.currentTable.currentCustomerId,
        };
        this.orderHistory.push(orderData);
      }

      this.currentTable.status = "available";
      this.currentTable.customers = [];
      this.currentTable.orders = [];
      this.currentTable.isGroup = false;
      this.currentTable.customerCount = 1;
      this.currentTable.occupiedSince = null;
      this.currentTable.currentCustomerId = null;
      this.currentTable.paymentStatus = null;

      this.closeModal("tableCustomersModal");
      this.updateReports();
      this.saveData();
      this.renderTables();

      alert("Table reset to available status!");
    }
  }

  updateTablePaymentSummary() {
    if (!this.currentTable) return;

    const totalBill = this.calculateTableTotal(this.currentTable);
    let totalPaid = 0;

    const customers = this.currentTable.isGroup
      ? this.currentTable.customers
      : [
          {
            ...this.currentTable,
            paymentStatus: this.currentTable.paymentStatus,
          },
        ];

    customers.forEach((customer) => {
      if (customer.paymentStatus === "paid" && customer.orders) {
        const customerSubtotal = customer.orders.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        totalPaid += customerSubtotal * (1 + this.taxRate);
      }
    });

    const remaining = totalBill - totalPaid;

    // Update expanded view
    document.getElementById("tableTotal").textContent = totalBill.toFixed(2);
    document.getElementById("tablePaid").textContent = totalPaid.toFixed(2);
    document.getElementById("tableRemaining").textContent =
      remaining.toFixed(2);

    // Update collapsed preview
    document.getElementById("tableTotalPreview").textContent =
      totalBill.toFixed(2);
    document.getElementById("tableRemainingPreview").textContent =
      remaining.toFixed(2);

    this.checkAllCustomersPaid();
  }

  openTableModal(tableId) {
    const table = this.tables.find((t) => t.id === tableId);
    if (!table) return;

    this.currentTable = table;
    this.currentCustomer = 0;

    const tableModalTitle = document.getElementById("tableModalTitle");
    if (tableModalTitle) {
      tableModalTitle.textContent = `${table.name} - ${table.status}`;
    }

    // Set default customer type to individual
    document.querySelector(
      'input[name="customerType"][value="individual"]'
    ).checked = true;
    this.toggleCustomerType("individual");
    document.getElementById("currentOrderTabs").innerHTML = "";

    // Ensure menu and customer sections are visible for available tables
    if (table.status === "cleaning") {
      document.querySelector(".customer-section")?.classList.add("hidden");
      document.querySelector(".menu-section")?.classList.add("hidden");
    } else {
      document.querySelector(".customer-section")?.classList.remove("hidden");
      document.querySelector(".menu-section")?.classList.remove("hidden");
    }

    this.populateCustomerSelect();

    // **IMPROVEMENT 1: Clear all customer input fields for a new table**
    document.getElementById("existingCustomer").value = "";
    document.getElementById("customerName").value = "";
    document.getElementById("customerPhone").value = "";
    document.getElementById("groupName").value = "";

    this.renderMenu("menuList", "menuSearch", "categoryFilter");
    this.renderCurrentOrder();
    this.updateOrderSummary();

    const tableModal = document.getElementById("tableModal");
    if (tableModal) {
      tableModal.classList.remove("hidden");
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("hidden");
    }
  }

  toggleCustomerType(type) {
    const individualForm = document.querySelector(".individual-form");
    const groupForm = document.getElementById("groupForm");

    if (type === "group") {
      individualForm?.classList.add("hidden");
      groupForm?.classList.remove("hidden");
    } else {
      individualForm?.classList.remove("hidden");
      groupForm?.classList.add("hidden");
    }
  }

  updateCustomerCount() {
    if (!this.currentTable) return;

    const customerCountInput = document.getElementById("customerCount");
    const newCount = parseInt(customerCountInput?.value) || 2;

    this.currentTable.customerCount = newCount;
    this.currentTable.isGroup = true;

    while (this.currentTable.customers.length < newCount) {
      this.currentTable.customers.push({ orders: [] });
    }

    this.currentTable.customers = this.currentTable.customers.slice(
      0,
      newCount
    );

    this.renderOrderTabs();
    this.renderCurrentOrder();
  }

  renderOrderTabs() {
    const currentOrderTabs = document.getElementById("currentOrderTabs");
    if (!currentOrderTabs || !this.currentTable) return;

    currentOrderTabs.innerHTML = "";

    if (this.currentTable.isGroup) {
      for (let i = 0; i < this.currentTable.customerCount; i++) {
        const tab = document.createElement("button");
        tab.className = `order-tab ${
          i === this.currentCustomer ? "active" : ""
        }`;
        tab.textContent = `Customer ${i + 1}`;
        tab.dataset.customer = i;
        tab.addEventListener("click", () => {
          this.currentCustomer = i;
          this.renderOrderTabs();
          this.renderCurrentOrder();
        });
        currentOrderTabs.appendChild(tab);
      }
    } else {
      const tab = document.createElement("button");
      tab.className = "order-tab active";
      tab.textContent = "Customer 1";
      tab.dataset.customer = 0;
      currentOrderTabs.appendChild(tab);
    }
  }

  renderMenu(listId, searchId, categoryId) {
    const menuList = document.getElementById(listId);
    if (!menuList) return;

    const searchTerm =
      document.getElementById(searchId)?.value.toLowerCase() || "";
    const categoryFilter = document.getElementById(categoryId)?.value || "";

    let filteredMenu = this.menu.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm);
      const matchesCategory =
        !categoryFilter || item.category === categoryFilter;
      return matchesSearch && matchesCategory && item.available;
    });

    menuList.innerHTML = "";

    filteredMenu.forEach((item) => {
      const menuItem = document.createElement("div");
      menuItem.className = "menu-item";
      menuItem.innerHTML = `
                <div class="menu-item__info">
                    <h4 class="menu-item__name">${item.name}</h4>
                    <p class="menu-item__description">${item.description}</p>
                    <span class="menu-item__price">₹${item.price.toFixed(
                      2
                    )}</span>
                </div>
                <button class="menu-item__add" onclick="pos.addItemToOrder(${
                  item.id
                }, '${listId}')">Add</button>
            `;
      menuList.appendChild(menuItem);
    });
  }

  addItemToOrder(itemId, context) {
    if (!this.currentTable) return;

    // First, handle the case of an empty table and set up the structure
    if (this.currentTable.status === "available") {
      this.autoSaveCustomerData();
      this.currentTable.status = "occupied";
      this.currentTable.occupiedSince = new Date().toISOString();

      // Convert to the new customer structure immediately
      const linkedCustomer = this.customers.find(
        (c) => c.id === this.currentTable.currentCustomerId
      );

      const firstCustomer = {
        orders: [], // Start with an empty order list
        name: linkedCustomer ? linkedCustomer.name : "Guest",
        customerId: this.currentTable.currentCustomerId,
        paymentStatus: "unpaid",
      };

      this.currentTable.customers = [firstCustomer];
      this.currentTable.customerCount = 1;
      this.currentTable.isGroup = true; // Unify the data model
      this.currentCustomer = 0; // Set the active customer
    }

    const menuItem = this.menu.find((item) => item.id === itemId);
    if (!menuItem) return;

    // Now, find the target order list using the unified structure
    const currentCustomerInTable =
      this.currentTable.customers[this.currentCustomer];
    if (!currentCustomerInTable) {
      console.error("Could not find the current customer for the table.");
      return;
    }
    const targetOrderList = currentCustomerInTable.orders;

    // Proceed with adding the item
    const existingItem = targetOrderList.find((item) => item.id === itemId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      const orderItem = {
        id: itemId,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
      };
      targetOrderList.push(orderItem);
    }

    // Conditionally render the correct UI based on context
    if (context === "menuList") {
      // This is for the initial order-taking modal
      this.renderCurrentOrder();
      this.updateOrderSummary();
      this.renderTables(); // Also update the dashboard view
    } else {
      // This is for the detailed management modal
      this.renderAllCustomerOrders();
      this.updateCustomerCarouselView();
      this.updateTablePaymentSummary();
    }

    this.saveData();
  }

  changeQuantityForCustomer(customerIndex, itemIndex, change) {
    const customer = this.currentTable.customers[customerIndex];
    if (customer && customer.orders[itemIndex]) {
      customer.orders[itemIndex].quantity += change;
      if (customer.orders[itemIndex].quantity <= 0) {
        customer.orders.splice(itemIndex, 1);
      }
    }
    this.renderAllCustomerOrders();
    this.updateCustomerCarouselView();
    this.updateTablePaymentSummary();
    this.saveData();
  }

  removeFromOrderForCustomer(customerIndex, itemIndex) {
    const customer = this.currentTable.customers[customerIndex];
    if (customer && customer.orders) {
      customer.orders.splice(itemIndex, 1);
    }
    this.renderAllCustomerOrders();
    this.updateCustomerCarouselView();
    this.updateTablePaymentSummary();
    this.saveData();
  }

  addCustomerToOccupiedTable() {
    if (!this.currentTable) return;
    this.populateAddCustomerSelect();

    document.getElementById("newCustomerName").value = "";
    document.getElementById("newCustomerPhone").value = "";

    const modal = document.getElementById("addCustomerToTableModal");
    if (modal) modal.classList.remove("hidden");
  }

  generateUniqueCustomerName(name) {
    const existingNames = new Set(this.customers.map((c) => c.name));
    if (!existingNames.has(name)) {
      return name;
    }

    let suffix = 2;
    let newName = `${name} (${suffix})`;
    while (existingNames.has(newName)) {
      suffix++;
      newName = `${name} (${suffix})`;
    }
    return newName;
  }

  autoSaveCustomerData() {
    const customerName = document.getElementById("customerName")?.value.trim();
    const customerPhone = document
      .getElementById("customerPhone")
      ?.value.trim();
    const groupName = document.getElementById("groupName")?.value.trim();
    const existingCustomerId =
      document.getElementById("existingCustomer")?.value;

    if (existingCustomerId && existingCustomerId !== "") {
      this.currentTable.currentCustomerId = parseInt(existingCustomerId);
      return;
    }

    if (customerName || groupName) {
      const isGroup =
        document.querySelector('input[name="customerType"]:checked')?.value ===
        "group";

      const nameToCheck = isGroup ? groupName : customerName;
      const uniqueName = this.generateUniqueCustomerName(nameToCheck);

      const customer = {
        id: Date.now(),
        name: uniqueName,
        phone: customerPhone || "",
        isGroup: isGroup,
        createdAt: new Date().toISOString(),
        totalSpent: 0,
        dueAmount: 0,
        orderHistory: [],
      };

      this.customers.push(customer);
      this.currentTable.currentCustomerId = customer.id;

      this.populateCustomerSelect();

      console.log("Customer automatically saved:", customer.name);
    }
  }

  renderCurrentOrder() {
    const currentOrderList = document.getElementById("currentOrderList");
    if (!currentOrderList || !this.currentTable) return;

    currentOrderList.innerHTML = "";

    let orders;
    if (this.currentTable.isGroup) {
      orders = this.currentTable.customers[this.currentCustomer]?.orders || [];
    } else {
      orders = this.currentTable.orders;
    }

    if (orders.length === 0) {
      currentOrderList.innerHTML =
        '<div class="empty-order">No items in cart yet.</div>';
      return;
    }

    orders.forEach((item, index) => {
      const orderItem = document.createElement("div");
      orderItem.className = "cart-item";
      orderItem.innerHTML = `
                <div class="cart-item__info">
                    <span class="cart-item__name">${item.name}</span>
                    <span class="cart-item__price">₹${item.price.toFixed(
                      2
                    )} each</span>
                </div>
                <div class="cart-item__controls">
                    <button class="quantity-btn quantity-btn--minus" onclick="pos.changeQuantity(${index}, -1)">−</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn quantity-btn--plus" onclick="pos.changeQuantity(${index}, 1)">+</button>
                    <span class="item-total">₹${(
                      item.price * item.quantity
                    ).toFixed(2)}</span>
                    <button class="remove-btn" onclick="pos.removeFromOrder(${index})" title="Remove item">×</button>
                </div>
            `;
      currentOrderList.appendChild(orderItem);
    });
  }

  changeQuantity(itemIndex, change) {
    if (!this.currentTable) return;

    let orders;
    if (this.currentTable.isGroup) {
      orders = this.currentTable.customers[this.currentCustomer]?.orders || [];
    } else {
      orders = this.currentTable.orders;
    }

    if (orders[itemIndex]) {
      orders[itemIndex].quantity += change;

      if (orders[itemIndex].quantity <= 0) {
        orders.splice(itemIndex, 1);
      }
    }

    this.renderCurrentOrder();
    this.updateOrderSummary();
    this.saveData();
  }

  removeFromOrder(itemIndex) {
    if (!this.currentTable) return;

    let orders;
    if (this.currentTable.isGroup) {
      orders = this.currentTable.customers[this.currentCustomer]?.orders || [];
    } else {
      orders = this.currentTable.orders;
    }

    orders.splice(itemIndex, 1);

    this.renderCurrentOrder();
    this.updateOrderSummary();
    this.saveData();
  }

  calculateTableTotal(table) {
    let total = 0;

    const customersToTotal = table.isGroup
      ? table.customers
      : [{ orders: table.orders }];

    customersToTotal.forEach((customer) => {
      if (customer && customer.orders) {
        customer.orders.forEach((item) => {
          total += item.price * item.quantity;
        });
      }
    });

    return total * (1 + this.taxRate);
  }

  updateOrderSummary() {
    if (!this.currentTable) return;
    const totalWithTax = this.calculateTableTotal(this.currentTable);
    const subtotal = totalWithTax / (1 + this.taxRate);
    const tax = totalWithTax - subtotal;

    const orderSubtotal = document.getElementById("orderSubtotal");
    const orderTax = document.getElementById("orderTax");
    const orderTotal = document.getElementById("orderTotal");

    if (orderSubtotal) orderSubtotal.textContent = subtotal.toFixed(2);
    if (orderTax) orderTax.textContent = tax.toFixed(2);
    if (orderTotal) orderTotal.textContent = totalWithTax.toFixed(2);
  }

  showBillSplitModal() {
    const billSplitModal = document.getElementById("billSplitModal");
    if (billSplitModal) {
      billSplitModal.classList.remove("hidden");
    }
    this.updateSplitOptions();
  }

  updateSplitOptions() {
    const splitType =
      document.querySelector('input[name="splitType"]:checked')?.value ||
      "equal";
    const splitDetails = document.getElementById("splitDetails");
    if (!splitDetails) return;

    const total = this.calculateTableTotal(this.currentTable);

    if (splitType === "equal") {
      const customerCount = this.currentTable.isGroup
        ? this.currentTable.customerCount
        : 1;
      const perPerson = total / customerCount;
      splitDetails.innerHTML = `
                <div class="split-equal">
                    <p>Total: ₹${total.toFixed(2)}</p>
                    <p>Per person (${customerCount}): ₹${perPerson.toFixed(
        2
      )}</p>
                </div>
            `;
    } else if (splitType === "items") {
      splitDetails.innerHTML =
        "<p>Select items for each customer (implementation pending).</p>";
    } else if (splitType === "custom") {
      splitDetails.innerHTML =
        "<p>Enter custom amounts (implementation pending).</p>";
    }
  }

  applySplit() {
    this.closeModal("billSplitModal");
    this.showPaymentModal();
  }

  showPaymentModal() {
    const total = this.calculateTableTotal(this.currentTable);

    const paymentTotal = document.getElementById("paymentTotal");
    const paidAmount = document.getElementById("paidAmount");

    if (paymentTotal) paymentTotal.textContent = total.toFixed(2);
    if (paidAmount) paidAmount.value = "";

    this.updatePaymentDetails();

    const paymentModal = document.getElementById("paymentModal");
    if (paymentModal) {
      paymentModal.classList.remove("hidden");
    }
  }

  updatePaymentDetails() {
    const total = this.calculateTableTotal(this.currentTable);

    const paidAmountInput = document.getElementById("paidAmount");
    const totalDue = document.getElementById("totalDue");
    const totalChange = document.getElementById("totalChange");

    const paid = parseFloat(paidAmountInput?.value) || 0;
    const due = total - paid;

    if (totalDue) totalDue.textContent = Math.max(due, 0).toFixed(2);
    if (totalChange) totalChange.textContent = Math.max(-due, 0).toFixed(2);
  }

  processPayment() {
    const total = this.calculateTableTotal(this.currentTable);

    const paidAmountInput = document.getElementById("paidAmount");
    const paid = parseFloat(paidAmountInput?.value) || 0;

    if (paid < total) {
      const dueAmount = total - paid;
      if (
        confirm(
          `Payment is ₹${dueAmount.toFixed(
            2
          )} short. Add this as due amount for the customer?`
        )
      ) {
        if (this.currentTable.currentCustomerId) {
          const customer = this.customers.find(
            (c) => c.id === this.currentTable.currentCustomerId
          );
          if (customer) {
            const dueExpense = {
              id: Date.now(),
              customerId: customer.id,
              amount: dueAmount,
              description: `Partial payment for Table ${this.currentTable.id}`,
              status: "pending",
              createdAt: new Date().toISOString(),
              orderId: `TBL${this.currentTable.id}-${Date.now()}`,
            };
            this.dueExpenses.push(dueExpense);
            customer.dueAmount = (customer.dueAmount || 0) + dueAmount;
          }
        }
      } else {
        alert("Please pay the full amount or add as due expense.");
        return;
      }
    }

    const paymentMethodSelect = document.getElementById("paymentMethod");
    const paymentMethod = paymentMethodSelect
      ? paymentMethodSelect.value
      : "Cash";

    const allOrders = [];
    if (this.currentTable.isGroup) {
      this.currentTable.customers.forEach((customer) => {
        if (customer.orders) {
          allOrders.push(...customer.orders);
        }
      });
    } else {
      allOrders.push(...this.currentTable.orders);
    }

    const orderData = {
      tableId: this.currentTable.id,
      timestamp: new Date().toISOString(),
      total: total,
      paid: paid,
      change: Math.max(0, paid - total),
      paymentMethod: paymentMethod,
      orders: allOrders,
      isGroup: this.currentTable.isGroup,
      customerCount: this.currentTable.isGroup
        ? this.currentTable.customerCount
        : 1,
      customerId: this.currentTable.currentCustomerId,
    };
    this.orderHistory.push(orderData);

    if (this.currentTable.currentCustomerId) {
      const customer = this.customers.find(
        (c) => c.id === this.currentTable.currentCustomerId
      );
      if (customer) {
        customer.totalSpent = (customer.totalSpent || 0) + paid;
        customer.orderHistory = customer.orderHistory || [];
        customer.orderHistory.push(orderData);
      }
    }

    this.currentTable.status = "cleaning";
    this.currentTable.customers = [];
    this.currentTable.orders = [];
    this.currentTable.isGroup = false;
    this.currentTable.customerCount = 1;
    this.currentTable.occupiedSince = null;
    this.currentTable.currentCustomerId = null;

    this.closeModal("paymentModal");
    this.closeModal("tableModal");
    this.updateReports();
    this.saveData();
    this.renderTables();

    alert(
      `Payment processed successfully! ${
        paid < total ? "Due amount added to customer account." : ""
      }`
    );
  }

  markTableForCleaning() {
    if (this.currentTable) {
      this.currentTable.status = "cleaning";
      this.closeModal("tableModal");
      this.saveData();
      this.renderTables();
    }
  }

  clearTable() {
    if (this.currentTable) {
      this.currentTable.status = "available";
      this.currentTable.customers = [];
      this.currentTable.orders = [];
      this.currentTable.isGroup = false;
      this.currentTable.customerCount = 1;
      this.currentTable.occupiedSince = null;
      this.currentTable.currentCustomerId = null;
      this.closeModal("tableModal");
      this.saveData();
      this.renderTables();
    }
  }

  saveCustomer() {
    const name = document.getElementById("customerName")?.value.trim();
    const phone = document.getElementById("customerPhone")?.value.trim();
    const groupName = document.getElementById("groupName")?.value.trim();
    const isGroup =
      document.querySelector('input[name="customerType"]:checked')?.value ===
      "group";

    const nameToCheck = isGroup ? groupName : name;
    if (!nameToCheck) {
      alert("Please enter a customer name or group name.");
      return;
    }

    const uniqueName = this.generateUniqueCustomerName(nameToCheck);

    const customer = {
      id: Date.now(),
      name: uniqueName,
      phone: phone || "",
      isGroup: isGroup,
      createdAt: new Date().toISOString(),
      totalSpent: 0,
      dueAmount: 0,
      orderHistory: [],
    };

    this.customers.push(customer);

    if (this.currentTable) {
      this.currentTable.currentCustomerId = customer.id;
    }

    this.saveData();
    this.populateCustomerSelect();
    this.populateExpenseCustomerSelect();

    document.getElementById("customerName").value = "";
    document.getElementById("customerPhone").value = "";
    document.getElementById("groupName").value = "";

    alert("Customer saved successfully!");
  }

  populateCustomerSelect() {
    const select = document.getElementById("existingCustomer");
    if (!select) return;

    select.innerHTML = '<option value="">New Customer</option>';

    this.customers.forEach((customer) => {
      const option = document.createElement("option");
      option.value = customer.id;
      option.textContent = `${customer.name}${
        customer.phone ? ` (${customer.phone})` : ""
      }`;
      select.appendChild(option);
    });
  }

  handleCustomerSelection(customerId) {
    if (!customerId || customerId === "") {
      document.getElementById("customerName").value = "";
      document.getElementById("customerPhone").value = "";
      document.getElementById("groupName").value = "";
      return;
    }

    const customer = this.customers.find((c) => c.id === parseInt(customerId));
    if (customer) {
      document.getElementById("customerName").value = customer.isGroup
        ? ""
        : customer.name;
      document.getElementById("customerPhone").value = customer.phone || "";
      document.getElementById("groupName").value = customer.isGroup
        ? customer.name
        : "";

      const customerTypeRadio = customer.isGroup
        ? document.querySelector('input[name="customerType"][value="group"]')
        : document.querySelector(
            'input[name="customerType"][value="individual"]'
          );
      if (customerTypeRadio) {
        customerTypeRadio.checked = true;
        this.toggleCustomerType(customer.isGroup ? "group" : "individual");
      }

      if (this.currentTable) {
        this.currentTable.currentCustomerId = customer.id;
      }
    }
  }

  showCustomersView() {
    document.getElementById("mainDashboard")?.classList.add("hidden");
    document.getElementById("kitchenView")?.classList.add("hidden");
    document.getElementById("reportsView")?.classList.add("hidden");
    document.getElementById("menuEditorView")?.classList.add("hidden");
    document.getElementById("tableEditorView")?.classList.add("hidden");
    document.getElementById("dueExpensesView")?.classList.add("hidden");
    document.getElementById("customersView")?.classList.remove("hidden");

    this.renderCustomersList();
    this.updateCustomersStats();
  }

  renderCustomersList() {
    const customersList = document.getElementById("customersList");
    if (!customersList) return;

    customersList.innerHTML = "";

    if (this.customers.length === 0) {
      customersList.innerHTML =
        '<div class="empty-state">No customers found. Add customers through table management.</div>';
      return;
    }

    this.customers.forEach((customer) => {
      const customerCard = document.createElement("div");
      customerCard.className = "customer-card";
      customerCard.innerHTML = `
                <div class="customer-header">
                    <h4>${customer.name}</h4>
                    <span class="customer-type ${
                      customer.isGroup ? "group" : "individual"
                    }">${customer.isGroup ? "Group" : "Individual"}</span>
                </div>
                <div class="customer-details">
                    <p><strong>Phone:</strong> ${
                      customer.phone || "Not provided"
                    }</p>
                    <p><strong>Total Spent:</strong> ₹${(
                      customer.totalSpent || 0
                    ).toFixed(2)}</p>
                    <p><strong>Due Amount:</strong> <span class="due-amount ${
                      (customer.dueAmount || 0) > 0
                        ? "positive"
                        : (customer.dueAmount || 0) < 0
                        ? "negative"
                        : ""
                    }">${(customer.dueAmount || 0) > 0 ? "+" : ""}₹${(
        customer.dueAmount || 0
      ).toFixed(2)}</span></p>
                    <p><strong>Orders:</strong> ${
                      (customer.orderHistory || []).length
                    }</p>
                    <p><strong>Joined:</strong> ${new Date(
                      customer.createdAt
                    ).toLocaleDateString()}</p>
                </div>
                <div class="customer-actions">
                    <button onclick="pos.editCustomer(${
                      customer.id
                    })" class="btn btn--secondary btn--sm">Edit</button>
                    <button onclick="pos.deleteCustomer(${
                      customer.id
                    })" class="btn btn--outline btn--sm">Delete</button>
                    ${
                      (customer.dueAmount || 0) > 0
                        ? `<button onclick="pos.addPaymentToCustomer(${customer.id})" class="btn btn--primary btn--sm">Add Payment</button>`
                        : ""
                    }
                </div>
            `;
      customersList.appendChild(customerCard);
    });
  }

  updateCustomersStats() {
    const totalCustomers = document.getElementById("totalCustomers");
    const totalDueAmount = document.getElementById("totalDueAmount");

    if (totalCustomers) {
      totalCustomers.textContent = this.customers.length;
    }

    if (totalDueAmount) {
      const totalDue = this.customers.reduce(
        (sum, customer) => sum + (customer.dueAmount || 0),
        0
      );
      totalDueAmount.textContent = totalDue.toFixed(2);
    }
  }

  editCustomer(customerId) {
    const customer = this.customers.find((c) => c.id === customerId);
    if (!customer) return;

    const name = prompt("Enter customer name:", customer.name);
    const phone = prompt("Enter phone number:", customer.phone);

    if (name !== null) {
      customer.name = name.trim();
      customer.phone = phone?.trim() || "";
      this.saveData();
      this.renderCustomersList();
      this.populateCustomerSelect();
    }
  }

  deleteCustomer(customerId) {
    if (
      confirm(
        "Are you sure you want to delete this customer? This action cannot be undone."
      )
    ) {
      this.customers = this.customers.filter((c) => c.id !== customerId);
      this.dueExpenses = this.dueExpenses.filter(
        (expense) => expense.customerId !== customerId
      );
      this.saveData();
      this.renderCustomersList();
      this.populateCustomerSelect();
    }
  }

  addPaymentToCustomer(customerId) {
    const customer = this.customers.find((c) => c.id === customerId);
    if (!customer) return;

    const amount = parseFloat(
      prompt(
        `Enter payment amount for ${customer.name}\nDue: ₹${(
          customer.dueAmount || 0
        ).toFixed(2)}`
      )
    );

    if (!amount || amount <= 0) return;

    if (amount > (customer.dueAmount || 0)) {
      if (!confirm(`Payment (₹${amount}) is more than due amount. Continue?`))
        return;
    }

    customer.dueAmount = Math.max(0, (customer.dueAmount || 0) - amount);

    const dueExpense = this.dueExpenses.find(
      (expense) =>
        expense.customerId === customerId && expense.status === "pending"
    );
    if (dueExpense) {
      dueExpense.amount = customer.dueAmount;
      if (customer.dueAmount === 0) {
        dueExpense.status = "paid";
        dueExpense.paidDate = new Date().toISOString();
      }
    }

    this.saveData();
    this.renderCustomersList();
    this.updateCustomersStats();
    alert(`Payment of ₹${amount.toFixed(2)} recorded successfully!`);
  }

  showDueExpensesView() {
    document.getElementById("mainDashboard")?.classList.add("hidden");
    document.getElementById("kitchenView")?.classList.add("hidden");
    document.getElementById("reportsView")?.classList.add("hidden");
    document.getElementById("menuEditorView")?.classList.add("hidden");
    document.getElementById("tableEditorView")?.classList.add("hidden");
    document.getElementById("customersView")?.classList.add("hidden");
    document.getElementById("dueExpensesView")?.classList.remove("hidden");

    this.renderDueExpensesList();
    this.populateExpenseCustomerSelect();
  }

  renderDueExpensesList() {
    const dueExpensesList = document.getElementById("dueExpensesList");
    if (!dueExpensesList) return;

    const pendingExpenses = this.dueExpenses.filter(
      (expense) => expense.status === "pending" && expense.amount > 0
    );

    dueExpensesList.innerHTML = "";

    if (pendingExpenses.length === 0) {
      dueExpensesList.innerHTML =
        '<div class="empty-state">No pending due expenses found.</div>';
    } else {
      pendingExpenses.forEach((expense) => {
        const customer = this.customers.find(
          (c) => c.id === expense.customerId
        );
        const expenseCard = document.createElement("div");
        expenseCard.className = "due-expense-card";
        expenseCard.innerHTML = `
                    <div class="expense-header">
                        <h4>${customer?.name || "Unknown Customer"}</h4>
                        <span class="expense-amount">₹${expense.amount.toFixed(
                          2
                        )}</span>
                    </div>
                    <div class="expense-details">
                        <p><strong>Phone:</strong> ${
                          customer?.phone || "Not provided"
                        }</p>
                        <p><strong>Due Since:</strong> ${new Date(
                          expense.createdAt
                        ).toLocaleDateString()}</p>
                        <p><strong>Description:</strong> ${
                          expense.description
                        }</p>
                        <p><strong>Order ID:</strong> ${
                          expense.orderId || "N/A"
                        }</p>
                    </div>
                    <div class="expense-actions">
                        <button onclick="pos.markExpensePaid(${
                          expense.id
                        })" class="btn btn--primary btn--sm">Mark as Paid</button>
                        <button onclick="pos.addPaymentToExpense(${
                          expense.id
                        })" class="btn btn--secondary btn--sm">Partial Payment</button>
                        <button onclick="pos.deleteExpense(${
                          expense.id
                        })" class="btn btn--outline btn--sm">Remove</button>
                    </div>
                `;
        dueExpensesList.appendChild(expenseCard);
      });
    }

    const totalDue = pendingExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    const summaryEl = document.getElementById("dueExpensesSummary");
    if (summaryEl) {
      summaryEl.innerHTML = `
                <div class="summary-item">
                    <span>Total Pending:</span>
                    <strong>₹${totalDue.toFixed(2)}</strong>
                </div>
                <div class="summary-item">
                    <span>Number of Customers:</span>
                    <strong>${pendingExpenses.length}</strong>
                </div>
            `;
    }
  }

  populateExpenseCustomerSelect() {
    const select = document.getElementById("expenseCustomer");
    if (!select) return;

    select.innerHTML = '<option value="">Select Customer</option>';

    this.customers.forEach((customer) => {
      const option = document.createElement("option");
      option.value = customer.id;
      option.textContent = `${customer.name}${
        customer.phone ? ` (${customer.phone})` : ""
      }`;
      select.appendChild(option);
    });
  }

  addDueExpense() {
    const customerId = document.getElementById("expenseCustomer")?.value;
    const amount = parseFloat(document.getElementById("expenseAmount")?.value);
    const description = document
      .getElementById("expenseDescription")
      ?.value.trim();

    if (!customerId || !amount || amount <= 0) {
      alert("Please select a customer and enter a valid amount.");
      return;
    }

    const customer = this.customers.find((c) => c.id === parseInt(customerId));
    if (!customer) {
      alert("Selected customer not found.");
      return;
    }

    const expense = {
      id: Date.now(),
      customerId: parseInt(customerId),
      amount: amount,
      description: description || "Manual expense entry",
      status: "pending",
      createdAt: new Date().toISOString(),
      orderId: null,
    };

    this.dueExpenses.push(expense);

    customer.dueAmount = (customer.dueAmount || 0) + amount;

    this.saveData();
    this.renderDueExpensesList();

    document.getElementById("expenseCustomer").value = "";
    document.getElementById("expenseAmount").value = "";
    document.getElementById("expenseDescription").value = "";

    alert("Due expense added successfully!");
  }

  markExpensePaid(expenseId) {
    const expense = this.dueExpenses.find((e) => e.id === expenseId);
    if (!expense) return;

    const paidAmount = expense.amount;
    expense.status = "paid";
    expense.paidDate = new Date().toISOString();
    expense.amount = 0;

    const customer = this.customers.find((c) => c.id === expense.customerId);
    if (customer) {
      customer.dueAmount = Math.max(0, (customer.dueAmount || 0) - paidAmount);
    }

    this.saveData();
    this.renderDueExpensesList();
    alert("Expense marked as paid successfully!");
  }

  addPaymentToExpense(expenseId) {
    const expense = this.dueExpenses.find((e) => e.id === expenseId);
    if (!expense) return;

    const amount = parseFloat(
      prompt(`Enter payment amount\nDue: ₹${expense.amount.toFixed(2)}`)
    );

    if (!amount || amount <= 0) return;

    const newAmount = Math.max(0, expense.amount - amount);
    const paidAmount = expense.amount - newAmount;
    expense.amount = newAmount;

    if (newAmount === 0) {
      expense.status = "paid";
      expense.paidDate = new Date().toISOString();
    }

    const customer = this.customers.find((c) => c.id === expense.customerId);
    if (customer) {
      customer.dueAmount = Math.max(0, (customer.dueAmount || 0) - paidAmount);
    }

    this.saveData();
    this.renderDueExpensesList();
    alert(`Payment of ₹${paidAmount.toFixed(2)} recorded successfully!`);
  }

  deleteExpense(expenseId) {
    if (confirm("Are you sure you want to remove this expense?")) {
      const expense = this.dueExpenses.find((e) => e.id === expenseId);
      if (expense) {
        const customer = this.customers.find(
          (c) => c.id === expense.customerId
        );
        if (customer) {
          customer.dueAmount = Math.max(
            0,
            (customer.dueAmount || 0) - expense.amount
          );
        }
      }

      this.dueExpenses = this.dueExpenses.filter((e) => e.id !== expenseId);
      this.saveData();
      this.renderDueExpensesList();
    }
  }

  showImportExportModal() {
    const modal = document.getElementById("importExportModal");
    if (modal) {
      modal.classList.remove("hidden");
    }
  }

  exportJsonData() {
    const data = {
      tables: this.tables,
      orders: this.orders,
      orderHistory: this.orderHistory,
      menu: this.menu,
      customers: this.customers,
      dueExpenses: this.dueExpenses,
      exportDate: new Date().toISOString(),
      version: "2.0",
    };

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `restaurant-pos-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    this.closeModal("importExportModal");
    alert("Data exported successfully!");
  }

  exportCsvData() {
    const customerHeaders = [
      "ID",
      "Name",
      "Phone",
      "Type",
      "Total Spent",
      "Due Amount",
      "Orders Count",
      "Created Date",
    ];
    const customerRows = this.customers.map((customer) => [
      customer.id,
      customer.name,
      customer.phone || "",
      customer.isGroup ? "Group" : "Individual",
      (customer.totalSpent || 0).toFixed(2),
      (customer.dueAmount || 0).toFixed(2),
      customer.orderHistory?.length || 0,
      new Date(customer.createdAt).toLocaleDateString(),
    ]);

    this.downloadCSV(
      [customerHeaders, ...customerRows],
      `customers-${new Date().toISOString().split("T")[0]}.csv`
    );

    const expenseHeaders = [
      "ID",
      "Customer Name",
      "Amount",
      "Description",
      "Status",
      "Created Date",
      "Paid Date",
    ];
    const expenseRows = this.dueExpenses.map((expense) => {
      const customer = this.customers.find((c) => c.id === expense.customerId);
      return [
        expense.id,
        customer?.name || "Unknown",
        expense.amount.toFixed(2),
        expense.description,
        expense.status,
        new Date(expense.createdAt).toLocaleDateString(),
        expense.paidDate ? new Date(expense.paidDate).toLocaleDateString() : "",
      ];
    });

    this.downloadCSV(
      [expenseHeaders, ...expenseRows],
      `due-expenses-${new Date().toISOString().split("T")[0]}.csv`
    );

    this.closeModal("importExportModal");
    alert("CSV files exported successfully!");
  }

  importJsonData() {
    const fileInput = document.getElementById("importFile");
    if (!fileInput || !fileInput.files.length) {
      alert("Please select a file to import.");
      return;
    }

    const file = fileInput.files[0];
    if (!file.name.toLowerCase().endsWith(".json")) {
      alert("Please select a valid JSON file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        this.importData(data);
      } catch (error) {
        alert("Invalid JSON file format.");
      }
    };
    reader.readAsText(file);
  }

  importData(data) {
    if (
      confirm("This will merge the imported data with existing data. Continue?")
    ) {
      const mergeArrays = (
        localArray,
        importedArray,
        idField = "id",
        cumulativeFields = []
      ) => {
        const localMap = new Map(
          localArray.map((item) => [item[idField], item])
        );
        let updated = 0,
          added = 0;

        importedArray.forEach((imp) => {
          if (localMap.has(imp[idField])) {
            const local = localMap.get(imp[idField]);
            Object.keys(imp).forEach((key) => {
              if (
                cumulativeFields.includes(key) &&
                typeof imp[key] === "number"
              ) {
                local[key] = Math.max(local[key] || 0, imp[key]);
              } else if (key === "orderHistory" && Array.isArray(imp[key])) {
                const existingTimestamps = new Set(
                  local.orderHistory.map((o) => o.timestamp)
                );
                imp[key].forEach((newOrder) => {
                  if (!existingTimestamps.has(newOrder.timestamp)) {
                    local.orderHistory.push(newOrder);
                  }
                });
              } else {
                local[key] = imp[key];
              }
            });
            updated++;
          } else {
            localArray.push(imp);
            added++;
          }
        });

        return { updated, added, kept: localArray.length - (updated + added) };
      };

      const customerMerge = mergeArrays(
        this.customers,
        data.customers || [],
        "id",
        ["totalSpent", "dueAmount"]
      );
      const dueExpensesMerge = mergeArrays(
        this.dueExpenses,
        data.dueExpenses || [],
        "id",
        ["amount"]
      );
      const menuMerge = mergeArrays(this.menu, data.menu || [], "id");
      const tablesMerge = mergeArrays(this.tables, data.tables || [], "id");
      const ordersMerge = mergeArrays(this.orders, data.orders || [], "id");
      const orderHistoryMerge = mergeArrays(
        this.orderHistory,
        data.orderHistory || [],
        "timestamp"
      );

      this.saveData();
      this.renderTables();
      this.updateReports();
      this.populateCustomerSelect();
      this.populateExpenseCustomerSelect();

      alert("Data merged successfully! Check console for details.");
    }
  }

  handleFileImport(event) {
    // File selection handled by importJsonData method
  }

  showKitchenView() {
    document.getElementById("mainDashboard")?.classList.add("hidden");
    document.getElementById("reportsView")?.classList.add("hidden");
    document.getElementById("menuEditorView")?.classList.add("hidden");
    document.getElementById("tableEditorView")?.classList.add("hidden");
    document.getElementById("customersView")?.classList.add("hidden");
    document.getElementById("dueExpensesView")?.classList.add("hidden");
    document.getElementById("kitchenView")?.classList.remove("hidden");
    this.renderKitchenOrders();
  }

  showReportsView() {
    document.getElementById("mainDashboard")?.classList.add("hidden");
    document.getElementById("kitchenView")?.classList.add("hidden");
    document.getElementById("menuEditorView")?.classList.add("hidden");
    document.getElementById("tableEditorView")?.classList.add("hidden");
    document.getElementById("customersView")?.classList.add("hidden");
    document.getElementById("dueExpensesView")?.classList.add("hidden");
    document.getElementById("reportsView")?.classList.remove("hidden");
    this.updateReports();
  }

  showDashboard() {
    document.getElementById("kitchenView")?.classList.add("hidden");
    document.getElementById("reportsView")?.classList.add("hidden");
    document.getElementById("menuEditorView")?.classList.add("hidden");
    document.getElementById("tableEditorView")?.classList.add("hidden");
    document.getElementById("customersView")?.classList.add("hidden");
    document.getElementById("dueExpensesView")?.classList.add("hidden");
    document.getElementById("mainDashboard")?.classList.remove("hidden");
    this.renderTables();
  }

  showMenuEditor() {
    document.getElementById("mainDashboard")?.classList.add("hidden");
    document.getElementById("kitchenView")?.classList.add("hidden");
    document.getElementById("reportsView")?.classList.add("hidden");
    document.getElementById("tableEditorView")?.classList.add("hidden");
    document.getElementById("customersView")?.classList.add("hidden");
    document.getElementById("dueExpensesView")?.classList.add("hidden");
    document.getElementById("menuEditorView")?.classList.remove("hidden");
    this.renderMenuEditor();
  }

  showTableEditor() {
    document.getElementById("mainDashboard")?.classList.add("hidden");
    document.getElementById("kitchenView")?.classList.add("hidden");
    document.getElementById("reportsView")?.classList.add("hidden");
    document.getElementById("menuEditorView")?.classList.add("hidden");
    document.getElementById("customersView")?.classList.add("hidden");
    document.getElementById("dueExpensesView")?.classList.add("hidden");
    document.getElementById("tableEditorView")?.classList.remove("hidden");
    this.renderTableEditor();
  }

  renderKitchenOrders() {
    const kitchenOrders = document.getElementById("kitchenOrders");
    if (!kitchenOrders) return;

    const activeOrders = [];

    this.tables.forEach((table) => {
      if (table.status === "occupied") {
        if (table.isGroup && table.customers) {
          table.customers.forEach((customer, index) => {
            if (customer.orders && customer.orders.length > 0) {
              activeOrders.push({
                tableId: table.id,
                tableName: table.name,
                customerIndex: index + 1,
                orders: customer.orders,
                timestamp: table.occupiedSince,
              });
            }
          });
        } else if (table.orders && table.orders.length > 0) {
          activeOrders.push({
            tableId: table.id,
            tableName: table.name,
            customerIndex: null,
            orders: table.orders,
            timestamp: table.occupiedSince,
          });
        }
      }
    });

    if (activeOrders.length === 0) {
      kitchenOrders.innerHTML =
        '<div class="empty-state">No active orders in the kitchen.</div>';
      return;
    }

    kitchenOrders.innerHTML = "";

    activeOrders.forEach((order) => {
      const orderCard = document.createElement("div");
      orderCard.className = "kitchen-order";

      const timeElapsed = this.formatDuration(
        new Date() - new Date(order.timestamp)
      );
      let header = order.tableName;
      if (order.customerIndex) {
        header += ` - Customer ${order.customerIndex}`;
      }

      orderCard.innerHTML = `
                <div class="kitchen-order__header">
                    <h4>${header}</h4>
                    <span class="kitchen-order__time">${timeElapsed}</span>
                </div>
                <div class="kitchen-order__items">
                    ${order.orders
                      .map(
                        (item) => `
                        <div class="kitchen-order__item">
                            <span class="item-quantity">${item.quantity}x</span>
                            <span class="item-name">${item.name}</span>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            `;

      kitchenOrders.appendChild(orderCard);
    });
  }

  updateReports() {
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const todayOrders = this.orderHistory.filter((order) => {
      const orderDate = new Date(order.timestamp);
      return orderDate >= todayStart;
    });

    const todaysSales = todayOrders.reduce(
      (total, order) => total + order.total,
      0
    );

    // **FIXED: This now correctly counts customers in group orders**
    const ordersToday = todayOrders.reduce((total, order) => {
      return total + (order.customerCount || 1);
    }, 0);
    
    const averageOrderValue = ordersToday > 0 ? todaysSales / ordersToday : 0;

    const todaysSalesEl = document.getElementById("todaysSales");
    const ordersTodayEl = document.getElementById("ordersToday");
    const averageOrderValueEl = document.getElementById("averageOrderValue");

    if (todaysSalesEl) todaysSalesEl.textContent = todaysSales.toFixed(2);
    if (ordersTodayEl) ordersTodayEl.textContent = ordersToday.toString();
    if (averageOrderValueEl)
      averageOrderValueEl.textContent = averageOrderValue.toFixed(2);

    this.updatePopularItems(todayOrders);
  }

  updatePopularItems(orders) {
    const popularItemsList = document.getElementById("popularItemsList");
    if (!popularItemsList) return;

    const itemCounts = {};

    orders.forEach((order) => {
      if (order.orders) {
        order.orders.forEach((item) => {
          itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
        });
      }
    });

    const sortedItems = Object.entries(itemCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    if (sortedItems.length === 0) {
      popularItemsList.innerHTML =
        '<div class="empty-state">No items sold today.</div>';
    } else {
      popularItemsList.innerHTML = "";
      sortedItems.forEach(([name, count]) => {
        const itemEl = document.createElement("div");
        itemEl.className = "popular-item";
        itemEl.innerHTML = `
                    <span class="popular-item__name">${name}</span>
                    <span class="popular-item__count">${count} sold</span>
                `;
        popularItemsList.appendChild(itemEl);
      });
    }
  }

  showExportModal() {
    const today = new Date().toISOString().split("T")[0];
    const exportFromDate = document.getElementById("exportFromDate");
    const exportToDate = document.getElementById("exportToDate");

    if (exportFromDate) exportFromDate.value = today;
    if (exportToDate) exportToDate.value = today;

    const exportModal = document.getElementById("exportModal");
    if (exportModal) {
      exportModal.classList.remove("hidden");
    }
  }

  exportData() {
    const checkboxes = document.querySelectorAll(
      '#exportModal input[type="checkbox"]:checked'
    );
    const exportFromDate = document.getElementById("exportFromDate");
    const exportToDate = document.getElementById("exportToDate");

    const fromDate = exportFromDate
      ? new Date(exportFromDate.value)
      : new Date();
    const toDate = exportToDate ? new Date(exportToDate.value) : new Date();

    if (checkboxes.length === 0) {
      alert("Please select at least one data type to export.");
      return;
    }

    checkboxes.forEach((checkbox) => {
      const type = checkbox.value;
      let data, filename;

      if (type === "sales") {
        data = this.generateSalesReport(fromDate, toDate);
        filename = `sales-report-${fromDate.toISOString().split("T")[0]}-to-${
          toDate.toISOString().split("T")[0]
        }.csv`;
      } else if (type === "orders") {
        data = this.generateOrderReport(fromDate, toDate);
        filename = `order-history-${fromDate.toISOString().split("T")[0]}-to-${
          toDate.toISOString().split("T")[0]
        }.csv`;
      } else if (type === "menu") {
        data = this.generateMenuReport();
        filename = `menu-data-${new Date().toISOString().split("T")[0]}.csv`;
      }

      if (data && data.length > 0) {
        this.downloadCSV(data, filename);
      }
    });

    this.closeModal("exportModal");
  }

  generateSalesReport(fromDate, toDate) {
    const filteredOrders = this.orderHistory.filter((order) => {
      const orderDate = new Date(order.timestamp);
      return orderDate >= fromDate && orderDate <= toDate;
    });

    if (filteredOrders.length === 0) {
      return ["No data available for the selected date range"];
    }

    const headers = [
      "Date",
      "Time",
      "Table",
      "Total",
      "Paid",
      "Change",
      "Payment Method",
      "Customer Count",
    ];
    const rows = filteredOrders.map((order) => [
      new Date(order.timestamp).toLocaleDateString(),
      new Date(order.timestamp).toLocaleTimeString(),
      order.tableId,
      order.total.toFixed(2),
      order.paid.toFixed(2),
      order.change.toFixed(2),
      order.paymentMethod,
      order.customerCount,
    ]);

    return [headers, ...rows];
  }

  generateOrderReport(fromDate, toDate) {
    const filteredOrders = this.orderHistory.filter((order) => {
      const orderDate = new Date(order.timestamp);
      return orderDate >= fromDate && orderDate <= toDate;
    });

    if (filteredOrders.length === 0) {
      return ["No data available for the selected date range"];
    }

    const headers = [
      "Date",
      "Time",
      "Table",
      "Item",
      "Quantity",
      "Unit Price",
      "Total Price",
    ];
    const rows = [];

    filteredOrders.forEach((order) => {
      if (order.orders) {
        order.orders.forEach((item) => {
          rows.push([
            new Date(order.timestamp).toLocaleDateString(),
            new Date(order.timestamp).toLocaleTimeString(),
            order.tableId,
            item.name,
            item.quantity,
            item.price.toFixed(2),
            (item.quantity * item.price).toFixed(2),
          ]);
        });
      }
    });

    return [headers, ...rows];
  }

  generateMenuReport() {
    const headers = [
      "ID",
      "Name",
      "Price",
      "Category",
      "Description",
      "Available",
    ];
    const rows = this.menu.map((item) => [
      item.id,
      item.name,
      item.price.toFixed(2),
      item.category,
      item.description,
      item.available ? "Yes" : "No",
    ]);

    return [headers, ...rows];
  }

  downloadCSV(data, filename) {
    const csv = data
      .map((row) =>
        row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  formatDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else {
      return `${minutes}m`;
    }
  }

  renderMenuEditor() {
    const menuEditorList = document.getElementById("menuEditorList");
    if (!menuEditorList) return;

    menuEditorList.innerHTML = "";

    this.menu.forEach((item) => {
      const itemEl = document.createElement("div");
      itemEl.className = "menu-editor-item";
      itemEl.innerHTML = `
                <div class="menu-editor-item__info">
                    <input type="text" value="${item.name}" data-id="${
        item.id
      }" data-field="name" class="form-control">
                    <input type="number" value="${
                      item.price
                    }" step="0.01" data-id="${
        item.id
      }" data-field="price" class="form-control">
                    <select data-id="${
                      item.id
                    }" data-field="category" class="form-control">
                        <option value="Appetizers" ${
                          item.category === "Appetizers" ? "selected" : ""
                        }>Appetizers</option>
                        <option value="Main Course" ${
                          item.category === "Main Course" ? "selected" : ""
                        }>Main Course</option>
                        <option value="Beverages" ${
                          item.category === "Beverages" ? "selected" : ""
                        }>Beverages</option>
                        <option value="Desserts" ${
                          item.category === "Desserts" ? "selected" : ""
                        }>Desserts</option>
                    </select>
                    <textarea data-id="${
                      item.id
                    }" data-field="description" class="form-control">${
        item.description
      }</textarea>
                    <select data-id="${
                      item.id
                    }" data-field="available" class="form-control">
                        <option value="true" ${
                          item.available ? "selected" : ""
                        }>Available</option>
                        <option value="false" ${
                          !item.available ? "selected" : ""
                        }>Unavailable</option>
                    </select>
                </div>
                <div class="menu-editor-item__actions">
                    <button onclick="pos.updateMenuItem(${
                      item.id
                    })" class="btn btn--primary btn--sm">Update</button>
                    <button onclick="pos.deleteMenuItem(${
                      item.id
                    })" class="btn btn--outline btn--sm">Delete</button>
                </div>
            `;
      menuEditorList.appendChild(itemEl);
    });
  }

  addMenuItem() {
    const newId = Math.max(...this.menu.map((i) => i.id), 0) + 1;
    const newItem = {
      id: newId,
      name: "New Item",
      price: 0,
      category: "Uncategorized",
      description: "",
      available: true,
    };

    this.menu.push(newItem);
    this.saveData();
    this.renderMenuEditor();
  }

  updateMenuItem(itemId) {
    const item = this.menu.find((i) => i.id === itemId);
    if (!item) return;

    const fields = document.querySelectorAll(`[data-id="${itemId}"]`);
    fields.forEach((field) => {
      const key = field.dataset.field;
      if (key === "available") {
        item[key] = field.value === "true";
      } else if (key === "price") {
        item[key] = parseFloat(field.value) || 0;
      } else {
        item[key] = field.value;
      }
    });

    this.saveData();
    alert("Menu item updated!");
    this.renderMenuEditor();
  }

  deleteMenuItem(itemId) {
    if (confirm("Are you sure you want to delete this menu item?")) {
      this.menu = this.menu.filter((i) => i.id !== itemId);
      this.saveData();
      this.renderMenuEditor();
    }
  }

  renderTableEditor() {
    const tableEditorList = document.getElementById("tableEditorList");
    if (!tableEditorList) return;

    tableEditorList.innerHTML = "";

    this.tables.forEach((table) => {
      const tableEl = document.createElement("div");
      tableEl.className = "table-editor-item";
      tableEl.innerHTML = `
                <div class="table-editor-item__info">
                    <input type="text" value="${table.name}" data-id="${table.id}" data-field="name" class="form-control">
                    <input type="number" value="${table.capacity}" min="1" data-id="${table.id}" data-field="capacity" class="form-control">
                </div>
                <div class="table-editor-item__actions">
                    <button onclick="pos.updateTable(${table.id})" class="btn btn--primary btn--sm">Update</button>
                    <button onclick="pos.deleteTable(${table.id})" class="btn btn--outline btn--sm">Delete</button>
                </div>
            `;
      tableEditorList.appendChild(tableEl);
    });
  }

  addTable() {
    const newId = Math.max(...this.tables.map((t) => t.id), 0) + 1;
    const newTable = {
      id: newId,
      name: `Table ${newId}`,
      capacity: 4,
      status: "available",
      customers: [],
      orders: [],
      occupiedSince: null,
      isGroup: false,
      customerCount: 1,
      currentCustomerId: null,
    };

    this.tables.push(newTable);
    this.saveData();
    this.renderTableEditor();
    this.renderTables();
  }

  updateTable(tableId) {
    const table = this.tables.find((t) => t.id === tableId);
    if (!table) return;

    const fields = document.querySelectorAll(`[data-id="${tableId}"]`);
    fields.forEach((field) => {
      const key = field.dataset.field;
      if (key === "capacity") {
        table[key] = parseInt(field.value) || 4;
      } else {
        table[key] = field.value;
      }
    });

    this.saveData();
    alert("Table updated!");
    this.renderTableEditor();
    this.renderTables();
  }

  deleteTable(tableId) {
    if (confirm("Are you sure you want to delete this table?")) {
      this.tables = this.tables.filter((t) => t.id !== tableId);
      this.saveData();
      this.renderTableEditor();
      this.renderTables();
    }
  }
}

// Initialize the POS system
let pos;

document.addEventListener("DOMContentLoaded", () => {
  pos = new RestaurantPOS();

  // Handle split bill radio changes
  document.querySelectorAll('input[name="splitType"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      if (pos) pos.updateSplitOptions();
    });
  });
});
