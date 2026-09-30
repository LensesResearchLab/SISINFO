import { ConfidentialClientApplication } from "@azure/msal-node";

export const microsoftRedirectUri =
  process.env.MICROSOFT_REDIRECT_URI ?? "http://localhost:3000/auth/microsoft/callback";

export function getMicrosoftClient() {
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const tenantId = process.env.MICROSOFT_TENANT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
  if (!clientId || !tenantId || !clientSecret) {
    throw new Error("Faltan MICROSOFT_CLIENT_ID, MICROSOFT_TENANT_ID o MICROSOFT_CLIENT_SECRET");
  }
  return new ConfidentialClientApplication({
    auth: {
      clientId,
      clientSecret,
      authority: `https://login.microsoftonline.com/${tenantId}`,
    },
  });
}
