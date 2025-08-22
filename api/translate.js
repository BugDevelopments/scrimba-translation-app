// only needed for local deployment
//import {config} from 'dotenv'
//config({ path: '.env.local' });   // 👈 explicitly load .env.local
import OpenAI from 'openai'

const client = new OpenAI({
    apiKey: process.env.AI_GATEWAY_API_KEY,
    baseURL: process.env.AI_GATEWAY_BASE_URL
})

async function translate(text, language) {
    const completion = await client.chat.completions.create({
        model: "gpt-oss-20b",
        messages: [{ role: "user", content:`Translate ${text} into ${language}. Give your answer in plain text.`}]
    })
    return completion.choices[0].message
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Use POST' })
    }
    // in Vercel function, req.body is usually already parsed if
    // Content-Type is application/json
    // But to be safe, we can handle both cases:
    let body;
    try {
        body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    } catch {
        return res.status(400).json({ error: 'Invalid JSON' })
    }

    const { language, text } = body || {}
    if (!language) {
        return res.status(400).json( {error: 'Missing "language"' })
    }
    if (!text) {
        return res.status(400).json( {error: 'Missing "text"' })
    }

    const translation = await translate(text, language)

    res.status(200).json({ translation: translation.content })
}