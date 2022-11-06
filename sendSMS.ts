import { base64 } from "https://deno.land/x/oak@v11.1.0/deps.ts";

// Credentials set-up
const accountSid: string | undefined = Deno.env.get("TWILIO_ACCOUNT_SID");
const authToken: string | undefined = Deno.env.get("TWILIO_AUTH_TOKEN");
// console.log(accountSid, authToken);
// console.log(Deno.env.toObject());
if (!accountSid || !authToken) {
  console.error("No Twilio credentials found.");
  Deno.exit(1);
}

// Build fetch
const url: string =
  `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
const encodedCredentials: string = base64.encode(`${accountSid}:${authToken}`);
export async function sendTextMessage(
  message: string,
  recipient: string,
): Promise<any> {
  const body: URLSearchParams = new URLSearchParams({
    To: recipient,
    From: "+17622145785",
    Body: message,
  });
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${encodedCredentials}`,
    },
    body,
  });
  console.log(response);
  return response.json();
}
