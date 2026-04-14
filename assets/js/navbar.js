
// ===============================
// NAVBAR: USE GLOBAL PRODUCT DATA
// ===============================
function loadNavbarProducts() {
    const list = document.getElementById('navbar-products-list')
    if (!list) return

    const products = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : []

    list.innerHTML = ''

    products.slice(0, 6).forEach(product => {
        const col = document.createElement('div')
        col.className = 'col-sm-6 col-lg'

        col.innerHTML = `
            <a href="/pages/product-spec.html?id=${product.product_id}" class="mega-product-card">
                <img src="${product.image}" alt="${product.title}" class="mega-product-img" />
                <div class="mega-product-body">
                    <h6 class="mb-1">${product.title}</h6>
                    <p class="small mb-0">${product.info}</p>
                </div>
            </a>
        `

        list.appendChild(col)
    })
}

// ===============================
// ACCOUNT UI (FRONTEND ONLY)
// ===============================
function setupAccountUI() {
    const accountMainLink = document.getElementById('account-main-link')
    const registerRow = document.getElementById('register-row')
    const logoutBtn = document.getElementById('logout-btn')
    const ordersLink = document.getElementById('orders-link')
    const reviewsLink = document.getElementById('reviews-link')

    const token = localStorage.getItem('token')
    const name = localStorage.getItem('name')

    if (token) {
        if (accountMainLink) {
            accountMainLink.textContent = name || 'Min sida'
            accountMainLink.href = '/pages/member.html'
        }
        registerRow?.classList.add('d-none')
        logoutBtn?.classList.remove('d-none')
        if (ordersLink) ordersLink.href = '/pages/member.html'
        if (reviewsLink) reviewsLink.href = '/pages/member.html'
    } else {
        if (accountMainLink) {
            accountMainLink.textContent = 'Logga in'
            accountMainLink.href = '/pages/login.html'
        }
        registerRow?.classList.remove('d-none')
        logoutBtn?.classList.add('d-none')
        if (ordersLink) ordersLink.href = '/pages/login.html'
        if (reviewsLink) reviewsLink.href = '/pages/login.html'
    }

    logoutBtn?.addEventListener('click', (e) => {
        e.preventDefault()
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('name')
        localStorage.removeItem('role')
        window.location.href = '/'
    })
}

// ===============================
// DROPDOWN FIX (Bootstrap UX)
// ===============================
function setupDropdownFix() {
    document.querySelectorAll('#accountDropdown, #cartDropdown')
        .forEach(btn => {
            btn.addEventListener('hidden.bs.dropdown', () => {
                btn.blur()
            })
        })
}

// ===============================
// INIT NAVBAR
// ===============================
document.addEventListener('componentsLoaded', () => {
    loadNavbarProducts()
    setupAccountUI()
    setupDropdownFix()
})
