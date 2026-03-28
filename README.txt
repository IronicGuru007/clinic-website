ALORA DENTAL STUDIO - PREMIUM STATIC WEBSITE PACKAGE

Files included:
- index.html
- about.html
- services.html
- doctors.html
- contact.html
- assets/css/style.css
- assets/js/script.js
- assets/icons/*.svg

How to use on GitHub Pages:
1. Replace old files in your repo with these files.
2. Keep index.html in the repo root.
3. Keep the assets folder exactly as it is.
4. Open: https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/

Customize these first:
- clinic name
- phone number
- email
- address
- doctor names
- treatment names
- hero image URLs or local images

Notes:
- This is a static HTML package.
- The contact form is UI only until connected to a form service or backend.
- Remote demo photos are used for a more premium look. Replace them with real clinic photos before production.


Chatbot integration added:
- Frontend widget is already merged into all HTML pages.
- Assets added:
  - assets/css/chat.css
  - assets/js/chat.js
- Backend folder added for Render:
  - chatbot-backend/main.py
  - chatbot-backend/requirements.txt
  - chatbot-backend/render.yaml

To go live:
1. Push the whole site repo to GitHub.
2. On Render create a Web Service.
3. Set Root Directory to chatbot-backend
4. Build Command: pip install -r requirements.txt
5. Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
6. After deploy, replace the placeholder window.CHATBOT_API_URL in each HTML page with your real Render /chat URL.

Until then, the widget still works in fallback mode with basic built-in replies.
