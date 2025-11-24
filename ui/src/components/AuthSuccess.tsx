import { useEffect, useState } from "react";
import axios from "axios";

export function AuthSuccess() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) return;

    // Save token
    localStorage.setItem("github_token", token);

    // Fetch user details
    axios
      .get(`${import.meta.env.VITE_SERVICE_API_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>GitHub Login Successful 🎉</h2>

      {user ? (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Username:</strong> {user.login}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <img
            src={user.avatar_url}
            width={120}
            style={{ borderRadius: "50%" }}
            alt=""
          />
        </>
      ) : (
        <p>Loading user...</p>
      )}
    </div>
  );
}
