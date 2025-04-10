import { getServerConfig } from "@/lib/firebaseAdmin";
import { questionSchema, questionsSchema } from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

export const maxDuration = 60;

export async function POST(req: Request) {  
  const serverConfig = await getServerConfig();
  const modelName = serverConfig?.getString('model_name') ?? 'gemini-1.5-flash-latest';

  const { files } = await req.json();
  const firstFile = files[0].data;

  const result = streamObject({
    model: google(modelName),
    messages: [
      {
        role: "system",
        content:
          "You are a teacher. Your job is to take a document, and create a set of flash cards (with 20 questions max) based on the content of the document. The length of questions and answers is limited to 15 words",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Create a set of flash cards based on this document.",
          },
          {
            type: "file",
            data: firstFile,
            mimeType: "application/pdf",
          },
        ],
      },
    ],
    schema: questionSchema,
    output: "array",
    onFinish: ({ object }) => {
      const res = questionsSchema.safeParse(object);
      if (res.error) {
        throw new Error(res.error.errors.map((e) => e.message).join("\n"));
      }
    },
  });

  return result.toTextStreamResponse();
}
