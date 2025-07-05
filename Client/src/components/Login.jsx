import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Login = () => {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    function handleChange (e) {
        const {name, value} = e.target;

        setFormData({...formData, [name]: value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
        const res = await fetch ("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })

        const data = await res.json();
        console.log(data);

        if(res.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user))
          console.log("Data:", data)
          setTimeout(() => {
            navigate("/wallet", {state: {userName: data.user.username, balance: data.user.balance, userEmail: data.user.email}})
          }, 2000)
        }

        } catch(error) {
          console.error(error, "Error Logging In")
        } finally {
          setIsLoading(false)
        }

        setFormData({
            email: "",
            password: ""
        })

    }



  return (
    <div>
        <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input 
            onChange={handleChange}
            type="email" 
            name="email"
            value={formData.email}
            placeholder="Enter your email"
            />
            <label htmlFor="password">Password</label>
            <input 
            onChange={handleChange}
            type="password" 
            name="password"
            value={formData.password}
            placeholder="Enter your password"
            />

            <button>
            {isLoading ? "Logging in..." : "Login"}
            </button>
        </form>
    </div>
  )
}

export default Login