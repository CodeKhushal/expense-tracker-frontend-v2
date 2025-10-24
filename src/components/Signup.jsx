import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Logo from "./shared/Logo";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/endpoints";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
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
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, input, {
        // const res = await axios.post("http://localhost:8000/api/v1/user/register", input, {
        headers: {
          "Content-Type": "application/json",
        },
        signal: controllerRef.current?.signal,
        withCredentials: true,
      });
      console.log(res);
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      
      // Handle different types of errors
      if (error.name === "AbortError" || error.code === "ERR_CANCELED") {
        toast.error("Request was canceled. Please try again.");
      } else if (error.response) {
        // Server responded with error status
        toast.error(error.response.data?.message || "Registration failed");
      } else if (error.request) {
        // Request was made but no response received
        toast.error("No response from server. Please check your connection.");
      } else {
        // Something else happened
        toast.error("An unexpected error occurred. Please try again.");
      }
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
          <Label>Full Name</Label>
          <Input
            type="text"
            name="fullname"
            value={input.fullname}
            onChange={changeEventHandler}
          />
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
          <Button type="submit" className="w-full my-5">
            Signup
          </Button>
        )}

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
        {timeoutReached && (
          <div className="mt-4 p-3 bg-yellow-100 rounded-lg text-sm">
            <p>⚠️ Server is taking too long to respond</p>
            <p className="mt-2">
              Possible solutions:
              <br />
              1. Try again in a few minutes
              <br />
              2. Check our{" "}
              <a href="/status" className="text-blue-600">
                status page
              </a>
              <br />
              3. Contact support@kexptracker.com
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default Signup;
