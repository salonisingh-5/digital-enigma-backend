import { useState } from "react";

function Login({ onLogin }) {

  const [username, setUsername] = useState("");

  return (
    <div>
      <h2>Digital Enigma Login</h2>

      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button
        onClick={() => onLogin(username)}
      >
        Login
      </button>
    </div>
  );
}

export default Login;