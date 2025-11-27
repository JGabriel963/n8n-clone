import prisma from "@/lib/db";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const google = createGoogleGenerativeAI();

export const execute = inngest.createFunction(
  { id: "execute-ia" },
  { event: "execute/ia" },
  async ({ event, step }) => {
    const { steps } = await step.ai.wrap(
      "gemmini-generate-text",
      generateText,
      {
        model: google("gemini-2.5-flash"),
        system: "You are a helpful assistant.",
        prompt: "What is 2 + 7?",
      }
    );

    return steps;
  }
);
