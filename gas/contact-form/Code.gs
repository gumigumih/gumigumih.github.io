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

    if (isLikelySpam(name, email, company, message)) {
      Logger.log(`スパム候補を通知対象外にしました: ${email}`);
      return;
    }

    Logger.log(`新しい問い合わせを受信: ${name} (${email})`);

    // 管理者宛メールの送信
    const adminResult = sendAdminNotification(name, email, company, message);
    if (!adminResult.success) {
      throw new Error(adminResult.error);
    }

    // 自動返信メールの送信
    const autoReplyResult = sendAutoReply(name, email, company, message);
    if (!autoReplyResult.success) {
      throw new Error(autoReplyResult.error);
    }

    Logger.log("問い合わせ処理が正常に完了しました");
  } catch (error) {
    Logger.log(`エラーが発生しました: ${error.message}`);
    throw error;
  }
}

/**
 * Turnstile検証後にGoogleフォームへ中継するWebアプリのエントリポイント。
 * Script Propertiesに TURNSTILE_SECRET_KEY を登録し、Webアプリを「全員」に公開する。
 */
function doPost(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};
    const secret = PropertiesService.getScriptProperties().getProperty("TURNSTILE_SECRET_KEY");
    const token = params["cf-turnstile-response"];
    if (!secret || !token) return jsonResponse({ success: false, error: "確認情報が不足しています" });

    const verificationResponse = UrlFetchApp.fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "post", payload: { secret: secret, response: token }, muteHttpExceptions: true }
    );
    const verification = JSON.parse(verificationResponse.getContentText());
    if (!verification.success || !["meggumi.com", "www.meggumi.com"].includes(verification.hostname)) {
      Logger.log(`Turnstile検証失敗: ${JSON.stringify(verification["error-codes"] || [])}`);
      return jsonResponse({ success: false, error: "スパム対策の確認に失敗しました" });
    }

    const formPayload = {
      "entry.180285880": params.name || "",
      "entry.1686666147": params.email || "",
      "entry.626095155": params.company || "",
      "entry.668514380": params.message || ""
    };
    UrlFetchApp.fetch(
      "https://docs.google.com/forms/d/e/1FAIpQLScRbLHC6JTR_1mkMqoLNoIzR1Y5pLZ_SrAo-cUReewnh5bQmw/formResponse",
      { method: "post", payload: formPayload, muteHttpExceptions: true }
    );
    return jsonResponse({ success: true });
  } catch (error) {
    Logger.log(`中継エラー: ${error.message}`);
    return jsonResponse({ success: false, error: "送信に失敗しました" });
  }
}

function jsonResponse(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}

/**
 * 通知前の軽量なスパム判定。
 * 回答自体はフォームに残すため、誤判定時も後から確認できます。
 */
function isLikelySpam(name, email, company, message) {
  const text = [name, email, company, message].filter(Boolean).join(" ").toLowerCase();
  const urlCount = (text.match(/https?:\/\//g) || []).length;
  const spamWords = [
    "backlink", "casino", "crypto", "forex", "seo service", "guest post",
    "viagra", "博彩", "彩票", "บาคาร่า", "พนัน"
  ];

  // 同一アドレスから短時間に繰り返される送信を通知しない。
  const cache = CacheService.getScriptCache();
  const emailKey = `contact:last:${Utilities.base64EncodeWebSafe(String(email).trim().toLowerCase())}`;
  if (cache.get(emailKey)) return true;

  const isSpam = urlCount >= 2 || spamWords.some((word) => text.includes(word)) || isLikelyRandomText(message);
  if (!isSpam) cache.put(emailKey, "1", 600);
  return isSpam;
}

function isLikelyRandomText(value) {
  const candidate = String(value || "").trim();
  if (candidate.length < 12 || /[ぁ-んァ-ヶ一-龠\s]/.test(candidate)) return false;

  const compact = candidate.replace(/[^a-z0-9]/gi, "").toLowerCase();
  if (compact.length < 10 || !/[a-z]/.test(compact)) return false;

  const uniqueRatio = new Set(compact).size / compact.length;
  const vowelRatio = (compact.match(/[aeiou]/g) || []).length / compact.length;
  return uniqueRatio >= 0.72 || vowelRatio <= 0.12;
}

// 管理者宛メール送信
function sendAdminNotification(name, email, company, message) {
  try {
    const adminEmail = "contact@meggumi.com";
    const subject = "【問い合わせ】新しいお問い合わせが届きました";

    // HTMLテンプレートを取得して変数を置換
    const template = HtmlService.createTemplateFromFile(
      "templates/admin-notification"
    );
    template.name = name;
    template.email = email;
    template.company = company;
    template.message = message;
    const htmlBody = template.evaluate().getContent();

    GmailApp.sendEmail(adminEmail, subject, "", {
      htmlBody: htmlBody,
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: `管理者宛メール送信エラー: ${error.message}`,
    };
  }
}

// 自動返信メール送信
function sendAutoReply(name, email, company, message) {
  try {
    const subject = "【自動返信】お問い合わせありがとうございます";

    // HTMLテンプレートを取得して変数を置換
    const template = HtmlService.createTemplateFromFile("templates/auto-reply");
    template.name = name;
    template.email = email;
    template.company = company;
    template.message = message;
    const htmlBody = template.evaluate().getContent();

    GmailApp.sendEmail(email, subject, "", {
      htmlBody: htmlBody,
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: `自動返信メール送信エラー: ${error.message}`,
    };
  }
}
