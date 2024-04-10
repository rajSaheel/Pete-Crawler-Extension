import { SERVER } from "../utils/cred.js"
const url = `${SERVER}/add_rating.php`

const addRating = ({uid,link,seo,performance,security,bestPractices,total})=>{
    return new Promise(async(resolve,reject)=>{
        const body = {uid,link,seo,performance,security,bestPractices,total}
        try{
            const response = await fetch(url,{
                body:JSON.stringify(body),
                method:"POST",
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            resolve(response.json())

        }catch(e){
            console.log(e)
            reject(e)
        }
    })
}

export default addRating