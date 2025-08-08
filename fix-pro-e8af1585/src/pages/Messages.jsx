import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Phone, Video, MoreVertical, Send, Paperclip, Clock, MapPin, Users, Crown, Building, Check, CheckCheck, Image as ImageIcon } from "lucide-react";
import { Conversation, Message } from "@/api/entities";
import { motion, AnimatePresence } from "framer-motion";
import { slideX, fadeIn, listItem, cardHover, notificationSlide } from "@/lib/motionPresets";

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      // סימולציית הקלדה של הצד השני בתחילת שיחה
      setIsPartnerTyping(true);
      const t = setTimeout(() => setIsPartnerTyping(false), 1500 + Math.random() * 1500);
      return () => clearTimeout(t);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      const data = await Conversation.list("-last_message_time");
      
      // אם אין נתונים, ניצור נתוני דמו
      const demoConversations = data.length > 0 ? data : [
        {
          id: 1,
          name: "דני כהן",
          last_message: "תודה על השירות המעולה!",
          last_message_time: new Date().toISOString(),
          topic: "שירות לקוחות"
        },
        {
          id: 2,
          name: "שרה לוי",
          last_message: "מתי אפשר לקבוע פגישה?",
          last_message_time: new Date(Date.now() - 3600000).toISOString(),
          topic: "פגישת עבודה"
        },
        {
          id: 3,
          name: "חברת ABC בע״מ",
          last_message: "נשלח את המסמכים בהקדם",
          last_message_time: new Date(Date.now() - 7200000).toISOString(),
          topic: "עסקים"
        },
        {
          id: 4,
          name: "קבוצת פיתוח",
          last_message: "הפרויקט מתקדם כמתוכנן",
          last_message_time: new Date(Date.now() - 10800000).toISOString(),
          topic: "פיתוח"
        },
        {
          id: 5,
          name: "מיכל רוזן",
          last_message: "בוקר טוב! איך המצב?",
          last_message_time: new Date(Date.now() - 14400000).toISOString(),
          topic: "אישי"
        }
      ];
      
      // הוספת תמונות ונתונים מורחבים לשיחות
      const enrichedConversations = demoConversations.map((conv, index) => ({
        ...conv,
        avatar_url: `https://i.pravatar.cc/150?img=${index + 10}`,
        is_online: Math.random() > 0.4,
        last_seen: new Date(Date.now() - Math.random() * 86400000).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
        unread_count: Math.floor(Math.random() * 4),
        conversation_type: index === 2 ? 'business' : index === 3 ? 'group' : 'personal',
        phone: `05${Math.floor(Math.random() * 90000000) + 10000000}`,
        location: ['תל אביב', 'ירושלים', 'חיפה', 'באר שבע', 'נתניה'][index % 5]
      }));
      
      setConversations(enrichedConversations);
      if (enrichedConversations.length > 0 && !selectedConversation) {
        setSelectedConversation(enrichedConversations[0]);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const data = await Message.filter({ conversation_id: conversationId }, "created_date");
      if (data.length === 0) {
        // צור הודעות דמו אם אין
        const demo = [
          { sender_name: selectedConversation?.name || "אורח", content: "היי! מה נשמע?", conversation_id: conversationId, timestamp: new Date(Date.now() - 1000*60*40).toISOString() },
          { sender_name: "אתה", content: "מעולה! איך אפשר לעזור?", conversation_id: conversationId, timestamp: new Date(Date.now() - 1000*60*35).toISOString(), status: "read" },
          { sender_name: selectedConversation?.name || "אורח", content: "תוכל לשלוח הצעת מחיר?", conversation_id: conversationId, timestamp: new Date(Date.now() - 1000*60*30).toISOString() },
          { sender_name: selectedConversation?.name || "אורח", content: "", image_url: `https://picsum.photos/seed/${conversationId}/600/400`, conversation_id: conversationId, timestamp: new Date(Date.now() - 1000*60*25).toISOString() },
        ];
        for (const m of demo) {
          await Message.create(m);
        }
      }
      const refreshed = await Message.filter({ conversation_id: conversationId }, "created_date");
      setMessages(refreshed);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    try {
      const me = { name: "אתה", avatar: "" }; // Assuming current user info
      await Message.create({
        sender_name: me.name,
        sender_avatar: me.avatar,
        content: newMessage,
        conversation_id: selectedConversation.id,
        timestamp: new Date().toISOString(),
        status: "sent"
      });
      setNewMessage("");
      await loadMessages(selectedConversation.id);
      // סימולציית "נקרא" לאחר שנייה
      setTimeout(async () => {
        const refreshed = await Message.filter({ conversation_id: selectedConversation.id }, "created_date");
        const last = [...refreshed].reverse().find(m => m.sender_name === "אתה");
        if (last) {
          await Message.update(last.id, { status: "read" });
          const again = await Message.filter({ conversation_id: selectedConversation.id }, "created_date");
          setMessages(again);
        }
      }, 1200);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const onAttachClick = () => fileInputRef.current?.click();
  const onFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedConversation) return;
    const url = URL.createObjectURL(file);
    try {
      await Message.create({
        sender_name: "אתה",
        conversation_id: selectedConversation.id,
        image_url: url,
        timestamp: new Date().toISOString(),
        status: "sent"
      });
      await loadMessages(selectedConversation.id);
    } finally {
      e.target.value = "";
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', hour12: false });
  };
  
  const MessageItem = ({ message, senderAvatar }) => {
    const isSentByUser = message.sender_name === "אתה";

    if (message.message_type === 'topic_header') {
      return (
        <div className="flex justify-center my-6">
          <div className="bg-gradient-to-r from-blue-900/40 to-gray-800/40 border border-blue-700/30 rounded-lg p-4 text-center max-w-md">
            <p className="text-xs text-blue-300 font-bold tracking-wider">נושא השיחה</p>
            <h3 className="text-lg font-semibold text-white mt-1">{message.content}</h3>
          </div>
        </div>
      );
    }

    return (
      <div className={`flex items-end gap-3 mb-4 ${isSentByUser ? 'justify-end' : 'justify-start'}`}>
        {!isSentByUser && (
          <Avatar className="w-8 h-8 self-end">
            <AvatarImage src={senderAvatar} />
            <AvatarFallback className="bg-gray-600 text-white text-xs">{message.sender_name?.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        <div className={`max-w-md px-4 py-3 rounded-2xl ${
            isSentByUser 
              ? 'bg-blue-600 text-white rounded-br-md' 
              : 'bg-gray-700 text-gray-100 rounded-bl-md'
        }`}>
          {message.image_url ? (
            <img src={message.image_url} alt="attachment" className="rounded-lg max-h-64 object-cover mb-2" />
          ) : null}
          {message.content && <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>}
          <div className={`flex items-center gap-1 text-xs opacity-70 mt-2 ${isSentByUser ? 'justify-end' : 'justify-start'}`}>
            <span>{formatTime(message.timestamp || message.created_date)}</span>
            {isSentByUser && (
              message.status === 'read' ? <CheckCheck className="w-3.5 h-3.5 text-emerald-300" /> : <Check className="w-3.5 h-3.5" />
            )}
          </div>
        </div>
        {isSentByUser && (
          <Avatar className="w-8 h-8 self-end">
            <AvatarFallback className="bg-blue-600 text-white text-xs">א</AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  };

  return (
    <motion.div 
      className="grid grid-cols-12 gap-0 w-full h-[calc(100vh-160px)] bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Conversations List - Left Side */}
      <motion.div 
        className="col-span-4 xl:col-span-3 bg-gray-800 border-l border-gray-700 flex flex-col"
        initial={{ x: -320, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700 sticky top-0 z-10 bg-gray-800/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur">
          <h2 className="text-xl font-bold text-white mb-4">הודעות</h2>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="חיפוש שיחות..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
        </div>
        
        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {filteredConversations.map((conv, index) => (
            <motion.div
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={`flex gap-3 p-4 cursor-pointer transition-all duration-200 border-b border-gray-700/30 hover:bg-gray-700/30 ${
                selectedConversation?.id === conv.id ? 'bg-gray-700 border-r-4 border-r-blue-500 shadow-lg' : ''
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.05,
                ease: [0.4, 0, 0.2, 1]
              }}
              whileHover={{ 
                x: 4,
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                transition: { duration: 0.2 }
              }}
            >
              <div className="relative">
                <Avatar className="w-14 h-14 ring-2 ring-gray-600">
                  <AvatarImage src={conv.avatar_url} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
                    {conv.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {conv.is_online ? (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                ) : (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-gray-500 rounded-full border-2 border-gray-800"></div>
                )}
                
                {/* Conversation Type Badge */}
                {conv.conversation_type === 'group' && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <Users className="w-3 h-3 text-white" />
                  </div>
                )}
                {conv.conversation_type === 'business' && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                    <Building className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white truncate text-base">{conv.name}</h3>
                    {conv.conversation_type === 'business' && (
                      <Crown className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block">{formatTime(conv.last_message_time)}</span>
                    {!conv.is_online && (
                      <span className="text-xs text-gray-500 block">נראה {conv.last_seen}</span>
                    )}
                  </div>
                </div>
                
                {/* Location and Phone */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-500">{conv.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-500">{conv.phone}</span>
                  </div>
                </div>
                
                {conv.topic && (
                  <Badge variant="secondary" className="bg-blue-900/60 text-blue-300 text-xs py-1 px-2 border-none mb-2 rounded-full">
                    📋 {conv.topic}
                  </Badge>
                )}
                
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400 truncate flex-1">{conv.last_message}</p>
                  {conv.unread_count > 0 && (
                    <motion.div 
                      className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center ml-2 shadow-lg relative"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                      {conv.unread_count}
                      <motion.span
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                        animate={{ 
                          scale: [1, 1.5],
                          opacity: [0.7, 0]
                        }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeOut"
                        }}
                      />
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
            ))}
            
            {filteredConversations.length === 0 && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-gray-500 text-6xl mb-4">💬</div>
                <p className="text-gray-400">לא נמצאו שיחות</p>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        </motion.div>

      {/* Chat Area - Right Side */}
      {selectedConversation ? (
        <motion.div 
          className="col-span-8 xl:col-span-9 flex flex-col bg-gray-900"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-800 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-12 h-12 ring-2 ring-blue-500/50">
                    <AvatarImage src={selectedConversation.avatar_url} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                      {selectedConversation.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {selectedConversation.is_online && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  )}
                  
                  {/* Type Badge */}
                  {selectedConversation.conversation_type === 'group' && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <Users className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {selectedConversation.conversation_type === 'business' && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                      <Building className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white text-lg">{selectedConversation.name}</h3>
                    {selectedConversation.conversation_type === 'business' && (
                      <Crown className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${selectedConversation.is_online ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                      <span className="text-gray-400">
                        {selectedConversation.is_online ? 'פעיל עכשיו' : `נראה לאחרונה ${selectedConversation.last_seen}`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs mt-1">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-500">{selectedConversation.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-500">{selectedConversation.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: message.sent ? 8 : -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <MessageItem message={message} senderAvatar={selectedConversation.avatar_url} />
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <div className="p-4 border-t border-gray-700 bg-gray-800 sticky bottom-0">
            <div className="flex items-center gap-3 bg-gray-700/60 rounded-full px-3 py-2 focus-within:ring-2 focus-within:ring-blue-600 transition-shadow w-full">
              {/* קובץ מצורף */}
              <input ref={fileInputRef} onChange={onFileSelected} type="file" accept="image/*" className="hidden" />
              <Button onClick={onAttachClick} variant="ghost" size="icon" className="text-gray-300 hover:bg-gray-600/40 hover:text-white rounded-full">
                <ImageIcon className="w-5 h-5" />
              </Button>

              {/* טקסט */}
              <Input
                placeholder="הקלד הודעה..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 min-w-0 bg-transparent border-none text-white placeholder-gray-400 focus-visible:outline-none focus-visible:ring-0"
              />

              {/* שליחה */}
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                size="icon"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 disabled:opacity-50 disabled:pointer-events-none shadow-md"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            {isPartnerTyping && (
              <div className="px-6 pt-1 text-xs text-gray-400">מקבל מקליד...</div>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="flex-1 flex items-center justify-center text-gray-400 bg-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div 
              className="text-4xl mb-4"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              💬
            </motion.div>
            <motion.p 
              className="text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              בחר שיחה כדי להתחיל
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}