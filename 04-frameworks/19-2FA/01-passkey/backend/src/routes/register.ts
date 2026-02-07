import { Router } from "express";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { getDB } from "../db";

const router = Router();

const rpName = "Passkey Demo";
const rpID = "localhost";
const origin = "http://localhost:5173";

// POST /api/register/start
router.post("/start", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: "El email es obligatorio" });
    return;
  }

  const db = getDB();
  const users = db.collection("users");

  const existingUser = await users.findOne({ email });
  if (existingUser && existingUser.credentials?.length > 0) {
    res.status(409).json({ error: "El email ya está registrado" });
    return;
  }

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userName: email,
    attestationType: "none",
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "preferred",
    },
    hints: ["client-device", "hybrid"],
  });

  await users.updateOne(
    { email },
    { $set: { email, currentChallenge: options.challenge } },
    { upsert: true }
  );

  res.json(options);
});

// POST /api/register/finish
router.post("/finish", async (req, res) => {
  const { email, credential } = req.body;

  if (!email || !credential) {
    res.status(400).json({ error: "Email y credential son obligatorios" });
    return;
  }

  const db = getDB();
  const users = db.collection("users");

  const user = await users.findOne({ email });
  if (!user || !user.currentChallenge) {
    res.status(400).json({ error: "No hay registro en curso para este email" });
    return;
  }

  try {
    const verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: user.currentChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    });

    if (!verification.verified || !verification.registrationInfo) {
      res.status(400).json({ error: "Verificación fallida" });
      return;
    }

    const { credential: cred, credentialDeviceType, credentialBackedUp } =
      verification.registrationInfo;

    await users.updateOne(
      { email },
      {
        $push: {
          credentials: {
            credentialID: cred.id,
            publicKey: Buffer.from(cred.publicKey).toString("base64url"),
            counter: cred.counter,
            transports: credential.response.transports ?? cred.transports ?? [],
            deviceType: credentialDeviceType,
            backedUp: credentialBackedUp,
          },
        } as any,
        $unset: { currentChallenge: "" },
      }
    );

    res.json({ verified: true });
  } catch (err) {
    console.error("Error verificando registro:", err);
    res.status(400).json({
      error: err instanceof Error ? err.message : "Error de verificación",
    });
  }
});

export default router;
