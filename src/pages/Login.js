import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ For toggling password
  const navigate = useNavigate();

  // 🔐 Dummy credentials
  const DUMMY_EMAIL = "admin@goldapp.com";
  const DUMMY_PASSWORD = "Admin@123";

  const handleLogin = () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    if (email === DUMMY_EMAIL && password === DUMMY_PASSWORD) {
      const user = {
        email: DUMMY_EMAIL,
        role: "admin",
        token: "dummy-token-12345",
      };

      // ✅ Store dummy user
      localStorage.setItem("user", JSON.stringify(user));
      console.log("Login successful:", user);

      navigate("/dashboard"); // redirect
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPane}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png"
          alt="shield"
          style={styles.image}
        />
      </div>

      <div style={styles.rightPane}>
        <div style={styles.form}>
          <h2 style={styles.logo}>
            <span role="img" aria-label="shield">🛡️</span>
            <span style={{ fontWeight: "bold" }}>Admin</span>Panel
          </h2>

          <h3>Welcome Back</h3>

          <input
            type="email"
            placeholder="Email: admin@goldapp.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <div style={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password: Admin@123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...styles.input, paddingRight: "40px" }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div style={styles.options}>
            <label>
              <input type="checkbox" /> Remember me
            </label>
          </div>

          <button style={styles.button} onClick={handleLogin}>
            ➜ Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  leftPane: {
    flex: 1,
    background: "linear-gradient(to bottom right, #f6a100, #e38e00)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "200px",
    height: "200px",
  },
  rightPane: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    background: "#fff",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    minWidth: "300px",
  },
  logo: {
    color: "#e38e00",
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    border: "1px solid #ddd",
    borderRadius: "5px",
    boxSizing: "border-box",
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  passwordToggle: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#888",
    fontSize: "18px",
  },
  options: {
    fontSize: "14px",
    marginBottom: "20px",
  },
  button: {
    width: "100%",
    backgroundColor: "#e38e00",
    color: "#fff",
    padding: "12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Login;
