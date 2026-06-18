import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Aldo Arbizu | Dark Orbital',
    short_name: 'Arbizu Labs',
    description: 'Portfolio inmersivo de Aldo Arbizu — Product Engineer & B2B Architect',
    start_url: '/',
    display: 'standalone',
    background_color: '#050508',
    theme_color: '#1D9E75',
    orientation: 'any',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
