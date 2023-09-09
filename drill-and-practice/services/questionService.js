import { sql } from "../database/database.js";

const addQuestion = async (userId, topicId, text) => {
  await sql`INSERT INTO questions
      (user_id, topic_id, question_text)
        VALUES (${userId}, ${topicId}, ${text})`;
};

const addOption = async (questionId, text, correct) => {
  await sql`INSERT INTO question_answer_options
      (question_id, option_text, is_correct)
        VALUES (${questionId}, ${text}, ${correct})`;
};

const addAnswer = async (userId, questionId, answerId) => {
  await sql`INSERT INTO question_answers
      (user_id, question_id, question_answer_option_id)
        VALUES (${userId}, ${questionId}, ${answerId})`;
};

const getQuestionsWithTopicID = async (topicId) => {
  const rows = await sql`SELECT * FROM questions WHERE topic_id = ${topicId}`;

  return rows;
};

const getValidQuestions = async (topicId) => {
  const rows = await sql`
    SELECT *
    FROM (SELECT * FROM questions WHERE topic_id = ${topicId}) AS Q1
    WHERE Q1.id IN
      (SELECT question_id FROM question_answer_options WHERE is_correct = true)`;

  return rows;
};

const getAllValidQuestions = async () => {
  const rows = await sql`
    SELECT *
    FROM questions
    WHERE id IN
      (SELECT question_id FROM question_answer_options WHERE is_correct = true)`;

  return rows;
};

const getQuestionWithID = async (questionId) => {
  const rows = await sql`SELECT * FROM questions WHERE id = ${questionId}`;

  return rows;
};

const getOptionsWithID = async (questionId) => {
  const rows =
    await sql`SELECT * FROM question_answer_options WHERE question_id = ${questionId} ORDER BY is_correct DESC`;

  return rows;
};

const getOptionsWithIDRandomOrder = async (questionId) => {
  const rows =
    await sql`SELECT * FROM question_answer_options WHERE question_id = ${questionId} ORDER BY random()`;

  return rows;
};

const getOptionWithOptionID = async (optionId) => {
  const rows =
    await sql`SELECT * FROM question_answer_options WHERE id = ${optionId}`;

  return rows;
};

const getCorrectOption = async (questionId) => {
  const rows =
    await sql`SELECT * FROM question_answer_options WHERE (question_id = ${questionId} AND is_correct = true)`;

  return rows;
};

const countCorrectOptions = async (questionId) => {
  const rows =
    await sql`SELECT COUNT(*) AS count FROM question_answer_options WHERE (question_id = ${questionId} AND is_correct = true)`;

  return rows[0].count;
};

const deleteQuestion = async (questionId) => {
  await sql`DELETE FROM questions WHERE id = ${questionId}`;
};

const deleteOption = async (optionId) => {
  await sql`DELETE FROM question_answer_options WHERE id = ${optionId}`;
};

const deleteAllAnswerOptions = async (questionId) => {
  await sql`DELETE FROM question_answer_options WHERE question_id = ${questionId}`;
};

const deleteAllQuestionAnswersByQuestion = async (questionId) => {
  await sql`DELETE FROM question_answers WHERE question_id = ${questionId}`;
};

const deleteAllQuestionAnswersByOption = async (optionId) => {
  await sql`DELETE FROM question_answers WHERE question_answer_option_id = ${optionId}`;
};

export {
  addAnswer,
  addOption,
  addQuestion,
  countCorrectOptions,
  deleteAllAnswerOptions,
  deleteAllQuestionAnswersByOption,
  deleteAllQuestionAnswersByQuestion,
  deleteOption,
  deleteQuestion,
  getAllValidQuestions,
  getCorrectOption,
  getOptionsWithID,
  getOptionWithOptionID,
  getQuestionsWithTopicID,
  getQuestionWithID,
  getValidQuestions,
  getOptionsWithIDRandomOrder
};
