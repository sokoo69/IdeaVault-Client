'use client'

import { useState, useContext } from 'react'
import { AuthContext } from '@/context/AuthContext'
import api from '@/utils/api'
import toast from 'react-hot-toast'

export default function CommentSection({ ideaId, comments: initialComments, onCommentAdded }) {
  const { user } = useContext(AuthContext)
  const [comments, setComments] = useState(initialComments || [])
  const [commentText, setCommentText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) {
      toast.error('Comment cannot be empty')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/comments', {
        ideaId,
        text: commentText,
      })
      setComments([response.data.comment, ...comments])
      setCommentText('')
      toast.success('Comment added successfully!')
      onCommentAdded?.()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add comment')
    } finally {
      setLoading(false)
    }
  }

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) {
      toast.error('Comment cannot be empty')
      return
    }

    setLoading(true)
    try {
      const response = await api.put(`/comments/${commentId}`, {
        text: editText,
      })
      setComments(comments.map(c => c._id === commentId ? response.data.comment : c))
      setEditingId(null)
      toast.success('Comment updated!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update comment')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Delete this comment?')) return

    try {
      await api.delete(`/comments/${commentId}`)
      setComments(comments.filter(c => c._id !== commentId))
      toast.success('Comment deleted!')
      onCommentAdded?.()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete comment')
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>

      {user ? (
        <form onSubmit={handleAddComment} className="mb-8 p-4 bg-gray-50 rounded-lg">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts on this idea..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            rows="4"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">Please log in to add a comment</p>
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map(comment => (
            <div key={comment._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={comment.userPhoto || 'https://via.placeholder.com/40'}
                    alt={comment.userName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{comment.userName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {user?._id === comment.userId && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingId(comment._id)
                        setEditText(comment.text)
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {editingId === comment._id ? (
                <div className="mt-3">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                    rows="3"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleEditComment(comment._id)}
                      disabled={loading}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 mt-3">{comment.text}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
