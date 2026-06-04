import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Image } from 'lucide-react'

export default function FileUploader({ onFileSelect, accept, file, uploading, progress }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0])
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept || { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    disabled: uploading,
  })

  if (file) {
    return (
      <div className="card" style={{ textAlign: 'center' }}>
        {file.type.startsWith('image/') && (
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            style={{ maxHeight: '200px', borderRadius: 'var(--radius-md)', margin: '0 auto var(--space-4)', objectFit: 'contain' }}
          />
        )}
        <p className="text-small" style={{ marginBottom: 'var(--space-2)' }}>{file.name}</p>
        <p className="text-caption">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        {uploading && (
          <div className="upload-progress" style={{ marginTop: 'var(--space-4)' }}>
            <div className="upload-progress-fill" style={{ width: `${progress || 0}%` }}></div>
          </div>
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
        <Image size={40} />
      </div>
      <p className="file-uploader-text">
        {isDragActive ? 'Drop your file here...' : <>Drag & drop or <span>browse</span></>}
      </p>
      <p className="file-uploader-formats">JPG, PNG, WebP — Max 10 MB</p>
    </div>
  )
}
