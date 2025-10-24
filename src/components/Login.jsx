import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Logo from "./shared/Logo";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/endpoints";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [timeoutReached, setTimeoutReached] = useState(false);
  const { loading } = useSelector((store) => store.auth);
  const controllerRef = React.useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (loading) {
      controllerRef.current = new AbortController();
      const timeoutId = setTimeout(() => {
        if (loading) {
          setTimeoutReached(true);
          controllerRef.current.abort();
        }
      }, 20000);

      return () => {
        clearTimeout(timeoutId);
        controllerRef.current.abort();
      };
    }
  }, [loading]);

  // api integration
  const submitHandler = async (e) => {
    e.preventDefault();
    setTimeoutReached(false);
    if (!input.email || !input.password) {
      toast.error("Please enter both email and password.");
      return;
    }
    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${USER_API_END_POINT}/login`,
        //   const res = await axios.post(
        //     "http://localhost:8000/api/v1/user/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          signal: controllerRef.current?.signal,
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      if (error.name === "AbortError") {
        toast.error(
          "Connection timeout. Please check your internet connection"
        );
      } else if (error.response) {
        // Server responded with error status
        toast.error(error.response.data?.message || "Login failed");
      } else if (error.request) {
        // Request was made but no response received
        toast.error("No response from server. Please check your connection.");
      } else {
        // Something else happened
        toast.error("An unexpected error occurred. Please try again.");
      }
      // toast.error(error.response.data.message);
    } finally {
      dispatch(setLoading(false));
    }
  };
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <form onSubmit={submitHandler} className="w-96 p-8 shadow-lg">
        <div className="w-full flex justify-center mb-5">
          <Logo />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
          />
        </div>
        <div>
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
          />
        </div>
        {loading ? (
          <Button className="w-full my-4">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button className="w-full my-5" disabled={loading}>
            Login
          </Button>
        )}

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600">
            Signup
          </Link>
        </p>
        {timeoutReached && (
          <div className="mt-4 p-3 bg-yellow-100 rounded-lg text-sm">
            <p>😟 Connection taking longer than expected...</p>
            <p className="mt-2">
              Try:
              <br />
              1. Checking your internet connection
              <br />
              2. Whitelisting our domain in firewall
              <br />
              3.{" "}
              <button
                type="button"
                className="text-blue-600 underline"
                onClick={submitHandler}
              >
                Retry now
              </button>
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
