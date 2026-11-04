import { useState } from 'react'

interface Comment {
  commentId: number
  articleId: number
  body: string
}

interface Props {
  comment: Comment
  articleId: number
  onUpdate: (updated: Comment) => void
  onDelete: (commentId: number) => void
}

export default function CommentItem({ comment, articleId, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState(false)
  const [editBody, setEditBody] = useState(comment.body)
  const [editError, setEditError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleEdit = () => {
    setEditBody(comment.body)
    setEditError(null)
    setEditing(true)
  }

  const handleCancel = () => {
    setEditing(false)
    setEditError(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editBody.trim()) {
      setEditError('Comment body is required.')
      return
    }
    setSaving(true)
    setEditError(null)
    try {
      const res = await fetch(`/articles/${articleId}/comments/${comment.commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: editBody.trim() }),
      })
      if (!res.ok) throw new Error(`Failed to update comment (${res.status})`)
      const updated = await res.json()
      onUpdate(updated)
      setEditing(false)
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/articles/${articleId}/comments/${comment.commentId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error(`Failed to delete comment (${res.status})`)
      onDelete(comment.commentId)
    } catch {
      setDeleting(false)
    }
  }

  return (
    <div className="comment-item">
      {editing ? (
        <form onSubmit={handleSave} noValidate className="inline-edit">
          <div className="form-group" style={{ marginBottom: '0.5rem' }}>
            <textarea
              className="form-textarea"
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              rows={3}
              aria-label="Edit comment"
            />
            {editError && <p className="form-error">{editError}</p>}
          </div>
          <div className="comment-actions">
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleCancel} disabled={saving}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="comment-body">{comment.body}</p>
          <div className="comment-actions">
            <button className="btn btn-secondary btn-sm" onClick={handleEdit}>Edit</button>
            <button
              className="btn btn-danger btn-sm"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
