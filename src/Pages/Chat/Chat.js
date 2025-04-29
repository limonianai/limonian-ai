import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Input, Button, Card, CardBody } from "reactstrap";
import axiosInstance from "../../helpers/axiosConfig";
import "./Chat.css";
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

  return (
   
      <Container fluid className="h-100 p-0">
        <Row className="h-100 g-0">
          <Col md={3} className="chat-sidebar">
            <Card className="h-100">
              <CardBody>
                <h5 className="sidebar-title">Önceki Konuşmalar</h5>
                <ul className="chat-thread-list">
                  {Array.isArray(previousChats) && previousChats.map(chat => (
                    <li key={chat.Id}>
                      <Button
                        color="light"
                        className="w-100 text-start chat-thread-button"
                        onClick={() => handleChatClick(chat.Id)}
                      >
                        {chat.Title} - {new Date(chat.CreatedAt).toLocaleString()}
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </Col>

       <Col md={12} className="chat-area">
       
            <div className="chat-messages">
              {responses.map((response, idx) => (
              <div className={`chat-bubble ${response.isUser ? "user" : "bot"}`}>
              {!response.isUser && (
                <strong className="d-block mb-1">{response.username}</strong>
              )}
              <p className="mb-0">{response.text}</p>
            </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
              <Input
                type="text"
                placeholder="Mesajınızı yazın..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="chat-input"
              />
              <Button
                color="primary"
                onClick={handleSendQuery}
                disabled={isLoading}
                className="chat-send-button"
              >
                {isLoading ? "Gönderiliyor..." : "Gönder"}
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
   
  );
};

export default Chat;