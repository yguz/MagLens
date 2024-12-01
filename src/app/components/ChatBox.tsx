interface ChatBoxProps {
    history: { user: string; bot: string }[];
  }
  
  const ChatBox = ({ history }: ChatBoxProps) => (
    <div className="chatbox">
      {history.map((entry, idx) => (
        <div key={idx} className="chat-entry">
          <div className="user-message">{entry.user}</div>
          <div className="bot-response">{entry.bot}</div>
        </div>
      ))}
    </div>
  );
  
  export default ChatBox;
  