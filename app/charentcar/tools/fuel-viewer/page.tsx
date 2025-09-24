import FuelTypeViewer from '@/components/FuelTypeViewer'
import ToolLayout from '@/components/layout/ToolLayout'

export default function FuelViewerPage() {
  return (
    <ToolLayout toolName="연료타입조회">
      <FuelTypeViewer />
    </ToolLayout>
  )
}
