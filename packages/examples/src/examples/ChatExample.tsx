interface Message {
  id: number;
  from: 'me' | 'them';
  text: string;
}

const messages: Message[] = [
  { id: 1, from: 'them', text: 'Hey! Did the deploy go out?' },
  { id: 2, from: 'me', text: 'Yep, just finished.' },
  { id: 3, from: 'them', text: 'Nice, those loading states look great!' },
  { id: 4, from: 'me', text: 'Nice 🎉' },
  { id: 5, from: 'me', text: 'Skeletons come from the real layout.' },
];

function ChatMessage({ message }: { message: Message }) {
  return (
    <div className={`chat-row chat-row--${message.from}`}>
      <div className="bubble">
        <p>{message.text}</p>
      </div>
    </div>
  );
}

function ChatExample() {
  const loading = useLoading();

  return (
    <div className="chat">
      {messages.map((message) => (
        <Meanwhile
          key={message.id}
          type="skeleton"
          loading={loading}
          cacheKey={`chat-message-${message.id}`}
        >
          <ChatMessage message={message} />
        </Meanwhile>
      ))}
    </div>
  );
}

render(<ChatExample />);
