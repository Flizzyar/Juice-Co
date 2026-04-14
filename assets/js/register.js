const form = document.getElementById('register-form')

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const name = document.getElementById('name').value.trim()
    const email = document.getElementById('email').value.trim()
    const confirmEmail = document.getElementById('confirm-email').value.trim()
    const password = document.getElementById('password').value
    const confirmPassword = document.getElementById('confirm-password').value

    const errorBox = document.getElementById('register-error')
    if (errorBox) {
        errorBox.textContent = ''
        errorBox.style.color = '#111'
    }

    try {
        if (email !== confirmEmail) {
            throw new Error('E-postadresserna matchar inte.')
        }

        if (password !== confirmPassword) {
            throw new Error('Lösenorden matchar inte.')
        }

        const users = JSON.parse(localStorage.getItem('users')) || []

        if (users.find((u) => u.email === email)) {
            throw new Error('E-postadressen är redan registrerad.')
        }

        const userId = String(Date.now())
        users.push({ id: userId, name, email, password, role: 'user' })
        localStorage.setItem('users', JSON.stringify(users))

        window.location.href = '/pages/login.html'
    } catch (error) {
        console.error(error)
        if (errorBox) {
            errorBox.textContent = error.message
            errorBox.style.color = '#111'
        }
    }
})
