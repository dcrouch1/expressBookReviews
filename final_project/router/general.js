const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist 
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
}); 


//BOOKS: Get the book list available in the shop
public_users.get('/',function (req, res){
    // BOOKS: promise for book list
    let bp = new Promise ((resolve, reject) => {
    if(JSON.stringify(books,null,4).length > 0){
        resolve("BOOK CallBack Promise is Successful ")
    }
    else{
        reject("BOOK CallBack Promise has Failed ")
    }
    })
    bp.then((message) => {
        res.send(message + JSON.stringify(books,null,4));
    }).catch((message) => {
        console.log(message)
    })
});


//ISBN: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    const ISBN = req.params.isbn;
    //ISBN: promise for book based on ISBN
    let isbnp = new Promise ((resolve, reject) => {
    if(books[ISBN]){
        resolve("ISBN CallBack Promise is Successful ")
    }
    else{
        reject("ISBN CallBack Promise has Failed ")
    }
    }) 
    isbnp.then((message) => {
        res.send(message + JSON.stringify(books[ISBN]));
        }).catch((message) => {
        console.log(message)
    })
});

  
//ARTHORS: Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let authors = []
    for(const [key, values] of Object.entries(books)){
        const book = Object.entries(values);
        for(let i = 0; i < book.length ; i++){
            if(book[i][0] == 'author' && book[i][1] == req.params.author){
                authors.push(books[key]);
            }
        }
    }
    if(authors.length == 0){
        return res.status(300).json({message: "No matching author found"});
    }
    //ARTHORS: promise for book based on author
    let authorp = new Promise ((resolve, reject) => {
        if(authors){
            resolve("Authors CallBack Promise is Successful ")
        }
        else{
            reject("Authors CallBack Promise has Failed ")
        }
        }) 
        authorp.then((message) => {
            res.send(message +  JSON.stringify(authors));
            }).catch((message) => {
            console.log(message)
        })

});

//TITLES: Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let titles = []
  for(const [key, values] of Object.entries(books)){
      const book = Object.entries(values);
      for(let i = 0; i < book.length ; i++){
          if(book[i][0] == 'title' && book[i][1] == req.params.title){
              titles.push(books[key]);
          }
      }
  }
  if(titles.length == 0){
      return res.status(300).json({message: "No matching title found"});
  }
    //TITLES: promise for book based on author
    let titlesp = new Promise ((resolve, reject) => {
        if(titles){
            resolve("Titles CallBack Promise is Successful ")
        }
        else{
            reject("Titles CallBack Promise has Failed ")
        }
        }) 
        titlesp.then((message) => {
            res.send(message +  JSON.stringify(titles));
            }).catch((message) => {
            console.log(message)
        })

  //res.send(titles);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  if(!books[ISBN].reviews.doesExist){
    return res.status(300).json({message: "No matching review found"});
   } 
  else {res.send(books[ISBN].reviews)}
});

module.exports.general = public_users;
