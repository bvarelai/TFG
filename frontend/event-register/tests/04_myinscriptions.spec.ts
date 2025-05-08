import { test, expect } from '@playwright/test';

test.describe("Testing MyInscriptions", () => {
    
    test('View myinscriptions', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('user');
        await page.getByPlaceholder('Password', {exact: true}).fill('password456');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home' );
        await page.locator('#myinscriptions-button').click();
        await page.getByTitle('My inscriptions');
        const myinscriptionBox1 = page.locator('#box-myinscription', { hasText: 'Event finished' } );
        const myinscriptionBox2 = page.locator('#box-myinscription', { hasText: 'Event published' } );        
        await expect(myinscriptionBox1).toBeVisible();      
        await expect(myinscriptionBox2).toBeVisible();      
    })
    
    test('View inscription information', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('user');
        await page.getByPlaceholder('Password', {exact: true}).fill('password456');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home' );
        await page.locator('#myinscriptions-button').click();
        await page.getByTitle('My inscriptions');
        const myinscriptionBox2 = page.locator('#box-myinscription', { hasText: 'Event published' } );        
        await expect(myinscriptionBox2).toBeVisible(); 
        const myinscriptionBox1 = page.locator('#box-myinscription', { hasText: 'Event finished' } );
        await expect(myinscriptionBox1).toBeVisible(); 
        await myinscriptionBox1.click();
        await page.locator('#button-more-details').click();
        await page.getByTitle('Events results and reviews');
        const event_info = await page.locator('#even-information')
        await expect(event_info).toBeVisible();
        const event_info_header = await page.locator('#event-info-heading');
        await expect(event_info_header).toContainText('Event finished Information');
        const event_info_status = await page.locator('#register-status');
        await expect(event_info_status).toContainText('Registered');
    })

    test('Delete a inscription', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('user');
        await page.getByPlaceholder('Password', {exact: true}).fill('password456');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home');
        await page.locator('#myinscriptions-button').click();
        await page.getByTitle('My inscriptions');
        const myinscriptionBox1 = page.locator('#box-myinscription', { hasText: 'Event finished' } );
        await expect(myinscriptionBox1).toBeVisible();  
        const myinscripitionBox2 = page.locator('#box-myinscription',{hasText: 'Event published' });
        await expect(myinscripitionBox2).toBeVisible();  
        await myinscripitionBox2.locator('#icon-myinscription').click();
        await page.getByRole('button',{name: 'Delete'}).click();
        const myinscriptionBoxes = page.locator('#box-myinscription', { hasText: 'Event finished' });
        await expect(myinscriptionBoxes).toBeVisible();      
    })

})