import { test, expect } from '@playwright/test';


test.describe("Testing Welcome", () => {
    test('Welcome page', async({page}) => {
     await page.goto('/');
     await page.getByTitle('Bienvenido a SportNexus');
     await page.getByRole('button', {name: 'Empecemos'}).click();
     await expect(page).toHaveURL('/login')   
    })
});


test.describe("Testing Register", () => {

    test('register success', async({page}) => {
        await page.goto('/register');
        await page.getByLabel('Registro de Usuario');  
        await page.getByPlaceholder('nombre',{exact: true}).fill('usuario4');
        await page.getByPlaceholder('contraseña', {exact: true}).fill('password4');
        await page.getByPlaceholder('edad',{exact: true}).fill('35');
        await page.getByPlaceholder('ciudad *', {exact: true}).fill('cuidad4');
        await page.getByPlaceholder('comunidad autónoma *', {exact: true}).fill('Galicia');
        await page.getByPlaceholder('país', {exact: true}).fill('España');
        await page.getByRole("checkbox").check();
        await page.getByRole('button',{name: 'Registrarse'}).click();
        const element = page.locator('#p-green');
        await expect(element).toBeVisible();
        await expect(page).toHaveURL('/events');      
    })

    test('register fail', async({page}) => {
        await page.goto('/register');
        await page.getByLabel('Registro de Usuario');  
        await page.getByPlaceholder('nombre',{exact: true}).fill('usuario');
        await page.getByPlaceholder('contraseña', {exact: true}).fill('password');
        await page.getByPlaceholder('edad',{exact: true}).fill('35');
        await page.getByPlaceholder('ciudad *', {exact: true}).fill('A Coruña');
        await page.getByPlaceholder('comunidad autónoma *', {exact: true}).fill('Galicia');
        await page.getByPlaceholder('país', {exact: true}).fill('España');
        await page.getByRole("checkbox").check();
        await page.getByRole('button',{name: 'Registrarse'}).click();
        const element = page.locator('#p-red');
        await expect(element).toBeVisible();
    })
});

test.describe("Testing Login", () => {
    
    test('go to registration',async({page}) => {
        await page.goto('/login'); 
        await page.getByRole('link', { name: 'No tienes cuenta?' }).click();
        await expect(page).toHaveURL('/register');   
    })

    test('login success', async({page}) => {
        await page.goto('/login');
        await page.getByLabel('Login de Usuario');  
        await page.getByPlaceholder('nombre',{exact: true}).fill('usuario');
        await page.getByPlaceholder('contraseña', {exact: true}).fill('password');
        await page.getByRole('button',{name: 'Iniciar Sesión'}).click();
        await page.getByLabel('Login successfull');
        await expect(page).toHaveURL('/events');      
    })
    
    test('login failed', async({page}) => {
        await page.goto('/login');
        await page.getByLabel('Login de Usuario');  
        await page.getByPlaceholder('nombre',{exact: true}).fill('nousuario');
        await page.getByPlaceholder('contraseña', {exact: true}).fill('nopassword');
        await page.getByRole('button',{name: 'Iniciar Sesión'}).click();
        const element = page.locator('#p-red');
        await expect(element).toBeVisible();
    })
    
    test('login empty', async({page}) => {
        await page.goto('/login');
        await page.getByLabel('Login de Usuario');  
        await page.getByPlaceholder('nombre',{exact: true}).fill(' ');
        await page.getByPlaceholder('contraseña', {exact: true}).fill(' ');
        await page.getByRole('button',{name: 'Iniciar Sesión'}).click();
        const element = page.locator('#p-red');
        await expect(element).toBeVisible();
    })    
});
  
test.describe("Testing Logout", () => {

    test('logout success', async({page}) => {
        await page.goto('/login');
        await page.getByLabel('Login de Usuario');  
        await page.getByPlaceholder('nombre',{exact: true}).fill('usuario');
        await page.getByPlaceholder('contraseña', {exact: true}).fill('password');
        await page.getByRole('button',{name: 'Iniciar Sesión'}).click();
        await page.getByLabel('Login successfull');
        await expect(page).toHaveURL('/events');
        await page.getByRole('button',{name: 'Cerrar Sesión'}).click();
        await expect(page).toHaveURL('/login');
    })

})