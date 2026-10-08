/**
 * This is where we'll add a route for resuming a stream for an agent chat.
 *
 * During the workshop you will wire this up in the Workflows chapter.
 *
 * Workshop docs: https://agent-foundations-certification.vercel.app/docs/workflows
 */

import { chatFlow } from "@/lib/workflows/chat-flow";
import { createModelCallToUIChunkTransform } from "@ai-sdk/workflow/client";
import type { UIMessage } from "ai";
import { createUIMessageStreamResponse } from "ai";
import { start } from "workflow/api";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const run = await start(chatFlow, [messages]);
  return createUIMessageStreamResponse({
    stream: run.readable.pipeThrough(createModelCallToUIChunkTransform()),
    headers: {
      "x-workflow-run-id": run.runId,
    },
  });
}
