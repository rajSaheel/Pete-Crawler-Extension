import { SERVER } from "../utils/cred.js"
const url = `${SERVER}/add_rating.php`

const addRating = ({uid,link,seo,performance,security,bestPractices,total})=>{
    return new Promise(async(resolve,reject)=>{
        console.log(JSON.stringify({uid,link,seo,performance,security,bestPractices,total}))
        try{
            const response = await fetch(url,{
                body:JSON.stringify({uid,link,seo,performance,security,bestPractices}),
                method:"POST",
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const data =response.json()
            resolve(data)

        }catch(e){
            console.log(e)
            reject(e)
        }
    })
}

export default addRating