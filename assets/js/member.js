const memberName = document.getElementById('member-name')
const reviewsContainer = document.getElementById('member-reviews')
const ordersContainer = document.getElementById('member-orders')

function getToken() {
    return localStorage.getItem('token')
}

function requireAuth() {
    if (!getToken()) {
        window.location.href = '/pages/login.html'
        return false
    }
    return true
}

function loadMemberPage() {
    if (!requireAuth()) return

    const userId = localStorage.getItem('userId')
    const name = localStorage.getItem('name')

    if (!userId) {
        localStorage.clear()
        window.location.href = '/pages/login.html'
        return
    }

    memberName.textContent = name || 'Medlem'
    loadUserReviews(userId)
    loadUserOrders(userId)
}

function setupLogout() {
    const logoutBtn = document.getElementById('member-logout-btn')
    if (!logoutBtn) return

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('name')
        localStorage.removeItem('role')
        window.location.href = '/pages/login.html'
    })
}

function loadUserReviews(userId) {
    const allReviews = JSON.parse(localStorage.getItem('all_reviews')) || []
    const reviews = allReviews.filter((r) => r.userId === userId)
    renderUserReviews(reviews)
}

function renderUserReviews(reviews) {
    if (!reviews.length) {
        reviewsContainer.innerHTML = '<p>Inga recensioner ännu</p>'
        return
    }

    const products = window.PRODUCTS || []
    const map = {}
    products.forEach((p) => (map[p.product_id] = p))

    reviewsContainer.innerHTML = reviews
        .map(
            (r) => `
        <div class="review-card" data-review-id="${r._id}">
            <div class="review-header">
                <span class="stars">${renderStars(r.rating)}</span>
                <span>${map[r.productId]?.title || 'Produkt okänd'}</span>
            </div>

            <p class="review-text">${r.comment}</p>

            <div class="edit-mode" style="display:none;">
                <textarea class="edit-comment">${r.comment}</textarea>

                <select class="edit-rating">
                    ${[1, 2, 3, 4, 5]
                        .map(
                            (n) =>
                                `<option value="${n}" ${n === r.rating ? 'selected' : ''}>${n}</option>`
                        )
                        .join('')}
                </select>

                <button class="save-review-btn">Spara</button>
            </div>

            <small>${new Date(r.createdAt).toLocaleDateString()}</small>

            <div class="review-actions">
                <button class="edit-review-btn">Redigera</button>
                <button class="delete-review-btn">Ta bort</button>
            </div>
        </div>
    `
        )
        .join('')

    setupReviewActions()
}

function setupReviewActions() {
    document.querySelectorAll('.edit-review-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.review-card')
            card.querySelector('.review-text').style.display = 'none'
            card.querySelector('.edit-mode').style.display = 'block'
        })
    })

    document.querySelectorAll('.save-review-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.review-card')
            const reviewId = card.dataset.reviewId
            const newComment = card.querySelector('.edit-comment').value
            const newRating = parseInt(card.querySelector('.edit-rating').value, 10)

            const allReviews = JSON.parse(localStorage.getItem('all_reviews')) || []
            const review = allReviews.find((r) => r._id === reviewId)
            if (review) {
                review.comment = newComment
                review.rating = newRating
                localStorage.setItem('all_reviews', JSON.stringify(allReviews))
            }

            card.querySelector('.review-text').textContent = newComment
            card.querySelector('.stars').innerHTML = renderStars(newRating)
            card.querySelector('.review-text').style.display = 'block'
            card.querySelector('.edit-mode').style.display = 'none'
        })
    })

    document.querySelectorAll('.delete-review-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.review-card')
            const reviewId = card.dataset.reviewId

            let allReviews = JSON.parse(localStorage.getItem('all_reviews')) || []
            allReviews = allReviews.filter((r) => r._id !== reviewId)
            localStorage.setItem('all_reviews', JSON.stringify(allReviews))

            card.remove()
        })
    })
}

function loadUserOrders(userId) {
    const orders = JSON.parse(localStorage.getItem(`orders_${userId}`)) || []
    renderUserOrders(orders)
}

function renderUserOrders(orders) {
    if (!orders.length) {
        ordersContainer.innerHTML = '<p>Inga beställningar ännu</p>'
        return
    }

    ordersContainer.innerHTML = orders
        .map(
            (order) => `
        <div class="order-card">
            <span>Order #${order.order_id}</span>
            <div>${order.total_price?.toFixed ? order.total_price.toFixed(2) : order.total_price} kr</div>
        </div>
    `
        )
        .join('')
}

function renderStars(rating) {
    let stars = ''
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '★' : '☆'
    }
    return stars
}

document.addEventListener('componentsLoaded', () => {
    setupLogout()
    loadMemberPage()
})
