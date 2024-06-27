const express = require("express")
const bodyParser = require("body-parser");
const { it } = require("node:test");

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

app.set('view engine', 'ejs');

let items = []
let workItems = []

app.get("/", (req, res) => {

    let today = new Date()

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    let day = today.toLocaleString("en-US", options)

    res.render("list", {listTitle: day, newListItems: items})
})

app.get("/work", (req, res) => {

    res.render("list", {listTitle: "Work List", newListItems: workItems})
})

app.post("/", (req, res) => {

    item = req.body.newItem
    if(req.body.list === "Work List"){
        workItems.push(item)
        res.redirect("/work")
    } else {
        items.push(item)
        res.redirect("/")
    }
})

app.listen(3000, () => {
    console.log("server is running")
})