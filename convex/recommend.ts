"use node";

import { generateText, Output } from "ai";
import { action } from "./_generated/server";
import {
  aiRecommendationSchema,
  recommendHybrid,
} from "./domain/hybridRecommendation";
import {
  recommendationInputValidator,
  recommendationValidator,
} from "./validators";

const MAX_BRIEF_LENGTH = 2_000;
const DEFAULT_AI_GATEWAY_MODEL = "openai/gpt-5.4";

export const hybrid = action({
  args: recommendationInputValidator,
  returns: recommendationValidator,
  handler: async (_ctx, args) => {
    if (args.brief.trim().length === 0) {
      throw new Error("Brief must not be empty");
    }
    if (args.brief.length > MAX_BRIEF_LENGTH) {
      throw new Error(
        `Brief must be at most ${MAX_BRIEF_LENGTH.toString()} characters`,
      );
    }

    return await recommendHybrid(args, {
      gatewayApiKey: process.env.AI_GATEWAY_API_KEY,
      generate: async (input) => {
        const result = await generateText({
          model: process.env.AI_GATEWAY_MODEL ?? DEFAULT_AI_GATEWAY_MODEL,
          output: Output.object({ schema: aiRecommendationSchema }),
          prompt: [
            "Recommend one production-ready circular textile workflow.",
            "Only use slugs allowed by the schema.",
            "Never choose digital-print with reclaimed material.",
            `Product: ${input.productSlug}`,
            `Brief: ${input.brief}`,
          ].join("\n"),
        });

        return result.output;
      },
    });
  },
});
