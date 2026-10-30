// 시연용 '가상 강의' 목소리 만들기: espeak-ng(오프라인 음성 합성, npm 패키지)로 문장마다 wav 생성
// 사용: node tts.mjs <lines.json> <출력폴더>   (lines.json = [{"id":"s01","text":"..."}, ...])
import ESpeakNg from "espeak-ng";
import fs from "fs";
const [, , listPath, outDir] = process.argv;
fs.mkdirSync(outDir, { recursive: true });
for (const { id, text } of JSON.parse(fs.readFileSync(listPath, "utf8"))) {
  const e = await ESpeakNg({ arguments: ["-v", "ko", "-s", "150", "-p", "45", "-w", "o.wav", text] });
  fs.writeFileSync(`${outDir}/${id}.wav`, e.FS.readFile("o.wav"));
  console.log(id, text);
}
