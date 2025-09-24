import ReservationList from '@/components/ReservationList'
import ToolLayout from '@/components/layout/ToolLayout'

export default function ReservationsPage() {
  return (
    <ToolLayout toolName="예약관리">
      <ReservationList />
    </ToolLayout>
  )
}
