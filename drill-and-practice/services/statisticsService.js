import { sql } from "../database/database.js";

const countTopics = async () => {
  const rows = await sql`SELECT COUNT(*) AS count FROM topics`;
  return rows[0].count;
};

const countQuestions = async () => {
  const rows = await sql`SELECT COUNT(*) AS count FROM questions`;
  return rows[0].count;
};

const countAnswers = async () => {
  const rows = await sql`SELECT COUNT(*) AS count FROM question_answers`;
  return rows[0].count;
};

const countTotalCorrectAnswers = async () => {
  const rows = await sql`
    SELECT COUNT(question_answer_option_id) AS count
    FROM question_answers
    WHERE question_answer_option_id IN
      (SELECT id FROM question_answer_options WHERE is_correct = true)`;

  return rows[0].count;
};

const countAnswersForUser = async (userId) => {
  const rows = await sql`SELECT COUNT(*) AS count FROM question_answers WHERE user_id = ${userId}`;
  return rows[0].count;
};

const countTotalUserCorrectAnswers = async (userId) => {
  const rows = await sql`
    SELECT COUNT(A1.question_answer_option_id) AS count
    FROM (SELECT * FROM question_answers WHERE user_id = ${userId}) AS A1
    WHERE A1.question_answer_option_id IN
      (SELECT id FROM question_answer_options WHERE is_correct = true)`;

  return rows[0].count;
};

const countAllValidQuestions = async () => {
  const rows = await sql`
    SELECT COUNT(*) AS count
    FROM questions
    WHERE id IN
      (SELECT question_id FROM question_answer_options WHERE is_correct = true)`;

  return rows[0].count;
};

const countTopicAnswers = async (userId, topicId) => {
  const rows = await sql`
    SELECT COUNT(DISTINCT A1.question_answer_option_id) AS count
    FROM (SELECT * FROM question_answers WHERE user_id = ${userId}) AS A1
    WHERE A1.question_answer_option_id IN
      (SELECT id
        FROM question_answer_options
        WHERE (is_correct = true AND question_id IN (
          SELECT id FROM questions WHERE topic_id = ${topicId}
        )))`;

  return rows[0].count;
};

const countAllCorrectAnswers = async (userId) => {
  const rows = await sql`
    SELECT COUNT(DISTINCT A1.question_answer_option_id) AS count
    FROM (SELECT * FROM question_answers WHERE user_id = ${userId}) AS A1
    WHERE A1.question_answer_option_id IN
      (SELECT id FROM question_answer_options WHERE is_correct = true)`;

  return rows[0].count;
};

const countAllTopicQuestions = async (topicId) => {
  const rows = await sql`
    SELECT COUNT(*) AS count
    FROM questions
    WHERE topic_id = ${topicId}`;

  return rows[0].count;
};

const countTopicValidQuestions = async (topicId) => {
  const rows = await sql`
    SELECT COUNT(*) AS count
    FROM (SELECT * FROM questions WHERE topic_id = ${topicId}) AS Q1
    WHERE Q1.id IN
      (SELECT question_id FROM question_answer_options WHERE is_correct = true)`;

  return rows[0].count;
};
export {
  countAllCorrectAnswers,
  countAllTopicQuestions,
  countAllValidQuestions,
  countAnswers,
  countQuestions,
  countTopicAnswers,
  countTopics,
  countTopicValidQuestions,
  countAnswersForUser,
  countTotalUserCorrectAnswers,
  countTotalCorrectAnswers
};
