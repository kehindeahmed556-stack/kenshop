import { useState, useRef, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Send, ArrowLeft, User } from 'lucide-react'
import { format, isToday, isYesterday } from 'date-fns'
import { useAuth } from '../contexts/AuthContext'
import { useConversations, useMessages } from '../hooks/useMessages'
import Spinner from '../components/ui/Spinner'
import EmptyState from '../components/ui/EmptyState'

function formatMsgTime(dateStr) {
  const d = new Date(dateStr)
  if (isToday(d)) return format(d, 'h:mm a')
  if (isYesterday(d)) return `Yesterday ${format(d, 'h:mm a')}`
  return format(d, 'MMM d, h:mm a')
}

function Avatar({ profile, size = 8 }) {
  if (profile?.avatar_url) return (
    <img src={profile.avatar_url} alt={profile.full_name} className={`w-${size} h-${size} rounded-full object-cover flex-shrink-0`} />
  )
  return (
    <div className={`w-${size} h-${size} rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0`}>
      <User size={size * 2.5} className="text-brand-500" />
    </div>
  )
}

function ConversationList({ conversations, loading, currentKey, userId }) {
  if (loading) return <div className="flex justify-center py-10"><Spinner /></div>
  if (!conversations.length) return (
    <EmptyState icon="💬" title="No messages yet" description="Start a conversation from any listing page." />
  )
  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-800">
      {conversations.map(conv => (
        <Link
          key={conv.key}
          to={`/messages/${conv.listingId}/${conv.otherId}`}
          className={`flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${conv.key === currentKey ? 'bg-brand-50 dark:bg-brand-900/10' : ''}`}
        >
          <Avatar profile={conv.other} size={10} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                {conv.other?.full_name || 'User'}
              </p>
              <p className="text-xs text-gray-400 flex-shrink-0">{formatMsgTime(conv.lastAt)}</p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
              <span className="text-gray-400">Re: </span>{conv.listing?.title}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{conv.lastMessage}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

function ChatWindow({ listingId, receiverId, userId }) {
  const { messages, loading, sendMessage } = useMessages(listingId, userId, receiverId)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e) {
    e.preventDefault()
    if (!text.trim() || sending) return
    setSending(true)
    try {
      await sendMessage(text)
      setText('')
    } finally {
      setSending(false)
    }
  }

  if (loading) return <div className="flex-1 flex justify-center items-center"><Spinner size="lg" /></div>

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-sm text-gray-400 mt-10">No messages yet. Say hello!</div>
        )}
        {messages.map(msg => {
          const isMe = msg.sender_id === userId
          return (
            <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
              {!isMe && <Avatar profile={msg.sender} size={7} />}
              <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                isMe
                  ? 'bg-brand-500 text-white rounded-br-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-sm'
              }`}>
                <p>{msg.content}</p>
                <p className={`text-[10px] mt-1 ${isMe ? 'text-brand-200' : 'text-gray-400'}`}>
                  {formatMsgTime(msg.created_at)}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message…"
          className="input flex-1"
          aria-label="Message input"
          autoFocus
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="btn-primary p-3 disabled:opacity-50"
          aria-label="Send message"
        >
          {sending ? <Spinner size="sm" /> : <Send size={16} />}
        </button>
      </form>
    </div>
  )
}

export default function MessagesPage() {
  const { listingId, receiverId } = useParams()
  const { user } = useAuth()
  const { conversations, loading } = useConversations(user?.id)
  const currentKey = listingId && receiverId ? `${listingId}__${receiverId}` : null
  const currentConv = conversations.find(c => c.key === currentKey)

  const showSidebar = !listingId || window.innerWidth >= 768

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-4rem)] flex animate-fade-in border-x border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Sidebar */}
      <div className={`${listingId ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-shrink-0 flex-col border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950`}>
        <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
          <h1 className="font-bold text-lg text-gray-900 dark:text-white">Messages</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ConversationList conversations={conversations} loading={loading} currentKey={currentKey} userId={user?.id} />
        </div>
      </div>

      {/* Chat area */}
      {listingId && receiverId ? (
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 min-w-0">
          {/* Chat header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
            <Link to="/messages" className="md:hidden btn-ghost p-1.5" aria-label="Back to messages">
              <ArrowLeft size={18} />
            </Link>
            {currentConv ? (
              <>
                <Avatar profile={currentConv.other} size={9} />
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{currentConv.other?.full_name || 'User'}</p>
                  <Link to={`/listing/${listingId}`} className="text-xs text-brand-500 hover:underline truncate block">
                    Re: {currentConv.listing?.title}
                  </Link>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">Conversation</p>
            )}
          </div>
          <ChatWindow listingId={listingId} receiverId={receiverId} userId={user?.id} />
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
          <EmptyState icon="💬" title="Select a conversation" description="Choose a message thread from the left to start chatting." />
        </div>
      )}
    </div>
  )
}
