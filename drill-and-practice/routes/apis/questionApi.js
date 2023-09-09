import * as questionService from "../../services/questionService.js";

const getRandomQuestion = async ({ response }) => {
  const questions = await questionService.getAllValidQuestions();

  if (!(questions && questions.length > 0)) {
    response.body = {};
    return;
  }
  const randQuestion = questions[Math.floor(Math.random() * questions.length)];

  const options = await questionService.getOptionsWithID(randQuestion.id);

  for (const option of options) {
    option.optionId = option.id;
    option.optionText = option.option_text;

    delete option.is_correct;
    delete option.question_id;
    delete option.id;
    delete option.option_text;
  }

  const result = {
    questionId: randQuestion.id,
    questionText: randQuestion.question_text,
    answerOptions: options,
  };
  response.body = result;
};

const answerQuestion = async ({ request, response }) => {
  const body = request.body({ type: "json" });
  const document = await body.value;

  const qId = document.questionId;
  const oId = document.optionId;

  let correct = false;
  if (qId && oId) {
    const answer = await questionService.getCorrectOption(qId);
    if (Number(answer[0].id) === Number(oId)) correct = true;
  }
  const result = {
    correct: correct,
  };

  response.body = result;
};

export { answerQuestion, getRandomQuestion };
