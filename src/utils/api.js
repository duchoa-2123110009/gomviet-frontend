const BASE_URL = 'http://127.0.0.1:8000/api';

class ApiClient {
  constructor() {
    this.baseUrl = BASE_URL;
  }

  getHeaders(isMultipart = false) {
    const token = localStorage.getItem('token');
    const headers = {};

    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    
    headers['Accept'] = 'application/json';

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}/${endpoint.replace(/^\//, '')}`;
    const isMultipart = options.body instanceof FormData;
    
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(isMultipart),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // If JWT token is expired/invalid, automatically clear session
        if (response.status === 401 && localStorage.getItem('token')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/auth';
        }
        
        throw new Error(data.message || `Lỗi hệ thống (${response.status})`);
      }

      return data;
    } catch (error) {
      console.error(`API Error on ${endpoint}:`, error);
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient();
export default api;
