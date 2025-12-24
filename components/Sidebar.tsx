
import React from 'react';
import { Chat, User } from '../types';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onChatSelect: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onOpenSettings: () => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  chats, 
  activeChatId, 
  onChatSelect, 
  onNewChat, 
  onDeleteChat,
  onOpenSettings,
  user,
  onLogout
}) => {
  return (
    <div className="w-64 md:w-80 bg-slate-950 border-r border-slate-800 flex flex-col h-full shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-lg font-black text-white tracking-tighter uppercase">Visionary<span className="text-indigo-500">.AI</span></h1>
        </div>

        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-black uppercase tracking-widest py-4 px-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/10 active:scale-[0.98]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Создать поток
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 mb-2 space-y-1 scrollbar-hide">
        <div className="px-2 mb-4 flex items-center justify-between">
          <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Архив диалогов</span>
          <span className="text-[9px] font-black text-indigo-500/50 bg-indigo-500/5 px-1.5 py-0.5 rounded border border-indigo-500/10 uppercase tracking-tighter">{chats.length}</span>
        </div>
        
        {chats.length === 0 ? (
          <div className="p-10 text-center border-2 border-dashed border-slate-900 rounded-3xl">
            <p className="text-slate-700 text-[10px] uppercase font-black tracking-widest">Диалоги отсутствуют</p>
          </div>
        ) : (
          chats.map(chat => (
            <div 
              key={chat.id}
              className={`group flex items-center gap-3 px-4 py-3.5 rounded-2xl cursor-pointer transition-all border ${
                activeChatId === chat.id 
                  ? 'bg-slate-900 border-slate-800 text-white shadow-xl' 
                  : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-900/30 hover:text-slate-300'
              }`}
              onClick={() => onChatSelect(chat.id)}
            >
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all ${activeChatId === chat.id ? 'bg-indigo-400 scale-125' : 'bg-slate-800'}`}></div>
              <span className="truncate text-xs font-bold flex-1">{chat.title}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("Удалить этот поток данных?")) onDeleteChat(chat.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-slate-950/80 backdrop-blur-xl border-t border-slate-900">
        {/* System Info */}
        <div className="grid grid-cols-2 gap-2 mb-4 px-2">
           <div className="flex flex-col gap-1">
              <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Статус системы</span>
              <div className="flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                 <span className="text-[9px] font-bold text-emerald-500 uppercase">Online</span>
              </div>
           </div>
           <div className="flex flex-col gap-1 items-end">
              <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Ядро</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">v2.5.0-Dev</span>
           </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl mb-4 group hover:border-indigo-500/40 transition-all cursor-default shadow-lg">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-2xl ring-4 ring-indigo-500/10 group-hover:rotate-3 transition-transform">
              {user.username[0].toUpperCase()}
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-xs font-black text-white truncate uppercase tracking-tight">{user.username}</p>
              <div className="bg-indigo-500 text-white text-[7px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter shadow-sm">Developer</div>
            </div>
            <p className="text-[9px] text-slate-500 font-bold truncate tracking-tight opacity-70 italic">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={onOpenSettings}
            className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest bg-slate-900 hover:bg-slate-800 text-slate-500 hover:text-white py-4 rounded-xl border border-slate-800 transition-all active:scale-95"
          >
            Настройки
          </button>
          <button 
            onClick={onLogout}
            className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest bg-slate-900 hover:bg-red-900/10 text-slate-500 hover:text-red-400 py-4 rounded-xl border border-slate-800 hover:border-red-900/20 transition-all active:scale-95"
          >
            Сброс
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
