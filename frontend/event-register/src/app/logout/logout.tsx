"use client";
import { redirect } from 'next/navigation'; 
import { useEffect } from 'react';

export default function Logout () {
    
    const handleLogout = async () => {      
        
        const username = localStorage.getItem('user_name');
    
        const response = await fetch(`http://localhost:8000/user/logout/${username}`, {
          method: "POST",
          credentials : "include"});
    
        if (!response.ok) {
          throw new Error("Error al cerrar sesión");
        }
    
        localStorage.removeItem('user_name');
        localStorage.removeItem('token');
        redirect("/login");
    }
    useEffect(() => {
        handleLogout();
      }, []);
    
      return null; // No renderiza nada
}
