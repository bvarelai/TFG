"use client"
import { Heading }  from "@radix-ui/themes";
export default function Stadistics() {
   
   return (
   <div id = "events-list-div" className='flex flex-col border-2 border-solid border-white/[.08]'>
     <div id = "title-events" className="flex flex-col relative border-2 border-solid border-white/[.08]">
            <Heading id="heading-events">User information and Stadistics</Heading>  
      </div>
      <div id = "filter-events" className="flex flex-row gap-2"> 
      </div>
   </div>
   )
}