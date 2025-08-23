"use client";
import { useState } from "react";

export default function Home() {
  const [age, setAge] = useState<string>("");
  const [loading, setLoading] = useState(false);
  type ResultType =
    | { age: number; recommend: string; confidence: number }
    | { error: string }
    | null;
  const [result, setResult] = useState<ResultType>(null);
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const askAI = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age: Number(age) }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ error: "เรียก API ไม่สำเร็จ" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid place-items-center bg-gray-50">
      <div className="p-6 border border-gray-300 rounded-xl w-80 bg-white shadow-md">
        <h1 className="text-xl font-bold tracking-widest text-center mb-2">
          AI NUTRIENTS
        </h1>
        <p className="text-center text-gray-600 mb-4">
          ให้ AI แนะนำเมนูเหมาะกับอายุ
        </p>

        <input
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="กรอกอายุ"
          type="number"
          className="w-full px-3 py-2 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={askAI}
          className="w-full py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          {loading ? "กำลังประมวลผล..." : "Ask AI"}
        </button>

        {result && (
          <div className="mt-4 text-sm text-gray-700">
            {"error" in result ? (
              <div className="text-red-500">{result.error}</div>
            ) : (
              <div className="space-y-1">
                <div>อายุ: {result.age}</div>
                <div>
                  เมนูแนะนำ: <b>{result.recommend}</b>
                </div>
                <div>ความมั่นใจ: {result.confidence.toFixed(2)}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
