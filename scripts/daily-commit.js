import fs from "node:fs";
import { makeLine } from "../src/line.js";

// 平日だけにしたい場合は true
const WEEKDAY_ONLY = false;

// 「初学者あるある」31個（毎回ランダムに1つ選ばれます）
const quotes = [
  "あれ？昨日動いてたのに今日は動かない…",
  "エラー文が怖いけど、よく読むとヒントだった。",
  "Git のコンフリクトで人生もコンフリクト中。",
  "テストが赤くても、心は折れない。",
  "npm install で世界が救われる。",
  "console.log が私の親友。",
  "動いた！…でもなぜ動いたか分からない。",
  "変数名に悩んで1時間経過。",
  "バグは敵じゃない、学びのきっかけ。",
  "コミットメッセージに『fix』しか書いてないの反省。",
  "Pull Request 出すの緊張するけど楽しい。",
  "CSS が思った通りに効かないのはデフォルト仕様。",
  "README 書くの、未来の自分のためなんだな。",
  "テストが通るとご飯が美味しい。",
  "GitHub Actions が動いたとき感動した。",
  "バージョン違いでハマるのも経験値。",
  "Stack Overflow に助けられて生きてる。",
  "ESLint が先生みたいに指摘してくる。",
  "TypeScript のエラーに鍛えられてる。",
  "小さい関数に分けたら、ちょっとプロっぽい。",
  "コードレビューで優しく指摘されると嬉しい。",
  "コメントアウトが日記になってる。",
  "オブジェクトと配列の違いで混乱中。",
  "テストコード書いたら安心感がすごい。",
  "Git push できたときに社会とつながった気がした。",
  "エラーを直したら別のエラーが出る、でも前進してる。",
  "クラス名を 'test' にして後悔。",
  "コードを削ったのに動いた…謎。",
  "VSCode の拡張機能に救われる。",
  "今日も草が生えた、ちょっと嬉しい。",
  "初心者でも毎日少しずつ成長してる気がする。"
];

function isWeekendJST(date = new Date()) {
  const y = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo", year: "numeric" }).format(date);
  const m = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo", month: "2-digit" }).format(date);
  const d = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo", day: "2-digit" }).format(date);
  const jst = new Date(`${y}-${m}-${d}T00:00:00+09:00`);
  const dow = jst.getDay(); // 0:日, 6:土
  return dow === 0 || dow === 6;
}

function pickQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

function appendLine() {
  if (WEEKDAY_ONLY && isWeekendJST()) {
    console.log("Weekend in JST — skipping.");
    return false;
  }
  const line = makeLine({ quote: pickQuote() });
  const path = "daily_log.md";
  const exists = fs.existsSync(path);
  const prev = exists ? fs.readFileSync(path, "utf8") : "# Daily Grass Log 🌱\n\n";
  const next = prev.trimEnd() + "\n" + line + "\n";
  fs.writeFileSync(path, next, "utf8");
  console.log("Appended:", line);
  return true;
}

appendLine();
