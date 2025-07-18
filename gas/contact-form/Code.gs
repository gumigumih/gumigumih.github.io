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
