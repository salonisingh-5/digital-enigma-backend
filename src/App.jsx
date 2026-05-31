
import api from "./api/api";
import Login from "./pages/Login";
import { useState, useEffect } from "react";

function App() {

  const [player, setPlayer] = useState(null);
  
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [hint, setHint] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [timeLeft, setTimeLeft] = useState(300);

  const handleLogin = async (username) => {
        await loadLeaderboard();
    try {

      const res = await api.get("/player");

      const user = res.data.find(
        u => u.username === username
      );

      if (user) {

        setPlayer(user);
        const puzzleRes = await api.get(
        `/puzzle?username=${username}`
      );

      setCurrentPuzzle(
      puzzleRes.data.puzzle
      );

      } else {

        alert("User not found");

      }

    } catch (err) {

      console.error(err);

    }

  };
  const submitAnswer = async () => {
    
  try {

    const res = await api.post("/submit", {
      username: player.username,
      answer: answer
    });

    setMessage(res.data.message);
    if (res.data.message === "GAME COMPLETE") {

     setCurrentPuzzle(null);

     setMessage("🎉 Game Complete!");

      return;
    }

    if (res.data.success) {

      const puzzleRes = await api.get(
        `/puzzle?username=${player.username}`
      );

      setCurrentPuzzle(
        puzzleRes.data.puzzle
      );
       setCurrentPuzzle(puzzleRes.data.puzzle);

       setTimeLeft(300);
      setAnswer("");

      setPlayer({
        ...player,
        current_level: player.current_level + 1
      });

    }

  } catch (err) {

    console.error(err);

  }
  

};
const getHint = async () => {

  try {

    const res = await api.get(
      `/hint/${player.username}`
    );

    setHint(res.data.hint);

    setPlayer({
      ...player,
      token_balance: player.token_balance - 10
    });

  } catch (err) {

    console.error(err);

  }

};
const loadLeaderboard = async () => {

  try {

    const res = await api.get(
      "/leaderboard"
    );

    setLeaderboard(
      res.data.leaderboard
    );

  } catch (err) {

    console.error(err);

  }

};
useEffect(() => {

  const timer = setInterval(() => {

    setTimeLeft(prev => {

      if (prev <= 1) {
        clearInterval(timer);
        setMessage("Time Up!");
        return 0;
      }
      setMessage("");
      return prev - 1;

    });

  }, 1000);

  return () => clearInterval(timer);

}, [currentPuzzle]);
useEffect(() => {

  loadLeaderboard();

  const interval = setInterval(() => {

    loadLeaderboard();

  }, 30000);

  return () => clearInterval(interval);

}, []);

  if (!player) {

    return (
      <Login onLogin={handleLogin} />
    );

  }

  return (

    <div>

      <h1>Welcome {player.username}</h1>

      <p>Tokens: {player.token_balance}</p>

      <p>Rank: {player.hacker_rank}</p>

      <p>Current Level: {player.current_level}</p>
      <hr />

      <h2>Current Puzzle</h2>

      {currentPuzzle ? (

      <div>
       <h3>Time Left: {timeLeft}s</h3>
       <h3>{currentPuzzle.question}</h3>
       <input
        type="text"
        placeholder="Enter Answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <button onClick={submitAnswer} disabled={timeLeft === 0}>
         Submit
         
        </button>

        <p>{message}</p>
        <button onClick={getHint} disabled={player.token_balance < 10}>
           Get Hint (-10 Tokens)
        </button>

        <p>{hint}</p> 

      </div>
      ) : (

  <h2>🎉 All puzzles completed!</h2>


    )}
      <h2>Leaderboard</h2>
    {leaderboard.map((player, index) => (
    <div key={player.username}>
    {index + 1}. {player.username} - Rank: {player.hacker_rank}
    </div>
    ))}
    
    </div>

  );

}

export default App;