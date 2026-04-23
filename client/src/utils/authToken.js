export function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') {
    return null
  }

  try {
    const payloadPart = token.split('.')[1] || ''
    const normalizedPayload = payloadPart.replace(/-/g, '+').replace(/_/g, '/')
    const paddingLength = (4 - (normalizedPayload.length % 4)) % 4
    const paddedPayload = normalizedPayload + '='.repeat(paddingLength)
    return JSON.parse(window.atob(paddedPayload))
  } catch {
    return null
  }
}

export function getAccountDataFromToken() {
  const token = localStorage.getItem('token')

  if (!token) {
    return { isLoggedIn: false, initial: null, email: '', name: '' }
  }

  const decodedPayload = decodeJwtPayload(token)

  if (!decodedPayload) {
    return { isLoggedIn: true, initial: 'U', email: '', name: '' }
  }

  const email = decodedPayload.email || ''
  const name = decodedPayload.name || ''
  const initial = name?.charAt(0)?.toUpperCase() || email?.charAt(0)?.toUpperCase() || 'U'

  return { isLoggedIn: true, email, name, initial }
}
