import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
// @ts-expect-error - fs is native node module but types might not be resolved in Playwright config
import * as fs from 'fs';

const routes = [
  '/',
  '/crowd',
  '/navigation',
  '/accessibility',
  '/volunteer',
  '/sustainability',
  '/profile',
  '/settings'
];

test.describe('Accessibility Validation', () => {
  for (const route of routes) {
    test(`should not have any automatically detectable accessibility issues on ${route}`, async ({ page }) => {
      await page.goto(route);
      
      // Wait for any animations or data loading (simplistic wait)
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      if (accessibilityScanResults.violations.length > 0) {
        const violationsLog = accessibilityScanResults.violations.map(v => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          help: v.help,
          nodes: v.nodes.map(n => n.html)
        }));
        fs.appendFileSync('a11y-violations.json', JSON.stringify({ route, violations: violationsLog }, null, 2) + ',\n');
      }

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }

  // Example test for dialog states (we'll open an incident report modal for example, if accessible directly, or through a click)
  test('should not have accessibility issues when a dialog is open', async ({ page }) => {
    await page.goto('/volunteer');
    await page.waitForLoadState('networkidle');
    
    // Find a button to open a dialog (assuming one exists)
    const reportBtn = page.getByRole('button', { name: /Report Incident/i });
    if (await reportBtn.isVisible()) {
      await reportBtn.click();
      // Wait for dialog
      await page.waitForSelector('[role="dialog"]');
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    }
  });
});
