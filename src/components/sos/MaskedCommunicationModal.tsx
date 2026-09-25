import React, { useState } from 'react';
import { RescueProvider } from '@/types/sos';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  PhoneCall,
  PhoneOff,
  MessageSquare,
  Send,
  ShieldCheck,
  Lock,
  Volume2,
  Mic,
  MicOff,
  AlertCircle,
  Truck,
  CheckCheck,
} from 'lucide-react';
import { toast } from 'sonner';

interface MaskedCommunicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: 'chat' | 'call';
  provider: RescueProvider;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'provider';
  text: string;
  time: string;
}

export const MaskedCommunicationModal: React.FC<MaskedCommunicationModalProps> = ({
  open,
  onOpenChange,
  initialTab = 'chat',
  provider,
}) => {
  const [tab, setTab] = useState<'chat' | 'call'>(initialTab);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'provider',
      text: `Habari! I am ${provider.driverName} with ${provider.companyName}. Moving with unit ${provider.licensePlate}. Are you parked off the tarmac with warning triangles deployed?`,
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const quickReplies = [
    'Yes, warning triangles 50m behind',
    'Parked on the grass verge',
    'Hazard lights are blinking',
    'Front right tire is completely flat',
    'I have children in the vehicle',
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `p-${Date.now()}`,
        sender: 'provider',
        text: 'Received loud and clear. Approaching your GPS coordinates now. Please remain inside with seatbelts fastened.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 1500);
  };

  const handleSendQuickReply = (text: string) => {
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    toast.info('Quick status sent to responder');
  };

  const startMaskedCall = () => {
    setIsCalling(true);
    toast.success(`Encrypted voice link established with ${provider.driverName}`);
  };

  const endMaskedCall = () => {
    setIsCalling(false);
    setCallDuration(0);
    toast.info('Encrypted call terminated.');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-lg p-0 rounded-3xl glass-panel border border-white/10 text-white overflow-hidden shadow-2xl">
        <DialogHeader className="p-4 border-b border-white/5 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-white flex items-center gap-2">
                <span>{provider.companyName}</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                  Relay Masked
                </span>
              </DialogTitle>
              <div className="text-[11px] text-slate-400">
                Unit {provider.licensePlate} • {provider.driverName}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/5 text-xs">
            <button
              type="button"
              onClick={() => setTab('chat')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                tab === 'chat' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Chat
            </button>
            <button
              type="button"
              onClick={() => setTab('call')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                tab === 'call' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Voice Call
            </button>
          </div>
        </DialogHeader>

        {tab === 'chat' ? (
          <div className="flex flex-col h-[400px]">
            {/* Quick Chips */}
            <div className="p-2.5 bg-slate-900/60 border-b border-white/5 flex gap-1.5 overflow-x-auto whitespace-nowrap">
              {quickReplies.map((qr) => (
                <button
                  key={qr}
                  type="button"
                  onClick={() => handleSendQuickReply(qr)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-white/5 shrink-0"
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-200 border border-white/5'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-white/5 bg-slate-900/80 flex gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type urgent message to rescuer..."
                className="rounded-xl border border-white/10 bg-slate-900 text-white text-xs h-10 px-3"
              />
              <Button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs h-10 px-4 font-semibold shadow-md shadow-red-500/20 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
              <PhoneCall className="w-8 h-8 animate-pulse" />
            </div>

            <div>
              <div className="text-base font-bold text-white">
                {isCalling ? `Connected: ${provider.driverName}` : `Call ${provider.driverName}`}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Encrypted Kenyan Telecom Relay (+254 Proxy Masking)
              </div>
            </div>

            {isCalling ? (
              <Button
                onClick={endMaskedCall}
                className="w-full h-11 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2"
              >
                <PhoneOff className="w-4 h-4" />
                End Encrypted Call
              </Button>
            ) : (
              <Button
                onClick={startMaskedCall}
                className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                Initiate Masked Voice Call
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
