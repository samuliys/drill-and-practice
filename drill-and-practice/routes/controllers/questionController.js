import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import { validasaur } from "../../deps.js";

const showQuestion = async ({ params, render }) => {
  const result = await topicService.getTopicWithID(params.id);
  const qResult = await questionService.getQuestionWithID(params.qId);
  const answers = await questionService.getOptionsWithID(params.qId);
  const count = await questionService.countCorrectOptions(params.qId);
  const has_correct = (Number(count) === 1) ? true : false;

  if (result && result.length > 0 && qResult && qResult.length > 0) {
    const topic = result[0];
    const question = qResult[0];

    const data = {
      topic: topic,
      question: question,
      answers: answers,
      has_correct: has_correct,
    };

    render("question.eta", data);
  } else {
    render("error.eta");
  }
};

const getQuestionPageData = async (topicId, questionId) => {
  const result = await topicService.getTopicWithID(topicId);
  const qResult = await questionService.getQuestionWithID(questionId);
  const answers = await questionService.getOptionsWithID(questionId);
  const count = await questionService.countCorrectOptions(questionId);
  const has_correct = (Number(count) === 1) ? true : false;

  const topic = result[0];
  const question = qResult[0];

  const data = {
    topic: topic,
    question: question,
    answers: answers,
    has_correct: has_correct,
  };

  return data;
};


const optionValidationRules = async (questionId) => {
  const topics = await questionService.getOptionsWithID(questionId);
  const names = topics.map(topic => topic.option_text);

  const count = await questionService.countCorrectOptions(questionId);
  const has_correct = (Number(count) === 1) ? true : false;

  const rules = {
    option_text: [validasaur.required, validasaur.minLength(1), validasaur.notIn(names)],
  };

  if (has_correct) {
    rules.is_correct = [validasaur.notIn([true])];
  }
  return rules;
};

const getOptionData = async (request) => {
  const body = request.body({ type: "form" });
  const parameters = await body.value;
  let is_correct = false;
  if (parameters.get("is_correct")) {
    is_correct = true;
  }
  return {
    option_text: parameters.get("option_text").trim(),
    is_correct: is_correct,
  };
};

const addOption = async ({ params, request, response, render, user }) => {
  if (!user) {
    response.status = 401;
    return;
  }

  const optionData = await getOptionData(request);

  const validationRules = await optionValidationRules(params.qId);

  const [passes, errors] = await validasaur.validate(
    optionData,
    validationRules,
  );

  if (!passes) {
    const data = {
      ...await getQuestionPageData(params.id, params.qId),
      ...optionData,
    };

    data.validationErrors = errors;
    render("question.eta", data);
  } else {
    await questionService.addOption(params.qId, optionData.option_text, optionData.is_correct);

    const url = `/topics/${params.id}/questions/${params.qId}`;
    response.redirect(url);
  }
};

const deleteQuestion = async ({ params, response, user }) => {
  if (!user) {
    response.status = 401;
    return;
  }

  await questionService.deleteAllQuestionAnswersByQuestion(params.qId);
  await questionService.deleteAllAnswerOptions(params.qId);
  await questionService.deleteQuestion(params.qId);
  const url = `/topics/${params.tId}`;

  response.redirect(url);
};

const deleteOption = async ({ params, response, user }) => {
  if (!user) {
    response.status = 401;
    return;
  }

  await questionService.deleteAllQuestionAnswersByOption(params.oId);
  await questionService.deleteOption(params.oId);

  const url = `/topics/${params.tId}/questions/${params.qId}`;

  response.redirect(url);
};

export { addOption, deleteOption, deleteQuestion, showQuestion };
