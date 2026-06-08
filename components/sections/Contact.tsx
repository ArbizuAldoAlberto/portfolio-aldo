'use client';
import { motion } from 'framer-motion';
import MagneticWrapper from '../ui/MagneticWrapper';
import { Mail } from 'lucide-react';

export default function Contact() {
  return (
    <section id='contact' className='py-20 bg-black text-center'>
      <MagneticWrapper>
        <a href='mailto:tu@email.com' className='inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold'>
          <Mail size={18} /> Contactame
        </a>
      </MagneticWrapper>
    </section>
  );
}