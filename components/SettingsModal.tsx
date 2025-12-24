
import React, { useState } from 'react';
import { AppSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'deploy'>('general');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Панель Управления</h2>
            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em]">Developer Mode Activated</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50">
          <button 
            onClick={() => setActiveTab('general')}
            className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'general' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Общие настройки
          </button>
          <button 
            onClick={() => setActiveTab('deploy')}
            className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'deploy' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Как залить в браузер (Deploy)
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeTab === 'general' ? (
            <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
              <section>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Модель Интеллекта</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3.5 text-white font-medium focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all cursor-pointer"
                  value={settings.model}
                  onChange={(e) => onUpdate({ ...settings, model: e.target.value })}
                >
                  <option value="gemini-3-flash-preview">Gemini 3 Flash (Скорость + Стабильность)</option>
                  <option value="gemini-3-pro-preview">Gemini 3 Pro (Максимальный IQ)</option>
                </select>
              </section>

              <section>
                <div className="flex justify-between mb-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Креативность (Temperature)</label>
                  <span className="text-xs text-indigo-400 font-black">{settings.temperature}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  value={settings.temperature}
                  onChange={(e) => onUpdate({ ...settings, temperature: parseFloat(e.target.value) })}
                />
                <div className="flex justify-between text-[9px] text-slate-600 mt-2 font-bold uppercase tracking-tighter">
                  <span>Точные ответы</span>
                  <span>Творческий полет</span>
                </div>
              </section>

              <section>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Формат Изображений</label>
                <div className="grid grid-cols-5 gap-2">
                  {(["1:1", "3:4", "4:3", "9:16", "16:9"] as const).map(ratio => (
                    <button
                      key={ratio}
                      onClick={() => onUpdate({ ...settings, imageAspectRatio: ratio })}
                      className={`py-3 px-2 text-[10px] font-black rounded-xl border transition-all ${
                        settings.imageAspectRatio === ratio 
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/20' 
                          : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </section>
              
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex gap-4 items-start">
                 <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                 </div>
                 <p className="text-xs text-slate-400 leading-relaxed">
                    <strong className="text-slate-200">Примечание:</strong> Все данные хранятся в <code className="text-indigo-300 bg-indigo-500/10 px-1 rounded">LocalStorage</code> вашего браузера. Это безопасно и приватно.
                 </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 font-black text-indigo-400 text-xs border border-slate-700">1</div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Сборка проекта</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">Создайте папку на ПК, скачайте предоставленные файлы и установите Node.js. В терминале выполните команду <code className="text-indigo-400">npm install</code>.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 font-black text-indigo-400 text-xs border border-slate-700">2</div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Выбор платформы</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">Самый простой способ «залить» в браузер — использовать <strong className="text-indigo-300">Vercel</strong> или <strong className="text-emerald-400">Netlify</strong>. Это бесплатно для персональных проектов.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 font-black text-indigo-400 text-xs border border-slate-700">3</div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Переменные окружения</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">В настройках Vercel (Environment Variables) обязательно добавьте ключ: <br/> 
                    <code className="text-amber-400 bg-amber-400/10 px-2 py-1 rounded inline-block mt-2">API_KEY = [Ваш_Ключ_Gemini]</code></p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 font-black text-indigo-400 text-xs border border-slate-700">4</div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">Готово!</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">После деплоя сервис даст вам публичную ссылку (например, <code className="text-indigo-400">my-ai-app.vercel.app</code>), по которой вы сможете заходить из любого браузера мира.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-slate-950 border border-slate-800 rounded-2xl">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Полезные ссылки</h4>
                 <div className="grid grid-cols-2 gap-3">
                    <a href="https://vercel.com" target="_blank" className="flex items-center gap-2 text-xs text-slate-300 hover:text-white bg-slate-800 p-3 rounded-xl border border-slate-700 transition-all">
                       <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 22.525H0L12 1.475L24 22.525Z"/></svg>
                       Vercel Home
                    </a>
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" className="flex items-center gap-2 text-xs text-slate-300 hover:text-white bg-slate-800 p-3 rounded-xl border border-slate-700 transition-all">
                       <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2V7a5 5 0 00-5-5zM7 7a3 3 0 016 0v2H7V7z"/></svg>
                       Get API Key
                    </a>
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-widest py-3 px-10 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            Принять и Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
