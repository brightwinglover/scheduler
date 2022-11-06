import { getBirthdays } from "./db.ts";
import { sendTextMessage } from "./sendSMS.ts";

export const remindBirthdays = async () => {
  console.log("Initializing birthday reminder...");
  // Poll birthdays
  const birthdays = await getBirthdays();
  for (const bday of birthdays) {
    const date = new Date(bday.Date);
    // Check if any match today
    if (date.toDateString() === new Date().toDateString()) {
      console.log(
        `Sending a happy birthday text to ${bday.Recipient} for ${bday.Holder}`,
      );
      const bdayMessage = `Today is ${bday.Holder}'s birthday!  🎉🦕`;
      const response = await sendTextMessage(bdayMessage, bday.Recipient);
      console.log(response);
    }
  }
};

export const remindJobs = async () => {
  console.log("Initializing jobs reminder...");
  const cmd = ["cmd", "/c", "cargo run"];
  const process = Deno.run({ cmd });
  await process.status();
};
