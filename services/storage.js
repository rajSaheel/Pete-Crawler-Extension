export const saveUserLocally = (uid)=>{
    return new Promise((resolve,reject)=>{
        const result = chrome.storage.local.set({ 'pete-crawler-uid': uid }).then(()=>uid)
        resolve(result)
    })
}

export const retrieveUser = ()=>{
    return new Promise((resolve,reject)=>{
        const uid = chrome.storage.local.get(['pete-crawler-uid'])
        .then((result)=> result['pete-crawler-uid']
        )
        resolve(uid)
    })
    
}

export const removeUser = ()=>{
    return new Promise((resolve,reject)=>{
        const uid = chrome.storage.local.remove(['pete-crawler-uid'],()=>false)
        resolve(uid)
    })
    
}