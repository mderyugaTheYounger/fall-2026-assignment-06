import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function CreateArticlePage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [contents, setContents] = useState('')
  const [errors, setErrors] = useState<{ title?: string; contents?: string }>({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const validate = () => {
    const e: { title?: string; contents?: string } = {}
    if (!title.trim()) e.title = 'Title is required.'
    if (!contents.trim()) e.contents = 'Contents are required.'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    setErrors({})
    setSubmitting(true)
    setServerError(null)
    try {
      const res = await fetch('/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), contents: contents.trim() }),
      })
      if (!res.ok) throw new Error(`Failed to create article (${res.status})`)
      const article = await res.json()
      navigate(`/articles/${article.articleId}`)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Unknown error')
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">New Article</h1>
        <Link to="/" className="btn btn-secondary btn-sm">Cancel</Link>
      </div>

      <div className="card">
        {serverError && <p className="status-error" style={{ marginBottom: '1rem' }}>{serverError}</p>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="title">Title</label>
            <input
              id="title"
              className="form-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title"
            />
            {errors.title && <p className="form-error">{errors.title}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="contents">Contents</label>
            <textarea
              id="contents"
              className="form-textarea"
              value={contents}
              onChange={(e) => setContents(e.target.value)}
              placeholder="Write your article..."
            />
            {errors.contents && <p className="form-error">{errors.contents}</p>}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Article'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
