import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import { getBirthdays } from "../db.ts";

export const checkBirthdays = async (
  { request, response }: RouterContext<any, any>,
) => {
  // Poll birthdays
  const birthdays = await getBirthdays();
  console.log(birthdays);
  const notifications: string[] = [];
  for (const bday of birthdays) {
    const date = new Date(bday.Date);
    // Check if any match today
    if (date.toDateString() === new Date().toDateString()) {
      notifications.push(`Today is ${bday.Holder}'s birthday!  🎉🦕`);
    }
  }
  response.body = notifications.join("\n") || "No birthdays today.";
};

// const bdayMessage = `Today is ${bday.Holder}'s birthday!  🎉🦕`;
// `Sending a happy birthday text to ${bday.Recipient} for ${bday.Holder}`,
// const response = await sendTextMessage(bdayMessage, bday.Recipient);
// console.log(response);
