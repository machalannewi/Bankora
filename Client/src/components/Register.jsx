import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Register() {

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        username: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    

    function handleChange (e) {
        const {name, value} = e.target

        setFormData({...formData, [name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)

        try {
            const res = await fetch ("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            const data = await res.json();
            console.log(data);

            if(res.ok) {
             console.log("Data:", data);
             setTimeout(() => {
                navigate("/")
             }, 2000)
            } else {
             console.log("Error Registering User")
            }


        } catch (error) {
          console.error(error, "Registration Failed")
        } finally {
          setIsLoading(false)
        }

        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            phone: "",
            username: ""
  
        })

    } 


    return (
    <div>
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">First Name</label>
            <input 
            onChange={handleChange}
            type="firstname"
            name="firstName"
            value={FormData.firstName}
            placeholder="First Name" 
            />
            <label htmlFor="name">Last Name</label>
            <input 
            onChange={handleChange}
            type="lastname"
            name="lastName"
            value={FormData.lastName}
            placeholder="Last Name"
            />
            <label htmlFor="name">Username</label>
            <input 
            onChange={handleChange}
            type="username"
            name="username"
            value={FormData.username}
            placeholder="Username"
            />
            <label htmlFor="email">Email</label>
            <input 
            onChange={handleChange}
            type="email"
            name="email"
            value={FormData.email}
            placeholder="Email" 
            />
            <label htmlFor="phone">Phone</label>
            <input 
            onChange={handleChange}
            type="phone"
            name="phone"
            value={FormData.phone}
            placeholder="Phone" 
            />
            <label htmlFor="password">Password</label>
            <input 
            onChange={handleChange}
            type="password"
            name="password"
            value={FormData.password}
            placeholder="Password" 
            />

            <button>{isLoading ? "Registering..." : "Register"}</button>
        </form>
    </div>
    )
}
export default Register;