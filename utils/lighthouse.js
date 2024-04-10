import { LIGHTHOUSE_API_KEY } from "./cred.js"

// fetching Lighthouse report
const fetchLightHouseReport = (url) => {
	return new Promise(async (resolve, reject) => {
		const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${LIGHTHOUSE_API_KEY}&category=SEO&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES`

		try {
			const response = await fetch(apiUrl)
			const data = await response.json()

			const accessibilityScore = data.lighthouseResult.categories.accessibility.score*10
			const seoScore = data.lighthouseResult.categories.seo.score*10
			const performanceScore = data.lighthouseResult.categories.performance.score*10
			const bestPracticesScore = data.lighthouseResult.categories['best-practices'].score*10
			console.log("Done")
			resolve({ accessibilityScore, seoScore, performanceScore, bestPracticesScore })

		} catch (error) {
			console.error('Error fetching Lighthouse report:', error)
			reject(null)
		}
	}
	)
}


export default fetchLightHouseReport