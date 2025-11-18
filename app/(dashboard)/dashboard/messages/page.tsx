'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Search, Send, Plus, Paperclip, Smile,
  Check, CheckCheck, Clock, Archive, Star,
  Phone, Video, Info, Bell, BellOff, Download,
  Image as ImageIcon, File, MapPin, Users, Package
} from 'lucide-react'

type Conversation = {
  id: string
  type: 'direct' | 'group' | 'support'
  name: string
  avatar?: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isOnline?: boolean
  isPinned?: boolean
  isMuted?: boolean
  participants?: string[]
  role?: string
}

type Message = {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: string
  status: 'sending' | 'sent' | 'delivered' | 'read'
  type: 'text' | 'image' | 'file' | 'location' | 'donation'
  attachments?: any[]
  replyTo?: Message
  isEdited?: boolean
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showInfo, setShowInfo] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load mock conversations
    const mockConversations: Conversation[] = [
      {
        id: '1',
        type: 'direct',
        name: 'María González',
        avatar: 'https://i.pravatar.cc/150?u=maria',
        lastMessage: 'Gracias por la donación!',
        lastMessageTime: '10:30 AM',
        unreadCount: 2,
        isOnline: true,
        role: 'Beneficiario'
      },
      {
        id: '2',
        type: 'group',
        name: 'Centro San José',
        avatar: 'https://i.pravatar.cc/150?u=centro1',
        lastMessage: 'Pedro: Llegaron las cajas de alimentos',
        lastMessageTime: '9:45 AM',
        unreadCount: 5,
        participants: ['Pedro', 'Ana', 'Carlos', 'Luis'],
        isPinned: true
      },
      {
        id: '3',
        type: 'direct',
        name: 'Juan Pérez',
        avatar: 'https://i.pravatar.cc/150?u=juan',
        lastMessage: 'La entrega está en camino',
        lastMessageTime: 'Ayer',
        unreadCount: 0,
        isOnline: false,
        role: 'Conductor'
      },
      {
        id: '4',
        type: 'support',
        name: 'Soporte DONA+',
        avatar: 'https://i.pravatar.cc/150?u=support',
        lastMessage: 'Hola! ¿En qué puedo ayudarte?',
        lastMessageTime: 'Ayer',
        unreadCount: 1,
        isPinned: true
      },
      {
        id: '5',
        type: 'direct',
        name: 'Ana Rodríguez',
        avatar: 'https://i.pravatar.cc/150?u=ana',
        lastMessage: 'Los juguetes fueron muy bien recibidos',
        lastMessageTime: '2 días',
        unreadCount: 0,
        isOnline: true,
        role: 'Donante'
      },
      {
        id: '6',
        type: 'group',
        name: 'Voluntarios Los Alcarrizos',
        avatar: 'https://i.pravatar.cc/150?u=voluntarios',
        lastMessage: 'Carmen: ¿Quién puede mañana?',
        lastMessageTime: '3 días',
        unreadCount: 12,
        participants: ['Carmen', 'Roberto', 'Lucia', 'Miguel', 'Sofia'],
        isMuted: true
      }
    ]

    setConversations(mockConversations)
    if (mockConversations.length > 0 && !selectedConversation) {
      setSelectedConversation(mockConversations[0])
    }
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      // Load messages for selected conversation
      const mockMessages: Message[] = [
        {
          id: '1',
          conversationId: selectedConversation.id,
          senderId: '2',
          senderName: selectedConversation.name,
          senderAvatar: selectedConversation.avatar,
          content: 'Hola! Vi tu publicación sobre la donación de ropa',
          timestamp: '10:00 AM',
          status: 'read',
          type: 'text'
        },
        {
          id: '2',
          conversationId: selectedConversation.id,
          senderId: '1',
          senderName: 'Yo',
          content: 'Hola! Sí, tengo ropa de niños en buen estado',
          timestamp: '10:05 AM',
          status: 'read',
          type: 'text'
        },
        {
          id: '3',
          conversationId: selectedConversation.id,
          senderId: '2',
          senderName: selectedConversation.name,
          senderAvatar: selectedConversation.avatar,
          content: 'Perfecto! ¿De qué edades?',
          timestamp: '10:10 AM',
          status: 'read',
          type: 'text'
        },
        {
          id: '4',
          conversationId: selectedConversation.id,
          senderId: '1',
          senderName: 'Yo',
          content: 'Tengo de 3-5 años y 6-8 años. También algunos zapatos',
          timestamp: '10:15 AM',
          status: 'read',
          type: 'text'
        },
        {
          id: '5',
          conversationId: selectedConversation.id,
          senderId: '1',
          senderName: 'Yo',
          content: 'Te envío algunas fotos',
          timestamp: '10:16 AM',
          status: 'read',
          type: 'text'
        },
        {
          id: '6',
          conversationId: selectedConversation.id,
          senderId: '1',
          senderName: 'Yo',
          content: '',
          timestamp: '10:17 AM',
          status: 'read',
          type: 'image',
          attachments: [
            'https://images.unsplash.com/photo-1594213261338-5a6876cd2f36?w=400',
            'https://images.unsplash.com/photo-1622290291165-d341f1938b8a?w=400'
          ]
        },
        {
          id: '7',
          conversationId: selectedConversation.id,
          senderId: '2',
          senderName: selectedConversation.name,
          senderAvatar: selectedConversation.avatar,
          content: 'Excelente! Se ven en muy buen estado',
          timestamp: '10:20 AM',
          status: 'read',
          type: 'text'
        },
        {
          id: '8',
          conversationId: selectedConversation.id,
          senderId: '2',
          senderName: selectedConversation.name,
          senderAvatar: selectedConversation.avatar,
          content: '¿Puedes llevarlos al centro de acopio o prefieres que los recojamos?',
          timestamp: '10:25 AM',
          status: 'delivered',
          type: 'text'
        },
        {
          id: '9',
          conversationId: selectedConversation.id,
          senderId: '1',
          senderName: 'Yo',
          content: 'Puedo llevarlos mañana por la tarde',
          timestamp: '10:28 AM',
          status: 'delivered',
          type: 'text'
        },
        {
          id: '10',
          conversationId: selectedConversation.id,
          senderId: '2',
          senderName: selectedConversation.name,
          senderAvatar: selectedConversation.avatar,
          content: 'Perfecto! Te comparto la ubicación',
          timestamp: '10:29 AM',
          status: 'sent',
          type: 'text'
        },
        {
          id: '11',
          conversationId: selectedConversation.id,
          senderId: '2',
          senderName: selectedConversation.name,
          senderAvatar: selectedConversation.avatar,
          content: '',
          timestamp: '10:30 AM',
          status: 'sent',
          type: 'location',
          attachments: [{
            lat: 18.4861,
            lng: -69.9312,
            address: 'Centro Comunitario San José, Av. Independencia #45, Santo Domingo'
          }]
        },
        {
          id: '12',
          conversationId: selectedConversation.id,
          senderId: '2',
          senderName: selectedConversation.name,
          senderAvatar: selectedConversation.avatar,
          content: 'Gracias por la donación!',
          timestamp: '10:30 AM',
          status: 'sent',
          type: 'text'
        }
      ]
      setMessages(mockMessages)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: Date.now().toString(),
      conversationId: selectedConversation.id,
      senderId: '1',
      senderName: 'Yo',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('es-DO', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'sending',
      type: 'text'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev =>
        prev.map(m => m.id === message.id ? { ...m, status: 'sent' } : m)
      )
    }, 500)

    setTimeout(() => {
      setMessages(prev =>
        prev.map(m => m.id === message.id ? { ...m, status: 'delivered' } : m)
      )
    }, 1500)

    // Simulate typing indicator and response
    setTimeout(() => setIsTyping(true), 2000)
    setTimeout(() => {
      setIsTyping(false)
      const response: Message = {
        id: (Date.now() + 1).toString(),
        conversationId: selectedConversation.id,
        senderId: '2',
        senderName: selectedConversation.name,
        senderAvatar: selectedConversation.avatar,
        content: 'Recibido! Te responderé pronto.',
        timestamp: new Date().toLocaleTimeString('es-DO', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        status: 'read',
        type: 'text'
      }
      setMessages(prev => [...prev, response])
    }, 4000)
  }

  const getMessageStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-gray-400" />
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />
    }
  }

  const renderMessage = (message: Message) => {
    const isMe = message.senderId === '1'

    if (message.type === 'image') {
      return (
        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}>
          <div className={`max-w-md ${isMe ? 'order-2' : 'order-1'}`}>
            <div className={`${isMe ? 'text-right' : 'text-left'} mb-1`}>
              <span className="text-xs text-gray-500">
                {message.senderName} • {message.timestamp}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {message.attachments?.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt="Attachment"
                  className="rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                />
              ))}
            </div>
            {isMe && (
              <div className="flex justify-end mt-1">
                {getMessageStatusIcon(message.status)}
              </div>
            )}
          </div>
          {!isMe && message.senderAvatar && (
            <img
              src={message.senderAvatar}
              alt={message.senderName}
              className="w-8 h-8 rounded-full mr-3 order-0"
            />
          )}
        </div>
      )
    }

    if (message.type === 'location') {
      const location = message.attachments?.[0]
      return (
        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}>
          <div className={`max-w-sm ${isMe ? 'order-2' : 'order-1'}`}>
            <div className={`${isMe ? 'text-right' : 'text-left'} mb-1`}>
              <span className="text-xs text-gray-500">
                {message.senderName} • {message.timestamp}
              </span>
            </div>
            <div className={`${
              isMe ? 'bg-blue-500 text-white' : 'bg-gray-100'
            } rounded-lg p-3 cursor-pointer hover:opacity-90 transition-opacity`}>
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className={`text-sm font-medium ${isMe ? 'text-white' : 'text-gray-900'}`}>
                    Ubicación compartida
                  </p>
                  <p className={`text-xs ${isMe ? 'text-blue-100' : 'text-gray-500'} mt-1`}>
                    {location?.address}
                  </p>
                </div>
              </div>
            </div>
            {isMe && (
              <div className="flex justify-end mt-1">
                {getMessageStatusIcon(message.status)}
              </div>
            )}
          </div>
          {!isMe && message.senderAvatar && (
            <img
              src={message.senderAvatar}
              alt={message.senderName}
              className="w-8 h-8 rounded-full mr-3 order-0"
            />
          )}
        </div>
      )
    }

    return (
      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}>
        {!isMe && message.senderAvatar && (
          <img
            src={message.senderAvatar}
            alt={message.senderName}
            className="w-8 h-8 rounded-full mr-3"
          />
        )}
        <div className={`max-w-sm ${isMe ? 'order-2' : 'order-1'}`}>
          {selectedConversation?.type === 'group' && !isMe && (
            <div className="text-xs text-gray-500 mb-1">{message.senderName}</div>
          )}
          <div className={`inline-block px-4 py-2 rounded-lg ${
            isMe
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-800'
          }`}>
            <p className="text-sm">{message.content}</p>
            <div className={`text-xs mt-1 ${
              isMe ? 'text-blue-100' : 'text-gray-500'
            }`}>
              {message.timestamp}
              {message.isEdited && ' (editado)'}
            </div>
          </div>
          {isMe && (
            <div className="flex justify-end mt-1">
              {getMessageStatusIcon(message.status)}
            </div>
          )}
        </div>
      </div>
    )
  }

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Search Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Mensajes</h2>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Plus className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar conversación..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map(conversation => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <img
                    src={conversation.avatar || 'https://i.pravatar.cc/150'}
                    alt={conversation.name}
                    className="w-12 h-12 rounded-full"
                  />
                  {conversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.name}
                      {conversation.isPinned && (
                        <Star className="inline-block ml-1 h-3 w-3 text-yellow-500 fill-current" />
                      )}
                      {conversation.isMuted && (
                        <BellOff className="inline-block ml-1 h-3 w-3 text-gray-400" />
                      )}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {conversation.lastMessageTime}
                    </span>
                  </div>
                  {conversation.role && (
                    <span className="text-xs text-blue-600 font-medium">
                      {conversation.role}
                    </span>
                  )}
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {conversation.lastMessage}
                  </p>
                  {conversation.type === 'group' && conversation.participants && (
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <Users className="h-3 w-3 mr-1" />
                      {conversation.participants.length} participantes
                    </div>
                  )}
                </div>
                {conversation.unreadCount > 0 && (
                  <div className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {conversation.unreadCount}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={selectedConversation.avatar || 'https://i.pravatar.cc/150'}
                    alt={selectedConversation.name}
                    className="w-10 h-10 rounded-full"
                  />
                  {selectedConversation.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {selectedConversation.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedConversation.isOnline ? 'En línea' : 'Desconectado'}
                    {selectedConversation.type === 'group' && selectedConversation.participants && (
                      <span> • {selectedConversation.participants.length} participantes</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Phone className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Video className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Info className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {messages.map(message => renderMessage(message))}
            {isTyping && (
              <div className="flex items-center space-x-2 text-gray-500">
                <img
                  src={selectedConversation.avatar}
                  alt={selectedConversation.name}
                  className="w-6 h-6 rounded-full"
                />
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex items-end space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Paperclip className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ImageIcon className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  placeholder="Escribe un mensaje..."
                  rows={1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors">
                  <Smile className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className={`p-2 rounded-lg transition-colors ${
                  newMessage.trim()
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="bg-gray-200 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
              <Send className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Selecciona una conversación
            </h3>
            <p className="text-sm text-gray-500">
              Elige un chat de la lista para empezar a conversar
            </p>
          </div>
        </div>
      )}

      {/* Info Sidebar */}
      {showInfo && selectedConversation && (
        <div className="w-80 bg-white border-l border-gray-200 p-6">
          <div className="text-center mb-6">
            <img
              src={selectedConversation.avatar || 'https://i.pravatar.cc/150'}
              alt={selectedConversation.name}
              className="w-24 h-24 rounded-full mx-auto mb-3"
            />
            <h3 className="text-lg font-medium text-gray-900">
              {selectedConversation.name}
            </h3>
            {selectedConversation.role && (
              <p className="text-sm text-gray-500">{selectedConversation.role}</p>
            )}
            {selectedConversation.type === 'group' && (
              <p className="text-sm text-gray-500 mt-1">
                {selectedConversation.participants?.length} participantes
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Acciones</h4>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Silenciar notificaciones</span>
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2">
                  <Star className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Fijar conversación</span>
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2">
                  <Archive className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Archivar chat</span>
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2">
                  <Download className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Exportar conversación</span>
                </button>
              </div>
            </div>

            {selectedConversation.type === 'group' && selectedConversation.participants && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Participantes</h4>
                <div className="space-y-2">
                  {selectedConversation.participants.map((participant, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <img
                        src={`https://i.pravatar.cc/150?u=${participant}`}
                        alt={participant}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm text-gray-700">{participant}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Archivos compartidos</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <ImageIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">12 fotos</span>
                </div>
                <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <File className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">3 documentos</span>
                </div>
                <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">2 ubicaciones</span>
                </div>
                <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">5 donaciones</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}