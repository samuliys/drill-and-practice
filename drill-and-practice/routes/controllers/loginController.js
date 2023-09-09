import * as userService from "../../services/userService.js";
import { bcrypt } from "../../deps.js";

const processLogin = async ({ request, response, state, render }) => {
  const body = request.body({ type: "form" });
  const params = await body.value;

  const userData = {
    email: params.get("email"),
    password: params.get("password"),
  };

  const userFromDatabase = await userService.findUserByEmail(userData.email);

  if (userFromDatabase.length != 1) {
    userData.error = "Email or Password Incorrect"
    render("login.eta", userData);
    return;
  }

  const user = userFromDatabase[0];
  const passwordMatches = await bcrypt.compare(
    userData.password,
    user.password,
  );

  if (!passwordMatches) {
    userData.error = "Email or Password Incorrect"
    render("login.eta", userData);
    return;
  }

  await state.session.set("user", user);
  response.redirect("/topics");
};

const showLoginForm = ({ render }) => {
  render("login.eta");
};

const logout = async ({ response, state }) => {
  await state.session.set("user", null);

  response.redirect("/");
};

export { logout, processLogin, showLoginForm };
