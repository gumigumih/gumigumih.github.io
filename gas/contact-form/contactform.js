// フォーム送信時のトリガー
function onFormSubmit(e) {
  try {
    // フォームの回答を取得
    const formResponse = e.response;
    const itemResponses = formResponse.getItemResponses();

    // 回答内容を取得
    const name = itemResponses[0].getResponse(); // お名前
    const email = itemResponses[1].getResponse(); // メールアドレス
    const company = itemResponses[2].getResponse(); // 会社名・団体名
    const message = itemResponses[3].getResponse(); // お問い合わせ内容

    // 管理者宛メールの送信
    sendAdminNotification(name, email, company, message);

    // 自動返信メールの送信
    sendAutoReply(name, email, company, message);
  } catch (error) {
    console.error("Error:", error);
  }
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
