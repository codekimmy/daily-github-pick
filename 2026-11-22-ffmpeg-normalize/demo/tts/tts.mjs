import ESpeakNg from "espeak-ng";
import fs from "fs";
const [,, text, out, voice="ko", speed="150"] = process.argv;
const es = await ESpeakNg({arguments:["-v",voice,"-s",speed,"-w","/o.wav",text]});
fs.writeFileSync(out, es.FS.readFile("/o.wav"));
