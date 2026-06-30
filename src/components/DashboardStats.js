'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const COLORS = ['#34d399', '#60a5fa', '#fbbf24', '#f87171', '#a78bfa']

const chartTheme = {
  grid: '#ffffff10',
  text: '#9ca3af',
  tooltipBg: '#1A1A1E',
  tooltipBorder: '#ffffff20',
}

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
      <div className="card-gradient p-6">
        <h3 className="font-semibold mb-4">Issue Status Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`} labelStyle={{ fill: '#9ca3af' }}>
              {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, borderRadius: '8px', color: '#e5e7eb' }} />
            <Legend formatter={(value) => <span style={{ color: '#9ca3af' }}>{value}</span>} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Trend */}
      <div className="card-gradient p-6">
        <h3 className="font-semibold mb-4">Monthly Issue Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: chartTheme.text }} />
            <YAxis tick={{ fontSize: 12, fill: chartTheme.text }} />
            <Tooltip contentStyle={{ background: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, borderRadius: '8px', color: '#e5e7eb' }} />
            <Bar dataKey="value" fill="#34d399" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Categories */}
      {categoryData.length > 0 && (
        <div className="card-gradient p-6 lg:col-span-2">
          <h3 className="font-semibold mb-4">Issues by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
              <XAxis type="number" tick={{ fill: chartTheme.text }} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12, fill: chartTheme.text }} />
              <Tooltip contentStyle={{ background: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, borderRadius: '8px', color: '#e5e7eb' }} />
              <Bar dataKey="value" fill="#60a5fa" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
