import { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, X, Sparkles, User } from 'lucide-react'
import { chatWithAI } from '../lib/api'

export default function AIChatPanel() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const suggestions = [
    "What colors are trending now?",
    "Best aspect ratio for Reels?",
    "Analyze my poster design",
    "Tips for video thumbnails",
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return
    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const response = await chatWithAI({
        message: text,
        history: messages.slice(-10),
      })
      setMessages(prev => [...prev, { role: 'ai', content: response.reply || response.message || 'I can help with QC questions! Try asking about trends, design tips, or video quality.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: "I'm currently offline. Please check your API configuration and try again." }])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <>
      <button className="ai-chat-fab" onClick={() => setOpen(!open)} title="Ask AI Assistant">
        {open ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      <div className={`ai-chat-panel ${open ? 'open' : ''}`}>
        <div className="ai-chat-header">
          <div className="ai-chat-avatar"><Sparkles size={18} /></div>
          <div className="ai-chat-title">
            <h3>QC Assistant</h3>
            <span>● Online</span>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="ai-chat-messages">
          {messages.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'var(--space-8) 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-4)' }}>✨</div>
              <p className="text-h3" style={{ marginBottom: 'var(--space-2)' }}>Hi! I'm your QC Assistant</p>
              <p className="text-small">Ask me about design trends, video quality tips, or get help with your QC checklist.</p>

              <div className="chat-suggestions" style={{ marginTop: 'var(--space-6)', justifyContent: 'center' }}>
                {suggestions.map((s) => (
                  <button key={s} className="chat-suggestion-chip" onClick={() => sendMessage(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.role === 'user' ? 'user' : 'ai'}`}>
              <div className="chat-message-avatar">
                {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
              </div>
              <div className="chat-message-content">
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-message ai">
              <div className="chat-message-avatar"><Sparkles size={14} /></div>
              <div className="chat-typing">
                <div className="chat-typing-dot"></div>
                <div className="chat-typing-dot"></div>
                <div className="chat-typing-dot"></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form className="ai-chat-input" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Ask about QC, trends, design..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={!input.trim() || loading}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  )
}
