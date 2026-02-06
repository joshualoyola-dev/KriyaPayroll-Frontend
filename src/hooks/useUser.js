import { useCallback, useEffect, useMemo, useState } from "react";
import { getPayrollUsers, getUser } from "../services/user.service";
import { useAuthContext } from "../contexts/AuthProvider";

const useUser = () => {
    const [users, setUsers] = useState([]); //this is the users of payroll - defined in hris backend. 
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(false);
    const [isUsersLoading, setIsUsersLoading] = useState(false);

    const { token } = useAuthContext();

    const userIdToName = useMemo(() => {
        const map = new Map();

        for (const u of users) {
            map.set(u.user_id, `${u.first_name} ${u.last_name}`)
        };

        return map;
    }, [users]);

    const fetchUserInfo = useCallback(async () => {
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
    }, []);

    const fetchPayrollUsers = useCallback(async () => {
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
    }, []);


    const mapUserIdToName = useCallback((user_id) => {
        const user = userIdToName.get(user_id);
        if (!user) return user_id;

        return user;
    }, [users]);

    useEffect(() => {
        if (!token) return;

        fetchUserInfo();
    }, [token, fetchUserInfo]);


    useEffect(() => {
        if (!token) return;

        fetchPayrollUsers();
    }, [token, fetchPayrollUsers]);

    return {
        users, setUsers,
        user, setUser,
        loading, setLoading,
        isUsersLoading, setIsUsersLoading,
        mapUserIdToName
    };
}

export default useUser;