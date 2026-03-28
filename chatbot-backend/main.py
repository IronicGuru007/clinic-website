from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later change to your website domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def home():
    return {"status": "ok", "message": "Chatbot is running"}

@app.post("/chat")
def chat(data: ChatRequest):
    msg = data.message.lower()

    if "appointment" in msg or "book" in msg:
        reply = "You can book an appointment by calling our clinic or using the appointment form."
    elif "timing" in msg or "open" in msg or "hours" in msg:
        reply = "Our clinic is open Monday to Saturday, 10 AM to 8 PM."
    elif "address" in msg or "location" in msg:
        reply = "Please check our contact page for the clinic address and map."
    elif "root canal" in msg:
        reply = "Yes, root canal treatment is available. Please book a consultation."
    else:
        reply = "Please ask about appointments, timings, treatments, or clinic location."

    return {"reply": reply}
