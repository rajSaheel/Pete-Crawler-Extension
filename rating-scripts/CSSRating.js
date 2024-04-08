export default class CSSRating {
    //properties
    #url
    #URI = `https://jigsaw.w3.org/css-validator/validator?uri=`
    #param = `&output=html`

    //methods
    constructor(url) {
        this.#url = `${this.#URI}${url}${this.#param}`
    }

    //calculating points
    calculate = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(this.#url)
                    .then((data) => data.text())
                    .then((text) => text)
                    .catch(() => reject("Something went wrong"))
                const parser = new DOMParser()
                const htmlDoc = parser.parseFromString(response, "text/html")
                const errorStr =
                    htmlDoc.querySelector('a[href="#errors"]').textContent
                const error = parseInt(errorStr.match(/\d+/)[0])
                const infoStr = htmlDoc.querySelector(
                    'a[href="#warnings"]'
                ).textContent
                const info = parseInt(infoStr.match(/\d+/)[0])
                this.points = 2 - (error / 1000 + info / 2000)
                resolve(this.points)
            } catch {
                reject("Something went wrong")
            }
        })
    }
}
