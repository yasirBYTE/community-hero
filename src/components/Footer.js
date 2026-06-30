export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🦸</span>
            <span className="font-semibold text-primary-700">Community Hero</span>
          </div>
          <p className="text-sm text-gray-500">
            Empowering communities through AI-powered collaboration
          </p>
          <p className="text-xs text-gray-400">
            Built with Google Cloud, Gemini AI & Firebase
          </p>
        </div>
      </div>
    </footer>
  )
}
