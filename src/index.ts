import express from "express";
import { Request, Response } from "express";

const app = express();
const PORT = 8080;

//this is what will be sent to clients when they check to see if the server is up
async function handlerReadiness(req: Request, res: Response): Promise<void>{
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send("OK");
}

app.get("/healthz", handlerReadiness);

//serves the index.html etc. from the path given
app.use("/app", express.static("./src/app"));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});