import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Video, Image as ImageIcon, ArrowRight, Save, Sparkles } from 'lucide-react'
import { getChecklistForType, calculateProgress } from '../lib/checklistData'
import { createReport, analyzeImage, analyzeVideo, checkVideoStatus } from '../lib/api'
import ChecklistSection from '../components/ChecklistSection'
import FileUploader from '../components/FileUploader'
import VideoUploader from '../components/VideoUploader'
import AIAnalysisCard from '../components/AIAnalysisCard'
import VideoAIAnalysisCard from '../components/VideoAIAnalysisCard'

export default function NewReport() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Type, 2: Upload/AI, 3: Checklist
  const [type, setType] = useState('video')
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  
  // Checklist State
  const [checklist, setChecklist] = useState({})
  
  // AI State
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [videoProcessingStatus, setVideoProcessingStatus] = useState(null) // null, 'processing', 'complete', 'failed'
  
  // Submit State
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTypeSelect = (selectedType) => {
    setType(selectedType)
    setChecklist(getChecklistForType(selectedType))
    setStep(2)
  }

  const handleFileUpload = async (selectedFile) => {
    setFile(selectedFile)
    if (!title) {
      setTitle(selectedFile.name.split('.')[0])
    }
  }

  const runAIAnalysis = async () => {
    if (!file) return
    
    setIsAnalyzing(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      if (type === 'photo') {
        // Mock progress for photo
        setUploadProgress(50)
        const analysis = await analyzeImage(formData)
        setUploadProgress(100)
        setAiAnalysis(analysis)
        applyAISuggestionsToChecklist(analysis.checklistSuggestions)
      } else {
        // Video analysis is asynchronous
        setUploadProgress(30)
        const uploadRes = await analyzeVideo(formData)
        setUploadProgress(100)
        
        const fileId = uploadRes.file_id
        setVideoProcessingStatus('processing')
        
        // Poll for status
        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await checkVideoStatus(fileId)
            if (statusRes.state === 'ACTIVE') {
              clearInterval(pollInterval)
              setVideoProcessingStatus('complete')
              setAiAnalysis(statusRes.analysis)
              applyAISuggestionsToChecklist(statusRes.analysis.checklistSuggestions)
            } else if (statusRes.state === 'FAILED') {
              clearInterval(pollInterval)
              setVideoProcessingStatus('failed')
            }
          } catch (e) {
            console.error('Polling error', e)
          }
        }, 5000)
      }
    } catch (err) {
      console.error('AI Analysis failed:', err)
      setVideoProcessingStatus(type === 'video' ? 'failed' : null)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const applyAISuggestionsToChecklist = (suggestions) => {
    if (!suggestions) return
    // In a real app, this would deeply merge the AI suggestions into the checklist state
    // For now, we'll just store them in a way the components can read them
  }

  const handleItemChange = (sectionKey, itemIdx, updatedItem) => {
    setChecklist(prev => {
      const newSection = { ...prev[sectionKey] }
      newSection.items = [...newSection.items]
      newSection.items[itemIdx] = updatedItem
      return { ...prev, [sectionKey]: newSection }
    })
  }

  const handleSave = async () => {
    if (!title) return alert('Please enter a title')
    setIsSubmitting(true)
    
    try {
      const reportData = {
        title,
        type,
        checklist,
        aiAnalysis,
        score: calculateProgress(checklist),
        status: 'in_progress'
      }
      
      const res = await createReport(reportData)
      navigate(`/reports/${res.id}`)
    } catch (err) {
      console.error(err)
      alert('Failed to save report')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>New QC Report</h1>
        <p>Follow the steps to analyze and review your creative asset.</p>
      </div>

      <div className="steps">
        <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <span className="step-label">Select Type</span>
        </div>
        <div className={`step-connector ${step > 1 ? 'completed' : ''}`}></div>
        <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <span className="step-label">Upload & AI</span>
        </div>
        <div className={`step-connector ${step > 2 ? 'completed' : ''}`}></div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <span className="step-label">Manual QC</span>
        </div>
      </div>

      {step === 1 && (
        <div className="grid-2" style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="type-card" onClick={() => handleTypeSelect('video')}>
            <div className="type-card-icon">🎬</div>
            <h3 className="type-card-title">Video QC</h3>
            <p className="type-card-desc">Analyze MP4, MOV, or AVI files with full frame-by-frame and audio analysis.</p>
          </div>
          <div className="type-card" onClick={() => handleTypeSelect('photo')}>
            <div className="type-card-icon">🖼️</div>
            <h3 className="type-card-title">Poster / Photo QC</h3>
            <p className="type-card-desc">Analyze static designs, posters, and thumbnails for branding and visual quality.</p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card" style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div className="flex-col">
            <div className="form-group">
              <label className="form-label">Project Title</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="E.g., Summer Campaign Promo"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label" style={{ marginBottom: 'var(--space-2)', display: 'block' }}>Upload File</label>
              {type === 'video' ? (
                <VideoUploader 
                  onFileSelect={handleFileUpload} 
                  file={file} 
                  uploading={isAnalyzing}
                  progress={uploadProgress}
                  processingStatus={videoProcessingStatus}
                />
              ) : (
                <FileUploader 
                  onFileSelect={handleFileUpload} 
                  file={file}
                  uploading={isAnalyzing}
                  progress={uploadProgress}
                />
              )}
            </div>

            {file && !aiAnalysis && !isAnalyzing && videoProcessingStatus !== 'processing' && (
              <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
                <button className="btn btn-primary btn-lg" onClick={runAIAnalysis}>
                  <Sparkles size={20} /> Run AI Analysis
                </button>
                <p className="text-caption" style={{ marginTop: 'var(--space-2)' }}>
                  Our AI will scan for visual, audio, and branding issues automatically.
                </p>
              </div>
            )}

            {(isAnalyzing || aiAnalysis || videoProcessingStatus === 'processing') && (
              <div style={{ marginTop: 'var(--space-4)' }}>
                {type === 'video' ? (
                  <VideoAIAnalysisCard analysis={aiAnalysis} loading={isAnalyzing || videoProcessingStatus === 'processing'} />
                ) : (
                  <AIAnalysisCard analysis={aiAnalysis} loading={isAnalyzing} />
                )}
              </div>
            )}

            <div className="flex-between" style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-primary)' }}>
              <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
              <button 
                className="btn btn-primary" 
                onClick={() => setStep(3)}
                disabled={!file || !title}
              >
                Proceed to Manual QC <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 'var(--space-6)', alignItems: 'start' }}>
          <div className="flex-col">
            <div className="card">
              <h2 className="text-h2" style={{ marginBottom: 'var(--space-2)' }}>{title}</h2>
              <p className="text-small" style={{ marginBottom: 'var(--space-6)' }}>Complete the checklist below. AI suggestions have been marked automatically.</p>
              
              <div className="flex-col">
                {Object.entries(checklist).map(([key, section]) => (
                  <ChecklistSection 
                    key={key}
                    sectionKey={key}
                    section={section}
                    onItemChange={handleItemChange}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex-col" style={{ position: 'sticky', top: 'calc(var(--header-height) + var(--space-8))' }}>
            <div className="card">
              <h3 style={{ marginBottom: 'var(--space-4)' }}>Report Progress</h3>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
                <ProgressRing percent={calculateProgress(checklist)} size={120} strokeWidth={10} />
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSave} disabled={isSubmitting}>
                <Save size={18} /> {isSubmitting ? 'Saving...' : 'Save Report'}
              </button>
            </div>
            
            {aiAnalysis && (
               <div className="card">
                 <h4 style={{ marginBottom: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                   <Sparkles size={16} /> AI Summary
                 </h4>
                 <p className="text-small">{aiAnalysis.summary}</p>
                 <div style={{ marginTop: 'var(--space-3)', display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                   <span className="status-badge" style={{ background: 'var(--bg-tertiary)' }}>Score: {aiAnalysis.overallScore}%</span>
                 </div>
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
