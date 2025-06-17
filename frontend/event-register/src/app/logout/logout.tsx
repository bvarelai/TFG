"use client";
import { redirect } from 'next/navigation'; 
import { useEffect } from 'react';

export default function Logout () {
    
    const handleLogout = async () => {      

      const response = await fetch(`http://localhost:8000/user/logout`, {
        method: "POST",
        credentials : "include"});
  
      if (!response.ok) {
        throw new Error("Error al cerrar sesión");
      }
  
      sessionStorage.clear();
      redirect("/login");
    }
    useEffect(() => {
        handleLogout();
      }, []);
    
      return null; 
}
