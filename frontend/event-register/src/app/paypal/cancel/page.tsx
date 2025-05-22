"use client";
import { redirect} from "next/navigation";
import { CrossCircledIcon } from "@radix-ui/react-icons";


export default function Cancel() {
  
  return (
     <div id ="div-paypal" className="flex items-center justify-center min-h-screen bg-[#1a1c2c]">
          <div id="div-paypal-sucess" className="p-8 rounded-2xl shadow-lg text-center border-2 border-solid border-white/[.08]">
            <CrossCircledIcon className="mx-auto text-red-500 w-16 h-16 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">¡Inscripción cancelada!</h2>
            <p className="text-gray-300 mb-6">
              Tu inscripción al evento ha sido cancelada.
            </p>
            <button
              onClick={() => redirect('/home')}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-xl transition"
            >
              Volver al inicio
            </button>
          </div>
        </div>
  );
}