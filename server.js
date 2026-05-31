require("dotenv").config();
const aiRoutes = require("./routes/ai");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log("REQUEST HIT:", req.url);
    next();
});
app.use("/api", aiRoutes);
app.get("/", async (req, res) => {

    try {

        const result = await pool.query("SELECT NOW()");

        res.json({
            message: "Backend running",
            time: result.rows[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Database connection failed"
        });

    }

});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
