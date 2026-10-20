import React, { useState } from 'react';

export default function AiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your OmniStore AI Assistant powered by Hugging Face. Ask me anything!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentQuery = input;
    setInput('');
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_HF_API_KEY;
      
      if (!apiKey) {
        setMessages(prev => [...prev, { sender: 'ai', text: 'Error: VITE_HF_API_KEY is missing in your .env file!' }]);
        setLoading(false);
        return;
      }

      // Hugging Face Serverless Inference API (Meta Llama 3 model)
      const response = await fetch('https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          inputs: `You are an AI assistant for OmniStore Mart POS and Inventory system. Respond clearly in English. Provide concise details on products (like Wireless RGB Gaming Mouse $78.75, Mechanical Gaming Keyboard $62.54, Classic Denim Jacket $55.00, Classic Leather Strap Watch $120.00, Hydrating Hyaluronic Serum $24.99). User query: ${currentQuery}`,
          parameters: { max_new_tokens: 250, return_full_text: false }
        })
      });

      const data = await response.json();
      
      if (data.error) {
        setMessages(prev => [...prev, { sender: 'ai', text: `API Error: ${data.error}` }]);
      } else if (Array.isArray(data) && data[0]?.generated_text) {
        const aiReply = data[0].generated_text;
        setMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
      } else if (data.generated_text) {
        setMessages(prev => [...prev, { sender: 'ai', text: data.generated_text }]);
      } else {
        setMessages(prev => [...prev, { sender: 'ai', text: 'Model is loading or unexpected response. Please try again in a few seconds.' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Network Error: Failed to fetch response from Hugging Face.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat-fixed-container">
      {!isOpen ? (
        <button onClick={() => setIsOpen(true)} className="ai-chat-toggle-btn">
          🤖 AI Assistant
        </button>
      ) : (
        <div className="ai-chat-box">
          <div className="ai-chat-header">
            <h4>OmniStore AI Support</h4>
            <button onClick={() => setIsOpen(false)} className="ai-chat-close-btn">✕</button>
          </div>
          
          <div className="ai-chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`ai-message ${m.sender === 'user' ? 'user-msg' : 'ai-msg'}`}>
                {m.text}
              </div>
            ))}
            {loading && <div className="ai-message ai-msg">Typing...</div>}
          </div>

          <form onSubmit={handleSend} className="ai-chat-form">
            <input
              type="text"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="ai-chat-input"
            />
            <button type="submit" className="ai-chat-send-btn">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}