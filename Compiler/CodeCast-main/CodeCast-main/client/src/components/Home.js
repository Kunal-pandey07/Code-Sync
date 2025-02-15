import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const generateRoomId = (e) => {
    e.preventDefault();
    const Id = uuid();
    setRoomId(Id);
    toast.success("New Room ID generated");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Both Room ID and Username are required!");
      return;
    }

    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
    toast.success("Joined room successfully");
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.leftPanel}>
        <img
          src="/images/new.png"
          alt="App Logo"
          style={styles.logo}
        />
        
        <p style={styles.subtitle}>Collaborative Code Editing in Real Time</p>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.formBox}>
          <h2 style={styles.formTitle}>Join a Room</h2>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={handleInputEnter}
            placeholder="Enter Room ID"
            style={styles.input}
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyUp={handleInputEnter}
            placeholder="Enter Username"
            style={styles.input}
          />
          <button onClick={joinRoom} style={styles.joinButton}>
            Join Room
          </button>
          <p style={styles.newRoomText}>
            Need a room?{" "}
            <span onClick={generateRoomId} style={styles.link}>
              Create New
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#121212",
    color: "#fff",
    fontFamily: "Segoe UI, sans-serif",
  },
  leftPanel: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  logo: {
    maxWidth: "200px",
    marginBottom: "1.5rem",
  },

  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#bbb",
  },
  rightPanel: {
    flex: 1,
    backgroundColor: "#181818",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  formBox: {
    width: "80%",
    maxWidth: "400px",
    backgroundColor: "#222",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 0 20px rgba(0,0,0,0.3)",
  },
  formTitle: {
    marginBottom: "1.5rem",
    fontSize: "1.5rem",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "0.75rem 1rem",
    marginBottom: "1rem",
    borderRadius: "5px",
    border: "none",
    fontSize: "1rem",
  },
  joinButton: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    fontSize: "1rem",
    borderRadius: "5px",
    cursor: "pointer",
  },
  newRoomText: {
    marginTop: "1rem",
    textAlign: "center",
    fontSize: "0.9rem",
  },
  link: {
    color: "#00e676",
    textDecoration: "underline",
    cursor: "pointer",
  },
};

export default Home;
