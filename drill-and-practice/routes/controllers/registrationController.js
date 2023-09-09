import { bcrypt } from "../../deps.js";
import * as userService from "../../services/userService.js";
import { validasaur } from "../../deps.js";

const userValidationRules = {
  email: [validasaur.required, validasaur.isEmail],
  password: [validasaur.required, validasaur.minLength(4)],
};

const getRegistrationData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;

  return {
    email: params.get("email"),
    password: params.get("password"),
  };
};

const registerUser = async ({ request, response, render }) => {
  const userData = await getRegistrationData(request);

  const [passes, errors] = await validasaur.validate(userData, userValidationRules);

  const emailExist = await userService.findUserByEmail(userData.email);

  const emailInUse = emailExist.length > 0;

  if (!passes || emailInUse) {
    if (passes) {
      userData.validationErrors = { email: { unique: "email already in use" } };
    } else {
      userData.validationErrors = errors;
    }

    render("registration.eta", userData);
  } else {
    const pwHash = await bcrypt.hash(userData.password);
    await userService.addUser(userData.email, pwHash);

    response.redirect("/auth/login");
  }
};

const showRegistrationForm = ({ render }) => {
  render("registration.eta");
};

export { registerUser, showRegistrationForm };
