import { useChildren } from '../context/ChildrenContext'
import { Onboarding } from './Onboarding'
import { ProfilePicker } from './ProfilePicker'

export function Root() {
  const { children } = useChildren()
  return children.length === 0 ? <Onboarding /> : <ProfilePicker />
}
