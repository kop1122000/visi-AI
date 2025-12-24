
import React, { useState, useRef, useEffect } from 'react';
import { Chat, Message } from '../types';

interface ChatAreaProps {
  chat: Chat | null;
  onSendMessage: (text: string, isImage?: boolean) => void;
  onCreateFirstChat: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({ chat, onSendMessage, onCreateFirstChat }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const handleSubmit = (e?: React.FormEvent, isImage: boolean = false) => {
    e?.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input, isImage);
    setInput('');
  };

  const exportChat = () => {
    if (!chat) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(chat, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `chat_export_${chat.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (!chat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-900">
        <div className="bg-slate-800 p-12 rounded-2xl shadow-xl max-w-md border border-slate-700 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Visionary AI</h2>
          <p className="text-slate-400 mb-8">
            Добро пожаловать, Разработчик. Все ваши диалоги и изображения сохраняются локально.
          </p>
          <button 
            onClick={onCreateFirstChat}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-indigo-500/30 active:scale-95"
          >
            Начать новый чат
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-900">
      <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-white truncate max-w-xs">{chat.title}</h1>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Session ID: {chat.id}</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={exportChat}
            title="Экспортировать чат"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
          <div className="h-4 w-[1px] bg-slate-800"></div>
          <div className="text-xs text-indigo-400 font-mono bg-indigo-500/10 px-2 py-1 rounded">{chat.messages.length} MSG</div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
        {chat.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center opacity-30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-lg">Чат пуст. Напишите что-нибудь!</p>
          </div>
        ) : (
          chat.messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-xl ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/50'
              }`}>
                {msg.imageUrl && (
                  <div className="mb-4 rounded-xl overflow-hidden bg-black/40 border border-slate-700 min-h-[200px] flex items-center justify-center relative group">
                    <img 
                      src={msg.imageUrl} 
                      alt="Generated" 
                      className="w-full h-auto object-contain cursor-zoom-in transition-transform duration-500 group-hover:scale-[1.02]" 
                      onClick={() => window.open(msg.imageUrl, '_blank')}
                    />
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <a 
                        href={msg.imageUrl} 
                        download="ai_image.png" 
                        className="p-2 bg-black/60 hover:bg-indigo-600 rounded-lg text-white"
                        onClick={(e) => e.stopPropagation()}
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                         </svg>
                       </a>
                    </div>
                  </div>
                )}
                
                {msg.content === 'Создаю изображение...' ? (
                   <div className="flex flex-col items-center justify-center py-8 space-y-4">
                      <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                      <span className="text-xs font-bold text-indigo-400 animate-pulse uppercase tracking-widest">Генерация образа...</span>
                   </div>
                ) : (
                  <div className="whitespace-pre-wrap text-sm md:text-base leading-relaxed font-medium">
                    {msg.content}
                  </div>
                )}
                
                <div className={`text-[9px] mt-2 font-bold uppercase tracking-widest flex items-center gap-1 ${msg.role === 'user' ? 'text-indigo-200/60' : 'text-slate-500'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  <div className={`w-1 h-1 rounded-full ${msg.role === 'user' ? 'bg-indigo-300' : 'bg-slate-600'}`}></div>
                  {msg.role === 'user' ? 'Вы' : 'Ассистент'}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative flex items-end gap-2 bg-slate-800 rounded-2xl p-2 border border-slate-700/50 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Спросите о чем-нибудь или опишите картинку..."
              rows={1}
              className="flex-1 bg-transparent text-white py-3 px-3 focus:outline-none resize-none scrollbar-none max-h-48 text-sm md:text-base"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <div className="flex gap-1 pb-1 pr-1">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                title="Сгенерировать изображение"
                className="p-3 text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all active:scale-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em]">Аккаунт Разработчика • Шифрование AES-256 (Local)</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;
