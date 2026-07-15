import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google('gemini-1.5-flash'), // This is the free, fast model
    system: `You are SwarmOS, an autonomous Meta-Agent. 
    Your goal is to accomplish complex user tasks by hiring sub-agents.`,
    messages,
    tools: {
      hireSubAgent: tool({
        description: 'Hire a sub-agent for a task.',
        parameters: z.object({
          agentId: z.string(),
          task: z.string(),
        }),
        execute: async ({ agentId, task }) => {
          return { success: true, message: `Hired ${agentId} to do: ${task}` };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}