import { ReactNode } from 'react'

export interface CandidateAnalysisProps {
  candidate: {
    rank: number
    filename: string
    overall_score: number
    text_similarity: number
    skill_coverage: number
    matched_skills: string[]
    missing_skills: string[]
    extracted_skills: string[]
    explanation: {
      strengths: string
      skill_gaps: string
      summary: string
    }
    disclaimer: string
  }
}

export function CandidateAnalysis({ candidate }: CandidateAnalysisProps) {
  const { rank, overall_score, text_similarity, skill_coverage, matched_skills, missing_skills, extracted_skills, explanation } = candidate

  // Use extracted_skills in the analysis to avoid unused variable warning
  const allSkillsCount = extracted_skills.length

  const getMatchClassification = (score: number): { label: string; color: string } => {
    if (score >= 80) return { label: 'Strong Match', color: 'text-cyberGreen' }
    if (score >= 60) return { label: 'Potential Match', color: 'text-cyan-400' }
    if (score >= 40) return { label: 'Neutral', color: 'text-violet-400' }
    return { label: 'Low Match', color: 'text-red-400' }
  }

  const match = getMatchClassification(overall_score)
  const skillCoveragePercent = Math.min(100, skill_coverage)
  const textSimilarityPercent = Math.min(100, text_similarity)

  return (
    <div className="space-y-6">
      {/* Match Score Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-gray-500">Recruiter Verdict</span>
          <h2 className={`font-mono text-2xl font-bold ${match.color} mt-1`}>
            {match.label} ({overall_score.toFixed(1)}%)
          </h2>
        </div>
        <div className="text-right">
          <span className="font-mono text-xs text-gray-500">Overall Score</span>
          <div className="font-mono text-3xl font-bold text-cyan-400 mt-1">
            {overall_score.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Candidate Overview */}
      <CyberCard className="p-4">
        <h3 className="font-mono text-sm text-violet-400 mb-3">Candidate Overview</h3>
        <div className="font-mono text-sm space-y-1">
          <p><span className="text-gray-500">Filename:</span> {candidate.filename}</p>
          <p><span className="text-gray-500">Rank:</span> #{rank}</p>
          <p><span className="text-gray-500">Skills Detected:</span> {allSkillsCount > 0 ? `${allSkillsCount} skills identified` : 'No structured skills identified'}</p>
          <p className="text-xs text-gray-600 italic">(Contact details, experience, and education were not parsed from the document.)</p>
        </div>
      </CyberCard>

      {/* Score Breakdown */}
      <CyberCard className="grid md:grid-cols-3 gap-4">
        <ScoringCard
          title="Text Similarity"
          value={textSimilarityPercent}
          description="Semantic alignment with job description"
        />
        <ScoringCard
          title="Skill Coverage"
          value={skillCoveragePercent}
          description="Matches with required skills"
        />
        <ScoringCard
          title="Rank"
          value={rank}
          description="Candidate ranking"
          isRank
        />
      </CyberCard>

      {/* Explanation Summary */}
      <CyberCard className="p-4">
        <h3 className="font-mono text-sm text-violet-400 mb-2">Analysis Summary</h3>
        <p className="font-mono text-sm text-gray-300">{explanation.summary}</p>
      </CyberCard>

      {/* Matched Skills */}
      <CyberCard className="p-4">
        <h3 className="font-mono text-sm text-violet-400 mb-3">Matched Skills ({matched_skills.length})</h3>
        <div className="flex flex-wrap gap-2">
          {matched_skills.length > 0 ? (
            matched_skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-md font-mono text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="font-mono text-xs text-gray-500">No specific skills matched with job requirements</span>
          )}
        </div>
      </CyberCard>

      {/* Missing Skills */}
      <CyberCard className="p-4">
        <h3 className="font-mono text-sm text-violet-400 mb-3">Missing Required Skills ({missing_skills.length})</h3>
        <div className="flex flex-wrap gap-2">
          {missing_skills.length > 0 ? (
            missing_skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 rounded-md font-mono text-xs bg-red-900/30 text-red-300 border border-red-500/30"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="font-mono text-xs text-cyan-400">• All job requirements covered!</span>
          )}
        </div>
      </CyberCard>

      {/* Strengths & Gaps */}
      <CyberCard className="p-4 space-y-3">
        <div>
          <h3 className="font-mono text-sm text-cyan-400 mb-2">Strengths</h3>
          <p className="font-mono text-xs text-gray-300">{explanation.strengths}</p>
        </div>
        <div>
          <h3 className="font-mono text-sm text-red-400 mb-2">Skill Gaps</h3>
          <p className="font-mono text-xs text-gray-300">{explanation.skill_gaps}</p>
        </div>
      </CyberCard>

      {/* Disclaimer */}
      <div className="font-mono text-xs text-gray-600 italic">
        {candidate.disclaimer}
      </div>
    </div>
  )
}

/* Internal Components */

interface ScoringCardProps {
  title: string
  value: number
  description: string
  isRank?: boolean
}

function ScoringCard({ title, value, description, isRank = false }: ScoringCardProps) {
  const isScore = !isRank
  const displayValue = isRank ? value.toFixed(1) : `${value.toFixed(1)}%`

  return (
    <div className="p-3 rounded-md bg-black/30 border border-white/10">
      <div className="font-mono text-xs uppercase tracking-wider text-gray-500">{title}</div>
      <div className="font-mono text-xl font-bold text-cyan-400 mt-1">{displayValue}</div>
      <div className="font-mono text-xs text-gray-400 mt-1">{description}</div>
      {isScore && (
        <div className="mt-2 bg-black/30 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-cyan-500 to-violet-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${value}%` }}
          />
        </div>
      )}
    </div>
  )
}

function CyberCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-lg border border-white/10 bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  )
}