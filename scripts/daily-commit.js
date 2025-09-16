// scripts/daily-commit.js
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

const TZ = "Asia/Tokyo";
const FILE = "daily_log.md";

// JSTの土日判定
function isWeekendJST(date = new Date()) {
  const y = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric" }).format(date);
  const m = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, month: "2-digit" }).format(date);
  const d = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, day: "2-digit" }).format(date);
  const jst = new Date(`${y}-${m}-${d}T00:00:00+09:00`);
  const dow = jst.getDay(); // 0:日, 6:土
  return dow === 0 || dow === 6;
}

function todayJST() {
  const y = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric" }).format(new Date()); // 2025
  const m = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, month: "2-digit" }).format(new Date()); // 09
  const d = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, day: "2-digit" }).format(new Date());   // 16
  return `${y}-${m}-${d}`;
}

function pickQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

function ensureHeader(md) {
  // 既存ヘッダの日本語・英語どちらでもOK。無ければ新規で見出し追加。
  if (/^#\s*(GitHub草ジェネレーター|Daily Grass Log)/m.test(md)) return md;
  return `# GitHub草ジェネレーター 🌱\n\n` + md.replace(/^\s+$/, "");
}

function run() {
  if (WEEKDAY_ONLY && isWeekendJST()) {
    console.log("Weekend in JST — skipping.");
    return false;
  }

  // 既存読み込み（なければ空で）
  let md = fs.existsSync(FILE) ? fs.readFileSync(FILE, "utf8") : "";

  // ヘッダ確保
  md = ensureHeader(md.trimEnd()) + (md.endsWith("\n") ? "" : "\n");

  // 今日の重複行を削除（行頭 "- YYYY-MM-DD — " または "- YYYY-MM-DD - " を対象）
  const TODAY = todayJST();
  const lines = md.split("\n").filter(Boolean);
  const filtered = lines.filter(
    (ln) => !new RegExp(`^-\\s+${TODAY}\\s+[—-]\\s+`).test(ln)
  );

  // 1行生成（makeLine は "- YYYY-MM-DD — ...." を返す想定）
  const line = makeLine({ date: TODAY, quote: pickQuote(), tz: TZ });

  // 末尾に1行を追加
  const next = filtered.join("\n") + "\n" + line + "\n";

  // 変更があるときのみ書き込み
  if (next !== md + (md.endsWith("\n") ? "" : "\n")) {
    fs.writeFileSync(FILE, next, "utf8");
    console.log(`Appended: ${line}`);
    return true;
  } else {
    console.log("No changes.");
    return false;
  }
}

run();
