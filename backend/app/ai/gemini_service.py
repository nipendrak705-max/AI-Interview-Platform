import os

from dotenv import load_dotenv
from google import genai

# Load environment variables
load_dotenv()

# Read API Key
API_KEY = os.getenv("GEMINI_API_KEY")

# Create Gemini Client
client = genai.Client(api_key=API_KEY)


def generate_questions(skills):

    prompt = f"""
You are an experienced technical interviewer.

Generate exactly 10 interview questions.

Candidate Skills:
{", ".join(skills)}

Rules:
1. Questions should be technical.
2. One question per line.
3. Do not number the questions.
4. Do not give answers.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    questions = response.text.split("\n")

    return [q.strip() for q in questions if q.strip()]
def evaluate_answer(question: str, answer: str):

    prompt = f"""
You are an expert technical interviewer.

Evaluate the candidate's answer.

Question:
{question}

Candidate Answer:
{answer}

Give your response in this format only:

Score: X/10

Feedback:
- Strengths
- Weaknesses
- Suggestions for improvement

Keep the response concise.
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        return response.text

    except Exception as e:
        return f"Gemini Error: {str(e)}"