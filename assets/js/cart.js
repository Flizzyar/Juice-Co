// Hämtar kundvagnen från localStorage, returnerar array (tom om ingen)
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || []
}

// Sparar kundvagnen i localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart))
}

// Formaterar pris till sträng med 2 decimaler och kr
function formatPrice(price) {
    return `${Number(price || 0).toFixed(2)} kr`
}

// Räknar total antal produkter i kundvagnen
function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.quantity, 0)
}

// Räknar totalpris för kundvagnen
function getCartTotal() {
    return getCart().reduce(
        (sum, item) => sum + Number(item.price || 0) * item.quantity,
        0
    )
}

// Lägger till produkt i kundvagnen (eller ökar kvantitet om redan finns)
window.addToCart = function addToCart(product, quantity = 1) {
    const cart = getCart()
    const id = String(product.id ?? product.product_id)
    const existing = cart.find((item) => item.id === id)

    if (existing) {
        existing.quantity += quantity
    } else {
        cart.push({
            id,
            title: product.title,
            price: Number(product.price || 0),
            image: product.image || '/assets/media/juice-placeholder.png',
            quantity
        })
    }
    saveCart(cart)
    refreshCartUI()
    showCartToast(`${product.title} lades till i kundvagnen`)
}

// Tar bort produkt från kundvagnen
function removeFromCart(productId) {
    const id = String(productId)
    saveCart(getCart().filter((item) => item.id !== id))
    refreshCartUI()
}

// Uppdaterar kvantitet för en produkt, tar bort om 0
function updateQuantity(productId, newQuantity) {
    const id = String(productId)
    if (newQuantity <= 0) {
        removeFromCart(id)
        return
    }
    const cart = getCart()
    const item = cart.find((p) => p.id === id)
    if (!item) return
    item.quantity = newQuantity
    saveCart(cart)
    refreshCartUI()
}

// Renderar siffran på kundvagnsikonen
function renderCartBadge() {
    const badge = document.querySelector('.cart-btn-badge')
    if (!badge) return
    badge.textContent = getCartCount()
}

// Renderar dropdown-menyn för kundvagnen i navbaren
function renderNavbarCart() {
    const container = document.getElementById('cartItems')
    const totalEl = document.getElementById('cartTotal')
    if (!container || !totalEl) return

    const cart = getCart()
    if (!cart.length) {
        container.innerHTML = `<p class="mb-3">Din varukorg är tom.</p>`
        totalEl.textContent = '0 kr'
        return
    }

    container.innerHTML = cart
        .map(
            (item) => `
        <div class="cart-item d-flex align-items-start gap-3 mb-3" data-id="${item.id}">
            <img src="${item.image}" alt="${item.title}" class="cart-item-img"/>
            <div class="flex-grow-1">
                <div class="fw-semibold">${item.title}</div>
                <div class="small">${formatPrice(item.price)}</div>
                <div class="cart-controls mt-2">
                    <button class="qty-btn minus" data-id="${item.id}">−</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn plus" data-id="${item.id}">+</button>
                    <button class="remove-btn" data-id="${item.id}">Ta bort</button>
                </div>
            </div>
        </div>
    `
        )
        .join('')

    totalEl.textContent = formatPrice(getCartTotal())
}

// Renderar sidan för kundvagnen (cart.html)
function renderCartPage() {
    const itemsEl = document.getElementById('cartPageItems')
    const totalEl = document.getElementById('cartPageTotal')
    const countEl = document.getElementById('cartPageCount')
    if (!itemsEl || !totalEl || !countEl) return

    const cart = getCart()
    countEl.textContent = getCartCount()
    totalEl.textContent = formatPrice(getCartTotal())

    if (!cart.length) {
        itemsEl.innerHTML = `
            <div class="cart-empty">
                <h3>Din kundvagn är tom</h3>
                <p>Lägg till några produkter för att komma igång.</p>
                <a href="/pages/products.html" class="btn btn-dark">Visa produkter</a>
            </div>
        `
        return
    }

    itemsEl.innerHTML = cart
        .map(
            (item) => `
        <div class="cart-page-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.title}" class="cart-page-img"/>
            <div class="cart-page-info">
                <h3>${item.title}</h3>
                <div class="cart-page-price">Pris: ${formatPrice(item.price)}</div>
                <div class="cart-controls">
                    <button class="qty-btn minus" data-id="${item.id}">−</button>
                    <span class="qty-value">${item.quantity}</span>
                    <button class="qty-btn plus" data-id="${item.id}">+</button>
                    <button class="remove-btn" data-id="${item.id}">Ta bort</button>
                </div>
            </div>
            <div class="cart-page-subtotal">${formatPrice(item.price * item.quantity)}</div>
        </div>
    `
        )
        .join('')
}

// Initierar klick-events för + / - / ta bort
let cartEventsInitialized = false
function setupCartEvents() {
    if (cartEventsInitialized) return
    cartEventsInitialized = true

    document.addEventListener('click', (e) => {
        const target = e.target
        if (!(target instanceof HTMLElement)) return
        const productId = target.dataset.id
        if (!productId) return

        const cart = getCart()
        const item = cart.find((p) => p.id === productId)
        if (!item) return

        if (target.classList.contains('plus'))
            updateQuantity(productId, item.quantity + 1)
        if (target.classList.contains('minus'))
            updateQuantity(productId, item.quantity - 1)
        if (target.classList.contains('remove-btn'))
            removeFromCart(productId)
    })
}

// Uppdaterar all kundvagns-UI: badge, dropdown och sida
function refreshCartUI() {
    renderCartBadge()
    renderNavbarCart()
    renderCartPage()
}

// Visar toast-meddelande när produkt läggs till
function showCartToast(message = 'Produkten lades till i kundvagnen') {
    const toast = document.getElementById('cartToast')
    if (!toast) return
    toast.textContent = message
    toast.classList.add('show')
    setTimeout(() => toast.classList.remove('show'), 2500)
}

// Lägger order och sparar i localStorage
function placeOrder() {
    const cart = getCart()
    if (!cart.length) {
        alert('Din kundvagn är tom.')
        return
    }
    const userId = localStorage.getItem('userId')
    if (!userId) {
        localStorage.setItem('redirectAfterLogin', '/pages/cart.html')
        window.location.href = '/pages/login.html'
        return
    }
    const ordersKey = `orders_${userId}`
    const orders = JSON.parse(localStorage.getItem(ordersKey)) || []
    const orderId = orders.length + 1
    const total = getCartTotal()
    orders.push({
        order_id: orderId,
        items: cart,
        total_price: total,
        date: new Date().toISOString()
    })
    localStorage.setItem(ordersKey, JSON.stringify(orders))
    saveCart([])
    refreshCartUI()
    alert(`Order #${orderId} lagd! Totalt: ${total.toFixed(2)} kr`)
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('place-order-btn')
    const token = localStorage.getItem('token')
    if (btn) {
        if (!token) {
            btn.textContent = 'Logga in för att lägga order'
            btn.addEventListener('click', () => {
                localStorage.setItem('redirectAfterLogin', '/pages/cart.html')
                window.location.href = '/pages/login.html'
            })
        } else {
            btn.addEventListener('click', placeOrder)
        }
    }

    setupCartEvents()
    refreshCartUI()
})
document.addEventListener('componentsLoaded', () => {
    setupCartEvents()
    refreshCartUI()
})
