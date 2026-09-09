// フォーム送信時のトリガー
function onFormSubmit(e) {
  // Googleフォーム直送ではTurnstileを確認できないため、通知はdoPostだけで行う。
  Logger.log("フォームトリガー経由の通知は無効化されています");
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

    const name = params.name || "";
    const email = params.email || "";
    const company = params.company || "";
    const message = params.message || "";
    if (isLikelySpam(name, email, company, message)) {
      Logger.log(`スパム候補を通知・保存対象外にしました: ${email}`);
      return jsonResponse({ success: true });
    }

    const formPayload = {
      "entry.180285880": name,
      "entry.1686666147": email,
      "entry.626095155": company,
      "entry.668514380": message
    };
    const formResponse = UrlFetchApp.fetch(
      "https://docs.google.com/forms/d/e/1FAIpQLScRbLHC6JTR_1mkMqoLNoIzR1Y5pLZ_SrAo-cUReewnh5bQmw/formResponse",
      { method: "post", payload: formPayload, muteHttpExceptions: true }
    );
    if (formResponse.getResponseCode() >= 400) throw new Error("Googleフォームへの保存に失敗しました");

    const adminResult = sendAdminNotification(name, email, company, message);
    if (!adminResult.success) throw new Error(adminResult.error);
    const autoReplyResult = sendAutoReply(name, email, company, message);
    if (!autoReplyResult.success) throw new Error(autoReplyResult.error);
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
  const hasMixedCaseAndDigits = /[a-z]/.test(candidate) && /[A-Z]/.test(candidate) && /\d/.test(candidate);
  return uniqueRatio >= 0.72 || vowelRatio <= 0.12 || hasMixedCaseAndDigits;
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
