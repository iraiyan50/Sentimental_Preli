import { useState, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator
} from '@chatscope/chat-ui-kit-react';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { db } from '../firebaseConfig'; // Your Firestore instance

const API_KEY = "xai-NZFshboSYDWkJ7m1v0PrGEf52K8PrYVQcH2LUPVgjSO4tUa47D980JffECISr4w5OweJEGFszAXxFXEz"; 
const systemMessage = { 
  "role": "system", "content": "You are Grok, a chatbot inspired by the Hitchhiker's Guide to the Galaxy. You will suggest recipes based on available ingredients."
};

function Chat() {
  const [messages, setMessages] = useState([
    {
      message: " Ask me anything, and I will help you find recipes from the items you have!",
      sentTime: "just now",
      sender: "Grok"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [availableItems, setAvailableItems] = useState([]);  // State to hold available items

  // Fetch items from Firestore when component mounts
  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "Items"));
      const fetchedItems = querySnapshot.docs.map((doc) => doc.data().name);
      setAvailableItems(fetchedItems);
    };

    fetchItems();
  }, []); 

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setIsTyping(true);
    await processMessageToGrok(newMessages);
  };

  // Process the message to Grok with available items context
  async function processMessageToGrok(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === "Grok" ? "assistant" : "user";
      return { role: role, content: messageObject.message };
    });

    // Append available items as context
    const availableItemsText = `Here are the ingredients you have: ${availableItems.join(", ")}.`;
    const apiRequestBody = {
      "model": "grok-beta",
      "messages": [systemMessage, ...apiMessages, { role: "system", content: availableItemsText }],
      "stream": false,
      "temperature": 0
    };

    await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    })
      .then((data) => data.json())
      .then((data) => {
        setMessages([
          ...chatMessages,
          { message: data.choices[0].message.content, sender: "Grok" }
        ]);
        setIsTyping(false);
      });
  }

  return (
    <div className="Chat">
      <MainContainer>
        <ChatContainer>
          <MessageList
            scrollBehavior="smooth"
            typingIndicator={isTyping ? <TypingIndicator content="Grok is typing..." /> : null}
          >
            {messages.map((msg, idx) => (
              <Message key={idx} model={msg} />
            ))}
          </MessageList>
          <MessageInput placeholder="Type a message..." onSend={handleSend} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}

export default Chat;
