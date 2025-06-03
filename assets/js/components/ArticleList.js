const { defineComponent } = Vue
import ArticleCard from './ArticleCard.js'

export default defineComponent({
  name: 'ArticleList',
  components: {
    ArticleCard
  },
  data() {
    return {
      articles: []
    }
  },
  async mounted() {
    try {
      const response = await fetch('/articles.json');
      const data = await response.json();
      this.articles = data.data.contents;
    } catch (error) {
      console.error('記事の読み込みに失敗しました:', error);
    }
  },
  template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <article-card
        v-for="article in articles"
        :key="article.id"
        :article="article"
      />
    </div>
  `
}) 