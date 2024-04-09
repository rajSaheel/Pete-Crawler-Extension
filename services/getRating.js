import { SERVER } from "../utils/cred"
const url = `${SERVER}/get_rating.php`

const getRating = ({link})=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const response = await fetch(url,{
                body:JSON.stringify({link}),
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

export default getRating