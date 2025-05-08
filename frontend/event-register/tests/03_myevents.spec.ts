import { test, expect } from '@playwright/test';

test.describe("Testing MyEvents", () => {

    test('View myevents', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home' );
        await page.locator('#myevents-button').click();
        await page.getByTitle('My events');
        const myeventBox1 = page.locator('#box-myevent[data-event-id="1"]');
        const myeventBox2 = page.locator('#box-myevent[data-event-id="2"]');
        await expect(myeventBox1).toBeVisible();      
        await expect(myeventBox2).toBeVisible();      
    })

    test('Update a event', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home' );
        await page.locator('#myevents-button').click();
        await page.getByTitle('My events');
        const myeventBoxes = page.locator('#box-myevent' , { hasText: 'Event finished' });
        await expect(myeventBoxes).toBeVisible(); 
        await myeventBoxes.locator('#icon-myevent-update').click();
        await page.locator('#input-event[name="event_name"]').fill('Event finished');
        await page.locator('#input-event[name="event_type"]').fill('basketball');
        await page.locator('#input-event[name="event_edition"]').fill('2024-2025');
        await page.locator('#input-event[name="event_category"]').fill('junior');
        await page.locator('#input-event[name="event_date"]').fill('2025-04-06T10:00');
        await page.locator('#input-event[name="event_end_date"]').fill('2025-04-10T12:00');
        await page.locator('#input-event[name="event_location"]').fill('Madrid');
        await page.locator('#input-event[name="event_capacity"]').fill('100');
        await page.locator('#input-event-large[name="event_description"]').fill('This is a test event.');
        await page.locator('#input-event[name="organizer-by"]').fill('Organizer');
        await page.locator('#input-event[name="duration"]').fill('5');
        await page.locator('#input-event[name="language"]').fill('English');
        await page.locator('#input-event-big[name="description"]').fill('This is a test event.');
        await page.locator('#button-green').click();
        const newEvent = await page.locator('#heading-event-name', { hasText: 'New Event' });
        await expect(newEvent).toBeVisible();
    })

    test('Update fail when event data are empty', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home' );
        await page.locator('#myevents-button').click();
        await page.getByTitle('My events');
        const myeventBoxes = page.locator('#box-myevent' , { hasText: 'New Event' });
        await expect(myeventBoxes).toBeVisible(); 
        await myeventBoxes.locator('#icon-myevent-update').click();
        await page.locator('#input-event[name="event_name"]').fill('');
        await page.locator('#input-event[name="event_type"]').fill('');
        await page.locator('#input-event[name="event_edition"]').fill('');
        await page.locator('#input-event[name="event_category"]').fill('');
        await page.locator('#input-event[name="event_date"]').fill('');
        await page.locator('#input-event[name="event_end_date"]').fill('');
        await page.locator('#input-event[name="event_location"]').fill('');
        await page.locator('#input-event[name="event_capacity"]').fill('0');
        await page.locator('#input-event-large[name="event_description"]').fill('');
        await page.locator('#input-event[name="organizer-by"]').fill('');
        await page.locator('#input-event[name="duration"]').fill('');
        await page.locator('#input-event[name="language"]').fill('');
        await page.locator('#input-event-big[name="description"]').fill('');
        await page.locator('#button-green').click();
        const errorMessage = page.locator('#callout-root-event-update');
        await expect(errorMessage).toContainText('Data are required'); 
        await page.waitForTimeout(2000);
        await expect(errorMessage).not.toBeVisible();
    })

    test('Update fail when event places is not valid', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home' );
        await page.locator('#myevents-button').click();
        await page.getByTitle('My events');
        const myeventBoxes = page.locator('#box-myevent' , { hasText: 'New Event' });
        await expect(myeventBoxes).toBeVisible(); 
        await myeventBoxes.locator('#icon-myevent-update').click();
        await page.locator('#input-event[name="event_name"]').fill('New Event');
        await page.locator('#input-event[name="event_type"]').fill('football');
        await page.locator('#input-event[name="event_edition"]').fill('1st');
        await page.locator('#input-event[name="event_category"]').fill('junior');
        await page.locator('#input-event[name="event_date"]').fill('2025-06-01T10:00');
        await page.locator('#input-event[name="event_end_date"]').fill('2025-06-10T12:00');
        await page.locator('#input-event[name="event_location"]').fill('Madrid');
        await page.locator('#input-event[name="event_capacity"]').fill('-5');
        await page.locator('#input-event-large[name="event_description"]').fill('This is a test event.');
        await page.locator('#input-event[name="organizer-by"]').fill('Organizer');
        await page.locator('#input-event[name="duration"]').fill('5');
        await page.locator('#input-event[name="language"]').fill('English');
        await page.locator('#input-event-big[name="description"]').fill('This is a test event.');
        await page.locator('#button-green').click();
        const errorMessage = page.locator('#callout-root-event-update');
        await expect(errorMessage).toContainText('The capacity is not valid'); 
        await page.waitForTimeout(2000);
        await expect(errorMessage).not.toBeVisible();
    })

    test('Update fail when event duration is not valid', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home' );
        await page.locator('#myevents-button').click();
        await page.getByTitle('My events');
        const myeventBoxes = page.locator('#box-myevent' , { hasText: 'New Event' });
        await expect(myeventBoxes).toBeVisible(); 
        await myeventBoxes.locator('#icon-myevent-update').click();
        await page.locator('#input-event[name="event_name"]').fill('New Event');
        await page.locator('#input-event[name="event_type"]').fill('football');
        await page.locator('#input-event[name="event_edition"]').fill('1st');
        await page.locator('#input-event[name="event_category"]').fill('junior');
        await page.locator('#input-event[name="event_date"]').fill('2025-06-01T10:00');
        await page.locator('#input-event[name="event_end_date"]').fill('2025-06-10T12:00');
        await page.locator('#input-event[name="event_location"]').fill('Madrid');
        await page.locator('#input-event[name="event_capacity"]').fill('5');
        await page.locator('#input-event-large[name="event_description"]').fill('This is a test event.');
        await page.locator('#input-event[name="organizer-by"]').fill('Organizer');
        await page.locator('#input-event[name="duration"]').fill('-5');
        await page.locator('#input-event[name="language"]').fill('English');
        await page.locator('#input-event-big[name="description"]').fill('This is a test event.');
        await page.locator('#button-green').click();
        const errorMessage = page.locator('#callout-root-event-update');
        await expect(errorMessage).toContainText('The duration is not valid'); 
        await page.waitForTimeout(2000);
        await expect(errorMessage).not.toBeVisible();
    })

    test("Update fail when event description is not valid", async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home' );
        await page.locator('#myevents-button').click();
        await page.getByTitle('My events');
        const myeventBoxes = page.locator('#box-myevent' , { hasText: 'New Event' });
        await expect(myeventBoxes).toBeVisible(); 
        await myeventBoxes.locator('#icon-myevent-update').click();
        await page.locator('#input-event[name="event_name"]').fill('New Event');
        await page.locator('#input-event[name="event_type"]').fill('football');
        await page.locator('#input-event[name="event_edition"]').fill('1st');
        await page.locator('#input-event[name="event_category"]').fill('junior');
        await page.locator('#input-event[name="event_date"]').fill('2025-06-01T10:00');
        await page.locator('#input-event[name="event_end_date"]').fill('2025-06-10T12:00');
        await page.locator('#input-event[name="event_location"]').fill('Madrid');
        await page.locator('#input-event[name="event_capacity"]').fill('100');
        await page.locator('#input-event-large[name="event_description"]').fill('New Event is the perfect experience for innovators and creatives. Join a day filled with inspiration, networking, and learning from experts. Enjoy unique moments that will boost your vision and success.');        
        await page.locator('#input-event[name="event_capacity"]').fill('100');
        await page.locator('#input-event[name="organizer-by"]').fill('Organizer');
        await page.locator('#input-event[name="duration"]').fill('5');
        await page.locator('#input-event[name="language"]').fill('English');
        await page.locator('#input-event-big[name="description"]').fill('This is a test event.');
        await page.locator('#button-green').click();
        const errorMessage = page.locator('#callout-root-event-update');
        await expect(errorMessage).toContainText('Description must not exceed 30 words.'); 
        await page.waitForTimeout(2000);
        await expect(errorMessage).not.toBeVisible();
    })
    
    test('Update fail when event dates are not valid', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home' );
        await page.locator('#myevents-button').click();
        await page.getByTitle('My events');
        const myeventBoxes = page.locator('#box-myevent', { hasText: 'New Event' });
        await expect(myeventBoxes).toBeVisible(); 
        await myeventBoxes.locator('#icon-myevent-update').click();
        await page.locator('#input-event[name="event_name"]').fill('New Event');
        await page.locator('#input-event[name="event_type"]').fill('football');
        await page.locator('#input-event[name="event_edition"]').fill('1st');
        await page.locator('#input-event[name="event_category"]').fill('junior');
        await page.locator('#input-event[name="event_date"]').fill('2025-06-18T10:00');
        await page.locator('#input-event[name="event_end_date"]').fill('2025-06-10T12:00');
        await page.locator('#input-event[name="event_location"]').fill('Madrid');
        await page.locator('#input-event[name="event_capacity"]').fill('100');
        await page.locator('#input-event-large[name="event_description"]').fill('This is a test event.');
        await page.locator('#input-event[name="organizer-by"]').fill('Organizer');
        await page.locator('#input-event[name="duration"]').fill('5');
        await page.locator('#input-event[name="language"]').fill('English');
        await page.locator('#input-event-big[name="description"]').fill('This is a test event.');
        await page.locator('#button-green').click();
        const errorMessage = page.locator('#callout-root-event-update');
        await expect(errorMessage).toContainText('End date must be after the start date'); 
        await page.waitForTimeout(2000);
        await expect(errorMessage).not.toBeVisible();
    })
    
    
    test('Delete a event', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home' );
        await page.locator('#myevents-button').click();
        await page.getByTitle('My events');
        const specificEvent = page.locator('#box-myevent[data-event-id="1"]'); // Reemplaza "123" con el ID del evento
        await expect(specificEvent).toBeVisible();
        await specificEvent.locator('#icon-myevent-delete').click();
        await page.getByRole('button', { name: 'Delete' }).click();
        await expect(specificEvent).not.toBeVisible();
    })

    test('Upload event result', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home' );
        await page.locator('#myevents-button').click();
        await page.getByTitle('My events');
        const myeventBoxes = page.locator('#box-myevent[data-event-id="2"]');
        await expect(myeventBoxes).toBeVisible(); 
        await myeventBoxes.locator('#file-myevent').click();
        const filePath = 'C:/Users/admin/University y mas/University/TFG/GIT/champions_league_general_v2.csv';
        await page.locator('#input-upload').setInputFiles(filePath);
        await page.locator('#filter-by-edition-event').click();
        await page.locator('.SelectItem', { hasText: 'junior' }).click(); // Selecciona la opción "general"
        await page.locator('#button-upload').click();
        const successMessage = page.locator('#callout-root-upload');
        await expect(successMessage).toContainText('File uploaded successfully');
    })


    test('Fail upload event result with no file', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home' );
        await page.locator('#myevents-button').click();
        await page.getByTitle('My events');
        const myeventBoxes = page.locator('#box-myevent[data-event-id="2"]');
        await expect(myeventBoxes).toBeVisible();   
        await myeventBoxes.locator('#file-myevent').click();
        await page.locator('#button-upload').click();
        const successMessage = page.locator('#callout-root-upload-error');
        await expect(successMessage).toContainText('A CSV file and a category are required.');
    })

    test('Fail Upload event result with file not allowed', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home' );
        await page.locator('#myevents-button').click();
        await page.getByTitle('My events');
        const myeventBoxes = page.locator('#box-myevent[data-event-id="2"]');
        await expect(myeventBoxes).toBeVisible();   
        await myeventBoxes.locator('#file-myevent').click();
        const filePath = 'C:/Users/admin/University y mas/University/TFG/logo.jpg'; // Reemplaza con la ruta de tu archivo CSV
        await page.locator('#input-upload').setInputFiles(filePath);
        await page.locator('#filter-by-edition-event').click();
        await page.locator('.SelectItem', { hasText: 'junior' }).click(); // Selecciona la opción "general"
        await page.locator('#button-upload').click();
        const successMessage = page.locator('#callout-root-upload-error');
        await expect(successMessage).toContainText('Only CSV files are allowed');
    })
})