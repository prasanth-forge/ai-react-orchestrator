import OpenAI from "openai";

export const generateCode = async (prompt) => {
  const client = new OpenAI();

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return response.choices[0].message.content;
};
