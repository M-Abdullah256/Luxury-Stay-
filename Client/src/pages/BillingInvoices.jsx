import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { 
  Receipt, 
  Plus, 
  Search, 
  Printer, 
  CreditCard, 
  DollarSign, 
  CheckCircle, 
  Coffee, 
  Shirt, 
  X,
  Hotel
} from 'lucide-react';

const BillingInvoices = () => {
  const [bills, setBills] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modals
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedReservationId, setSelectedReservationId] = useState('');
  
  // Service Charge Form
  const [serviceForm, setServiceForm] = useState({
    serviceName: 'Food - Room Service',
    amount: ''
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [billsRes, resRes] = await Promise.all([
        API.get('/billing'),
        API.get('/reservations')
      ]);
      setBills(billsRes.data.bills);
      setReservations(resRes.data.reservations);
    } catch (err) {
      console.error('Error fetching billing data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Generate Bill for a Reservation
  const handleGenerateBill = async (e) => {
    e.preventDefault();
    if (!selectedReservationId) return;

    try {
      await API.post(`/billing/generate/${selectedReservationId}`);
      setGenerateModalOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate bill');
    }
  };

  // Add Service Charge (Food, Laundry, etc.)
  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/billing/${selectedBill._id}/add-service`, {
        serviceName: serviceForm.serviceName,
        amount: Number(serviceForm.amount)
      });
      setServiceModalOpen(false);
      setServiceForm({ serviceName: 'Food - Room Service', amount: '' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add service charge');
    }
  };

  // Mark as Paid
  const handlePayBill = async (billId) => {
    const paymentMethod = window.prompt('Select Payment Method: "Credit Card", "Cash", or "Online Transfer"', 'Credit Card');
    if (!paymentMethod) return;

    try {
      await API.patch(`/billing/${billId}/pay`, { paymentMethod });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Payment processing failed');
    }
  };

  // Filter bills
  const filteredBills = bills.filter((b) => 
    b.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
    b.guest?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    b.reservation?.room?.roomNumber?.includes(search)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="luxury-heading" style={{ fontSize: '26px', color: '#fff', marginBottom: '4px' }}>
            Billing & Guest Invoicing
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Generate guest folios, apply room service & laundry charges, and print official tax invoices.
          </p>
        </div>

        <button onClick={() => setGenerateModalOpen(true)} className="btn-gold">
          <Plus size={18} />
          <span>Generate Bill</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="luxury-card" style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          <Search size={18} color="var(--primary-gold)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            placeholder="Search by invoice #, guest, or room #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-color)',
              padding: '10px 14px 10px 38px',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="luxury-card" style={{ overflowX: 'auto', padding: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '14px' }}>Invoice #</th>
              <th style={{ padding: '14px' }}>Guest & Suite</th>
              <th style={{ padding: '14px' }}>Room Tariff</th>
              <th style={{ padding: '14px' }}>Additional Services</th>
              <th style={{ padding: '14px' }}>Tax (13%)</th>
              <th style={{ padding: '14px' }}>Total Amount</th>
              <th style={{ padding: '14px' }}>Payment Status</th>
              <th style={{ padding: '14px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  Loading invoices...
                </td>
              </tr>
            ) : filteredBills.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No billing folios generated yet.
                </td>
              </tr>
            ) : (
              filteredBills.map((bill) => (
                <tr key={bill._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '14px', fontWeight: '600', color: 'var(--primary-gold)' }}>
                    {bill.invoiceNumber}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ color: '#fff', fontWeight: '600' }}>{bill.guest?.fullName}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                      Room #{bill.reservation?.room?.roomNumber} ({bill.reservation?.room?.roomType})
                    </div>
                  </td>
                  <td style={{ padding: '14px', color: '#cbd5e1' }}>${bill.roomCharges}</td>
                  <td style={{ padding: '14px', color: 'var(--text-muted)' }}>
                    {bill.additionalServices?.length > 0 ? (
                      <span>{bill.additionalServices.length} items (${bill.additionalServices.reduce((a,c)=>a+c.amount,0)})</span>
                    ) : (
                      <span>None</span>
                    )}
                  </td>
                  <td style={{ padding: '14px', color: 'var(--text-muted)' }}>${bill.taxAmount?.toFixed(2)}</td>
                  <td style={{ padding: '14px', fontWeight: '700', color: '#fff', fontSize: '14px' }}>
                    ${bill.totalAmount?.toFixed(2)}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span className={`badge badge-${bill.paymentStatus === 'Paid' ? 'available' : 'cleaning'}`}>
                      ● {bill.paymentStatus}
                    </span>
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      {/* Add Service Button */}
                      {bill.paymentStatus !== 'Paid' && (
                        <button
                          onClick={() => { setSelectedBill(bill); setServiceModalOpen(true); }}
                          style={{
                            background: 'rgba(56, 189, 248, 0.1)',
                            border: '1px solid rgba(56, 189, 248, 0.3)',
                            color: '#38bdf8',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Add Food or Laundry Charges"
                        >
                          + Add Service
                        </button>
                      )}

                      {/* Pay Button */}
                      {bill.paymentStatus !== 'Paid' && (
                        <button
                          onClick={() => handlePayBill(bill._id)}
                          className="btn-gold"
                          style={{ padding: '6px 10px', fontSize: '11px', borderRadius: '6px' }}
                        >
                          <CreditCard size={12} /> Pay
                        </button>
                      )}

                      {/* View & Print Invoice */}
                      <button
                        onClick={() => { setSelectedBill(bill); setInvoiceModalOpen(true); }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          color: '#fff',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Printer size={12} /> Invoice
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: GENERATE BILL */}
      {generateModalOpen && (
        <div style={modalBackdropStyle}>
          <div className="luxury-card" style={{ width: '100%', maxWidth: '480px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ color: '#fff', fontSize: '18px' }}>Generate Bill for Reservation</h3>
              <button onClick={() => setGenerateModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleGenerateBill} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Select Booking *</label>
                <select
                  required
                  value={selectedReservationId}
                  onChange={(e) => setSelectedReservationId(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">-- Choose Reservation --</option>
                  {reservations.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.bookingReference} — {r.guest?.fullName} (Room #{r.room?.roomNumber})
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setGenerateModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-gold">Create Bill</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD SERVICE CHARGE (FOOD / LAUNDRY) */}
      {serviceModalOpen && selectedBill && (
        <div style={modalBackdropStyle}>
          <div className="luxury-card" style={{ width: '100%', maxWidth: '440px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ color: '#fff', fontSize: '18px' }}>Add Charge to {selectedBill.invoiceNumber}</h3>
              <button onClick={() => setServiceModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddService} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Service Type *</label>
                <select
                  value={serviceForm.serviceName}
                  onChange={(e) => setServiceForm({ ...serviceForm, serviceName: e.target.value })}
                  style={inputStyle}
                >
                  <option value="Food - Room Service">Food - Room Service (Kitchen)</option>
                  <option value="Laundry & Dry Cleaning">Laundry & Dry Cleaning</option>
                  <option value="Mini Bar Consumption">Mini Bar Consumption</option>
                  <option value="Airport Chauffeur Service">Airport Chauffeur Service</option>
                  <option value="Spa & Wellness Treatment">Spa & Wellness Treatment</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Amount ($) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 45"
                  value={serviceForm.amount}
                  onChange={(e) => setServiceForm({ ...serviceForm, amount: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setServiceModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-gold">Add to Folio</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PRINTABLE 5-STAR LUXURY INVOICE */}
      {invoiceModalOpen && selectedBill && (
        <div style={modalBackdropStyle}>
          <div style={{
            background: '#ffffff',
            color: '#0f172a',
            width: '100%',
            maxWidth: '680px',
            borderRadius: '16px',
            padding: '40px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}>
            {/* Invoice Top Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }} className="no-print">
              <span style={{ fontSize: '12px', color: '#64748b' }}>OFFICIAL GUEST FOLIO & TAX INVOICE</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => window.print()}
                  style={{
                    background: '#0f172a',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px'
                  }}
                >
                  <Printer size={16} /> Print / Save PDF
                </button>
                <button 
                  onClick={() => setInvoiceModalOpen(false)}
                  style={{ background: '#e2e8f0', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <X size={16} color="#0f172a" />
                </button>
              </div>
            </div>

            {/* Hotel Brand Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '1px', color: '#0f172a' }}>
                  LUXURYSTAY HOSPITALITY
                </h2>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  Downtown Luxury Boulevard, International Hospitality Group<br />
                  Tax Registration: STRN-9842104-HMS
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#c5a880' }}>
                  {selectedBill.invoiceNumber}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  Date: {new Date(selectedBill.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Guest & Room Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', fontSize: '13px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px' }}>
                <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Billed To:</div>
                <div style={{ fontSize: '15px', fontWeight: '600' }}>{selectedBill.guest?.fullName}</div>
                <div style={{ color: '#64748b' }}>{selectedBill.guest?.phone}</div>
                <div style={{ color: '#64748b' }}>{selectedBill.guest?.email}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px' }}>
                <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>Stay Details:</div>
                <div>Room Number: <strong>#{selectedBill.reservation?.room?.roomNumber}</strong></div>
                <div>Suite Category: <strong>{selectedBill.reservation?.room?.roomType}</strong></div>
                <div>Payment Method: <strong>{selectedBill.paymentMethod}</strong></div>
              </div>
            </div>

            {/* Charges Breakdown Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#0f172a', color: '#ffffff', textAlign: 'left' }}>
                  <th style={{ padding: '10px 14px' }}>Description</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Amount ($)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 14px' }}>Accommodations Tariff ({selectedBill.reservation?.room?.roomType})</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '600' }}>${selectedBill.roomCharges?.toFixed(2)}</td>
                </tr>

                {selectedBill.additionalServices?.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px 14px' }}>{item.serviceName}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '600' }}>${item.amount?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Calculation */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
              <div style={{ width: '260px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Subtotal:</span>
                  <span>${selectedBill.subtotal?.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Luxury Tax (13%):</span>
                  <span>${selectedBill.taxAmount?.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '18px', borderTop: '2px solid #0f172a', paddingTop: '8px', color: '#0f172a' }}>
                  <span>Grand Total:</span>
                  <span style={{ color: '#b09166' }}>${selectedBill.totalAmount?.toFixed(2)}</span>
                </div>
                <div style={{ textAlign: 'right', marginTop: '6px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700',
                    background: selectedBill.paymentStatus === 'Paid' ? '#dcfce7' : '#fef3c7',
                    color: selectedBill.paymentStatus === 'Paid' ? '#166534' : '#92400e'
                  }}>
                    STATUS: {selectedBill.paymentStatus.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', textAlign: 'center', fontSize: '11px', color: '#94a3b8' }}>
              Thank you for choosing LuxuryStay Hospitality. We look forward to welcoming you back soon.
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const modalBackdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.75)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
  padding: '20px'
};

const inputStyle = {
  width: '100%',
  background: 'rgba(15, 23, 42, 0.8)',
  border: '1px solid var(--border-color)',
  padding: '8px 12px',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '13px',
  outline: 'none'
};

export default BillingInvoices;