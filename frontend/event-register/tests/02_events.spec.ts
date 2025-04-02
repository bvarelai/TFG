import { test, expect } from '@playwright/test';

test.describe("Testing AllEvents", () => {
 
    test('View no events', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home' );
        await page.getByTitle('All events');
        const eventNoBoxes = page.locator('#no-box-event');
        await expect(eventNoBoxes).toContainText('No events to show'); 
        await expect(eventNoBoxes).toBeVisible();
    })

    test("Register a event", async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home');
        await page.getByTitle('All events');
        await page.waitForSelector('#create-event', { state: 'visible' });
        await page.locator('#create-event').click();
        await page.locator('#input-event[name="event_name"]').fill('New Event');
        await page.locator('#input-event[name="event_type"]').fill('football');
        await page.locator('#input-event[name="event_edition"]').fill('1st');
        await page.locator('#input-event[name="event_category"]').fill('junior');
        await page.locator('#input-event[name="event_date"]').fill('2025-06-01T10:00');
        await page.locator('#input-event[name="event_end_date"]').fill('2025-06-10T12:00');
        await page.locator('#input-event[name="event_location"]').fill('Madrid');
        await page.locator('#input-event[name="event_description"]').fill('This is a test event.');
        await page.locator('#input-event[name="event_capacity"]').fill('100');
        await page.locator('#button-green').click();
        const newEvent = await page.locator('#heading-event-name', { hasText: 'New Event' });
        await expect(newEvent).toBeVisible();
    })

    test("Register fail when event data are empty", async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home');
        await page.getByTitle('All events');
        await page.waitForSelector('#create-event', { state: 'visible' });
        await page.locator('#create-event').click();
        await page.locator('#input-event[name="event_name"]').fill('');
        await page.locator('#input-event[name="event_type"]').fill('');
        await page.locator('#input-event[name="event_edition"]').fill('');
        await page.locator('#input-event[name="event_category"]').fill('');
        await page.locator('#input-event[name="event_date"]').fill('');
        await page.locator('#input-event[name="event_end_date"]').fill('');
        await page.locator('#input-event[name="event_location"]').fill('');
        await page.locator('#input-event[name="event_description"]').fill('');
        await page.locator('#input-event[name="event_capacity"]').fill('0');
        await page.locator('#button-green').click();
        const errorMessage = page.locator('#callout-root-event-register');
        await expect(errorMessage).toContainText('Data are required'); 
        await expect(errorMessage).toBeVisible();
    })

    test("Register fail when event places is not valid", async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home');
        await page.getByTitle('All events');
        await page.waitForSelector('#create-event', { state: 'visible' });
        await page.locator('#create-event').click();
        await page.locator('#input-event[name="event_name"]').fill('New Event');
        await page.locator('#input-event[name="event_type"]').fill('football');
        await page.locator('#input-event[name="event_edition"]').fill('1st');
        await page.locator('#input-event[name="event_category"]').fill('junior');
        await page.locator('#input-event[name="event_date"]').fill('2025-06-01T10:00');
        await page.locator('#input-event[name="event_end_date"]').fill('2025-06-10T12:00');
        await page.locator('#input-event[name="event_location"]').fill('Madrid');
        await page.locator('#input-event[name="event_description"]').fill('This is a test event.');
        await page.locator('#input-event[name="event_capacity"]').fill('-5');
        await page.locator('#button-green').click();
        const errorMessage = page.locator('#callout-root-event-register');
        await expect(errorMessage).toContainText('The capacity is not valid'); 
        await expect(errorMessage).toBeVisible();
    })

    test("Register fail when event description is not valid", async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home');
        await page.getByTitle('All events');
        await page.waitForSelector('#create-event', { state: 'visible' });
        await page.locator('#create-event').click();
        await page.locator('#input-event[name="event_name"]').fill('New Event');
        await page.locator('#input-event[name="event_type"]').fill('football');
        await page.locator('#input-event[name="event_edition"]').fill('1st');
        await page.locator('#input-event[name="event_category"]').fill('junior');
        await page.locator('#input-event[name="event_date"]').fill('2025-06-01T10:00');
        await page.locator('#input-event[name="event_end_date"]').fill('2025-06-10T12:00');
        await page.locator('#input-event[name="event_location"]').fill('Madrid');
        await page.locator('#input-event[name="event_description"]').fill('New Event is the perfect experience for innovators and creatives. Join a day filled with inspiration, networking, and learning from experts. Enjoy unique moments that will boost your vision and success.');        await page.locator('#input-event[name="event_capacity"]').fill('100');
        await page.locator('#input-event[name="event_capacity"]').fill('100');
        await page.locator('#button-green').click();
        const errorMessage = page.locator('#callout-root-event-register');
        await expect(errorMessage).toContainText('Description must not exceed 30 words.'); 
        await expect(errorMessage).toBeVisible();
    })


    test("Register fail when event dates are not valid", async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home');
        await page.getByTitle('All events');
        await page.waitForSelector('#create-event', { state: 'visible' });
        await page.locator('#create-event').click();
        await page.locator('#input-event[name="event_name"]').fill('New Event');
        await page.locator('#input-event[name="event_type"]').fill('football');
        await page.locator('#input-event[name="event_edition"]').fill('1st');
        await page.locator('#input-event[name="event_category"]').fill('junior');
        await page.locator('#input-event[name="event_date"]').fill('2025-06-18T10:00');
        await page.locator('#input-event[name="event_end_date"]').fill('2025-06-10T12:00');
        await page.locator('#input-event[name="event_location"]').fill('Madrid');
        await page.locator('#input-event[name="event_description"]').fill('This is a test event.');
        await page.locator('#input-event[name="event_capacity"]').fill('100');
        await page.locator('#button-green').click();
        const errorMessage = page.locator('#callout-root-event-register');
        await expect(errorMessage).toContainText('End date must be after the start date'); 
        await expect(errorMessage).toBeVisible();        
    })

    test('View events', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });  
        await page.goto('/home');
        await page.getByTitle('All events');
        const newEvent = await page.locator('#heading-event-name', { hasText: 'New Event' });
        await expect(newEvent).toBeVisible();
    })

    test('View events with search by name', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });  
        await page.goto('/home');
        await page.getByTitle('All events');
        await page.getByPlaceholder('Search the events…',{exact: true}).fill('New Event')
        const eventBoxes = page.locator('#box-event');
        await expect(eventBoxes).toBeVisible();
    })

    test('View no events with search by name wrong', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });  
        await page.goto('/home');
        await page.getByTitle('All events');
        await page.getByPlaceholder('Search the events…',{exact: true}).fill('Name')
        const eventBoxes = page.locator('#no-box-event');
        await expect(eventBoxes).toBeVisible();
    })

    test('View events with filter by category', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });  
        await page.goto('/home');
        await page.getByTitle('All events');
        await page.locator('#filter-by-category').click();
        await page.getByRole('option', { name: 'junior' }).click();
        const eventBoxes = page.locator('#box-event');
        await expect(eventBoxes).toBeVisible();
    })
    
    test('View no events with filter by category', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });  
        await page.goto('/home');
        await page.getByTitle('All events');
        await page.locator('#filter-by-category').click();
        await page.getByText('general').click()
        const eventBoxes = page.locator('#no-box-event');
        await expect(eventBoxes).toBeVisible();
    })
    
    test('View events with filter by type', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });  
        await page.goto('/home');
        await page.getByTitle('All events');
        await page.locator('#filter-by-category').click();
        await page.getByText('football').click()
        const eventBoxes = page.locator('#box-event');
        await expect(eventBoxes).toBeVisible();
    })
  
    test('View no events with filter by type', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });  
        await page.goto('/home');
        await page.getByTitle('All events');
        await page.locator('#filter-by-category').click();
        await page.getByText('basketball').click()
        const eventBoxes = page.locator('#no-box-event');
        await expect(eventBoxes).toBeVisible();
    }) 


    test('View events with filter by capacity', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });  
        await page.goto('/home');
        await page.getByTitle('All events');
        await page.locator('#filter-by-category').click();
        await page.getByText('> 50 y < 200').click();
        const eventBoxes = page.locator('#box-event');
        await expect(eventBoxes).toBeVisible();
    })

    test('View no events with filter by capacity', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });  
        await page.goto('/home');
        await page.getByTitle('All events');
        await page.locator('#filter-by-category').click();
        await page.getByText('> 200').click();
        const eventBoxes = page.locator('#no-box-event');
        await expect(eventBoxes).toBeVisible();
    }) 

    test('View events with search by dates', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });  
        await page.goto('/home');
        await page.getByTitle('All events');
        await page.locator('#input-date[name="event_date"]').fill('2025-06-01T10:00');
        await page.locator('#input-date[name="event_end_date"]').fill('2025-06-10T12:00');            
        const eventBoxes = page.locator('#box-event');
        await expect(eventBoxes).toBeVisible();
    }) 

    test('View no events with search by dates', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });  
        await page.goto('/home');
        await page.getByTitle('All events');
        await page.locator('#input-date[name="event_date"]').fill('2025-06-11T10:00');
        await page.locator('#input-date[name="event_end_date"]').fill('2025-06-22T12:00');            
        const eventBoxes = page.locator('#no-box-event');
        await expect(eventBoxes).toBeVisible();
    }) 



    test("Register a inscription", async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('user');
        await page.getByPlaceholder('Password', {exact: true}).fill('password456');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home');
        await page.getByTitle('All events');
        const newEvent = await page.locator('#heading-event-name', { hasText: 'New Event' });
        await newEvent.click();
        await page.locator('#button-green-inscription').click();
        await page.locator('#myinscriptions-button').click();
        const eventBoxes = page.locator('#box-myinscription');
        await expect(eventBoxes).toBeVisible();
    })

    test("Register failed when inscription exist", async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('user');
        await page.getByPlaceholder('Password', {exact: true}).fill('password456');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home');
        await page.getByTitle('All events');
        const newEvent = await page.locator('#heading-event-name', { hasText: 'New Event' });
        await newEvent.click();
        await page.locator('#button-green-inscription').click();
        const Event = await page.locator('#heading-event-name', { hasText: 'New Event' });
        await Event.click();
        const errorMessage = page.locator('#callout-root-event-register-inscription');
        await expect(errorMessage).toContainText('You are already register in this event'); 
        await expect(errorMessage).toBeVisible();        
    })
})

