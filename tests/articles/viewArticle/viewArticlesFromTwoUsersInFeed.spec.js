import { test } from '../../_fixtures/fixtures';
import { expect } from '@playwright/test';
import { generateNewArticleData } from '../../../src/common/testData/generateNewArticleData';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { ViewArticlePage } from '../../../src/ui/pages/article/ViewArticlePage';
import { HomePage } from '../../../src/ui/pages/HomePage';

test.use({ contextsNumber: 3, usersNumber: 3 });

test('User can see in Your Feed articles from two different users', async ({
  pages,
  users,
  logger,
}) => {
  const firstArticle = generateNewArticleData(logger);
  const secondArticle = generateNewArticleData(logger);

  const firstAuthorPage = pages[0];
  const secondAuthorPage = pages[1];
  const readerPage = pages[2];

  // Register three users
  await signUpUser(firstAuthorPage, users[0], 1);
  await signUpUser(secondAuthorPage, users[1], 2);
  await signUpUser(readerPage, users[2], 3);

  // Two different authors create articles
  await createArticle(firstAuthorPage, firstArticle, 1);
  await createArticle(secondAuthorPage, secondArticle, 2);

  // Save article URLs
  const firstArticleUrl = firstArticle.url;
  const secondArticleUrl = secondArticle.url;

  // Third user follows both authors
  const readerArticlePage = new ViewArticlePage(readerPage, 3);

  await readerArticlePage.followAuthor(users[0].username, firstArticleUrl);
  await readerArticlePage.followAuthor(users[1].username, secondArticleUrl);

  // Open Your Feed
  await readerPage.goto('/');

  const homePage = new HomePage(readerPage, 3);

  await homePage.clickYourFeedTab();

  // Verify both articles are visible
  await expect(
    readerPage.getByRole('heading', { name: firstArticle.title }),
  ).toBeVisible();

  await expect(
    readerPage.getByRole('heading', { name: secondArticle.title }),
  ).toBeVisible();
});
