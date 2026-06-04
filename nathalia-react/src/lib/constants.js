export const LOGO_URL = `${import.meta.env.BASE_URL}logo.png`
export const OWNER_PHOTO_URL = `${import.meta.env.BASE_URL}proprietaria.jpg`
export const PHONE_DISPLAY = '(11) 98427-0908'
export const PHONE_WA = '5511984270908'
export const ADDRESS = 'Rua Julio Frank, 111 A — Parque Arariba, SP'
export const MAPS_URL = 'https://www.google.com/maps/search/Rua+Julio+Frank+111+A+Parque+Arariba+SP'
export const MAPS_EMBED_URL =
  'https://maps.google.com/maps?q=Rua+Julio+Frank+111+A+Parque+Arariba+SP&hl=pt-BR&z=16&output=embed'
export const HOURS_LABEL = 'Terça a Sábado, 9h às 19h'

export const INSTAGRAM_HANDLE = 'nathaliaestrela1235'
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`

export const DEVELOPER_INSTAGRAM_HANDLE = 'lucasdmxx'
export const DEVELOPER_INSTAGRAM_URL = `https://www.instagram.com/${DEVELOPER_INSTAGRAM_HANDLE}/`

const gallery = (file, alt, category) => ({
  src: `${import.meta.env.BASE_URL}gallery/${file}`,
  alt,
  category,
})

/** Fotos fixas no deploy (fallback se ainda não houver upload no painel) */
export const STATIC_GALLERY_IMAGES = [
  gallery('cabelo-1.jpg', 'Trabalho capilar', 'Cabelo'),
  gallery('unhas-1.jpg', 'Manicure', 'Unhas'),
  gallery('cabelo-2.jpg', 'Trabalho capilar', 'Cabelo'),
  gallery('unhas-2.jpg', 'Manicure', 'Unhas'),
  gallery('cabelo-3.jpg', 'Trabalho capilar', 'Cabelo'),
  gallery('unhas-3.jpg', 'Manicure', 'Unhas'),
  gallery('cabelo-4.jpg', 'Trabalho capilar', 'Cabelo'),
  gallery('unhas-4.jpg', 'Manicure', 'Unhas'),
  gallery('cabelo-5.jpg', 'Trabalho capilar', 'Cabelo'),
  gallery('unhas-5.jpg', 'Manicure e pedicure', 'Unhas'),
  gallery('cabelo-6.jpg', 'Trabalho capilar', 'Cabelo'),
  gallery('unhas-6.jpg', 'Manicure', 'Unhas'),
]

/** @deprecated use STATIC_GALLERY_IMAGES ou fotos da nuvem */
export const GALLERY_IMAGES = STATIC_GALLERY_IMAGES

export { GALLERY_PRESET_CATEGORIES, GALLERY_OTHER_LABEL } from './galleryCategories'

/** Troque pelos depoimentos reais das clientes (com autorização) */
export const TESTIMONIALS = [
  {
    name: 'Mariana S.',
    service: 'Progressiva',
    text: 'Atendimento impecável e resultado lindo. Super recomendo!',
  },
  {
    name: 'Juliana R.',
    service: 'Sobrancelha Design',
    text: 'Ambiente acolhedor e profissional. Voltarei com certeza.',
  },
]

export function waLink(text) {
  return `https://wa.me/${PHONE_WA}?text=${encodeURIComponent(text)}`
}

export const SERVICES = [
  { title: 'Progressiva', price: 'A partir de R$ 200,00', duration: '3h', desc: 'Com ou sem formol. Alisa e reduz o volume dos fios com resultado duradouro.' },
  { title: 'Botox Capilar', price: 'A partir de R$ 150,00', duration: '2h30', desc: 'Reposição de massa capilar. Cabelo mais denso, macio e com movimento.' },
  { title: 'Selagem Térmica', price: 'A partir de R$ 180,00', duration: '2h', desc: 'Sela as cutículas do cabelo, com brilho intenso e menos frizz.' },
  { title: 'Reconstrução Capilar', price: 'A partir de R$ 80,00', duration: '1h30', desc: 'Tratamento de reconstrução para fios danificados e fragilizados.' },
  { title: 'Hidratação', price: 'A partir de R$ 60,00', duration: '1h', desc: 'Hidratação profunda para maciez, brilho e saúde dos fios.' },
  { title: 'Mão', price: 'R$ 35,00', duration: '45min', desc: 'Cuidado completo para as mãos com acabamento impecável.' },
  { title: 'Pé', price: 'R$ 45,00', duration: '1h', desc: 'Cuidado completo para os pés com acabamento impecável.' },
  { title: 'Pé e Mão', price: 'R$ 75,00', duration: '1h30', desc: 'Combo completo para mãos e pés.' },
  { title: 'Corte Masculino', price: 'R$ 35,00', duration: '30min', desc: 'Corte masculino com acabamento profissional.' },
  { title: 'Sobrancelha Design', price: 'R$ 25,00', duration: '30min', desc: 'Modelagem personalizada para realçar o olhar.' },
  { title: 'Sobrancelha com Henna', price: 'R$ 50,00', duration: '1h', desc: 'Design com henna para definição e cor duradoura.' },
]

export const BOOKING_SERVICES = SERVICES.map((s) => s.title)

/** Marca horários bloqueados no painel (ocupam a agenda pública) */
export const BLOCKED_SERVICE = 'Horário bloqueado'

export const SLOT_TIMES = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '13:00', '13:30', '14:00', '14:30', '15:00',
  '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00',
]
