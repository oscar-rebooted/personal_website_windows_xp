"use client"

import { useState, useEffect } from "react"
import { Wifi, Volume2 } from "lucide-react"
import { IoLogoGithub, IoLogoLinkedin, IoLogoMedium } from "react-icons/io5"
import Image from "next/image"

interface TaskbarProps {
  currentTime: Date
}

export function Taskbar({ currentTime }: TaskbarProps) {
  const [time, setTime] = useState<Date>(currentTime)
  const [isLondonTime, setIsLondonTime] = useState<boolean>(false)
  const [showTooltip, setShowTooltip] = useState<boolean>(false)
  const [tooltipText, setTooltipText] = useState<string>("")
  const [userTimezone, setUserTimezone] = useState<string>("")
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [startSound, setStartSound] = useState<HTMLAudioElement | null>(null)

  // Initialize audio on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio("/audio/windows-xp-startup.mp3")
      audio.addEventListener("canplaythrough", () => {
        setAudioLoaded(true)
      })
      setStartSound(audio)
    }
  }, [])

  // Get user's timezone on component mount
  useEffect(() => {
    const fetchTimezone = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/")
        const data = await response.json()
        setUserTimezone(data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone)
      } catch (error) {
        console.error("Error fetching timezone:", error)
        // Fallback to browser's timezone
        setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)
      }
    }

    fetchTimezone()
  }, [])

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      if (isLondonTime) {
        // London time
        const londonTime = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/London" }))
        setTime(londonTime)
      } else {
        // User's local time
        if (userTimezone) {
          const localTime = new Date(new Date().toLocaleString("en-US", { timeZone: userTimezone }))
          setTime(localTime)
        } else {
          setTime(new Date())
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [isLondonTime, userTimezone])

  // Format time as HH:MM AM/PM
  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  const toggleTimeZone = () => {
    setIsLondonTime(!isLondonTime)
    setTooltipText(isLondonTime ? "Your time" : "My time")
    setShowTooltip(true)

    // Hide tooltip after 2 seconds
    setTimeout(() => {
      setShowTooltip(false)
    }, 2000)
  }

  const playStartSound = () => {
    if (startSound && audioLoaded) {
      startSound.currentTime = 0
      startSound.play().catch((err) => console.error("Error playing sound:", err))
    }
  }

  const openLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 h-15 windows-xp-taskbar">
      <div className="flex h-full items-center justify-between">
        {/* Start Button */}
        <div className="flex items-center h-full">
          <button className="h-full flex items-center justify-center cursor-pointer" onClick={playStartSound}>
            <Image src="/images/start_button.png" alt="Start" width={100} height={30} className="h-full w-auto" />
          </button>

          {/* Quick Launch */}
          <div className="ml-2 flex items-center border-l border-[#1752cf] pl-2">
            <button
              className="mx-1 rounded p-1 hover:bg-[#4b8cf5]/40"
              onClick={() => openLink("https://www.linkedin.com/in/oscarbrisset/")}
              title="LinkedIn"
            >
              <IoLogoLinkedin size={20} className="text-white" />
            </button>
            <button
              className="mx-1 rounded p-1 hover:bg-[#4b8cf5]/40"
              onClick={() => openLink("https://github.com/oscar-rebooted")}
              title="GitHub"
            >
              <IoLogoGithub size={20} className="text-white" />
            </button>
            <button
              className="mx-1 rounded p-1 hover:bg-[#4b8cf5]/40"
              onClick={() => openLink("https://medium.com/@oscar_brisset")}
              title="Medium"
            >
              <IoLogoMedium size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* System Tray */}
        <div className="flex items-center h-full bg-[#0c327a]/30 px-2">
          <div className="flex items-center relative">
            {showTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-white/70 text-black text-xs rounded animate-fade-out">
                {tooltipText}
              </div>
            )}
            <Wifi size={16} className="mx-2 text-white" />
            <Volume2 size={16} className="mx-2 text-white" />
            <button className="text-white text-xs font-normal cursor-pointer mx-2" onClick={toggleTimeZone}>
              {formattedTime}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
