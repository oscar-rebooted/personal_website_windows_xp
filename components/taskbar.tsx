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
  const [tooltipKey, setTooltipKey] = useState(0);

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
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimezone(browserTimezone);
  }, []);
  
  // Function to update the time based on selected timezone
  const updateTime = () => {
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
  }

  // Update time every second
  useEffect(() => {
    // Initial time update
    updateTime()
    
    const timer = setInterval(updateTime, 1000)
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
    // Immediately update the time after changing timezone
    updateTime()
    
    setTooltipText(isLondonTime ? "Your time" : "My time")
    setShowTooltip(true)
    // Increment the key to force remount
    setTooltipKey(prev => prev + 1);
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
    <div className="windows-xp-taskbar">
      <div className="flex h-full justify-between">
        <div className="flex" >
          {/* Start Button */}        
          <button onClick={playStartSound}>
            <Image 
              src="/images/start_button.png" 
              alt="Start" 
              width={0} 
              height={0} 
              className="h-full w-auto" 
            />
          </button>
          {/* Quick Launch */}
          <div className="ml-2 flex items-center">
            <button
              className="mx-1 rounded p-1 hover:bg-[#4b8cf5]/40"
              onClick={() => openLink("https://www.linkedin.com/in/oscarbrisset/")}
              title="LinkedIn"
            >
              <IoLogoLinkedin size={30} className="text-white" />
            </button>
            <button
              className="mx-1 rounded p-1 hover:bg-[#4b8cf5]/40"
              onClick={() => openLink("https://github.com/oscar-rebooted")}
              title="GitHub"
            >
              <IoLogoGithub size={30} className="text-white" />
            </button>
            <button
              className="mx-1 rounded p-1 hover:bg-[#4b8cf5]/40"
              onClick={() => openLink("https://medium.com/@oscar_brisset")}
              title="Medium"
            >
              <IoLogoMedium size={30} className="text-white" />
            </button>
          </div>
        </div>

        {/* System Tray */}
        <div className="flex items-center h-full bg-[#0c327a]/30 px-2">
          <div className="flex items-center relative">
            {showTooltip && (
              <div key={tooltipKey} className="absolute bottom-full left-1/2 transform -translate-x-1/2 py-1 w-20 text-center bg-white/70 text-black text-xs animate-fade-out">
                {tooltipText}
              </div>
            )}
            <Wifi size={16} className="mx-2 text-white" />
            <Volume2 size={16} className="mx-2 text-white" />
            <button className="text-white text-xs font-normal cursor-pointer mx-2 w-16" onClick={toggleTimeZone}>
              {formattedTime}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
