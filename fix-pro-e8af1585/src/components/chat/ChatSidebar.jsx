import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MessageCircle, Phone, Video, MoreVertical, Send, Paperclip } from "lucide-react";
import { Conversation, Message } from "@/api/entities";

export default function ChatSidebar() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      const data = await Conversation.list("-last_message_time");
      setConversations(data);
      if (data.length > 0 && !selectedConversation) {
        setSelectedConversation(data[0]);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      const data = await Message.filter({ conversation_id: conversationId }, "created_date");
      setMessages(data);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await Message.create({
        sender_name: "אתה",
        content: newMessage,
        conversation_id: selectedConversation.id,
        timestamp: new Date().toISOString()
      });

      setNewMessage("");
      loadMessages(selectedConversation.id);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('he-IL', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white mb-4">שיחות</h2>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <Input
            placeholder="חיפוש הודעות..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 bg-gray-800 border-gray-700 text-gray-300 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => setSelectedConversation(conversation)}
            className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800/50 transition-colors ${
              selectedConversation?.id === conversation.id ? 'bg-gray-800' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={conversation.avatar_url} />
                  <AvatarFallback className="bg-gray-700 text-white">
                    {conversation.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {conversation.is_online && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-white truncate">{conversation.name}</h3>
                  <span className="text-xs text-gray-400">
                    {formatTime(conversation.last_message_time)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400 truncate">{conversation.last_message}</p>
                  {conversation.unread_count > 0 && (
                    <Badge className="bg-blue-500 hover:bg-blue-600 text-white min-w-5 h-5 text-xs">
                      {conversation.unread_count}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      {selectedConversation && (
        <div className="border-t border-gray-800 flex flex-col h-96">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedConversation.avatar_url} />
                  <AvatarFallback className="bg-gray-700 text-white">
                    {selectedConversation.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-white">{selectedConversation.name}</h3>
                  <p className="text-xs text-gray-400">
                    {selectedConversation.is_online ? 'פעיל כעת' : 'לא פעיל'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_name === 'אתה' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    message.sender_name === 'אתה'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-200'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {formatTime(message.timestamp || message.created_date)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Input
                placeholder="הקלד הודעה..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 bg-gray-800 border-gray-700 text-gray-300 placeholder-gray-500"
              />
              <Button 
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}