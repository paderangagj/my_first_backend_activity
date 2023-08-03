const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
const port = 5000; 

app.use(express.urlencoded({ extended: true }))

//given books variable
const Books = [
    {
        id: 1,
        BookName: "PHP 8",
        YearPublished: "2023",
        Author: "VicS",
        Category: "Web",
        status: 1,
    },
    {
        id: 2,
        BookName: "React.js",
        YearPublished: "2000",
        Author: "Peter SMith",
        Category: "Web",
        status: 1,
    },
    {
        id: 3,
        BookName: "CSS framework",
        YearPublished: "2005",
        Author: "Jaguar",
        Category: "Web",
        status: 1,
    },
    {
        id: 4,
        BookName: "Data Science",
        YearPublished: "2023",
        Author: "Vic S",
        Category: "Data",
        status: 1,
    },
]

//given LoginProfile variable
const LoginProfiles = [

    {
        id: 1,
        username: "admin",
        password: "passwd123",
        isAdmin: true,
    },
    {
        id: 2,
        username: "staff",
        password: "123456",
        isAdmin: false,
    },
    {
        id: 3,
        username: "vice",
        password: "abracadabra",
        isAdmin: false,
    },
    {
        id: 4,
        username: "super",
        password: "69843",
        isAdmin: true,
    },
    {
        id: 5,
        username: "user",
        password: "123",
        isAdmin: false,
    }
];


//middleware security using verify of JWT
const verify = (req, res, next) => {

    const autHeader = req.headers.authorization;
    console.log("token validation: " + req.headers.authorization);

    if (autHeader) {
        const token = autHeader.split(" ")[1];
       
        jwt.verify(token, "Secret_Key", (err, user) => { 

            if (err) {
                return res.status(403).json("token is not valid")
            }
            
            req.user = user;
            next();
        })

    } else {
        return res.status(403).json("Authentication failed")
    }
}
const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "Secret_Key", { expiresIn: '15min' })
}
app.get('/books', verify, (req, res) => {
    res.json(Books);
})
app.post('/find_book', verify, (req, res) => {

    let book_id = parseInt(req.body.book_id); 
    const book = Books.find((u) => {

        console.log("Retrieving information:", u.id, typeof (u.id), "===", typeof (book_id), book_id);

        return u.id === book_id;
    });

    console.log(book);

    if (book) {

        res.json(book);

    } else {
        res.status(404).json("Book not available");
    }
});

//login end point and implement the JWT security
app.post('/login', (req, res) => {

    let username = req.body.username;
    let password = req.body.password;

    const user = LoginProfiles.find((u) => {
        return u.username === username && u.password === password;
    });

    if (user) {

        const accessToken = generateAccessToken(user);

        res.json({
            username: user.username,
            isAdmin: user.isAdmin,
            accessToken: accessToken,
        });

    } else {
        res.status(400).json("username or password is incorrect");
    }

});

app.get('/all-user',(req, res) => {
    
    res.json(LoginProfiles);

})





app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});