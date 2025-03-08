"use client";

import { Button, Text, Tabs, Box, Heading } from "@radix-ui/themes";
import { useRouter } from "next/navigation";

export default function Welcome() {        
    const router = useRouter();  
    function handleSubmit() {
       router.push("/login"); 
    } 
    
    return (         
        <div 
        id = "welcome-first-div"
        className="min-h-screen flex flex-col justify-center gap-4 items-center relative">    
                <div id= "welcome-second-div"className=" gap-20 relative flex flex-col items-center border-2 border-solid border-white/[.08] ">
                        <h1 
                        id="welcome_title" className="relative top-[+90px]"
                        >Bienvenido a SportNexus</h1>  
                        <Button id ="welcome-button"
                        className="relative top-[-160px] rounded-full border  border border-solid border-black/[.08] hover:border-transparent h-10 sm:h-12 px-4 sm:px-5 sm:min-w-40"
                        variant="solid" color="violet" onClick={handleSubmit}>
                            Empecemos
                        </Button>
                </div>            
        </div>   
    );  
}
