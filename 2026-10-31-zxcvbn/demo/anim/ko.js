// zxcvbn 결과를 한국어로 바꾸는 부분 (password-check.html, 영상 렌더링에서 같이 씀)
const KO = {
  warn: {
    "Straight rows of keys are easy to guess": "키보드에서 한 줄로 나란히 누른 글자는 쉽게 맞혀요",
    "Short keyboard patterns are easy to guess": "짧은 키보드 무늬는 쉽게 맞혀요",
    "Repeats like \"aaa\" are easy to guess": "\"aaa\"처럼 같은 글자 반복은 쉽게 맞혀요",
    "Repeats like \"abcabcabc\" are only slightly harder to guess than \"abc\"": "\"abcabc\"처럼 묶음 반복은 \"abc\"보다 조금 어려울 뿐이에요",
    "Sequences like abc or 6543 are easy to guess": "abc, 6543 같은 순서대로 글자는 쉽게 맞혀요",
    "Recent years are easy to guess": "최근 연도는 쉽게 맞혀요",
    "Dates are often easy to guess": "날짜(생일 등)는 쉽게 맞혀요",
    "This is a top-10 common password": "가장 많이 쓰는 비밀번호 10위 안에 들어요",
    "This is a top-100 common password": "가장 많이 쓰는 비밀번호 100위 안에 들어요",
    "This is a very common password": "아주 흔한 비밀번호예요",
    "This is similar to a commonly used password": "흔한 비밀번호와 거의 같아요",
    "A word by itself is easy to guess": "단어 하나만 쓰면 쉽게 맞혀요",
    "Names and surnames by themselves are easy to guess": "이름·성만 쓰면 쉽게 맞혀요",
    "Common names and surnames are easy to guess": "흔한 이름·성은 쉽게 맞혀요"
  },
  sugg: {
    "Use a few words, avoid common phrases": "흔한 문구 말고, 서로 관련 없는 단어 몇 개를 이어 쓰세요",
    "No need for symbols, digits, or uppercase letters": "기호·숫자·대문자가 꼭 필요하진 않아요",
    "Add another word or two. Uncommon words are better.": "단어를 한두 개 더 붙이세요. 흔하지 않은 단어일수록 좋아요",
    "Use a longer keyboard pattern with more turns": "키보드 무늬를 쓸 거면 더 길고 꺾이게",
    "Avoid repeated words and characters": "같은 단어·글자 반복은 피하세요",
    "Avoid sequences": "순서대로 이어지는 글자는 피하세요",
    "Avoid recent years": "최근 연도는 피하세요",
    "Avoid years that are associated with you": "나와 관련된 연도(태어난 해 등)는 피하세요",
    "Avoid dates and years that are associated with you": "나와 관련된 날짜·연도는 피하세요",
    "Capitalization doesn't help very much": "대문자로 바꾸는 건 별 도움이 안 돼요",
    "All-uppercase is almost as easy to guess as all-lowercase": "전부 대문자도 전부 소문자만큼 쉬워요",
    "Reversed words aren't much harder to guess": "단어를 거꾸로 써도 별로 안 어려워져요",
    "Predictable substitutions like '@' instead of 'a' don't help very much": "a를 @로 바꾸는 식의 뻔한 바꾸기는 별 도움이 안 돼요"
  },
  score: ["매우 위험", "위험", "보통", "안전", "매우 안전"],
  color: ["#ff5c5c", "#ff9f43", "#f2c14e", "#7ee787", "#3fb950"]
};
function koTime(s) {
  if (s < 1) return "1초도 안 걸림";
  const M = 60, H = 3600, D = 86400, MO = D * 30.4, Y = D * 365;
  if (s < M) return `약 ${Math.round(s)}초`;
  if (s < H) return `약 ${Math.round(s / M)}분`;
  if (s < D) return `약 ${Math.round(s / H)}시간`;
  if (s < MO) return `약 ${Math.round(s / D)}일`;
  if (s < Y) return `약 ${Math.round(s / MO)}개월`;
  if (s < 100 * Y) return `약 ${Math.round(s / Y)}년`;
  return "100년 넘게";
}
function koWarn(s) { return KO.warn[(s || "").replace(/\.$/, "")] || KO.warn[s] || s; }
function koSugg(s) { return KO.sugg[s] || KO.sugg[(s || "").replace(/\.$/, "")] || s; }
if (typeof module !== "undefined") module.exports = { KO, koTime, koWarn, koSugg };
