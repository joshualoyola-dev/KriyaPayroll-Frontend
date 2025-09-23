import { useEffect, useState } from "react";
import { getPayrollUsers, getUser } from "../services/user.service";
import { useAuthContext } from "../contexts/AuthProvider";

const useUser = () => {
    const [users, setUsers] = useState([]); //this is the users of payroll - defined in hris backend. 
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(false);
    const [isUsersLoading, setIsUsersLoading] = useState(false);

    const fetchUserInfo = async () => {
        setLoading(true);
        try {
            const response = await getUser();
            setUser(response.data.user);
        } catch (error) {
            console.log(error);
        }
        finally {
            setLoading(false);
        }
    };

    const fetchPayrollUsers = async () => {
        setIsUsersLoading(true);
        try {
            const response = await getPayrollUsers();
            const parsedUser = response.data.users.map(u => ({
                user_id: u.user_id,
                first_name: u.HrisUserInfo.first_name,
                last_name: u.HrisUserInfo.last_name,
            }));
            console.log('parsed', parsedUser);

            setUsers(parsedUser);
        } catch (error) {
            console.log('error', error);
            setUsers(null);
        }
        finally {
            setIsUsersLoading(false);
        }
    };


    useEffect(() => {
        fetchUserInfo();
    }, []);


    useEffect(() => {
        fetchPayrollUsers();
    }, []);

    return {
        users, setUsers,
        user, setUser,
        loading, setLoading,
        isUsersLoading, setIsUsersLoading
    };
}

export default useUser;