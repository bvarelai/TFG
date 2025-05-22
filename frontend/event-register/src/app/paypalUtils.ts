export const registerInscription = async (
  event: any,
  user_id: number,
  event_name: string,
  event_type: string,
  event_edition: string,
  category: string,
  category_inscription: string,
  event_description: string,
  location: string,
  celebration_date: string,
  end_date: string,
  capacity: number,
  organizer_by: string,
  event_full_description: string,
  language: string,
  is_free: boolean
) => {
  const formDetails = {
    "event_id" : event.event_id,
    "user_id" : user_id,
    "event_name" : event_name,
    "inscription_date" : "2022-12-12T12:12:12",
    "start_date" : celebration_date,
    "end_date" : end_date,
    "location" : location,
    "category_inscription" : category_inscription,
    "type_inscription" : event_type
  };

  const responseInscription = await fetch('http://localhost:8000/inscription/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formDetails),
  });

  if (!responseInscription.ok) {
    return false;
  }

  const formDetailsEvent = 
  {
    "event_name" : event_name,
    "event_type" : event_type,  
    "event_edition" :  event_edition,
    "event_description" : event_description,
    "category": category,
    "location"  : location,
    "celebration_date"  : celebration_date,
    "end_date" : end_date,
    "capacity" : capacity - 1,
    "organizer_by" : organizer_by,
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
        return false;
    }
    return true;
};