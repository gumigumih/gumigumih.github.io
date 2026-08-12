const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const ARTICLES_IMAGES_DIR = path.join('public', 'assets', 'images', 'articles');
const ARTICLES_JSON_PATH = path.join('public', 'articles.json');

/**
 * Note APIから取得した記事の構造。
 * @typedef {Object} NoteArticle
 * @property {number} id 記事ID
 * @property {string} name 記事タイトル
 * @property {string} key 記事キー（URL用）
 * @property {'note'} type 記事種別
 * @property {string} publishAt 公開日時（ISO文字列）
 * @property {string | null} eyecatch 公式アイキャッチのURL
 * @property {string | null} localImagePath ローカルに保存したアイキャッチのパス
 * @property {string} body 記事本文（冒頭抜粋）
 * @property {Array<{hashtag: {name: string}}>} hashtags ハッシュタグ配列
 * @property {Array<{level: number, text: string}>} toc 記事本文内の見出し一覧
 */

/**
 * Note APIから抽出した記事に対応する画像をダウンロードする。
 * @param {string} imageUrl ダウンロード元URL
 * @param {string} filename 保存時のファイル名
 * @returns {Promise<string | null>} 公開用のパス。失敗時はnull
 */
async function downloadImage(imageUrl, filename) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    await fs.mkdir(ARTICLES_IMAGES_DIR, { recursive: true });

    const filePath = path.join(ARTICLES_IMAGES_DIR, filename);
    await fs.writeFile(filePath, response.data);

    console.log(`Downloaded image: ${filename}`);
    return `/assets/images/articles/${filename}`;
  } catch (error) {
    console.error(`Failed to download image: ${imageUrl}`, error.message);
    return null;
  }
}

/**
 * HTML文字列から見出しテキストを抽出する。
 * @param {string} html note記事本文HTML
 * @returns {Array<{level: number, text: string}>} h2/h3の見出し一覧
 */
function extractTocFromHtml(html) {
  const decodeEntities = (value) => value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');

  return [...String(html || '').matchAll(/<h([23])\b[^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map((match) => ({
      level: Number(match[1]),
      text: decodeEntities(match[2].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()),
    }))
    .filter((heading) => heading.text);
}

/**
 * note.com の公開APIから記事詳細を取得する。
 * @param {string} key 記事キー
 * @returns {Promise<{toc: Array<{level: number, text: string}>}>} 取得した詳細情報
 */
async function fetchNoteArticleDetail(key) {
  try {
    const response = await axios.get(`https://note.com/api/v3/notes/${key}`);
    return {
      toc: extractTocFromHtml(response.data?.data?.body || ''),
    };
  } catch (error) {
    console.error(`Failed to fetch Note detail: ${key}`, error.message);
    return { toc: [] };
  }
}

/**
 * note.com の公開APIから最新の記事一覧を取得する。
 * @returns {Promise<NoteArticle[]>} 取得した記事リスト
 */
async function fetchNoteArticles() {
  try {
    const response = await axios.get('https://note.com/api/v2/creators/gumigumih/contents?kind=note&size=3');

    const articles = [];
    for (const article of response.data.data.contents) {
      const detail = await fetchNoteArticleDetail(article.key);
      let localImagePath = null;
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
        localImagePath,
        body: article.body,
        hashtags: article.hashtags,
        toc: detail.toc,
      });
    }

    return articles;
  } catch (error) {
    console.error('Error fetching Note articles:', error);
    return [];
  }
}

/**
 * 最新データで使用されない画像ファイルを削除する。
 * @param {Array<string | null>} usedImagePaths 使用中の画像パスの一覧
 * @returns {Promise<void>}
 */
async function cleanupOldImages(usedImagePaths) {
  const usedFilenames = new Set(
    (usedImagePaths || [])
      .filter(Boolean)
      .map((p) => path.basename(p))
  );

  try {
    const files = await fs.readdir(ARTICLES_IMAGES_DIR);
    await Promise.all(
      files.map(async (file) => {
        const fullPath = path.join(ARTICLES_IMAGES_DIR, file);
        const stat = await fs.stat(fullPath);
        if (!stat.isFile()) return;
        if (!usedFilenames.has(file)) {
          await fs.unlink(fullPath);
          console.log(`Removed stale image: ${file}`);
        }
      })
    );
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Failed to clean up stale images:', error.message);
    }
  }
}

/**
 * Note記事のメタ情報と画像を更新し、不要な画像をクリーンアップする。
 * @returns {Promise<void>}
 */
async function updateArticles() {
  try {
    const [noteArticles] = await Promise.all([fetchNoteArticles()]);

    const allArticles = [...noteArticles]
      .sort((a, b) => new Date(b.publishAt) - new Date(a.publishAt))
      .slice(0, 9);

    const jsonData = { data: { contents: allArticles } };

    await fs.writeFile(ARTICLES_JSON_PATH, JSON.stringify(jsonData, null, 2));
    await cleanupOldImages(allArticles.map((article) => article.localImagePath));
    console.log('Articles updated successfully!');
  } catch (error) {
    console.error('Error updating articles:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  updateArticles();
}

module.exports = {
  updateArticles,
  fetchNoteArticles,
  extractTocFromHtml,
};
