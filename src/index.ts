import { Client, Storage } from 'node-appwrite';
import { Readable } from 'stream';
// @ts-ignore
import ExifTransformer from 'exif-be-gone';
import * as fs from 'fs';

// initialise the client SDK
let client = new Client();
client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

//initialise the storage SDK
const storage = new Storage(client);

const eventData = JSON.parse(process.env.APPWRITE_FUNCTION_EVENT_DATA);

async function run() {
    console.log(eventData);

    if (eventData.name.includes("STRIPPED_")) {
        return;
    }

    const file = await storage.getFileDownload(eventData.$id);

    const writer = fs.createWriteStream(`STRIPPED_${eventData.name}`);

    console.log(file);

    const stream = Readable.from(file).pipe(new ExifTransformer()).pipe(writer);


    console.log("+++++++++++++++++++++++ OUT ++++++++++++++++++++++++");
    try {
        const data = fs.createReadStream(`STRIPPED_${eventData.name}`, 'utf8');
        console.log(data);

        const outfile = new File()
        // @ts-ignore
        const callback = storage.createFile(data, [], []);
    } catch (err) {
        console.error(err);
    }
}

run();