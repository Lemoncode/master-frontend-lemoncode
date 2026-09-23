import { Router } from "express";
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import { getDB } from "../db";

const router = Router();

const rpID = "localhost";
const origin = "http://localhost:5173";

// POST /api/login/start
router.post("/start", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: "El email es obligatorio" });
    return;
  }

  const db = getDB();
  const users = db.collection("users");

  const user = await users.findOne({ email });
  if (!user || !user.credentials?.length) {
    res.status(404).json({ error: "No hay cuenta registrada con ese email" });
    return;
  }

  // Genera las opciones de autenticación WebAuthn para el usuario,
  // limitando el login a sus credenciales registradas y solicitando
  // verificación del usuario si está disponible.
  const options = await generateAuthenticationOptions({
    rpID,
    // Mandamos todas las opciones de credenciales que tiene el usuario
    // imaginate que no la tiene en el portatil personal pero si tiene el móvil a mano
    // o yubikey
    allowCredentials: user.credentials.map((cred: any) => ({
      id: cred.credentialID,
      ...(cred.transports?.length > 0 && { transports: cred.transports }),
    })),
    userVerification: "preferred",
  });

  await users.updateOne(
    { email },
    { $set: { currentChallenge: options.challenge } },
  );

  res.json(options);
});

// POST /api/login/finish
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
    res.status(400).json({ error: "No hay login en curso para este email" });
    return;
  }

  // Buscamos la credencial que se está intentando usar para autenticar, debe ser una de las que el usuario tiene registradas
  const storedCred = user.credentials.find(
    (c: any) => c.credentialID === credential.id,
  );

  if (!storedCred) {
    res.status(400).json({ error: "Credencial no reconocida" });
    return;
  }

  try {
    // Verificamos challenge, origen, rpID y la firma criptográfica
    // usando la clave pública almacenada para esa credencial
    const verification = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge: user.currentChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id: storedCred.credentialID,
        publicKey: Buffer.from(storedCred.publicKey, "base64url"),
        counter: storedCred.counter,
        transports: storedCred.transports,
      },
    });

    if (!verification.verified) {
      res.status(400).json({ error: "Verificación fallida" });
      return;
    }

    // Actualizamos el contador de la credencial para prevenir ataques de reproducción
    // pero esto no es muy fiable (multidispositivo, uso de la misma credencial en varios navegadores, etc)
    // así que no es obligatorio
    await users.updateOne(
      { email, "credentials.credentialID": storedCred.credentialID },
      {
        $set: {
          "credentials.$.counter": verification.authenticationInfo.newCounter,
        },
        $unset: { currentChallenge: "" },
      },
    );

    res.json({ verified: true, email });
  } catch (err) {
    console.error("Error verificando login:", err);
    res.status(400).json({
      error: err instanceof Error ? err.message : "Error de verificación",
    });
  }
});

export default router;
