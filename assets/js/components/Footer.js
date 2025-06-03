export default {
  name: 'Footer',
  template: `
    <footer class="py-12 text-center text-gray-500">
      <div class="max-w-7xl mx-auto px-4">
        <div class="mb-8">
          <a href="/privacy-policy.html" class="text-gray-500 hover:text-amber-500 mx-6 transition-colors text-lg">プライバシーポリシー</a>
          <a href="/terms.html" class="text-gray-500 hover:text-amber-500 mx-6 transition-colors text-lg">利用規約</a>
        </div>
        <p class="text-lg">© {{ new Date().getFullYear() }} meg+gumi</p>
      </div>
    </footer>
  `
} 