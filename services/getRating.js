import { SERVER } from "../utils/cred.js"
const url = `${SERVER}/get_rating.php`

const getRating = (link)=>{
    return new Promise(async(resolve,reject)=>{
        
        try{
            const response = await fetch(url,{
                body:JSON.stringify({link:link}),
                method:"POST",
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const data = response.json()
            resolve(data)
        }catch(e){
            console.log(e)
            reject(e)
        }
    })
}

export default getRating