import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../../abstractPage'

export default class PinPhoneLandingPage extends AbstractPage {
  readonly header: Locator

  readonly staffCard: Locator

  readonly breadcrumbHome: Locator

  private constructor(page: Page) {
    super(page)
    this.header = page.locator('h1')
    this.staffCard = page.locator('.app-card', { hasText: 'STAFF' })
    this.breadcrumbHome = page.locator('.govuk-breadcrumbs__link', { hasText: 'Home' })
  }

  static async verifyOnPage(page: Page): Promise<PinPhoneLandingPage> {
    const pinPhonePage = new PinPhoneLandingPage(page)
    await expect(pinPhonePage.header).toContainText('Pin Phone')
    return pinPhonePage
  }

  staffCardLink(): Locator {
    return this.staffCard.locator('a.app-card__link')
  }
}
