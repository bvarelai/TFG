"use client"
import { use, useState, useEffect} from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, XAxis, YAxis, Bar, LineChart, Line} from "recharts";
import { EnvelopeClosedIcon, SewingPinFilledIcon, ClockIcon, PersonIcon, StarFilledIcon, TimerIcon,GlobeIcon, BarChartIcon, ArrowTopRightIcon, ArrowBottomRightIcon, MixIcon } from "@radix-ui/react-icons";
import { Heading,Box}  from "@radix-ui/themes";
import { Avatar} from "radix-ui";
import Image from 'next/image'

export default function Stadistics() {

   const [events, setEvents] = useState<any[]>([]);
   const [eventResult, setEventResult] = useState<any[]>([]);
   const [inscriptions, setInscriptions] =useState<number>(0);
   const [inscription, setInscription] =useState<any[]>([]);
   const [review,setReview] =useState<any[]>([]);
   const [myinscriptions,setMyInscription] =useState<any[]>([]);
   const [myReviews,setMyReviews] =useState<any[]>([]);
   const [user_name, setUserName] = useState<string>("");
   const [sur_name, setSurname] = useState<String>("");
   const [age, setAge] = useState<Number>(0);
   const [email, setEmail] = useState<String>("");
   const [phone, setPhone] = useState<String>("");
   const [city, setCity] = useState<String>("");
   const [country, setCountry] = useState<String>("");
   const [autonomy, setAutonomy] = useState<String>("");
   const [registerDate, setregisterDate] = useState<Date>(new Date);
   const [isOrganizer, setIsOrganizer] = useState<Boolean>(false);
   const [dateLogin, setLogin] = useState<String>("");
   const [dateMember, setMember] = useState<String>("");


   useEffect(() => {
      findUser()
      const loginDate = sessionStorage.getItem('login_date');
      if (loginDate) {
         const date = new Date(loginDate);
         const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
         const formattedDate = date.toLocaleDateString('en-US', options);
         setLogin(formattedDate);
      }
      if(registerDate){
         const date = new Date(registerDate);
         const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
         const formattedDate = date.toLocaleDateString('en-US', options);
         setMember(formattedDate);
      }
      findEventsCreate()
   },[])

   useEffect(() => {
      findMyInscriptions() 
      findMyReviews()
   },[])

   useEffect(() => {
      if (myinscriptions.length > 0) {
         findMyEventResults();
      }
   }, [myinscriptions])

  useEffect(() => {
      const fetchTotalInscriptions = async () => {
         const total = await findTotalInscriptions();
         setInscriptions(total);
      };

      fetchTotalInscriptions();
      findAllInscriptions();
      findAllReviews();
   }, [events]);

   const findMostFrequentLocation = () => {
      if (events.length === 0) return "No locations available";

      const locationCounts = events.reduce((acc, event) => {
         const location = event.location?.trim();
         if (location) {
            acc[location] = (acc[location] || 0) + 1;
         }
         return acc;
      }, {} as Record<string, number>);

      const mostFrequent = Object.entries(locationCounts).reduce(
         (max, [location, count]) => (Number(count) > max.count ? { location, count: Number(count) } : max),
         { location: "", count: 0 }
      );
      return mostFrequent.location;
  };


   const findFavouriteLocation = () => {
      if (myinscriptions.length === 0) return "No locations available";

      const locationCounts = myinscriptions.reduce((acc, event) => {
         const location = event.location?.trim();
         if (location) {
            acc[location] = (acc[location] || 0) + 1;
         }
         return acc;
      }, {} as Record<string, number>);

      const mostFrequent = Object.entries(locationCounts).reduce(
         (max, [location, count]) => (Number(count) > max.count ? { location, count: Number(count) } : max),
         { location: "", count: 0 }
      );
      return mostFrequent.location;
  };

   const findLastAttendedEvent = () => {
      if (myinscriptions.length === 0) return "No locations available";

       const sortedInscriptions = myinscriptions.sort((a, b) => {
         const dateA = new Date(a.inscription_date);
         const dateB = new Date(b.inscription_date);
         return dateB.getTime() - dateA.getTime(); 
      });
      const lastInscription = sortedInscriptions[0];
      const lastEvent = myinscriptions.find((event) => event.event_id === lastInscription.event_id);
      
      return lastEvent ? lastEvent.event_name : "Event not found";
  };

   const calculateMostAttendedEvent = () => {
      if (events.length === 0 || inscription.length === 0) return []

      const eventsWithAttendance = events.map((event) => {
      const eventInscriptions = inscription.filter((ins) => ins.event_id === event.event_id).length;
      return { ...event, attendance: eventInscriptions };  
      });
      
      const sortedEvents = eventsWithAttendance.sort((a, b) => b.attendance - a.attendance);
 
     return sortedEvents.slice(0, 3);
}

   const calculateAverageAttendance = () => {
      if (events.length === 0) return 0; 
        return (inscription.length / events.length).toFixed(2); 
   };


   const getBestAndWorstPosition = (userName: string) => {
      if (eventResult.length === 0) return { best: 0, worst: 0 };

      let positions: { pos: number; eventName: string }[] = [];

      eventResult.forEach((result) => {
         const csvData = result.csv_file;
         const rows = csvData.trim().split("\n");
         const headers = rows[0].split(",");
         const dataRows = rows.slice(1).map((row: string) => row.split(","));
         const userRow = dataRows.find((row: string[]) => row.includes(userName));
         if (userRow) {
            const positionIndex = 0
            if (positionIndex >= 0 && positionIndex < userRow.length) {
            const position = parseInt(userRow[positionIndex], 10);
            if (!isNaN(position)) {
               positions.push({ pos: position, eventName: result.event_name || "Unknown event" });
            }
            }
         }
      });
    if (positions.length === 0) return { best: 0, worst: 0, bestEvent: "" };

    const bestPosition = Math.min(...positions.map(p => p.pos));
    const bestObj = positions.find(p => p.pos === bestPosition);

    return {
      best: bestPosition,
      worst: Math.max(...positions.map(p => p.pos)),
      bestEvent: bestObj ? bestObj.eventName : "",
      };
   };

   const { best, worst, bestEvent} = getBestAndWorstPosition(user_name);


   const calculateAveragePosition = (userName: string) => { 
      if (eventResult.length === 0) return 0; 

      let totalPositions = 0;
      let count = 0;

      eventResult.forEach((result) => {
         const csvData = result.csv_file; 
         const rows = csvData.trim().split("\n"); 
         const dataRows = rows.slice(1).map((row: string) => row.split(",")); 
         const userRow = dataRows.find((row: string | string[]) => row.includes(userName));
         if (userRow) {
            const positionIndex = 0 
            if (positionIndex >= 0 && positionIndex < userRow.length) {
              const position = parseInt(userRow[positionIndex], 10); 
               if (!isNaN(position)) {
                  totalPositions += position; 
                  count++; 
               }
           }
        }
     });
     return count > 0 ? (totalPositions / count).toFixed(2) : 0; 
   };

   const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6384"];

   const prepareChartData = () => {
      const categoryCounts = inscription.reduce((acc, item) => {
         const categories = item.category_inscription.split(",").map((cat: string) => cat.trim());
         categories.forEach((category: string) => {
            acc[category] = (acc[category] || 0) + 1; 
         });
         return acc;
      }, {} as Record<string, number>);

      
      return Object.entries(categoryCounts).map(([name, value]) => ({
         name,
         value,
      }));
   }

   const prepareChartDataMyInscriptions = () => {
      const categoryCounts = myinscriptions.reduce((acc, item) => {
         const categories = item.type_inscription.split(",").map((cat: string) => cat.trim());
         categories.forEach((category: string) => {
            acc[category] = (acc[category] || 0) + 1; 
         });
         return acc;
      }, {} as Record<string, number>);

      
      return Object.entries(categoryCounts).map(([name, value]) => ({
         name,
         value,
      }));
   }




   const calculateAverageReview = (eventId: number) => {
      const eventReviews = review.filter((rev) => rev.event_id === eventId); 
      if (eventReviews.length === 0) return 0; 
      const totalRating = eventReviews.reduce((sum, rev) => sum + rev.review_rating, 0); 
      return totalRating === 0 ? 0 : parseFloat((totalRating / eventReviews.length).toFixed(2)); // Calcula la media
   };


   const calculateAverageReviewScore = () => {
      if (myReviews.length === 0) return 0; 
      const totalRating = myReviews.reduce((sum, rev) => sum + rev.review_rating, 0); 
      return totalRating === 0 ? 0 : parseFloat((totalRating / myReviews.length).toFixed(2)); // Calcula la media
   };

   function getOrdinal(n: number) {
      if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
      if (n % 10 === 1) return `${n}st`;
      if (n % 10 === 2) return `${n}nd`;
      if (n % 10 === 3) return `${n}rd`;
      return `${n}th`;
   }
   const prepareBarChartData = () => {
      return events.map((event) => ({
         name: event.event_name, 
         value: calculateAverageReview(event.event_id), 
      }));
   };


   const prepareBarLineData = () => {
      const months = [
         "January", "February", "March", "April", "May", "June",
         "July", "August", "September", "October", "November", "December"
      ];

      const eventCounts = months.reduce((acc, month) => {
         acc[month] = 0;
         return acc;
      }, {} as Record<string, number>);


      events.forEach((event) => {
         const eventDate = new Date(event.celebration_date);
         const monthName = months[eventDate.getMonth()]; 
         eventCounts[monthName] += 1;
      });

      return Object.entries(eventCounts).map(([month, count]) => ({
         name: month,
         value: count,
      }));
   };


   const prepareBarLineDataUser = () => {
      const months = [
         "January", "February", "March", "April", "May", "June",
         "July", "August", "September", "October", "November", "December"
      ];

      const eventCounts = months.reduce((acc, month) => {
         acc[month] = 0;
         return acc;
      }, {} as Record<string, number>);


      myinscriptions.forEach((event) => {
         const eventDate = new Date(event.inscription_date);
         const monthName = months[eventDate.getMonth()]; 
         eventCounts[monthName] += 1;
      });

      return Object.entries(eventCounts).map(([month, count]) => ({
         name: month,
         value: count,
      }));
   };

   const findUser = async () => {
      const user_name = sessionStorage.getItem('user_name');
         const reponse = await fetch(`http://localhost:8000/user/find/${user_name}`, {  
            method: "GET",
         })
         if (!reponse.ok) {
            return; 
         }
         const data = await reponse.json()

         setUserName(data.user_name)
         setSurname(data.user_surname)
         setAge(data.age)
         setEmail(data.email)
         setCity(data.city)
         setIsOrganizer(data.is_organizer)
         setPhone(data.phone)
         setCountry(data.country)
         setAutonomy(data.autonomous_community)
         setregisterDate(data.register_date)
   }

   const findEventsCreate = async () => {
      const user_id = sessionStorage.getItem('user_id')
      const response = await fetch(`http://localhost:8000/event/find/myevents/${user_id}`, {
         method : 'GET'
      })

      if(!response.ok){
         return [];
      }
       
      const data = await response.json()
      setEvents(data);      
   }

   const findTotalInscriptions = async () => {
      const totalInscriptions = await Promise.all(
         events.map(async (event) => {
            const response = await fetch(`http://localhost:8000/inscription/find/event/${event.event_id}`, {
            method: 'GET',
            });

            if (!response.ok) {
            return 0; 
            }

            const data = await response.json();
            return data.length; 
         })
      );
      return totalInscriptions.reduce((total, count) => total + count, 0);
   }; 

   const findAllInscriptions = async() => {
      const allInscriptions = await Promise.all(
         events.map(async (event) => {
            const response = await fetch(`http://localhost:8000/inscription/find/event/${event.event_id}`, {
            method: 'GET',
            });

            if (!response.ok) {
            return []; 
            }

            const data = await response.json();
            return data;
         })
      );
      
      const flattenedInscriptions = allInscriptions.flat();
      setInscription(flattenedInscriptions); 
      return flattenedInscriptions.length; 
   }

   const findAllReviews = async() => {
      const allInscriptions = await Promise.all(
         events.map(async (event) => {
            const response = await fetch(`http://localhost:8000/review/event/find/${event.event_id}`, {
            method: 'GET',
            });

            if (!response.ok) {
            return []; 
            }

            const data = await response.json();
            return data;
         })
      );
      
      const flattenedReview = allInscriptions.flat();
      setReview(flattenedReview); 
   }

   const findMyInscriptions = async() => {
      const user_id = sessionStorage.getItem('user_id')
      const response = await fetch(`http://localhost:8000/inscription/find/${user_id}`, {
      method: 'GET',
      });

      if (!response.ok) {
      return []; 
      }

      const data = await response.json();
      if (Array.isArray(data)) {
         setMyInscription(data); 
      } else {
         setMyInscription([]); 
      }
   }

   const findMyReviews = async() => {
      const user_id = sessionStorage.getItem('user_id')
      const response = await fetch(`http://localhost:8000/review/user/find/${user_id}`, {
      method: 'GET',
      });

      if (!response.ok) {
      return []; 
      }

      const data = await response.json();
      if (Array.isArray(data)) {
         setMyReviews(data); 
      } else {
         setMyReviews([]); 
      }
   }

   const findMyEventResults = async() => {
      const allInscriptions = await Promise.all(
         myinscriptions.map(async (event) => {
            const response = await fetch(`http://localhost:8000/event/result/download/${event.event_id}`, {
            method: 'GET',
            });

            if (!response.ok) {
            return []; 
            }

            const data = await response.json();
            return data;
         })
      );
      const flattenedReview = allInscriptions.flat();
      setEventResult(flattenedReview); 
   }

   return (
   <div id = "events-list-div" className='flex flex-col border-2 border-solid border-white/[.08]'>
      <div id = "title-events" className="flex flex-col relative border-2 border-solid border-white/[.08]">
            <Heading id="heading-events">User information and Stadistics</Heading>  
      </div>
      <div id = "filter-events" className="flex flex-col gap-2 "> 
         <div className="flex flex-row">
            <div id="user-info" className="flex flex-col border-2 border-solid border-white/[.08]">
               <div className="flex flex-row gap-2">
                  <div id="user-avatar">
                     <Avatar.Root className="AvatarRoot">
                        <Avatar.Fallback className="AvatarFallback">{user_name[0]}</Avatar.Fallback>
                     </Avatar.Root>  
                  </div>
                  <div className="flex flex-col gap-2">
                  <span id="user-name-span">{user_name}</span>
                  <span id="user-other-span">{sur_name}</span>   
                  <span id="user-other-span">{age.toString()} years </span>   
                  </div>
               </div>
               <div id="other-info" className="flex flex-col">
                  <div className="flex flex-row">
                     <Box id="user-info-box" className="flex flex-col gap-3 border-2 border-solid border-white/[.08]">
                        <EnvelopeClosedIcon id="icon-email"/>
                        <span>Email</span>
                        <span id="email-span">
                           {email}
                        </span>               
                     </Box>
                     <Box id="user-info-box" className="flex flex-col gap-3 border-2 border-solid border-white/[.08]">
                        <SewingPinFilledIcon id="icon-email"/>
                        <span>City</span>
                        <span id="email-span">
                           {city}
                        </span>         
                     </Box>
                     <Box id="user-info-box" className="flex flex-col gap-3 border-2 border-solid border-white/[.08]">
                        <div id = "icon-phone">
                           <Image 
                              src="/autonomy_gray.png"
                              width={25}
                              height={25}
                              alt="Application`s Logo"
                           />        
                        </div>
                        <span>Community</span>
                        <span id="email-span">
                           {autonomy}
                        </span>         
                     </Box>
                     <Box id="user-info-box" className="flex flex-col gap-3 border-2 border-solid border-white/[.08]">
                     <GlobeIcon id="icon-email"/>
                     <span>Country</span>
                     <span id="email-span">
                           {country}
                     </span>         
                     </Box>
                  </div>
                  <div className="flex flex-row">
                     <Box id="user-info-box" className="flex flex-col gap-3 border-2 border-solid border-white/[.08]">
                        <div id = "icon-phone">
                           <Image 
                              src="/phone.png"
                              width={25}
                              height={25}
                              alt="Application`s Logo"
                           />        
                        </div>
                     <span id="phone-user" >Phone</span>
                     <span id="email-span">
                        {phone}
                     </span>         
                     </Box>
                     
                     <Box id="user-info-box" className="flex flex-col gap-3 border-2 border-solid border-white/[.08]">
                        <PersonIcon id="icon-email"/>
                        <span>User type</span>
                        <span id="email-span">
                           {isOrganizer ? "Organizer" : "assistant"}
                        </span>               
                     </Box>
                     <Box id="user-info-box" className="flex flex-col gap-3 border-2 border-solid border-white/[.08]">
                        <TimerIcon id="icon-email"/>
                        <span>Member Since</span>
                        <span id="email-span">
                        {dateMember ? dateMember : "Not registered"}
                        </span>         
                     </Box>
                     <Box id="user-info-box" className="flex flex-col gap-3 border-2 border-solid border-white/[.08]">
                        <ClockIcon id="icon-email"/>
                        <span>Last Login</span>
                        <span id="email-span">
                        {dateLogin ? dateLogin : "Not Logued"}
                        </span>         
                     </Box>
                  </div>
               </div>
            </div>
            {events.length == 0 && myinscriptions.length == 0 &&inscription.length == 0 ? (
                <Box id ="no-box-stadistics" className="border-2 border-solid border-white/[.08]">
                  <MixIcon id = "no-data-icon-stats"/>
                  <label id= "label-no-data-stats">No stadistics to show</label>
                </Box>
              ) : (              
                  <div className="flex flex-row gap-2">                 
                     {isOrganizer ? 
                        <div className="flex flex-col">
                           <div id="events-create" className="flex flex-col border-2 border-solid border-white/[.08]">
                              <span id = "number-events-create">
                                 {events.length}
                              </span>
                              <span id = "label-events-create">Events create</span>
                           </div>
                           <div id="events-create" className="flex flex-col border-2 border-solid border-white/[.08]">
                              <span id = "number-events-create">
                                 {inscriptions}
                              </span>
                              <span id = "label-events-create">Total participants</span>
                           </div>
                           <div id="events-create" className="flex flex-col border-2 border-solid border-white/[.08]">
                              <span id = "number-events-create">
                                 {calculateAverageAttendance()}
                              </span>
                              <span id = "label-events-create">Average attendance</span>
                           </div>
                        </div>
                     :
                     <>
                     <div className="flex flex-col">
                           <div id="events-create" className="flex flex-col border-2 border-solid border-white/[.08]">
                              <span id="number-events-create">
                                 {myinscriptions.length ? myinscriptions.length : 0}
                              </span>
                              <span id="label-events-create">Total attended events</span>
                           </div>
                           <div id="events-create" className="flex flex-col border-2 border-solid border-white/[.08]">
                                 <span id="number-events-create">
                                    {findLastAttendedEvent()}
                                 </span>
                                 <span id="label-events-create">Last attended event</span>
                           </div>
                           <div id="events-create" className="flex flex-col border-2 border-solid border-white/[.08]">
                                 <span id="number-events-create">
                                    {myReviews.length ? myReviews.length : 0}
                                 </span>
                                 <span id="label-events-create">Total reviews made</span>
                           </div>
                        </div></>
                     }
                     <div className="flex flex-col">
                        {isOrganizer ?                
                           <>
                           <div id="total-participants" className="flex flex-col border-2 border-solid border-white/[.08]">
                              <span id="number-events-create">
                                 {findMostFrequentLocation()}
                              </span>
                              <span id="label-events-create">Most frequent location</span>
                           </div>
                           <div id="most-attended-event" className="flex flex-col border-2 border-solid border-white/[.08]">
                              {calculateMostAttendedEvent().length === 0 ? (
                                    <><MixIcon id="no-data-icon-stats2" /><label id="label-no-data-stats2">No reviews to show</label></>
                              ) : (
                              <>
                                 <span id="label-attented-events">Most Attented event</span>
                                 {calculateMostAttendedEvent().map((event, index) => {
                                    const COLORS = ["#A076F9", "#C9B8FF", "#8F6BA8"]; // Oro, plata, bronce
                                    const normalizedAttendance = (event.attendance).toFixed(2); // Normaliza el attendance

                                    return (
                                       <div
                                          key={event.event_id} id="top-three"
                                          className="flex items-center gap-4 bg-purple-700 rounded-lg p-4"
                                          style={{ backgroundColor: COLORS[index] || "#6B46C1" }} // Usa colores personalizados para los primeros 3
                                       >
                                          <div className="w-8 h-9 flex items-center justify-center rounded-full text-black font-bold"
                                             style={{ backgroundColor: COLORS[index] }}
                                          >
                                             {index + 1}
                                          </div>
                                          <div className="flex-1 text-white font-medium">
                                             {event.event_name}
                                          </div>
                                          <div className="text-white font-bold">
                                             {normalizedAttendance}
                                          </div>
                                       </div>
                                    );
                                 })}
                              </>
                           )}

                           </div>                       
                        </>
                        : 
                        <>
                           <div id="total-participants" className="flex flex-col border-2 border-solid border-white/[.08]">
                              <span id="number-events-create">
                                 {findFavouriteLocation()}
                              </span>
                              <span id="label-events-create">Favourite Location</span>
                           </div>
                           <div id="total-participants" className="flex flex-col border-2 border-solid border-white/[.08]">
                              <div className="flex flex-row">
                                 <StarFilledIcon id="star-review-info"/>
                                 <span id="average-review-score">
                                    {calculateAverageReviewScore()}
                                 </span>
                              </div>
                              <span id="label-events-create">Average review score</span>
                           </div>
                           <div id="total-participants" className="flex flex-col border-2 border-solid border-white/[.08]">
                              <span id="number-events-create">
                                 {bestEvent}
                              </span>
                              <span id="label-events-create">Event with best position</span>
                           </div>
                        </>   
                        }
                     </div>                               
                  </div>
               )
            }            
            <div className="flex flex-row">
               {isOrganizer ?      
                  <div id="participants-by-category" className="flex flex-col border-2 border-solid border-white/[.08]">
                     {prepareChartData().length == 0 ? (
                       <><MixIcon id="no-data-icon-stats2"/><label id="label-no-data-stats2">No stadistics to show</label></>
                     ) : (
                        <>
                        <span id="label-participants"> Participants by category </span>
                        <div className="flex flex-row">
                           <PieChart width={470} height={292}>
                              <Pie
                                 data={prepareChartData()}
                                 dataKey="value"
                                 nameKey="name"
                                 cx="50%"
                                 cy="50%"
                                 outerRadius={150}
                                 fill="#8884d8"
                              >
                                 {prepareChartData().map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                 ))}
                              </Pie>
                              <Tooltip />
                              <Legend id="cheese-legend" layout="vertical" align="right" verticalAlign="middle" />
                           </PieChart>
                        </div> 
                        </>
                     )}
                  </div>
                  :
                  <div id="participants-by-category" className="flex flex-col border-2 border-solid border-white/[.08]">
                    {prepareChartDataMyInscriptions().length == 0 ? (
                       <><MixIcon id="no-data-icon-stats2" /><label id="label-no-data-stats2">No stadistics to show</label></>
                     ) : (
                        <>
                        <span id="label-participants"> Participations by type </span>
                        <div className="flex flex-row">
                           <PieChart width={470} height={292}>
                              <Pie
                                 data={prepareChartDataMyInscriptions()}
                                 dataKey="value"
                                 nameKey="name"
                                 cx="50%"
                                 cy="50%"
                                 outerRadius={150}
                                 fill="#8884d8"
                              >
                                 {prepareChartDataMyInscriptions().map((entry, index) => (
                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                 ))}
                              </Pie>
                              <Tooltip />
                              <Legend id="cheese-legend" layout="vertical" align="right" verticalAlign="middle" />
                           </PieChart>
                        </div> 
                        </>
                     )}
                  </div>
               }
            </div>
         </div>
         {events.length == 0 && myinscriptions.length ==0 && inscription.length == 0 ? (
            <div id ="no-box-barchart" className="border-2 border-solid border-white/[.08]">
               <MixIcon id = "no-data-icon-stats3"/>
               <label id= "label-no-data-stats3">No stadistics to show</label>
            </div>
         ) : (
            <div className="flex flex-row">
               <div className="flex flex-col">
                  <div className="flex flex-row">
                     {isOrganizer ?                      
                        <div id="rating-info" className="flex flex-col border-2 border-solid border-white/[.08]">                     
                           <span id="label-rating"> Mean event rating </span>
                           <div id ="bar-chart">
                              <BarChart width={770} height={320} data={prepareBarChartData()}>
                                 <XAxis dataKey="name" stroke="#cccccc" />
                                 <YAxis stroke="#cccccc"/>
                                 <Tooltip />
                                 <Legend formatter={(value) => `Average Rating`}/>
                                 <Bar dataKey="value" fill="#9966CC" />
                              </BarChart>
                           </div>
                        </div>
                     :
                        <div id="rating-info" className="flex flex-col border-2 border-solid border-white/[.08]">                                          
                           <span id="label-rating"> Number of inscriptions over the time </span>
                           <div id ="line-chart">
                              <LineChart width={1225} height={300} data={prepareBarLineDataUser()}>
                              <XAxis dataKey="name" stroke="#cccccc" />
                              <YAxis stroke="#cccccc" />
                              <Tooltip />
                              <Legend formatter={(value) => `Number of inscriptions`} />
                              <Line type="monotone" dataKey="value" stroke="#8884d8" />
                           </LineChart>
                           </div>   
                        </div>
                     }                 
                  </div>
               </div>              
            <div className="flex flex-row">
                  {isOrganizer ?
                     <div id="number-events-info" className="flex flex-col border-2 border-solid border-white/[.08]">                     
                        <span id="label-rating"> Number of events over time </span>
                        <div id ="line-chart">
                           <LineChart width={900} height={300} data={prepareBarLineData()}>
                              <XAxis dataKey="name" stroke="#cccccc" />
                              <YAxis stroke="#cccccc" />
                              <Tooltip />
                              <Legend formatter={(value) => `Number of Events`} />
                              <Line type="monotone" dataKey="value" stroke="#8884d8" />
                           </LineChart>
                        </div>
                     </div> :
                     <div id="number-events-info" className="flex flex-col border-2 border-solid border-white/[.08]">                     
                        <span id="label-rating"> Stadistics for position </span>
                        <div className="flex flex-col">
                           <div className="flex flex-row gap-4">
                              <div id ="position-stats" className="flex flex-col items-center border-2 border-solid border-white/[.08]">
                                 <div className="flex flex-col gap-2 items-center">
                                    <ArrowTopRightIcon id="icon-position"/>
                                    <span id="span-position"> Best position </span>
                                 </div>
                                 <span id="number-position"> {getOrdinal(best)} </span>
                              </div>
                              <div id ="position-stats" className="flex flex-col items-center border-2 border-solid border-white/[.08]">
                                 <div className="flex flex-col gap-2 items-center">
                                    <ArrowBottomRightIcon id="icon-position"/>
                                    <span id="span-position"> Worst position </span>
                                 </div>
                                 <span id="number-position"> {getOrdinal(worst)} </span>
                              </div>
                              <div id ="position-stats" className="flex flex-col items-center border-2 border-solid border-white/[.08]">
                                 <div className="flex flex-col gap-2 items-center">
                                    <BarChartIcon id="icon-position"/>
                                    <span id="span-position"> Average position </span>
                                 </div>
                                 <span id="number-position"> {getOrdinal(Number(calculateAveragePosition(user_name)))} </span>
                              </div>
                           </div>
                        </div>

                     </div>
                  }
            </div>   
         </div>  
         )}
      </div>
   </div>
   /*
     {isOrganizer ? (
                     <Box id="user-info-box" className="flex flex-col gap-3 border-2 border-solid border-white/[.08]">
                        <ReaderIcon id="icon-email"/>
                        <span>Create Events</span>
                        <span id="email-span">
                        {city}
                        </span>         
                     </Box> 
                  ): (
                     <Box id="user-info-box" className="flex flex-col gap-3 border-2 border-solid border-white/[.08]">
                        <ReaderIcon id="icon-email"/>
                        <span id ="span-registered-events">Registered Events</span>
                        <span id="email-span">
                        {city}
                        </span>         
                     </Box> 
                  )}

    */
   )
}