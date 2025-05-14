import React, { useState, useEffect, useRef } from "react";
import { Input, Button } from "reactstrap";
import axiosInstance from "../../helpers/axiosConfig";
import "./ChatNew.css";
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

const Chat = () => {
  const [query, setQuery] = useState("");
  const [responses, setResponses] = useState([]);
  const [threadId, setThreadId] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const username = localStorage.getItem("username") || "User";
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const getThreads = async () => {
      try {
        const response = await axiosInstance.get(`/chat/get-user-threads/${username}`);
        setPreviousChats(response);
      } catch (error) {
        console.error("Error fetching threads:", error.response ? error.response : error.message);
      }
    };

    getThreads();
  }, [username]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [responses]);

  const handleSendQuery = async () => {
    if (!query.trim()) return;

    const userId = localStorage.getItem("userId");
    try {
      setIsLoading(true);
      setResponses(prev => [
        ...prev,
        { text: query, isUser: true, username },
        { text: "Düşünüyor...", isUser: false, username: "LimoAI" }
      ]);

      const requestBody = { userId, query };
      if (threadId) {
        requestBody.threadId = threadId;
      }

      const response = await fetch("http://localhost:3000/api/chat/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        aiResponse += chunk;

        setResponses(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { text: aiResponse, isUser: false, username: "LimoAI" };
          return updated;
        });
      }

      const newThreadId = response.headers.get("thread-id");
      if (newThreadId) setThreadId(newThreadId);

      setQuery("");
    } catch (err) {
      console.error("Chat error:", err);
      setResponses(prev => [
        ...prev,
        { text: "Yanıt alınamadı. Lütfen tekrar deneyin.", isUser: false, username: "LimoAI" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendQuery();
    }
  };

  const handleChatClick = (chatThreadId) => {
    const selectedThread = previousChats.find(chat => chat.Id === chatThreadId);
    const openAIThreadId = selectedThread?.ThreadId;
    if (!openAIThreadId) return;

    setThreadId(openAIThreadId);

    const getThreadMessages = async () => {
      try {
        const response = await axiosInstance.get(`/chat/get-thread-messages/${openAIThreadId}`);
        const fetched = response.flatMap(msg => [
          { text: msg.Query, isUser: true, username },
          { text: msg.Response, isUser: false, username: "LimoAI" },
        ]);
        setResponses(fetched);
      } catch (err) {
        console.error("Error fetching thread messages:", err);
      }
    };

    getThreadMessages();
  };

  // Effect to create and inject the sidebar on component mount
  useEffect(() => {
    // Function to create the sidebar element
    const createSidebar = () => {
      // Remove any existing sidebar to prevent duplicates
      const existingSidebar = document.querySelector('.limonian-right-sidebar');
      if (existingSidebar) {
        existingSidebar.remove();
      }

      // Create the sidebar container
      const sidebar = document.createElement('div');
      sidebar.className = 'limonian-right-sidebar';

      // Create the header
      const header = document.createElement('div');
      header.className = 'limonian-sidebar-header';
      
      const title = document.createElement('h5');
      title.textContent = 'Önceki Konuşmalar';
      header.appendChild(title);
      
      // Create the content container
      const content = document.createElement('div');
      content.className = 'limonian-sidebar-content';
      
      // Create the history list
      const historyList = document.createElement('ul');
      historyList.className = 'limonian-history-list';
      
      // Add chat history items
      if (Array.isArray(previousChats)) {
        previousChats.forEach(chat => {
          const listItem = document.createElement('li');
          listItem.className = 'limonian-history-item';
          
          const button = document.createElement('button');
          button.className = 'limonian-history-button';
          button.onclick = () => handleChatClick(chat.Id);
          
          const titleDiv = document.createElement('div');
          titleDiv.className = 'limonian-history-title';
          titleDiv.textContent = chat.Title;
          
          const dateDiv = document.createElement('div');
          dateDiv.className = 'limonian-history-date';
          dateDiv.textContent = new Date(chat.CreatedAt).toLocaleString();
          
          button.appendChild(titleDiv);
          button.appendChild(dateDiv);
          listItem.appendChild(button);
          historyList.appendChild(listItem);
        });
      }
      
      content.appendChild(historyList);
      
      // Assemble the sidebar
      sidebar.appendChild(header);
      sidebar.appendChild(content);
      
      // Attach to the parent container
      const chatContainer = document.querySelector('.limonian-chat-container');
      if (chatContainer) {
        chatContainer.appendChild(sidebar);
      } else {
        // Fallback to app-content if the chat container isn't found
        const appContent = document.querySelector('.app-content');
        if (appContent) {
          appContent.appendChild(sidebar);
        }
      }
    };

    // Create the sidebar on mount and whenever previousChats changes
    createSidebar();

    // Clean up on unmount
    return () => {
      const sidebar = document.querySelector('.limonian-right-sidebar');
      if (sidebar) {
        sidebar.remove();
      }
    };
  }, [previousChats, handleChatClick]);

  return (
    <div className="limonian-chat-container">
      {/* Main Chat Area */}
      <div className="limonian-chat-area">
        <div className="limonian-messages">
          {responses.map((response, idx) => (
            <div key={idx} className={`limonian-bubble ${response.isUser ? "user" : "bot"}`}>
              {!response.isUser && (
                <strong className="limonian-username">{response.username}</strong>
              )}
              <p className="limonian-text">{response.text}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="limonian-input-container">
          <Input
            type="text"
            placeholder="Mesajınızı yazın..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="limonian-input-field"
          />
          <Button
            color="primary"
            onClick={handleSendQuery}
            disabled={isLoading}
            className="limonian-send-btn"
          >
            {isLoading ? "Gönderiliyor..." : "Gönder"}
          </Button>
        </div>
      </div>
      
      {/* The sidebar will be injected via the useEffect above */}
    </div>
  );
};

export default Chat;