"use client";
import Link from 'next/link'

export default function Page() {        
    return (  
            <form className="min-h-screen flex flex-col justify-center gap-4 items-center">
                <div className = "flex flex-col" >
                    <h1>Página Principal</h1>    
                </div>  
                <div  className = "flex flex-col">
                    <p className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44">
                     <Link href="/login">Bienvenido</Link>
                    </p>
                </div>
            </form>   
        );
    }
