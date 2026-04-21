const productsContainer = document.getElementById('products')
const categoryButtons = document.getElementById('categoryButtons')
const sortToggle = document.getElementById('sortToggle')
const sortPanel = document.getElementById('sortPanel')
const sortOptions = document.querySelectorAll('.sort-option')

let selectedCategory = ''
let selectedSort = ''

const allProducts = window.PRODUCTS

const categories = [
    { category_id: 1, title: 'Fruktjuicer' },
    { category_id: 2, title: 'Gröna' },
    { category_id: 3, title: 'Tropiska' },
    { category_id: 4, title: 'Bär' }
]

// SORT UI
sortToggle?.addEventListener('click', (e) => {
    e.stopPropagation()
    sortPanel.classList.toggle('hidden')
})

document.addEventListener('click', (e) => {
    if (!e.target.closest('.sort-wrapper')) {
        sortPanel.classList.add('hidden')
    }
})

sortOptions.forEach((btn) => {
    btn.addEventListener('click', () => {
        selectedSort = btn.dataset.sort
        sortOptions.forEach((b) => b.classList.remove('active'))
        btn.classList.add('active')
        sortPanel.classList.add('hidden')
        filterAndRender()
    })
})

// KATEGORIER
function loadCategories() {
    categoryButtons.innerHTML = ''

    const allBtn = document.createElement('button')
    allBtn.className = 'category-btn active'
    allBtn.textContent = 'Alla'
    allBtn.onclick = () => {
        selectedCategory = ''
        updateActive(allBtn)
        filterAndRender()
    }
    categoryButtons.appendChild(allBtn)

    categories.forEach((c) => {
        const btn = document.createElement('button')
        btn.className = 'category-btn'
        btn.textContent = c.title

        btn.onclick = () => {
            selectedCategory = String(c.category_id)
            updateActive(btn)
            filterAndRender()
        }

        categoryButtons.appendChild(btn)
    })
}

function updateActive(active) {
    document
        .querySelectorAll('.category-btn')
        .forEach((b) => b.classList.remove('active'))
    active.classList.add('active')
}

// FILTER + SORT
function filterAndRender() {
    let filtered = [...allProducts]

    if (selectedCategory) {
        filtered = filtered.filter(
            (p) => String(p.category.category_id) === String(selectedCategory)
        )
    }

    switch (selectedSort) {
        case 'price-asc':
            filtered.sort((a, b) => a.price - b.price)
            break
        case 'price-desc':
            filtered.sort((a, b) => b.price - a.price)
            break
        case 'title-asc':
            filtered.sort((a, b) => a.title.localeCompare(b.title))
            break
        case 'title-desc':
            filtered.sort((a, b) => b.title.localeCompare(a.title))
            break
        case 'rating-desc':
            filtered.sort((a, b) => b.rating - a.rating)
            break
        case 'rating-asc':
            filtered.sort((a, b) => a.rating - b.rating)
            break
    }

    render(filtered)
}

// RENDER
function render(products) {
    productsContainer.innerHTML = ''

    products.forEach((p) => {
        const div = document.createElement('article')
        div.className = 'product'

        div.onclick = () => {
            window.location.href = `/pages/product-spec.html?id=${p.product_id}`
        }

        div.innerHTML = `
            <img src="${p.image}" alt="${p.title}" loading="lazy" width="1024" height="1024">
            <div class="product-content">
            <div class="rating">
            ${renderStars(p.rating)} (${p.rating}/5)
        </div>
                <h2>${p.title}</h2>
                <p>${p.info}</p>
                <div class="price">${p.price} kr
                <button class="add-to-cart-mini" type="button">
                        <i class="bi bi-cart-plus"></i>
                    </button>
                </div>
            </div>
        `

        div.querySelector('.add-to-cart-mini').addEventListener('click', (e) => {
            e.stopPropagation()
            addToCart(p, 1)
        })

        productsContainer.appendChild(div)
    })
}

function renderStars(rating) {
    let stars = ''

    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '★' : '☆'
    }

    return `<span class="stars">${stars}</span>`
}

loadCategories()
filterAndRender()
