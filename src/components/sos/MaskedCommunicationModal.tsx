import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChatMessage, RescueProvider } from '@/types/sos';
import { storageService } from '@/services/storage';
import {
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  ShieldCheck,
  AlertTriangle,
  User,
  Truck,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

interface MaskedCommunicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: 'chat' | 'call';
  provider: RescueProvider;
}

const QUICK_CHIPS = [
  'I am safely on right shoulder',
  'Hazard flashers are active',
  'Heavy passing traffic at 75mph',
  'Need flatbed for AWD drivetrain',
  'Key locked inside vehicle',
  'All passengers are uninjured',
];

export const MaskedCommunicationModal: React.FC<MaskedCommunicationModalProps> = ({
  open,
  onOpenChange,
  initialTab = 'chat',
  provider,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'call'>(initialTab);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Call simulation state
  const [callState, setCallState] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [callSeconds, setCallSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  // Load chat messages
  useEffect(() => {
    if (open) {
      setMessages(storageService.getChatMessages());
      setActiveTab(initialTab);
      if (initialTab === 'call') {
        startCallSimulation();
      }
    }
  }, [open, initialTab]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  // Voice call timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (activeTab === 'call' && callState === 'connected') {
      interval = setInterval(() => {
        setCallSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTab, callState]);

  const startCallSimulation = () => {
    setCallState('ringing');
    setCallSeconds(0);
    storageService.playEmergencyAudioTone(440, 0.4, 'sine');

    setTimeout(() => {
      setCallState('connected');
      storageService.playEmergencyAudioTone(620, 0.2, 'sine');
      toast.info(`Connected with ${provider.driverName} via encrypted relay.`);
    }, 2800);
  };

  const handleEndCall = () => {
    setCallState('ended');
    storageService.playEmergencyAudioTone(300, 0.3, 'sine');
    setTimeout(() => {
      setActiveTab('chat');
    }, 900);
  };

  const handleSendMessage = (textToSend?: string, isQuickChip = false) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const newMsg = storageService.addChatMessage('driver', 'Driver (You)', text, isQuickChip);
    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInputText('');

    // Trigger simulated responder reply after 2.5s
    setTimeout(() => {
      const replies = [
        `Copy that. GPS location is locked on my cab terminal. ETA is about ${provider.currentEtaMinutes} minutes. Stay inside your vehicle!`,
        `Understood. I have the winch & towing equipment staged. Approaching corridor now.`,
        `Got it. Dispatch center alerted highway patrol as well. See you shortly.`,
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const responderMsg = storageService.addChatMessage('rescuer', provider.driverName, randomReply);
      setMessages((prev) => [...prev, responderMsg]);
      storageService.playEmergencyAudioTone(750, 0.15, 'sine');
    }, 2200);
  };

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-lg border-4 border-black p-0 rounded-none bg-white shadow-hard text-black font-sans">
        {/* Header with Masked Line Indicator */}
        <DialogHeader className="bg-black text-white p-3 border-b-2 border-black flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <DialogTitle className="font-mono text-sm font-black tracking-wider uppercase text-white">
                IN-APP ENCRYPTED RELAY
              </DialogTitle>
              <div className="text-[10px] text-neutral-300 font-mono">
                Line: {provider.phoneMasked}
              </div>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex items-center gap-1 font-mono text-xs">
            <Button
              size="sm"
              variant={activeTab === 'chat' ? 'default' : 'outline'}
              onClick={() => setActiveTab('chat')}
              className={`h-7 px-2.5 rounded-none border border-white text-xs font-bold uppercase ${
                activeTab === 'chat' ? 'bg-white text-black' : 'bg-black text-white'
              }`}
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              Chat
            </Button>
            <Button
              size="sm"
              variant={activeTab === 'call' ? 'default' : 'outline'}
              onClick={() => {
                setActiveTab('call');
                if (callState !== 'connected') startCallSimulation();
              }}
              className={`h-7 px-2.5 rounded-none border border-white text-xs font-bold uppercase ${
                activeTab === 'call' ? 'bg-emerald-500 text-white' : 'bg-black text-white'
              }`}
            >
              <PhoneCall className="w-3 h-3 mr-1" />
              Call
            </Button>
          </div>
        </DialogHeader>

        {/* TAB 1: MASKED CHAT */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-[65vh] font-mono">
            {/* Rapid Stress Quick-Chips */}
            <div className="p-2 bg-neutral-100 border-b border-black overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-thin">
              <span className="text-[10px] font-bold uppercase text-neutral-600 flex items-center gap-1 py-1 px-1">
                <Sparkles className="w-3 h-3 text-red-600" /> Crisis Chips:
              </span>
              {QUICK_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(chip, true)}
                  className="rounded-none border border-black bg-white hover:bg-neutral-200 text-[11px] px-2 py-1 font-medium text-black transition-colors shrink-0 active:scale-95 shadow-hard-sm"
                >
                  + {chip}
                </button>
              ))}
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-neutral-50">
              {messages.map((m) => {
                const isDriver = m.sender === 'driver';
                const isSystem = m.sender === 'system';

                if (isSystem) {
                  return (
                    <div key={m.id} className="text-center my-2">
                      <div className="inline-block bg-black text-white text-[10px] px-2 py-0.5 border border-white font-mono uppercase">
                        {m.text}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isDriver ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] text-neutral-500 mb-0.5 px-1 flex items-center gap-1">
                      {isDriver ? <User className="w-3 h-3" /> : <Truck className="w-3 h-3" />}
                      <span>{m.senderName}</span>
                      <span>•</span>
                      <span>{m.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[85%] p-2.5 border-2 border-black text-xs leading-relaxed shadow-hard-sm ${
                        isDriver
                          ? 'bg-black text-white rounded-none'
                          : 'bg-white text-black rounded-none'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-2 border-t-2 border-black bg-white flex items-center gap-1.5">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type urgent message to driver..."
                className="rounded-none border-2 border-black h-10 font-mono text-xs px-3 focus-visible:ring-black"
              />
              <Button
                onClick={() => handleSendMessage()}
                className="rounded-none bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs h-10 px-4 border-2 border-black shadow-hard-sm shrink-0"
              >
                <Send className="w-4 h-4 mr-1" /> SEND
              </Button>
            </div>
          </div>
        )}

        {/* TAB 2: MASKED VOICE CALL */}
        {activeTab === 'call' && (
          <div className="p-6 bg-neutral-900 text-white flex flex-col items-center justify-between min-h-[55vh] font-mono select-none">
            {/* Top Call Info */}
            <div className="text-center space-y-2 mt-4">
              <div className="w-20 h-20 mx-auto rounded-none border-4 border-white overflow-hidden shadow-hard bg-neutral-800">
                <img
                  src={provider.driverAvatar}
                  alt={provider.driverName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-0.5">
                <div className="text-xl font-black uppercase tracking-wide">
                  {provider.driverName}
                </div>
                <div className="text-xs text-neutral-400">
                  {provider.companyName}
                </div>
                <div className="text-[11px] text-emerald-400 font-bold">
                  {provider.phoneMasked}
                </div>
              </div>

              {/* Status & Timer */}
              <div className="mt-3">
                {callState === 'ringing' && (
                  <div className="inline-flex items-center gap-2 bg-neutral-800 text-amber-300 px-3 py-1 border border-neutral-700 text-xs font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    CONNECTING ENCRYPTED RELAY...
                  </div>
                )}
                {callState === 'connected' && (
                  <div className="inline-flex items-center gap-2 bg-emerald-950 text-emerald-300 px-3 py-1 border border-emerald-600 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    CALL CONNECTED • {formatCallTime(callSeconds)}
                  </div>
                )}
                {callState === 'ended' && (
                  <div className="text-xs text-neutral-400 font-bold">
                    CALL DISCONNECTED
                  </div>
                )}
              </div>
            </div>

            {/* Audio Wave Visualizer Simulation */}
            {callState === 'connected' && (
              <div className="my-6 flex items-center justify-center gap-1.5 h-12">
                {[24, 40, 16, 48, 32, 20, 44, 28, 12, 36, 48, 20].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-emerald-400 transition-all duration-200 animate-pulse"
                    style={{ height: `${(h * (callSeconds % 3 === 0 ? 1.2 : 0.7))}px` }}
                  />
                ))}
              </div>
            )}

            {/* In-Call Controls */}
            <div className="w-full max-w-xs space-y-4 mb-2">
              <div className="flex items-center justify-around">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className={`w-12 h-12 rounded-none border-2 border-white flex items-center justify-center transition-colors ${
                    isMuted ? 'bg-red-600 text-white' : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                  }`}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsSpeaker(!isSpeaker)}
                  className={`w-12 h-12 rounded-none border-2 border-white flex items-center justify-center transition-colors ${
                    isSpeaker ? 'bg-white text-black font-bold' : 'bg-neutral-800 text-white'
                  }`}
                >
                  {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>

                <a
                  href="tel:911"
                  className="w-12 h-12 rounded-none border-2 border-white bg-red-800 hover:bg-red-900 text-white flex flex-col items-center justify-center font-mono text-[9px] font-black leading-tight no-underline"
                >
                  <span>911</span>
                  <span>BRIDGE</span>
                </a>
              </div>

              {/* End Call Button */}
              <Button
                onClick={handleEndCall}
                className="w-full h-12 rounded-none bg-red-600 hover:bg-red-700 text-white font-mono font-black text-sm border-2 border-white shadow-hard flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <PhoneOff className="w-5 h-5" />
                END MASKED CALL
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
