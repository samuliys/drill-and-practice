import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as topicController from "./controllers/topicController.js";
import * as questionController from "./controllers/questionController.js";
import * as registrationController from "./controllers/registrationController.js";
import * as loginController from "./controllers/loginController.js";
import * as quizController from "./controllers/quizController.js";
import * as questionApi from "./apis/questionApi.js";

const router = new Router();

router.get("/", mainController.showMain);

// Authentication
router.get("/auth/register", registrationController.showRegistrationForm);
router.post("/auth/register", registrationController.registerUser);

router.get("/auth/login", loginController.showLoginForm);
router.post("/auth/login", loginController.processLogin);
router.post("/auth/logout", loginController.logout);

// Topics
router.get("/topics", topicController.showTopics);
router.post("/topics", topicController.addTopic);
router.post("/topics/:id/delete", topicController.deleteTopic);

// Topic-specific page
router.get("/topics/:id", topicController.viewTopic);
router.post("/topics/:id/questions", topicController.addQuestion);

// Question page
router.post("/topics/:tId/questions/:qId/delete", questionController.deleteQuestion);
router.get("/topics/:id/questions/:qId", questionController.showQuestion);
router.post("/topics/:id/questions/:qId/options", questionController.addOption);
router.post("/topics/:tId/questions/:qId/options/:oId/delete", questionController.deleteOption);

// Quiz
router.get("/quiz", quizController.showQuizTopics);
router.get("/quiz/:tId", quizController.getRandomQuestion);
router.get("/quiz/:tId/questions/:qId", quizController.viewAnswerQuestion);
router.get("/quiz/:tId/questions/:qId/correct", quizController.showCorrect);
router.get("/quiz/:tId/questions/:qId/incorrect", quizController.showIncorrect);
router.post("/quiz/:tId/questions/:qId/options/:oId", quizController.processAnswer);

// Api
router.get("/api/questions/random", questionApi.getRandomQuestion);
router.post("/api/questions/answer", questionApi.answerQuestion);

// 404 route
router.get("/(.*)", mainController.showError);
router.post("/(.*)", mainController.showError);

export { router };
