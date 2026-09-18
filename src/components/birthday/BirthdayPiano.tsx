"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Icon } from "@/components/icons";

type Note = {
  pitch: number; // frequency in Hz
  time: number;  // start time in seconds
  duration: number; // duration in seconds
  gain?: number; // relative velocity
};

// Acoustic frequencies
const C3 = 130.81, F3 = 174.61, G3 = 196.00, A3 = 220.00, Bb3 = 233.08;
const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, Bb4 = 466.16, C5 = 523.25;

// Expressive slow ballad timing (BPM ~68)
const BEAT = 0.88;

function buildMelody(): { notes: Note[]; totalLength: number } {
  const notes: Note[] = [];
  let t = 0.4;

  const add = (pitch: number, beats: number, gain = 0.8) => {
    notes.push({ pitch, time: t, duration: beats * BEAT * 0.95, gain });
    t += beats * BEAT;
  };

  const addChord = (bass: number, melody: number, beats: number) => {
    notes.push({ pitch: bass, time: t, duration: beats * BEAT * 1.2, gain: 0.35 });
    notes.push({ pitch: melody, time: t, duration: beats * BEAT * 0.95, gain: 0.85 });
    t += beats * BEAT;
  };

  // Phrase 1: "Happy birthday to you"
  add(C4, 0.75); add(C4, 0.25); add(D4, 1.0); add(C4, 1.0);
  add(F4, 1.0); addChord(A3, E4, 2.0);
  t += 0.3;

  // Phrase 2: "Happy birthday to you"
  add(C4, 0.75); add(C4, 0.25); add(D4, 1.0); add(C4, 1.0);
  add(G4, 1.0); addChord(C3, F4, 2.0);
  t += 0.3;

  // Phrase 3: "Happy birthday dear Misba"
  add(C4, 0.75); add(C4, 0.25); addChord(F3, C5, 1.0); add(A4, 1.0);
  addChord(Bb3, F4, 1.0); add(E4, 1.0); addChord(G3, D4, 2.0);
  t += 0.3;

  // Phrase 4: "Happy birthday to you"
  add(Bb4, 0.75); add(Bb4, 0.25); addChord(F3, A4, 1.0); add(F4, 1.0);
  add(G4, 1.0); addChord(F3, F4, 3.0);

  return { notes, totalLength: t + 2.0 };
}

export default function BirthdayPiano({ nickname }: { nickname: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStartedOnce, setHasStartedOnce] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const activeNodesRef = useRef<{ stop: () => void }[]>([]);
  const loopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return null;
      const ctx = new AudioContextClass();
      const master = ctx.createGain();
      master.gain.value = 0.32;
      master.connect(ctx.destination);
      audioCtxRef.current = ctx;
      masterGainRef.current = master;
    }
    return audioCtxRef.current;
  }, []);

  // Synthesizes a soft, felt acoustic piano tone
  const playPianoKey = useCallback((ctx: AudioContext, master: GainNode, note: Note) => {
    const startTime = ctx.currentTime + note.time;
    const dur = note.duration;

    // Dual oscillator: sine for warm acoustic body, triangle for hammer attack
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const oscHarmonic = ctx.createOscillator();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(note.pitch, startTime);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(note.pitch, startTime);

    // Subtle 2nd harmonic overtone for warmth
    oscHarmonic.type = "sine";
    oscHarmonic.frequency.setValueAtTime(note.pitch * 2, startTime);

    // Warm felt filter: rolls off harsh treble, gives soft piano character
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(850, startTime);
    filter.frequency.exponentialRampToValueAtTime(320, startTime + dur);

    // Amplitude envelope: instant soft attack, gentle exponential decay
    const gainNode = ctx.createGain();
    const noteVelocity = (note.gain ?? 0.7) * 0.45;
    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(noteVelocity, startTime + 0.025);
    gainNode.gain.exponentialRampToValueAtTime(noteVelocity * 0.45, startTime + 0.3);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + dur);

    // Wire up
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    oscHarmonic.connect(gainNode);
    gainNode.connect(filter);
    filter.connect(master);

    osc1.start(startTime);
    osc2.start(startTime);
    oscHarmonic.start(startTime);

    osc1.stop(startTime + dur + 0.1);
    osc2.stop(startTime + dur + 0.1);
    oscHarmonic.stop(startTime + dur + 0.1);

    activeNodesRef.current.push({
      stop: () => {
        try {
          osc1.stop();
          osc2.stop();
          oscHarmonic.stop();
          gainNode.disconnect();
        } catch {
          // ignore
        }
      },
    });
  }, []);

  const stopPlayback = useCallback(() => {
    if (loopTimerRef.current) {
      clearTimeout(loopTimerRef.current);
      loopTimerRef.current = null;
    }
    activeNodesRef.current.forEach((n) => n.stop());
    activeNodesRef.current = [];
    setIsPlaying(false);
  }, []);

  const startPlayback = useCallback(() => {
    const ctx = getAudioContext();
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    if (ctx.state === "suspended") {
      ctx
        .resume()
        .then(() => {
          setNeedsGesture(false);
          startPlayback();
        })
        .catch(() => {
          setNeedsGesture(true);
        });
      return;
    }

    stopPlayback();
    setIsPlaying(true);
    setHasStartedOnce(true);
    setNeedsGesture(false);

    const { notes, totalLength } = buildMelody();
    notes.forEach((note) => playPianoKey(ctx, master, note));

    // Loop after finished with gentle pause
    loopTimerRef.current = setTimeout(() => {
      startPlayback();
    }, totalLength * 1000);
  }, [getAudioContext, playPianoKey, stopPlayback]);

  // Attempt auto-start when component mounts
  useEffect(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (ctx.state === "running") {
      startPlayback();
    } else {
      ctx
        .resume()
        .then(() => {
          startPlayback();
        })
        .catch(() => {
          setNeedsGesture(true);
        });

      // Also listen for first user click/touch anywhere on page to trigger seamlessly
      const handleFirstGesture = () => {
        startPlayback();
        window.removeEventListener("click", handleFirstGesture);
        window.removeEventListener("touchstart", handleFirstGesture);
      };
      window.addEventListener("click", handleFirstGesture, { once: true });
      window.addEventListener("touchstart", handleFirstGesture, { once: true });

      return () => {
        window.removeEventListener("click", handleFirstGesture);
        window.removeEventListener("touchstart", handleFirstGesture);
      };
    }

    return () => {
      stopPlayback();
    };
  }, [getAudioContext, startPlayback, stopPlayback]);

  const toggleMute = () => {
    if (!masterGainRef.current) return;
    if (isMuted) {
      masterGainRef.current.gain.value = 0.32;
      setIsMuted(false);
    } else {
      masterGainRef.current.gain.value = 0.0001;
      setIsMuted(true);
    }
  };

  return (
    <div
      className="card-flat animate-fade-up relative flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4"
      style={{
        borderColor: "var(--border)",
        background: "color-mix(in srgb, var(--surface) 92%, var(--accent-soft))",
      }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={isPlaying ? stopPlayback : startPlayback}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
          style={{ background: "var(--accent)" }}
          aria-label={isPlaying ? "Pause piano melody" : "Play piano melody"}
          title={isPlaying ? "Pause piano tune" : "Play birthday piano tune"}
        >
          <Icon name={isPlaying ? "moon" : "sparkle"} size={17} strokeWidth={2.2} />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="eyebrow" style={{ color: "var(--accent)" }}>
              Soft Piano Tune
            </span>
            {isPlaying && !isMuted ? (
              <span className="flex items-center gap-0.5">
                <span className="h-2 w-0.5 animate-pulse rounded-full" style={{ background: "var(--accent)" }} />
                <span className="h-3.5 w-0.5 animate-pulse rounded-full delay-100" style={{ background: "var(--accent)" }} />
                <span className="h-2 w-0.5 animate-pulse rounded-full delay-200" style={{ background: "var(--accent)" }} />
              </span>
            ) : null}
          </div>
          <p className="display text-[13.5px] font-semibold">
            {isPlaying
              ? `Playing soft birthday piano for ${nickname}…`
              : `Soft acoustic piano melody for ${nickname}`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {needsGesture && !hasStartedOnce ? (
          <button
            onClick={startPlayback}
            className="btn-accent text-[12px] py-1.5 px-3"
          >
            <Icon name="sparkle" size={13} /> Tap to play piano
          </button>
        ) : null}

        <button
          onClick={isPlaying ? stopPlayback : startPlayback}
          className="btn-ghost text-[12px] py-1.5 px-2.5"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button
          onClick={toggleMute}
          className="btn-ghost text-[12px] py-1.5 px-2.5"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>
      </div>
    </div>
  );
}
