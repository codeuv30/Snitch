import { setError, setLoading, setUser } from "../state/auth.slice.js";
import { getCurrentUser, login, logout, register } from "../service/auth.api.js";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useCallback } from "react";

export const useAuth = () => {
  const dispatch = useDispatch();

  const error = useSelector((state) => state.auth.error);
  const loading = useSelector((state) => state.auth.loading);
  const user = useSelector((state) => state.auth.user);

  const handleRegister = useCallback(
    async (user) => {
      dispatch(setError(null));

      const data = await register(user, dispatch);

      if (data?.user) {
        dispatch(setUser(data.user));
        return data.user;
      }
    },
    [dispatch],
  );

  const handleLogin = useCallback(
    async ({ email, password }) => {
      dispatch(setError(null));
      const data = await login({ email, password }, dispatch);

      if (data?.user) {
        dispatch(setUser(data.user));

        return data.user;
      }
    },
    [dispatch],
  );

  const handleLogout = useCallback(() => {
    const data = logout(dispatch);

    return data;
  }, [dispatch]);

  const handleGetUser = useCallback(() => {
    const data = getCurrentUser(dispatch);

    return data;
  }, [dispatch])

  return { handleRegister, handleLogin, handleLogout, handleGetUser };
};
