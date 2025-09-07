import { useState, useRef, useEffect } from "react";

// Expanded keywords and first-aid data
const firstAidData = [
  {
    id: "bleeding",
    title: "Severe bleeding",
    severity: "high",
    keywords: ["bleed","bleeds","bleeding","cut","cuts","wound","wounds","hemorrhage","hemorrhages","injury","injuries","laceration","lacerations"],
    steps: [
      "Call emergency services immediately if bleeding is severe or spurting.",
      "Wear gloves if available.",
      "Apply firm, direct pressure to the wound with a clean cloth or bandage.",
      "Elevate the injured area above heart level if possible.",
      "Keep the person calm and monitor for signs of shock.",
      "Do not remove embedded objects — apply pressure around them."
    ]
  },
  {
    id: "choking",
    title: "Choking (conscious adult)",
    severity: "high",
    keywords: ["choke","chokes","choking","airway","airways","can't breathe","cannot breathe","can't cough","cannot cough","obstruction","obstructed"],
    steps: [
      "Ask 'Are you choking?' If they can cough or speak, encourage forceful coughing.",
      "If they cannot breathe, call emergency services immediately.",
      "Give 5 back blows between the shoulder blades.",
      "If still obstructed, give up to 5 abdominal thrusts (Heimlich maneuver).",
      "Alternate back blows and abdominal thrusts until object is dislodged or person becomes unconscious."
    ]
  },
  {
    id: "burn",
    title: "Thermal burn (minor)",
    severity: "medium",
    keywords: ["burn","burns","scald","scalds","hot","thermal","blister","blisters"],
    steps: [
      "Remove the person from the source of heat.",
      "Cool the burn with running cool (not icy) water for 10-20 minutes.",
      "Remove tight items (rings, watch) from the burned area.",
      "Cover loosely with sterile, non-adhesive dressing.",
      "Do not apply creams, oils, or ice directly to the burn."
    ]
  },
  {
    id: "cpr",
    title: "CPR (adult)",
    severity: "high",
    keywords: ["cpr","no pulse","not breathing","cardiac arrest","heart stopped","resuscitation","heart attack","unconscious"],
    steps: [
      "Call emergency services immediately.",
      "Check responsiveness and breathing. If not breathing, start CPR.",
      "Place hands in the center of chest and give 30 chest compressions at 100-120/min, depth ~5-6 cm.",
      "After 30 compressions give 2 rescue breaths if trained.",
      "Continue cycles until help arrives or person recovers."
    ]
  }
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    // Auto-expand vertically based on content
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  const highlightKeywords = (text, keywords) => {
    let highlighted = text;
    keywords.forEach(k => {
      const regex = new RegExp(`(${k})`, "gi");
      highlighted = highlighted.replace(regex, "<b>$1</b>");
    });
    return highlighted;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { type: "user", text: input }]);
    const q = input.toLowerCase();
    const found = firstAidData.find(item =>
      item.keywords.some(k => q.includes(k)) || item.title.toLowerCase().includes(q)
    );

    setInput("");
    setTyping(true);

    setTimeout(() => {
      if (found) {
        const newMessages = found.steps.map((step) => ({
          type: "bot",
          text: highlightKeywords(step, found.keywords),
        }));
        setMessages(prev => [...prev, ...newMessages]);
      } else {
        setMessages(prev => [...prev, { type: "bot", text: "Sorry, I couldn't find a first-aid guide for that. Try another keyword." }]);
      }
      setTyping(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header - sticky top */}
      <div className="w-full text-center sticky top-0 bg-gray-50 z-10 py-4 shadow-md">
        <span className="font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
          🩺 NoahAid
        </span>
      </div>

      {/* Chat area */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 flex flex-col space-y-3 mt-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`relative max-w-full sm:max-w-[70%] md:max-w-[60%] lg:max-w-[50%] px-3 sm:px-4 py-2 sm:py-3 rounded-2xl whitespace-pre-wrap
            ${msg.type === "user"
              ? "bg-gray-200 self-end text-right rounded-br-none"
              : "bg-white self-start shadow rounded-bl-none"
            } text-sm sm:text-base md:text-lg lg:text-xl`}

          >
            <div dangerouslySetInnerHTML={{ __html: msg.text }} />
          </div>
        ))}

        {typing && (
          <div className="max-w-full sm:max-w-[70%] md:max-w-[60%] lg:max-w-[50%] px-3 sm:px-4 py-2 sm:py-3 bg-white self-start shadow rounded-bl-none animate-pulse text-sm sm:text-base md:text-lg lg:text-xl">
            NoahAid is typing<span className="animate-dots">...</span>
          </div>
        )}
      </div>

      {/* Input bar fixed at middle-bottom */}
      <div className="absolute bottom-4 left-0 w-full flex justify-center px-4">
        <div className="w-full max-w-2xl flex space-x-2 sm:space-x-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Enter keywords"
            className="w-full min-h-[50px] max-h-[150px] p-3 sm:p-4 rounded-2xl border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-red-400 overflow-hidden text-sm sm:text-base md:text-lg lg:text-xl"
            rows={1}
            style={{ resize: "none" }} // prevents manual resizing
          />
          <button
            onClick={handleSend}
            className="bg-red-500 text-white px-4 sm:px-5 py-2 sm:py-3 rounded-2xl hover:bg-red-600 transition text-sm sm:text-base md:text-lg lg:text-xl"
          >
            Send
          </button>
        </div>
      </div>

      <style>{`
        @keyframes dots {
          0%, 20% { content: ''; }
          40% { content: '.'; }
          60% { content: '..'; }
          80%, 100% { content: '...'; }
        }
        .animate-dots::after { content: ''; animation: dots 1s infinite; }
      `}</style>
    </div>
  );
}
