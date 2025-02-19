"use client";

import { useState, useEffect } from "react";
import { redirect } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<boolean>(false);

  
  const validateForm = (): boolean => {
    if (!username || !password) {
      setError("Username and password are required");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    const formDetails = new URLSearchParams();
    formDetails.append("username", username);
    formDetails.append("password", password);
    setToken(false);
    
      const response = await fetch('http://localhost:8000/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDetails,
      });
            
      if (!response.ok) {
        setLoading(false);
        setError('Invalid username or password');
        return;
      }
        const data = await response.json();
        localStorage.setItem('token', data.access_token);  
        const token = localStorage.getItem('token');
        
        const responseToken = await fetch(`http://localhost:8000/api/token/${token}`, {
          method: 'GET'});
        
        if (!responseToken.ok) {
          setLoading(false);
          setError('Token verification failed');
          return;
        } 
        setLoading(true);
        setError('');
        setToken(true);
        redirect('/events'); 
}
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {token && <p style={{ color: "green" }}>Login successful</p>}
      </form>
    </div>
  );
};