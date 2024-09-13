import { createContext, useState, useContext, useEffect } from "react"
import { account } from "../appwrite/appwriteConfig"
import { ID } from "appwrite"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {
        try {
            const response = await account.get();
            setUser(response);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleLogin = async (e, credentials) => {
        if(e) e.preventDefault()
        try {
            await account.createEmailPasswordSession(
                credentials.email,
                credentials.password)
            getUser();
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleLogout = async () => {
        try {
            await account.deleteSession("current");
            setUser(null);
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const handleSignup = async (e, credentials)=> {
        e.preventDefault();
        if(credentials.password !== credentials.confirmPassword) 
            return alert("Passwords do not match");
        try {
            await account.create(
                ID.unique(),
                credentials.email,
                credentials.password,
                credentials.name
            );
            await handleLogin(null, credentials);
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    }

    const contextData = {
        user,
        handleLogin,
        handleLogout,
        handleSignup
    }

    return <AuthContext.Provider value={contextData}>
        {loading ? <h2 className="text-center text-3xl">Loading...</h2> : children}
    </AuthContext.Provider>
}

export const useAuth = () => {
    return useContext(AuthContext)
}

export default AuthContext