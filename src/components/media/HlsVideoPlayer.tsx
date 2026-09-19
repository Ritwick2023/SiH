'use client';

import React, { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Award, Settings, Check } from 'lucide-react';

interface HlsVideoPlayerProps {
  src?: string;
  poster?: string;
  title?: string;
  courseId?: string;
  competencyId?: string;
  onQuizReady?: () => void;
  className?: string;
}

export function HlsVideoPlayer({
  src = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  poster,
  title = 'MoSPI Field Enumeration & Schedule 0.0 Protocol Video',
  courseId = 'course-field-listing-01',
  competencyId = 'comp-boundary-demarcation',
  onQuizReady,
  className = '',
}: HlsVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [quality, setQuality] = useState<string>('Auto (Adaptive)');
  const [showSettings, setShowSettings] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quizTriggered, setQuizTriggered] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported() && src.includes('.m3u8')) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(src);
      hls.attachMedia(video);

      // Auto quality adaptation based on navigator connection
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (typeof navigator !== 'undefined' && 'connection' in navigator) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const conn = (navigator as any).connection;
          if (conn && conn.downlink && conn.downlink < 1.0) {
            setQuality('240p (Low Bandwidth)');
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;
    setCurrentTime(curr);
    setDuration(dur);
    setProgress(dur > 0 ? (curr / dur) * 100 : 0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration;
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setQuizTriggered(true);

    // Fire custom event for Task D2
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('video:competency-quiz-ready', {
        detail: { courseId, competencyId },
      });
      window.dispatchEvent(event);
    }

    if (onQuizReady) {
      onQuizReady();
    }
  };

  const changeRate = (rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={`rounded-3xl bg-black text-white overflow-hidden shadow-xl border border-[#EDF0F7] relative group ${className}`}>
      {/* Video Element */}
      <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center">
        <video
          ref={videoRef}
          poster={poster}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onClick={togglePlay}
          className="w-full h-full object-contain cursor-pointer"
          playsInline
        />

        {/* Big Center Play Overlay when paused */}
        {!isPlaying && (
          <button
            type="button"
            onClick={togglePlay}
            className="absolute h-16 w-16 rounded-full bg-[#1C4CA1]/90 hover:bg-[#1C4CA1] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer z-10"
            aria-label="Play Video"
          >
            <Play className="h-7 w-7 fill-current ml-1" />
          </button>
        )}
      </div>

      {/* Video Controls Bar */}
      <div className="p-3 bg-gradient-to-t from-slate-950 to-slate-900 border-t border-white/10">
        {/* Progress Bar Scrubber */}
        <div
          onClick={handleSeek}
          className="w-full h-1.5 bg-white/20 hover:h-2.5 rounded-full cursor-pointer transition-all relative overflow-hidden mb-3"
        >
          <div
            className="h-full bg-[#FFA72F] rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="hover:text-[#FFA72F] transition-colors cursor-pointer"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="hover:text-[#FFA72F] transition-colors cursor-pointer"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4" />}
            </button>

            <span className="font-mono text-[11px] text-white/70">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Speed Selector */}
            <div className="flex items-center gap-1 font-mono text-[10px] bg-white/10 px-2 py-0.5 rounded-md">
              {[0.75, 1, 1.25, 1.5].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => changeRate(rate)}
                  className={`px-1 rounded ${playbackRate === rate ? 'text-[#FFA72F] font-bold' : 'text-white/60 hover:text-white'}`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {/* Quality Indicator Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              >
                <Settings className="h-3 w-3" />
                <span>{quality}</span>
              </button>

              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 w-44 bg-slate-900 border border-white/20 rounded-xl p-1.5 shadow-xl z-20 text-[11px]">
                  {['Auto (Adaptive)', '720p HD', '360p SD', '240p (Low Bandwidth)'].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => {
                        setQuality(q);
                        setShowSettings(false);
                      }}
                      className="w-full text-left px-2 py-1 rounded flex items-center justify-between hover:bg-white/10 text-white/80 hover:text-white"
                    >
                      <span>{q}</span>
                      {quality === q && <Check className="h-3 w-3 text-[#FFA72F]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                if (videoRef.current) {
                  if (document.fullscreenElement) {
                    document.exitFullscreen();
                  } else {
                    videoRef.current.requestFullscreen();
                  }
                }
              }}
              className="hover:text-[#FFA72F] transition-colors cursor-pointer"
              title="Fullscreen"
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Formative Assessment Ready Banner */}
      {quizTriggered && (
        <div className="p-3 bg-[#FFA72F] text-[#1F273A] flex items-center justify-between text-xs font-bold animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-[#1C4CA1]" />
            <span>Video Complete! 3-Question Formative Knowledge Check Unlocked.</span>
          </div>
          <button
            type="button"
            onClick={onQuizReady}
            className="px-3 py-1 rounded-xl bg-[#1C4CA1] text-white text-[11px] font-bold shadow-xs hover:bg-[#153a7a] transition-colors cursor-pointer"
          >
            Start Quiz
          </button>
        </div>
      )}
    </div>
  );
}
