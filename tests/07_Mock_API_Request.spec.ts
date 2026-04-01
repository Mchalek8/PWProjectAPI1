import { test, expect } from '@playwright/test';

test("Mock API Request", {tag: ['@mock']}, async ({ page }) => {

    await page.route('*/**/api/v1/fruits', async route => {
        const json = [
            { name: 'playwright testscript by testers talk', id: 12 },
            { name: 'playwright javascript by testers talk', id: 13 },
            { name: 'cypress testscript by testers talk', id: 14 },
            { name: 'api testing by testers talk', id: 15 },
        ];
        await route.fulfill({ json });
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