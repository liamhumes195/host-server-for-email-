import express from "express";
import Nylas from "nylas";

const app = express();

app.use(express.json());

const nylas = new Nylas({
  apiKey: process.env.NYLAS_API_KEY
});

const grantId = process.env.NYLAS_GRANT_ID;


// HOME TEST
app.get("/", (req, res) => {
  res.send("Liam Creeper Club email server is running!");
});


// HEALTH CHECK
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    nylasKeyConfigured: Boolean(process.env.NYLAS_API_KEY),
    grantConfigured: Boolean(grantId)
  });
});


// SEND EMAIL
app.post("/send-email", async (req, res) => {
  const { to, subject, message } = req.body;

  if (!process.env.NYLAS_API_KEY || !grantId) {
    return res.status(500).json({
      success: false,
      error: "Nylas environment variables are not configured"
    });
  }

  if (!to || !subject || !message) {
    return res.status(400).json({
      success: false,
      error: "Missing to, subject, or message"
    });
  }

  try {
    const result = await nylas.messages.send({
      identifier: grantId,
      requestBody: {
        to: [
          {
            email: to
          }
        ],
        subject: subject,
        body: message
      }
    });

    res.json({
      success: true,
      message: "Email sent!",
      data: result.data
    });

  } catch (error) {
    console.error("Nylas error:", error);

    res.status(500).json({
      success: false,
      error: error?.message || "Could not send email"
    });
  }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
