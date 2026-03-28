from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Clinic Chatbot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your website domain later for tighter security.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


@app.get("/")
def home():
    return {"status": "ok", "message": "Clinic chatbot API is running."}


def get_reply(message: str) -> str:
    msg = message.lower().strip()

    if any(word in msg for word in ["appointment", "book", "booking", "consultation"]):
        return (
            "You can book an appointment through the website contact page or by calling the clinic directly. "
            "I can also be upgraded later to collect booking details automatically."
        )

    if any(word in msg for word in ["timing", "hours", "open", "time"]):
        return "Our demo clinic hours are Monday to Saturday, 9:00 AM to 7:00 PM."

    if any(word in msg for word in ["address", "location", "map", "where"]):
        return "The demo clinic address is 215 Grand Avenue, Your City. Replace this with your real clinic location."

    if any(word in msg for word in ["doctor", "dentist", "team"]):
        return "The website has a Doctors page where you can showcase your clinic team, experience, and specialties."

    if any(word in msg for word in ["service", "treatment", "implant", "aligner", "cleaning", "root canal", "veneer"]):
        return (
            "The clinic offers general, cosmetic, implant, aligner, and family dental care in this demo setup. "
            "You can customise these answers with your exact treatment list."
        )

    if any(word in msg for word in ["contact", "phone", "call", "number"]):
        return "You can call the clinic at +91 99999 99999 in this demo setup."

    return (
        "I can help with appointments, timings, doctors, treatments, or clinic location. "
        "Replace the demo details in main.py with your real clinic information."
    )


@app.post("/chat")
def chat(request: ChatRequest):
    return {"reply": get_reply(request.message)}
