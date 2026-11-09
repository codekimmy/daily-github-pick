// 줄 목록(JSON)을 espeak-ng(npm, 인터넷·모델 없이 도는 기계 음성)으로 wav 파일로 만든다. 사용: node tts.mjs 목록.json 출력폴더
import ESpeakNg from "espeak-ng"; import fs from "fs";
const [list, outDir] = process.argv.slice(2); const L = JSON.parse(fs.readFileSync(list, "utf8"));
for (let i = 0; i < L.length; i++) {
  const e = await ESpeakNg({ arguments: ["-v", "ko", "-s", "165", "-w", "o.wav", L[i]] });
  fs.writeFileSync(`${outDir}/${String(i).padStart(3, "0")}.wav`, e.FS.readFile("o.wav"));
}
console.log("wav", L.length);
