import express, { NextFunction } from "express";
import { Request, Response } from "express";
import {config} from "./config.js"

const app = express();
const PORT = 8080;

//middleware//////////////////////////////////////////////////////////////////////////

async function middlewareLogResponses(req: Request, res: Response, next: NextFunction){
    res.on("finish", () => {
        const code = res.statusCode;
        if(code < 200 || code >= 400){
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${code}`)
        }
    })
    //run next middleware
    next();
}

async function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
    config.fileserverHits++;
    next();
}

//handlers////////////////////////////////////////////////////////////////////////////

//this is what will be sent to clients when they check to see if the server is up
async function handlerReadiness(req: Request, res: Response){
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send("OK");
}

async function handlerWriteRequestCount(req: Request, res: Response){
    res.set("Content-Type", "text/html; charset=utf-8");
    const count:number = config.fileserverHits;
    res.send(
        `<html>
            <body>
                <h1>Welcome, Chirpy Admin</h1>
                <p>Chirpy has been visited ${count} times!</p>
            </body>
        </html>`
    );
    res.status(200);
}

async function handlerResetRequestCount(req: Request, res: Response){
    res.set("Content-Type", "text/plain; charset=utf-8");
    config.fileserverHits = 0;
    res.send("Hits: " + 0);
    res.status(200);
}

//main////////////////////////////////////////////////////////////////////////////////

async function main() {
    //set middleware
    app.use(middlewareLogResponses);
    app.use("/app", middlewareMetricsInc)
    
    //admin
    app.use("/admin/metrics", handlerWriteRequestCount);
    app.use("/admin/reset", handlerResetRequestCount)

    //for readiness
    app.get("/api/healthz", handlerReadiness);

    //serves the index.html etc. from the path given
    app.use("/app", express.static("./src/app"));

    //listen on 8080
    app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    });
}

await main();