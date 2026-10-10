import { expect, testStep } from '../../../common/pwHelpers/pw';

export class ViewArticlePage {
  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;

    this.articleTitleHeader = page.getByRole('heading');
    this.editArticleLink = page.getByRole('link', {
      name: 'Edit Article',
    });
  }

  authorLinkInArticleHeader(username) {
    return this.page.getByRole('link', { name: username }).first();
  }

  tagListItem(tagName) {
    return this.page
      .locator('li.tag-default.tag-pill.tag-outline')
      .filter({ hasText: tagName });
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
  }

  url() {
    return this.page.url();
  }

  async open(url) {
    await this.step(`Open 'View Article' page`, async () => {
      await this.page.goto(url);
    });
  }

  async clickEditArticleLink() {
    await this.step(`Click the 'Edit Article' link`, async () => {
      await this.editArticleLink.first().click();
    });
  }

  async assertArticleTitleIsVisible(title) {
    await this.step(`Assert the article has correct title`, async () => {
      await expect(this.articleTitleHeader).toContainText(title);
    });
  }

  async assertArticleAuthorNameIsVisible(username) {
    await this.step(
      `Assert the article has correct author username`,
      async () => {
        await expect(this.authorLinkInArticleHeader(username)).toBeVisible();
      },
    );
  }

  async assertArticleTextIsVisible(text) {
    await this.step(`Assert the article has correct text`, async () => {
      await expect(this.page.getByText(text)).toBeVisible();
    });
  }

  async assertArticleTagsAreVisible(tags) {
    await this.step(`Assert the article has correct tags`, async () => {
      for (let i = 0; i < tags.length; i++) {
        await expect(this.tagListItem(tags[i])).toBeVisible();
      }
    });
  }

  async assertArticleTagsAreNotVisible() {
    await this.step(`Assert the article has no tags`, async () => {
      await expect(
        this.page.locator('li.tag-default.tag-pill.tag-outline'),
      ).toHaveCount(0);
    });
  }

  async clickFollowAuthorButton(username) {
    await this.step(`Follow author '${username}'`, async () => {
      const followButton = this.page
        .getByRole('button')
        .filter({
          hasText: new RegExp(`Follow\\s+${username}`, 'i'),
        })
        .first();

      await expect(followButton).toBeVisible();

      await followButton.click();

      const unfollowButton = this.page
        .getByRole('button')
        .filter({
          hasText: new RegExp(`Unfollow\\s+${username}`, 'i'),
        })
        .first();

      await expect(unfollowButton).toBeVisible();
    });
  }

  async followAuthor(username, articleUrl) {
    await this.step(`Open article and follow '${username}'`, async () => {
      await this.open(articleUrl);
      await this.clickFollowAuthorButton(username);
    });
  }
}
