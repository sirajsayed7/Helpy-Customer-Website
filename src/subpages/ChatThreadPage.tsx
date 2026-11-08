import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Send, Paperclip, MessageCircle, RefreshCw } from 'lucide-react'
import { useNav } from '../context/NavContext'
import { helpyChat, type ChatMessage } from '../api/chat'

export default function ChatThreadPage() {
  const { goBack, params } = useNav()
  const peerId = String(params?.peerId || '')
  const name = params?.name || 'Conversation'
  const image = params?.providerImage || ''
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [ownId, setOwnId] = useState('')
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)
  const load = async () => { if (!peerId || !helpyChat.configured) { setLoading(false); return }; setLoading(true); try { const [rows, id] = await Promise.all([helpyChat.getMessages(peerId), helpyChat.currentUserId()]); setMessages(rows); setOwnId(id); setError('') } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to load conversation.') } finally { setLoading(false) } }
  useEffect(() => { void load(); const timer = window.setInterval(() => void load(), 5000); return () => window.clearInterval(timer) }, [peerId])
  const send = async () => { const body = draft.trim(); if (!body || !peerId) return; try { await helpyChat.sendMessage(peerId, body); setDraft(''); await load() } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to send message.') } }
  return <div className="flex flex-1 flex-col overflow-hidden bg-[#f4f6ff]">
    <header className="flex items-center gap-3 bg-white px-4 pb-3 pt-3 shadow-sm"><button onClick={goBack} className="grid h-9 w-9 place-items-center rounded-xl bg-gray-100"><ArrowLeft size={19} className="text-gray-600"/></button><div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-blue-50 text-sm font-black text-[#0967ff]">{image ? <img src={image} alt="" className="h-full w-full object-cover"/> : name.slice(0, 2).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-[15px] font-bold text-gray-900">{name}</p><p className="text-[11px] font-semibold text-gray-400">{params?.online ? 'Online' : 'Helpy business'}</p></div><button onClick={() => void load()} className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50"><RefreshCw size={16} className={loading ? 'animate-spin text-brand-500' : 'text-brand-500'}/></button></header>
    <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">{loading && <p className="pt-12 text-center text-[13px] font-semibold text-gray-500">Loading conversation…</p>}{!loading && !messages.length && <div className="grid h-full place-items-center text-center"><div><MessageCircle size={32} className="mx-auto text-blue-300"/><p className="mt-3 text-[14px] font-black text-gray-800">Start the conversation</p><p className="mt-1 text-[12px] text-gray-500">Your messages with {name} will appear here.</p></div></div>}{messages.map(message => { const mine = message.fromId === ownId; const date = new Date(Number(message.sent) || message.sent); const time = Number.isNaN(date.getTime()) ? '' : date.toLocaleTimeString('en-QA', { hour: 'numeric', minute: '2-digit' }); return <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[78%] rounded-2xl px-4 py-2.5 shadow-sm ${mine ? 'rounded-br-sm bg-brand-500 text-white' : 'rounded-bl-sm bg-white text-gray-800'}`}><p className="text-[13px] leading-5">{message.body}</p><p className={`mt-1 text-[10px] ${mine ? 'text-white/65' : 'text-gray-400'}`}>{time}</p></div></div> })}</div>
    <div className="border-t border-gray-100 bg-white p-3">{error && <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-[11px] font-semibold text-red-600">{error}</p>}<div className="flex items-center gap-2"><input ref={fileInput} type="file" className="sr-only" onChange={() => setError('Attachments need the Helpy upload endpoint before they can be sent. The file was not uploaded.')}/><button onClick={() => fileInput.current?.click()} className="grid h-9 w-9 place-items-center rounded-xl bg-gray-100"><Paperclip size={16} className="text-gray-400"/></button><div className="flex min-w-0 flex-1 items-center rounded-2xl bg-gray-100 px-3 py-2"><input className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-gray-400" placeholder="Type a message…" value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => event.key === 'Enter' && void send()}/></div><button onClick={() => void send()} className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 shadow-sm"><Send size={15} className="text-white"/></button></div></div>
  </div>
}
