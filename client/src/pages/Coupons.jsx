import { useState } from 'react'
import api from '../utils/api'
import './Coupons.css'

function Coupons() {
  const [code, setCode] = useState('')
  const [amount, setAmount] = useState('100')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)

  // Check if a coupon is already applied
  const appliedCoupon = JSON.parse(localStorage.getItem('appliedCoupon') || 'null')

  const showToast = (msg, type) => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  const applyCoupon = async () => {
    try {
      // VULN #1 — BRUTE FORCE / NO RATE LIMITING
      const response = await api.get(`/api/coupons/apply?code=${code}&amount=${amount}`)
      setResult(response.data)
      setError('')

      // Save the applied coupon to localStorage so Cart/Checkout can read it
      // response.data should have discount info — we save code + discount percentage
      const couponData = {
        code: code.toUpperCase(),
        discount: response.data.discount || response.data.discountPercent || 10,
        savedAt: new Date().toISOString()
      }
      localStorage.setItem('appliedCoupon', JSON.stringify(couponData))

      showToast(`${couponData.code} applied! ${couponData.discount}% off your order`, 'success')

    } catch (err) {
      setError(err.response?.data?.error || 'Invalid coupon')
      setResult(null)
      showToast('Invalid coupon code', 'error')
    }
  }

  const removeCoupon = () => {
    localStorage.removeItem('appliedCoupon')
    setCode('')
    setResult(null)
    showToast('Coupon removed', 'error')
    // force re-render
    window.location.reload()
  }

  const listCoupons = async () => {
    try {
      // VULN #2 — INFORMATION DISCLOSURE
      const response = await api.get('/api/coupons/list')
      setResult(response.data)
      setError('')
    } catch (err) {
      setError('Failed to list coupons')
    }
  }

  return (
    <div className="coupons-page">
      <div className="container">

        <div className="coupons-header">
          <h1>Coupons & Discounts</h1>
          <p>Apply a discount code to your order</p>
        </div>

        {/* ── ALREADY APPLIED BANNER ── */}
        {appliedCoupon && (
          <div className="coupon-applied-banner">
            <div>
              <span className="coupon-applied-label">Active Coupon</span>
              <span className="coupon-applied-code">{appliedCoupon.code}</span>
              <span className="coupon-applied-discount">— {appliedCoupon.discount}% off applied to your cart</span>
            </div>
            <button onClick={removeCoupon} className="coupon-remove-btn">Remove</button>
          </div>
        )}

        <div className="coupons-layout">

          {/* ── FORM CARD ── */}
          <div className="coupon-card">
            <h2>Apply Coupon</h2>

            <div className="form-group">
              <label>Coupon Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter coupon code"
              />
            </div>

            <div className="form-group">
              <label>Purchase Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
              />
            </div>

            <div>
              <button onClick={applyCoupon} className="btn-apply">Apply Coupon</button>
              <button onClick={listCoupons} className="btn-list">List All Coupons</button>
            </div>

            {error && <div className="coupon-error">{error}</div>}

            {/* VULN #2 continued — raw JSON exposes all coupon data */}
            {result && (
              <div className="coupon-result">
                <h3>Response</h3>
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* ── INFO PANEL ── */}
          <div className="coupon-info-panel">
            <h3>Current Offer</h3>
            <div className="info-row">
              <span>Code</span>
              <span>GLOW10</span>
            </div>
            <div className="info-row">
              <span>Discount</span>
              <span>10% Off</span>
            </div>
            <div className="info-row">
              <span>Valid Until</span>
              <span>28 March 2026</span>
            </div>
            <div className="info-row">
              <span>Min. Purchase</span>
              <span>$50.00</span>
            </div>
            <p className="info-note">
              Apply the code at checkout. One coupon per order. Terms and conditions apply.
            </p>
          </div>

        </div>
      </div>

      {/* ── TOAST ── */}
      {toast && (
        <div className={`coupon-toast ${toast.type === 'error' ? 'coupon-toast--error' : ''}`}>
          <span className="cart-toast-icon">{toast.type === 'error' ? '✕' : '✓'}</span>
          <div>
            <p className="cart-toast-title">{toast.type === 'error' ? 'Oops' : 'Coupon Applied'}</p>
            <p className="cart-toast-sub">{toast.msg}</p>
          </div>
        </div>
      )}

    </div>
  )
}

export default Coupons