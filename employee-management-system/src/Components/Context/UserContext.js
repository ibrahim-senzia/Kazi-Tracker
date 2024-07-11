// UserContext.js
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const nav = useNavigate();
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('token') ? localStorage.getItem('token') : null);
  const [currentUser, setCurrentUser] = useState(null);

  console.log('====================================');
  console.log(authToken);
  console.log('====================================');

  // Register User
  const register = async (name, email, password) => {
    try {
      const response = await fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const res = await response.json();
      console.log(res);

      if (res.success) {
        nav('/LogIn');
        alert(res.success);
      } else if (res.error) {
        alert(res.error);
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error('Failed to register:', error);
      alert('Failed to register. Please try again later.');
    }
  };

  // Login User
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8080/LogIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const res = await response.json();
      console.log(res);

      if (res.access_token) {
        setAuthToken(res.access_token);
        localStorage.setItem('token', res.access_token);
        nav('/Dashboard');
        alert("Login success");
      } else if (res.error) {
        alert(res.error);
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error('Failed to login:', error);
      alert('Failed to login. Please try again later.');
    }
  };

  // Logout User
  const logout = async () => {
    try {
      const response = await fetch('http://localhost:8080/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const res = await response.json();
      console.log(res);

      if (res.success) {
        setAuthToken(null);
        localStorage.removeItem('token');
        nav('/LogIn');
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error('Failed to logout:', error);
      alert('Failed to logout. Please try again later.');
    }
  };

  useEffect(() => {
    if (authToken) {
      fetch('http://localhost:8080/current_user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${authToken}`
        }
      })
        .then(res => res.json())
        .then(res => {
          setCurrentUser(res);
        })
        .catch(error => {
          console.error('Failed to fetch current user:', error);
        });
    } else {
      setCurrentUser(null);
    }
  }, [authToken]);

  const contextData = {
    currentUser,
    register,
    login,
    logout
  };

  return (
    <UserContext.Provider value={contextData}>
      {children}
    </UserContext.Provider>
  );
};
