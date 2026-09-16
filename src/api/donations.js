import http from './http'

export const createDonation = (foundationId, amount) => http.post('/donations', { foundationId, amount })
export const fetchMyDonations = () => http.get('/donations/me')
