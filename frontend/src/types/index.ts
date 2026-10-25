export interface Explanation {
  strengths: string
  skill_gaps: string
  summary: string
}

export interface Candidate {
  rank: number
  filename: string
  overall_score: number
  text_similarity: number
  skill_coverage: number
  matched_skills: string[]
  missing_skills: string[]
  extracted_skills: string[]
  explanation: Explanation
  disclaimer: string
}

export interface JobDescriptionSummary {
  length_characters: number
  extracted_target_skills: string[]
}

export interface ScreenResponse {
  job_description_summary: JobDescriptionSummary
  total_submitted: number
  total_successfully_screened: number
  total_errors: number
  candidates: Candidate[]
  errors: Array<{ filename: string; error: string }>
}

export interface ScreenError {
  filename: string
  error: string
}
