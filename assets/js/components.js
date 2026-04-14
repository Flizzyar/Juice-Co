// Laddar en HTML-komponent och placerar den i rätt element
async function loadComponent(id, file) {
    const element = document.getElementById(id)
    if (!element) return

    const response = await fetch(file)
    if (!response.ok) {
        throw new Error(`Kunde inte ladda ${file}`)
    }

    element.innerHTML = await response.text()
}

// Initierar komponenterna (header och footer)
async function initComponents() {
    // Avgör rätt sökväg beroende på sida
    const basePath = window.location.pathname.includes('/pages/') ? '../' : './'

    // Ladda header och footer
    await loadComponent('header', `${basePath}components/header.html`)
    await loadComponent('footer', `${basePath}components/footer.html`)

    // Skicka event när komponenterna är färdiga
    document.dispatchEvent(new CustomEvent('componentsLoaded'))
}

// Uppdaterar navbar baserat på om användaren är inloggad
async function updateNavbar() {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    const name = localStorage.getItem('name')
    const isLoggedIn = !!token && !!userId

    // Hämta element i navbaren
    const accountMainLink = document.getElementById('account-main-link')
    const registerRow = document.getElementById('register-row')
    const logoutBtn = document.getElementById('logout-btn')
    const ordersLink = document.getElementById('orders-link')
    const reviewsLink = document.getElementById('reviews-link')
    const accountDropdown = document.getElementById('accountDropdown')

    if (isLoggedIn) {
        // Visa "Min sida" och dölja registreringslänken
        if (accountMainLink) {
            accountMainLink.textContent = 'Min sida'
            accountMainLink.href = '/pages/member.html'
        }
        if (registerRow) registerRow.classList.add('d-none')
        if (logoutBtn) logoutBtn.classList.remove('d-none')
        if (ordersLink) ordersLink.href = '/pages/member.html#bestallningar'
        if (reviewsLink) reviewsLink.href = '/pages/member.html#recensioner'
        if (accountDropdown && name)
            accountDropdown.setAttribute('aria-label', `Mitt konto, ${name}`)
    } else {
        // Visa "Logga in" och visa registreringslänk
        if (accountMainLink) {
            accountMainLink.textContent = 'Logga in'
            accountMainLink.href = '/pages/login.html'
        }
        if (registerRow) registerRow.classList.remove('d-none')
        if (logoutBtn) logoutBtn.classList.add('d-none')
        if (ordersLink) ordersLink.href = '/pages/login.html'
        if (reviewsLink) reviewsLink.href = '/pages/login.html'
    }

    // Logout-knapp
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault()
            localStorage.removeItem('token')
            localStorage.removeItem('userId')
            localStorage.removeItem('name')
            localStorage.removeItem('role')
            window.location.href = '/'
        })
    }
}

// Kör updateNavbar när komponenterna är färdiga
document.addEventListener('componentsLoaded', updateNavbar)

initComponents()
