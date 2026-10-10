import { expect, testStep } from '../../../common/pwHelpers/pw';

export class EditArticlePage {
  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;

    this.articleTitleHeader = page.getByRole('heading');
    this.tagField = page.getByPlaceholder('Enter tags');
    this.updateArticleButton = page.getByRole('button', {
      name: 'Update Article',
    });
  }

  tagItem(tagName) {
    return this.page
      .locator('span.tag-default.tag-pill')
      .filter({ hasText: tagName });
  }

  tagDeleteButton(tagName) {
    return this.tagItem(tagName).locator('i');
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
  }

  async fillTagsField(tags) {
    await this.step(`Fill the 'Tags' field`, async () => {
      for (let i = 0; i < tags.length; i++) {
        await this.tagField.fill(tags[i]);
        await this.page.keyboard.press('Enter');

        await expect(this.tagItem(tags[i])).toBeVisible();
      }
    });
  }

  async removeTags(tags) {
    await this.step(`Remove article tags`, async () => {
      for (let i = 0; i < tags.length; i++) {
        const tag = this.tagItem(tags[i]);
        const deleteButton = this.tagDeleteButton(tags[i]);

        await expect(tag).toBeVisible();
        await deleteButton.click();
        await expect(tag).not.toBeVisible();
      }
    });
  }

  async clickUpdateArticleButton() {
    await this.step(`Click the 'Update Article' button`, async () => {
      const responsePromise = this.page.waitForResponse(
        (response) =>
          response.url().includes('/api/articles/') &&
          response.request().method() === 'PUT' &&
          response.ok(),
      );

      await this.updateArticleButton.click();

      await responsePromise;
      await this.page.waitForURL(/\/article\//);
    });
  }

  async assertArticleTitle(title) {
    await this.step(`Assert the article has correct title`, async () => {
      await expect(this.articleTitleHeader).toContainText(title);
    });
  }

  async assertArticleText(text) {
    await this.step(`Assert the article has correct text`, async () => {
      await expect(this.page.getByText(text)).toBeVisible();
    });
  }
}
