import fetchLightHouseReport from "../utils/lighthouse.js";
import getRating from  "./getRating.js";
import addRating from "./addRating.js";


const crawlAPI = (url)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let response = await getRating(url)
            if (response.status === "R10002") {
                const scores = {
                    seoScore: response.seo,
                    performanceScore: response.performance,
                    securityScore: response.security,
                    bestPracticesScore: response.bestPractices
                }
                resolve(scores)
            }
            else if (response.status === "R10004") {
                const scores = await fetchLightHouseReport(url)
                let total = (scoresGlobal.seoScore + scoresGlobal.performanceScore + scoresGlobal.bestPracticesScore + scoresGlobal.securityScore) / 8
                response = await addRating({
                    uid: auth,
                    link: url,
                    seo: scoresGlobal.seoScore,
                    performance: scoresGlobal.performanceScore,
                    bestPractices: scoresGlobal.bestPracticesScore,
                    security: scoresGlobal.securityScore,
                    total:total.toFixed(2)
                })
                resolve(scores)
            }else{
                reject(null)
            }
        }catch(e){
            console.log(e)
            reject(null)
        }
        
    })
}


export default crawlAPI