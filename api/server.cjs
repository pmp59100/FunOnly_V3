
const cors = require("cors")
const express = require('express');
const fs = require("fs");
const app = express();

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
const games = JSON.parse(fs.readFileSync("api/my_data/data.json"))
app.get("/games", (req, res) => {
    return res.send(games)
})
app.get("/game/:id", (req, res) => {
    return res.send(games.find(game => game.id == req.params.id))
})
app.post("/game/:id/comment", (req, res) => {
    console.log(req.body)
    const game = games.find(game => game.id == req.params.id)
    const newComment = {
        id: Math.floor(Math.random() * 1000000), // simulate a unique id
        author: {
            name: "Anonymous",
            avatar: "https://i.pravatar.cc/300",
            id: 3
        },
        text: req.body.comment
    }
    game.comments.push(newComment)
    writeDataToFile()
    return res.send(newComment)
})
app.delete("/game/:id/comment/:commentId", (req, res) => {
    const game = games.find(game => game.id == req.params.id)
    game.comments = game.comments.filter(comment => comment.id != req.params.commentId)
    writeDataToFile();
    return res.send(game)
})

function writeDataToFile() {
    fs.writeFileSync("api/my_data/data.json", JSON.stringify(games, null, 2))
}
app.listen(3001, () => {
    console.log("Server running on port 3001")
})