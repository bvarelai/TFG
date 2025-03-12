"use client"
import { Heading,TextField,Flex,Box, Button} from "@radix-ui/themes";
import { MagnifyingGlassIcon,PlusIcon,Cross2Icon } from "@radix-ui/react-icons";
import { Dialog } from "radix-ui";
export default function Events() {
   
   return (
   <div id = "events-list-div" className='flex flex-col border-2 border-solid border-white/[.08]'>   
      <div id = "title-events" className="flex flex-col relative">
         <div id = "filter-events" className="flex flex-row"> 
            <div id = "search-event" className="flex items-center">
               <TextField.Root id = "textfield-events"variant="soft" placeholder="Search the events…">
                  <TextField.Slot >
                    <MagnifyingGlassIcon height="16" width="16" />
                  </TextField.Slot>
               </TextField.Root>
            </div>
         </div>      
         <Heading id="heading-events">Eventos Destacados</Heading>      
      </div>
      <div id = "events_disp" className="flex flex-col">           
        <Dialog.Root>
         <Dialog.Trigger asChild>
            <Button id="create-event" className="flex items-center gap-3">
               <PlusIcon radius={"full"}/>
            </Button>  
         </Dialog.Trigger>   
         <Dialog.Portal>
           <Dialog.Overlay className="DialogOverlay" />
           <Dialog.Content className="DialogContent border-2 border-solid border-white/[.08]">
               <Dialog.Title className="DialogTitle">Create a new event</Dialog.Title>
		         <Dialog.Description  className="DialogDescription">
			         Add the event data
		         </Dialog.Description>  
               <fieldset id = "fieldset-create" className="flex gap-4 items-center">               
                <label htmlFor="event-name">Name</label>
                <input
                  id = "event-name"  
                  name = "event_name"
                  placeholder="event1"
                  type="text"
                />
                <label htmlFor="event-type">Type</label>
                <input
                  id = "event-type"  
                  name = "event_type"
                  placeholder="type1"
                  type="text"
               />
               </fieldset>    
               <fieldset id = "fieldset-create" className="flex gap-4 items-center">               
                  <label htmlFor="event-edition">Edition</label>
                  <input
                     id = "event-edition"  
                     name = "event_edition"
                     placeholder="edition1"
                     type="text"
                  />
                  <label htmlFor="event-category">Category</label>
                  <input
                     id = "event-category"  
                     name = "event_category"
                     placeholder="category1"
                     type="text"
                  />
               </fieldset> 
               <fieldset id = "fieldset-create" className="flex gap-3 items-center">               
               <label htmlFor="event-date">Date</label>
                  <input
                     id = "event-date"  
                     name = "event_date"
                     placeholder="date1"
                     type="datetime-local" 
                  />
                  <label htmlFor="event-location">Location</label>
                  <input
                     id = "event-location"  
                     name = "event_location"
                     placeholder="location1"
                     type="text"
                  />
               </fieldset> 
               <fieldset id = "fieldset-create" className="flex gap-4 items-center">               
               <label htmlFor="event-description">Description</label>
                  <input
                     id = "event-description"  
                     name = "event_description"
                     placeholder="description1"
                     type="text"
                  />
                  <label htmlFor="event-capacity">Capacity</label>
                  <input
                     id = "event-capacity"  
                     name = "event_capacity"
                     placeholder="capacity1"
                     type="text"
                  />
               </fieldset> 
               <Dialog.Close asChild>
   					<button className="Button green">Save changes</button> 
					</Dialog.Close>
     				<Dialog.Close asChild>
                  <button className="IconButton" aria-label="Close">
                     <Cross2Icon />
                  </button>
		   		</Dialog.Close>   
            
            </Dialog.Content> 
         </Dialog.Portal>           
         </Dialog.Root>
         
         
         
         <Flex gap="6">
            <Box  id = "box-event1" className= "flex flex-col border-2 border-solid" width="64px" height="100px">
               <Heading id= "heading-event-name">Evento1</Heading>     
               <fieldset id = "fieldset-create" className="flex gap-4 items-center">               
                <label>date</label>
               </fieldset>    
               <fieldset id = "fieldset-create" className="flex gap-4 items-center">               
                <label>capacity</label>
               </fieldset>    
            </Box>
            <Box  id = "box-event2" width="64px" height="64px">
               <Heading>Evento2</Heading>
            </Box>
            <Box  id = "box-event3" width="64px" height="64px">
               <Heading>Evento3</Heading>
            </Box>
            <Box id = "box-event4" width="64px" height="64px">
               <Heading>Evento4</Heading>
            </Box>
            <Box id = "box-event5" width="64px" height="64px">
               <Heading>Evento5</Heading>
            </Box>
         </Flex>

      </div>
    </div>  
   )
}