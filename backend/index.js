import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const NoteSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", NoteSchema);

const mongoUri = process.env.MONGO_URI;

const connectWithRetry = () => {
  console.log("⏳ Waiting for MongoDB...");
  mongoose
    .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("✅ MongoDB is ready");
      // process.exit(0);
    })
    .catch(() => {
      setTimeout(connectWithRetry, 2000);
    });
};

connectWithRetry();

app.get("/api/notes", async (req, res) => {
  // const newNote = await Note.create({ title:"ssssss", content:"sssssssss" });
  const notes = await Note.find();
  res.json(notes);
});

// Keep track of connection state
let isDbConnected = false;

mongoose.connection.on("connected", () => {
  isDbConnected = true;
});
mongoose.connection.on("disconnected", () => {
  isDbConnected = false;
});

app.get("/health", (req, res) => {
  if (isDbConnected) {
    res.status(200).json({ status: "health is wealth..." });
  } else {
    res.status(503).json({ status: "db disconnected" });
  }
});

app.post("/api/notes", async (req, res) => {
  const { title, content } = req.body;
  const newNote = await Note.create({ title, content });
  res.status(201).json(newNote);
});

const PORT = 7000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
