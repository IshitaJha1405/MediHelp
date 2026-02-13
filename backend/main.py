from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware

import fitz  # PyMuPDF
from google import genai


# ---------------- CONFIG ----------------

API_KEY = "AIzaSyDA17l281bEC1BMdv3g9OaRRhRZeLipmlY"   # 👈 Your key


client = genai.Client(api_key=API_KEY)


# ---------------- APP ----------------

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------- PDF TEXT EXTRACT ----------------

def extract_text_from_pdf(pdf_bytes):

    text = ""

    doc = fitz.open(stream=pdf_bytes, filetype="pdf")

    for page in doc:
        text += page.get_text()

    return text


# ---------------- GEMINI ----------------

def analyze_with_gemini(text, language):

    try:

        if not text.strip():
            return "No readable text found in PDF."

        if language == "hindi":
            lang_instruction = "Reply fully in Hindi."
        else:
            lang_instruction = "Reply fully in English."


        prompt = f"""
You are a medical assistant.

{lang_instruction}

Explain this medical report simply.

Include:
- Summary
- Abnormal values
- Health advice
- Doctor visit suggestion

Report:
{text[:8000]}
"""


        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        if hasattr(response, "text") and response.text:
            return response.text

        return "AI returned empty response."

    except Exception as e:

        print("GEMINI ERROR:", e)   # 👈 shows in terminal
        return "AI Error: " + str(e)



# ---------------- ROUTES ----------------


@app.get("/")
def home():
    return {"message": "MediHelp Gemini Backend Running"}


@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    language: str = Form(...)
):

    pdf_bytes = await file.read()

    extracted_text = extract_text_from_pdf(pdf_bytes)

    result = analyze_with_gemini(extracted_text, language)   # ✅ FIXED

    return {
        "status": "success",
        "analysis": result
    }

