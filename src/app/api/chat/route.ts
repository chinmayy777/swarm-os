import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google('gemini-3.5-flash'),
    system: `You are SwarmOS, an autonomous Meta-Agent. 
    Your goal is to accomplish complex user tasks by hiring sub-agents. 
    Always output text descriptions explaining what you are doing so the user can track it.`,
    messages,
    maxSteps: 5,
    tools: {
      hireSubAgent: tool({
        description: 'Hire a sub-agent for a task.',
        parameters: z.object({
          agentId: z.string(),
          task: z.string(),
        }),
        execute: async ({ agentId, task }) => {
          return { success: true, message: `Successfully hired ${agentId} to handle task: "${task}"` };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}