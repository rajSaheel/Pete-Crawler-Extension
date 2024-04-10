import { SERVER } from "../utils/cred.js"

const url = `${SERVER}/signup.php`

const singUp = ({username, name, password, profession})=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const response = await fetch(url,{
                body:JSON.stringify({username, name, password, profession}),
                method:"POST",
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            // console.log(response,typeof(response))
            resolve(response.json())
        }catch(e){
            console.log(e)
            reject(e)
            }
        }
    )
    
}

export default singUp