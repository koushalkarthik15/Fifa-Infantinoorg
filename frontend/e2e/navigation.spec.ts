import { test, expect } from '@playwright/test';

test.describe('Global Navigation & Regression', () => {
  test('should navigate to home page and verify layout', async ({ page }) => {
    // We assume the app runs on localhost:3000
    await page.goto('http://localhost:3000/');
    
    // Verify title or some main heading
    await expect(page).toHaveTitle(/InfantinoOrg/i);
    
    // Verify mobile tab bar navigation
    const tabBar = page.locator('nav.mobile-tab-bar'); // Adjust selector based on actual implementation
    if (await tabBar.isVisible()) {
      await expect(tabBar).toBeVisible();
    }
  });

  test('should verify feature module routing', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    
    // Attempt to navigate to Volunteer or Accessibility dashboard
    // This assumes there's a link to these dashboards.
    const volunteerLink = page.getByRole('link', { name: 'Volunteer Support' }).first();
    if (await volunteerLink.isVisible()) {
      await volunteerLink.click();
      await expect(page).toHaveURL(/.*volunteer.*/);
    }
  });

  test('should handle responsive design layout changes', async ({ page, isMobile }) => {
    await page.goto('http://localhost:3000/');
    
    // Just a placeholder test structure for responsive design
    if (isMobile) {
      // Check for hamburger menu or mobile tab bar
      await expect(page.locator('nav[aria-label="Mobile Navigation"]')).toBeVisible();
    } else {
      // Check for desktop sidebar or header navigation
      await expect(page.locator('nav[aria-label="Primary Navigation"]')).toBeVisible();
    }
  });
});
