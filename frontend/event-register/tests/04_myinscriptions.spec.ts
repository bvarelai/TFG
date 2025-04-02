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
        const myeventBoxes = page.locator('#box-myinscription');
        await expect(myeventBoxes).toBeVisible();      
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
        const myeventBoxes = page.locator('#box-myinscription');
        await expect(myeventBoxes).toBeVisible();      
        await myeventBoxes.click();
        const locationInscription = page.locator('#info-members-myinscription-div');
        await expect(locationInscription).toContainText('Madrid'); 
        await expect(locationInscription).toBeVisible();
    })

    test('Delete a inscription', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('user');
        await page.getByPlaceholder('Password', {exact: true}).fill('password456');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });    
        await page.goto('/home' );
        await page.locator('#myinscriptions-button').click();
        await page.getByTitle('My inscriptions');
        const myinscripitionBoxes = page.locator('#box-myinscription');
        await expect(myinscripitionBoxes).toBeVisible();   
        const myinscripitionDelete = page.locator('#icon-myinscription')
        await myinscripitionDelete.click();
        await page.getByRole('button',{name: 'Delete'}).click();
        const myinscriptionNoBoxes = page.locator('#no-box-myinscription');
        await expect(myinscriptionNoBoxes).toBeVisible();      
    })

})