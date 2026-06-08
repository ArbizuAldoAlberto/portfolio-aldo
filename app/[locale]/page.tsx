'use client'
import { useEffect } from 'react'
import Hero from '../../components/hero/Hero'
import TechMarquee from '../../components/ui/TechMarquee'
import Manifesto from '../../components/sections/Manifesto'
import SectionDivider from '../../components/ui/SectionDivider'
import OfflineSimulator from '../../components/sections/OfflineSimulator'
import Services from '../../components/sections/Services'
import Projects from '../../components/sections/Projects'
import StudioLab from '../../components/sections/StudioLab'
import CryptoLab from '../../components/sections/CryptoLab'
import NexusTelemetry from '../../components/sections/NexusTelemetry'
import Contact from '../../components/sections/Contact'

export default function Home() {
  return (
    <main className='min-h-screen'>
      <Hero />
      <TechMarquee />
      <SectionDivider variant='fade' />
      <Manifesto />
      <SectionDivider variant='wave' />
      <Projects />
      <SectionDivider variant='diagonal' />
      <OfflineSimulator />
      <SectionDivider variant='fade' />
      <Services />
      <SectionDivider variant='wave' flip />
      <StudioLab />
      <SectionDivider variant='diagonal' flip />
      <CryptoLab />
      <SectionDivider variant='fade' />
      <NexusTelemetry />
      <SectionDivider variant='wave' />
      <Contact />
    </main>
  )
}
