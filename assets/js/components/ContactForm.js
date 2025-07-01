export default {
  template: `
    <div class="max-w-5xl mx-auto bg-white rounded-2xl p-8 md:p-12">
      <p class="text-slate-600 text-lg mb-8 text-center">
        お問い合わせは以下のフォームからお願いいたします。<br>
        内容を確認次第、ご連絡させていただきます。
      </p>
      <div class="max-w-2xl mx-auto">
        <!-- フォーム -->
        <form v-if="!submitStatus" @submit.prevent="submitForm" class="space-y-6">
          <div class="space-y-2">
            <label for="name" class="block text-slate-700 font-medium">
              お名前 <span class="text-red-500">*</span>
            </label>
            <input type="text" id="name" v-model="formData.name" required
                   class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors duration-200"
                   placeholder="山田 太郎">
          </div>
          
          <div class="space-y-2">
            <label for="email" class="block text-slate-700 font-medium">
              メールアドレス <span class="text-red-500">*</span>
            </label>
            <input type="email" id="email" v-model="formData.email" required
                   class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors duration-200"
                   placeholder="example@email.com">
          </div>
          
          <div class="space-y-2">
            <label for="company" class="block text-slate-700 font-medium">
              会社名・団体名
            </label>
            <input type="text" id="company" v-model="formData.company"
                   class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors duration-200"
                   placeholder="株式会社〇〇">
          </div>
          
          <div class="space-y-2">
            <label for="message" class="block text-slate-700 font-medium">
              お問い合わせ内容 <span class="text-red-500">*</span>
            </label>
            <textarea id="message" v-model="formData.message" required rows="6"
                      class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors duration-200 resize-none"
                      placeholder="お問い合わせ内容をご記入ください"></textarea>
          </div>
          
          <div class="text-center pt-4">
            <button type="submit" 
                    class="inline-flex items-center justify-center bg-slate-600 text-white px-12 py-4 rounded-full hover:bg-slate-700 transition-all duration-300 text-lg font-medium shadow-lg hover:shadow-lg border-r-4 border-b-4 border-slate-400 hover:border-slate-500 hover:-translate-y-1 transform"
                    :disabled="isSubmitting">
              <i class="fas" :class="isSubmitting ? 'fa-spinner fa-spin' : 'fa-paper-plane'"></i>
              <span class="ml-3">{{ isSubmitting ? '送信中...' : '送信する' }}</span>
            </button>
          </div>
        </form>

        <!-- 送信結果メッセージ -->
        <div v-else class="mt-6">
          <!-- 成功メッセージ -->
          <div v-if="submitStatus === 'success'" 
               class="bg-white rounded-2xl p-8 text-center">
            <div class="flex flex-col items-center justify-center">
              <div class="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <i class="fas fa-check-circle text-3xl text-teal-600"></i>
              </div>
              <h3 class="text-xl font-bold text-teal-800 mb-2">送信が完了しました</h3>
              <p class="text-teal-700 mb-4 max-w-md mx-auto">内容を確認次第、ご連絡させていただきます。</p>
            </div>
          </div>

          <!-- 失敗メッセージ -->
          <div v-else 
               class="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div class="flex flex-col items-center justify-center">
              <div class="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                <i class="fas fa-exclamation-circle text-3xl text-rose-600"></i>
              </div>
              <h3 class="text-xl font-bold text-rose-800 mb-2">送信に失敗しました</h3>
              <p class="text-rose-700 mb-4 max-w-md mx-auto">以下のメールアドレスまで直接ご連絡ください：</p>
              <div class="flex flex-col items-center gap-4">
                <a :href="getMailtoLink()"
                   class="text-rose-600 hover:text-rose-700 font-mono bg-rose-50 px-4 py-2 rounded-lg border border-rose-200 transition-colors duration-200">
                  contact@meggumi.com
                </a>
                <button @click="copyContent" 
                        class="text-rose-600 hover:text-rose-700 font-mono bg-rose-50 px-4 py-2 rounded-lg border border-rose-200 transition-colors duration-200 flex items-center gap-2">
                  <i class="fas fa-copy"></i>
                  <span>問い合わせ内容をコピー</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      // 設定
      config: {
        contact: {
          email: 'contact@meggumi.com',
          companyName: 'meg+gumi',
          responseTime: '3営業日以内'
        },
        form: {
          googleFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScRbLHC6JTR_1mkMqoLNoIzR1Y5pLZ_SrAo-cUReewnh5bQmw/formResponse',
          entryIds: {
            name: 'entry.180285880',
            email: 'entry.1686666147',
            company: 'entry.626095155',
            message: 'entry.668514380'
          }
        }
      },
      // フォームデータ
      formData: {
        name: '',
        email: '',
        company: '',
        message: ''
      },
      isSubmitting: false,
      submitStatus: null
    }
  },
  methods: {
    getMailtoLink() {
      const subject = encodeURIComponent('お問い合わせ');
      const body = encodeURIComponent(
        'お名前：' + this.formData.name + '\n' +
        'メールアドレス：' + this.formData.email + '\n' +
        '会社名・団体名：' + (this.formData.company || '') + '\n\n' +
        'お問い合わせ内容：\n' + this.formData.message
      );
      return `mailto:${this.config.contact.email}?subject=${subject}&body=${body}`;
    },
    copyContent() {
      const content = 
        'お名前：' + this.formData.name + '\n' +
        'メールアドレス：' + this.formData.email + '\n' +
        '会社名・団体名：' + (this.formData.company || '') + '\n\n' +
        'お問い合わせ内容：\n' + this.formData.message + '\n\n' +
        '※上記の内容を以下のメールアドレスに送信してください：\n' +
        this.config.contact.email;
      
      navigator.clipboard.writeText(content).then(() => {
        alert('問い合わせ内容をコピーしました');
      }).catch(err => {
        console.error('コピーに失敗しました:', err);
      });
    },
    async submitForm() {
      this.isSubmitting = true;
      try {
        const formData = new FormData();
        formData.append(this.config.form.entryIds.name, this.formData.name);
        formData.append(this.config.form.entryIds.email, this.formData.email);
        formData.append(this.config.form.entryIds.company, this.formData.company);
        formData.append(this.config.form.entryIds.message, this.formData.message);

        const response = await fetch(this.config.form.googleFormUrl, {
          method: 'POST',
          body: formData,
          mode: 'no-cors'
        });

        this.submitStatus = 'success';
        this.formData = {
          name: '',
          email: '',
          company: '',
          message: ''
        };
      } catch (error) {
        console.error('送信エラー:', error);
        this.submitStatus = 'error';
      } finally {
        this.isSubmitting = false;
      }
    }
  }
} 