"use client";
import { redirect } from 'next/navigation'; 
import { useEffect } from 'react';

export default function Logout () {
    
    const handleLogout = async () => {      
        
      const session_id = sessionStorage.getItem("session_id");

      if (!session_id) {
        console.error("No session_id found");
        redirect("/protected");
        return;
      }
  
      const response = await fetch(`http://localhost:8000/user/logout/${session_id}`, {
        method: "POST",
        credentials : "include"});
  
      if (!response.ok) {
        throw new Error("Error al cerrar sesión");
      }
  
      sessionStorage.clear();

      // También elimina la sesión de localStorage si es necesario
      const sessions = JSON.parse(localStorage.getItem("sessions") || "[]");
      const updatedSessions = sessions.filter((session: { session_id: string; }) => session.session_id !== session_id);
      localStorage.setItem("sessions", JSON.stringify(updatedSessions));

      redirect("/login");
    }
    useEffect(() => {
        handleLogout();
      }, []);
    
      return null; // No renderiza nada
}
