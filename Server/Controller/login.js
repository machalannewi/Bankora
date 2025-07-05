



function Login () {

app.post("/login", (req, res) => {
    const email = req.body.email
    const password = req.body.password

    if(!email || !password ){
        return res.status(400).json({error: "Email or Password is incorrect"})
    }

   })
}


export default Login
