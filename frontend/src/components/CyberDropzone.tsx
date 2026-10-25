import { ReactNode } from 'react'
import { useDropzone } from 'react-dropzone'

interface CyberDropzoneProps {
  onFilesSelected: (files: File[]) => void
  children?: ReactNode
  maxFiles?: number
  disabled?: boolean
}

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
}

export function CyberDropzone({
  onFilesSelected,
  children,
  maxFiles = 10,
  disabled = false,
}: CyberDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive, acceptedFiles, fileRejections } = useDropzone({
    onDrop: onFilesSelected,
    accept: ACCEPTED_TYPES,
    maxFiles,
    disabled,
  })

  const hasRejected = fileRejections.length > 0

  return (
    <div
      {...getRootProps()}
      className={`relative rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
        isDragActive
          ? 'border-cyan-400 bg-cyan-500/10 shadow-cyan-glow'
          : 'border-white/20 hover:border-cyan-400/50 hover:bg-white/5'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      {children || (
        <div className="flex flex-col items-center gap-2">
          <span className="text-3xl">📄</span>
          <p className="font-mono text-sm text-gray-300">
            {isDragActive ? 'Drop your resumes here...' : 'Drag & drop PDF/DOCX/JPG/PNG resumes'}
          </p>
          <p className="font-mono text-xs text-gray-500">
            or click to browse • Max {maxFiles} files • 5MB limit each
          </p>
        </div>
      )}
      {hasRejected && (
        <p className="mt-2 text-xs text-red-400">Some files were rejected. Only PDF, DOCX, JPG, and PNG files are allowed.</p>
      )}
      {acceptedFiles.length > 0 && (
        <div className="mt-3 border-t border-white/10 pt-3">
          <p className="font-mono text-xs text-cyan-400 mb-1">Selected files:</p>
          <ul className="text-xs text-gray-400 space-y-1">
            {acceptedFiles.map((file) => (
              <li key={file.name} className="truncate">
                • {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
