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
    }
  },
  template: `
    <a :href="'https://note.com/gumigumih/n/' + article.key" 
       target="_blank" 
       rel="noopener noreferrer" 
       class="bg-white rounded-2xl p-8 card-hover shadow-md hover:shadow-lg transition-all duration-300">
      <div class="aspect-[16/9] mb-6 overflow-hidden rounded-lg">
        <img :src="article.eyecatch" :alt="article.name" class="w-full h-full object-cover" />
      </div>
      <h3 class="text-xl font-bold text-gray-800 mb-4 font-raleway">{{ article.name }}</h3>
      <p class="text-gray-600 line-clamp-2">{{ article.body }}</p>
      <div class="flex flex-wrap gap-2 mt-4">
        <span v-for="tag in article.hashtags" 
              :key="tag.hashtag.name" 
              class="text-sm text-gray-500">
          {{ tag.hashtag.name }}
        </span>
      </div>
      <p class="text-gray-500 text-sm mt-4">{{ formatDate(article.publishAt) }}</p>
    </a>
  `
}) 