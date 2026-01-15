import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Image, Smile, ArrowLeft, Phone, Video, MoreVertical, BadgeCheck } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockUsers } from '@/lib/mock-data';
import { cn, formatTimeAgo } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date;
}

const mockMessages: Message[] = [
  { id: '1', content: 'Hey! How are you?', senderId: 'other', createdAt: new Date(Date.now() - 1000 * 60 * 60) },
  { id: '2', content: 'I\'m doing great! Just finished a big project 🎉', senderId: 'me', createdAt: new Date(Date.now() - 1000 * 60 * 55) },
  { id: '3', content: 'That\'s awesome! What was it about?', senderId: 'other', createdAt: new Date(Date.now() - 1000 * 60 * 50) },
  { id: '4', content: 'It was a social media platform, kind of like this one!', senderId: 'me', createdAt: new Date(Date.now() - 1000 * 60 * 45) },
  { id: '5', content: 'That sounds really cool. Would love to see it sometime!', senderId: 'other', createdAt: new Date(Date.now() - 1000 * 60 * 40) },
  { id: '6', content: 'Sure! I\'ll send you the link when it\'s live', senderId: 'me', createdAt: new Date(Date.now() - 1000 * 60 * 5) },
];

export default function ChatRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const user = mockUsers.find(u => u.id === id) || mockUsers[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content: newMessage,
      senderId: 'me',
      createdAt: new Date(),
    }]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="glass-strong border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/messages')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.displayName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm flex items-center gap-1">
              {user.displayName}
              {user.verified && <BadgeCheck className="h-4 w-4 text-primary fill-primary/20" />}
            </p>
            <p className="text-xs text-green-500">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isMe = message.senderId === 'me';
          const showTime = index === 0 || 
            (new Date(messages[index - 1].createdAt).getTime() - message.createdAt.getTime()) > 1000 * 60 * 10;
          
          return (
            <div key={message.id}>
              {showTime && (
                <p className="text-center text-xs text-muted-foreground my-4">
                  {formatTimeAgo(message.createdAt)}
                </p>
              )}
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn('flex', isMe ? 'justify-end' : 'justify-start')}
              >
                <div className={cn(
                  'max-w-[75%] rounded-2xl px-4 py-2.5',
                  isMe 
                    ? 'gradient-primary text-primary-foreground rounded-br-md' 
                    : 'bg-secondary text-foreground rounded-bl-md'
                )}>
                  <p className="text-sm">{message.content}</p>
                </div>
              </motion.div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="glass-strong border-t border-border p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="shrink-0">
            <Image className="h-5 w-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message..."
              className="pr-10 rounded-full bg-secondary/50 border-0"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <Smile className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
          <Button 
            onClick={handleSend}
            disabled={!newMessage.trim()}
            size="icon"
            className="shrink-0 rounded-full gradient-primary text-primary-foreground"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
