import { formatCurrency } from '@/lib/utils';
import jsPDF from 'jspdf';

export const printInvoice = (sale) => {
  // HTML for print window
  const printContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice #${sale.invoiceNumber}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Roboto', sans-serif;
          line-height: 1.5;
          color: #1e293b;
          background-color: #f1f5f9;
          padding: 15px;
        }
        .invoice-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 30px;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
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
          color: white;
          font-size: 20px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .company-name {
          font-size: 24px;
          font-weight: 700;
        }
        .invoice-title {
          color: #64748b;
          font-size: 14px;
          margin-top: 5px;
        }
        .header-info {
          display: flex;
          gap: 30px;
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
        }
        .status-badge {
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        .status-completed { background-color: #d1fae5; color: #065f46; }
        .status-partial { background-color: #fef3c7; color: #92400e; }
        .status-unpaid { background-color: #fee2e2; color: #b91c1c; }
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
        .items-table th, .items-table td {
          padding: 12px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 13px;
        }
        .items-table th {
          background: linear-gradient(to bottom, #f1f5f9, #e2e8f0);
          color: #334155;
          font-weight: 600;
          text-align: left;
        }
        .amount-column { text-align: right; }
        .totals-table {
          width: 350px;
          margin-left: auto;
          border-collapse: collapse;
        }
        .totals-table td {
          padding: 8px 12px;
          font-size: 14px;
        }
        .totals-table .label { color: #64748b; }
        .totals-table .value { text-align: right; font-weight: 600; }
        .totals-table .grand-total {
          font-weight: 700;
          color: #1e293b;
          font-size: 16px;
          border-top: 3px solid #e2e8f0;
          padding-top: 12px;
        }
        .amount-paid { color: #059669; }
        .amount-due { color: #dc2626; }
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
        .payment-history-table th, .payment-history-table td {
          padding: 10px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 13px;
        }
        .payment-history-table th {
          background: linear-gradient(to bottom, #f1f5f9, #e2e8f0);
          color: #64748b;
          font-weight: 600;
          text-align: left;
        }
        .payment-history-table .amount-cell { color: #059669; font-weight: 600; }
        .payment-history-table .right-align { text-align: right; }
        .no-payment-history {
          background-color: #fefce8;
          border: 1px solid #fef08a;
          color: #854d0e;
          padding: 12px;
          border-radius: 6px;
        }
        .section-title {
          font-size: 16px;
          font-weight: 600;
          color: #334155;
          margin: 25px 0 12px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e2e8f0;
        }
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 100px;
          color: rgba(226, 232, 240, 0.3);
          font-weight: 700;
          letter-spacing: 8px;
          text-transform: uppercase;
        }
        @media print {
          body { background-color: white; padding: 0; margin: 0; font-size: 11pt; }
          .invoice-container { box-shadow: none; padding: 20mm; margin: 0; max-width: 100%; }
          .watermark { display: ${sale.amountPaid >= sale.totalAmount ? 'none' : 'block'}; }
        }
      </style>
    </head>
    <body>
      ${sale.amountPaid < sale.totalAmount ? '<div class="watermark">UNPAID</div>' : ''}
      <div class="invoice-container">
        <div class="invoice-header">
          <div class="logo-section">
            <div class="logo">CM</div>
            <div>
              <h1 class="company-name">Manzoor Construction Material</h1>
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
        <div class="address-section">
          <div>
            <div class="address-title">Bill To</div>
            <div class="address-content">
              <div>${sale.customer?.name || 'Walk-in Customer'}</div>
              ${sale.customer?.phoneNumber ? `<div>${sale.customer.phoneNumber}</div>` : ''}
              ${sale.customer?.address ? `<div>${sale.customer.address}</div>` : ''}
            </div>
          </div>
          <div class="bill-to-info">
            <div class="invoice-label">Invoice Number: <span class="invoice-value">${
              sale.invoiceNumber
            }</span></div>
            <div class="invoice-label" style="margin-top: 10px;">Invoice Date: <span class="invoice-value">${new Date(
              sale.date
            ).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</span></div>
            <div class="invoice-label" style="margin-top: 10px;">Status: 
              <span class="status-badge status-${
                sale.amountPaid >= sale.totalAmount
                  ? 'completed'
                  : sale.amountPaid > 0
                  ? 'partial'
                  : 'unpaid'
              }">
                ${
                  sale.amountPaid >= sale.totalAmount
                    ? 'Completed'
                    : sale.amountPaid > 0
                    ? 'Partial'
                    : 'Unpaid'
                }
              </span>
            </div>
          </div>
        </div>
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
            ${sale.saleItems
              .map(
                (item) => `
                <tr>
                  <td>${item.product.name}</td>
                  <td>${item.quantity}</td>
                  <td>${formatCurrency(item.unitPrice)}</td>
                  <td>${item.discount > 0 ? formatCurrency(item.discount) : '-'}</td>
                  <td class="amount-column">${formatCurrency(item.total)}</td>
                </tr>
              `
              )
              .join('')}
          </tbody>
        </table>
        <table class="totals-table">
          <tr>
            <td class="label">Subtotal</td>
            <td class="value">${formatCurrency(sale.totalAmount)}</td>
          </tr>
          <tr>
            <td class="label">Amount Paid</td>
            <td class="value amount-paid">${formatCurrency(sale.amountPaid)}</td>
          </tr>
          <tr>
            <td class="label grand-total">Balance Due</td>
            <td class="value grand-total ${
              sale.totalAmount - sale.amountPaid > 0 ? 'amount-due' : 'amount-paid'
            }">${formatCurrency(sale.totalAmount - sale.amountPaid)}</td>
          </tr>
        </table>
        ${
          sale.paymentHistory && sale.paymentHistory.length > 0
            ? `
          <div class="section-title">Payment History</div>
          <table class="payment-history-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Amount Paid</th>
                <th>Payment Method</th>
                <th class="right-align">Dues Status</th>
              </tr>
            </thead>
            <tbody>
              ${sale.paymentHistory
                .map(
                  (payment) => `
                  <tr>
                    <td>${new Date(payment.date).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}</td>
                    <td class="amount-cell">+${formatCurrency(payment.amountPaid)}</td>
                    <td>${payment.paymentMethod}</td>
                    <td class="right-align">${payment.duesStatus}</td>
                  </tr>
                `
                )
                .join('')}
            </tbody>
          </table>
        `
            : `
          <div class="section-title">Payment History</div>
          <div class="no-payment-history">No payment records found for this invoice.</div>
        `
        }
        <div class="invoice-notes">
          <strong>Payment Instructions:</strong> Thank you for your business! Please settle the balance within 30 days.
        </div>
        <div class="footer">
          <p>This is a computer-generated invoice and does not require a signature.</p>
          <p>Contact us at +92 300 1234567 or info@constructionshop.pk for any inquiries.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Handle print action
  const printWindow = window.open('', '_blank');
  printWindow.document.write(printContent);
  printWindow.document.close();

  // Handle PDF download
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const pageHeight = 297;
  let yOffset = 20;

  // Header
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.text('Manzoor Construction Material', 20, yOffset);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Tax Invoice', 20, yOffset + 8);
  yOffset += 20;

  // Business Info
  pdf.text('Chak No 11/1.A.L, Renala Khurd', 20, yOffset);
  pdf.text('Okara, Pakistan', 20, yOffset + 8);
  pdf.text('+92 300 1234567', 20, yOffset + 16);
  pdf.text('info@constructionshop.pk', 20, yOffset + 24);
  yOffset += 32;

  // Bill To and Invoice Info
  pdf.setFont('helvetica', 'bold');
  pdf.text('Bill To', 20, yOffset);
  pdf.text('Invoice Details', pageWidth - 100, yOffset);
  pdf.setFont('helvetica', 'normal');
  yOffset += 8;
  pdf.text(sale.customer?.name || 'Walk-in Customer', 20, yOffset);
  pdf.text(`Invoice Number: ${sale.invoiceNumber}`, pageWidth - 100, yOffset);
  yOffset += 8;
  if (sale.customer?.phoneNumber) {
    pdf.text(sale.customer.phoneNumber, 20, yOffset);
    yOffset += 8;
  }
  if (sale.customer?.address) {
    pdf.text(sale.customer.address, 20, yOffset);
    yOffset += 8;
  }
  pdf.text(
    `Date: ${new Date(sale.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}`,
    pageWidth - 100,
    yOffset
  );
  yOffset += 8;
  const status =
    sale.amountPaid >= sale.totalAmount
      ? 'Completed'
      : sale.amountPaid > 0
      ? 'Partial'
      : 'Unpaid';
  pdf.text(`Status: ${status}`, pageWidth - 100, yOffset);
  yOffset += 16;

  // Items Table
  pdf.setFont('helvetica', 'bold');
  pdf.text('Item', 20, yOffset);
  pdf.text('Qty', 80, yOffset);
  pdf.text('Unit Price', 100, yOffset);
  pdf.text('Discount', 140, yOffset);
  pdf.text('Amount', pageWidth - 40, yOffset, { align: 'right' });
  yOffset += 6;
  pdf.line(20, yOffset, pageWidth - 20, yOffset);
  yOffset += 6;
  pdf.setFont('helvetica', 'normal');
  sale.saleItems.forEach((item) => {
    if (yOffset > pageHeight - 40) {
      pdf.addPage();
      yOffset = 20;
    }
    pdf.text(item.product.name, 20, yOffset);
    pdf.text(item.quantity.toString(), 80, yOffset);
    pdf.text(formatCurrency(item.unitPrice), 100, yOffset);
    pdf.text(item.discount > 0 ? formatCurrency(item.discount) : '-', 140, yOffset);
    pdf.text(formatCurrency(item.total), pageWidth - 20, yOffset, { align: 'right' });
    yOffset += 8;
  });
  yOffset += 6;
  pdf.line(20, yOffset, pageWidth - 20, yOffset);
  yOffset += 10;

  // Totals
  pdf.text('Subtotal', pageWidth - 80, yOffset);
  pdf.text(formatCurrency(sale.totalAmount), pageWidth - 20, yOffset, { align: 'right' });
  yOffset += 8;
  pdf.text('Amount Paid', pageWidth - 80, yOffset);
  pdf.text(formatCurrency(sale.amountPaid), pageWidth - 20, yOffset, { align: 'right' });
  yOffset += 8;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Balance Due', pageWidth - 80, yOffset);
  pdf.text(
    formatCurrency(sale.totalAmount - sale.amountPaid),
    pageWidth - 20,
    yOffset,
    { align: 'right' }
  );
  yOffset += 16;

  // Payment History
  if (sale.paymentHistory && sale.paymentHistory.length > 0) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('Payment History', 20, yOffset);
    yOffset += 6;
    pdf.line(20, yOffset, pageWidth - 20, yOffset);
    yOffset += 6;
    pdf.setFont('helvetica', 'normal');
    pdf.text('Date & Time', 20, yOffset);
    pdf.text('Amount', 80, yOffset);
    pdf.text('Method', 120, yOffset);
    pdf.text('Status', pageWidth - 40, yOffset, { align: 'right' });
    yOffset += 6;
    pdf.line(20, yOffset, pageWidth - 20, yOffset);
    yOffset += 6;
    sale.paymentHistory.forEach((payment) => {
      if (yOffset > pageHeight - 40) {
        pdf.addPage();
        yOffset = 20;
      }
      pdf.text(
        new Date(payment.date).toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
        20,
        yOffset
      );
      pdf.text(formatCurrency(payment.amountPaid), 80, yOffset);
      pdf.text(payment.paymentMethod, 120, yOffset);
      pdf.text(payment.duesStatus, pageWidth - 20, yOffset, { align: 'right' });
      yOffset += 8;
    });
    yOffset += 10;
  } else {
    pdf.text('Payment History', 20, yOffset);
    yOffset += 8;
    pdf.text('No payment records found for this invoice.', 20, yOffset);
    yOffset += 10;
  }

  // Notes and Footer
  if (yOffset > pageHeight - 60) {
    pdf.addPage();
    yOffset = 20;
  }
  pdf.text(
    'Payment Instructions: Thank you for your business! Please settle the balance within 30 days.',
    20,
    yOffset,
    { maxWidth: pageWidth - 40 }
  );
  yOffset += 20;
  pdf.setFontSize(10);
  pdf.text(
    'This is a computer-generated invoice and does not require a signature.',
    20,
    yOffset,
    { align: 'center', maxWidth: pageWidth - 40 }
  );
  yOffset += 8;
  pdf.text(
    'Contact us at +92 300 1234567 or info@constructionshop.pk for any inquiries.',
    20,
    yOffset,
    { align: 'center', maxWidth: pageWidth - 40 }
  );

  // Save PDF
  pdf.save(`Invoice_${sale.invoiceNumber}.pdf`);
};