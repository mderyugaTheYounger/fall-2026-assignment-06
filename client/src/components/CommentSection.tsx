import { useState, useEffect } from 'react'
import CommentItem from './CommentItem'

interface Comment {
  commentId: number
  articleId: number
  body: string
}

interface Props {
  articleId: number
}

export default function CommentSection({ articleId }: Props) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newBody, setNewBody] = useState('')
  const [newBodyError, setNewBodyError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`/articles/${articleId}/comments`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load comments (${res.status})`)
        return res.json()
      })
      .then((data) => setComments(data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Unknown error'))
      .finally(() => setLoading(false))
  }, [articleId])

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBody.trim()) {
      setNewBodyError('Comment body is required.')
      return
    }
    setNewBodyError(null)
    setSubmitting(true)
    try {
      const res = await fetch(`/articles/${articleId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: newBody.trim() }),
      })
      if (!res.ok) throw new Error(`Failed to add comment (${res.status})`)
      const created = await res.json()
      setComments((prev) => [...prev, created])
      setNewBody('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = (updated: Comment) => {
    setComments((prev) => prev.map((c) => (c.commentId === updated.commentId ? updated : c)))
  }

  const handleDelete = (commentId: number) => {
    setComments((prev) => prev.filter((c) => c.commentId !== commentId))
  }

  return (
    <div className="comments-section">
      <h2 className="comments-title">Comments</h2>

      {loading && <p className="status-loading">Loading comments...</p>}
      {error && <p className="status-error">{error}</p>}

      {!loading && (
        <>
          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="empty-state">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment.commentId}
                  comment={comment}
                  articleId={articleId}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>

          <div className="add-comment-form">
            <h3 className="add-comment-title">Add a Comment</h3>
            <form onSubmit={handleAddComment} noValidate>
              <div className="form-group">
                <textarea
                  className="form-textarea"
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  placeholder="Write a comment..."
                  rows={3}
                  aria-label="Comment body"
                />
                {newBodyError && <p className="form-error">{newBodyError}</p>}
              </div>
              <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
