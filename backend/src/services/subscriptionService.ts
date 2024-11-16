import  pool  from "../config/db";

export const getSubscribersByTopic = async (industry: string) => {
  const query = `
    SELECT email
    FROM subscriptions
    INNER JOIN users ON subscriptions.user_id = users.user_id
    WHERE subscriptions.industry = $1
  `;
  const result = await pool.query(query, [industry]);
  return result.rows;
};
