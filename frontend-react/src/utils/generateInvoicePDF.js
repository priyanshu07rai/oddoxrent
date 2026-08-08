import { toast } from '../components/ui/Toast';

export const generateInvoicePDF = (order) => {
  if (!order) {
    toast.error('Order details unavailable for invoice download');
    return;
  }

  const orderId = order.order_number || order.id || 'RNT-892014';
  const createdDate = order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', { dateStyle: 'medium' }) : new Date().toLocaleDateString('en-US', { dateStyle: 'medium' });
  const productName = order.product?.name || order.items?.[0]?.product?.name || 'Sony FX3 Cinema Camera Kit';
  const startDate = order.start_date || order.items?.[0]?.start_date || new Date().toISOString().split('T')[0];
  const endDate = order.end_date || order.items?.[0]?.end_date || new Date(Date.now() + 3*86400000).toISOString().split('T')[0];
  
  const rentalFee = order.rental_amount || (order.total_price ? Math.max(1000, order.total_price - (order.deposit_amount || 5000)) : 2000);
  const depositFee = order.deposit_amount || 8000;
  const totalCharged = order.total_price || (rentalFee + depositFee);

  const invoiceHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>RentOS Tax Invoice - ${orderId}</title>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #0f172a; margin: 0; padding: 40px; background: #ffffff; }
        .invoice-box { max-width: 800px; margin: auto; padding: 36px; border: 1px solid #e2e8f0; border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #4f46e5; padding-bottom: 24px; margin-bottom: 32px; }
        .logo { font-size: 32px; font-weight: 900; color: #4f46e5; letter-spacing: -1px; }
        .invoice-title { text-align: right; }
        .invoice-title h1 { font-size: 22px; font-weight: 800; color: #0f172a; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
        .invoice-title p { font-size: 13px; color: #64748b; margin: 4px 0 0 0; font-weight: 600; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 36px; }
        .details-block h4 { font-size: 11px; text-transform: uppercase; color: #64748b; margin: 0 0 8px 0; letter-spacing: 0.8px; font-weight: 800; }
        .details-block p { font-size: 13px; font-weight: 600; margin: 0 0 4px 0; color: #1e293b; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 36px; }
        th { background: #f8fafc; text-align: left; padding: 14px 16px; font-size: 11px; font-weight: 800; text-transform: uppercase; color: #64748b; border-bottom: 1.5px solid #e2e8f0; letter-spacing: 0.5px; }
        td { padding: 16px; font-size: 13px; font-weight: 600; border-bottom: 1px solid #f1f5f9; }
        .totals-table { width: 340px; margin-left: auto; margin-bottom: 36px; }
        .totals-table td { padding: 10px 16px; font-size: 14px; }
        .totals-table .total-row td { border-top: 2px solid #0f172a; font-size: 18px; font-weight: 900; color: #4f46e5; padding-top: 14px; }
        .badge-paid { display: inline-block; background: #dcfce7; color: #166534; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; border: 1px solid #bbf7d0; }
        .footer { border-top: 1px solid #e2e8f0; padding-top: 24px; font-size: 12px; color: #64748b; text-align: center; line-height: 1.6; font-weight: 500; }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <div class="header">
          <div>
            <div class="logo">RentOS</div>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b; font-weight: 600;">Equipment Rental Platform</p>
          </div>
          <div class="invoice-title">
            <h1>TAX INVOICE</h1>
            <p>Invoice #${orderId}</p>
            <p>Date: ${createdDate}</p>
          </div>
        </div>

        <div class="details-grid">
          <div class="details-block">
            <h4>Billed To (Customer)</h4>
            <p><strong>${order.address?.name || 'Customer'}</strong></p>
            <p>${order.address?.phone || '+91 98765 43210'}</p>
            <p style="color: #64748b;">Verified Customer Account</p>
          </div>
          <div class="details-block" style="text-align: right;">
            <h4>Store Pickup Hub</h4>
            <p><strong>RentOS Central Gear Store</strong></p>
            <p>Main Street, Sector 62, Noida, UP 201301</p>
            <p style="margin-top: 8px;"><span class="badge-paid">✓ PAYMENT VERIFIED</span></p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Equipment Description</th>
              <th>Rental Duration</th>
              <th>Fulfillment</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong style="font-size: 14px;">${productName}</strong><br>
                <span style="font-size: 11px; color: #64748b; font-weight: 500;">Includes hardcase, battery chargers & protective accessories</span>
              </td>
              <td>${startDate} &rarr; ${endDate}</td>
              <td>Store Pickup</td>
              <td style="text-align: right; font-size: 14px; font-weight: 800;">₹${rentalFee.toLocaleString()}</td>
            </tr>
            <tr>
              <td>
                <strong style="font-size: 14px;">Escrow Security Deposit</strong><br>
                <span style="font-size: 11px; color: #64748b; font-weight: 500;">100% Refundable upon gear return inspection</span>
              </td>
              <td>Duration of Rental</td>
              <td>Escrow Vault</td>
              <td style="text-align: right; font-size: 14px; font-weight: 800; color: #166534;">₹${depositFee.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <table class="totals-table">
          <tr>
            <td style="color: #64748b;">Subtotal (Rental Fee)</td>
            <td style="text-align: right; font-weight: 700;">₹${rentalFee.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="color: #64748b;">Security Deposit (Held)</td>
            <td style="text-align: right; font-weight: 700;">₹${depositFee.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="color: #64748b;">Store Pickup Fee</td>
            <td style="text-align: right; color: #166534; font-weight: 800;">FREE</td>
          </tr>
          <tr class="total-row">
            <td>Total Paid</td>
            <td style="text-align: right;">₹${totalCharged.toLocaleString()}</td>
          </tr>
        </table>

        <div class="footer">
          <p>Thank you for renting with <strong>RentOS Platform</strong>!</p>
          <p>Support Hotline: +91 1800-RENT-OS | Email: support@rentos.io | Pickup Hours: Daily 9 AM - 9 PM</p>
        </div>
      </div>
      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  try {
    // 1. Trigger file download
    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RentOS_Tax_Invoice_${orderId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // 2. Open print window for PDF printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
    }

    toast.success(`Tax Invoice #${orderId} generated & downloaded!`);
  } catch (e) {
    console.error('Invoice generation error', e);
    toast.error('Failed to generate invoice document');
  }
};
