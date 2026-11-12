import { test, expect } from '@playwright/test'
import { loginWithPrisonerAuth } from '../../../testUtils'
import PinPhoneLandingPage from '../../../pages/pin-phone/pinPhoneLandingPage'
import config from '../../../../server/config'

test.describe('Pin Phone home page', () => {
  test.beforeEach(async ({ page }) => {
    await loginWithPrisonerAuth(page)
    await page.goto('/pin-phone')
  })

  test('link to home', async ({ page }) => {
    const pinPhonePage = await PinPhoneLandingPage.verifyOnPage(page)
    await expect(pinPhonePage.breadcrumbHome).toHaveAttribute('href', config.launchpadHome)
  })
})
