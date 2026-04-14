const productDetail = document.getElementById('productDetail')
const reviewsContainer = document.getElementById('reviewsContainer')

const productId = Number(new URLSearchParams(window.location.search).get('id'))

document.getElementById('backButton')?.addEventListener('click', () => {
    window.location.href = './products.html'
})

const products = window.PRODUCTS || []

document.addEventListener('DOMContentLoaded', () => {
    const product = products.find((p) => Number(p.product_id) === productId)

    if (!product) {
        productDetail.innerHTML = '<p>Ingen produkt hittades.</p>'
        return
    }

    renderProduct(product)
    renderReviews(product)

    document.getElementById('submitReview')?.addEventListener('click', () => {
        const token = localStorage.getItem('token')
        if (!token) return
        const rating = parseInt(document.getElementById('rating').value, 10)
        const comment = document.getElementById('comment').value.trim()
        if (!comment) return

        const userId = localStorage.getItem('userId')
        const allReviews = JSON.parse(localStorage.getItem('all_reviews')) || []
        allReviews.push({
            _id: String(Date.now()),
            userId,
            productId: String(product.product_id),
            rating,
            comment,
            createdAt: new Date().toISOString()
        })
        localStorage.setItem('all_reviews', JSON.stringify(allReviews))
        document.getElementById('comment').value = ''
        renderReviews(product)
    })
})

function renderProduct(product) {
    const inStock = product.in_stock !== false

    productDetail.innerHTML = `
        <div class="product-detail-card">

            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.title}">
            </div>

            <div class="product-detail-info">

                <div class="rating">
                    ${renderStars(product.rating || 0)}
                    (${product.rating || 0}/5)
                </div>

                <h1>${product.title}</h1>

                <p class="category">
                    Kategori: ${product.category?.title || 'Okänd'}
                </p>

                <p class="description">
                    ${product.info || 'Ingen beskrivning'}
                </p>

                <div class="price">
                    ${Number(product.price).toFixed(2)} kr
                </div>

                <div class="stock-status">
                    <strong>Lagersaldo:</strong>
                    <span>
                        ${inStock ? 'I lager' : 'Slut i lager'}
                    </span>
                </div>

                <div class="cart-controls">

                    <div class="quantity-selector">
                        <button id="decreaseQty">−</button>
                        <span id="quantity">1</span>
                        <button id="increaseQty">+</button>
                    </div>

                    <button id="addToCartBtn" class="add-to-cart-btn"
                        ${!inStock ? 'disabled' : ''}>
                        ${inStock ? 'Lägg i kundvagn' : 'Slut i lager'}
                    </button>

                </div>

            </div>
        </div>
    `

    setupActions(product, inStock)
}

function setupActions(product, inStock) {
    let qty = 1

    document.getElementById('increaseQty')?.addEventListener('click', () => {
        qty++
        document.getElementById('quantity').textContent = qty
    })

    document.getElementById('decreaseQty')?.addEventListener('click', () => {
        if (qty > 1) {
            qty--
            document.getElementById('quantity').textContent = qty
        }
    })

    document.getElementById('addToCartBtn')?.addEventListener('click', () => {
        if (!inStock) return
        addToCart(product, qty)
    })
}

function renderReviews(product) {
    if (!reviewsContainer) return

    const allReviews = JSON.parse(localStorage.getItem('all_reviews')) || []
    const reviews = allReviews.filter(
        (r) => String(r.productId) === String(product.product_id)
    )
    const token = localStorage.getItem('token')
    const reviewFormContainer = document.getElementById('reviewFormContainer')

    if (reviews.length === 0) {
        reviewsContainer.innerHTML = '<p>Inga recensioner ännu.</p>'
    } else {
        reviewsContainer.innerHTML = reviews
            .map(
                (r) => `
            <div class="review-item">
                <div>${renderStars(r.rating)}</div>
                <p>${r.comment}</p>
                <small>${new Date(r.createdAt).toLocaleDateString()}</small>
            </div>
        `
            )
            .join('')
    }

    if (reviewFormContainer) {
        reviewFormContainer.style.display = token ? '' : 'none'
        const existingMsg = document.getElementById('review-login-msg')
        if (!token && !existingMsg) {
            const msg = document.createElement('p')
            msg.id = 'review-login-msg'
            msg.innerHTML =
                '<a href="/pages/login.html">Logga in</a> för att lämna en recension.'
            reviewFormContainer.insertAdjacentElement('afterend', msg)
        } else if (token && existingMsg) {
            existingMsg.remove()
        }
    }
}

function renderStars(rating) {
    let stars = ''
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '★' : '☆'
    }
    return `<span class="stars">${stars}</span>`
}
