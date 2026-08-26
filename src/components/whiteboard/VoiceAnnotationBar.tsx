import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  Download, 
  Trash2, 
  Volume2, 
  Radio, 
  X,
  Sparkles,
  Check
} from 'lucide-react';
import { useToast } from '../common/Toast';

interface VoiceAnnotationBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceAnnotationBar: React.FC<VoiceAnnotationBarProps> = ({
  isOpen,
  onClose
}) => {
  const { showToast } = useToast();

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [audioTotalDuration, setAudioTotalDuration] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setIsPaused(false);
      setRecordDuration(0);
      setAudioUrl(null);

      timerIntervalRef.current = setInterval(() => {
        setRecordDuration((prev) => prev + 1);
      }, 1000);

      showToast('Recording voice lecture annotation... 🎙️', 'info');
    } catch (err) {
      console.error(err);
      showToast('Microphone access denied or not available.', 'error');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        timerIntervalRef.current = setInterval(() => {
          setRecordDuration((prev) => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      showToast('Voice memo recorded successfully! 🎵', 'success');
    }
  };

  const togglePlayback = () => {
    if (!audioElementRef.current && audioUrl) {
      const audio = new Audio(audioUrl);
      audioElementRef.current = audio;

      audio.onloadedmetadata = () => {
        setAudioTotalDuration(audio.duration);
      };

      audio.ontimeupdate = () => {
        setPlaybackTime(audio.currentTime);
      };

      audio.onended = () => {
        setIsPlaying(false);
        setPlaybackTime(0);
      };
    }

    if (audioElementRef.current) {
      if (isPlaying) {
        audioElementRef.current.pause();
        setIsPlaying(false);
      } else {
        audioElementRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const downloadAudioMemo = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `voice-lecture-memo-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Voice memo downloaded! 💾', 'success');
  };

  const handleDiscard = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
    setAudioUrl(null);
    setRecordDuration(0);
    setPlaybackTime(0);
    setIsPlaying(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 z-40 animate-in slide-in-from-bottom-5 duration-200">
      <div className="p-4 rounded-3xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 backdrop-blur-2xl shadow-2xl space-y-3 w-80 sm:w-96 ring-1 ring-black/5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
              isRecording ? 'bg-rose-500/20 text-rose-500 animate-pulse' : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
            }`}>
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white font-brand">
                Voice Annotation
              </h4>
              <span className="text-[10px] text-slate-400">
                {isRecording ? 'Live Audio Recording...' : audioUrl ? 'Voice Memo Ready' : 'Record voice while drawing'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Recording State */}
        {isRecording && (
          <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-mono font-bold text-rose-700 dark:text-rose-300">
                  {formatTime(recordDuration)}
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-200/60 dark:bg-rose-900/60 px-2 py-0.5 rounded-md">
                {isPaused ? 'PAUSED' : 'RECORDING'}
              </span>
            </div>

            {/* Audio Waveform Simulator */}
            <div className="flex items-center justify-center gap-1 h-8">
              {[40, 75, 100, 60, 85, 30, 90, 65, 45, 80, 95, 50, 70, 85, 35].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full bg-rose-500 transition-all duration-150 ${isPaused ? 'opacity-30' : 'animate-pulse'}`}
                  style={{ height: `${isPaused ? 20 : (h * ((i % 3) + 1)) / 3}%` }}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={pauseRecording}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-colors"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={stopRecording}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/30 flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Square className="w-3 h-3 fill-current" />
                <span>Finish</span>
              </button>
            </div>
          </div>
        )}

        {/* Audio Player State */}
        {audioUrl && !isRecording && (
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-300">
              <span>🎵 Voice Lecture Recording</span>
              <span className="font-mono text-[11px]">{formatTime(playbackTime)} / {formatTime(recordDuration)}</span>
            </div>

            {/* Simple Seeker Bar */}
            <div className="w-full bg-indigo-200 dark:bg-indigo-900/60 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all"
                style={{ width: `${recordDuration > 0 ? (playbackTime / recordDuration) * 100 : 0}%` }}
              />
            </div>

            {/* Player Controls */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlayback}
                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.05]"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                </button>

                <button
                  onClick={downloadAudioMemo}
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 transition-colors"
                  title="Download Voice Memo (.webm)"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleDiscard}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Discard Recording"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Start Recording CTA (Idle State) */}
        {!isRecording && !audioUrl && (
          <div className="text-center py-3 space-y-3">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Explain equations and diagrams aloud while sketching. Your audio will be attached to this whiteboard.
            </p>
            <button
              onClick={startRecording}
              className="btn-interactive w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>Start Recording Lecture Audio</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
