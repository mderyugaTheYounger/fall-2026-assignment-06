import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import CommentSection from '../components/CommentSection'

interface Article {
  articleId: number
  title: string
  contents: string
}

export default function ArticleDetailPage() {
  const { articleId } = useParams<{ articleId: string }>()
  const navigate = useNavigate()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!articleId) return
    setLoading(true)
    setError(null)
    fetch(`/articles/${articleId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Article not found (${res.status})`)
        return res.json()
      })
      .then((data) => setArticle(data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Unknown error'))
      .finally(() => setLoading(false))
  }, [articleId])

  const handleDelete = async () => {
    if (!articleId || !window.confirm('Delete this article?')) return
    setDeleting(true)
    try {
      const res = await fetch(`/articles/${articleId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(`Delete failed (${res.status})`)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
      setDeleting(false)
    }
  }

  if (loading) return <p className="status-loading">Loading...</p>
  if (error) return <p className="status-error">{error}</p>
  if (!article) return null

  return (
    <>
      <div className="page-header">
        <Link to="/" className="btn btn-secondary btn-sm">Back</Link>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to={`/articles/${article.articleId}/edit`} className="btn btn-secondary btn-sm">
            Edit
          </Link>
          <button
            className="btn btn-danger btn-sm"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="card">
        <h1 className="article-title">{article.title}</h1>
        <hr className="divider" />
        <p className="article-contents">{article.contents}</p>
      </div>

      <CommentSection articleId={Number(articleId)} />
    </>
  )
}
