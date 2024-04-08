import HTMLRating from "./HTMLRating.js"
import CSSRating from "./CSSRating.js"

export default class Rating {
    //properties
    #htmlObj
    #cssObj
    #url

    //methods
    constructor(url) {
        this.#url = url
        this.#htmlObj = new HTMLRating(url)
        this.#cssObj = new CSSRating(url)
    }

    //returning points
    getPoints = () => {
        return new Promise(async (resolve, reject) => {
            try {
                if (new URL(this.#url).protocol === "https:") {
                    this.htmlPoints = await this.#htmlObj.calculate()
                    this.cssPoints = await this.#cssObj.calculate()
                    resolve(this.htmlPoints + this.cssPoints + 1)
                } else {
                    this.htmlPoints = await this.#htmlObj.calculate()
                    this.cssPoints = await this.#cssObj.calculate()
                    resolve(this.htmlPoints + this.cssPoints)
                }
            } catch {
                reject("Something went wrong")
            }
        })
    }
}
