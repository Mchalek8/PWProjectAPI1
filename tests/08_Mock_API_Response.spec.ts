import { test, expect } from '@playwright/test';

test("Mock API Response", async ({ page }) => {
    // Mock API Response
    await page.route('*/**/api/v1/fruits', async route => {
        const response = await route.fetch();
        const json = await response.json();

        json.push({name: 'playwright testscript by testers talk', id: 12 });
        json.push({name: 'playwright javascript by testers talk', id: 13 });
        json.push({name: 'cypress testscript by testers talk', id: 14 });
        json.push({name: 'api testing by testers talk', id: 15 });

        await route.fulfill({ response, json });
    })

    // go to the page
    await page.goto('https://demo.playwright.dev/api-mocking');

    // Validate the text
    await expect(page.getByText('playwright testscript by testers talk')).toBeVisible();
    await expect(page.getByText('playwright javascript by testers talk')).toBeVisible();
    await expect(page.getByText('cypress testscript by testers talk')).toBeVisible();
    await expect(page.getByText('api testing by testers talk')).toBeVisible();
    await page.waitForTimeout(2000);
});