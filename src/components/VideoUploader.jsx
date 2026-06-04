import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Film, CheckCircle, XCircle } from 'lucide-react'

export default function VideoUploader({ onFileSelect, file, uploading, progress, processingStatus }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0])
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': ['.mp4', '.mov', '.avi', '.mpeg'] },
    maxFiles: 1,
    disabled: uploading || processingStatus === 'processing',
  })

  if (processingStatus) {
    return (
      <div className="processing-status">
        {processingStatus === 'processing' && (
          <>
            <div className="processing-spinner"></div>
            <p>⚙️ AI is processing your video...</p>
            <span className="text-caption">This may take 1-3 minutes depending on video length</span>
          </>
        )}
        {processingStatus === 'complete' && (
          <>
            <CheckCircle size={48} style={{ color: 'var(--status-pass)' }} />
            <p>✅ Analysis complete!</p>
          </>
        )}
        {processingStatus === 'failed' && (
          <>
            <XCircle size={48} style={{ color: 'var(--status-rejected)' }} />
            <p>❌ Processing failed</p>
            <button className="btn btn-secondary btn-sm" onClick={() => onFileSelect(null)}>
              Try Again
            </button>
          </>
        )}
      </div>
    )
  }

  if (file) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        <Film size={40} style={{ margin: '0 auto var(--space-4)', color: 'var(--accent-secondary)' }} />
        <p className="text-small" style={{ marginBottom: 'var(--space-2)' }}>{file.name}</p>
        <p className="text-caption">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        {uploading && (
          <>
            <div className="upload-progress" style={{ marginTop: 'var(--space-4)' }}>
              <div className="upload-progress-fill" style={{ width: `${progress || 0}%` }}></div>
            </div>
            <p className="text-caption" style={{ marginTop: 'var(--space-2)' }}>⬆️ Uploading... {progress || 0}%</p>
          </>
        )}
        {!uploading && (
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 'var(--space-3)' }} onClick={() => onFileSelect(null)}>
            Remove
          </button>
        )}
      </div>
    )
  }

  return (
    <div {...getRootProps()} className={`file-uploader ${isDragActive ? 'active' : ''}`}>
      <input {...getInputProps()} />
      <div className="file-uploader-icon">
        <Film size={40} />
      </div>
      <p className="file-uploader-text">
        {isDragActive ? 'Drop your video here...' : <>Drag & drop or <span>browse</span></>}
      </p>
      <p className="file-uploader-formats">MP4, MOV, AVI, MPEG — Max 2 GB</p>
    </div>
  )
}
