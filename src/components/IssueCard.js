'use client'
import Link from 'next/link'
import { MapPin, ThumbsUp, MessageSquare, Clock } from 'lucide-react'
import { timeAgo, getStatusColor, getSeverityColor } from '@/lib/helpers'

export default function IssueCard({ issue }) {
  return (
    <Link href={`/issue/${issue.id}`} className="card hover:shadow-md transition-all block group">
      {issue.images?.[0] && (
        <div className="relative h-40 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={issue.images[0]} alt={issue.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      )}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className={`badge ${getStatusColor(issue.status)}`}>{issue.status}</span>
        <span className={`badge ${getSeverityColor(issue.severity)}`}>{issue.severity}</span>
        <span className="badge bg-gray-100 text-gray-600">{issue.category}</span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">{issue.title}</h3>
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{issue.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><MapPin size={12} /> {issue.address?.slice(0, 20) || 'Unknown'}</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {timeAgo(issue.reportedAt)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1"><ThumbsUp size={12} /> {issue.upvotes || 0}</span>
          <span className="flex items-center gap-1"><MessageSquare size={12} /> {issue.comments?.length || 0}</span>
        </div>
      </div>
    </Link>
  )
}
