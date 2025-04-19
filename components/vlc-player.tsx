"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Window } from "@/components/window"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Square } from "lucide-react"
import Image from "next/image"

interface VLCPlayerProps {
  id: string
  audioSrc: string
  title?: string
  autoPlay?: boolean
}

export function VLCPlayer({ id, audioSrc, title = "Relax.mp3", autoPlay = true }: VLCPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(100)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)

    // Auto-play when component mounts if autoPlay is true
    if (autoPlay) {
      const playPromise = audio.play()

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Auto-play was prevented:", error)
          setIsPlaying(false)
        })
      }
    }

    return () => {
      audio.pause()
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [autoPlay])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error)
          setIsPlaying(false)
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted
    }
  }, [isMuted])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const stop = () => {
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setCurrentTime(0)
    }
  }

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5)
    }
  }

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 5)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current) return

    const rect = progressBarRef.current.getBoundingClientRect()
    const clickPosition = e.clientX - rect.left
    const percentage = clickPosition / rect.width
    const newTime = percentage * duration

    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <Window id={id} title="VLC media player" width={400} height={200} icon="/images/vlc-icon.svg">
      <div className="flex flex-col h-full bg-[#E9E9E9] p-1">
        <audio ref={audioRef} src={audioSrc} />

        {/* Progress bar */}
        <div ref={progressBarRef} className="relative h-4 my-4 mx-2 cursor-pointer" onClick={handleProgressBarClick}>
          <div className="absolute top-0 left-0 w-full h-full">
            <Image src="/images/progress_bar_background.png" alt="Progress Bar" fill className="object-fill" />
          </div>
          <div
            className="absolute top-0 left-0 h-full bg-[#2cce2b]"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
          <div className="absolute top-0 h-full" style={{ left: `${(currentTime / duration) * 100}%` }}>
            <Image src="/images/progress_bar_cursor.png" alt="Cursor" width={10} height={16} className="h-4" />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-2 mt-2">
          <div className="flex space-x-2">
            <button className="p-1 border border-gray-300 rounded bg-[#E9E9E9] hover:bg-[#B5BED6]" onClick={togglePlay}>
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button className="p-1 border border-gray-300 rounded bg-[#E9E9E9] hover:bg-[#B5BED6]" onClick={stop}>
              <Square size={16} />
            </button>
            <button
              className="p-1 border border-gray-300 rounded bg-[#E9E9E9] hover:bg-[#B5BED6]"
              onClick={skipBackward}
            >
              <SkipBack size={16} />
            </button>
            <button
              className="p-1 border border-gray-300 rounded bg-[#E9E9E9] hover:bg-[#B5BED6]"
              onClick={skipForward}
            >
              <SkipForward size={16} />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-1 border border-gray-300 rounded bg-[#E9E9E9] hover:bg-[#B5BED6]" onClick={toggleMute}>
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <div className="w-24 h-16 relative">
              <div
                className="absolute bottom-0 right-0 w-0 h-0 border-l-[60px] border-b-[16px] border-l-transparent border-b-[#2cce2b]"
                style={{ width: `${volume}%` }}
              ></div>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number.parseInt(e.target.value))}
                className="absolute bottom-0 right-0 w-24 h-4 opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Time display */}
        <div className="flex justify-between px-2 mt-2 text-xs">
          <div>{formatTime(currentTime)}</div>
          <div>{formatTime(duration)}</div>
        </div>
      </div>
    </Window>
  )
}
