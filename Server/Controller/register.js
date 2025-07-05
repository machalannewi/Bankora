// import bcrypt from "bcrypt";
// import registerModel from "../Model/register.js"

// function Register () {

// router.post("/auth/register", async (req, res) => {

// try {

//     const {
//         firstName,
//         lastName,
//         email,
//         password,
//         phone
//     } = req.query


//     if (!firstName || !lastName || !email || !password ||phone) {
//         return res.status(400).json({message: "Missing required parameter"})
//     }

//     const userExist = await pool.query({email})
//     if(userExist) return "User already exist";

//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(salt, password);

//     const createUser = await registerModel ({
//         firstName,
//         lastName,
//         email,
//         password: hashedPassword,
//         phone
//     })

//     res.json({
//         success: createUser, 
//         message: createUser
//         ? "User Registered Successfully"
//         : "User could not be registered"
//     })

//     } catch (error){
//      res.status(400).json({message: "Database error", error})
//     }
//  })

// }


// export default Register;