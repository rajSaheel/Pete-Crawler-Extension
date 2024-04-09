import { SERVER } from "../utils/cred"
const url = `${SERVER}/add_rating.php`

const addRating = ({uid,link,seo,performance,security,bestPractices,total})=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const response = await fetch(url,{
                body:JSON.stringify({uid,link,seo,performance,security,bestPractices,total}),
                method:"POST",
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            resolve(response.json())
        }catch(e){
            reject(e)
        }
    })
}

export default addRating