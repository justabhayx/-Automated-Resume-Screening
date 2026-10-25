import { saveAs } from 'file-saver'
import { Candidate } from '../types'

export function exportCandidatesToCsv(candidates: Candidate[]): void {
  if (!candidates || candidates.length === 0) {
    return
  }

  const headers = [
    'Rank',
    'Filename',
    'Overall Score',
    'Text Similarity',
    'Skill Coverage',
    'Matched Skills',
    'Missing Skills',
    'Extracted Skills',
  ]

  const escapeCsvCell = (value: string | number): string => {
    if (value == null) return ''
    const str = String(value)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const rows = candidates.map((c) => [
    c.rank,
    c.filename,
    c.overall_score,
    c.text_similarity,
    c.skill_coverage,
    c.matched_skills.join('; '),
    c.missing_skills.join('; '),
    c.extracted_skills.join('; '),
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map(escapeCsvCell).join(',')),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
  const filename = `nexus-screening-results-${new Date().toISOString().slice(0, 10)}.csv`
  saveAs(blob, filename)
}