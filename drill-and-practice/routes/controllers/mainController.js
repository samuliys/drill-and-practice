import * as statService from "../../services/statisticsService.js";

const showMain = async ({ render }) => {
  const stats = {
    topics: await statService.countTopics(),
    questions: await statService.countQuestions(),
    answers: await statService.countAnswers(),
    main: true,
  };
  render("main.eta", stats);
};

const showError = ({ render }) => {
  render("error.eta");
};

export { showError, showMain };
