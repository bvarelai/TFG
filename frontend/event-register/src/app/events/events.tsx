"use client";

import { redirect } from 'next/navigation';
import { useEffect, useState } from "react";

export default function Events() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {

        const response = await fetch("http://localhost:8000/protected", {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                redirect("/login"); 
            }
            const data = await response.json();
            localStorage.setItem('token', data.token);

            if (!data.token) {
                throw new Error("Token inválido");
            }
            setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return <div>Protected Content</div>;
}
