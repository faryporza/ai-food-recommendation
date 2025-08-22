from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import pickle

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open("clf.pkl", "rb") as f:
    bundle = pickle.load(f)
model = bundle["model"]
le = bundle["label_encoder"]

class InputData(BaseModel):
    age: int

@app.post("/predict")
def predict(data: InputData):
    x = np.array([[data.age]])
    prob = model.predict_proba(x)[0]            # ความน่าจะเป็นต่อคลาส
    idx = int(np.argmax(prob))
    food = le.inverse_transform([idx])[0]
    confidence = float(prob[idx])
    return {"age": data.age, "recommend": food, "confidence": confidence}
