
// Для работы этого сервиса нужно заменить заглушки на реальные ключи из личного кабинета EmailJS
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY"; 
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";

declare const emailjs: any;

export const emailService = {
  init: () => {
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }
  },

  sendVerificationCode: async (toEmail: string, username: string, code: string) => {
    // Если ключи не настроены, возвращаем ошибку для уведомления пользователя
    if (EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
      console.warn("EmailJS не настроен. Используйте свои ключи для реальной отправки.");
      throw new Error("Email service is not configured with real API keys.");
    }

    try {
      const templateParams = {
        to_email: toEmail,
        to_name: username,
        message: `Ваш проверочный код для Visionary AI: ${code}`,
        verification_code: code
      };

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
      return true;
    } catch (error) {
      console.error("EmailJS Error:", error);
      throw error;
    }
  }
};
