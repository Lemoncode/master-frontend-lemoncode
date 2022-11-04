import express from "express";
import cors from "cors";

const app = express();

app.use(
	cors({
		origin: "http://localhost:1234",
		credentials: true,
		exposedHeaders: ["Authorization"],
	})
);

app.use(express.json());

app.post("/login", (req, res) => {
	if (req.body.user === "admin" && req.body.password === "test") {
		return res
			.setHeader("Authorization", "Bearer123456789")
			.send("Login success")
			.sendStatus(200);
	} else {
		return res.status(403).send(req.body);
	}
});

app.post("/bio", (req, res) => {
	if (!req.headers.authorization) {
		return res
			.status(403)
			.send({ message: "Tu petición no tiene cabecera de autorización" });
	}

	if (req.headers.authorization === "Bearer123456789") {
		return res.status(200).send({ message: "Biografía actualizada" });
	}
});

app.get("/private-area", (req, res) => {
	if (!req.headers.authorization) {
		return res
			.status(403)
			.send({ message: "Tu petición no tiene cabecera de autorización" });
	}

	if (req.headers.authorization === "Bearer123456789") {
		return res.status(200).send({
			nombre: "John Doe",
			bio: "Me acaban de robar mis datos personales :-(",
		});
	}
});

app.listen(3000, () => {
	console.log("Server ready at port 3000");
});
