const { test, expect } = require("@playwright/test");

// admin credentials visible for testing and grading to be more simple,
// naturally a bad idea in terms of security
const adminEmail = "admin@admin.com"
const adminPw = "123456"

test("Create question can be done successfully (API test)", async ({ page }) => {
  await page.goto("/auth/login")

  await page.locator("input[type=email]").type(adminEmail);
  await page.locator("input[type=password]").type(adminPw);
  await page.locator("button[type=submit]").click();
  await expect(page).toHaveURL("/topics");

  await page.locator(`a >> text='${"Finnish language"}'`).click();

  await expect(page.locator("h1")).toContainText("Finnish language");

  const newQuestion = `${Math.floor(Math.random() * 10000)}`;
  await page.locator("input[type=textarea]").type(newQuestion);
  await page.locator("button[id=add]").click();

  await expect(page.locator("h4")).toContainText([`${newQuestion}`]);
});

test("Creating answer option can be done successfully (API test)", async ({ page }) => {
  await page.goto("/auth/login")

  await page.locator("input[type=email]").type(adminEmail);
  await page.locator("input[type=password]").type(adminPw);
  await page.locator("button[type=submit]").click();
  await expect(page).toHaveURL("/topics");

  await page.locator(`a >> text='${"Finnish language"}'`).click();
  await expect(page.locator("h1")).toContainText("Finnish language");

  const newQuestion = `${Math.floor(Math.random() * 100)}`;
  await page.locator("input[type=textarea]").type(newQuestion);
  await page.locator("button[id=add]").click();

  await expect(page.locator("h4")).toContainText([`${newQuestion}`]);
  await page.locator(`a >> text='${newQuestion}'`).click();

  await expect(page.locator("h1")).toContainText(newQuestion);

  const newOption = `${Math.floor(Math.random() * 10000)}`;
  await page.locator("input[type=textarea]").type(newOption);
  await page.locator("input[type=checkbox]").check();
  await page.locator("button[id=add]").click();

  await expect(page.getByRole('heading', { name: `Delete ✓ ${newOption}` }))
    .toContainText(`Delete ✓ ${newOption}`);
});


test("API get-request should respond with correct data for a random question", async ({ request }) => {
  const res = await request.get("/api/questions/random");

  expect(res.ok()).toBeTruthy();
  const result = await res.json();
  const keys = Object.keys(result);

  expect(keys).toStrictEqual(['questionId', 'questionText', 'answerOptions'])
});

test("API post-request should respond with correct response", async ({ request }) => {
  const res = await request.get("/api/questions/random"); // get question

  expect(res.ok()).toBeTruthy();
  const result = await res.json();
  const qId = result.questionId;
  const oId = result.answerOptions[0].optionId;

  const answer = await request.post("/api/questions/answer", { // post answer
    data: {
      questionId: qId,
      optionId: oId,
    }
  });
  expect(answer.ok()).toBeTruthy();

  expect(await answer.json()).toStrictEqual({
    // created question has only 1 correct answer so the reponse should be true
    correct: true,
  });
});
