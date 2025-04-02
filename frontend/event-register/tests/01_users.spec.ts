import { test, expect } from '@playwright/test';


test.describe("Testing Register", () => {

    test('Register a organizer user', async({page}) => {
        await page.goto('/register');
        await page.getByPlaceholder('Name',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Surname',{exact: true}).fill('Surname');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByPlaceholder('Age',{exact: true}).fill('30');
        await page.getByPlaceholder('Email',{exact: true}).fill('organizer.doe@example.com');
        await page.getByPlaceholder('Ej: +34 600 123 456',{exact: true}).fill('+34600123456');
        await page.getByPlaceholder('City *', {exact: true}).fill('city');
        await page.getByPlaceholder('Autonomous Community *', {exact: true}).fill('Madrid');
        await page.getByPlaceholder('Country', {exact: true}).fill('Spain');
        await page.locator('#checkbox-root').check();
        await page.locator('#register-button').click();
        console.log('Current URL:', page.url());
        await expect(page).toHaveURL('/home', { timeout: 15000 });
    })
    test('Register a normal user', async({page}) => {
        await page.goto('/register');
        await page.getByPlaceholder('Name',{exact: true}).fill('user');
        await page.getByPlaceholder('Surname',{exact: true}).fill('Surname');
        await page.getByPlaceholder('Password', {exact: true}).fill('password456');
        await page.getByPlaceholder('Age',{exact: true}).fill('30');
        await page.getByPlaceholder('Email',{exact: true}).fill('user.doe@example.com');
        await page.getByPlaceholder('Ej: +34 600 123 456',{exact: true}).fill('+34600123456');
        await page.getByPlaceholder('City *', {exact: true}).fill('city');
        await page.getByPlaceholder('Autonomous Community *', {exact: true}).fill('Madrid');
        await page.getByPlaceholder('Country', {exact: true}).fill('Spain');
        await page.locator('#register-button').click();
        console.log('Current URL:', page.url());
        await expect(page).toHaveURL('/home', { timeout: 15000 });
    })

    test('Register fail when user exist', async({page}) => {
        await page.goto('/register');
        await page.getByPlaceholder('Name',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Surname',{exact: true}).fill('Surname');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByPlaceholder('Age',{exact: true}).fill('30');
        await page.getByPlaceholder('Email',{exact: true}).fill('organizer.doe@example.com');
        await page.getByPlaceholder('Ej: +34 600 123 456',{exact: true}).fill('+34600123456');
        await page.getByPlaceholder('City *', {exact: true}).fill('city');
        await page.getByPlaceholder('Autonomous Community *', {exact: true}).fill('Madrid');
        await page.getByPlaceholder('Country', {exact: true}).fill('Spain');
        await page.locator('#checkbox-root').check();
        await page.locator('#register-button').click();
        const errorMessage = page.locator('#p-red');
        await expect(errorMessage).toContainText('User already exist'); 
        await expect(errorMessage).toBeVisible();
    })
    test('Register fail when user data are empty', async({page}) => {
        await page.goto('/register');
        await page.getByPlaceholder('Name',{exact: true}).fill('');
        await page.getByPlaceholder('Surname',{exact: true}).fill('');
        await page.getByPlaceholder('Password', {exact: true}).fill('');
        await page.getByPlaceholder('Age',{exact: true}).fill('');
        await page.getByPlaceholder('Email',{exact: true}).fill('');
        await page.getByPlaceholder('Ej: +34 600 123 456',{exact: true}).fill('');
        await page.getByPlaceholder('City *', {exact: true}).fill('');
        await page.getByPlaceholder('Autonomous Community *', {exact: true}).fill('');
        await page.getByPlaceholder('Country', {exact: true}).fill('');
        await page.locator('#checkbox-root').check();
        await page.locator('#register-button').click();
        const errorMessage = page.locator('#p-red');
        await expect(errorMessage).toContainText('Data are required'); 
        await expect(errorMessage).toBeVisible();
    })
    test('Register fail when age are not valid', async({page}) => {
        await page.goto('/register');
        await page.getByPlaceholder('Name',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Surname',{exact: true}).fill('Surname');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByPlaceholder('Age',{exact: true}).fill('Hola');
        await page.getByPlaceholder('Email',{exact: true}).fill('john.doe@example.com');
        await page.getByPlaceholder('Ej: +34 600 123 456',{exact: true}).fill('+34600123456');
        await page.getByPlaceholder('City *', {exact: true}).fill('city');
        await page.getByPlaceholder('Autonomous Community *', {exact: true}).fill('Madrid');
        await page.getByPlaceholder('Country', {exact: true}).fill('Spain');
        await page.locator('#checkbox-root').check();
        await page.locator('#register-button').click();
        const errorMessage = page.locator('#p-red');
        await expect(errorMessage).toContainText('Age must be a number'); 
        await expect(errorMessage).toBeVisible();
    })
});

test.describe("Testing Login", () => {
    
    test('Go to registration',async({page}) => {
        await page.goto('/login'); 
        await page.getByRole('button', { name: 'Create a new account' }).click();
        await expect(page).toHaveURL('/register');   
    })

    test('Login success', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home', { timeout: 15000 });      
    })
    
    test('Login failed when user not exist', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill('usuario3');
        await page.getByPlaceholder('Password', {exact: true}).fill('password3');
        await page.getByRole('button',{name: 'Login'}).click();;
        const element = page.locator('#p-red');
        await expect(element).toBeVisible();
    })
    
    test('Login failed when data is empty', async({page}) => {
        await page.goto('/login');
        await page.getByPlaceholder('Username',{exact: true}).fill(' ');
        await page.getByPlaceholder('Password', {exact: true}).fill(' ');
        await page.getByRole('button',{name: 'Login'}).click();
        const element = page.locator('#p-red');
        await expect(element).toBeVisible();
    })    
});
  
test.describe("Testing Logout", () => {

    test('logout success', async({page}) => {
        await page.goto('/login');
        await page.getByLabel('Login de Usuario');  
        await page.getByPlaceholder('Username',{exact: true}).fill('Organizer');
        await page.getByPlaceholder('Password', {exact: true}).fill('password123');
        await page.getByRole('button',{name: 'Login'}).click();
        await expect(page).toHaveURL('/home');
        const button = await page.locator('#logout-button');
        await button.click();
        await expect(page).toHaveURL('/login');
    })

})