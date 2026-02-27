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
    rpName, // Nombre de la aplicación
    rpID, // Identidad criptográfica del servidor (localhost, o midominio.com, debe de coincidir con el origin)
    userName: email, // El email se usa como nombre de usuario en este ejemplo, pero podría ser cualquier identificador único
    attestationType: "none", // No pideos información del hardware autenticador (módelo, fabricante, certificado), para un software de banca podría estar bien: real
    authenticatorSelection: {
      residentKey: "preferred", // Resident key es que puedes crear cuenta sin correo, esto es una movida, más seguridad, pero si pierdes el dispositivo pierdes la cuenta, por eso lo dejamos como "preferred" para que no sea obligatorio
      userVerification: "preferred", // Pideo biometría/PIN si está disponible, se puede forzar con "required"
    },
    hints: ["client-device", "hybrid"], // Se puede usar el passkey en el mismo dispositivo (ej: laptop con lector de huellas) o en otro (ej: teléfono con FaceID), si el autenticador lo soporta se le dará preferencia al passkey del mismo dispositivo
  });

  await users.updateOne(
    { email },
    { $set: { email, currentChallenge: options.challenge } },
    { upsert: true },
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

    const {
      credential: cred,
      credentialDeviceType,
      credentialBackedUp,
    } = verification.registrationInfo;

    // Con updateOne seleccionamos el usuario por su email.
    // Con $push añadimos una nueva credencial al array `credentials`:
    //. - Aquí tenemos CredentialID (lo genera el autenticado), identifica a al credencial de forma única, es un string base64url.
    //. - PublicKey (lo genera el autenticador), es la clave pública que se usará para verificar los inicios de sesión, es un string base64url.
    //. - Counter (signCount)(*)): número que el autenticador devuelve en cada login; normalmente aumenta.
    //   El servidor guarda el último valor y lo compara con el nuevo para detectar posible clonado de la credencial.
    //   (No es el anti-replay principal; el anti-replay real es el challenge único de cada autenticación.)
    //
    //. (*) no todos los autenticadores lo soportan bien, algunos devuelven siempre 0 (o no incrementan), especialmente en passkeys “multi-device/sync”.
    // Ejemplo mac + iPhone con iCloud Keychain, el contador no se incrementa porque Apple lo gestiona de forma diferente, pero sigue siendo seguro porque el challenge es único en cada autenticación.
    await users.updateOne(
      { email },
      {
        $push: {
          credentials: {
            credentialID: cred.id,
            publicKey: Buffer.from(cred.publicKey).toString("base64url"),
            counter: cred.counter,
            // Si es "internal" autenticado integrado (touch Id, face ID...),
            // "usb" llave física, "NFC", "BLE" bluetooth, "hybrid" otro dispostivo vía QR...
            transports: credential.response.transports ?? cred.transports ?? [],
            // Single Device (ejemplo llave usb), o Multi Device (ejemplo passkey en iPhone que se puede usar desde el Mac), esto es información que el autenticador devuelve, no es 100% fiable pero puede ser útil para mostrar iconos o información al usuario sobre la credencial registrada.
            deviceType: credentialDeviceType,
            // Si tiene un backup de la credencial en la nube, esto es información que el autenticador devuelve, no es 100% fiable pero puede ser útil para mostrar iconos o información al usuario sobre la credencial registrada.
            backedUp: credentialBackedUp,
          },
        } as any,
        $unset: { currentChallenge: "" },
      },
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
