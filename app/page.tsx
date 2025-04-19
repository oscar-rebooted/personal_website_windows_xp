import { WindowsXPDesktop } from "@/components/windows-xp-desktop"
import { WindowsProvider } from "@/contexts/windows-context"

export default function Home() {
  return (
    <WindowsProvider>
      <WindowsXPDesktop />
    </WindowsProvider>
  )
}
