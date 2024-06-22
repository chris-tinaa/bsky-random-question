import Bot from "./lib/bot.js";
import getPostText from "./lib/getPostText.js";

const postText = await getPostText()

if (postText.length > 0) {
    const text = await Bot.run(getPostText, { dryRun: false });
    console.log(`[${new Date().toISOString()}] "${text}"`);
} else {
    console.log(`No post`)
}

