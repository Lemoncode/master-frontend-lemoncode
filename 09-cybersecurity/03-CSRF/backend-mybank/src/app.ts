import express from "express";
import path from "path";
import { createRestApiServer } from "core/servers";
import { envConstants } from "core/constants";
import { accountsApi } from "pods/account-list";
import { movementsApi } from "pods/movement-list";
import { userApi } from "pods/user";
import { securityApi, authenticationMiddleware } from "pods/security";

const restApiServer = createRestApiServer();

const staticFilesPath = path.resolve(__dirname, envConstants.STATIC_FILES_PATH);
restApiServer.use("/", express.static(staticFilesPath));

restApiServer.use("/api/security", securityApi);
restApiServer.use("/api/user", authenticationMiddleware, userApi);
restApiServer.use("/api/accounts", authenticationMiddleware, accountsApi);
restApiServer.use("/api/movements", authenticationMiddleware, movementsApi);

restApiServer.listen(envConstants.PORT, () => {
  console.log(`Server ready at port ${envConstants.PORT}`);
});
