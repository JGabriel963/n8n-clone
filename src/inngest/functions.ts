import * as Sentry from "@sentry/nextjs";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const google = createGoogleGenerativeAI();

export const execute = inngest.createFunction(
  { id: "execute-ia" },
  { event: "execute/ia" },
  async ({ event, step }) => {
    await step.sleep("pretend", "5s");

    Sentry.logger.info("User triggered test log", {
      log_source: "sentry_test",
    });
    console.warn("Somethins is missing");
    console.error("This is an error i want to track");

    const { steps } = await step.ai.wrap(
      "gemmini-generate-text",
      generateText,
      {
        model: google("gemini-2.5-flash"),
        system: "You are a helpful assistant.",
        prompt: "What is 2 + 7?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );

    return steps;
  }
);
