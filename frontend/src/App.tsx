
import { useEffect, useMemo, useState } from 'react'
import {
  createOrder,
  getProducts,
  type Product,
  type OrderResponse,
} from './services/api'

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<Record<number, number>>({})
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<OrderResponse | null>(null)

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError('Could not load products. Check the backend.'))
      .finally(() => setLoading(false))
  }, [])

  const categories = useMemo(
    () => ['All', ...new Set(products.map((product) => product.category))],
    [products]
  )

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesCategory =
      category === 'All' || product.category === category

    return matchesSearch && matchesCategory
  })

  const cartItems = products.filter((product) => cart[product.id] > 0)

  const cartCount = Object.values(cart).reduce(
    (total, quantity) => total + quantity,
    0
  )

  const totalAmount = cartItems.reduce(
    (total, product) => total + product.price * cart[product.id],
    0
  )

  const addToCart = (productId: number) => {
    setCart((previous) => ({
      ...previous,
      [productId]: (previous[productId] || 0) + 1,
    }))
    setSuccess(null)
    setError('')
  }

  const updateQuantity = (productId: number, change: number) => {
    setCart((previous) => {
      const newQuantity = (previous[productId] || 0) + change
      const updated = { ...previous }

      if (newQuantity <= 0) {
        delete updated[productId]
      } else {
        updated[productId] = newQuantity
      }

      return updated
    })
  }

  const placeOrder = async () => {
    setError('')
    setSuccess(null)

    if (!customerName.trim() || !customerEmail.trim()) {
      setError('Please enter your name and email.')
      return
    }

    if (cartCount === 0) {
      setError('Your shopping cart is empty.')
      return
    }

    setPlacingOrder(true)

    try {
      const result = await createOrder({
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        items: cartItems.map((product) => ({
          product_id: product.id,
          quantity: cart[product.id],
        })),
      })

      setSuccess(result)
      setCart({})
      setCustomerName('')
      setCustomerEmail('')
    } catch (err) {
      console.error('Checkout error:', err)
      setError('Order failed. Please check your details and try again.')
    } finally {
      setPlacingOrder(false)
    }
  }

  const formatPrice = (price: number) =>
    `₹${price.toLocaleString('en-IN')}`

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#" className="text-2xl font-black tracking-tight text-indigo-700">
            CloudCart
          </a>

          <a href="#cart" className="rounded-full bg-indigo-600 px-5 py-2 font-semibold text-white hover:bg-indigo-700">
            Cart ({cartCount})
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10">
        <section className="mb-12 rounded-3xl bg-gradient-to-r from-indigo-700 to-blue-500 px-8 py-14 text-white">
          <p className="mb-3 font-semibold uppercase tracking-widest text-indigo-100">
            Welcome to CloudCart
          </p>
          <h1 className="mb-4 text-4xl font-black md:text-5xl">
            Shop smarter. Live better.
          </h1>
          <p className="max-w-xl text-lg text-indigo-100">
            Discover quality products at great prices with a simple and secure checkout experience.
          </p>
          <a href="#products" className="mt-7 inline-block rounded-xl bg-white px-6 py-3 font-bold text-indigo-700 hover:bg-indigo-50">
            Explore Products
          </a>
        </section>

        <section id="products" className="mb-14">
          <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-semibold text-indigo-600">OUR COLLECTION</p>
              <h2 className="text-3xl font-black">Featured Products</h2>
            </div>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 md:max-w-sm"
            />
          </div>

          <div className="mb-7 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full px-5 py-2 font-semibold ${
                  category === item
                    ? 'bg-indigo-600 text-white'
                    : 'border bg-white text-slate-700 hover:border-indigo-500'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {loading && <p className="py-10 text-center">Loading products...</p>}

          {error && !success && (
            <p className="mb-5 rounded-xl bg-red-50 p-4 text-red-700">
              {error}
            </p>
          )}

          {!loading && filteredProducts.length === 0 && (
            <p className="py-10 text-center text-slate-500">
              No products found.
            </p>
          )}

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-56 overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  <p className="mb-2 text-sm font-semibold text-indigo-600">
                    {product.category}
                  </p>
                  <h3 className="mb-2 min-h-12 font-bold">
                    {product.name}
                  </h3>

                  <p className="mb-3 text-amber-500">
                    ★ {product.rating}
                  </p>

                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-xl font-black">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(product.oldPrice)}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(product.id)}
                    className="w-full rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700"
                  >
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="cart" className="grid gap-8 lg:grid-cols-5">
          <div className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-3">
            <h2 className="mb-6 text-2xl font-black">Shopping Cart</h2>

            {cartItems.length === 0 ? (
              <p className="py-8 text-center text-slate-500">
                Your cart is empty. Add some products!
              </p>
            ) : (
              <div className="space-y-5">
                {cartItems.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center"
                  >
                    <div>
                      <h3 className="font-bold">{product.name}</h3>
                      <p className="text-sm text-slate-500">
                        {formatPrice(product.price)} each
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => updateQuantity(product.id, -1)}
                        className="h-9 w-9 rounded-lg border font-bold"
                      >
                        −
                      </button>

                      <span className="font-bold">
                        {cart[product.id]}
                      </span>

                      <button
                        onClick={() => updateQuantity(product.id, 1)}
                        className="h-9 w-9 rounded-lg border font-bold"
                      >
                        +
                      </button>

                      <span className="min-w-24 text-right font-bold">
                        {formatPrice(product.price * cart[product.id])}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-between text-xl font-black">
              <span>Total</span>
              <span>{formatPrice(totalAmount)}</span>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="mb-2 text-2xl font-black">Checkout</h2>
            <p className="mb-6 text-sm text-slate-500">
              Enter your details to place your order.
            </p>

            <form
              onSubmit={(event) => {
                event.preventDefault()
                void placeOrder()
              }}
              className="space-y-4"
            >
              <div>
                <label className="mb-2 block font-semibold">
                  Customer Name
                </label>
                <input
                  type="text"
                  required
                  minLength={2}
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(event) => setCustomerEmail(event.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={placingOrder || cartCount === 0}
                className="w-full rounded-xl bg-indigo-600 py-4 font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {placingOrder ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>

            {error && (
              <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            {success && (
              <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
                <h3 className="font-bold">Order placed successfully!</h3>
                <p className="mt-2">Order ID: #{success.order_id}</p>
                <p>Total: {formatPrice(success.total_amount)}</p>
                <p>Status: {success.status}</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="mt-16 bg-slate-950 px-5 py-8 text-center text-slate-300">
        <p className="text-xl font-bold text-white">CloudCart</p>
        <p className="mt-2 text-sm">
          AWS Full Stack E-Commerce Project | Built with React and FastAPI
        </p>
      </footer>
    </div>
  )
}

export default App
