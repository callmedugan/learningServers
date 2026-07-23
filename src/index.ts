import express, { NextFunction } from "express";
import { Request, Response } from "express";
import { config } from "./config.js";

const app = express();
const PORT = 8080;

//middleware//////////////////////////////////////////////////////////////////////////

async function middlewareLogResponses(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	res.on("finish", () => {
		const code = res.statusCode;
		if (code < 200 || code >= 400) {
			console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${code}`);
		}
	});
	//run next middleware
	next();
}

async function middlewareMetricsInc(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	config.fileserverHits++;
	next();
}

//handlers////////////////////////////////////////////////////////////////////////////

//this is what will be sent to clients when they check to see if the server is up
async function handlerReadiness(req: Request, res: Response) {
	res.set("Content-Type", "text/plain; charset=utf-8");
	res.send("OK");
}

async function handlerWriteRequestCount(req: Request, res: Response) {
	res.set("Content-Type", "text/html; charset=utf-8");
	const count: number = config.fileserverHits;
	res.send(
		`<html>
            <body>
                <h1>Welcome, Chirpy Admin</h1>
                <p>Chirpy has been visited ${count} times!</p>
            </body>
        </html>`,
	);
	res.status(200);
}

async function handlerResetRequestCount(req: Request, res: Response) {
	res.set("Content-Type", "text/plain; charset=utf-8");
	config.fileserverHits = 0;
	res.send("Hits: " + 0 + "\n");
	res.status(200);
}

//handler to validate that a chirp is 140 chars or less
async function handlerValidateChirp(req: Request, res: Response) {
	//define shape
	type Shape = {
		body: string;
	};

	//get parsed body
	const body: Shape = req.body;

	//handle the parsed data
	if (body?.body.length > 140) {
		throw new BadRequestError("Chirp is too long. Max length is 140");
	} else {
		res.status(200).send({
			cleanedBody: getCleanedChirp(body.body),
		});
	}
}

async function errorHandler(
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
) {
	console.log(err.message);
	//default to 500
	let status = 500;
	let message = "Something went wrong on our end";
	if (err instanceof BadRequestError) {
		status = 400;
		message = err.message;
	} else if (err instanceof UnauthorizedError) {
		status = 401;
		message = err.message;
	} else if (err instanceof ForbiddenError) {
		status = 403;
		message = err.message;
	} else if (err instanceof NotFoundError) {
		status = 404;
		message = err.message;
	}
	res.status(status).json({
		error: message,
	});
}

//other////////////////////////////////////////////////////////////////////////////////

//400
class BadRequestError extends Error {
	constructor(message: string) {
		super(message);
	}
}

//401
class UnauthorizedError extends Error {
	constructor(message: string) {
		super(message);
	}
}

//403
class ForbiddenError extends Error {
	constructor(message: string) {
		super(message);
	}
}

//404
class NotFoundError extends Error {
	constructor(message: string) {
		super(message);
	}
}

//helper to filter out words in a Chirp
function getCleanedChirp(input: string): string {
	const split = input.split(" ");
	for (let i = 0; i < split.length; i++) {
		switch (split[i].toLowerCase()) {
			case "kerfuffle":
			case "sharbert":
			case "fornax":
				split[i] = "****";
				break;
			default:
				break;
		}
	}
	return split.join(" ");
}

//main////////////////////////////////////////////////////////////////////////////////

async function main() {
	//json
	app.use(express.json());

	//set middleware
	app.use(middlewareLogResponses);
	app.use("/app", middlewareMetricsInc);

	//admin
	app.use("/admin/metrics", handlerWriteRequestCount);
	app.post("/admin/reset", handlerResetRequestCount);

	//api
	app.get("/api/healthz", handlerReadiness);
	app.post("/api/validate_chirp", handlerValidateChirp);

	//serves the index.html etc. from the path given
	app.use("/app", express.static("./src/app"));

	//error handlers go last
	app.use(errorHandler);

	//listen on 8080
	app.listen(PORT, () => {
		console.log(`Server is running at http://localhost:${PORT}`);
	});
}

await main();
