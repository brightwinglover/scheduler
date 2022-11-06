import { RouterContext } from "https://deno.land/x/oak/mod.ts";

export const greet = ({ request, response }: RouterContext<any, any>) => {
  response.body = "Hello from Deno! 🦕";
};
