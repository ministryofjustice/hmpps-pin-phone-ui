import { test, expect } from '@playwright/test'
import { loginWithHmppsAuth } from '../../../testUtils'
import config from '../../../../server/config'
import StaffPinPhoneLandingPage from '../../../pages/pin-phone/staff/staffPinPhoneLandingPage'

test.describe('Staff landing home page', () => {
  test.use({
    baseURL: 'http://staff.localhost:3007',
  })

  test.beforeEach(async ({ page }) => {
    await loginWithHmppsAuth(page, { name: 'A TestUser' })
    await page.goto('/staff-pinphone')
  })

  test('can see page heading with username', async ({ page }) => {
    await StaffPinPhoneLandingPage.verifyOnPage(page)
    await expect(page.locator('h1')).toContainText('Pin Phone')
  })

  test('can see buy credit card', async ({ page }) => {
    const staffPinPhonePage = await StaffPinPhoneLandingPage.verifyOnPage(page)
    await expect(staffPinPhonePage.staffCard).toContainText('STAFF')
  })

  test('link to home', async ({ page }) => {
    const staffPinPhonePage = await StaffPinPhoneLandingPage.verifyOnPage(page)
    await expect(staffPinPhonePage.breadcrumbHome).toHaveAttribute('href', config.launchpadHome)
  })
})
