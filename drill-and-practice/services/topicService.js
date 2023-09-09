import { sql } from "../database/database.js";

const addTopic = async (userId, name) => {
  await sql`INSERT INTO topics
      (user_id, name)
        VALUES (${userId}, ${name})`;
};

const getAllTopics = async () => {
  const rows = await sql`SELECT * FROM topics ORDER BY name`;

  return rows;
};

const getTopicWithName = async (name) => {
  const rows = await sql`SELECT * FROM topics WHERE name = ${name}`;

  return rows;
};

const getTopicWithID = async (id) => {
  const rows = await sql`SELECT * FROM topics WHERE id = ${id}`;

  return rows;
};

const removeTopic = async (topicId) => {
  await sql`DELETE FROM topics WHERE id = ${topicId}`;
};

export {
  addTopic,
  getAllTopics,
  getTopicWithID,
  getTopicWithName,
  removeTopic,
};
