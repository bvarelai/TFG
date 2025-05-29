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
        await page.locator('#input-event[name="event_edition"]').fill('2024-2025');
        await page.locator('#input-event[name="event_category"]').fill('junior');
        await page.locator('#input-event[name="event_date"]').fill('2025-06-01T10:00');
        await page.locator('#input-event[name="event_end_date"]').fill('2025-06-10T12:00');
        await page.locator('#input-event[name="event_location"]').fill('Madrid');
        await page.locator('#input-event[name="event_capacity"]').fill('100');
        await page.locator('#input-event-large[name="event_description"]').fill('This is a test event.');
        await page.locator('#input-event-large[name="organizer-by"]').fill('Organizer');
        await page.locator('#input-event[name="price"]').fill('20');
        await page.locator('#input-event-big[name="description"]').fill('This is a test event.');
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
        await page.locator('#input-event[name="event_capacity"]').fill('0');
        await page.locator('#input-event-large[name="event_description"]').fill('');
        await page.locator('#input-event-large[name="organizer-by"]').fill('');
        await page.locator('#input-event[name="price"]').fill('');
        await page.locator('#input-event-big[name="description"]').fill('');
        await page.locator('#button-green').click();
        const errorMessage = page.locator('#callout-root-event-register');
        await expect(errorMessage).toContainText('Data are required'); 
        await page.waitForTimeout(2000);
        await expect(errorMessage).not.toBeVisible();
    })

     test("Register fail when event name is not valid ", async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home');
        await page.getByTitle('All events');
        await page.waitForSelector('#create-event', { state: 'visible' });
        await page.locator('#create-event').click();
        await page.locator('#input-event[name="event_name"]').fill('International Innovation and Entrepreneurship Summit');
        await page.locator('#input-event[name="event_type"]').fill('football');
        await page.locator('#input-event[name="event_edition"]').fill('2024-2025');
        await page.locator('#input-event[name="event_category"]').fill('junior');
        await page.locator('#input-event[name="event_date"]').fill('2025-06-01T10:00');
        await page.locator('#input-event[name="event_end_date"]').fill('2025-06-10T12:00');
        await page.locator('#input-event[name="event_location"]').fill('Madrid');
        await page.locator('#input-event[name="event_capacity"]').fill('100');
        await page.locator('#input-event-large[name="event_description"]').fill('This is a test event.');
        await page.locator('#input-event-large[name="organizer-by"]').fill('Organizer');
        await page.locator('#input-event[name="price"]').fill('20');
        await page.locator('#input-event-big[name="description"]').fill('This is a test event.');
        await page.locator('#button-green').click();
        const errorMessage = page.locator('#callout-root-event-register');
        await expect(errorMessage).toContainText('Event name must not exceed 20 letters.'); 
        await page.waitForTimeout(2000);
        await expect(errorMessage).not.toBeVisible();
    })

    test("Register fail when event category is not valid", async({page}) => {
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
        await page.locator('#input-event[name="event_category"]').fill('category');
        await page.locator('#input-event[name="event_date"]').fill('2025-06-01T10:00');
        await page.locator('#input-event[name="event_end_date"]').fill('2025-06-10T12:00');
        await page.locator('#input-event[name="event_location"]').fill('Madrid');
        await page.locator('#input-event[name="event_capacity"]').fill('5');
        await page.locator('#input-event-large[name="event_description"]').fill('This is a test event.');
        await page.locator('#input-event-large[name="organizer-by"]').fill('Organizer');
        await page.locator('#input-event[name="price"]').fill('20');
        await page.locator('#input-event-big[name="description"]').fill('This is a test event.');
        await page.locator('#button-green').click();
        const errorMessage = page.locator('#callout-root-event-register');
        await expect(errorMessage).toContainText('Invalid category'); 
        await page.waitForTimeout(2000);
        await expect(errorMessage).not.toBeVisible();
    })
    
    
     test("Register fail when event type is not valid ", async({page}) => {
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
        await page.locator('#input-event[name="event_type"]').fill('type');
        await page.locator('#input-event[name="event_edition"]').fill('2024-2025');
        await page.locator('#input-event[name="event_category"]').fill('junior');
        await page.locator('#input-event[name="event_date"]').fill('2025-06-01T10:00');
        await page.locator('#input-event[name="event_end_date"]').fill('2025-06-10T12:00');
        await page.locator('#input-event[name="event_location"]').fill('Madrid');
        await page.locator('#input-event[name="event_capacity"]').fill('100');
        await page.locator('#input-event-large[name="event_description"]').fill('This is a test event.');
        await page.locator('#input-event-large[name="organizer-by"]').fill('Organizer');
        await page.locator('#input-event[name="price"]').fill('20');
        await page.locator('#input-event-big[name="description"]').fill('This is a test event.');
        await page.locator('#button-green').click();
        const errorMessage = page.locator('#callout-root-event-register');
        await expect(errorMessage).toContainText('Invalid event type'); 
        await page.waitForTimeout(2000);
        await expect(errorMessage).not.toBeVisible();
    })

    

     test("Register fail when event edition is not valid ", async({page}) => {
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
        await page.locator('#input-event[name="event_edition"]').fill('edition');
        await page.locator('#input-event[name="event_category"]').fill('junior');
        await page.locator('#input-event[name="event_date"]').fill('2025-06-01T10:00');
        await page.locator('#input-event[name="event_end_date"]').fill('2025-06-10T12:00');
        await page.locator('#input-event[name="event_location"]').fill('Madrid');
        await page.locator('#input-event[name="event_capacity"]').fill('100');
        await page.locator('#input-event-large[name="event_description"]').fill('This is a test event.');
        await page.locator('#input-event-large[name="organizer-by"]').fill('Organizer');
        await page.locator('#input-event[name="price"]').fill('20');
        await page.locator('#input-event-big[name="description"]').fill('This is a test event.');
        await page.locator('#button-green').click();
        const errorMessage = page.locator('#callout-root-event-register');
        await expect(errorMessage).toContainText('Invalid event edition format'); 
        await page.waitForTimeout(2000);
        await expect(errorMessage).not.toBeVisible();
    })

    test("Register fail when event price is not valid ", async({page}) => {
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
        await page.locator('#input-event[name="event_edition"]').fill('2024-2025');
        await page.locator('#input-event[name="event_category"]').fill('junior');
        await page.locator('#input-event[name="event_date"]').fill('2025-06-01T10:00');
        await page.locator('#input-event[name="event_end_date"]').fill('2025-06-10T12:00');
        await page.locator('#input-event[name="event_location"]').fill('Madrid');
        await page.locator('#input-event[name="event_capacity"]').fill('100');
        await page.locator('#input-event-large[name="event_description"]').fill('This is a test event.');
        await page.locator('#input-event-large[name="organizer-by"]').fill('Organizer');
        await page.locator('#input-event[name="price"]').fill('-23');
        await page.locator('#input-event-big[name="description"]').fill('This is a test event.');
        await page.locator('#button-green').click();
        const errorMessage = page.locator('#callout-root-event-register');
        await expect(errorMessage).toContainText('The price is not valid'); 
        await page.waitForTimeout(2000);
        await expect(errorMessage).not.toBeVisible();
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
        await page.locator('#input-event[name="event_edition"]').fill('2024-2025');
        await page.locator('#input-event[name="event_category"]').fill('junior');
        await page.locator('#input-event[name="event_date"]').fill('2025-06-01T10:00');
        await page.locator('#input-event[name="event_end_date"]').fill('2025-06-10T12:00');
        await page.locator('#input-event[name="event_location"]').fill('Madrid');
        await page.locator('#input-event[name="event_capacity"]').fill('-5');
        await page.locator('#input-event-large[name="event_description"]').fill('This is a test event.');
        await page.locator('#input-event-large[name="organizer-by"]').fill('Organizer');
        await page.locator('#input-event[name="price"]').fill('20');
        await page.locator('#input-event-big[name="description"]').fill('This is a test event.');
        await page.locator('#button-green').click();
        const errorMessage = page.locator('#callout-root-event-register');
        await expect(errorMessage).toContainText('The capacity is not valid'); 
        await page.waitForTimeout(2000);
        await expect(errorMessage).not.toBeVisible();
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
        await page.locator('#input-event[name="event_edition"]').fill('2024-2025');
        await page.locator('#input-event[name="event_category"]').fill('junior');
        await page.locator('#input-event[name="event_date"]').fill('2025-06-01T10:00');
        await page.locator('#input-event[name="event_end_date"]').fill('2025-06-10T12:00');
        await page.locator('#input-event[name="event_location"]').fill('Madrid');
        await page.locator('#input-event[name="event_capacity"]').fill('100');
        await page.locator('#input-event-large[name="event_description"]').fill('New Event is the perfect experience for innovators and creatives. Join a day filled with inspiration, networking, and learning from experts. Enjoy unique moments that will boost your vision and success.');        
        await page.locator('#input-event-large[name="organizer-by"]').fill('Organizer');
        await page.locator('#input-event[name="price"]').fill('20');
        await page.locator('#input-event-big[name="description"]').fill('This is a test event.');
        await page.locator('#button-green').click();
        const errorMessage = page.locator('#callout-root-event-register');
        await expect(errorMessage).toContainText('Description must not exceed 10 words.'); 
        await page.waitForTimeout(2000);
        await expect(errorMessage).not.toBeVisible();
    })

    test("Register fail when Organizer name is not valid ", async({page}) => {
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
        await page.locator('#input-event[name="event_edition"]').fill('2024-2025');
        await page.locator('#input-event[name="event_category"]').fill('junior');
        await page.locator('#input-event[name="event_date"]').fill('2025-06-01T10:00');
        await page.locator('#input-event[name="event_end_date"]').fill('2025-06-10T12:00');
        await page.locator('#input-event[name="event_location"]').fill('Madrid');
        await page.locator('#input-event[name="event_capacity"]').fill('100');
        await page.locator('#input-event-large[name="event_description"]').fill('This is a test event.');
        await page.locator('#input-event-large[name="organizer-by"]').fill('Innovate Future Group');
        await page.locator('#input-event[name="price"]').fill('20');
        await page.locator('#input-event-big[name="description"]').fill('This is a test event.');
        await page.locator('#button-green').click();
        const errorMessage = page.locator('#callout-root-event-register');
        await expect(errorMessage).toContainText('Organizer name must not exceed 12 letters.'); 
        await page.waitForTimeout(2000);
        await expect(errorMessage).not.toBeVisible();
    })


     test("Register fail when event full description is not valid", async({page}) => {
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
        await page.locator('#input-event[name="event_edition"]').fill('2024-2025');
        await page.locator('#input-event[name="event_category"]').fill('junior');
        await page.locator('#input-event[name="event_date"]').fill('2025-06-01T10:00');
        await page.locator('#input-event[name="event_end_date"]').fill('2025-06-10T12:00');
        await page.locator('#input-event[name="event_location"]').fill('Madrid');
        await page.locator('#input-event[name="event_capacity"]').fill('100');
        await page.locator('#input-event-large[name="event_description"]').fill('This is a test event');        
        await page.locator('#input-event-large[name="organizer-by"]').fill('Organizer');
        await page.locator('#input-event[name="price"]').fill('20');
        await page.locator('#input-event-big[name="description"]').fill('New Event is the perfect experience for innovators and creatives. Join a day filled with inspiration, networking, and learning from experts. Enjoy unique moments that will boost your vision and success.');
        await page.locator('#button-green').click();
        const errorMessage = page.locator('#callout-root-event-register');
        await expect(errorMessage).toContainText('Description must not exceed 30 words.'); 
        await page.waitForTimeout(2000);
        await expect(errorMessage).not.toBeVisible();
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
        await page.locator('#input-event[name="event_edition"]').fill('2024-2025');
        await page.locator('#input-event[name="event_category"]').fill('junior');
        await page.locator('#input-event[name="event_date"]').fill('2025-06-18T10:00');
        await page.locator('#input-event[name="event_end_date"]').fill('2025-06-10T12:00');
        await page.locator('#input-event[name="event_location"]').fill('Madrid');
        await page.locator('#input-event[name="event_capacity"]').fill('100');
        await page.locator('#input-event-large[name="event_description"]').fill('This is a test event.');
        await page.locator('#input-event-large[name="organizer-by"]').fill('Organizer');
        await page.locator('#input-event[name="price"]').fill('20');
        await page.locator('#input-event-big[name="description"]').fill('This is a test event.');
        await page.locator('#button-green').click();
        const errorMessage = page.locator('#callout-root-event-register');
        await expect(errorMessage).toContainText('End date must be after the start date'); 
        await page.waitForTimeout(2000);
        await expect(errorMessage).not.toBeVisible();        
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
        await page.locator('#input-date[name="event_date_search"]').fill('2025-05-29T10:00');
        await page.locator('#input-date[name="event_end_date_search"]').fill('2025-06-10T12:00');            
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
        await page.waitForSelector('#input-date[name="event_date_search"]', { state: 'visible' });
        await page.locator('#input-date[name="event_date_search"]').click();
        await page.locator('#input-date[name="event_date_search"]').fill('2025-06-13T10:00');
        await page.waitForSelector('#input-date[name="event_end_date_search"]', { state: 'visible' });
        await page.locator('#input-date[name="event_end_date_search"]').click();
        await page.locator('#input-date[name="event_end_date_search"]').fill('2025-06-16T12:00');                       
        const eventBoxes = page.locator('#no-box-event');
        await expect(eventBoxes).toBeVisible();
    }) 

    test("Register a finished event", async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home');
        await page.getByTitle('All events');
        await page.waitForSelector('#create-event', { state: 'visible' });
        await page.locator('#create-event').click();
        await page.locator('#input-event[name="event_name"]').fill('Event finished');
        await page.locator('#input-event[name="event_type"]').fill('basketball');
        await page.locator('#input-event[name="event_edition"]').fill('2024-2025');
        await page.locator('#input-event[name="event_category"]').fill('junior,alevin');
        await page.locator('#input-event[name="event_date"]').fill('2025-06-06T10:00');
        await page.locator('#input-event[name="event_end_date"]').fill('2025-06-10T12:00');
        await page.locator('#input-event[name="event_location"]').fill('Madrid');
        await page.locator('#input-event[name="event_capacity"]').fill('100');
        await page.locator('#input-event-large[name="event_description"]').fill('This is a test event.');
        await page.locator('#input-event-large[name="organizer-by"]').fill('Organizer');
        await page.locator('#chekbox-free-event').click();        
        await page.locator('#input-event-big[name="description"]').fill('This is a test event.');
        await page.locator('#button-green').click();
        const newEvent = await page.locator('#heading-event-name', { hasText: 'Event finished' });
        await expect(newEvent).toBeVisible();
    })
 
    test("Register a plublished event", async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home');
        await page.getByTitle('All events');
        await page.waitForSelector('#create-event', { state: 'visible' });
        await page.locator('#create-event').click();
        await page.locator('#input-event[name="event_name"]').fill('Event published');
        await page.locator('#input-event[name="event_type"]').fill('basketball');
        await page.locator('#input-event[name="event_edition"]').fill('2024-2025');
        await page.locator('#input-event[name="event_category"]').fill('junior,alevin');
        await page.locator('#input-event[name="event_date"]').fill('2025-06-06T10:00');
        await page.locator('#input-event[name="event_end_date"]').fill('2025-06-10T12:00');
        await page.locator('#input-event[name="event_location"]').fill('Madrid');
        await page.locator('#input-event[name="event_capacity"]').fill('100');
        await page.locator('#input-event-large[name="event_description"]').fill('This is a test event.');
        await page.locator('#input-event-large[name="organizer-by"]').fill('Organizer');
        await page.locator('#chekbox-free-event').click();        
        await page.locator('#input-event-big[name="description"]').fill('This is a test event.');
        await page.locator('#button-green').click();
        const newEvent = await page.locator('#heading-event-name', { hasText: 'Event published' });
        await expect(newEvent).toBeVisible();
    })

    test("Register a inscription", async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('user');
        await page.getByPlaceholder('Password', {exact: true}).fill('password456');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home');
        await page.getByTitle('All events');
        const newEvent = await page.locator('#heading-event-name', { hasText: 'Event finished' });
        await newEvent.click();
        await page.locator('#button-more-details').click();
        await page.getByTitle('Events results and reviews');
        const event_info = await page.locator('#even-information')
        await expect(event_info).toBeVisible();
        const event_info_header = await page.locator('#event-info-heading');
        await expect(event_info_header).toContainText('Event finished Information');
        const event_info_status = await page.locator('#register-status');
        await expect(event_info_status).toContainText('Not Registered');
        await page.locator('#button-inscription').click();
        await page.locator('#radio-item[value="alevin"]').click();
        await page.locator('#button-realize-inscription').click();
        await expect(event_info_status).toContainText('Registered');        
        await page.locator('#myinscriptions-button').click();
        const eventBoxes = page.locator('#box-myinscription', { hasText: 'Event finished' });
        await expect(eventBoxes).toBeVisible();
    })


    test("Register other inscription", async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('user');
        await page.getByPlaceholder('Password', {exact: true}).fill('password456');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home');
        await page.getByTitle('All events');
        const newEvent = await page.locator('#heading-event-name', { hasText: 'Event published' });
        await newEvent.click();
        await page.locator('#button-more-details').click();
        await page.getByTitle('Events results and reviews');
        const event_info = await page.locator('#even-information')
        await expect(event_info).toBeVisible();
        const event_info_header = await page.locator('#event-info-heading');
        await expect(event_info_header).toContainText('Event published Information');
        const event_info_status = await page.locator('#register-status');
        await expect(event_info_status).toContainText('Not Registered');
        await page.locator('#button-inscription').click();
        await page.locator('#radio-item[value="alevin"]').click();
        await page.locator('#button-realize-inscription').click();
        await expect(event_info_status).toContainText('Registered');        
        await page.locator('#myinscriptions-button').click();
        const eventBoxes = page.locator('#box-myinscription', { hasText: 'Event published' });
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
        const newEvent = await page.locator('#heading-event-name', { hasText: 'Event finished' });
        await newEvent.click();
        await page.locator('#button-more-details').click();
        await page.getByTitle('Events results and reviews');
        const event_info = await page.locator('#even-information')
        await expect(event_info).toBeVisible();
        const event_info_header = await page.locator('#event-info-heading');
        await expect(event_info_header).toContainText('Event finished Information');
        const event_info_status = await page.locator('#register-status');
        await expect(event_info_status).toContainText('Registered');
    })
})

