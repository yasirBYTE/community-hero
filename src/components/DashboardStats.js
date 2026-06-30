'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const COLORS = ['#059669', '#2563eb', '#f59e0b', '#ef4444', '#8b5cf6']

export default function DashboardStats({ issues }) {
  const statusCounts = { reported: 0, verified: 0, 'in-progress': 0, resolved: 0, closed: 0 }
  const categoryCounts = {}
  const monthlyData = {}

  issues.forEach((issue) => {
    statusCounts[issue.status] = (statusCounts[issue.status] || 0) + 1
    categoryCounts[issue.category] = (categoryCounts[issue.category] || 0) + 1
    if (issue.reportedAt) {
      const d = issue.reportedAt.toDate ? issue.reportedAt.toDate() : new Date(issue.reportedAt)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      monthlyData[key] = (monthlyData[key] || 0) + 1
    }
  })

  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
  const categoryData = Object.entries(categoryCounts).slice(0, 6).map(([name, value]) => ({ name, value }))
  const trendData = Object.entries(monthlyData).sort().slice(-6).map(([name, value]) => ({ name, value }))

  if (issues.length === 0) return null

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Status Distribution */}
      <div className="card">
        <h3 className="font-semibold mb-4">Issue Status Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
              {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Trend */}
      <div className="card">
        <h3 className="font-semibold mb-4">Monthly Issue Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Categories */}
      {categoryData.length > 0 && (
        <div className="card lg:col-span-2">
          <h3 className="font-semibold mb-4">Issues by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
