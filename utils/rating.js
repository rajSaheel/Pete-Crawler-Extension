import analyzeSecurityReport from './securityHeaders.js'
import fetchLightHouseReport from './lighthouse.js'

const analyzeLink = async (url) => {
	const lightHouseReport = await fetchLightHouseReport(url)
	console.log(lightHouseReport)
	return lightHouseReport
}

export default analyzeLink