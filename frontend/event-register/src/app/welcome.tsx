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
        className="min-h-screen flex flex-col justify-center gap-4 items-center">    
                <div id= "welcome-second-div"className=" gap-20 relative flex flex-col items-center border-2 border-solid border-white/[.08] ">
                        <Heading 
                        id="welcome_title" weight="bold"
                        >Bienvenido a SportNexus</Heading>  
                        <Tabs.Root className="relative top-[-130px]">
                            <Tabs.List color="violet" className="flex gap-6"> 
                                <Tabs.Trigger id = "welcome-tabs-trigger" value="QueEs?"
                                className="text-lg px-20 py-2 rounded-md"
                                >Que es SportNexus?</Tabs.Trigger>  
                                <Tabs.Trigger  id = "welcome-tabs-trigger" value="PorQue?"
                                className="text-lg px-12 py-2 rounded-md"
                                >Por que SportNexus?</Tabs.Trigger>
                            </Tabs.List>
                            <Box pt="2">
                                <Tabs.Content value="QueEs?">
                                  <Text id = "welcome-text-tab" size="2"> SportNexus es una web que ofrece una variedad de eventos deportivos, 
                                    en los que el usuario se puede inscribir.
                                  </Text>
                                </Tabs.Content>  
                                <Tabs.Content value="PorQue?">
			                      <Text id = "welcome-text-tab" size="2">Para satisfacer las necesidades de las personas.</Text>
		                        </Tabs.Content>    
                            </Box> 
                        </Tabs.Root>
                        <Button id ="welcome-button"
                        className="rounded-full border  border border-solid border-black/[.08] hover:border-transparent h-10 sm:h-12 px-4 sm:px-5 sm:min-w-40"
                        variant="solid" color="violet" onClick={handleSubmit}>
                            Empecemos
                        </Button>
                </div>            
        </div>   
    );  
}
