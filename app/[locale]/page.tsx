'use client'

import Hero from '../../components/hero/Hero'
import TechMarquee from '../../components/ui/TechMarquee'
import Manifesto from '../../components/sections/Manifesto'
import SectionDivider from '../../components/ui/SectionDivider'
import OfflineSimulator from '../../components/sections/OfflineSimulator'
import Services from '../../components/sections/Services'
import Projects from '../../components/sections/Projects'
import DeveloperStore from '../../components/sections/DeveloperStore'
import StudioLab from '../../components/sections/StudioLab'
import TitanFlow from '../../components/sections/TitanFlow'
import NexusTelemetry from '../../components/sections/NexusTelemetry'
import Arsenal from '../../components/sections/Arsenal'
import Contact from '../../components/sections/Contact'
import Footer from '../../components/layout/Footer'
import FloatingProjectsButton from '../../components/ui/FloatingProjectsButton'
import { usePersona } from '../../components/theme/PersonaContext'

export default function Home() {
  const { persona } = usePersona()

  return (
    <main className='min-h-screen'>
      <Hero />
      <TechMarquee />
      <SectionDivider variant='fade' />
      <Manifesto />
      <SectionDivider variant='wave' />
      <Projects />
      <SectionDivider variant='diagonal' />
      <DeveloperStore />
      <SectionDivider variant='fade' />
      
      {persona === 'engineer' && (
        <>
          <OfflineSimulator />
          <SectionDivider variant='fade' />
        </>
      )}

      <Services />
      <SectionDivider variant='wave' flip />

      {persona !== 'security' && (
        <>
          <StudioLab />
          <SectionDivider variant='diagonal' flip />
        </>
      )}

      {(persona === 'security' || persona === 'engineer') && (
        <>
          <TitanFlow />
          <SectionDivider variant='fade' />
        </>
      )}

      {(persona === 'security' || persona === 'engineer') && (
        <>
          <NexusTelemetry />
          <SectionDivider variant='wave' />
        </>
      )}

      <Arsenal />
      <SectionDivider variant='fade' />
      <Contact />
      <Footer />
      <FloatingProjectsButton />
    </main>
  )
}
