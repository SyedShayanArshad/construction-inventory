import { getCustomerById, getProductById } from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

export const printInvoice = (selectedSale) => {
  // Open a new window for printing
  const printWindow = window.open('', '_blank');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice #${selectedSale.id}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Roboto', sans-serif;
          line-height: 1.5;
          color: #1e293b;
          background-color: #f1f5f9;
          margin: 0;
          padding: 15px;
          min-height: 100vh;
        }

        .invoice-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 30px;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
          page-break-inside: avoid;
        }

        .invoice-container:hover {
          transform: translateY(-5px);
        }

        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 3px solid #2563eb;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #3b82f6, #1e3a8a);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 20px;
          font-weight: 700;
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        }

        .company-name {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
        }

        .invoice-title {
          color: #64748b;
          font-size: 14px;
          margin-top: 5px;
        }

        .header-info {
          display: flex;
          gap: 30px;
          align-items: flex-start;
        }

        .from-section {
          background: linear-gradient(to bottom, #f8fafc, #e2e8f0);
          border-radius: 8px;
          padding: 15px;
          min-width: 200px;
        }

        .invoice-label {
          color: #64748b;
          font-size: 12px;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .invoice-value {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
        }

        .status-badge {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-top: 6px;
        }

        .status-completed {
          background-color: #d1fae5;
          color: #065f46;
        }

        .status-partial {
          background-color: #fef3c7;
          color: #92400e;
        }

        .status-unpaid {
          background-color: #fee2e2;
          color: #b91c1c;
        }

        .address-section {
          display: flex;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 30px;
        }

        .address-content {
          color: #64748b;
          font-size: 13px;
          max-width: 280px;
        }

        .address-title {
          font-size: 15px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 8px;
          padding-bottom: 6px;
          border-bottom: 2px solid #e2e8f0;
        }

        .bill-to-info {
          background: linear-gradient(to bottom, #f8fafc, #e2e8f0);
          border-radius: 8px;
          padding: 15px;
          min-width: 200px;
          text-align: right;
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 25px;
        }

        .items-table th {
          background: linear-gradient(to bottom, #f1f5f9, #e2e8f0);
          color: #334155;
          font-weight: 600;
          text-align: left;
          padding: 12px;
          font-size: 13px;
          border-bottom: 2px solid #e2e8f0;
        }

        .items-table td {
          padding: 12px;
          border-bottom: 1px solid #e2e8f0;
          color: #475569;
          font-size: 13px;
        }

        .items-table .amount-column {
          text-align: right;
        }

        .totals-table {
          width: 350px;
          margin-left: auto;
          border-collapse: collapse;
        }

        .totals-table td {
          padding: 8px 12px;
        }

        .totals-table .label {
          color: #64748b;
          font-size: 14px;
        }

        .totals-table .value {
          text-align: right;
          font-weight: 600;
          font-size: 14px;
        }

        .totals-table .grand-total {
          font-weight: 700;
          color: #1e293b;
          font-size: 16px;
          border-top: 3px solid #e2e8f0;
          padding-top: 12px;
        }

        .amount-paid {
          color: #059669;
        }

        .amount-due {
          color: #dc2626;
        }

        .invoice-notes {
          font-size: 13px;
          color: #64748b;
          padding: 15px;
          background-color: #f8fafc;
          border-radius: 8px;
          margin-top: 25px;
          border-left: 4px solid #3b82f6;
        }

        .payment-history-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        .payment-history-table th {
          background: linear-gradient(to bottom, #f1f5f9, #e2e8f0);
          padding: 10px;
          text-align: left;
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
          border-bottom: 2px solid #e2e8f0;
        }

        .payment-history-table td {
          padding: 10px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 13px;
          color: #475569;
        }

        .payment-history-table .amount-cell {
          color: #059669;
          font-weight: 600;
        }

        .payment-history-table .right-align {
          text-align: right;
        }

        .no-payment-history {
          background-color: #fefce8;
          border: 1px solid #fef08a;
          color: #854d0e;
          padding: 12px;
          border-radius: 6px;
          font-size: 13px;
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #334155;
          margin: 25px 0 12px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e2e8f0;
        }

        .print-button {
          display: block;
          margin: 30px auto 0;
          padding: 10px 25px;
          background: linear-gradient(90deg, #3b82f6, #1e3a8a);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .print-button:hover {
          background: linear-gradient(90deg, #2563eb, #1e3a8a);
          box-shadow: 0 6px 12px rgba(59, 130, 246, 0.4);
          transform: translateY(-2px);
        }

        .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          font-size: 12px;
          color: #94a3b8;
          page-break-before: avoid;
        }

        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 100px;
          color: rgba(226, 232, 240, 0.3);
          pointer-events: none;
          z-index: -1;
          font-weight: 700;
          letter-spacing: 8px;
          text-transform: uppercase;
        }

        @media screen and (max-width: 768px) {
          .invoice-container {
            padding: 20px;
          }

          .invoice-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .header-info {
            flex-direction: column;
            gap: 15px;
            width: 100%;
          }

          .from-section, .bill-to-info {
            text-align: center;
            width: 100%;
          }

          .address-section {
            flex-direction: column;
            gap: 15px;
          }

          .address-content, .bill-to-info {
            max-width: 100%;
          }

          .totals-table {
            width: 100%;
          }
        }

        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }

          body {
            background-color: white;
            padding: 0;
            margin: 0;
            font-size: 11pt;
          }

          .invoice-container {
            box-shadow: none;
            padding: 20mm;
            margin: 0;
            transform: none;
            max-width: 100%;
            page-break-inside: avoid;
          }

          .print-button {
            display: none;
          }

          .watermark {
            display: ${selectedSale.status === 'completed' ? 'none' : 'block'};
          }

          .footer, .invoice-notes, .items-table, .payment-history-table, .totals-table {
            page-break-inside: avoid;
          }

          .items-table th, .items-table td {
            padding: 8px;
          }

          .payment-history-table th, .payment-history-table td {
            padding: 6px;
          }

          .invoice-header, .address-section, .section-title {
            margin-bottom: 15px;
          }
        }
      </style>
    </head>
    <body>
      ${selectedSale.status !== 'completed' ? '<div class="watermark">UNPAID</div>' : ''}

      <div class="invoice-container">
        <!-- Header -->
        <div class="invoice-header">
          <div class="logo-section">
            <div class="logo">CM</div>
            <div>
              <h1 class="company-name">Javaid Building Material Shop</h1>
              <p class="invoice-title">Tax Invoice</p>
            </div>
          </div>
          <div class="header-info">
            <div class="from-section">
              <div class="invoice-value">
                <div>Manzoor Construction Material</div>
                <div>Chak No 11/1.A.L, Renala Khurd</div>
                <div>Okara, Pakistan</div>
                <div>+92 300 1234567</div>
                <div>info@constructionshop.pk</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bill To -->
        <div class="address-section">
          <div>
            <div class="address-title">Bill To</div>
            <div class="address-content">
              <div>${selectedSale.customerName || getCustomerById(selectedSale.customerId)?.name || 'Walk-in Customer'}</div>
              ${selectedSale.customerPhone ? `<div>${selectedSale.customerPhone}</div>` : ''}
              ${getCustomerById(selectedSale.customerId)?.address ? `<div>${getCustomerById(selectedSale.customerId)?.address}</div>` : ''}
            </div>
          </div>
          <div class="bill-to-info">
            <div class="invoice-label">Invoice Number: 
            <span class="invoice-value">${selectedSale.id}</span></div>
            <div class="invoice-label" style="margin-top: 10px;">Invoice Date: 
            <span class="invoice-value">${new Date(selectedSale.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
            <div class="invoice-label" style="margin-top: 10px;">Status: 
            <span class="status-badge status-${selectedSale.status}">
              ${selectedSale.status.charAt(0).toUpperCase() + selectedSale.status.slice(1)}
            </span></div>
          </div>
        </div>

        <!-- Items Table -->
        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Discount</th>
              <th class="amount-column">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${selectedSale.items.map(item => {
              const product = getProductById(item.productId);
              const discountAmount = parseFloat(item.discount || 0);
              const itemTotal = (item.quantity * item.price) - discountAmount;

              return `
                <tr>
                  <td>${product ? product.name : item.productId}</td>
                  <td>${item.quantity} ${product ? product.unit : ''}</td>
                  <td>${formatCurrency(item.price)}</td>
                  <td>${discountAmount > 0 ? formatCurrency(discountAmount) : '-'}</td>
                  <td class="amount-column">${formatCurrency(itemTotal)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <!-- Totals -->
        <table class="totals-table">
          <tr>
            <td class="label">Subtotal</td>
            <td class="value">${formatCurrency(selectedSale.total)}</td>
          </tr>
          <tr>
            <td class="label">Amount Paid</td>
            <td class="value amount-paid">${formatCurrency(selectedSale.paid)}</td>
          </tr>
          <tr>
            <td class="label grand-total">Balance Due</td>
            <td class="value grand-total ${selectedSale.due > 0 ? 'amount-due' : 'amount-paid'}">${formatCurrency(selectedSale.due)}</td>
          </tr>
        </table>

        <!-- Payment History -->
        ${selectedSale.paymentHistory && selectedSale.paymentHistory.length > 0 ? `
          <div class="section-title">Payment History</div>
          <table class="payment-history-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Amount Paid</th>
                <th class="right-align">Due Before Payment</th>
                <th class="right-align">Balance After Payment</th>
              </tr>
            </thead>
            <tbody>
              ${selectedSale.paymentHistory.map(payment => {
                const dueBeforePayment = payment.remainingBalance + payment.amount;
                return `
                  <tr>
                    <td>${new Date(payment.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                    <td class="amount-cell">+${formatCurrency(payment.amount)}</td>
                    <td class="right-align" style="color: #dc2626; font-weight: 600;">${formatCurrency(dueBeforePayment)}</td>
                    <td class="right-align">${formatCurrency(payment.remainingBalance)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        ` : `
          <div class="section-title">Payment History</div>
          <div class="no-payment-history">No payment records found for this invoice.</div>
        `}

        <!-- Notes -->
        <div class="invoice-notes">
          <strong>Payment Instructions:</strong> Thank you for your business! Please settle the balance within 30 days.
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>This is a computer-generated invoice and does not require a signature.</p>
          <p>Contact us at +92 300 1234567 or info@constructionshop.pk for any inquiries.</p>
        </div>
      </div>

      <button onclick="window.print();" class="print-button">Print Invoice</button>
    </body>
    </html>
  `);

  printWindow.document.close();
};