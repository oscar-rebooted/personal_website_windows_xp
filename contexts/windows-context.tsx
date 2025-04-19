"use client"

import { useEffect } from "react"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

// Define window types
export interface WindowProps {
  id: string
  title: string
  content: ReactNode
  initialPosition?: { x: number; y: number }
  width?: number
  height?: number
  isOpen?: boolean
}

// Define context type
interface WindowsContextType {
  windows: Record<string, WindowProps>
  activeWindowId: string | null
  openWindow: (window: WindowProps) => void
  closeWindow: (id: string) => void
  bringToFront: (id: string) => void
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void
}

// Create context with default values
const WindowsContext = createContext<WindowsContextType>({
  windows: {},
  activeWindowId: null,
  openWindow: () => {},
  closeWindow: () => {},
  bringToFront: () => {},
  updateWindowPosition: () => {},
})

// Custom hook to use the windows context
export const useWindows = () => useContext(WindowsContext)

// Provider component
export function WindowsProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<Record<string, WindowProps>>({})
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null)

  // Open a new window or bring existing one to front
  const openWindow = useCallback((windowProps: WindowProps) => {
    console.log("Opening window:", windowProps.id) // Debug log
    setWindows((prev) => ({
      ...prev,
      [windowProps.id]: {
        ...windowProps,
        isOpen: true,
      },
    }))
    setActiveWindowId(windowProps.id)
  }, [])

  // Close a window
  const closeWindow = useCallback(
    (id: string) => {
      console.log("Closing window:", id) // Debug log
      setWindows((prev) => {
        const newWindows = { ...prev }
        if (newWindows[id]) {
          newWindows[id] = {
            ...newWindows[id],
            isOpen: false,
          }
        }
        return newWindows
      })

      // If the closed window was active, clear the active window
      if (activeWindowId === id) {
        setActiveWindowId(null)
      }
    },
    [activeWindowId],
  )

  // Bring a window to the front
  const bringToFront = useCallback(
    (id: string) => {
      console.log("Bringing to front:", id) // Debug log
      if (windows[id]) {
        setActiveWindowId(id)
      }
    },
    [windows],
  )

  // Update window position
  const updateWindowPosition = useCallback((id: string, position: { x: number; y: number }) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        initialPosition: position,
      },
    }))
  }, [])

  // Debug: Log windows state changes
  useEffect(() => {
    console.log("Windows state:", windows)
  }, [windows])

  return (
    <WindowsContext.Provider
      value={{
        windows,
        activeWindowId,
        openWindow,
        closeWindow,
        bringToFront,
        updateWindowPosition,
      }}
    >
      {children}
    </WindowsContext.Provider>
  )
}
