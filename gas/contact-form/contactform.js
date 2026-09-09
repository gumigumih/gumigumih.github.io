// フォーム送信時のトリガー
function onFormSubmit(e) {
  // 通知はTurnstile検証済みのCode.gs#doPostだけで行う。
  console.log("フォームトリガー経由の通知は無効化されています");
}

function isLikelySpamLegacy(name, email, company, message) {
  const text = [name, email, company, message].filter(Boolean).join(" ").toLowerCase();
  const urlCount = (text.match(/https?:\/\//g) || []).length;
  const spamWords = [
    "backlink", "casino", "crypto", "forex", "seo service", "guest post",
    "viagra", "博彩", "彩票", "บาคาร่า", "พนัน"
  ];
  const cache = CacheService.getScriptCache();
  const emailKey = `contact:last:${Utilities.base64EncodeWebSafe(String(email).trim().toLowerCase())}`;
  if (cache.get(emailKey)) return true;

  const isSpam = urlCount >= 2 || spamWords.some((word) => text.includes(word)) || isLikelyRandomTextLegacy(message);
  if (!isSpam) cache.put(emailKey, "1", 600);
  return isSpam;
}

function isLikelyRandomTextLegacy(value) {
  const candidate = String(value || "").trim();
  if (candidate.length < 12 || /[ぁ-んァ-ヶ一-龠\s]/.test(candidate)) return false;

  const compact = candidate.replace(/[^a-z0-9]/gi, "").toLowerCase();
  if (compact.length < 10 || !/[a-z]/.test(compact)) return false;

  const uniqueRatio = new Set(compact).size / compact.length;
  const vowelRatio = (compact.match(/[aeiou]/g) || []).length / compact.length;
  const hasMixedCaseAndDigits = /[a-z]/.test(candidate) && /[A-Z]/.test(candidate) && /\d/.test(candidate);
  return uniqueRatio >= 0.72 || vowelRatio <= 0.12 || hasMixedCaseAndDigits;
}

// 管理者宛メール送信
function sendAdminNotification(name, email, company, message) {
  const adminEmail = "contact@meggumi.com"; // 管理者のメールアドレス
  const subject = "【問い合わせ】新しいお問い合わせが届きました";

  // メール本文の作成
  let body = `
新しいお問い合わせが届きました。

■お名前
${name}

■メールアドレス
${email}
`;

  // 会社名がある場合のみ追加
  if (company) {
    body += `
■会社名・団体名
${company}
`;
  }

  body += `
■お問い合わせ内容
${message}

---
このメールは問い合わせフォームから自動送信されています。
`;

  // メール送信
  GmailApp.sendEmail(adminEmail, subject, body);
}

// 自動返信メール送信
function sendAutoReply(name, email, company, message) {
  const subject = "【自動返信】お問い合わせありがとうございます";
  const body = `
${name} 様

お問い合わせありがとうございます。
以下の内容で承りました。

■お名前
${name}

■メールアドレス
${email}
`;

  // 会社名がある場合のみ追加
  if (company) {
    body += `
■会社名・団体名
${company}
`;
  }

  body += `
■お問い合わせ内容
${message}

内容を確認次第、担当者よりご連絡させていただきます。
通常3営業日以内にご返信いたします。

ご不明な点がございましたら、お気軽にお問い合わせください。

---
meg+gumi
メール：contact@meggumi.com
`;

  // メール送信
  GmailApp.sendEmail(email, subject, body);
}
