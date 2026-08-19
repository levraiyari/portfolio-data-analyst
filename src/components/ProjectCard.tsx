import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'

type Props = {
  slug: string
  title: string
  description: string
  tags: string[]
  date: string
  gradient: string
}

export function ProjectCard({ slug, title, description, tags, date, gradient }: Props) {
  return (
    <Link
      href={`/projets/${slug}`}
      className="group relative flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden hover:border-zinc-600 transition-all duration-300"
    >
      {/* Color bar top */}
      <div className={`h-1.5 w-full ${gradient}`} />

      <div className="p-6 flex flex-col flex-1">
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs bg-zinc-800 text-zinc-300 border-zinc-700"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-zinc-400 flex-1 leading-relaxed">{description}</p>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
          <span className="text-xs text-zinc-500">{date}</span>
          <span className="text-xs text-blue-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            Voir l&apos;analyse <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  )
}
