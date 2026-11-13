import { test, expect } from '@playwright/test'
import { loginWithHmppsAuth } from '../../../testUtils'
import StaffPinPhoneLandingPage from '../../../pages/staff/staffPinPhoneLandingPage'
import config from '../../../../server/config'

test.describe('Staff landing home page', () => {
  test.use({
    baseURL: 'http://staff.localhost:3007',
  })

  test.beforeEach(async ({ page }) => {
    await loginWithHmppsAuth(page, { name: 'A TestUser' })
    await page.goto('/staff-pin-phone')
  })

  test('can see page heading with username', async ({ page }) => {
    await StaffPinPhoneLandingPage.verifyOnPage(page)
    await expect(page.locator('h1')).toContainText('Pin Phone')
  })

  test('can see buy credit card', async ({ page }) => {
    const staffLandingPage = await StaffPinPhoneLandingPage.verifyOnPage(page)
    await expect(staffLandingPage.staffCard).toContainText('STAFF')
  })

  test('link to home', async ({ page }) => {
    const staffLandingPage = await StaffPinPhoneLandingPage.verifyOnPage(page)
    await expect(staffLandingPage.breadcrumbHome).toHaveAttribute('href', config.launchpadHome)
  })
})
