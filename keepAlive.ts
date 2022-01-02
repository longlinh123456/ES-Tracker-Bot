import express from "express"
const app = express()
const listener = app.listen(process.env.PORT, function() {
	console.log("Your app is listening on port " + process.env.port ? process.env.port : "(failed to detect port)")
})
process.on("SIGINT", () => {
	listener.close()
})