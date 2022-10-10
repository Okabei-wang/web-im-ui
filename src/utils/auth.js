export function getToken() {
  const token = JSON.parse(sessionStorage.getItem('user')).token || ''
  return token
}