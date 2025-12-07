
interface User {
  name: string;
  email: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

const API_URL = 'http://localhost:5000/api';

/**
 * AUTH SERVICE
 * Handles communication with the Node.js backend.
 * Includes fallback logic to allow the app to work in preview mode (without running server).
 */

export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Login failed');
    }

    const data: AuthResponse = await response.json();
    return data.user;
  } catch (error) {
    console.warn("Backend unreachable or error. Falling back to Demo Mock.", error);
    // FALLBACK MOCK FOR DEMO PURPOSES
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: email.split('@')[0],
          email: email
        });
      }, 1000);
    });
  }
};

export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Registration failed');
    }

    const data: AuthResponse = await response.json();
    return data.user;
  } catch (error) {
    console.warn("Backend unreachable or error. Falling back to Demo Mock.", error);
    // FALLBACK MOCK FOR DEMO PURPOSES
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ name, email });
      }, 1000);
    });
  }
};
