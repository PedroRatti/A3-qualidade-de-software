export function getToken() {
return localStorage.getItem("token");
}

export function getAuthHeaders(): HeadersInit {
const token = getToken();

const headers: HeadersInit = {
"Content-Type": "application/json",
};

if (token) {
return {
...headers,
Authorization: `Bearer ${token}`,
};
}

return headers;
}