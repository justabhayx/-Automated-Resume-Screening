import { useState, useMemo } from 'react'
import { CyberCard } from '../components/CyberCard'
import { CyberButton } from '../components/CyberButton'
import { CyberDropzone } from '../components/CyberDropzone'
import { CyberLoader } from '../components/CyberLoader'
import { CyberTable } from '../components/CyberTable'
import { CyberModal } from '../components/CyberModal'
import { CandidateAnalysis } from '../components/CandidateAnalysis'
import { exportCandidatesToCsv } from '../utils/csvExport'
import { useScreen } from '../hooks/useScreen'
import { Candidate } from '../types'

export default function Dashboard() {
  const [jobDesc, setJobDesc] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const { loading, error, results, screen, reset } = useScreen()

  const handleFiles = (selected: File[]) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
    ]
    const filtered = selected.filter(
      (f) => allowedTypes.includes(f.type) && f.size <= 5 * 1024 * 1024
    )
    setFiles(filtered)
  }

  const handleScreen = async () => {
    await screen(jobDesc, files)
  }

  const handleExport = () => {
    if (results?.candidates) {
      exportCandidatesToCsv(results.candidates)
    }
  }

  const tableHeaders = useMemo(
    () => [
      'filename',
      'rank',
      'overall_score',
      'text_similarity',
      'skill_coverage',
      'matched_skills',
      'missing_skills',
    ],
    []
  )

  const tableData = useMemo(() => {
    if (!results) return []
    return results.candidates.map((c) => ({
      filename: c.filename,
      rank: c.rank,
      overall_score: c.overall_score,
      text_similarity: c.text_similarity,
      skill_coverage: c.skill_coverage,
      matched_skills: c.matched_skills.join(', '),
      missing_skills: c.missing_skills.join(', '),
    }))
  }, [results])

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <CyberCard className="p-6 text-center">
        <h1 className="font-mono text-3xl text-cyan-400 mb-2">NEXUS AI - Resume Screening Dashboard</h1>
        <p className="font-mono text-gray-400">Upload a job description and multiple resumes to get AI-powered rankings.</p>
      </CyberCard>

      {/* Input Section */}
      <CyberCard className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <label className="block font-mono text-sm text-gray-300 mb-1">Job Description</label>
          <textarea
            rows={8}
            placeholder="Paste the full job description here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            className="w-full resize-none bg-black/40 border border-white/10 rounded-md px-3 py-2 font-mono text-sm text-gray-200 placeholder-gray-500 focus:border-cyan-400/50 focus:shadow-cyan-glow transition-colors"
          />
        </div>
        <CyberDropzone onFilesSelected={handleFiles} />
      </CyberCard>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <CyberButton variant="secondary" onClick={reset}>Reset</CyberButton>
        <CyberButton variant="primary" onClick={handleScreen} disabled={loading || !jobDesc || files.length === 0}>Screen Candidates</CyberButton>
        <CyberButton variant="ghost" onClick={handleExport} disabled={!results}>Export CSV</CyberButton>
      </div>

      {/* Loading State */}
      {loading && <CyberLoader />}

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-md bg-red-900/30 border border-red-500/30">
          <p className="font-mono text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Results Table */}
      {results && results.candidates.length > 0 && (
        <CyberCard className="overflow-x-auto">
          <CyberTable
            headers={tableHeaders}
            data={tableData}
          />
        </CyberCard>
      )}

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <CyberModal
          isOpen={true}
          onClose={() => setSelectedCandidate(null)}
          title={selectedCandidate.filename}
        >
          <CandidateAnalysis candidate={selectedCandidate} />
        </CyberModal>
      )}
    </div>
  )
}
