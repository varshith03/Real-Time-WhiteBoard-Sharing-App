import React, { useState } from 'react';
import './index.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="container">
      <input type="checkbox" id="check" />
      {isLogin ? (
        <div className="login form">
          <header>Login</header>
          <form action="#">
            <input type="text" placeholder="Enter your email" />
            <input type="password" placeholder="Enter your password" />
            <a href="#">Forgot password?</a>
            <input type="button" className="button" value="Login" />
          </form>
          <div className="signup">
            <span className="signup">
              Don't have an account? <label htmlFor="check" onClick={toggleForm}>Signup</label>
            </span>
          </div>
        </div>
      ) : (
        <div className="registration form">
          <header>Signup</header>
          <form action="#">
            <input type="text" placeholder="Enter your email" />
            <input type="password" placeholder="Create a password" />
            <input type="password" placeholder="Confirm your password" />
            <input type="button" className="button" value="Signup" />
          </form>
          <div className="signup">
            <span className="signup">
              Already have an account? <label htmlFor="check" onClick={toggleForm}>Login</label>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
