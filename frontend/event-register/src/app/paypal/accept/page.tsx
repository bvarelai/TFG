"use client";
import { useEffect, useMemo, useState} from "react";
import { registerInscription } from "../../paypalUtils"; // Ajusta la ruta según tu estructura
import { redirect, useSearchParams } from "next/navigation";
import { CheckCircledIcon } from "@radix-ui/react-icons";

export default function Accept() {
  
  const searchParams = useSearchParams();
  const orderId = searchParams.get("token");
  const [result, setResult] = useState<string>("");
  const [user_id, setUserID] = useState<number>(0);
  

  const event = useMemo(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("event");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  }, []);
  
  useEffect(() => {
    sessionStorage.setItem("paypal_accept", "1");
    const storedUserID = sessionStorage.getItem('user_id');
    if (storedUserID) {
      setUserID(parseInt(storedUserID));
    }
  }, []);
  
  useEffect(() => {
    if (!event) {
        setResult("Event not found in session storage");
        return;
    }
    const captureAndRegister = async () => {
      if (!orderId) return;
      const token = sessionStorage.getItem("token");
      const category_inscription = sessionStorage.getItem("category_inscription");
      if (!category_inscription) {
        setResult("Category not found in session storage");
        return;
      }
      if (!token) {
        setResult("Token not found in session storage");
        return;
      }
      try {
        await completePayment(token, orderId);
        
        const regResult = await registerInscription(event,user_id, event.event_name, event.event_type, event.event_edition, event.category, category_inscription, event.event_description, event.location, event.celebration_date, event.end_date, event.capacity, event.organizer_by, event.event_full_description, event.language, event.is_free);
        setResult("Inscripción realizada correctamente" + regResult);
        console.log("Respuesta inscripción:", regResult);
      } catch (e) {
        setResult("Error en inscripción: " + e);
        console.error(e);
      }
    };
     captureAndRegister();
  }, [orderId, event, user_id]);

  const completePayment = async (token : string, orderId: string) => {    
    const responsePayPal = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderId}/capture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }})

    const errorData = await responsePayPal.json();
        
    if(!responsePayPal.ok){
      console.error("PayPal capture error:", responsePayPal.status);
      throw new Error(errorData.message || "Error capturing payment");
    }
     
    return errorData
  
  }
  return (
    <div id ="div-paypal" className="flex items-center justify-center min-h-screen bg-[#1a1c2c]">
      <div id="div-paypal-sucess" className="p-8 rounded-2xl shadow-lg text-center border-2 border-solid border-white/[.08]">
        <CheckCircledIcon className="mx-auto text-green-500 w-16 h-16 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">¡Inscripción exitosa!</h2>
        <p className="text-gray-300 mb-6">
          Tu inscripción al evento ha sido confirmada correctamente. Gracias por tu pago.
        </p>
        <button
          onClick={() => redirect('/home')}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-xl transition"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  )
}