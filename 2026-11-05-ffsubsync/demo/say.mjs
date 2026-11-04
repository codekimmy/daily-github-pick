import ESpeakNg from "espeak-ng";
import fs from "fs";
const [,, text, out, voice="ko"] = process.argv;
const e = await ESpeakNg({arguments: ["-v", voice, "-s", "150", "-w", "/o.wav", text]});
fs.writeFileSync(out, e.FS.readFile("/o.wav"));
