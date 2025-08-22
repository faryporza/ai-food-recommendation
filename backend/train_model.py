import pandas as pd
import pickle
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import Pipeline

# 1) โหลดข้อมูล
data = pd.read_csv("food_dataset.csv")
X = data[["age"]].values
le = LabelEncoder()
y = le.fit_transform(data["food"].values)

# 2) โมเดล: scaler + KNN (ถ่วงน้ำหนักตามระยะ)
pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("knn", KNeighborsClassifier(n_neighbors=3, weights="distance"))
])

# 3) เทรน
pipe.fit(X, y)

# 4) เซฟโมเดล + label encoder
with open("clf.pkl", "wb") as f:
    pickle.dump({"model": pipe, "label_encoder": le}, f)

print("✅ Trained & saved (KNN).")
