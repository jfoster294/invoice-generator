const businessNameInput = document.getElementById("businessNameInput");
const businessEmailInput = document.getElementById("businessEmailInput");
const clientNameInput = document.getElementById("clientNameInput");
const clientEmailInput = document.getElementById("clientEmailInput");
const invoiceNumberInput = document.getElementById("invoiceNumberInput");
const invoiceDateInput = document.getElementById("invoiceDateInput");
const dueDateInput = document.getElementById("dueDateInput");
const taxRateInput = document.getElementById("taxRateInput");
const discountInput = document.getElementById("discountInput");
const notesInput = document.getElementById("notesInput");

const itemDescriptionInput = document.getElementById("itemDescriptionInput");
const itemQuantityInput = document.getElementById("itemQuantityInput");
const itemPriceInput = document.getElementById("itemPriceInput");
const addItemButton = document.getElementById("addItemButton");

const saveInvoiceButton = document.getElementById("saveInvoiceButton");
const printInvoiceButton = document.getElementById("printInvoiceButton");
const clearInvoiceButton = document.getElementById("clearInvoiceButton");
const saveMessage = document.getElementById("saveMessage");

const itemsTableBody = document.getElementById("itemsTableBody");

const subtotalDisplay = document.getElementById("subtotalDisplay");
const taxDisplay = document.getElementById("taxDisplay");
const discountDisplay = document.getElementById("discountDisplay");
const totalDisplay = document.getElementById("totalDisplay");

const previewBusinessName = document.getElementById("previewBusinessName");
const previewBusinessEmail = document.getElementById("previewBusinessEmail");
const previewClientName = document.getElementById("previewClientName");
const previewClientEmail = document.getElementById("previewClientEmail");
const previewInvoiceNumber = document.getElementById("previewInvoiceNumber");
const previewInvoiceDate = document.getElementById("previewInvoiceDate");
const previewDueDate = document.getElementById("previewDueDate");
const previewNotes = document.getElementById("previewNotes");
const previewSubtotal = document.getElementById("previewSubtotal");
const previewTax = document.getElementById("previewTax");
const previewDiscount = document.getElementById("previewDiscount");
const previewTotal = document.getElementById("previewTotal");

let invoiceItems = [];

const invoiceInputs = [
  businessNameInput,
  businessEmailInput,
  clientNameInput,
  clientEmailInput,
  invoiceNumberInput,
  invoiceDateInput,
  dueDateInput,
  taxRateInput,
  discountInput,
  notesInput
];

invoiceInputs.forEach(function (input) {
  input.addEventListener("input", function () {
    updatePreview();
  });

  input.addEventListener("change", function () {
    updatePreview();
  });
});

addItemButton.addEventListener("click", function () {
  addLineItem();
});

saveInvoiceButton.addEventListener("click", function () {
  saveInvoice();
});

printInvoiceButton.addEventListener("click", function () {
  window.print();
});

clearInvoiceButton.addEventListener("click", function () {
  const confirmClear = confirm("Clear this invoice?");

  if (confirmClear) {
    clearInvoice();
  }
});

function addLineItem() {
  const description = itemDescriptionInput.value.trim();
  const quantity = Number(itemQuantityInput.value);
  const price = Number(itemPriceInput.value);

  if (!description || quantity <= 0 || price < 0) {
    saveMessage.textContent = "Please enter a description, quantity, and price.";
    return;
  }

  invoiceItems.push({
    id: Date.now().toString(),
    description: description,
    quantity: quantity,
    price: price
  });

  itemDescriptionInput.value = "";
  itemQuantityInput.value = "1";
  itemPriceInput.value = "";

  saveMessage.textContent = "Line item added.";
  updatePreview();
}

function removeLineItem(id) {
  invoiceItems = invoiceItems.filter(function (item) {
    return item.id !== id;
  });

  updatePreview();
}

function calculateTotals() {
  const subtotal = invoiceItems.reduce(function (sum, item) {
    return sum + item.quantity * item.price;
  }, 0);

  const taxRate = Number(taxRateInput.value) || 0;
  const discount = Number(discountInput.value) || 0;
  const tax = subtotal * (taxRate / 100);
  const total = Math.max(subtotal + tax - discount, 0);

  return {
    subtotal: subtotal,
    tax: tax,
    discount: discount,
    total: total
  };
}

function updatePreview() {
  previewBusinessName.textContent = businessNameInput.value.trim() || "Your Business";
  previewBusinessEmail.textContent = businessEmailInput.value.trim() || "business@email.com";
  previewClientName.textContent = clientNameInput.value.trim() || "Client Name";
  previewClientEmail.textContent = clientEmailInput.value.trim() || "client@email.com";
  previewInvoiceNumber.textContent = invoiceNumberInput.value.trim() || "INV-001";
  previewInvoiceDate.textContent = formatDate(invoiceDateInput.value) || "Not set";
  previewDueDate.textContent = formatDate(dueDateInput.value) || "Not set";
  previewNotes.textContent = notesInput.value.trim() || "No notes added.";

  renderItems();

  const totals = calculateTotals();

  subtotalDisplay.textContent = formatCurrency(totals.subtotal);
  taxDisplay.textContent = formatCurrency(totals.tax);
  discountDisplay.textContent = formatCurrency(totals.discount);
  totalDisplay.textContent = formatCurrency(totals.total);

  previewSubtotal.textContent = formatCurrency(totals.subtotal);
  previewTax.textContent = formatCurrency(totals.tax);
  previewDiscount.textContent = formatCurrency(totals.discount);
  previewTotal.textContent = formatCurrency(totals.total);
}

function renderItems() {
  itemsTableBody.innerHTML = "";

  if (invoiceItems.length === 0) {
    const emptyRow = document.createElement("tr");

    emptyRow.innerHTML = `
      <td>No items added</td>
      <td>0</td>
      <td>$0.00</td>
      <td>$0.00</td>
      <td class="no-print">—</td>
    `;

    itemsTableBody.appendChild(emptyRow);
    return;
  }

  invoiceItems.forEach(function (item) {
    const row = document.createElement("tr");
    const itemTotal = item.quantity * item.price;

    row.innerHTML = `
      <td>${escapeHTML(item.description)}</td>
      <td>${item.quantity}</td>
      <td>${formatCurrency(item.price)}</td>
      <td>${formatCurrency(itemTotal)}</td>
      <td class="no-print">
        <button class="remove-button" type="button" data-id="${item.id}">Remove</button>
      </td>
    `;

    itemsTableBody.appendChild(row);
  });

  document.querySelectorAll(".remove-button").forEach(function (button) {
    button.addEventListener("click", function () {
      removeLineItem(button.dataset.id);
    });
  });
}

function saveInvoice() {
  const invoiceData = {
    businessName: businessNameInput.value,
    businessEmail: businessEmailInput.value,
    clientName: clientNameInput.value,
    clientEmail: clientEmailInput.value,
    invoiceNumber: invoiceNumberInput.value,
    invoiceDate: invoiceDateInput.value,
    dueDate: dueDateInput.value,
    taxRate: taxRateInput.value,
    discount: discountInput.value,
    notes: notesInput.value,
    items: invoiceItems
  };

  localStorage.setItem("savedInvoiceGeneratorData", JSON.stringify(invoiceData));
  saveMessage.textContent = "Invoice saved locally.";
}

function loadInvoice() {
  const savedInvoice = JSON.parse(localStorage.getItem("savedInvoiceGeneratorData"));

  if (!savedInvoice) {
    setDefaultDates();
    updatePreview();
    return;
  }

  businessNameInput.value = savedInvoice.businessName || "";
  businessEmailInput.value = savedInvoice.businessEmail || "";
  clientNameInput.value = savedInvoice.clientName || "";
  clientEmailInput.value = savedInvoice.clientEmail || "";
  invoiceNumberInput.value = savedInvoice.invoiceNumber || "";
  invoiceDateInput.value = savedInvoice.invoiceDate || "";
  dueDateInput.value = savedInvoice.dueDate || "";
  taxRateInput.value = savedInvoice.taxRate || "0";
  discountInput.value = savedInvoice.discount || "0";
  notesInput.value = savedInvoice.notes || "";
  invoiceItems = savedInvoice.items || [];

  saveMessage.textContent = "Saved invoice loaded.";
  updatePreview();
}

function clearInvoice() {
  localStorage.removeItem("savedInvoiceGeneratorData");

  businessNameInput.value = "";
  businessEmailInput.value = "";
  clientNameInput.value = "";
  clientEmailInput.value = "";
  invoiceNumberInput.value = "";
  taxRateInput.value = "0";
  discountInput.value = "0";
  notesInput.value = "";
  invoiceItems = [];

  setDefaultDates();

  saveMessage.textContent = "Invoice cleared.";
  updatePreview();
}

function setDefaultDates() {
  const today = new Date();
  const dueDate = new Date();

  dueDate.setDate(today.getDate() + 14);

  invoiceDateInput.value = today.toISOString().split("T")[0];
  dueDateInput.value = dueDate.toISOString().split("T")[0];

  if (!invoiceNumberInput.value) {
    invoiceNumberInput.value = "INV-001";
  }
}

function formatCurrency(amount) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  });
}

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function escapeHTML(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

loadInvoice();
