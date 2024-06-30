import Bot from "./lib/bot.js";
import getPostText from "./lib/getPostText.js";

const randomquestion = await getPostText()
if (randomquestion.length > 0) {
    const text = await Bot.run(getPostText, { dryRun: false });
    console.log(`[Random Question] [${new Date().toISOString()}] "${text}"`);
} else {
    console.log(`No post`)
}

