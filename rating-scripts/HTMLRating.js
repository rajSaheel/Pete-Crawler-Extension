export default class HTMLRating {
    //properties
    #url
    #URI = `https://validator.nu/?doc=`
    #param = `&out=json`
    //methods

    constructor(url) {
        this.#url = `${this.#URI}${url}${this.#param}`
    }

    //calculating points
    calculate = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(this.#url)
                    .then((data) => data.json())
                    .then((json) => json.messages)
                    .catch(() => undefined)
                if (response) {
                    let error = 0
                    let info = 0
                    for (let obj of response) {
                        if (obj.type === "error") error++
                        else if (obj.type === "info") info++
                    }
                    this.points = 2 - (error / 100 + info / 200)
                    // alert(this.points, "HTML")
                    resolve(this.points)
                } else {
                    reject("Something Went Wrong")
                }
            } catch {
                reject("Something Went Wrong")
            }
        })
    }
}
