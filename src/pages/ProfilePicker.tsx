import { useNavigate } from 'react-router-dom'
import { ChildAvatar } from '../components/ChildAvatar'
import { useChildren } from '../context/ChildrenContext'
import { Mascot } from '../components/Mascot'

export function ProfilePicker() {
  const { children } = useChildren()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 px-6 py-12">
      <Mascot mood="idle" size={100} />
      <h1 className="font-heading text-3xl font-extrabold text-slate-700">Kim Fırçalayacak?</h1>
      <div className="flex flex-wrap justify-center gap-5">
        {children.map((child) => (
          <button
            key={child.id}
            onClick={() => navigate(`/home/${child.id}`)}
            className="flex w-32 flex-col items-center gap-2 rounded-3xl bg-white p-4 shadow-md transition hover:-translate-y-1 active:scale-95"
          >
            <ChildAvatar avatar={child.avatar} color={child.color} />
            <span className="truncate font-heading text-lg font-bold text-slate-700">{child.name}</span>
          </button>
        ))}
        <button
          onClick={() => navigate('/onboarding')}
          className="flex w-32 flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-mint-300 p-4 text-mint-500 transition hover:bg-mint-50 active:scale-95"
          style={{ minHeight: 132 }}
        >
          <span className="text-3xl">➕</span>
          <span className="font-heading font-bold">Yeni Çocuk</span>
        </button>
      </div>
      <button
        onClick={() => navigate('/parent')}
        className="mt-6 font-body text-sm font-semibold text-slate-400 underline"
      >
        Ebeveyn Girişi
      </button>
    </div>
  )
}
