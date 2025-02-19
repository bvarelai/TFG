"use client";

import { useState } from "react";
import { redirect } from 'next/navigation'


interface User {
  id: number;
  name: string;
  email: string;
}

export default function Register() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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

    try {
      const response = await fetch("http://localhost:8000/api/user", {
        method: "POST",
        headers: {
         'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      setLoading(false);

      if (response.ok) {
        const data: {result : string } = await response.json();
        localStorage.setItem("result", data.result);    
      } else {
        const errorData: { detail?: string } = await response.json();
        setError(errorData.detail || "Resgistration failed!");
      }
      console.log(formDetails);  
      console.log(response);
       
    } catch (error) {
      setLoading(false);
      setError("An error occurred. Please try again later.");
    }
  };
    
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
          {loading ? "Register in..." : "Register"}
        
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};