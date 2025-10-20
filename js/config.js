const CONFIG = {
    API_BASE_URL: 'http://localhost:8080/api/reportes',
    getApiUrl: () => localStorage.getItem('apiUrl') || CONFIG.API_BASE_URL,
    setApiUrl: (url) => localStorage.setItem('apiUrl', url)
};
