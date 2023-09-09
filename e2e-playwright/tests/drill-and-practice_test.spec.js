const { test, expect } = require("@playwright/test");

// Tests cab be run with the following command
// docker-compose run --entrypoint=npx e2e-playwright playwright test && docker-compose rm -sf

// Function for generating a random name for testing
const getRandomName = () => {
  return `${Math.floor(Math.random() * 10_000)}`;
};


test("Main page has expected title and subheading for non-auth user", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Drill and Practice");

  await expect(page.locator("h3")).toHaveText(["Register", "Login", "Statistics"]);
});


test("Non-auth user is not allowed to /topics", async ({ page }) => {
  await page.goto("/topics");
  await expect(page).toHaveURL("/auth/login");
});


test("Registration does not accept invalid email/password", async ({ page }) => {
  await page.goto("/")

  await page.locator(`a >> text='${"Create Account"}'`).click();
  await expect(page).toHaveURL("/auth/register");

  await page.locator("input[type=email]").type("notEmail");
  await page.locator("input[type=password]").type("123");
  await page.locator("button[type=submit]").click();
  await expect(page).toHaveURL("/auth/register");
});


test("User can register with valid email and password", async ({ page }) => {
  await page.goto("/auth/register")

  await page.locator("input[type=email]").type("test@example.com");
  await page.locator("input[type=password]").type("12345");
  await page.locator("button[type=submit]").click();
  await expect(page).toHaveURL("/auth/login");
});


test("Login fails with wrong credentials", async ({ page }) => {
  await page.goto("/auth/login")

  await page.locator("input[type=email]").type("not@found.com");
  await page.locator("input[type=password]").type("12345");
  await page.locator("button[type=submit]").click();
  await expect(page).toHaveURL("/auth/login");
});


test("User can login with correct email and password", async ({ page }) => {
  await page.goto("/auth/login")

  await page.locator("input[type=email]").type("test@example.com");
  await page.locator("input[type=password]").type("12345");
  await page.locator("button[type=submit]").click();
  await expect(page).toHaveURL("/topics");
});


test("User is able to log out", async ({ page }) => {
  await page.goto("/auth/login")

  await page.locator("input[type=email]").type("test@example.com");
  await page.locator("input[type=password]").type("12345");
  await page.locator("button[type=submit]").click();
  await expect(page).toHaveURL("/topics");

  await page.locator("button[type=submit]").click();
  await expect(page).toHaveURL("/");

  await page.goto("/topics");
  await expect(page).toHaveURL("/auth/login");

});


test("Main page has expected title and subheading for auth user", async ({ page }) => {
  await page.goto("/auth/login")
  await page.locator("input[type=email]").type("test@example.com");
  await page.locator("input[type=password]").type("12345");
  await page.locator("button[type=submit]").click();
  await page.goto("/");
  await expect(page).toHaveTitle("Drill and Practice");

  await expect(page.locator("h3")).toHaveText(["Topics", "Quiz", "Statistics"]);
});


test("User is be able to create a new question", async ({ page }) => {
  await page.goto("/auth/login")

  await page.locator("input[type=email]").type("test@example.com");
  await page.locator("input[type=password]").type("12345");
  await page.locator("button[type=submit]").click();
  await expect(page).toHaveURL("/topics");

  await page.locator(`a >> text='${"Finnish language"}'`).click();

  await expect(page.locator("h1")).toContainText("Finnish language");

  const newQuestion = getRandomName();
  await page.locator("input[type=textarea]").type(newQuestion);
  await page.locator("button[id=add]").click();

  await expect(page.locator("h4")).toContainText([`${newQuestion}`]);
});


test("User is be able to create an answer option", async ({ page }) => {
  await page.goto("/auth/login")

  await page.locator("input[type=email]").type("test@example.com");
  await page.locator("input[type=password]").type("12345");
  await page.locator("button[type=submit]").click();
  await expect(page).toHaveURL("/topics");

  await page.locator(`a >> text='${"Finnish language"}'`).click();
  await expect(page.locator("h1")).toContainText("Finnish language");

  const newQuestion = getRandomName();
  await page.locator("input[type=textarea]").type(newQuestion);
  await page.locator("button[id=add]").click();

  await expect(page.locator("h4")).toContainText([`${newQuestion}`]);
  await page.locator(`a >> text='${newQuestion}'`).click();

  await expect(page.locator("h1")).toContainText(newQuestion);

  const newOption = getRandomName();
  await page.locator("input[type=textarea]").type(newOption);
  await page.locator("input[type=checkbox]").check();
  await page.locator("button[id=add]").click();

  await expect(page.getByRole('heading', { name: `Delete ✓ ${newOption}` }))
    .toContainText(`Delete ✓ ${newOption}`);
});


test("Taking a quiz displayes answer options and then the correct asnwer", async ({ page }) => {
  await page.goto("/auth/login")
  await page.locator("input[type=email]").type("test@example.com");
  await page.locator("input[type=password]").type("12345");
  await page.locator("button[type=submit]").click();

  await page.goto("/quiz");
  await page.locator(`a >> text='${"Finnish language"}'`).click();

  await expect(page.getByRole('heading', { name: 'QUIZ Finnish language' })).toContainText("Finnish language");

  await page.locator("button[id=choose]").click();

  await expect(page.getByRole('heading', { name: 'Correct!' })).toContainText("Correct!");
});


test("Admin is be able to create new topic", async ({ page }) => {
  await page.goto("/auth/login")

  await page.locator("input[type=email]").type("admin@admin.com");
  await page.locator("input[type=password]").type("123456");
  await page.locator("button[type=submit]").click();
  await expect(page).toHaveURL("/topics");

  const newTopic = getRandomName();
  await page.locator("input[type=text]").type(newTopic);
  await page.locator("button[id=add]").click();

  await expect(page.locator("h4")).toContainText([`Delete 0  ${newTopic}`]);
});


test("Admin is be able to delete topic", async ({ page }) => {
  await page.goto("/auth/login")

  await page.locator("input[type=email]").type("admin@admin.com");
  await page.locator("input[type=password]").type("123456");
  await page.locator("button[type=submit]").click();
  await expect(page).toHaveURL("/topics");

  const newTopic = getRandomName();
  await page.locator("input[type=text]").type(newTopic);
  await page.locator("button[id=add]").click();

  await expect(page.locator("h4")).toContainText([`Delete 0  ${newTopic}`]);

  await page.getByRole('heading', { name: `Delete 0  ${newTopic}` }).getByRole('button', { name: 'Delete' }).click();
  await expect(page.locator("h4")).not.toContainText([`Delete 0  ${newTopic}`]);

});


test("Server redirects to error page on unknown url", async ({ page }) => {
  await page.goto(`/${getRandomName()}`);
  await expect(page.locator("h1")).toHaveText("Error 404");
});


// docker-compose run --entrypoint=npx e2e-playwright playwright test && docker-compose rm -sf