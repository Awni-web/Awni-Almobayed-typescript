import express from "express";
import dotenv from "dotenv";
import imageRoutes from "./routes/imageRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/images", imageRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost${PORT}`);
});

export default app;