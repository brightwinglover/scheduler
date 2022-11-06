// Initialize .env variables
import { config } from "https://deno.land/std@0.162.0/dotenv/mod.ts";
console.log(await config());
// import setUpEnv from "./env.ts";
// setUpEnv;
import { Application } from "https://deno.land/x/oak/mod.ts";
import router from "./routes.ts";
import { remindBirthdays, remindJobs } from "./remind.ts";

// Queue daily tasks
remindBirthdays();
setInterval(() => {
  remindBirthdays();
}, 1000 * 60 * 60 * 24);

// Queue hourly tasks
remindJobs();
setInterval(() => {
  remindJobs();
}, 1000 * 60 * 60);

const port = 8000;
const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", () => {
  console.log(`Listening on http://localhost:${port}`);
});

await app.listen({ port });
