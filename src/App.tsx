import { Route, Routes } from 'react-router-dom'
import { ChildrenProvider } from './context/ChildrenContext'
import { Root } from './pages/Root'
import { Onboarding } from './pages/Onboarding'
import { Home } from './pages/Home'
import { Brush } from './pages/Brush'
import { Rewards } from './pages/Rewards'
import { Parent } from './pages/Parent'
import { NiloHome } from './pages/NiloHome'
import { StarShop } from './pages/StarShop'

function App() {
  return (
    <ChildrenProvider>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/home/:childId" element={<Home />} />
        <Route path="/brush/:childId/:session" element={<Brush />} />
        <Route path="/rewards/:childId" element={<Rewards />} />
        <Route path="/room/:childId" element={<NiloHome />} />
        <Route path="/shop/:childId" element={<StarShop />} />
        <Route path="/parent" element={<Parent />} />
      </Routes>
    </ChildrenProvider>
  )
}

export default App
