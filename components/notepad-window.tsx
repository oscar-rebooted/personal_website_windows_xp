"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import Image from "next/image"

interface NotepadWindowProps {
  title: string
  filePath: string
  onClose: () => void
}

export function NotepadWindow({ title, filePath, onClose }: NotepadWindowProps) {
  const [content, setContent] = useState<string>("")
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Fetch the content of the text file
    fetch(filePath)
      .then((response) => response.text())
      .then((text) => setContent(text))
      .catch((error) => console.error("Error loading file:", error))
  }, [filePath])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (windowRef.current && e.target === windowRef.current.querySelector(".windows-xp-titlebar")) {
      setIsDragging(true)
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    } else {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  return (
    <div
      ref={windowRef}
      className="windows-xp-window absolute bg-white"
      style={{
        width: "1000px",
        height: "800px",
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="windows-xp-titlebar flex items-center justify-between">
        <div className="flex items-center">
          <Image src="/images/notepad-icon.webp" alt="Notepad" width={16} height={16} className="mr-2" />
          <span>{title} - Notepad</span>
        </div>
        <button className="windows-xp-close" onClick={onClose}>
          <X size={16} />
        </button>
      </div>
      <div className="p-1">
        <div className="flex text-xs border-b">
          <div className="px-2 py-1 hover:bg-[#e5f3ff]">File</div>
          <div className="px-2 py-1 hover:bg-[#e5f3ff]">Edit</div>
          <div className="px-2 py-1 hover:bg-[#e5f3ff]">Format</div>
          <div className="px-2 py-1 hover:bg-[#e5f3ff]">View</div>
          <div className="px-2 py-1 hover:bg-[#e5f3ff]">Help</div>
        </div>
        <div className="h-[calc(100%-50px)] overflow-auto p-1">
          <pre className="font-['Lucida_Console'] text-sm whitespace-pre-wrap">{content}</pre>
        </div>
      </div>
    </div>
  )
}
