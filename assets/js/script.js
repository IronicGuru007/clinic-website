
const toggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
if (toggle && nav) {
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));
}

(function initChatWidget() {
  const widget = document.querySelector('[data-chatbot-widget]');
  if (!widget) return;

  const endpoint = widget.getAttribute('data-endpoint');
  const toggleButton = widget.querySelector('[data-chat-toggle]');
  const closeButton = widget.querySelector('[data-chat-close]');
  const panel = widget.querySelector('.chat-panel');
  const messages = widget.querySelector('[data-chat-messages]');
  const form = widget.querySelector('[data-chat-form]');
  const input = widget.querySelector('[data-chat-input]');
  const suggestionButtons = widget.querySelectorAll('[data-chat-prompt]');
  let isSending = false;

  function openPanel() {
    panel.hidden = false;
    toggleButton.classList.add('is-hidden');
    setTimeout(() => input.focus(), 40);
  }

  function closePanel() {
    panel.hidden = true;
    toggleButton.classList.remove('is-hidden');
  }

  function scrollMessages() {
    messages.scrollTop = messages.scrollHeight;
  }

  function createMessage(text, role = 'bot') {
    const article = document.createElement('article');
    article.className = `chat-message chat-message-${role}`;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble-message';
    bubble.textContent = text;
    article.appendChild(bubble);
    messages.appendChild(article);
    scrollMessages();
    return article;
  }

  function normalizeReply(data) {
    if (typeof data === 'string') return data;
    if (!data || typeof data !== 'object') return '';
    const possible = [
      data.reply,
      data.response,
      data.message,
      data.answer,
      data.output,
      data.text,
      data.bot,
      data.result,
      data.data && (data.data.reply || data.data.response || data.data.message || data.data.answer),
      Array.isArray(data.messages) && data.messages[0] && (data.messages[0].content || data.messages[0].text),
      Array.isArray(data.choices) && data.choices[0] && (data.choices[0].message?.content || data.choices[0].text),
    ];
    const found = possible.find(value => typeof value === 'string' && value.trim());
    return found ? found.trim() : '';
  }

  async function sendMessage(text) {
    const clean = text.trim();
    if (!clean || isSending) return;
    openPanel();
    createMessage(clean, 'user');
    input.value = '';
    isSending = true;
    const typing = createMessage('Typing…', 'status');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: clean, query: clean, prompt: clean })
      });

      const contentType = response.headers.get('content-type') || '';
      let payload;
      if (contentType.includes('application/json')) {
        payload = await response.json();
      } else {
        payload = await response.text();
      }

      typing.remove();

      if (!response.ok) {
        throw new Error(typeof payload === 'string' ? payload : 'Chat service error');
      }

      const reply = normalizeReply(payload) || 'I could not read a valid reply from the bot response. Check the Render API response format.';
      createMessage(reply, 'bot');
    } catch (error) {
      typing.remove();
      const fallback = 'Chat is temporarily unavailable. Please try again in a moment or call the clinic directly.';
      createMessage(fallback, 'bot');
      console.error('Chat widget error:', error);
    } finally {
      isSending = false;
      scrollMessages();
    }
  }

  toggleButton.addEventListener('click', openPanel);
  closeButton.addEventListener('click', closePanel);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    sendMessage(input.value);
  });

  suggestionButtons.forEach((button) => {
    button.addEventListener('click', () => sendMessage(button.getAttribute('data-chat-prompt') || button.textContent || ''));
  });
})();
