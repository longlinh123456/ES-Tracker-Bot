import express from "express"
const app = express()
const listener = app.listen(process.env.PORT, function() {
	console.log(`Your app is listening on port ${process.env.PORT}`)
})
app.get("/", (req, res) => res.sendStatus(200))
process.on("SIGINT", () => {
	listener.close()
})