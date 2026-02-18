// Debug script to check authentication
// Run this in browser console: copy-paste and run

console.log('=== AUTH DEBUG ===');
console.log('Token:', localStorage.getItem('token'));
console.log('Company Access Token:', localStorage.getItem('companyAccessToken'));
console.log('Selected Company ID:', localStorage.getItem('selected_company_id'));

// Try to decode token (if it's a JWT)
const token = localStorage.getItem('token');
if (token) {
    try {
        const parts = token.split('.');
        if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            console.log('Token payload:', payload);
            console.log('User ID from token:', payload.system_user_id || payload.user_id || payload.id);
        }
    } catch (e) {
        console.log('Token is not a JWT or cannot be decoded');
    }
}
