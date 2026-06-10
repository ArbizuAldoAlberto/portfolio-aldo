import { notFound } from 'next/navigation';

export default async function SubdomainPage({
  params
}: {
  params: Promise<{ locale: string; subdomain: string }>
}) {
  const { subdomain, locale } = await params;

  const validSubdomains = [
    'walbi', 'titanflow', 'aureus', 'techzone', 'sentinelos',
    'aeroshot', 'agromarket', 'cannabis', 'ecoconnect',
    'pawhero', 'impresion3d', 'habitat', 'marketingadvisor',
    'nomadhub'
  ];

  if (!validSubdomains.includes(subdomain)) {
    notFound();
  }

  return (
    <div className='min-h-screen bg-[var(--color-space-black)] text-white flex flex-col items-center justify-center p-8 font-mono'>
      <div className='glass-surface p-12 border-l-4 border-l-[var(--color-orbital-teal)] max-w-2xl w-full'>
        <h1 className='text-4xl font-serif font-bold mb-4 uppercase tracking-tighter'>
          {subdomain} <span className='text-[var(--color-orbital-teal)]'>Node</span>
        </h1>
        <div className='h-px bg-[var(--color-space-border)] w-full mb-8' />
        <p className='text-[var(--color-mist-gray)] mb-8 leading-relaxed'>
          Bienvenido a la terminal dedicada de <strong className='text-white'>{subdomain}</strong>.
          Esta secci�n est� siendo desplegada bajo la infraestructura Multi-Tenant de Arbizu Labs.
        </p>
        <div className='grid grid-cols-2 gap-4 text-[10px] uppercase tracking-widest text-[var(--color-mist-gray)]/50'>
          <div className='border border-[var(--color-space-border)] p-4 bg-black/20'>
            Status: <span className='text-green-400'>Nominal</span>
          </div>
          <div className='border border-[var(--color-space-border)] p-4 bg-black/20'>
            Locale: <span className='text-white'>{locale}</span>
          </div>
        </div>
        <a
          href={'/' + locale}
          className='mt-12 inline-block text-[var(--color-orbital-teal)] hover:text-white transition-colors text-sm'
        >
          ? Regresar al Nodo Central
        </a>
      </div>
    </div>
  );
}

