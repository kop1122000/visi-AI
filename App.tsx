
import React, { useState, useEffect } from 'react';
import { User, Chat, Message, AppSettings } from './types';
import { gemini } from './services/geminiService';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import SettingsModal from './components/SettingsModal';

const DEVELOPER_USER: User = {
  username: 'Разработчик',
  email: 'admin@visionary.ai',
  isLoggedIn: true
};

const DEFAULT_SETTINGS: AppSettings = {
  model: 'gemini-3-flash-preview',
  temperature: 0.7,
  imageAspectRatio: "1:1"
};

const App: React.FC = () => {
  // Теперь пользователь всегда "Разработчик"
  const [user, setUser] = useState<User>(DEVELOPER_USER);

  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem('visionary_chats');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeChatId, setActiveChatId] = useState<string | null>(() => {
    const saved = localStorage.getItem('visionary_active_chat');
    return saved || (chats.length > 0 ? chats[0].id : null);
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('visionary_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('visionary_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (activeChatId) localStorage.setItem('visionary_active_chat', activeChatId);
  }, [activeChatId]);

  useEffect(() => {
    localStorage.setItem('visionary_settings', JSON.stringify(settings));
  }, [settings]);

  const handleLogout = () => {
    // В режиме разработчика "Logout" просто очищает чаты и сбрасывает состояние
    if (window.confirm("Вы уверены, что хотите очистить все данные чатов?")) {
      setChats([]);
      setActiveChatId(null);
      localStorage.removeItem('visionary_chats');
      localStorage.removeItem('visionary_active_chat');
    }
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'Новый диалог',
      messages: [],
      createdAt: Date.now(),
    };
    setChats([newChat, ...chats]);
    setActiveChatId(newChat.id);
  };

  const deleteChat = (id: string) => {
    const updated = chats.filter(c => c.id !== id);
    setChats(updated);
    if (activeChatId === id) {
      setActiveChatId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const sendMessage = async (text: string, isImage: boolean = false) => {
    if (!activeChatId) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const currentChat = chats.find(c => c.id === activeChatId);
    if (!currentChat) return;

    let newTitle = currentChat.title;
    if (currentChat.messages.length === 0) {
        newTitle = text.slice(0, 30) + (text.length > 30 ? '...' : '');
    }

    const updatedMessages = [...currentChat.messages, userMsg];
    
    const assistantMsgId = (Date.now() + 1).toString();
    const assistantMsg: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: isImage ? 'Создаю изображение...' : 'Думаю...',
      timestamp: Date.now() + 1,
    };

    setChats(prev => prev.map(c => 
      c.id === activeChatId 
        ? { ...c, title: newTitle, messages: [...updatedMessages, assistantMsg] } 
        : c
    ));

    if (isImage) {
      const imageUrl = await gemini.generateImage(text, settings.imageAspectRatio);
      setChats(prev => prev.map(c => 
        c.id === activeChatId 
          ? {
              ...c,
              messages: c.messages.map(m => 
                m.id === assistantMsgId 
                  ? { 
                      ...m, 
                      content: imageUrl ? `Изображение по запросу: "${text}"` : 'Не удалось создать изображение. Попробуйте изменить описание.', 
                      imageUrl: imageUrl || undefined 
                    } 
                  : m
              )
            }
          : c
      ));
    } else {
      let fullText = "";
      const stream = gemini.streamChat(currentChat.messages, text);
      let started = false;
      
      for await (const chunk of stream) {
        if (!started) {
          started = true;
          fullText = chunk;
        } else {
          fullText += chunk;
        }
        
        setChats(prev => prev.map(c => 
          c.id === activeChatId 
            ? {
                ...c,
                messages: c.messages.map(m => 
                  m.id === assistantMsgId ? { ...m, content: fullText } : m
                )
              }
            : c
        ));
      }
    }
  };

  const activeChat = chats.find(c => c.id === activeChatId) || null;

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      <Sidebar 
        chats={chats} 
        activeChatId={activeChatId} 
        onChatSelect={setActiveChatId} 
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
        user={user}
        onLogout={handleLogout}
      />
      <main className="flex-1 flex flex-col relative">
        <ChatArea 
          chat={activeChat} 
          onSendMessage={sendMessage} 
          onCreateFirstChat={createNewChat}
        />
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdate={setSettings}
      />
    </div>
  );
};

export default App;
