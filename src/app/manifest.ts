import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'StatVidya Workforce Intelligence',
    short_name: 'StatVidya',
    description: 'Workforce competency assessment and intelligence platform for MoSPI',
    start_url: '/',
    display: 'standalone',
    background_color: '#F4F6FB',
    theme_color: '#1C4CA1',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
