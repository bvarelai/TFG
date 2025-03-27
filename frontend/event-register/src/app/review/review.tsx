"use client"
import { Heading }  from "@radix-ui/themes";
export default function Review() {
   
   return (
   <div id = "events-list-div" className='flex flex-col border-2 border-solid border-white/[.08]'>
      <div id = "title-events" className="flex flex-col relative border-2 border-solid border-white/[.08]">
            <Heading id="heading-events">Events results and reviews</Heading>  
      </div>
      <div id = "filter-events" className="flex flex-row gap-2"> 
       {/* {(new Date().toISOString() >= event.end_date) ? 
       //    <div>
       //          Este es el resultado     
       //    </div> : 
       //    <Box
       //     id = "no-box-event-result"
       //     className="flex flex-col gap-5 "
       //     >
       //     <MixIcon id = "no-data-icon"/>
       //</div>     <label id= "label-no-data">No result to show</label> 
       //     </Box>                               
       //  }*/}
      </div>
   </div>
   )
}