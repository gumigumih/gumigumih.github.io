const axios = require('axios');
const fs = require('fs').promises;

async function fetchNoteArticles() {
  try {
    const response = await axios.get('https://note.com/api/v2/creators/gumigumih/contents?kind=note&size=3');
    return response.data.data.contents.map(article => ({
      id: article.id,
      name: article.name,
      key: article.key,
      type: 'note',
      publishAt: article.publishAt,
      eyecatch: article.eyecatch,
      body: article.body,
      hashtags: article.hashtags
    }));
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