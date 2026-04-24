'use client'
import { useEffect } from 'react'
import Hero from '../components/hero/Hero'
import Manifesto from '../components/sections/Manifesto'
import Services from '../components/sections/Services'
import Projects from '../components/sections/Projects'
import CryptoLab from '../components/sections/CryptoLab'
import Contact from '../components/sections/Contact'

export default function Home() {
  useEffect(() => {
    console.log(`
  ██████╗ ███████╗███╗   ██╗████████╗██╗     ███████╗███╗   ███╗ █████╗ ███╗   ██╗
  ██╔════╝██╔════╝████╗  ██║╚══██╔══╝██║     ██╔════╝████╗ ████║██╔══██╗████╗  ██║
  ██║     █████╗  ██╔██╗ ██║   ██║   ██║     █████╗  ██╔████╔██║███████║██╔██╗ ██║
  ██║     ██╔══╝  ██║╚██╗██║   ██║   ██║     ██╔══╝  ██║╚██╔╝██║██╔══██║██║╚██╗██║
  ╚██████╗███████╗██║ ╚████║   ██║   ███████╗███████╗██║ ╚═╝ ██║██║  ██║██║ ╚████║
   ╚═════╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝
  
  Hola, soy Aldo. Si llegaste hasta acá, probablemente somos el mismo tipo de persona.
  Escribime: arbizualdoalberto@gmail.com
  
  También podés ver el código de este portfolio en GitHub.
  github.com/ArbizuAldoAlberto
    `)
  }, [])

  return (
    <main className="min-h-screen">
      <Hero />
      <Manifesto />
      <Services />
      <Projects />
      <CryptoLab />
      <Contact />
    </main>
  )
}
