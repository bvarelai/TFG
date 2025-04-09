"use client"
import { Heading,Box, Button}  from "@radix-ui/themes";
import { useState, useEffect, useRef} from "react";
import { MixIcon,StarFilledIcon,StarIcon, CheckIcon,Cross2Icon} from "@radix-ui/react-icons";
import { Span } from "next/dist/trace";

export default function Review({ event }: { event: any }) {
   
   const [user_id, setUserID] = useState<number>(0);
   const [isOrganizer, setOrganizer] = useState<boolean>(false);
   const [isRegister, setRegister] = useState<boolean>(false);
   const [csvData, setCsvData] = useState<string>("");
   const [reviews, setReviews] = useState<any[]>([]);
   const [eventResults, setEventResults]  = useState<any[]>([]);
   const [eventResultsHeaders, setEventResultsHeaders]  = useState<String[]>([]);
   const [eventResultsData, setEventResultsData]  = useState<{ participant_name: string; position: string; time: string; score: string; category: string; }[]>([]);
   

   useEffect(() => {  
      const storedUserID = localStorage.getItem('user_id');
      if (storedUserID) {
      setUserID(parseInt(storedUserID));
      }
      const storedValue = localStorage.getItem('organizer');
      if (storedValue !== null) {
         setOrganizer(JSON.parse(storedValue));
      }
      findEventResults(event.event_id) 
   }, []);

   useEffect(() => {
      if (event && user_id) {
        findInscription(user_id, event.event_id);
      }
    }, [event, user_id]);

   useEffect(() => {
      if (event && event.event_id) {
         findReviews(event.event_id);
      }
   },[event.event_id])


   const processCsvData = (csvData: string) => {
      
      const rows = csvData.trim().split("\n");  
      const headers = rows[0].split(",");
      const dataRows = rows.slice(1).map((row) => {
         const cols = row.split(",");
         return {
           participant_name: cols[0], 
           category: cols[1], 
           position: cols[2], 
           time:  cols[3],
           score: cols[4], 
           team: cols[5], 
           country : cols[6]
         };
       });
      
      return {headers, dataRows}; 
   }

   useEffect(() => {
      if (eventResults.length > 0 && eventResults[0].csv_file) {
        const csvData = eventResults[0].csv_file; // Suponiendo que el CSV está en la propiedad `csv_file`
        const {headers,dataRows} = processCsvData(csvData);
        setEventResultsHeaders(headers); // Almacena las cabeceras
        setEventResultsData(dataRows);
      }
    }, [eventResults]);

   
   const createInscription = async (event_id : number,event_name : string, event_type:string, event_edition: string, category:string, event_description:string, location:string, celebration_date:string, end_date: string, capacity: number, organizer_by: string, duration: number, event_full_description: string, language : string, is_free : boolean) => {

      const formDetails = 
      {
         "event_id" : event_id,
         "user_id" : user_id,
         "event_name" : event_name,
         "inscription_date" : "2022-12-12T12:12:12",
         "location" : location
      }
      
      const responseInscription = await fetch('http://localhost:8000/inscription/register' , {
         method: 'POST',
         headers: {
          'Content-Type': 'application/json',
         },
         body: JSON.stringify(formDetails)
      });
    
      if(!responseInscription.ok){
        return;
      }
      setRegister(true)

      const formDetailsEvent = 
      {
         "event_name" : event_name,
         "user_id" : user_id,
         "event_type" : event_type,  
         "event_edition" :  event_edition,
         "event_description" : event_description,
         "category": category,
         "location"  : location,
         "celebration_date"  : celebration_date,
         "end_date" : end_date,
         "capacity" : capacity - 1,
         "organizer_by" : organizer_by,
         "duration" : duration,
         "event_full_description" : event_full_description,
         "language" : language,
         "is_free" : is_free
      }


      const responseEvent = await fetch(`http://localhost:8000/event/update/${event_name}`, {
         method: 'PUT',
         headers: {
          'Content-Type': 'application/json',
         },
         body: JSON.stringify(formDetailsEvent)
      });

      if (!responseEvent.ok) {
         return;
      }
   }

   const findInscription = async (user_id : number,event_id : number) => {
      
      const response = await fetch(`http://localhost:8000/inscription/find/${user_id}/${event_id}`, {
         method: 'GET',
      });

      if (!response.ok) {
         setRegister(false)
         return;
      }
      else{
         setRegister(true)
         return;
      }
   }

   const findReviews = async (event_id : number) => {
  
      const responseReview = await fetch(`http://localhost:8000/review/find/${event_id}`, {
         method: 'GET',
      })

      if (!responseReview.ok) {
         return;
      }
      const data = await responseReview.json();
      setReviews(data);
      return;
   }

   const findEventResults = async (event_id: number) => {

      const responseResult = await fetch(`http://localhost:8000/event/result/download/${event_id}`, {
         method: 'GET',
      })
   
      if (!responseResult.ok){
         return;
      }
      const data = await responseResult.json();
      setEventResults(data);
      return;
   }

   return ( 
   <div id = "events-list-div" className='flex flex-col border-2 border-solid border-white/[.08]'>
      <div id = "title-events" className="flex flex-col relative border-2 border-solid border-white/[.08]">
            <Heading id="heading-events">Events results and reviews</Heading>  
      </div>
      <div id = "filter-events" className="flex flex-row gap-2 justify-between"> 
         <div id="event-info-comments" className="flex flex-col gap-2">
            <div id = "even-information" className="flex flex-col p-6 border-2 border-solid border-white/[.08]">
                  <Heading id = "event-info-heading" className="text-3xl font-bold mb-4">{event.event_name} event</Heading>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                     <div><strong>Type:</strong> {event.event_type}</div>
                     <div><strong>Category:</strong> {event.category}</div>
                     <div><strong>Location:</strong> {event.location}</div>
                     <div><strong>Capacity:</strong> {event.capacity} places</div>
                     <div><strong>Start date:</strong> {event.celebration_date.split("T")[0]} {event.celebration_date.split("T")[1]}</div>
                     <div><strong>End date:</strong> {event.end_date.split("T")[0]} {event.end_date.split("T")[1]}</div>
                     <div><strong>Organizer by:</strong> {event.organizer_by}</div>
                     <div><strong>Duration:</strong> {event.duration} days </div>
                     <div><strong>Language:</strong> {event.language}</div>
                     <div><strong>Free:</strong> {event.is_free == true ? "Yes": "No"}</div>
                     <div className="flex flex-row items-center gap-1">
                     {!isOrganizer && (
                        <>
                           <strong>Status:</strong>
                           {!isRegister ? (
                           <span className="flex flex-row items-center gap-1 text-red-600">
                              Not Registered <Cross2Icon />
                           </span>
                           ) : (
                           <span className="flex flex-row items-center gap-1 text-green-600">
                              Registered <CheckIcon />
                           </span>
                           )}
                        </>
                     )}
                     </div>
                     <div> { !isOrganizer && !isRegister && <Button id = "button-inscription" onClick={()=> createInscription(event.event_id,event.event_name, event.event_type,event.event_edition, event.category, event.event_description, event.location, event.celebration_date, event.end_date, event.capacity, event.organizer_by, event.duration, event.event_full_description, event.language, event.is_free)}>Register</Button>}</div>  

                  </div>
                  <div id="description-full-event">
                     <p className="mt-4 text-gray-600">{event.event_full_description}</p>
                  </div>

            </div>
            <div id= "event-comments" className="p-6 flex flex-col border-2 border-solid border-white/[.08]">
              <Heading id = "comments-heading" className="text-3xl font-bold mb-4">Comments and Reviews</Heading> 
               {reviews.length > 0 ? (  
                  reviews.map((review,index) => (
                     <Box id ="box-review" key={event.review_id || index} className="flex flex-col border-2 border-solid border-white/[.08]">
                          <div id = "rating-review" className="flex flex-row items-center gap-2">
                              <div  className="flex flex-row">
                                 {Array.from({ length: review.review_rating }).map((_, index) => (
                                    <StarFilledIcon key={`filled-${index}`} />
                                 ))}
                                 {Array.from({ length: 5 - review.review_rating }).map((_, index) => (
                                    <StarIcon key={`empty-${index}`} />
                                 ))}
                              </div>
                              <span id="text-review">{review.review_text}</span>
                          </div>
                          <div id="name-review" className="flex flex-row items-center gap-2">
                              <span> {review.user_name}</span>
                          </div>

                     </Box>    
                  ))) : (
                     <Box id = "no-box-review" className="flex flex-col gap-5 ">
                        <label id= "label-no-data">No reviews to show</label>
                        <MixIcon id = "no-data-icon"/>
                     </Box>    
                  )
               }
            </div>
         </div>
         <div id="event-results" className = "flex ml-auto border-2 border-solid border-white/[.08] p-6 flex flex-col gap-4">
            <Heading className="text-2xl font-bold mb-4">Results</Heading>
            
                  <table className="border border-gray-300">
                     <thead className="bg-purple-100">    
                        <tr>
                        {eventResultsHeaders.map((header,index) => (
                          <th key={index} className="border p-2">{header}</th>
                        ))}
                        </tr>
                     </thead>
                     <tbody>
                     {eventResultsData.map((data, index) => (
                     <tr key={index}>
                        <td>{data.participant_name}</td>
                        <td>{data.category}</td>
                        <td>{data.position}</td>
                        <td>{data.time}</td>
                        <td>{data.score}</td>
                        
                     </tr>
                     ))}
                     </tbody>
                  </table>      
         </div>
            

      
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