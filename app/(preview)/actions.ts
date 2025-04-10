"use server";

import { getServerConfig } from "@/lib/firebaseAdmin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

export const generateQuizTitle = async (file: string) => {
  const serverConfig = await getServerConfig();
  const modelName = serverConfig?.getString('model_name') ?? 'gemini-1.5-flash-latest';
  const result = await generateObject({
    model: google(modelName),
    schema: z.object({
      title: z
        .string()
        .describe(
          "A max three word title for the quiz based on the file provided as context",
        ),
    }),
    prompt:
      "Generate a title for a quiz based on the following (PDF) file name. Try and extract as much info from the file name as possible. If the file name is just numbers or incoherent, just return quiz.\n\n " + file,
  });
  return result.object.title;
};
