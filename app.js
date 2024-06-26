import fetchLightHouseReport from "./utils/lighthouse.js"
import signIn from "./services/signIn.js"
import signUp from "./services/signUp.js"
import addRating from "./services/addRating.js"
import { retrieveUser, saveUserLocally, removeUser } from "./services/storage.js"
import getRating from "./services/getRating.js"

// global constants
let scoresGlobal = {}
let auth = await retrieveUser()
let authState = "SIGN_IN"

// Fetching Nodes
const wrapper = document.querySelector(".wrapper")
const authWrapper = document.querySelector(".auth-wrapper")
const ratingLabel = document.getElementsByClassName("rating-label")
const starsFigureCollect = document.getElementById("star-collection-id")
const crawlBtn = document.getElementById("crawl-btn")
const inputClassElem = document.getElementsByClassName("input-class-elem")
const inputClassId = document.getElementById("input-class-id")
const inputLinkBtn = document.getElementById("link-input-btn")
const successAudio = document.getElementById("success")
const failureAudio = document.getElementById("failure")
const scoreCircles = document.getElementsByClassName("score-class")
const toggle = document.getElementById("show-btn")
const scoresWrap = document.getElementById("scores")
const loading = document.querySelector(".loading-wrapper")
const alterAuthBtn = document.querySelectorAll(".alter-auth-btn")
const signInBtn = document.querySelector("#sign-in-btn")
const signUpBtn = document.querySelector("#sign-up-btn")
const signInForm = document.querySelector(".sign-in-form")
const signUpForm = document.querySelector(".sign-up-form")
const signoutBtn = document.querySelector(".sign-out-btn")

const clearSignInForm = () => {
	signInForm["email"].value = ""
	signInForm["password"].value = ""
	authWrapper.querySelector(".sign-in-alert").textContent = ""
}

const clearSignUpForm = () => {
	signUpForm["name"].value = ""
	signUpForm["email"].value = ""
	signUpForm["password"].value = ""
	authWrapper.querySelector(".sign-up-alert").textContent = ""
}

const toggleContent = () => {
	if (auth) {
		wrapper.style.display = "flex"
		authWrapper.style.display = "none"
		// fetching current url

		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			let url = tabs[0].url
			try {
				crawl(url)
			} catch (e) {

				displayRating(undefined)
			}
		})
	} else {
		wrapper.style.display = "none"
		authWrapper.style.display = "block"
	}
}


//toggle details
toggle.addEventListener("click", () => {
	if (scoresWrap.style.display == "none") {
		scoresWrap.style.display = "grid"
		displayScores(scoresGlobal)
		toggle.style.rotate = "180deg"

	}
	else {
		scoresWrap.style.display = "none"
		toggle.style.rotate = "0deg"
	}
})



//Grabing Star Figures in a list
const starArr = []
for (let index = 1; index < starsFigureCollect.childNodes.length; index += 2) {
	starArr.push(starsFigureCollect.childNodes[index])
}

let url
let ratingObj
let points

// Providing input bar
const getInputElem = () => {
	crawlBtn.style.display = "none"
	inputClassElem[0].style.display = "flex"
}

crawlBtn.addEventListener("click", getInputElem)

// getting rating of input link
const crawlInputLink = () => {
	inputClassElem[0].style.display = "none"
	crawlBtn.style.display = "none"
	document.querySelector("#detailed-wrap").style.display = "none"
	url = document.getElementById("link-input-id").value
	document.getElementById("link-input-id").value = ""
	if (
		url.match(
			/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
		)
	) {
		for (let i = 0; i < 5; i++) {
			starArr[i].style.color = "rgb(206, 213, 219)"
			starArr[i].style.display = "none"
		}
		ratingLabel[0].textContent = "Loading...please wait"
		ratingLabel[1].textContent = ""

		// getting points from rating object
		crawl(url)

	} else {
		displayRating(undefined)
		crawlBtn.style.display = "block"
	}
}

inputLinkBtn.addEventListener("click", crawlInputLink)

/*
const getPoints = async (obj) => {
	try {
		points = await obj.getPoints()
		if (Number.isFinite(points)) displayRating(points)
		else {
			failureAudio.play()
			ratingLabel[0].textContent = "Something went wrong"
		}
	} catch {
		failureAudio.play()
		ratingLabel[0].textContent = "Something went wrong"
	}
}
*/


//Display Stars
const displayRating = (points) => {
	if (points !== undefined && points !== null) {
		const pointsRound = Math.round(points)
		ratingLabel[0].textContent = "Peté gives"
		ratingLabel[1].textContent = "to this link"
		let i = 0
		for (i; i < 5; i++) {
			if (i < pointsRound) {
				starArr[i].style.display = "flex"
				starArr[i].style.color = `#FFD700`
			} else {
				starArr[i].style.display = "flex"
			}
		}
		successAudio.play()
		return
	} else if (points === null) {
		ratingLabel[0].textContent = "No website found!"
		ratingLabel[1].textContent = ""
		for (let i = 0; i < 5; i++) {
			starArr[i].style.display = "none"
		}
		failureAudio.play()
		return
	} else if (points === undefined) {
		ratingLabel[0].textContent = "Something went wrong!"
		ratingLabel[1].textContent = ""
		for (let i = 0; i < 5; i++) {
			starArr[i].style.display = "none"
		}
		failureAudio.play()
		return
	}
}

const displayScores = (scores) => {
	let score = Math.round(scores.performanceScore)
	const performance = document.querySelector("#performance-id .progress-circle");
	let scoreVal = document.querySelector("#performance-id .score-value");
	let circumference = performance.getTotalLength();
	performance.style.strokeDashoffset = (1 - scores.performanceScore / 10) * circumference;
	scoreVal.innerHTML = `${score}/10`;
	performance.style.stroke = getColor(score)


	score = Math.round(scores.seoScore)
	const seo = document.querySelector("#seo-id .progress-circle");
	scoreVal = document.querySelector("#seo-id .score-value");
	seo.style.strokeDashoffset = (1 - scores.seoScore / 10) * circumference;
	scoreVal.innerHTML = `${score}/10`;
	seo.style.stroke = getColor(score)


	score = Math.round(scores.securityScore)
	const accessibility = document.querySelector("#accessibility-id .progress-circle");
	scoreVal = document.querySelector("#accessibility-id .score-value");
	accessibility.style.strokeDashoffset = (1 - scores.securityScore / 10) * circumference;
	scoreVal.innerHTML = `${score}/10`;
	accessibility.style.stroke = getColor(score)


	score = Math.round(scores.bestPracticesScore)
	const code = document.querySelector("#best-practices-id .progress-circle");
	scoreVal = document.querySelector("#best-practices-id .score-value");
	code.style.strokeDashoffset = (1 - scores.bestPracticesScore / 10) * circumference;
	scoreVal.innerHTML = `${score}/10`;
	code.style.stroke = getColor(score)

}



const randomURL = "https://youtube.com"

// contacting API
const crawl = async (url) => {
	loading.style.display = "flex"
	try {
		let response = await getRating(url)
		if (response.status === "R10002") {
			scoresGlobal = {
				seoScore: response.seo,
				performanceScore: response.performance,
				securityScore: response.security,
				bestPracticesScore: response.bestPractices
			}

		} else if (response.status === "R10004") {
			scoresGlobal = await fetchLightHouseReport(url)
			let total = (scoresGlobal.seoScore + scoresGlobal.performanceScore + scoresGlobal.bestPracticesScore + scoresGlobal.securityScore) / 8
			response = await addRating({
				uid: auth,
				link: url,
				seo: scoresGlobal.seoScore,
				performance: scoresGlobal.performanceScore,
				bestPractices: scoresGlobal.bestPracticesScore,
				security: scoresGlobal.securityScore,
				total:total.toFixed(2)
			})
		}
		const stars = calculateStars(scoresGlobal)
		loading.style.display = " none"
		displayRating(stars)
		console.log(scoresGlobal)
		console.log(stars)
		document.getElementById("detailed-wrap").style.display = "flex"
		scoresWrap.style.display = "none"
		crawlBtn.style.display = "block"
	} catch (e) {
		console.log(e)
		displayRating(undefined)
		loading.style.display = " none"
		crawlBtn.style.display = "block"
	}



}

// calculating rating
const calculateStars = (scores) => {
	let star = 0
	for (let score of Object.values(scores)) {
		star += parseFloat(score)
	}
	return star * 5 / 40
}

// choosing theme color
const getColor = (score) => {
	if (score > 7) return "green"
	else if (score > 5) return "yellow"
	else return "red"
}

// debugging


const debbugCrawl = () => {
	loading.style.display = "flex"
	scoresGlobal = { securityScore: 0.8, seoScore: 0.6, bestPracticesScore: 0.3, performanceScore: 1 }
	// const stars = calculateStars(scoresGlobal)
	loading.style.display = " none"
	displayRating(4)
	document.querySelector("#detailed-wrap").style.display = "flex"
	scoresWrap.style.display = "none"
	crawlBtn.style.display = "block"

}



const toggleAuth = () => {
	if (authState == "SIGN_IN") {
		clearSignInForm()
		authState = "SIGN_UP"
		authWrapper.querySelector(".sign-up-wrap").style.display = "block"
		authWrapper.querySelector(".sign-in-wrap").style.display = "none"

	} else {
		clearSignUpForm()
		authState = "SIGN_IN"
		authWrapper.querySelector(".sign-in-wrap").style.display = "block"
		authWrapper.querySelector(".sign-up-wrap").style.display = "none"
	}
}


alterAuthBtn[0].addEventListener("click", toggleAuth)
alterAuthBtn[1].addEventListener("click", toggleAuth)


signInBtn.addEventListener("click", async (e) => {
	e.preventDefault()
	try {
		const response = await signIn({
			username: signInForm["email"].value,
			password: signInForm["password"].value,
		})
		if (response.status === "S10003") {
			auth = await saveUserLocally(response.uid)
			clearSignInForm()
			toggleContent()
		} else if (response.status === "S10005") {
			authWrapper.querySelector(".sign-in-alert").textContent = "Password did not match!"
		} else if (response.status === "S10006") {
			authWrapper.querySelector(".sign-in-alert").textContent = "User not Signed Up!"
		}
	} catch (e) {
		console.error(e)
	}

})

signUpBtn.addEventListener("click", async (e) => {
	e.preventDefault()
	try {
		const response = await signUp({
			name: signUpForm["name"].value,
			username: signUpForm["email"].value,
			password: signUpForm["password"].value,
			profession: signUpForm["profession"].value
		})

		if (response.status === "S10001") {
			authWrapper.querySelector(".sign-up-alert").textContent = "User already Signed Up!"
		} else if (response.state === "S10002") {
			clearSignUpForm()
			auth = await saveUserLocally()
			toggleContent()
		}
	} catch (e) {
		console.error(e)
	}

})

signoutBtn.addEventListener("click", async () => {
	if (confirm("Are you sure you want to sign out?")) {
		auth = await removeUser()
		toggleContent()
	}


})



toggleContent()


