const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      articles: [],
      error: null
    };
  },
  methods: {
    async fetchArticles() {
      try {
        const response = await fetch('./articles.json');
        const data = await response.json();
        this.articles = data.data.contents;
      } catch (error) {
        console.error('記事の取得に失敗しました:', error);
        this.error = error;
      }
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('ja-JP');
    }
  },
  mounted() {
    this.fetchArticles();
  }
});

app.mount('#app'); 