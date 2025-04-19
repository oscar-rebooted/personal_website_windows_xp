"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useWindows } from "@/contexts/windows-context"

interface WindowComponentProps {
  id: string
  title: string
  children: React.ReactNode
  initialPosition?: { x: number; y: number }
  width?: number
  height?: number
  icon?: string
}

export function Window({
  id,
  title,
  children,
  initialPosition = { x: 200, y: 100 },
  width = 500,
  height = 400,
  icon,
}: WindowComponentProps) {
  const { closeWindow, bringToFront, updateWindowPosition, activeWindowId } = useWindows()
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)
  const titlebarRef = useRef<HTMLDivElement>(null)
  const isActive = activeWindowId === id

  // Handle mouse down on title bar
  const handleMouseDown = (e: React.MouseEvent) => {
    if (windowRef.current && titlebarRef.current && titlebarRef.current.contains(e.target as Node)) {
      setIsDragging(true)
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
      bringToFront(id)
    }
  }

  // Handle mouse move for dragging
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newPosition = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      }
      setPosition(newPosition)
    }
  }

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      updateWindowPosition(id, position)
    }
  }

  // Handle window click to bring to front
  const handleWindowClick = () => {
    bringToFront(id)
  }

  // Add and remove event listeners
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
      className={`windows-xp-window absolute bg-white ${isActive ? "z-50" : "z-40"}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={handleMouseDown}
      onClick={handleWindowClick}
    >
      <div ref={titlebarRef} className="windows-xp-titlebar flex items-center justify-between cursor-move">
        <div className="flex items-center">
          {icon && (
            <div className="mr-2 relative w-4 h-4">
              <Image
                src={icon || "/placeholder.svg"}
                alt="Window Icon"
                width={16}
                height={16}
                className="object-contain"
              />
            </div>
          )}
          <span>{title}</span>
        </div>
        <button className="windows-xp-close-button" onClick={() => closeWindow(id)} aria-label="Close Window">
          <Image src="/images/close_window.png" alt="Close" width={16} height={16} />
        </button>
      </div>
      <div className="p-1 h-[calc(100%-28px)] overflow-auto">{children}</div>
    </div>
  )
}
