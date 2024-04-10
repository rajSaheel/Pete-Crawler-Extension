import analyzeSecurityReport from './securityHeaders.js'
import fetchLightHouseReport from './lighthouse.js'

const analyzeLink = async (url) => {
	const lightHouseReport = await fetchLightHouseReport(url)
	return lightHouseReport
}

export default analyzeLink