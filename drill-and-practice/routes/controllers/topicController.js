import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import * as statService from "../../services/statisticsService.js";
import { validasaur } from "../../deps.js";

const showTopics = async ({ render }) => {
  const data = await getTopicsPageData();

  render("topics.eta", data);
};

const getTopicsPageData = async () => {
  const topics = await topicService.getAllTopics();

  for (const topic of topics) {
    const topicQuestions = await statService.countAllTopicQuestions(topic.id);
    topic.questions = topicQuestions;
  }

  const data = {
    topics: topics,
    count: await statService.countTopics(),
  };

  return data;
};

const topicValidationRules = async () => {
  const topics = await topicService.getAllTopics();
  const names = topics.map(topic => topic.name);

  const rules = {
    name: [validasaur.required, validasaur.minLength(1), validasaur.notIn(names)],
  };
  return rules;
};

const getTopicData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  return {
    name: params.get("name").trim(),
  };
};


const addTopic = async ({ request, response, render, user }) => {
  if (!user.admin) {
    response.status = 401;
    return;
  }
  const topicData = await getTopicData(request);
  const validationRules = await topicValidationRules();

  const [passes, errors] = await validasaur.validate(
    topicData,
    validationRules,
  );

  if (!passes) {
    const data = {
      ...await getTopicsPageData(),
      ...topicData,
    };

    data.validationErrors = errors;
    render("topics.eta", data);
  } else {
    await topicService.addTopic(user.id, topicData.name);

    response.redirect("/topics");
  }
};

const questionValidationRules = {
  question_text: [validasaur.required, validasaur.minLength(1)],
};

const getQuestionData = async (request) => {
  const body = request.body({ type: "form" });
  const parameters = await body.value;
  const text = parameters.get("question_text").trim();

  return { question_text: text };
}

const addQuestion = async ({ params, request, response, render, user }) => {
  if (!user) {
    response.status = 401;
    return;
  }
  const questionData = await getQuestionData(request);

  const [passes, errors] = await validasaur.validate(
    questionData,
    questionValidationRules,
  );

  if (!passes) {
    const data = {
      ...await getTopicPageData(params.id),
      ...questionData,
    };

    data.validationErrors = errors;
    render("topic.eta", data);
  } else {
    await questionService.addQuestion(user.id, params.id, questionData.question_text);

    response.redirect("/topics/" + params.id);
  }
};

const deleteTopic = async ({ params, response, user }) => {
  if (!user.admin) {
    response.status = 401;
    return;
  }

  const questions = await questionService.getQuestionsWithTopicID(params.id);
  for (const question of questions) {
    await deleteQuestion(question.id);
  }

  await topicService.removeTopic(params.id);

  response.redirect("/topics");
};

const deleteQuestion = async (questionId) => {

  await questionService.deleteAllQuestionAnswersByQuestion(questionId);
  await questionService.deleteAllAnswerOptions(questionId);
  await questionService.deleteQuestion(questionId);
};

const getTopicPageData = async (topicId) => {
  const result = await topicService.getTopicWithID(topicId);

  const topic = result[0];
  const questions = await questionService.getQuestionsWithTopicID(topic.id);
  const validQuestions = await questionService.getValidQuestions(topic.id);
  const validIds = validQuestions.map(x => x.id);

  const validQs = [];
  const invalidQs = [];
  for (const question of questions) {
    if (validIds.includes(question.id)) {
      question.valid = true;
      validQs.push(question);
    } else {
      invalidQs.push(question);
    }
  }

  const data = {
    topic: topic,
    questions: validQs.concat(invalidQs),
  };

  return data;
};

const viewTopic = async ({ params, render }) => {
  const result = await topicService.getTopicWithID(params.id);

  if (result && result.length > 0) {
    const topic = result[0];
    const questions = await questionService.getQuestionsWithTopicID(topic.id);
    const validQuestions = await questionService.getValidQuestions(topic.id);
    const validIds = validQuestions.map(x => x.id);

    const validQs = [];
    const invalidQs = [];
    for (const question of questions) {
      if (validIds.includes(question.id)) {
        question.valid = true;
        validQs.push(question);
      } else {
        invalidQs.push(question);
      }
    }

    const data = {
      topic: topic,
      questions: validQs.concat(invalidQs),
    };
    render("topic.eta", data);
  } else {
    render("error.eta");
  }
};

export { addQuestion, addTopic, deleteTopic, showTopics, viewTopic };
