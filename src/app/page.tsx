'use client';

import { useChat } from '@ai-sdk/react';

export default function Page() {
  const { messages, input, handleInputChange, append, status } = useChat({
    api: '/api/chat',
  });

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Explicitly append the message to force the POST stream
    append({ role: 'user', content: input });
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4 justify-between bg-slate-950 text-white">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        <h1 className="text-xl font-bold tracking-wide border-b border-slate-800 pb-2">SwarmOS Dashboard</h1>
        
        {messages.length === 0 && (
          <p className="text-slate-500 text-sm italic mt-4">No active processes. Awaiting tasks...</p>
        )}

        {messages.map((message) => (
          <div key={message.id} className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
            <strong className={`block text-sm font-semibold uppercase tracking-wider ${
              message.role === 'user' ? 'text-blue-400' : 'text-emerald-400'
            }`}>
              {message.role === 'user' ? '👤 User' : '🤖 SwarmOS'}
            </strong>

            {message.content && (
              <p className="text-slate-200 whitespace-pre-wrap text-sm">{message.content}</p>
            )}

            {/* Safely render tool calls if present */}
            {message.toolInvocations && message.toolInvocations.map((toolInvocation) => {
              const { toolName, toolCallId, state } = toolInvocation;
              return (
                <div key={toolCallId} className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-md text-xs mt-2">
                  <span className="font-mono text-blue-400 font-bold">🛠️ Tool Called: {toolName}</span>
                  {state === 'result' && (
                    <div className="text-emerald-400 mt-1 font-mono">
                      Result: {JSON.stringify(toolInvocation.result)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <form onSubmit={onSubmitForm} className="mt-4 flex gap-2 border-t border-slate-800 pt-4">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder={status === 'submitted' ? "SwarmOS executing..." : "Type a task for SwarmOS..."}
          className="flex-1 p-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
        />
        <button 
          type="submit" 
          disabled={status === 'submitted'}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 px-5 py-3 rounded-lg text-white font-semibold transition text-sm"
        >
          {status === 'submitted' ? 'Running...' : 'Send'}
        </button>
      </form>
    </div>
  );
}