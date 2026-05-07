import { Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Navbar            from './components/layout/Navbar'
import Footer            from './components/layout/Footer'
import PageTransition    from './components/layout/PageTransition'
import ScrollProgressBar from './components/ui/ScrollProgressBar'
import FloatingContact   from './components/ui/FloatingContact'
import ToastContainer    from './components/ui/Toast'
import CookieBanner      from './components/ui/CookieBanner'
import SplashScreen      from './components/ui/SplashScreen'
import { apiClient } from './lib/api'
import { hydrateProgramCache } from './lib/programs'
import { hydrateSiteContentCache } from './lib/siteContent'
import { writeImageOverrides } from './lib/images'
import Home              from './pages/Home'
import OurWork           from './pages/OurWork'
import Team              from './pages/Team'
import Contact           from './pages/Contact'
import ApplyProgram      from './pages/ApplyProgram'

import ProtectedRoute from './components/layout/ProtectedRoute'
import Admin             from './pages/Admin'

// AnimatedRoutes keeps AnimatePresence + useLocation together
// (must be rendered inside BrowserRouter which lives in main.tsx)
function AnimatedRoutes() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path="/"        element={<Home />}    />
          <Route path="/work"    element={<OurWork />} />
          <Route path="/team"    element={<Team />}    />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/apply/internship"
            element={<ApplyProgram programKey="internship" />}
          />
          <Route
            path="/apply/training"
            element={<ApplyProgram programKey="training" />}
          />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }   
          />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  )
}

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const [loading, setLoading] = useState(
    () => !sessionStorage.getItem('cmr-visited'),
  )
  const [isBootstrapping, setIsBootstrapping] = useState(true)

  useEffect(() => {
    let mounted = true

    apiClient
      .getBootstrap()
      .then((data) => {
        hydrateSiteContentCache(data)
        hydrateProgramCache(data)
        if (data.imageOverrides) {
          writeImageOverrides(data.imageOverrides)
        }
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) {
          setIsBootstrapping(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <SplashScreen onDone={() => {
        sessionStorage.setItem('cmr-visited', '1')
        setLoading(false)
      }} />
    )
  }

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f7f3] px-4">
        <div className="rounded-[2rem] border border-black/5 bg-white px-8 py-6 text-center shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6f9d24]">
            Loading Content
          </p>
          <p className="mt-3 text-sm text-black/55">
            Syncing the latest site data...
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="noise-overlay pointer-events-none fixed inset-0 z-0" />
      <div className="relative z-10 flex flex-col min-h-screen">
        {!isAdmin && <ScrollProgressBar />}
        {!isAdmin && <FloatingContact />}
        {!isAdmin && <Navbar />}
        <main className="flex-grow">
          <AnimatedRoutes />
        </main>
        {!isAdmin && <Footer />}
      </div>
      <ToastContainer />
      {!isAdmin && <CookieBanner />}
    </>
  )
}
