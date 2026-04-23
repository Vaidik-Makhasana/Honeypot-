import { useState, useEffect } from 'react'
import './Home.css'

const slides = [
  {
    image: '/images/beautyBanner.jpg',
    eyebrow: 'HoneyGlow Beauty',
    heading: 'Get',
    highlight: 'Glowing',
    subheading: 'This Season',
    sub: 'Indulge in luxurious skincare crafted for every complexion. Pamper your skin with the care it deserves.',
    discount: '10%',
    code: 'GLOW10',
  },
  {
    image: '/images/BeautyBanner2.jpg',
    eyebrow: 'New Arrivals',
    heading: 'Feel',
    highlight: 'Radiant',
    subheading: 'Every Day',
    sub: 'Explore our newest collection of premium beauty products curated just for you.',
    discount: '15%',
    code: 'GLOW15',
  },
  {
    image: '/images/BeautyBanner3.jpg',
    eyebrow: 'Limited Offer',
    heading: 'Luxury',
    highlight: 'Skincare',
    subheading: 'For Less',
    sub: 'For a limited time, enjoy exclusive deals on our most-loved skincare essentials.',
    discount: '20%',
    code: 'GLOW20',
  },
]

function Home() {
  const [current, setCurrent] = useState(0)
  const [toast, setToast] = useState(null)
  const [fading, setFading] = useState(false)

  const products = [
    { id: 1, name: 'Glowing Serum', price: 49.99, image: '/images/Serum.jpg', tag: 'Bestseller' },
    { id: 2, name: 'Hydrating Mask', price: 29.99, image: '/images/Mask.jpg', tag: 'Skin Care' },
    { id: 3, name: 'Luxury Lipstick', price: 24.99, image: '/images/lipsticks.jpg', tag: 'Colour' },
    { id: 4, name: 'Mascara UpSwing', price: 19.99, image: '/images/Mascara.jpg', tag: 'Eyes' },
    { id: 5, name: 'Anti-Aging Cream', price: 79.99, image: '/images/Anti Cream.jpg', tag: 'Premium' },
  ]

  // Auto advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [current])

  const goTo = (index) => {
    setFading(true)
    setTimeout(() => {
      setCurrent(index)
      setFading(false)
    }, 400)
  }

  const showToast = (name, type) => {
    setToast({ name, type })
    setTimeout(() => setToast(null), 2500)
  }

  const addToCart = (product) => {
    const existing = JSON.parse(localStorage.getItem('cart') || '[]')
    const found = existing.find(item => item.id === product.id)
    if (found) {
      found.quantity += 1
      showToast(product.name, 'updated')
    } else {
      existing.push({ ...product, quantity: 1 })
      showToast(product.name, 'added')
    }
    localStorage.setItem('cart', JSON.stringify(existing))
  }

  const slide = slides[current]

  return (
    <div className="home">

      {/* ── HERO CAROUSEL ── */}
      <div className="hero" style={{ backgroundImage: `url('${slide.image}')` }}>
        <div className="hero-bg" />

        <div className={`hero-content ${fading ? 'hero-content--fading' : ''}`}>
          <p className="hero-eyebrow">{slide.eyebrow}</p>
          <h1>
            {slide.heading} <span>{slide.highlight}</span><br />{slide.subheading}
          </h1>
          <p>{slide.sub}</p>
          <button className="btn-hero">Shop Collection</button>
        </div>

        {/* Discount badge changes with each slide */}
        <div className={`hero-badge ${fading ? 'hero-content--fading' : ''}`}>
          <p className="discount-label">Flat</p>
          <div className="discount">{slide.discount}</div>
          <p style={{ fontSize: '11px', letterSpacing: '1px', marginTop: '8px', color: 'rgba(250,245,239,0.6)' }}>
            Use Code
          </p>
          <span className="code-tag">{slide.code}</span>
        </div>

        {/* ── DOTS ONLY — no arrows ── */}
        <div className="carousel-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot ${i === current ? 'carousel-dot--active' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>

      {/* ── PRODUCTS ── */}
      <div className="products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Products</h2>
            <span className="section-subtitle">{products.length} items</span>
          </div>

          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="product-card-body">
                  <p className="product-tag">{product.tag}</p>
                  <h3>{product.name}</h3>
                  <p className="price">${product.price.toFixed(2)}</p>
                  <button className="btn-cart" onClick={() => addToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TOAST NOTIFICATION ── */}
      {toast && (
        <div className={`cart-toast ${toast.type === 'updated' ? 'cart-toast--updated' : ''}`}>
          <span className="cart-toast-icon">{toast.type === 'updated' ? '↑' : '✓'}</span>
          <div>
            <p className="cart-toast-title">
              {toast.type === 'updated' ? 'Already in Cart! Qty Updated' : 'Added to Cart'}
            </p>
            <p className="cart-toast-sub">{toast.name}</p>
          </div>
        </div>
      )}

    </div>
  )
}

export default Home