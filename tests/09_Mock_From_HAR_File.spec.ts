import { test, expect } from '@playwright/test';

test("Mock API from HAR file in Playwright", async ({ page }) => {
    // Recording HAR file
    await page.routeFromHAR('./har/fruits.har', {
        url: '*/**/api/v1/fruits',
        update: false
    })

    // Go to URL
    await page.goto('https://demo.playwright.dev/api-mocking');

    // Validate the text
    expect(page.getByText('Strawberry')).toBeVisible();
    expect(page.getByText('playwright typescript by testers talk')).toBeVisible();
    expect(page.getByText('playwright javascript by testers talk')).toBeVisible();
    expect(page.getByText('cypress by testers talk')).toBeVisible();
    await page.waitForTimeout(2000);
});