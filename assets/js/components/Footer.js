export default {
  name: 'Footer',
  template: `
    <footer class="py-10 text-center bg-white border-t border-slate-200 text-slate-500">
      <div class="max-w-7xl mx-auto px-4">
        <div class="mb-6">
          <a href="/privacy-policy.html" class="text-slate-500 hover:text-amber-500 mx-4 transition-colors text-sm">プライバシーポリシー</a>
          <a href="/terms.html" class="text-slate-500 hover:text-amber-500 mx-4 transition-colors text-sm">利用規約</a>
        </div>
        <p class="text-sm">© {{ new Date().getFullYear() }} meg+gumi</p>
      </div>
    </footer>
  `
} 