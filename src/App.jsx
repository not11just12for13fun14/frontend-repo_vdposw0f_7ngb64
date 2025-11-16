import { useEffect, useMemo, useState } from 'react'
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CalendarClock,
  ClipboardList,
  FileBarChart,
  Image as ImageIcon,
  Loader2,
  Search,
  Bell,
  Settings,
  Menu,
} from 'lucide-react'

function StatPill({ label, value }) {
  return (
    <div className="px-3 py-2 rounded-md bg-white/60 border border-gray-200 text-sm text-gray-700">
      <span className="font-medium text-gray-900">{value}</span>
      <span className="text-gray-500 ml-1">{label}</span>
    </div>
  )
}

function ModuleCard({ module, onSelect, active }) {
  const iconMap = {
    'patient-management': <Users className="h-5 w-5" />,
    'patient-registration': <UserPlus className="h-5 w-5" />,
    'exam-scheduling': <CalendarClock className="h-5 w-5" />,
    'procedure-management': <ClipboardList className="h-5 w-5" />,
    'diagnostic-reporting': <FileBarChart className="h-5 w-5" />,
    'image-archiving': <ImageIcon className="h-5 w-5" />,
  }

  const kpis = module.kpis || {}

  return (
    <button
      onClick={() => onSelect(module.id)}
      className={`group text-left w-full rounded-xl border transition-all ${
        active
          ? 'border-blue-600 ring-4 ring-blue-100 bg-white'
          : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white/70'
      }`}
    >
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-lg grid place-items-center ${
                active ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'
              }`}
            >
              {iconMap[module.id] || <LayoutDashboard className="h-5 w-5" />}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {module.title}
            </h3>
          </div>
          <span className="text-xs uppercase tracking-wide px-2 py-1 rounded-full bg-gray-100 text-gray-600">
            Module
          </span>
        </div>
        <p className="mt-3 text-sm text-gray-600 line-clamp-2">{module.description}</p>

        {Object.keys(kpis).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(kpis).map(([k, v]) => (
              <StatPill key={k} label={k} value={String(v)} />
            ))}
          </div>
        )}
      </div>
    </button>
  )
}

function App() {
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [active, setActive] = useState('patient-management')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const backendUrl = useMemo(
    () => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000',
    []
  )

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${backendUrl}/api/modules`)
        if (!res.ok) throw new Error('Gagal memuat data modul')
        const data = await res.json()
        setModules(data)
        setError('')
      } catch (e) {
        setError(e.message || 'Terjadi kesalahan')
      } finally {
        setLoading(false)
      }
    }

    fetchModules()
  }, [backendUrl])

  const activeModule = modules.find((m) => m.id === active)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Topbar */}
      <header className="sticky top-0 z-20 backdrop-blur bg-white/70 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setSidebarOpen((s) => !s)}
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5 text-gray-700" />
            </button>
            <div className="h-9 w-9 rounded-lg bg-blue-600 grid place-items-center">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Clinical Operations Dashboard</h1>
              <p className="text-xs text-gray-500">Radiology • Patient Flow • Reporting</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                className="pl-9 pr-3 py-2 w-64 rounded-md border border-gray-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Cari modul, pasien, jadwal..."
              />
            </div>
            <button className="p-2 rounded-md hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-md hover:bg-gray-100">
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
            <div className="ml-2 h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 sm:px-6 lg:px-8 py-6">
        {/* Sidebar */}
        <aside
          className={`lg:col-span-3 xl:col-span-2 space-y-3 ${
            sidebarOpen ? 'block' : 'hidden'
          } lg:block`}
        >
          <div className="rounded-xl border border-gray-200 bg-white/70 p-3">
            <p className="text-xs font-semibold text-gray-500 mb-2 px-2">Menu Utama</p>
            <nav className="space-y-2">
              {modules.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setActive(m.id)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    active === m.id
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {m.id === 'patient-management' && <Users className="h-4 w-4" />}
                  {m.id === 'patient-registration' && <UserPlus className="h-4 w-4" />}
                  {m.id === 'exam-scheduling' && <CalendarClock className="h-4 w-4" />}
                  {m.id === 'procedure-management' && <ClipboardList className="h-4 w-4" />}
                  {m.id === 'diagnostic-reporting' && <FileBarChart className="h-4 w-4" />}
                  {m.id === 'image-archiving' && <ImageIcon className="h-4 w-4" />}
                  <span>{m.title}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
            <p className="text-sm font-medium text-blue-900">Koneksi Backend</p>
            <p className="text-xs text-blue-800/80 mt-1 break-all">
              {backendUrl}
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9 xl:col-span-10 space-y-6">
          {loading ? (
            <div className="h-72 grid place-items-center">
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Memuat data dashboard...</span>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
              <p className="text-red-700 font-medium">{error}</p>
              <p className="text-red-600 text-sm mt-1">Pastikan backend aktif dan variabel lingkungan sudah diset.</p>
            </div>
          ) : (
            <>
              {/* Overview Cards */}
              <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {modules.slice(0, 4).map((m) => (
                  <ModuleCard
                    key={m.id}
                    module={m}
                    onSelect={setActive}
                    active={active === m.id}
                  />
                ))}
              </section>

              {/* Active Module Detail */}
              {activeModule && (
                <section className="rounded-2xl border border-gray-200 bg-white p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {activeModule.title}
                      </h2>
                      <p className="text-gray-600 mt-1 max-w-2xl">
                        {activeModule.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeModule.kpis &&
                        Object.entries(activeModule.kpis).map(([k, v]) => (
                          <StatPill key={k} label={k} value={String(v)} />
                        ))}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {activeModule.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4"
                      >
                        <p className="text-sm text-gray-700">{h}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-500">
                      Action placeholder untuk "{activeModule.title}" (contoh: tambah pasien, buat jadwal, unggah studi). Ini bisa kita implementasikan selanjutnya sesuai kebutuhan Anda.
                    </div>
                  </div>
                </section>
              )}

              {/* Remaining Modules */}
              {modules.length > 4 && (
                <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {modules.slice(4).map((m) => (
                    <ModuleCard
                      key={m.id}
                      module={m}
                      onSelect={setActive}
                      active={active === m.id}
                    />
                  ))}
                </section>
              )}
            </>
          )}
        </main>
      </div>

      <footer className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-gray-500">
          © {new Date().getFullYear()} Clinical Suite • Dibangun untuk menampilkan alur kerja radiologi modern.
        </div>
      </footer>
    </div>
  )
}

export default App
