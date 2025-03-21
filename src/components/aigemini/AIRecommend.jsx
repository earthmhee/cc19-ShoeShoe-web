import React, { useState, useEffect } from "react";
import axios from "axios";

const AIChatModal = () => {
  const [search, setSearch] = useState("");
  const [aiResponse, setAiResponse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [promptOptions, setPromptOptions] = useState([]);

  // ✅ โหลดตัวเลือก Prompt จาก API เมื่่อเปิด Modal
  useEffect(() => {
    if (isOpen) {
      fetchPromptOptions();
    }
  }, [isOpen]);

  const fetchPromptOptions = async () => {
    try {
      const response = await axios.post("http://localhost:8001/api/ai/search", {});
      if (response.data.options) {
        setPromptOptions(response.data.options);
      }
    } catch (error) {
      console.error("Prompt Options Error:", error);
    }
  };

  // ✅ ฟังก์ชันให้ผู้ใช้กดเลือก Prompt ที่มีมาให้
  const handleSelectPrompt = (selectedPrompt) => {
    setSearch(selectedPrompt);
    handleSearch(selectedPrompt);
  };

  const handleSearch = async (query) => {
    if (!query.trim()) return;

    setLoading(true);
    setAiResponse((prev) => [...prev, { type: "user", text: query }]);

    try {
      const response = await axios.post("http://localhost:8001/api/ai/search", {
        prompt: query,
      });
      const aiText = response.data.response || "AI ไม่สามารถให้คำแนะนำได้";

      setAiResponse((prev) => [
        ...prev,
        { type: "user", text: query },
        { type: "ai", text: aiText },
      ]);
    } catch (error) {
      console.error("AI Error:", error);
      setAiResponse((prev) => [
        ...prev,
        { type: "ai", text: "เกิดข้อผิดพลาด กรุณาลองใหม่" },
      ]);
    }

    setSearch("");
    setLoading(false);
  };

  return (
    <div className="text-center mt-1">
      {/* ปุ่มเปิดแชท */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-80 transition hover:cursor-pointer"
      >
        OpenChat AI 💬
      </button>

      {/* Overlay + Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center backdrop-blur-sm">
          <div className="bg-white w-96 md:w-[500px] lg:w-[600px] rounded-2xl shadow-xl p-5">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-bold">AI recommends shoes</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-black hover:cursor-pointer text-xl"
              >
                ✖
              </button>
            </div>

            {/* ถ้ามีตัวเลือกให้เลือก */}
            {promptOptions.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-sm font-semibold text-gray-600">
                  กรุณาเลือกคำถามที่ต้องการถาม:
                </p>
                <div className="flex flex-wrap gap-2">
                  {promptOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectPrompt(option)}
                      className="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300 transition text-sm"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* กล่องแชท */}
            <div className="h-80 overflow-y-auto mt-3 bg-gray-100 p-3 rounded space-y-2">
              {aiResponse.length === 0 ? (
                <p className="text-gray-500 text-center">Type to start chat...</p>
              ) : (
                aiResponse.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg w-fit max-w-[80%] ${
                      msg.type === "user"
                        ? "bg-blue-200 self-end ml-auto text-right"
                        : "bg-gray-200 self-start text-left"
                    }`}
                  >
                    {msg.text.split("\n").map((line, i) => (
                      <p key={i} className="mb-1">{line}</p>
                    ))}
                  </div>
                ))
              )}
            </div>

            {/* ช่องพิมพ์ข้อความ */}
            <div className="mt-3 flex">
              <input
                type="text"
                placeholder="Type the name of the shoe..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-2 border rounded-l-lg"
              />
              <button
                onClick={() => handleSearch(search)}
                className="bg-black text-white px-3 rounded-r-lg hover:opacity-80 transition hover:cursor-pointer"
                disabled={loading}
              >
                {loading ? "⏳" : "📤"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatModal;
