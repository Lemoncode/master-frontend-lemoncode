# 06 Azure site container

In this example we are going to upload the Github Action to deploy the Docker container as a site container in Azure.

We will start from `04-auto-azure-deploy`.

# Steps to build it

`npm install` to install previous sample packages:

```bash
npm install
```

Create new repository and upload files:

![01-create-repo](./readme-resources/01-create-repo.png)

```bash
git init
git remote add origin git@github.com...
git add .
git commit -m "initial commit"
git push -u origin main

```

[Configure sidecars container in Azure](https://learn.microsoft.com/en-us/azure/app-service/configure-sidecar) allow us to deploy multiple containers in the same app instance. This is useful to deploy a main container with our app (it will be the only one receiving external traffic) and a sidecar container with a monitoring tool, for example.

Update the Github Action to deploy with the new configuration:

_./.github/workflows/cd.yml_

```diff
name: CD Workflow

on:
  push:
    branches:
      - main

env:
  IMAGE_NAME: ghcr.io/${{github.repository}}:${{github.run_number}}-${{github.run_attempt}}

permissions:
  contents: 'read'
  packages: 'write'

jobs:
  cd:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v6

      - name: Log in to GitHub container registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push docker image
        run: |
          docker build -t ${{env.IMAGE_NAME}} .
          docker push ${{env.IMAGE_NAME}}

      - name: Deploy to Azure
        uses: azure/webapps-deploy@v3
        with:
          app-name: ${{ secrets.AZURE_APP_NAME }}
          publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
-         images: ${{env.IMAGE_NAME}}
+         sitecontainers-config: >-
+           [
+           {
+               "name": "main",
+               "image": "${{env.IMAGE_NAME}}",
+               "targetPort": 8080,
+               "isMain": true,
+               "userName": "${{ github.actor }}",
+               "passwordSecret": "${{ secrets.GITHUB_TOKEN }}"
+             }
+           ]

```

> [Example of site container configuration in Github Action](https://github.com/Azure/actions-workflow-samples/blob/master/AppService/sitecontainers-webapp-on-azure.yml)

As we see it fails because is not supported the publish-profile: `Deployment Failed, Error: publish-profile is not supported for Site Containers scenario`. We need to use a [managed identity](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview) to deploy the site container.

![Creating managed identity](./readme-resources/01-creating-managed-identity.png)

Fill the details of the managed identity:

![Filling managed identity details](./readme-resources/02-filling-managed-identity-details.png)

Once created, we need to configure the federated credential to allow Github Action to use it:

![Clicks on add federated credential](./readme-resources/03-clicks-on-add-federated-credential.png)

![Creating federated credential part 1](./readme-resources/04-creating-federated-credential-part-1.png)

![Creating federated credential part 2](./readme-resources/05-creating-federated-credential-part-2.png)

Using the user assigned managed identity in the Web App:

![Adding new role assigment](./readme-resources/06-adding-role-assigment.png)

Assign role `Contributor` to the managed identity:

![Assigning contributor role to the managed identity](./readme-resources/07-assign-role.png)

Assign the user assigned managed identity as member:

![Adding user assigned managed identity as member](./readme-resources/08-assign-member.png)

Disable basic authentication in the Web App:

![Disabling basic authentication](./readme-resources/09-disabling-basic-auth.png)

And finally, we can remove the environment variables related to basic authentication in the Github Action:

![Removing basic authentication environment variables](./readme-resources/10-remove-env-variables.png)

Finally, we need to update the Github Action to use the user assigned managed identity:

_./.github/workflows/cd.yml_

```diff
name: CD Workflow

on:
  push:
    branches:
      - main

env:
  IMAGE_NAME: ghcr.io/${{github.repository}}:${{github.run_number}}-${{github.run_attempt}}

permissions:
  contents: 'read'
  packages: 'write'
+ id-token: 'write'

jobs:
  cd:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v6

      - name: Log in to GitHub container registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push docker image
        run: |
          docker build -t ${{env.IMAGE_NAME}} .
          docker push ${{env.IMAGE_NAME}}

+     # Docs: https://github.com/marketplace/actions/azure-login#input-parameters
+     - name: Login Azure
+       uses: azure/login@v2
+       with:
+         client-id: ${{ secrets.AZURE_CLIENT_ID }}
+         tenant-id: ${{ secrets.AZURE_TENANT_ID }}
+         subscription-id: ${{ secrets.AZURE_SUBSCRIPTION_ID }}

      - name: Deploy to Azure
        uses: azure/webapps-deploy@v3
        with:
          app-name: ${{ secrets.AZURE_APP_NAME }}
-         publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
          sitecontainers-config: >-
            [
            {
                "name": "main",
                "image": "${{env.IMAGE_NAME}}",
                "targetPort": 8080,
                "isMain": true,
                "userName": "${{ github.actor }}",
                "passwordSecret": "${{ secrets.GITHUB_TOKEN }}"
              }
            ]

```

> `id-token: 'write'` is required to allow the Github Action to request an OIDC token to authenticate with Azure using the federated credential.

Adding `Client ID`:

![Copying client id](./readme-resources/11-copying-client-id.png)

![Setting client id](./readme-resources/12-setting-client-id-as-secret.png)

Clicks on Microsoft Entra ID to get the `Tenant ID`:

![Clicks on Microsoft Entra ID](./readme-resources/13-clicks-on-microsoft-entra-id.png)

Adding `Tenant ID`:

![Copying tenant id](./readme-resources/14-copying-tenant-id.png)

![Setting tenant id](./readme-resources/15-setting-tenant-id-as-secret.png)

Adding `Subscription ID`:

![Clicks on Subscriptions](./readme-resources/16-clicks-on-subscriptions.png)

![Copying subscription id](./readme-resources/17-copying-subscription-id.png)

![Setting subscription id](./readme-resources/18-setting-subscription-id-as-secret.png)

Now we can remove the publish profile from the secrets as well:

![Removing publish profile secret](./readme-resources/19-removing-azure-publish-profile.png)

Upload changes:

```bash
git add .
git commit -m "update github workflow"
git push

```

# About Basefactor + Lemoncode

We are an innovating team of Javascript experts, passionate about turning your ideas into robust products.

[Basefactor, consultancy by Lemoncode](http://www.basefactor.com) provides consultancy and coaching services.

[Lemoncode](http://lemoncode.net/services/en/#en-home) provides training services.

For the LATAM/Spanish audience we are running an Online Front End Master degree, more info: http://lemoncode.net/master-frontend
