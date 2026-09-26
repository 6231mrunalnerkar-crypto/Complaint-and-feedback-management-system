const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

/* ======================================================
   CORS
====================================================== */

app.use(
  cors({
    origin: process.env.CLIENT_URL
      ? process.env.CLIENT_URL
          .split(",")
          .map((item) => item.trim())
      : true,
    credentials: true,
  })
);

/* ======================================================
   BODY PARSERS
====================================================== */

app.use(express.json({ limit: "2mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "2mb",
  })
);

/* ======================================================
   BACKEND HOME / STATUS
====================================================== */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CampusVoice backend is running successfully.",
  });
});

/* ======================================================
   API HEALTH CHECK
====================================================== */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CampusVoice API is running",
    timestamp: new Date().toISOString(),
  });
});

/* ======================================================
   UPLOADS
====================================================== */

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* ======================================================
   API ROUTES
====================================================== */

app.use("/api/auth", authRoutes);

app.use("/api/complaints", complaintRoutes);

app.use("/api/feedback", feedbackRoutes);

app.use("/api/users", userRoutes);

/* ======================================================
   ERROR HANDLING
====================================================== */

app.use(notFound);

app.use(errorHandler);

/* ======================================================
   SERVER
====================================================== */

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `CampusVoice API running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error.message
    );

    process.exit(1);
  }
}

startServer();