const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"});
    } 

    if (doesExist(username)) {
        return res.status(409).json({message: "User already exists!"});
    } 
    
    users.push({username, password});
    return res.status(201).json({message: "User successfully registered. Now you can login"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
    return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop using async-await with Axios
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('https://corpusjohnbe-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books');
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])
    return res.status(300).json({message: "Yet to be implemented"});
 });

 // Get book details based on ISBN using async-await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`https://corpusjohnbe-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books/isbn/${isbn}`);
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching book details" });
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = [];

  for (let isbn in books) {
    if (books[isbn].author === author) {
      booksByAuthor.push(books[isbn]);
    }
  }

  if (booksByAuthor.length > 0) {
    res.send(booksByAuthor);
  } else {
    res.status(404).json({message: "No books found by this author"});
  }

  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on author using async-await with Axios
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get(`https://corpusjohnbe-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books/author/${author}`);
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const booksByTitle = [];

    for (let isbn in books) {
        if (books[isbn].title === title) {
          booksByTitle.push(books[isbn]);
        }
    }

    if (booksByTitle.length > 0) {
        res.send(booksByTitle);
      } else {
        res.status(404).json({message: "No books found with this title"});
      }

    return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on title using async-await with Axios
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const response = await axios.get(`https://corpusjohnbe-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/books/title/${title}`);
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book && book.reviews) {
        res.send(book.reviews);
      } else {
        res.status(404).json({message: "No reviews found for this book"});
      }

    return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
