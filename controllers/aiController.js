

const pool = require("../config/db");

const getPlayer = async (req, res) => {

    console.log("Controller reached");

    try {

        const result = await pool.query("SELECT * FROM users");

        console.log("DB RESULT:", result.rows);

        res.json(result.rows);

    } catch (err) {

        console.error("DB ERROR:", err);

        res.status(500).json({
            error: "Database failed"
        });

    }

};



const useTokens = async (req, res) => {

    try {

        const username = req.params.username;
        const cost = 10;

        const result = await pool.query(
            "SELECT token_balance FROM users WHERE username = $1",
            [username]
        );
        if (result.rows.length === 0) {
          return res.json({
          success: false,
          message: "User not found"
       });
        }

        const tokens = result.rows[0].token_balance;

        if (tokens < cost) {
            return res.json({
                success: false,
                message: "Not enough tokens"
            });
        }

       
        res.json({
            success: true,
            message: "Tokens deducted"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Token system failed"
        });
    }
};
const getHint = async (req, res) => {

    try {

        const username = req.params.username;
        const cost = 10;

        // 1. Check tokens
        const user = await pool.query(
            "SELECT token_balance FROM users WHERE username = $1",
            [username]
        );

        if (user.rows.length === 0) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        const tokens = user.rows[0].token_balance;

        if (tokens < cost) {
            return res.json({
                success: false,
                message: "Not enough tokens"
            });
        }

        // 2. Deduct tokens
        await pool.query(
            "UPDATE users SET token_balance = token_balance - $1 WHERE username = $2",
            [cost, username]
        );

        // 3. RETURN DUMMY HINT (for now)
        // 3. Call AI
       const hint = "Think about breaking the problem into smaller steps."; 


    // 4. Send response
    res.json({
      success: true,
      hint: hint
    });

    } 
     catch (err) {
    console.error("FULL ERROR:", err);

    res.status(500).json({
        error: err.message
    });
  }

};
const getLeaderboard = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT username, hacker_rank FROM users ORDER BY hacker_rank DESC LIMIT 10"
    );

    res.json({
      success: true,
      leaderboard: result.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Leaderboard failed"
    });
  }
};
const updateRank = async (req, res) => {
  try {
    const username = req.params.username;
    const points = 50; // reward per solve

    const result = await pool.query(
      "UPDATE users SET hacker_rank = hacker_rank + $1 WHERE username = $2 RETURNING *",
      [points, username]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Rank update failed"
    });
  }
};
const getPuzzle = async (req, res) => {
    try {
    const username = req.query.username;
    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Missing username"
      });
    }


    const user = await pool.query(
      "SELECT current_level FROM users WHERE username = $1",
      [username]
    );
     if (user.rows.length === 0) {
          return res.json({
          success: false,
          message: "User not found"
        });
   }
     const level = user.rows[0].current_level;

    const result = await pool.query(
  "SELECT * FROM puzzles WHERE id = $1",
  [level]
);

if (result.rows.length === 0) {
  return res.json({
    success: false,
    message: "No puzzle found"
  });
}

const puzzle = result.rows[0];

    if (!puzzle) {
      return res.json({
        success: false,
        message: "No more puzzles"
      });
    }
    console.log("USERNAME:", username);
    console.log("LEVEL FROM DB:", level);
  const { answer, ...safePuzzle } = puzzle;
  res.json({
    success: true,
    puzzle: safePuzzle
  });
} catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch puzzle"
    });
  }
 
};

const submitAnswer = async (req, res) => {
    try {
      const { answer, username } = req.body;
            if (!answer || answer.trim() === "") {
               return res.json({
               success: false,
               message: "Answer required"
            });
        }

    const user = await pool.query(
      "SELECT current_level FROM users WHERE username = $1",
      [username]
    );
    
    const level = user.rows[0].current_level;

    const result = await pool.query(
      "SELECT * FROM puzzles WHERE id = $1",
      [level]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: false,
        message: "No puzzle found"
      });
    }

    const puzzle = result.rows[0];

    if (!puzzle) {
      return res.json({
        success: true,
        message: "GAME COMPLETE"
      });
    }
    

    if (answer === puzzle.answer) {

      // 🔥 UPDATE RANK HERE
      await pool.query(
        "UPDATE users SET hacker_rank = hacker_rank + 50 WHERE username = $1",
        [username]
      );
      await pool.query(
        "UPDATE users SET current_level = current_level + 1 WHERE username = $1",
        [username]
      );
    }
    
    if (answer === puzzle.answer) {
      return res.json({
        success: true,
        message: "Correct answer!"
      });
    } else {
      return res.json({
        success: false,
        message: "Wrong answer"
      });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Submission failed"
    });
  }
};

// EXPORT BOTH
module.exports = {
    getPlayer,
    useTokens,
    getHint,
    getLeaderboard,
    updateRank,
    getPuzzle,
    submitAnswer
};

