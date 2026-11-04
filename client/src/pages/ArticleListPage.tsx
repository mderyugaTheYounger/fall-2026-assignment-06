import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'

interface Article {
  articleId: number
  title: string
  contents: string
}

export default function ArticleListPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const fetchArticles = useCallback(async (query: string) => {
    setLoading(true)
    setError(null)
    try {
      const url = query.trim()
        ? `/articles?title_contains=${encodeURIComponent(query.trim())}`
        : '/articles'
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Failed to load articles (${res.status})`)
      const data = await res.json()
      setArticles(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchArticles(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search, fetchArticles])

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Articles</h1>
        <button className="btn btn-primary" onClick={() => navigate('/articles/new')}>
          New Article
        </button>
      </div>

      <div className="toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search articles by title"
        />
      </div>

      {loading && <p className="status-loading">Loading...</p>}
      {error && <p className="status-error">{error}</p>}

      {!loading && !error && (
        articles.length === 0 ? (
          <p className="empty-state">No articles found.</p>
        ) : (
          <div className="article-list">
            {articles.map((article) => (
              <div key={article.articleId} className="article-card">
                <h2 className="article-card-title">{article.title}</h2>
                <p className="article-card-preview">{article.contents}</p>
                <div className="article-card-footer">
                  <Link to={`/articles/${article.articleId}`} className="btn btn-secondary btn-sm">
                    Read
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </>
  )
}
