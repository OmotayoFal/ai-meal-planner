import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { budget, allergies, preferences, cookingLevel } = req.body;

    const prompt = `
You are an expert UK meal planner and chef.

Create a weekly meal plan of **5 unique recipes for one person** that fits within a total budget of **£${budget}**.

- Ingredients should include approximate prices in GBP (e.g., "200g chicken breast - £3.00").
- Reuse ingredients across recipes when possible to stay under budget.
- Return only valid JSON with this schema:

{
  "recipes": [
    {
      "name": "Recipe name",
      "ingredients": ["quantity + ingredient name - £price", "..."],
      "method": ["step 1", "step 2", "..."]
    }
  ],
  "shoppingList": ["ingredient 1 - £price", "ingredient 2 - £price", "..."],
  "estimatedTotal": "£xx.xx"
}

Make sure the **estimatedTotal is below £${budget}** and represents the sum of all shopping list items.
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "You are a UK meal planner AI. Respond only with valid JSON. No text outside JSON.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();
    const messageObj = data.choices?.[0]?.message;

    if (!messageObj || !messageObj.content) {
      console.error("⚠️ Missing message content:", data);
      return res
        .status(500)
        .json({ msg: "No valid response from Groq", raw: data });
    }

    // Extract JSON from AI response
    let parsed;
    try {
      const jsonMatch = messageObj.content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in model response");
      parsed = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error(
        "⚠️ Could not parse model JSON:",
        e,
        "\nRaw message:",
        messageObj.content
      );
      return res
        .status(500)
        .json({ msg: "Invalid JSON from model", raw: messageObj.content });
    }

    res.json(parsed);
  } catch (err) {
    console.error("Groq API error:", err);
    res
      .status(500)
      .json({ msg: "Error generating meal plan", error: err.message });
  }
});

export default router;
