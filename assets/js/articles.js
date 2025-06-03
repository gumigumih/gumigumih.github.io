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
      if (!dateString) return '';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  },
  mounted() {
    this.fetchArticles();
  }
});

app.mount('#app'); 