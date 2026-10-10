import { test } from '../../_fixtures/fixtures';
import { generateNewArticleData } from '../../../src/common/testData/generateNewArticleData';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { EditArticlePage } from '../../../src/ui/pages/article/EditArticlePage';
import { ViewArticlePage } from '../../../src/ui/pages/article/ViewArticlePage';

const testParameters = [
  { tagsNumber: 1, testNameEnding: 'one tag' },
  { tagsNumber: 2, testNameEnding: 'two tags' },
  { tagsNumber: 5, testNameEnding: 'five tags' },
];

testParameters.forEach(({ tagsNumber, testNameEnding }) => {
  test.describe('Add tags to article', () => {
    test(`Add ${testNameEnding} to previously created article`, async ({
      page,
      user,
      logger,
    }) => {
      const editArticlePage = new EditArticlePage(page);
      const viewArticlePage = new ViewArticlePage(page);

      const article = generateNewArticleData(logger, 0);
      const newArticleData = generateNewArticleData(logger, tagsNumber);

      await signUpUser(page, user);

      await createArticle(page, article);

      await viewArticlePage.assertArticleTitleIsVisible(article.title);

      await viewArticlePage.clickEditArticleLink();

      await editArticlePage.fillTagsField(newArticleData.tags);

      await editArticlePage.clickUpdateArticleButton();

      await page.reload();

      await viewArticlePage.assertArticleTitleIsVisible(article.title);

      await viewArticlePage.assertArticleTagsAreVisible(newArticleData.tags);
    });
  });
});
