import { BskyAgent } from '@atproto/api';
import * as dotenv from 'dotenv';
import { CronJob } from 'cron';
import * as process from 'process';

dotenv.config();

// Create a Bluesky Agent 
const agent = new BskyAgent({
    service: 'https://bsky.social',
  })

let lastPostUri: { uri: string, cid: string} | undefined;


async function postPuzzleInAM() {
    await agent.login({ identifier: process.env.BLUESKY_USERNAME!, password: process.env.BLUESKY_PASSWORD!})
    lastPostUri = await agent.post({
        text: "🙂"
    });
    console.log("Just posted!")
}

async function repostPuzzleInEvening() {
    await agent.login({ identifier: process.env.BLUESKY_USERNAME!, password: process.env.BLUESKY_PASSWORD!})
    if(lastPostUri){
        await agent.repost(lastPostUri.uri, lastPostUri.cid);
        console.log("Just reposted!");
    }
}

const amPostSchedule = '0 8 * * *'; // Run once every day at 8 AM ET
const pmRepostSchedule = '0 18 * * *'; // Run once every day at 6 PM ET

const postJob = new CronJob(amPostSchedule, postPuzzleInAM);
const repostJob = new CronJob(pmRepostSchedule, repostPuzzleInEvening);

postJob.start();
repostJob.start();