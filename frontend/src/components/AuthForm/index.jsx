import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      const { email, password } = JSON.parse(userData);
      setEmail(email);
      setPassword(password);
    }
  }, []);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleLogin = (e) => {
    const userData = localStorage.getItem("userData");
    e.preventDefault();

    if (userData) {
      toast.success("Login successful!", {
        autoClose: 3000,
      });
      navigate("/");
    } else {
      toast.error("Invalid email or password!", { autoClose: 3000 });
    }
  };

  const handleRegistration = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!", { autoClose: 3000 });
      return;
    }
    const userData = { email, password };
    localStorage.setItem("userData", JSON.stringify(userData));

    toast.success("Registration successful!, Now you can Login", {
      autoClose: 3000,
    });

    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <>
      <ToastContainer />
      <div
        className="container"
        style={{ minHeight: "30rem", height: "auto", overflowY: "hidden" }}
      >
        <input type="checkbox" id="check" />
        {isLogin ? (
          <div className="login form">
            <header>Login</header>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                required
              />
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <Icon
                  icon={showPassword ? eyeOff : eye}
                  size={20}
                  onClick={togglePasswordVisibility}
                  className="eye-icon"
                />
              </div>
              <a href="">Forgot password?</a>
              <input type="submit" className="button" value="Login" />
            </form>
            <div className="signup">
              <span className="signup">
                Don't have an account?{" "}
                <label htmlFor="check" onClick={toggleForm}>
                  Signup
                </label>
              </span>
            </div>
          </div>
        ) : (
          <div className="registration form">
            <header>Signup</header>
            <form onSubmit={handleRegistration}>
              <input
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                required
              />

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  minLength={8}
                />
                <Icon
                  icon={showPassword ? eyeOff : eye}
                  size={20}
                  onClick={togglePasswordVisibility}
                  className="eye-icon"
                />
              </div>

              <div className="confirm-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  required
                  minLength={8}
                />
                <Icon
                  icon={showPassword ? eyeOff : eye}
                  size={20}
                  onClick={togglePasswordVisibility}
                  className="eye-icon"
                />
              </div>
              <input type="submit" className="button" value="Signup" />
            </form>
            <div className="signup">
              <span className="signup">
                Already have an account?{" "}
                <label htmlFor="check" onClick={toggleForm}>
                  Login
                </label>
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AuthForm;
