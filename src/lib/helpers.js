import { format, formatDistanceToNow } from 'date-fns'

export function formatDate(date) {
  if (!date) return ''
  const d = date.toDate ? date.toDate() : new Date(date)
  return format(d, 'MMM dd, yyyy')
}

export function timeAgo(date) {
  if (!date) return ''
  const d = date.toDate ? date.toDate() : new Date(date)
  return formatDistanceToNow(d, { addSuffix: true })
}

export function getStatusColor(status) {
  const map = {
    reported: 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20',
    verified: 'bg-blue-500/10 text-blue-300 border border-blue-500/20',
    'in-progress': 'bg-purple-500/10 text-purple-300 border border-purple-500/20',
    resolved: 'bg-green-500/10 text-green-300 border border-green-500/20',
    closed: 'bg-gray-500/10 text-gray-300 border border-gray-500/20',
  }
  return map[status] || 'bg-gray-500/10 text-gray-300'
}

export function getSeverityColor(severity) {
  const map = {
    Low: 'bg-green-500/10 text-green-300 border border-green-500/20',
    Medium: 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20',
    High: 'bg-orange-500/10 text-orange-300 border border-orange-500/20',
    Critical: 'bg-red-500/10 text-red-300 border border-red-500/20',
  }
  return map[severity] || 'bg-gray-500/10 text-gray-300'
}

export function getBadgeIcon(type) {
  const icons = {
    'first-report': 'First Report',
    'verifier': 'Verifier',
    'problem-solver': 'Problem Solver',
    'rising-star': 'Rising Star',
    'community-hero': 'Community Hero',
    'watchdog': 'Watchdog',
  }
  return icons[type] || type
}

export function generateBadges(points) {
  const badges = []
  if (points >= 10) badges.push({ id: 'first-report', name: 'First Report', icon: '📸', description: 'Reported your first issue' })
  if (points >= 50) badges.push({ id: 'verifier', name: 'Verifier', icon: '✅', description: 'Verified 10 issues' })
  if (points >= 100) badges.push({ id: 'problem-solver', name: 'Problem Solver', icon: '🔧', description: 'Helped resolve 5 issues' })
  if (points >= 200) badges.push({ id: 'rising-star', name: 'Rising Star', icon: '⭐', description: 'Active community member' })
  if (points >= 500) badges.push({ id: 'community-hero', name: 'Community Hero', icon: '🦸', description: 'Major community contributor' })
  if (points >= 1000) badges.push({ id: 'watchdog', name: 'Watchdog', icon: '🐾', description: 'Guardian of the neighborhood' })
  return badges
}

export function compressImage(file, maxWidth = 800) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target.result
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      }
    }
  })
}
