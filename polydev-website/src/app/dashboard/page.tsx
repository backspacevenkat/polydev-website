import { requireAuth, getUserProfile } from '@/lib/auth'
import { DashboardClient } from './dashboard-client'

export default async function DashboardPage() {
  const user = await requireAuth()
  const profile = await getUserProfile(user.id)

  if (!profile) {
    // Handle case where profile doesn't exist
    return <div>Error: Profile not found</div>
  }

  return <DashboardClient user={user} profile={profile} />
}