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

  test('link to home', async ({ page }) => {
    const staffPinPhonePage = await StaffPinPhoneLandingPage.verifyOnPage(page)
    await expect(staffPinPhonePage.breadcrumbHome).toHaveAttribute('href', config.launchpadHome)
  })
})
