
import React, { useState, useEffect } from 'react';
import { emailService } from '../services/emailService';

interface AuthProps {
  onLogin: (username: string, email: string) => void;
}

type AuthStep = 'credentials' | 'verification';

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [step, setStep] = useState<AuthStep>('credentials');
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [generatedCode, setGeneratedCode] = useState('');
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notifType, setNotifType] = useState<'success' | 'warning' | 'error'>('success');

  useEffect(() => {
    emailService.init();
  }, []);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const generateAndSendCode = async () => {
    setIsLoading(true);
    setError('');
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);

    try {
      await emailService.sendVerificationCode(email, username, code);
      setTimer(60);
      setNotifType('success');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 8000);
    } catch (err: any) {
      // Если ключи не настроены, показываем предупреждение и используем имитацию для демо
      if (err.message?.includes("not configured")) {
        setNotifType('warning');
        setError('Режим демо: API ключи почты не настроены. Код отображен в уведомлении.');
      } else {
        setNotifType('error');
        setError('Ошибка при отправке письма. Проверьте правильность Email.');
      }
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 10000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username && email && password) {
      await generateAndSendCode();
      setStep('verification');
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = verificationCode.join('');
    if (enteredCode === generatedCode) {
      onLogin(username, email);
    } else {
      setError('Неверный код. Пожалуйста, попробуйте снова.');
      setVerificationCode(['', '', '', '', '', '']);
      document.getElementById('code-0')?.focus();
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value !== '' && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && verificationCode[index] === '' && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 relative overflow-hidden text-slate-200">
      
      {/* Toast Notification */}
      <div className={`fixed top-4 right-4 z-50 transition-all duration-500 transform ${showNotification ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
        <div className={`border p-4 rounded-xl shadow-2xl max-w-sm flex items-start gap-3 ${
          notifType === 'success' ? 'bg-indigo-600 border-indigo-400' : 
          notifType === 'warning' ? 'bg-amber-600 border-amber-400' : 'bg-red-600 border-red-400'
        }`}>
          <div className="bg-white/20 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">
              {notifType === 'success' ? 'Письмо отправлено!' : 
               notifType === 'warning' ? 'Режим демонстрации' : 'Ошибка отправки'}
            </h4>
            <p className="text-white/90 text-xs mt-1">
              {notifType === 'success' ? 'Проверьте папку "Входящие" или "Спам".' : 
               notifType === 'warning' ? `Код: ${generatedCode} (настройте EmailJS для реальной почты).` : 
               'Не удалось отправить письмо на указанный адрес.'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700 relative overflow-hidden transition-all duration-500">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {step === 'credentials' ? (isLogin ? 'С возвращением' : 'Регистрация') : 'Подтверждение'}
          </h1>
          <p className="text-slate-400 text-sm">
            {step === 'credentials' 
              ? 'Используйте реальный Email для получения кода' 
              : `Мы отправили код на ${email}`}
          </p>
        </div>

        {step === 'credentials' ? (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 ml-1">Имя пользователя</label>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="ivan_petrov"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 ml-1">Ваш Реальный Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="mail@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 ml-1">Пароль</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 mt-4 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Отправка...
                </>
              ) : (isLogin ? 'Продолжить' : 'Создать аккаунт')}
            </button>
            <div className="mt-6 text-center text-sm text-slate-500">
              {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}{' '}
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4"
              >
                {isLogin ? 'Регистрация' : 'Вход'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifySubmit} className="space-y-6">
            <div className="flex justify-between gap-2">
              {verificationCode.map((digit, idx) => (
                <input
                  key={idx}
                  id={`code-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-12 h-14 bg-slate-900 border border-slate-700 rounded-xl text-center text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              ))}
            </div>

            {error && (
              <div className={`p-3 rounded-lg text-xs font-medium text-center ${notifType === 'warning' ? 'bg-amber-900/30 text-amber-300' : 'bg-red-900/30 text-red-300'}`}>
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
            >
              Подтвердить код
            </button>

            <div className="text-center space-y-4">
              <p className="text-sm text-slate-500">
                Не получили письмо?{' '}
                <button 
                  type="button"
                  disabled={timer > 0 || isLoading}
                  onClick={generateAndSendCode}
                  className={`font-semibold underline underline-offset-4 transition-colors ${
                    (timer > 0 || isLoading) ? 'text-slate-600 cursor-not-allowed' : 'text-indigo-400 hover:text-indigo-300'
                  }`}
                >
                  {isLoading ? 'Отправка...' : `Переотправить ${timer > 0 ? `(${timer}с)` : ''}`}
                </button>
              </p>
              <button 
                type="button"
                onClick={() => setStep('credentials')}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                ← Изменить данные
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
