import Bot from "./lib/bot.js";
import getPostText from "./lib/getPostText.js";

const postText = getPostText

if (postText.length > 0) {
    const text = await Bot.run(getPostText, { dryRun: true });
    console.log(`[${new Date().toISOString()}] Posted: "${text}"`);
} else {
    console.log(`No post`)
}

