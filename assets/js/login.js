const form = document.getElementById('login-form')

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value

    const errorBox = document.getElementById('login-error')
    if (errorBox) {
        errorBox.textContent = ''
        errorBox.style.color = '#111'
    }

    try {
        const users = JSON.parse(localStorage.getItem('users')) || []
        const user = users.find((u) => u.email === email && u.password === password)

        if (!user) {
            throw new Error('Fel e-post eller lösenord.')
        }

        localStorage.setItem('token', 'session_' + user.id)
        localStorage.setItem('userId', user.id)
        localStorage.setItem('name', user.name)
        localStorage.setItem('role', user.role || 'user')

        const redirectTarget = localStorage.getItem('redirectAfterLogin')
        if (redirectTarget && redirectTarget !== '/pages/login.html') {
            localStorage.removeItem('redirectAfterLogin')
            window.location.href = redirectTarget
        } else {
            window.location.href = '/pages/member.html'
        }
    } catch (error) {
        console.error(error)
        if (errorBox) {
            errorBox.textContent = error.message
            errorBox.style.color = '#111'
        } else {
            alert(error.message)
        }
    }
})
