import express from "express";
import Nylas from "nylas";

const app = express();

app.use(express.json());

const nylas = new Nylas({
  apiKey: process.env.NYLAS_API_KEY
});

// Put your connected Nylas grant ID in Railway variables
const grantId = process.env.NYLAS_GRANT_ID;


// TEST PAGE
app.get("/", (req, res) => {
  res.send("Liam Creeper Club email server is running!");
});


// SEND EMAIL
app.post("/send-email", async (req, res) => {
  const { to, subject, message } = req.body;

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
      error: "Could not send email"
    });
  }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
