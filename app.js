const express = require("express")
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://gmc327:XkbeIuWKD0rQkN9J@cluster0.aufu7kz.mongodb.net/todolistDB?retryWrites=true&w=majority&appName=Cluster0")

const itemsSchema = {
    name: String
}

const Item = mongoose.model("Item", itemsSchema)

const item1 = new Item({name: "Welcome to your todo list"})

const item2 = new Item({name: "Hit the + to add new items"})

const item3 = new Item({name: "<- click to delete"})

const defaultItems = [item1, item2, item3]

const listSchema = {
    name: String,
    items: [itemsSchema]
}

const List = mongoose.model("List", listSchema)

app.get("/", (req, res) => {

        Item.find({}).then((foundItems) => {

            if(foundItems.length === 0){
                Item.insertMany(defaultItems).then((items) => {
                    console.log(items)
                })
        
                res.redirect("/")
            } else {
                res.render("list", {listTitle: "Today", newListItems: foundItems})
            }

        })
})

app.get("/:customListName", (req, res) => {
    
    const customListName = req.params.customListName

    List.findOne({name: customListName}).then((foundList) => {
        if(!foundList)
        {
            const list = new List({
                name: customListName,
                items: defaultItems
            })
        
            list.save()
            res.redirect("/" + customListName)
        } else {
            res.render("list", {listTitle: foundList.name, newListItems: foundList.items})
        }
    })

})

app.post("/", (req, res) => {

    const itemName = req.body.newItem

    const newItem = new Item({name: itemName})

    newItem.save()

    res.redirect("/")
    
})

app.post("/delete", (req, res) => {

    const checkedItemId = req.body.checkbox

    Item.findByIdAndDelete(checkedItemId).exec().then((res) => {

    })

    res.redirect("/")

})



app.listen(3000, () => {
    console.log("server is running")
})