import { auth } from './firebase'

const API_BASE = '/api'

async function getAuthHeaders() {
  const user = auth.currentUser
  if (!user) return {}
  const token = await user.getIdToken()
  return { Authorization: `Bearer ${token}` }
}

async function apiRequest(endpoint, options = {}) {
  const headers = {
    ...await getAuthHeaders(),
    ...options.headers,
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: 'Request failed' }))
      throw new Error(error.detail || 'Request failed')
    }

    return await res.json()
  } catch (error) {
    console.warn(`[Mock Mode] Backend unreachable for ${endpoint}. Returning mock data.`)
    
    // Simple mock routing for local UI testing
    if (endpoint === '/reports' && options.method !== 'POST') return []
    if (endpoint === '/reports' && options.method === 'POST') return { id: Date.now().toString(), ...JSON.parse(options.body), createdAt: new Date().toISOString() }
    if (endpoint.startsWith('/reports/')) return { success: true }
    
    if (endpoint === '/trends/today') return [
      { id: 1, category: 'colors', title: 'Neon Cyberpunk', description: 'Bright cyan and magenta combinations' },
      { id: 2, category: 'formats', title: 'Vertical Short-form', description: '9:16 aspect ratio under 30s' },
      { id: 3, category: 'audio', title: 'Lo-fi Beats', description: 'Relaxing background tracks' }
    ]
    
    if (endpoint === '/ai/chat') {
      const data = JSON.parse(options.body)
      const responses = {
        "What colors are trending now?": "Right now, neon cyber-punk colors (cyan, magenta, electric yellow) are trending heavily in tech, while muted earth tones are dominating lifestyle branding! 🎨✨",
        "Best aspect ratio for Reels?": "For Instagram Reels and TikTok, you definitely want to use 9:16 (1080x1920 pixels). Make sure to keep text away from the bottom 20% of the screen! 📱",
      }
      await new Promise(r => setTimeout(r, 800))
      return { reply: responses[data.message] || "That's a great question! Always ensure your audio is balanced and your branding is clear. 🎬✨" }
    }
    
    if (endpoint === '/ai/analyze-image') {
      const guidelines = options.body instanceof FormData ? options.body.get('clientGuidelines') : null
      await new Promise(r => setTimeout(r, 1500))
      return {
          overallScore: 85,
          summary: guidelines 
            ? `This design looks great and perfectly aligns with the client's brand guidelines!`
            : "This design looks great! The typography is clear and contrast is solid.",
          designScore: 90, colorScore: 75, typographyScore: 95, trendScore: 80,
          suggestions: ["Increase contrast on the main title"],
          checklistSuggestions: { "visual.0": { type: "pass", note: "High quality image" } }
      }
    }
    
    if (endpoint === '/ai/analyze-video') {
      await new Promise(r => setTimeout(r, 1000))
      return { file_id: "mock_video", status: "processing" }
    }
    
    if (endpoint.startsWith('/ai/video-status/')) {
      return {
        state: "ACTIVE",
        analysis: {
          overallScore: 78,
          summary: "Good overall pacing, but there are some audio clipping issues.",
          categoryScores: { visual: 85, audio: 60, content: 90, technical: 75, trendAlignment: 80 },
          timestampedIssues: [],
          audioQuality: { overallClarity: "Fair", hasClipping: true },
          sceneBreakdown: [],
          suggestions: ["Normalize audio levels"]
        }
      }
    }
    
    throw error;
  }
}

// Reports
export const fetchReports = () => apiRequest('/reports')
export const fetchReport = (id) => apiRequest(`/reports/${id}`)
export const createReport = (data) => apiRequest('/reports', { method: 'POST', body: JSON.stringify(data) })
export const updateReport = (id, data) => apiRequest(`/reports/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteReport = (id) => apiRequest(`/reports/${id}`, { method: 'DELETE' })
export const updateReportStatus = (id, status) => apiRequest(`/reports/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) })

// AI - Image
export const analyzeImage = (formData) => apiRequest('/ai/analyze-image', { method: 'POST', body: formData })
export const analyzeThumbnail = (formData) => apiRequest('/ai/analyze-thumbnail', { method: 'POST', body: formData })

// AI - Video
export const analyzeVideo = (formData) => apiRequest('/ai/analyze-video', { method: 'POST', body: formData })
export const checkVideoStatus = (fileId) => apiRequest(`/ai/video-status/${fileId}`)
export const analyzeVideoAudio = (data) => apiRequest('/ai/analyze-video-audio', { method: 'POST', body: JSON.stringify(data) })
export const analyzeVideoScenes = (data) => apiRequest('/ai/analyze-video-scenes', { method: 'POST', body: JSON.stringify(data) })

// AI - Chat
export const chatWithAI = (data) => apiRequest('/ai/chat', { method: 'POST', body: JSON.stringify(data) })

// AI - Checklist suggestions
export const suggestChecklist = (formData) => apiRequest('/ai/suggest-checklist', { method: 'POST', body: formData })

// Trends
export const fetchTrends = () => apiRequest('/trends/today')
export const fetchTrendColors = () => apiRequest('/trends/colors')
export const fetchTrendFormats = () => apiRequest('/trends/formats')
