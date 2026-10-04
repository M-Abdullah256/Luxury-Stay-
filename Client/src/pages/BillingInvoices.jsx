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
  Hotel,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileText,
  AlertCircle,
  Wallet
} from 'lucide-react';

const BillingInvoices = () => {
  const [bills, setBills] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
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
      setBills(billsRes.data.bills || []);
      setReservations(resRes.data.reservations || []);
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
      setSelectedReservationId('');
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
    const paymentMethod = window.prompt('Select Payment Settlement Method: "Credit Card", "Cash", or "Online Wire"', 'Credit Card');
    if (!paymentMethod) return;

    try {
      await API.patch(`/billing/${billId}/pay`, { paymentMethod });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Payment processing failed');
    }
  };

  // Real-time Dynamic Financial Calculations
  const settledRevenue = bills
    .filter((b) => b.paymentStatus === 'Paid')
    .reduce((acc, b) => acc + (b.totalAmount || 0), 0);

  const pendingRevenue = bills
    .filter((b) => b.paymentStatus !== 'Paid')
    .reduce((acc, b) => acc + (b.totalAmount || 0), 0);

  const paidCount = bills.filter((b) => b.paymentStatus === 'Paid').length;
  const pendingCount = bills.filter((b) => b.paymentStatus !== 'Paid').length;

  // Filter bills for the table
  const filteredBills = bills.filter((b) => {
    const matchesSearch = 
      b.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
      b.guest?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      b.reservation?.room?.roomNumber?.toString().includes(search);
    const matchesStatus = statusFilter ? b.paymentStatus === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // Filter out reservations that already have a bill generated
  const billedReservationIds = new Set(
    bills
      .map((b) => (typeof b.reservation === 'object' ? b.reservation?._id : b.reservation))
      .filter(Boolean)
  );

  const availableReservations = reservations.filter(
    (r) => !billedReservationIds.has(r._id)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', color: '#f8fafc', paddingBottom: '60px' }}>
      
      {/* ================= TOP ACTION HEADER ================= */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        paddingBottom: '20px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#d4af37', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            <Receipt size={14} /> Fiscal Ledger & Auditing
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(24px, 3vw, 34px)',
            color: '#ffffff',
            margin: 0,
            fontWeight: '600'
          }}>
            Billing & Invoicing Folios
          </h1>
        </div>

        <button 
          onClick={() => setGenerateModalOpen(true)} 
          style={{
            background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)',
            color: '#070b14',
            fontWeight: '700',
            fontSize: '12.5px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            padding: '11px 22px',
            borderRadius: '25px',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Plus size={16} />
          <span>Generate Folio Bill</span>
        </button>
      </div>

      {/* ================= 4 FINANCIAL KPI STATS CARDS ================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '18px'
      }}>
        {/* Paid Revenue */}
        <div style={kpiCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '11.5px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '600' }}>Settled Collections</span>
            <div style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', padding: '7px', borderRadius: '8px' }}>
              <DollarSign size={16} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '700', color: '#34d399', fontFamily: "'Playfair Display', serif" }}>
            ${settledRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '4px' }}>
            From <strong style={{ color: '#fff' }}>{paidCount}</strong> settled invoices
          </div>
        </div>

        {/* Pending Revenue */}
        <div style={kpiCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '11.5px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '600' }}>Pending Balances</span>
            <div style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', padding: '7px', borderRadius: '8px' }}>
              <Clock size={16} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '700', color: '#fbbf24', fontFamily: "'Playfair Display', serif" }}>
            ${pendingRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '4px' }}>
            Awaiting front-desk checkout settlement
          </div>
        </div>

        {/* Total Invoices Count */}
        <div style={kpiCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '11.5px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '600' }}>Total Folios</span>
            <div style={{ background: 'rgba(212, 175, 55, 0.12)', color: '#d4af37', padding: '7px', borderRadius: '8px' }}>
              <FileText size={16} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '700', color: '#ffffff', fontFamily: "'Playfair Display', serif" }}>
            {bills.length}
          </div>
          <div style={{ fontSize: '11.5px', color: '#94a3b8', marginTop: '4px' }}>
            Registered in central accounting ledger
          </div>
        </div>

        {/* Settlement Rate Indicator */}
        <div style={kpiCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '11.5px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: '600' }}>Settlement Rate</span>
            <div style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', padding: '7px', borderRadius: '8px' }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '700', color: '#ffffff', fontFamily: "'Playfair Display', serif" }}>
            {bills.length > 0 ? Math.round((paidCount / bills.length) * 100) : 100}%
          </div>
          <div style={{ fontSize: '11.5px', color: '#38bdf8', marginTop: '4px', fontWeight: '500' }}>
            {paidCount} Settled / {pendingCount} Pending
          </div>
        </div>
      </div>

      {/* ================= SEARCH & STATUS FILTER BAR ================= */}
      <div style={{
        background: '#0d1527',
        border: '1px solid rgba(212, 175, 55, 0.22)',
        borderRadius: '18px',
        padding: '18px 24px',
        display: 'flex',
        gap: '18px',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <Search size={16} color="#d4af37" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by invoice #, resident name, or suite #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(7, 11, 20, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '11px 16px 11px 42px',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Status Filter Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['', 'Paid', 'Unpaid'].map((st) => {
            const isSelected = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  background: isSelected ? 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)' : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? '#070b14' : '#cbd5e1',
                  border: isSelected ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '7px 18px',
                  borderRadius: '20px',
                  fontSize: '11.5px',
                  fontWeight: isSelected ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {st === '' ? 'All Folios' : st === 'Paid' ? 'Paid (Settled)' : 'Unpaid (Pending)'}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= INVOICES EXECUTIVE LEDGER TABLE ================= */}
      <div style={{
        background: '#0d1527',
        border: '1px solid rgba(212, 175, 55, 0.22)',
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7)'
      }}>
        <div style={{ overflowX: 'auto', padding: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                <th style={thStyle}>Invoice #</th>
                <th style={thStyle}>Resident & Suite</th>
                <th style={thStyle}>Room Tariff</th>
                <th style={thStyle}>Services Itemized</th>
                <th style={thStyle}>Tax (13%)</th>
                <th style={thStyle}>Grand Total</th>
                <th style={thStyle}>Settlement State</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Folio Operations</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '50px', color: '#d4af37' }}>
                    Retrieving billing ledger...
                  </td>
                </tr>
              ) : filteredBills.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '50px', color: '#94a3b8' }}>
                    No billing folios located matching criteria.
                  </td>
                </tr>
              ) : (
                filteredBills.map((bill) => {
                  const isPaid = bill.paymentStatus === 'Paid';

                  return (
                    <tr 
                      key={bill._id} 
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Invoice Monospace Badge */}
                      <td style={tdStyle}>
                        <span style={{
                          fontFamily: 'monospace',
                          fontWeight: '700',
                          fontSize: '13px',
                          color: '#d4af37',
                          background: 'rgba(212, 175, 55, 0.08)',
                          border: '1px solid rgba(212, 175, 55, 0.25)',
                          padding: '4px 8px',
                          borderRadius: '6px'
                        }}>
                          {bill.invoiceNumber}
                        </span>
                      </td>

                      {/* Guest and Suite */}
                      <td style={tdStyle}>
                        <div style={{ color: '#ffffff', fontWeight: '600' }}>{bill.guest?.fullName || 'Resident'}</div>
                        <div style={{ color: '#d4af37', fontSize: '11px', marginTop: '2px' }}>
                          Suite #{bill.reservation?.room?.roomNumber} ({bill.reservation?.room?.roomType})
                        </div>
                      </td>

                      {/* Room Tariff */}
                      <td style={{ ...tdStyle, color: '#cbd5e1' }}>
                        ${bill.roomCharges?.toFixed(2)}
                      </td>

                      {/* Services breakdown */}
                      <td style={tdStyle}>
                        {bill.additionalServices?.length > 0 ? (
                          <div>
                            <span style={{ color: '#38bdf8', fontWeight: '600' }}>
                              {bill.additionalServices.length} Items
                            </span>
                            <span style={{ color: '#94a3b8', fontSize: '11px', display: 'block' }}>
                              (${bill.additionalServices.reduce((a, c) => a + c.amount, 0).toFixed(2)})
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: '#64748b' }}>None</span>
                        )}
                      </td>

                      {/* Tax */}
                      <td style={{ ...tdStyle, color: '#94a3b8' }}>
                        ${bill.taxAmount?.toFixed(2)}
                      </td>

                      {/* Grand Total */}
                      <td style={tdStyle}>
                        <span style={{ fontSize: '16px', fontWeight: '800', color: '#ffffff' }}>
                          ${bill.totalAmount?.toFixed(2)}
                        </span>
                      </td>

                      {/* Payment Status Pill */}
                      <td style={tdStyle}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          letterSpacing: '0.4px',
                          padding: '4px 10px',
                          borderRadius: '14px',
                          background: isPaid ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                          border: `1px solid ${isPaid ? 'rgba(16, 185, 129, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`,
                          color: isPaid ? '#34d399' : '#fbbf24',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          ● {bill.paymentStatus}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                          
                          {/* Add Service Button */}
                          {!isPaid && (
                            <button
                              onClick={() => { setSelectedBill(bill); setServiceModalOpen(true); }}
                              style={{
                                background: 'rgba(56, 189, 248, 0.08)',
                                border: '1px solid rgba(56, 189, 248, 0.3)',
                                color: '#38bdf8',
                                padding: '6px 10px',
                                borderRadius: '7px',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: '600',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)'}
                              title="Add Dining, Laundry or Chauffeur Charge"
                            >
                              + Charge
                            </button>
                          )}

                          {/* Pay Bill Button */}
                          {!isPaid && (
                            <button
                              onClick={() => handlePayBill(bill._id)}
                              style={{
                                background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)',
                                color: '#070b14',
                                fontWeight: '700',
                                padding: '6px 12px',
                                fontSize: '11px',
                                borderRadius: '7px',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px'
                              }}
                            >
                              <CreditCard size={12} /> Settle
                            </button>
                          )}

                          {/* View & Print Luxury Invoice */}
                          <button
                            onClick={() => { setSelectedBill(bill); setInvoiceModalOpen(true); }}
                            style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              color: '#ffffff',
                              padding: '6px 11px',
                              borderRadius: '7px',
                              cursor: 'pointer',
                              fontSize: '11px',
                              fontWeight: '500',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#d4af37'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
                          >
                            <Printer size={12} color="#d4af37" /> Folio
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL 1: GENERATE BILL ================= */}
      {generateModalOpen && (
        <div style={modalBackdropStyle}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.98)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: '22px',
            width: '100%',
            maxWidth: '500px',
            padding: '30px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Receipt size={18} color="#d4af37" />
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#fff', margin: 0 }}>
                  Generate Billing Folio
                </h3>
              </div>
              <button onClick={() => setGenerateModalOpen(false)} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleGenerateBill} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={fieldLabelStyle}>Select Active Reservation *</label>
                <select
                  required
                  value={selectedReservationId}
                  onChange={(e) => setSelectedReservationId(e.target.value)}
                  style={fieldInputStyle}
                >
                  <option value="">-- Choose Booking Reference --</option>
                  {availableReservations.length === 0 ? (
                    <option disabled value="" style={{ background: '#0d1527', color: '#94a3b8' }}>
                      No unbilled reservations available
                    </option>
                  ) : (
                    availableReservations.map((r) => (
                      <option key={r._id} value={r._id} style={{ background: '#0d1527', color: '#fff' }}>
                        {r.bookingReference} — {r.guest?.fullName} (Suite #{r.room?.roomNumber})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button type="button" onClick={() => setGenerateModalOpen(false)} className="btn-secondary" style={{ padding: '8px 18px', fontSize: '13px' }}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={availableReservations.length === 0} 
                  className="btn-gold" 
                  style={{ 
                    padding: '8px 20px', 
                    fontSize: '13px',
                    opacity: availableReservations.length === 0 ? 0.5 : 1,
                    cursor: availableReservations.length === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Create Folio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: ADD SERVICE CHARGE ================= */}
      {serviceModalOpen && selectedBill && (
        <div style={modalBackdropStyle}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.98)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: '22px',
            width: '100%',
            maxWidth: '460px',
            padding: '30px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '19px', color: '#fff', margin: 0 }}>
                  Add Charge to Folio
                </h3>
                <span style={{ fontSize: '12px', color: '#d4af37' }}>
                  {selectedBill.invoiceNumber} • Suite #{selectedBill.reservation?.room?.roomNumber}
                </span>
              </div>
              <button onClick={() => setServiceModalOpen(false)} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddService} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={fieldLabelStyle}>Department Service Charge *</label>
                <select
                  value={serviceForm.serviceName}
                  onChange={(e) => setServiceForm({ ...serviceForm, serviceName: e.target.value })}
                  style={fieldInputStyle}
                >
                  <option value="Food - Room Service" style={{ background: '#0d1527' }}>In-Suite Michelin Dining (Kitchen)</option>
                  <option value="Laundry & Dry Cleaning" style={{ background: '#0d1527' }}>Laundry & Express Dry Cleaning</option>
                  <option value="Mini Bar Consumption" style={{ background: '#0d1527' }}>Private Reserve Mini Bar</option>
                  <option value="Airport Chauffeur Service" style={{ background: '#0d1527' }}>VIP Rolls-Royce Limousine Transfer</option>
                  <option value="Spa & Wellness Treatment" style={{ background: '#0d1527' }}>Royal Spa & Hydrotherapy Session</option>
                </select>
              </div>

              <div>
                <label style={fieldLabelStyle}>Tariff Amount ($ USD) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 65"
                  value={serviceForm.amount}
                  onChange={(e) => setServiceForm({ ...serviceForm, amount: e.target.value })}
                  style={fieldInputStyle}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button type="button" onClick={() => setServiceModalOpen(false)} className="btn-secondary" style={{ padding: '8px 18px', fontSize: '13px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-gold" style={{ padding: '8px 20px', fontSize: '13px' }}>
                  Post to Folio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: 5-STAR LUXURY PRINTABLE INVOICE ================= */}
      {invoiceModalOpen && selectedBill && (
        <div style={modalBackdropStyle} className="printable-modal-backdrop">
          <div style={{
            background: '#ffffff',
            color: '#070b14',
            width: '100%',
            maxWidth: '700px',
            borderRadius: '20px',
            padding: '44px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9)'
          }} className="printable-invoice-sheet">
            
            {/* Action Bar (Hidden when printed) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }} className="no-print">
              <span style={{ fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#64748b', fontWeight: '700' }}>
                Official Guest Folio & Settlement Record
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => window.print()}
                  style={{
                    background: '#070b14',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12.5px',
                    fontWeight: '600'
                  }}
                >
                  <Printer size={15} /> Print / Save PDF
                </button>
                <button 
                  onClick={() => setInvoiceModalOpen(false)}
                  style={{ background: '#f1f5f9', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <X size={16} color="#070b14" />
                </button>
              </div>
            </div>

            {/* Brand Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #070b14', paddingBottom: '20px', marginBottom: '26px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: '800', color: '#070b14', letterSpacing: '1px' }}>
                    LUXURYSTAY
                  </span>
                  <span style={{ fontSize: '10px', background: '#070b14', color: '#d4af37', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                    5-STAR
                  </span>
                </div>
                <p style={{ fontSize: '11.5px', color: '#64748b', lineHeight: '1.6', margin: 0 }}>
                  Downtown Luxury Boulevard, Metropolis<br />
                  Central Hotel Tax Registration: STRN-9842104-HMS
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#aa7c11', fontFamily: 'monospace' }}>
                  {selectedBill.invoiceNumber}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  Date: {new Date(selectedBill.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Resident & Stay Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '26px', fontSize: '12.5px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: '700', color: '#070b14', textTransform: 'uppercase', letterSpacing: '0.8px', fontSize: '11px', marginBottom: '6px' }}>
                  Billed To Resident:
                </div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#070b14' }}>{selectedBill.guest?.fullName}</div>
                <div style={{ color: '#64748b', marginTop: '2px' }}>{selectedBill.guest?.phone}</div>
                <div style={{ color: '#64748b' }}>{selectedBill.guest?.email}</div>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: '700', color: '#070b14', textTransform: 'uppercase', letterSpacing: '0.8px', fontSize: '11px', marginBottom: '6px' }}>
                  Stay & Room Specification:
                </div>
                <div>Assigned: <strong>Suite #{selectedBill.reservation?.room?.roomNumber}</strong></div>
                <div>Category: <strong>{selectedBill.reservation?.room?.roomType}</strong></div>
                <div>Settlement Method: <strong>{selectedBill.paymentMethod || 'Credit Card On File'}</strong></div>
              </div>
            </div>

            {/* Charges Breakdown Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#070b14', color: '#ffffff', textAlign: 'left' }}>
                  <th style={{ padding: '10px 14px' }}>Itemized Description</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Charges ($ USD)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px 14px' }}>
                    Accommodations Nightly Tariff ({selectedBill.reservation?.room?.roomType})
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '700' }}>
                    ${selectedBill.roomCharges?.toFixed(2)}
                  </td>
                </tr>

                {selectedBill.additionalServices?.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>
                      {item.serviceName}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '700' }}>
                      ${item.amount?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Section */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
              <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Subtotal Amount:</span>
                  <span style={{ fontWeight: '600' }}>${selectedBill.subtotal?.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Luxury Hospitality Tax (13%):</span>
                  <span style={{ fontWeight: '600' }}>${selectedBill.taxAmount?.toFixed(2)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: '800',
                  fontSize: '18px',
                  borderTop: '2px solid #070b14',
                  paddingTop: '10px',
                  color: '#070b14'
                }}>
                  <span>Settlement Total:</span>
                  <span style={{ color: '#aa7c11' }}>${selectedBill.totalAmount?.toFixed(2)}</span>
                </div>

                <div style={{ textAlign: 'right', marginTop: '6px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '800',
                    letterSpacing: '0.8px',
                    background: selectedBill.paymentStatus === 'Paid' ? '#dcfce7' : '#fef3c7',
                    color: selectedBill.paymentStatus === 'Paid' ? '#166534' : '#92400e'
                  }}>
                    STATUS: {selectedBill.paymentStatus.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Official Settlement Stamp & Footer */}
            <div style={{
              borderTop: '1px solid #e2e8f0',
              paddingTop: '16px',
              textAlign: 'center',
              fontSize: '11px',
              color: '#94a3b8'
            }}>
              Official settlement record. Issued digitally under LuxuryStay Hospitality Central Financial Gateway.
            </div>

          </div>
        </div>
      )}

      {/* Global CSS for Print Optimization */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-invoice-sheet, .printable-invoice-sheet * {
            visibility: visible;
          }
          .printable-invoice-sheet {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            padding: 20px !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

    </div>
  );
};

const thStyle = {
  padding: '14px 18px',
  fontWeight: '600',
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.8px'
};

const tdStyle = {
  padding: '14px 18px'
};

const kpiCardStyle = {
  background: '#0d1527',
  border: '1px solid rgba(212, 175, 55, 0.22)',
  borderRadius: '16px',
  padding: '20px',
  boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.7)'
};

const modalBackdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.85)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '20px'
};

const fieldLabelStyle = {
  fontSize: '11.5px',
  color: '#cbd5e1',
  display: 'block',
  marginBottom: '5px'
};

const fieldInputStyle = {
  width: '100%',
  background: 'rgba(7, 11, 20, 0.85)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  padding: '10px 12px',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box'
};

export default BillingInvoices;