import { Router } from "https://deno.land/x/oak/mod.ts";
import { greet } from "./controllers/front.ts";
import { checkBirthdays } from "./controllers/birthday.ts";

const router = new Router();
router
  .get("/", greet);
router
  .get("/checkBirthdays", checkBirthdays);
export default router;
