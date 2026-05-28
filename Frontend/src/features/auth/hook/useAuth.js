import { setError, setLoading, setUser } from "../state/auth.slice.js";
import { login, register } from "../service/auth.api.js";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toast } from "sonner";
export const useAuth = () => {

    const dispatch = useDispatch();
    const error = useSelector((state) => state.auth.error);
    const loading = useSelector((state) => state.auth.loading);
    const user = useSelector((state) => state.auth.user);

    async function handleRegister({ email, contact, password, fullName, isSeller=false }) {
        dispatch(setError(null));
        
        const data = await register({ email, contact, password, fullName, isSeller }, dispatch);

        if(data?.user) {
            dispatch(setUser(data.user));
        }
    }

    async function handleLogin({ email, password }) {
        dispatch(setError(null));
        const data = await login({ email, password }, dispatch);

        if(data?.user) {
            dispatch(setUser(data.user));
        }
    }

    return { handleRegister, handleLogin };
}