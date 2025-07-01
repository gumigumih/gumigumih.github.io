const { defineComponent } = Vue

export default defineComponent({
  name: 'ArticleCard',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    getArticleUrl() {
      switch (this.article.type) {
        case 'note':
          return `https://note.com/gumigumih/n/${this.article.key}`;
        case 'qiita':
          return `https://qiita.com/gumigumih/items/${this.article.key}`;
        case 'zenn':
          return `https://zenn.dev/gumigumih/articles/${this.article.key}`;
        default:
          return `https://note.com/gumigumih/n/${this.article.key}`;
      }
    }
  },
  template: `
    <a :href="getArticleUrl()" 
       target="_blank" 
       rel="noopener noreferrer" 
       class="bg-white rounded-2xl p-8 shadow-lg border-r-4 border-b-4 border-slate-400 hover:shadow-lg hover:-translate-y-1 hover:border-slate-500 transform transition-all duration-200">
      <div class="aspect-[16/9] mb-6 overflow-hidden rounded-lg">
        <img :src="article.localImagePath || article.eyecatch" :alt="article.name" class="w-full h-full object-cover" />
      </div>
      <div class="flex items-center gap-2 mb-4">
        <h3 class="text-xl font-bold text-slate-800 font-raleway">{{ article.name }}</h3>
      </div>
      <div class="flex flex-wrap gap-2 mt-4">
        <span v-for="tag in article.hashtags" 
              :key="tag.hashtag.name" 
              class="text-sm text-slate-500">
          {{ tag.hashtag.name }}
        </span>
      </div>
      <p class="text-slate-500 text-sm mt-4">{{ formatDate(article.publishAt) }}</p>
    </a>
  `
}) 