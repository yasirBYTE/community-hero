import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const CATEGORIES = [
  'Pothole', 'Streetlight', 'Water Leakage', 'Garbage',
  'Sewage', 'Road Damage', 'Graffiti', 'Park Issue',
  'Noise Complaint', 'Encroachment', 'Other'
]

const MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro']

function cleanJSON(text) {
  const cleaned = text.replace(/```json?/gi, '').replace(/```/g, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('No JSON found in response')
  return JSON.parse(cleaned.slice(start, end + 1))
}

async function tryGenerateContent(modelName, parts) {
  const model = genAI.getGenerativeModel({ model: modelName })
  const result = await model.generateContent(parts)
  return result.response.text()
}

export async function categorizeIssue(imageBase64, description) {
  const basePrompt = `Analyze this community issue. Description: "${description}". Categorize into exactly one: ${CATEGORIES.join(', ')}. Also assign severity (Low/Medium/High/Critical) and estimated urgency (days to address). Respond ONLY with JSON: {"category":"...","severity":"...","urgencyDays":N,"tags":["tag1","tag2"]}`

  for (const modelName of MODELS) {
    try {
      const parts = [{ text: basePrompt }]
      if (imageBase64) {
        parts.push({ inlineData: { mimeType: 'image/jpeg', data: imageBase64 } })
      }
      const text = await tryGenerateContent(modelName, parts)
      const parsed = cleanJSON(text)
      return parsed
    } catch (e) {
      if (e.message?.includes('does not support image') || e.message?.includes('not supported')) continue
      try {
        const text = await tryGenerateContent(modelName, [{ text: basePrompt }])
        return cleanJSON(text)
      } catch {}
    }
  }
  return { category: 'Other', severity: 'Medium', urgencyDays: 7, tags: ['needs-review'] }
}

export async function predictEscalation(issueData) {
  const prompt = `Given this community issue data, predict if it will escalate (become more severe) in the next 7 days.
Data: ${JSON.stringify(issueData)}
Respond ONLY with JSON: {"willEscalate":false,"reason":"...","recommendedAction":"...","confidence":0.8}`

  for (const modelName of MODELS) {
    try {
      const text = await tryGenerateContent(modelName, [{ text: prompt }])
      return cleanJSON(text)
    } catch {}
  }
  return { willEscalate: false, reason: 'Unable to analyze', recommendedAction: 'Manual review needed', confidence: 0 }
}

export { CATEGORIES }
