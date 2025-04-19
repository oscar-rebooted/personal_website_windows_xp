"use client"

import { useState, useEffect } from "react"
import { Window } from "@/components/window"
import Image from "next/image"
import { ExternalLink, Github } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  mediaUrl: string
  mediaType: "image" | "video"
  githubUrl: string
  liveUrl?: string
}

interface ProjectsWindowProps {
  id: string
}

export function ProjectsWindow({ id }: ProjectsWindowProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/data/projects.json")

        if (!response.ok) {
          throw new Error(`Failed to fetch projects data: ${response.status}`)
        }

        const text = await response.text()

        try {
          const data = JSON.parse(text)
          setProjects(data)
          setError(null)
        } catch (parseError) {
          console.error("JSON Parse Error:", parseError)
          throw new Error(`JSON parsing error: ${(parseError as Error).message}`)
        }
      } catch (error) {
        console.error("Error loading projects:", error)
        setError((error as Error).message)

        // Retry logic - only retry a few times to avoid infinite loops
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount((prev) => prev + 1)
          }, 1000) // Wait 1 second before retrying
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [retryCount])

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  return (
    <Window id={id} title="My Projects" width={800} height={600}>
      <div className="p-4 bg-[#ECE9D8] h-full overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p>Loading projects...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 flex flex-col items-center">
            <p>Error loading projects: {error}</p>
            <button onClick={handleRetry} className="mt-4 px-4 py-2 bg-[#3b6ea5] text-white rounded hover:bg-[#2c5a8a]">
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white border border-gray-300 rounded-lg shadow-sm p-4">
                <div className="relative h-[150px] w-full mb-3 bg-gray-100 rounded overflow-hidden">
                  {project.mediaType === "video" ? (
                    <video src={project.mediaUrl} autoPlay loop muted className="object-cover w-full h-full" />
                  ) : (
                    <Image
                      src={project.mediaUrl || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                <h2 className="text-lg font-bold text-[#0A246A]">{project.title}</h2>
                <p className="text-sm text-gray-700 mb-3">{project.description}</p>

                <div className="flex space-x-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-xs text-[#0A246A] hover:underline"
                    >
                      <Github size={14} className="mr-1" />
                      GitHub
                    </a>
                  )}

                  {project.liveUrl && project.liveUrl !== "n.a." && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-xs text-[#0A246A] hover:underline"
                    >
                      <ExternalLink size={14} className="mr-1" />
                      View Live
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Window>
  )
}
