'use client'
import Link from 'next/link'
import { MapPin, ThumbsUp, MessageSquare, Clock } from 'lucide-react'
import { timeAgo, getStatusColor, getSeverityColor } from '@/lib/helpers'

export default function IssueCard({ issue }) {
  return (
    <Link href={`/issue/${issue.id}`} className="card-gradient card-hover block group p-5 sm:p-6">
      {issue.images?.[0] && (
        <div className="relative h-40 -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 mb-4 overflow-hidden rounded-t-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={issue.images[0]} alt={issue.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
      )}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>{issue.status}</span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(issue.severity)}`}>{issue.severity}</span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-gray-400 border border-white/10">{issue.category}</span>
      </div>
      <h3 className="font-heading font-semibold text-white mb-1.5 group-hover:text-indigo-300 transition-colors line-clamp-1">{issue.title}</h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{issue.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><MapPin size={12} /> {issue.address?.slice(0, 20) || 'Unknown'}</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {timeAgo(issue.reportedAt)}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><ThumbsUp size={12} /> {issue.upvotes || 0}</span>
          <span className="flex items-center gap-1"><MessageSquare size={12} /> {issue.comments?.length || 0}</span>
        </div>
      </div>
    </Link>
  )
}
