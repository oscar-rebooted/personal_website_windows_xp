"use client"

import { useState, useEffect } from "react"
import { Window } from "@/components/window"

interface BioWindowProps {
  id: string
}

export function BioWindow({ id }: BioWindowProps) {
  const [content, setContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch the content of the bio.txt file
    setIsLoading(true)
    fetch("/bio.txt")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch bio.txt: ${response.status}`)
        }
        return response.text()
      })
      .then((text) => {
        setContent(text)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error loading file:", error)
        setError(error.message)
        setIsLoading(false)
      })
  }, [])

  return (
    <Window id={id} title="Bio.txt">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4">
          <p>Error loading bio.txt: {error}</p>
        </div>
      ) : (
        <pre className="font-['Lucida_Console'] text-sm whitespace-pre-wrap p-2">{content}</pre>
      )}
    </Window>
  )
}
