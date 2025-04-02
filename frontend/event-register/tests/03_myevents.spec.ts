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
        const myeventBoxes = page.locator('#box-myevent');
        await expect(myeventBoxes).toBeVisible();      
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
        const myeventBoxes = page.locator('#box-myevent');
        await expect(myeventBoxes).toBeVisible();   
        const myeventUpdate = page.locator('#icon-myevent-update')
        await myeventUpdate.click();
        await page.locator('#input-event[name="event_name"]').fill('New Event');
        await page.locator('#input-event[name="event_type"]').fill('football');
        await page.locator('#input-event[name="event_edition"]').fill('1st');
        await page.locator('#input-event[name="event_category"]').fill('junior');
        await page.locator('#input-event[name="event_date"]').fill('2025-06-01T10:00');
        await page.locator('#input-event[name="event_end_date"]').fill('2025-06-10T12:00');
        await page.locator('#input-event[name="event_location"]').fill('Madrid');
        await page.locator('#input-event[name="event_description"]').fill('This is a test event.');
        await page.locator('#input-event[name="event_capacity"]').fill('110');
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
        const myeventBoxes = page.locator('#box-myevent');
        await expect(myeventBoxes).toBeVisible();   
        const myeventUpdate = page.locator('#icon-myevent-update')
        await myeventUpdate.click();
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
        const errorMessage = page.locator('#callout-root-event-register-inscription');
        await expect(errorMessage).toContainText('Data are required'); 
        await expect(errorMessage).toBeVisible();
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
        const myeventBoxes = page.locator('#box-myevent');
        await expect(myeventBoxes).toBeVisible();   
        const myeventUpdate = page.locator('#icon-myevent-update')
        await myeventUpdate.click();
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
        const errorMessage = page.locator('#callout-root-event-register-inscription');
        await expect(errorMessage).toContainText('The capacity is not valid'); 
        await expect(errorMessage).toBeVisible();
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
        const myeventBoxes = page.locator('#box-myevent');
        await expect(myeventBoxes).toBeVisible();   
        const myeventUpdate = page.locator('#icon-myevent-update')
        await myeventUpdate.click();
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
        const errorMessage = page.locator('#callout-root-event-register-inscription');
        await expect(errorMessage).toContainText('Description must not exceed 30 words.'); 
        await expect(errorMessage).toBeVisible();
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
        const myeventBoxes = page.locator('#box-myevent');
        await expect(myeventBoxes).toBeVisible();   
        const myeventUpdate = page.locator('#icon-myevent-update')
        await myeventUpdate.click();
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
        const errorMessage = page.locator('#callout-root-event-register-inscription');
        await expect(errorMessage).toContainText('End date must be after the start date'); 
        await expect(errorMessage).toBeVisible();
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
        const myeventBoxes = page.locator('#box-myevent');
        await expect(myeventBoxes).toBeVisible();   
        const myeventUpdate = page.locator('#icon-myevent-delete')
        await myeventUpdate.click();
        await page.getByRole('button',{name: 'Delete'}).click();
        const myeventNoBoxes = page.locator('#no-box-myevent');
        await expect(myeventNoBoxes).toBeVisible();      
    })

})