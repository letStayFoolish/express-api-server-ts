# Implement JWT Authentication using Node, Express, TypeScript

_Sources:_
[https://dev.to/cristain/how-to-implement-jwt-authentication-using-node-express-typescript-app-2023-2c5o](https://dev.to/cristain/how-to-implement-jwt-authentication-using-node-express-typescript-app-2023-2c5o)

## 1. Initialize Project

### 1.1 Before any actions, first things first, if you are going to use code that is already written

- Create your database using MongoDB. Get connection url which will later be used in `.env` file as `DATABASE_URL`
- In this file as a server path use: `http://localhost:5000` --> `PORT` is 5000 by default, if you want to change it, go to the `.env` file and set constant for PORT as you wish
- Also, do not forget to generate new secret key and put it in `.env` file as `JWT_SECRET`

> npm init --yes

## 2. Install dependencies and devDependencies

- Install dependencies:

  > npm install express mongoose cors jsonwebtoken dotenv

- Install devDependencies:

  > npm install typescript @types/node @types/express ts-node nodemon @types/cors @types/jsonwebtoken --save-dev

- Let’s install jsonwebtoken library to work with JWT tokens, and bcryptjs to hash the password:
  > npm i bcryptjs jsonwebtoken
- & 
  > npm i -D @types/bcryptjs @types/jsonwebtoken

- Run below command to create a tsconfig.json file. Or add a `tsconfig.json` file for **typescript** configuration:
  >npx tsc --init
- or
  > tsc --init

- add this config in `tsconfig.json`:

```
{
    "compilerOptions": {
        /* Language and Environment */
        "target": "es2016" /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */,
        /* Modules */
        "module": "commonjs" /* Specify what module code is generated. */,
        "rootDir": "./",
        "outDir": "./dist",
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true /* Ensure that casing is correct in imports. */,

        /* Type Checking */
        "strict": true,
        "skipLibCheck": true /* Skip type checking all .d.ts files. */
    }
}

```

## 3. Setup .env file

- First create `.env` file in the root of backend project, after that you can start adding constants
- Add `NODE_ENV=development` so after you can easily change from 'development' tp 'production' and vise versa
- Define PORT
  > PORT=5000
- Also do not forget to define MongoDB url:
  > DATABASE_URL=mongodb+srv://<username>:<password>@...
- Add secret key, needed in moments of creation a jwt tokens. Before that in console type next lines of code:

```
node
require("crypto").randomBytes(35).toString("hex")
```

- Take the **Output** from the console and add it to the .env as `SECRET_KEY`

## 4. Set Up a Mongo Database

- Outside root file create `db.ts` file for defining the **mongoose** connection:

```
import Mongoose from "mongoose";
const localDB = process.env.DATABASE_URL || "..."

const connectDB = async () => {
    try {
        const cn = await Mongoose.connect(localDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        console.log("🛢️ Connected To Database");
    } catch (error) {
        console.log("⚠️ Error to connect to Database");
    }
}
```

## 5. Setup express server with typescript

- In the root create a root file, name it: `inde.ts`, or `server.ts` or even `app.ts`:

```
import express
import {Application} from "express"
import mongoose
import cors
import dotenv

// Create the express app (wit its type):
const app: Application = express()

// Add cors
app.use(cors())

// Configure env:
dotenv.config()

// Add parsers:
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

// Declare PORT:
const port = process.env.PORT || 5000;

// Set initial endpoint in testing purpose:
app.get('/', (req, res) => {
    res.status(200).send("Hello from Exress + TypeScript server")
})



// Listen server:
const server = app.listen(port, async () =>{

    console.log(`Server is running on PORT: ${port}`)


    // Connect to the MongoDB:
    try {
       const cn = await mongoose.connect(process.env.DATABASE_URL as string)

       if(cn) console.log("Connected to Database")

    } else {
        console.log("Error to connect Database")
    }
})
```

- To test it, do not forget to add scripts in `package.json` file:

```
"scripts": {
    "dev": "nodemon index.ts",
    ...
}
```

> npm run dev

## 6. Create User Schema

- Create `models` folder with `userSchema` file
- **Schema** is like a blueprint that shows how the database will be contstructed.
- `userSchema.ts` contains **username** (or email), **password**, and **roles** (or isAdmin)

```
const userSchema = new Mongoose.Schema({
    name: {type, required, minlength, maxlength}
    email: {type, required, unique, validate, match},
    password: {type, required, minlength: 6, maxlength},
    description: {type, required},
    avatar: {type, required, validation},
    isAdmin: {type, required, default: false}
    or
    role: {type, default: "basic", required}
}, timestamps: true)

export const User = mongoose.model("User", userSchema)
```

- Also good practice is to add email, password validation. If there is more fields to be validate - do it!

- After creating the user model we are ready to implement the jwt Authentication

### 6.1 Define function to generate tokens

- You can create a global helper function `generateToken.ts` in utils:

```
export const generateToken = (props) => {
                             payload
    const token = jwt.create(userInfo, secret, {options})

    res.cookie(cookieName, token, {
        options...
    })
}
```

## 7. Create User Api to Register

- Functionality: **adding users**, **getting all users**, **update user info**, **deleting users**, etc...
- You can create new file `auth.ts` or insdide `userController` add `registerUser` method:

```
const registerUser = async (req, res, next) => {
    try {
        // ** Get the User data from body
        const { name, email/username, password, avata, description, isAdmin/role } = req.body
        or take whole user like user = req.body; and later destructure the information from user.

        // ** Check the email/username if the user already exist in database or not
        // ** Import the user model from "./models/userModel.ts"

        const userExist = await User.findOne({ email/username })

        if(userExist) {
            res.status(400).json({
                status: 400,
                message: "..."
            })
            return;
            // or:
            throw new Error("User already exist") or "Email all ready in use"
        }

        // If there is no such a user in the data base, create new user:

        const newUser = await User.create({ name, email/username, password })

        // ** generate token

        // ** Do not save the password as a plain text in db!!!
        // use bcrypt to hash password
        // In this case, it was managed within the userModel, hasing the passwords before storing it in db

        // Send the newUser as response:
        res.status(201).json({
            _id:newUser._id,
            name:newUser.name,
            email/username: newUser.email/newUser.username,
            avatar: newUser.avatar,
            description: newUser.description,
            isAdmin: newUser.isAdmin,
            status: 201,
            message: "User created successfully",
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: 400,
            message: error.message.toString(),
        })
    }
}
```

## 8. Create Login Api and Implement JWT authentication

- POST request
- Inside request of a body, we should put: email, passowrd
- `authenticateUser` async function with try/catch block
- Inside try block should be included logic to find user like so `User.findOne({email})` but before that destructure user auth info: **email**, **password**, and check if there are **email** and **passowr**
- When user has been founded in db, check if passwords are matching (function should be inside `models.methods.matchPasswords`)
- If there is user with such a email/username and passwords are matched, we can generateToken.
- Send status(201).json({ status, message, success, user}) to the client
- If not send status(400).json({ status, message, error })

## 9. Authenticate Users with JSON Web Token (JWT)

- JSON Web Token help shield a route from an unauthenticated user.
- JWT creates a token, sends it to the client, and then the client uses the token for making requests. It also helps to verify that you are a valid user making those requests.

### 9.1 Protet the routes

- To prevent unauthenticated users from accessing the private route, take the token from the cookie, verify the token, and redirect users based on role
- You'll get the token from the client using a node package called cookie-parser.
- Install it, iy you haven't already:

  > npm i cookie-parser
  > app.use(cookieParser())

- Create middleware that verifies the token and grants access to your private route
- Admin Authentication:

```
adminAuth = (req, res, next) => {
    // grab token from cookie
    token = req.cookies.jwt

    // Check if there is token inside cookies:
    if (token) {
        jwt.verify(token, secret, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({
                    status: 401,
                    message: "Not authorized",
                    error: err
                })
            } else {                                 // means isAdmin: false
                if (decodedToken.role !== "admin" || !decodedToken.isAdmin ) {
                    return res.status(401).json({ message: "Not authorized" })
                } else {
                    next()
                }
            }
        })
    } else {
        return res.status(401).json({
            status: 401,
            message: "Not authorized, token not available",
        })
    }
}
```

- Protect Routes - User Authentication

```
protect = (req, res, next) => {
    // grab token from cookie
    token = req.cookies.jwt

    // Check if there is token inside cookies:
    if (token) {
        jwt.verify(token, secret, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({
                    status: 401,
                    message: "Not authorized",
                    error: err
                })
            } else {
               next()
            }
        })
    } else {
        return res.status(401).json({
            status: 401,
            message: "Not authorized, token not available",
        })
    }
}
```

- Now protect the routes by adding middleware
  > router.route('/').get(adminAuth, getAllUsersController)
- And so on for all of the routes that need to be protected

## 10. Logout

- set cookie to "" like so:
  > res.cookie(cookieName, "", { httpOnly: true, expires: new Date(0)})
- It has to be post request, protected route.

## 11. Get User Profile

- grab **id** from request (user or body)
- Define user using `User.findById(id)`
- Check if there is such a user, and send status(201), send json({id, name, email, isAdmin}) if not, send status(400) with "Invalid user data" message
-

## 12. Update User Information

- Create controller `getAllUsers` by using `User.find({})` empty object to call everything
- check if there is userList, and send status(200) and json({ status, userList, message})
- If !userList set status(400) json({ status, message})
