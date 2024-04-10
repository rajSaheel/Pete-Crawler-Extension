import { SERVER } from "../utils/cred.js"

const url = `${SERVER}/signin.php`

const singIn = ({username,password})=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const response = await fetch(url,{
                body:JSON.stringify({username,password}),
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

export default singIn