export const LOGO_URL = `${import.meta.env.BASE_URL}logo.png`
export const PHONE_DISPLAY = '(11) 98427-0908'
export const PHONE_WA = '5511984270908'
export const ADDRESS = 'Rua Julio Frank, 111 A — Parque Arariba, SP'
export const MAPS_URL = 'https://www.google.com/maps/search/Rua+Julio+Frank+111+A+Parque+Arariba+SP'

export function waLink(text) {
  return `https://wa.me/${PHONE_WA}?text=${encodeURIComponent(text)}`
}

export const SERVICES = [
  { title: 'Progressiva', duration: '3h', desc: 'Com ou sem formol. Alisa e reduz o volume dos fios com resultado duradouro.' },
  { title: 'Selagem Térmica', duration: '2h', desc: 'Sela as cutículas do cabelo, com brilho intenso e menos frizz.' },
  { title: 'Botox Capilar Premium', duration: '2h30', desc: 'Reposição de massa capilar. Cabelo mais denso, macio e com movimento.' },
  { title: 'Manicure & Pedicure Spa', duration: '1h30', desc: 'Cuidado completo para mãos e pés com acabamento impecável.' },
  { title: 'Design de Sobrancelhas', duration: '45min', desc: 'Modelagem personalizada para realçar o olhar.' },
  { title: 'Sobrancelhas com Henna', duration: '1h', desc: 'Coloração natural com efeito duradouro.' },
]

export const BOOKING_SERVICES = [
  'Progressiva (Com/Sem Formol)',
  'Selagem Térmica',
  'Botox Capilar Premium',
  'Manicure & Pedicure Spa',
  'Design de Sobrancelhas',
  'Sobrancelhas com Henna',
  'Outro serviço',
]
