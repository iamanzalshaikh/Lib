import { createContext, useContext, useEffect, useState } from "react";
// import { getCurrentUser } from "../../../../backend/controller/userController";
import { AuthContext } from "./AuthContext";
import axios from "axios";






export const userDataContext = createContext();

function UserContext({ children }) {
    let [userdata, setUserData] = useState("")
    let { serverUrl } = useContext(AuthContext)

    const getCurrentUser = async () => {
        try {
            let result = await axios.get(
                serverUrl + "/api/user/getCurrentUser",

                { withCredentials: true }
            );
            setUserData(result.data);
            console.log(result.data)
        } catch (error) {
            setUserData(null);
            console.log(error);
        }
    };


    useEffect(() => {
        // Delay fetch to give time for cookie to be set
        const timer = setTimeout(() => {
            getCurrentUser();
        }, 300); // 300ms

        return () => clearTimeout(timer);
    }, []);


    let value = {
        userdata,
        setUserData,
        getCurrentUser


    }


    return (
        <div>
            <userDataContext.Provider value={value}>
                {children}

            </userDataContext.Provider>


        </div>



    )

}
export default UserContext;