const { defineComponent } = Vue
import ArticleCard from './ArticleCard.js'

export default defineComponent({
  name: 'ArticleList',
  components: {
    ArticleCard
  },
  data() {
    return {
      articles: [],
      swiper: null
    }
  },
  async mounted() {
    try {
      const response = await fetch('/articles.json');
      const data = await response.json();
      this.articles = data.data.contents;
      
      // Swiper.jsの読み込みを待つ
      this.waitForSwiper();
    } catch (error) {
      console.error('記事の読み込みに失敗しました:', error);
    }
  },
  beforeUnmount() {
    if (this.swiper) {
      this.swiper.destroy();
    }
  },
  methods: {
    waitForSwiper() {
      if (typeof Swiper !== 'undefined') {
        this.$nextTick(() => {
          this.initSwiper();
        });
      } else {
        // Swiperが読み込まれるまで待機
        setTimeout(() => {
          this.waitForSwiper();
        }, 100);
      }
    },
    initSwiper() {
      // Swiperが利用可能かチェック
      if (typeof Swiper === 'undefined') {
        console.error('Swiper is not loaded');
        return;
      }

      // 既存のSwiperインスタンスを破棄
      if (this.swiper) {
        this.swiper.destroy();
      }

      // コンテナ要素を取得
      const container = this.$el.querySelector('.swiper-container');
      if (!container) {
        console.error('Swiper container not found');
        return;
      }

      // ナビゲーション要素を取得
      const nextButton = container.querySelector('.swiper-button-next');
      const prevButton = container.querySelector('.swiper-button-prev');
      const pagination = container.querySelector('.swiper-pagination');

      console.log('Navigation elements:', { nextButton, prevButton, pagination });

      this.swiper = new Swiper(container, {
        slidesPerView: 1,
        spaceBetween: 32,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        pagination: {
          el: pagination,
          clickable: true,
          dynamicBullets: true,
        },
        navigation: {
          nextEl: nextButton,
          prevEl: prevButton,
          disabledClass: 'swiper-button-disabled',
        },
        breakpoints: {
          640: {
            slidesPerView: 1,
            spaceBetween: 24,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 32,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 32,
          },
        },
        on: {
          init: function () {
            console.log('Swiper initialized successfully');
            console.log('Swiper instance:', this);
            console.log('Navigation enabled:', this.navigation.enabled);
          },
          beforeDestroy: function () {
            console.log('Swiper destroyed');
          },
        },
      });
    }
  },
  template: `
    <div class="relative">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div v-for="article in articles" 
               :key="article.id" 
               class="swiper-slide">
            <article-card :article="article" />
          </div>
        </div>
        
        <!-- ナビゲーションボタン -->
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
        
        <!-- ページネーション -->
        <div class="swiper-pagination"></div>
      </div>
    </div>
  `
}) 