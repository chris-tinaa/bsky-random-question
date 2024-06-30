import Bot from "./lib/bot.js";
import { getSheetData } from "./lib/sheet.js";

Bot.run(getSheetData, { dryRun: false });
