import { Router } from "express";
import { openai } from "../../server";
import { startNewChat } from "../components/components";

const chatBotAI = Router();

chatBotAI.get("/chat", async (req, res) => {
  let contextMessage =
    "Act as an expert based on the knowledge of cartoon characters";
  const response = await startNewChat(openai, contextMessage);
  return res.json(response);
});

export { chatBotAI };
