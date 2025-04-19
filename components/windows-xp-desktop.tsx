"use client"

import { useState, useEffect } from "react"
import { Taskbar } from "@/components/taskbar"
import { DesktopIcon } from "@/components/desktop-icon"
import { BioWindow } from "@/components/bio-window"
import { ProjectsWindow } from "@/components/projects-window"
import { VLCPlayer } from "@/components/vlc-player"
import { useWindows } from "@/contexts/windows-context"
import Image from "next/image"

export function WindowsXPDesktop() {
  const [time, setTime] = useState(new Date())
  const { windows, openWindow } = useWindows()

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const openBio = () => {
    openWindow({
      id: "bio",
      title: "Bio.txt",
      content: <BioWindow id="bio" />,
      initialPosition: { x: 100, y: 100 },
      width: 500,
      height: 400,
    })
  }

  const openProjects = () => {
    openWindow({
      id: "projects",
      title: "My Projects",
      content: <ProjectsWindow id="projects" />,
      initialPosition: { x: 150, y: 120 },
      width: 700,
      height: 500,
    })
  }

  const openVLCPlayer = () => {
    openWindow({
      id: "vlc-player",
      title: "VLC media player",
      content: <VLCPlayer id="vlc-player" audioSrc="/audio/Michael Haggins - Daybreak.mp3" autoPlay />,
      initialPosition: { x: 200, y: 150 },
      width: 400,
      height: 200,
    })
  }

  // Handle desktop click to deselect all
  const handleDesktopClick = () => {
    // This is handled by the click outside logic in DesktopIcon
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden" onClick={handleDesktopClick}>
      {/* Windows XP Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/windows-xp-bliss.jpg"
          alt="Windows XP Bliss Wallpaper"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Desktop Icons */}
      <div className="relative z-10 h-[calc(100vh-40px)] desktop-area">
        <DesktopIcon name="Bio" icon="/images/notepad-icon.webp" onClick={openBio} initialPosition={{ x: 20, y: 20 }} />
        <DesktopIcon
          name="My Projects"
          icon="/images/windows-xp-folder.webp"
          onClick={openProjects}
          initialPosition={{ x: 20, y: 120 }}
        />
        <DesktopIcon
          name="Relax.mp3"
          icon="/images/vlc-icon.svg"
          onClick={openVLCPlayer}
          initialPosition={{ x: 20, y: 220 }}
        />
      </div>

      {/* Windows - Render directly, not inside another div */}
      {Object.values(windows)
        .filter((window) => window.isOpen)
        .map((window) => window.content)}

      {/* Windows XP Taskbar */}
      <Taskbar currentTime={time} />
    </div>
  )
}
