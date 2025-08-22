"use client";
import { useState } from "react";

export default function Home() {
  const [age, setAge] = useState<string>("");
  const [loading, setLoading] = useState(false);
  type ResultType = { age: number; recommend: string; confidence: number } | { error: string } | null;
  const [result, setResult] = useState<ResultType>(null);
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const askAI = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ age: Number(age) })
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
    <main style={{display:"grid",placeItems:"center",minHeight:"100vh"}}>
      <div style={{padding:24, border:"1px solid #ddd", borderRadius:12, width:360}}>
        <h1 style={{letterSpacing:2}}>AI NUTRIENTS</h1>
        <p>ให้ AI แนะนำเมนูเหมาะกับอายุ</p>
        <input
          value={age}
          onChange={e=>setAge(e.target.value)}
          placeholder="กรอกอายุ"
          style={{width:"100%",padding:10,margin:"12px 0",borderRadius:8,border:"1px solid #ccc"}}
          type="number"
        />
        <button onClick={askAI} style={{width:"100%",padding:12,borderRadius:8}}>
          {loading ? "กำลังประมวลผล..." : "Ask AI"}
        </button>
        {result && (
          <div style={{marginTop:16}}>
            {"error" in result ? (
              <div>{result.error}</div>
            ) : (
              <>
                <div>อายุ: {result.age}</div>
                <div>เมนูแนะนำ: <b>{result.recommend}</b></div>
                <div>ความมั่นใจ: {result.confidence.toFixed(2)}</div>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
