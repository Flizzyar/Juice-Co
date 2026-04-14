// Hämtar JWT-token från localStorage
export function getToken() {
    return localStorage.getItem('token')
}

// Hämtar användar-ID från localStorage
export function getUserId() {
    return localStorage.getItem('userId')
}

// Hämtar användarens namn från localStorage
export function getName() {
    return localStorage.getItem('name')
}

// Kontrollerar om användaren är inloggad
export function isLoggedIn() {
    return !!getToken()
}

// Kräver att användaren är inloggad, annars redirect till login-sida
export function requireAuth(redirectUrl = '/pages/login.html') {
    if (!isLoggedIn()) {
        alert('Du måste logga in först') // Meddelande till användaren
        window.location.href = redirectUrl // Skicka till login
        return false
    }
    return true
}
