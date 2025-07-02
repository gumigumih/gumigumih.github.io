const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// 画像をダウンロードする関数
async function downloadImage(imageUrl, filename) {
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    });
    
    // assets/images/articlesディレクトリを作成（存在しない場合）
    const dir = 'assets/images/articles';
    await fs.mkdir(dir, { recursive: true });
    
    const filepath = path.join(dir, filename);
    await fs.writeFile(filepath, response.data);
    
    console.log(`画像をダウンロードしました: ${filename}`);
    return filepath;
  } catch (error) {
    console.error(`画像のダウンロードに失敗しました: ${imageUrl}`, error.message);
    return null;
  }
}

async function fetchNoteArticles() {
  try {
    const response = await axios.get('https://note.com/api/v2/creators/gumigumih/contents?kind=note&size=3');
    
    const articles = [];
    for (const article of response.data.data.contents) {
      let localImagePath = null;
      
      // eyecatch画像がある場合はダウンロード
      if (article.eyecatch) {
        const filename = `note_${article.id}_${Date.now()}.jpg`;
        localImagePath = await downloadImage(article.eyecatch, filename);
      }
      
      articles.push({
        id: article.id,
        name: article.name,
        key: article.key,
        type: 'note',
        publishAt: article.publishAt,
        eyecatch: article.eyecatch,
        localImagePath: localImagePath, // ローカル画像パスを追加
        body: article.body,
        hashtags: article.hashtags
      });
    }
    
    return articles;
  } catch (error) {
    console.error('Error fetching Note articles:', error);
    return [];
  }
}

async function updateArticles() {
  try {
    const [noteArticles] = await Promise.all([
      fetchNoteArticles(),
    ]);

    // すべての記事を結合して日付順にソート
    const allArticles = [...noteArticles]
      .sort((a, b) => new Date(b.publishAt) - new Date(a.publishAt))
      .slice(0, 9); // 最新の9件を表示

    const jsonData = {
      data: {
        contents: allArticles
      }
    };

    await fs.writeFile('articles.json', JSON.stringify(jsonData, null, 2));
    console.log('Articles updated successfully!');
  } catch (error) {
    console.error('Error updating articles:', error);
    process.exit(1);
  }
}

// コマンドライン引数で直接実行された場合のみ実行
if (require.main === module) {
  updateArticles();
}

module.exports = {
  updateArticles,
  fetchNoteArticles,
}; 