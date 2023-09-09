import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import * as statService from "../../services/statisticsService.js";

const showQuizTopics = async ({ render, user }) => {
  const questionsCount = await statService.countAllValidQuestions();
  const answerCount = await statService.countAllCorrectAnswers(user.id);
  let progress = 0;
  if (questionsCount != 0) {
    progress = Math.round(answerCount / questionsCount * 100);
  }

  const topics = await topicService.getAllTopics();

  const totalAnswers = await statService.countAnswers();
  const totalCorrectAnswers = await statService.countTotalCorrectAnswers();
  let totalSuccess = 0;
  if (totalAnswers != 0) {
    totalSuccess = Math.round(totalCorrectAnswers / totalAnswers * 100);
  }

  const totalUserAnswers = await statService.countAnswersForUser(user.id);
  const totalUserCorrectAnswers = await statService.countTotalUserCorrectAnswers(user.id);
  let userSuccess = 0;
  if (totalUserAnswers != 0) {
    userSuccess = Math.round(totalUserCorrectAnswers / totalUserAnswers * 100);
  }

  const statistics = {
    userSuccess: userSuccess,
    totalSuccess: totalSuccess,
    userFail: 100 - userSuccess,
    totalFail: 100 - totalSuccess,
  };

  for (const topic of topics) {
    const topicQuestions = await statService.countTopicValidQuestions(topic.id);
    const topicAnswers = await statService.countTopicAnswers(user.id, topic.id);
    topic.questions = topicQuestions;
    topic.answers = topicAnswers;
  }

  const data = {
    topics: topics,
    questionsCount: questionsCount,
    answerCount: answerCount,
    progress: progress,
    stats: statistics,
    quiz: true,
  };
  render("quizTopics.eta", data);
};

const showCorrect = async ({ params, render }) => {
  const topic = await topicService.getTopicWithID(params.tId);
  const question = await questionService.getQuestionWithID(params.qId);

  const data = {
    topic: topic[0],
    question: question[0],
    correct: true,
    quiz: true,
  };
  render("result.eta", data);
};

const showIncorrect = async ({ params, render }) => {
  const topic = await topicService.getTopicWithID(params.tId);
  const question = await questionService.getQuestionWithID(params.qId);
  const correctAnswer = await questionService.getCorrectOption(params.qId);

  const data = {
    topic: topic[0],
    question: question[0],
    answer: correctAnswer[0],
    correct: false,
    quiz: true,
  };
  render("result.eta", data);
};

const getRandomQuestion = async ({ params, render, response }) => {
  const topic = await topicService.getTopicWithID(params.tId);
  if (!topic || topic.length === 0) {
    render("error.eta");
    return;
  }

  const questions = await questionService.getValidQuestions(params.tId);
  const randQuestion = questions[Math.floor(Math.random() * questions.length)];

  if (!(questions && questions.length > 0)) {
    render("noQuestions.eta", { topic: topic[0] });
  } else {
    const url = `/quiz/${params.tId}/questions/${randQuestion.id}`;
    response.redirect(url);
  }
};

const viewAnswerQuestion = async ({ params, render }) => {
  const topic = await topicService.getTopicWithID(params.tId);
  const question = await questionService.getQuestionWithID(params.qId);
  const options = await questionService.getOptionsWithIDRandomOrder(params.qId);

  if (!topic || topic.length === 0 || !question || question.length === 0) {
    render("error.eta");
    return;
  }

  const data = {
    topic: topic[0],
    question: question[0],
    options: options,
    quiz: true,
  };
  render("quizQuestion.eta", data);
};

const processAnswer = async ({ params, response, user }) => {
  if (!user) {
    response.status = 401;
    return;
  }

  await questionService.addAnswer(user.id, params.qId, params.oId);
  const answer = await questionService.getOptionWithOptionID(params.oId);

  const url = `/quiz/${params.tId}/questions/${params.qId}/`;
  if (answer[0].is_correct) {
    response.redirect(url + "correct");
  } else {
    response.redirect(url + "incorrect");
  }
};

export {
  getRandomQuestion,
  processAnswer,
  showCorrect,
  showIncorrect,
  showQuizTopics,
  viewAnswerQuestion,
};
