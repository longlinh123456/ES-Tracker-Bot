import express from "express"
const app = express()
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
const listener = app.listen(port, function() {
	console.log(`Your app is listening on port ${port}`)
})
app.get("/keepalive", (req, res) => res.sendStatus(200))
process.on("SIGINT", () => {
	listener.close()
})