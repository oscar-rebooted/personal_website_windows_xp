"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"

interface DraggableDesktopIconProps {
  name: string
  icon: string
  onClick: () => void
  initialPosition?: { x: number; y: number }
}

export function DraggableDesktopIcon({
  name,
  icon,
  onClick,
  initialPosition = { x: 20, y: 20 },
}: DraggableDesktopIconProps) {
  const [isSelected, setIsSelected] = useState(false)
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const iconRef = useRef<HTMLDivElement>(null)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSelected(true)
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSelected(false)
    onClick()
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isSelected) {
      e.stopPropagation()
      setIsDragging(true)
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault()
      // Calculate new position
      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y

      // Ensure icon stays within desktop bounds
      const desktopHeight = window.innerHeight - 40 // Subtract taskbar height
      const desktopWidth = window.innerWidth

      // Icon dimensions (approximate)
      const iconWidth = 80
      const iconHeight = 80

      // Constrain position
      const constrainedX = Math.max(0, Math.min(newX, desktopWidth - iconWidth))
      const constrainedY = Math.max(0, Math.min(newY, desktopHeight - iconHeight))

      setPosition({
        x: constrainedX,
        y: constrainedY,
      })
    }
  }

  const handleMouseUp = (e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault()
      setIsDragging(false)
    }
  }

  // Handle click outside to deselect
  const handleClickOutside = (e: MouseEvent) => {
    if (iconRef.current && !iconRef.current.contains(e.target as Node)) {
      setIsSelected(false)
    }
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    } else {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }

    // Add click outside listener
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDragging, isSelected])

  return (
    <div
      ref={iconRef}
      className={`absolute flex w-20 flex-col items-center p-2 text-center cursor-pointer ${
        isSelected ? "bg-[#0a246a]/40" : ""
      } ${isDragging ? "opacity-70" : ""}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      tabIndex={0}
    >
      <div className="h-16 w-16 relative">
        <Image src={icon || "/placeholder.svg"} alt={name} fill className="object-contain" />
      </div>
      <span className="mt-1 text-xs text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">{name}</span>
    </div>
  )
}
