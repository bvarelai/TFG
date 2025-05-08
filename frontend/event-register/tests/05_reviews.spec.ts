import { test, expect } from '@playwright/test';

test.describe("Testing Reviews and Event Results", () => {

    test("View no Reviews", async ({ page }) => {
 
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
        const event_info = await page.locator('#event-comments')
        await expect(event_info).toBeVisible();
        const event_info_header = await page.locator('#comments-heading');
        await expect(event_info_header).toContainText('Comments and Reviews');
        const eventBoxes = page.locator('#no-box-review');
        await expect(eventBoxes).toBeVisible();
    })

    test("Add Review", async ({ page }) => {
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
        const event_info = await page.locator('#event-comments')
        await expect(event_info).toBeVisible();
        const event_info_header = await page.locator('#comments-heading');
        await expect(event_info_header).toContainText('Comments and Reviews');
        const eventBoxes = page.locator('#no-box-review', { hasText: 'No reviews to show' });
        await expect(eventBoxes).toBeVisible();
        await event_info_header.click();
        const reviewTitle = await page.locator('#heading-review')
        await expect(reviewTitle).toBeVisible();
        await expect(reviewTitle).toContainText('Reviews')
        const noreviewBox = await page.locator('#no-box-review-view', { hasText: 'No reviews to show' })
        await expect(noreviewBox).toBeVisible();
        const reviewWrite = await page.locator('#label-review') 
        await expect(reviewWrite).toBeVisible();
        await expect(reviewWrite).toContainText('Leave a review')        
        const thirdStar = await page.locator('#div-select-starts').nth(2);
        await thirdStar.click();
        await page.getByPlaceholder('Write your review here...').fill('This is a test review');
        await page.getByRole('button', { name: 'Submit' }).click();
        const reviewBox = await page.locator('#box-review-view', { hasText: 'This is a test review' })
        await expect(reviewBox).toBeVisible();
    })
    test("View Reviews", async ({ page }) => {
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
        const event_info = await page.locator('#event-comments')
        await expect(event_info).toBeVisible();
        const event_info_header = await page.locator('#comments-heading');
        await expect(event_info_header).toContainText('Comments and Reviews');
        const eventBoxes = await page.locator('#box-review', { hasText: 'This is a test review' });
        await expect(eventBoxes).toBeVisible();
        await event_info_header.click();
        const reviewTitle = await page.locator('#heading-review')
        await expect(reviewTitle).toBeVisible();
        await expect(reviewTitle).toContainText('Reviews')
        const reviewBox = await page.locator('#box-review-view', { hasText: 'This is a test review' } )
        await expect(reviewBox).toBeVisible();
        const reviewWrite = await page.locator('#label-review') 
        await expect(reviewWrite).toBeVisible();
        await expect(reviewWrite).toContainText('Leave a review')        
    })

    test("View Event Results", async ({ page }) => {
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
        const event_info = await page.locator('#event-results')
        await expect(event_info).toBeVisible();
        const event_info_header = await page.locator('#result-heading');
        await expect(event_info_header).toContainText('Results');
        const noresultBoxes = await page.locator('#no-box-result', { hasText: 'No results to show' });
        await expect(noresultBoxes).toBeVisible();
        const segmentItem = await page.locator('#segment-item', { hasText: 'junior' });
        await segmentItem.click();
        await page.locator('#filter-by-edition').click();
        await page.getByText('2024-2025').click();
        const resultBox = await page.locator('#table-result');
        await expect(resultBox).toBeVisible();
    })
})