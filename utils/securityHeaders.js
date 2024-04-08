import { SECURITY_HEADERS_API_KEY } from './cred.js'

async function fetchSecurityReport(url) {
	const apiKey = SECURITY_HEADERS_API_KEY
	const apiUrl = `https://safebrowsing.googleapis.com/v4/threatLists?key=${apiKey}`

	try {
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: {
				"client": {
					"clientId": "petecrawler",
					"clientVersion": "1.5.2"
				},
				"threatInfo": {
					"threatTypes": ["MALWARE", "SOCIAL_ENGINEERING"],
					"platformTypes": ["ANY_PLATFORM"],
					"threatEntryTypes": ["URL"],
					"threatEntries": [url]
				}
			},
		})

		if (response.ok) {
			const data = await response.json()
			return data
		} else {
			throw new Error('Failed to fetch Safe Browsing report')
		}
	} catch (error) {
		console.error('Error fetching Safe Browsing report:', error)
		return null
	}
}

function calculateWebsiteScore(threatLevel) {
	switch (threatLevel) {
		case 'low':
			return 10
		case 'medium':
			return 5
		case 'high':
			return 0
		default:
			return -1
	}
}

function interpolateScore(score, minScore, maxScore, minThreatLevel, maxThreatLevel) {
	const normalizedScore = (score - minScore) / (maxScore - minScore)
	const interpolatedScore = (1 - normalizedScore) * minThreatLevel + normalizedScore * maxThreatLevel
	return Math.round(interpolatedScore * 10) / 10
}

const analyzeSecurityReport = async (url) => {
	const report = await fetchSecurityReport(url)
	if (!report || !report.matches) {
		return 10
	}

	const threatLevel = report.matches.length > 1 ? 'high' : 'medium'
	const websiteScore = calculateWebsiteScore(threatLevel)
	const interpolatedScore = interpolateScore(websiteScore, 0, 10, 0, 10)
	return interpolatedScore
	// console.log('Threat Level:', threatLevel)
	// console.log(`Website Score: ${interpolatedScore.toFixed(1)}/10`)
	// console.log('Threat Details:', report.matches)
}


export default analyzeSecurityReport