document.addEventListener('DOMContentLoaded', () => {
  const widget = document.querySelector('[data-chatbot-widget]');
  if (!widget) return;

  const toggle = widget.querySelector('[data-chatbot-toggle]');
  const closeBtn = widget.querySelector('[data-chatbot-close]');
  const form = widget.querySelector('[data-chatbot-form]');
  const input = widget.querySelector('[data-chatbot-input]');
  const messages = widget.querySelector('[data-chatbot-messages]');
  const status = widget.querySelector('[data-chatbot-status]');
  const chips = widget.querySelectorAll('[data-chatbot-chip]');
  const sendButton = widget.querySelector('.chatbot-send');
  const API_URL = (window.CHATBOT_API_URL || '').trim();

  const fallbackReplies = [
    {
      match: ['appointment', 'book', 'consultation', 'booking'],
      reply: 'You can book an appointment by calling the clinic or using the contact page form. Once your Render bot is live, this can send richer automated replies too.'
    },
    {
      match: ['timing', 'hours', 'open', 'time'],
      reply: 'The demo clinic timings are Monday to Saturday, 9:00 AM to 7:00 PM.'
    },
    {
      match: ['address', 'location', 'map', 'where'],
      reply: 'The demo address is 215 Grand Avenue, Your City. Replace it with your real clinic address in the site content.'
    },
    {
      match: ['doctor', 'dentist', 'team'],
      reply: 'You can view the demo doctors on the Doctors page. Swap those names and photos with your actual clinic team.'
    },
    {
      match: ['service', 'treatment', 'implant', 'aligner', 'cleaning', 'root canal'],
      reply: 'The Services page already lists the core demo treatments. You can customise each treatment and the bot can be upgraded to answer with exact clinic-specific details.'
    }
  ];

  const addMessage = (text, type = 'bot') => {
    const wrapper = document.createElement('div');
    wrapper.className = `chatbot-message ${type}`;
    const bubble = document.createElement('div');
    bubble.className = 'chatbot-bubble';
    bubble.textContent = text;
    wrapper.appendChild(bubble);
    messages.appendChild(wrapper);
    messages.scrollTop = messages.scrollHeight;
  };

  const setStatus = (text = '') => {
    status.textContent = text;
  };

  const openChat = () => {
    widget.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    input.focus();
  };

  const closeChat = () => {
    widget.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  const getFallbackReply = (message) => {
    const lower = message.toLowerCase();
    const found = fallbackReplies.find(item => item.match.some(word => lower.includes(word)));
    if (found) return found.reply;
    return 'I can help with appointments, timings, services, doctors, or location. Add your Render API URL later for a full backend-powered chatbot.';
  };

  const askBot = async (message) => {
    const hasRealApi = API_URL && !API_URL.includes('YOUR-RENDER-APP') && !API_URL.includes('your-render-service');
    if (!hasRealApi) {
      return getFallbackReply(message);
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (typeof data.reply === 'string' && data.reply.trim()) {
      return data.reply.trim();
    }

    throw new Error('Invalid response');
  };

  const submitMessage = async (message) => {
    const text = message.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';
    input.disabled = true;
    sendButton.disabled = true;
    setStatus('Assistant is typing...');

    try {
      const reply = await askBot(text);
      addMessage(reply, 'bot');
      if (!API_URL || API_URL.includes('YOUR-RENDER-APP') || API_URL.includes('your-render-service')) {
        setStatus('Using built-in fallback replies. Replace window.CHATBOT_API_URL with your Render /chat URL.');
      } else {
        setStatus('Connected to live chatbot API.');
      }
    } catch (error) {
      addMessage('The live bot could not respond just now, so the site is falling back to basic replies.', 'bot');
      addMessage(getFallbackReply(text), 'bot');
      setStatus('Live API failed. Fallback replies are active.');
    } finally {
      input.disabled = false;
      sendButton.disabled = false;
      input.focus();
      messages.scrollTop = messages.scrollHeight;
    }
  };

  toggle?.addEventListener('click', () => {
    if (widget.classList.contains('open')) {
      closeChat();
    } else {
      openChat();
    }
  });

  closeBtn?.addEventListener('click', closeChat);

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      openChat();
      submitMessage(chip.dataset.chatbotChip || chip.textContent || '');
    });
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    submitMessage(input.value);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && widget.classList.contains('open')) {
      closeChat();
    }
  });

  addMessage('Hi, I am the clinic assistant. Ask about appointments, treatments, timings, location, or doctors.');
  if (!API_URL || API_URL.includes('YOUR-RENDER-APP') || API_URL.includes('your-render-service')) {
    setStatus('Fallback mode is ready. Add your Render /chat URL to activate the live bot.');
  }
});
