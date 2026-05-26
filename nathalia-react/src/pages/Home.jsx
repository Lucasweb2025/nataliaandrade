import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ScrollReveal from '../components/ScrollReveal'

const LOGO_URL = 'https://i.ibb.co/z0mCqFy/logosemfundo.png'
const WA_URL = 'https://wa.me/5511984270908?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os.'

const SERVICES = [
  {
    title: 'Progressiva',
    desc: 'Com ou sem formol. Alisa e reduz o volume dos fios com resultado duradouro.',
  },
  {
    title: 'Selagem Termica',
    desc: 'Sela as cuticulas do cabelo, proporcionando brilho intenso e reducao do frizz.',
  },
  {
    title: 'Botox Capilar Premium',
    desc: 'Reposicao de massa capilar profunda. Cabelo mais denso, macio e com movimento.',
  },
  {
    title: 'Manicure & Pedicure Spa',
    desc: 'Cuidado completo para maos e pes com acabamento impecavel e esmaltacao de qualidade.',
  },
  {
    title: 'Design de Sobrancelhas',
    desc: 'Modelagem personalizada para realcar o olhar e harmonizar o rosto.',
  },
  {
    title: 'Sobrancelhas com Henna',
    desc: 'Coloracao natural que define e preenche as sobrancelhas com efeito duradouro.',
  },
]

const FEATURES = [
  {
    num: '01',
    title: 'Atendimento personalizado',
    desc: 'Cada cliente recebe uma consultoria para encontrar o melhor tratamento.',
  },
  {
    num: '02',
    title: 'Produtos premium',
    desc: 'Trabalhamos apenas com marcas profissionais de primeira linha.',
  },
  {
    num: '03',
    title: 'Agendamento online',
    desc: 'Escolha data e horario sem precisar ligar. Rapido, facil e pratico.',
  },
]

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="marble-bg relative overflow-hidden">
        <div className="absolute top-20 right-0 w-80 h-80 bg-rose-gold/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-gold/5 rounded-full blur-[80px]" />

        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28 md:py-36 flex flex-col items-center text-center relative z-10">
          <motion.img
            src={LOGO_URL}
            alt="Nathalia Andrade - Salao de Beleza"
            className="w-52 sm:w-64 md:w-72 h-auto mb-10 drop-shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.p
            className="font-serif text-2xl sm:text-3xl md:text-4xl text-warm-gray italic leading-relaxed max-w-lg mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Realcando sua beleza natural com excelencia.
          </motion.p>

          <motion.p
            className="text-sm text-warm-gray-light mb-12 max-w-md leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Especialista em tratamentos capilares e estetica.
            Atendimento personalizado em um ambiente acolhedor.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link
              to="/agenda"
              className="btn-luxury px-9 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em]"
            >
              Agendar agora
            </Link>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold px-9 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em]"
            >
              Falar no WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      <div className="gold-separator" />

      {/* Servicos */}
      <section id="servicos" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <ScrollReveal className="text-center mb-14 sm:mb-20">
            <p className="text-[10px] font-semibold text-rose-gold uppercase tracking-[0.35em] mb-4">
              Nossos servicos
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-wide">
              Tratamentos{' '}
              <span className="text-rose-gold italic">Signature</span>
            </h2>
          </ScrollReveal>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
          >
            {SERVICES.map((svc) => (
              <motion.div key={svc.title} variants={staggerItem}>
                <div className="card-luxury rounded-2xl p-8 h-full flex flex-col">
                  <h3 className="font-serif text-lg font-semibold text-charcoal mb-3 tracking-wide">
                    {svc.title}
                  </h3>
                  <p className="text-sm text-warm-gray leading-relaxed flex-1">
                    {svc.desc}
                  </p>
                  <Link
                    to="/agenda"
                    className="inline-block mt-5 text-[10px] font-bold text-rose-gold uppercase tracking-[0.18em] border-b border-rose-gold/40 hover:border-rose-gold pb-0.5 transition-colors duration-300 self-start"
                  >
                    Agendar
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="gold-separator" />

      {/* Sobre */}
      <section id="sobre" className="bg-white py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal>
              <div className="marble-dark rounded-[2rem] p-10 sm:p-14 text-white relative overflow-hidden border border-gold/10">
                <p className="text-[10px] font-semibold text-rose-gold uppercase tracking-[0.35em] mb-5">
                  Sobre o salao
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl mb-7 leading-tight tracking-wide">
                  Um espaco pensado para{' '}
                  <span className="text-rose-gold italic">voce</span>
                </h2>
                <p className="text-sm text-warm-gray-light leading-relaxed mb-5">
                  O Salao Nathalia Andrade nasceu da paixao por realcar a beleza unica de cada mulher.
                  Oferecemos tratamentos capilares e esteticos com produtos de alta qualidade em um
                  ambiente acolhedor e exclusivo.
                </p>
                <p className="text-sm text-warm-gray-light leading-relaxed">
                  Cada atendimento e personalizado, porque acreditamos que voce merece um cuidado especial.
                </p>
              </div>
            </ScrollReveal>

            <div className="space-y-8">
              {FEATURES.map((f, i) => (
                <ScrollReveal key={f.num} delay={i * 0.12}>
                  <div className="flex gap-6 items-start">
                    <span className="font-serif text-3xl font-semibold text-gold/30 shrink-0 leading-none mt-1">
                      {f.num}
                    </span>
                    <div>
                      <h3 className="font-semibold text-charcoal mb-1.5 tracking-wide">{f.title}</h3>
                      <p className="text-sm text-warm-gray leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="gold-separator" />

      {/* Horarios + Localizacao */}
      <section id="localizacao" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScrollReveal>
              <div className="card-luxury rounded-2xl p-8 sm:p-10 h-full">
                <p className="text-[10px] font-semibold text-rose-gold uppercase tracking-[0.35em] mb-5">
                  Horario de funcionamento
                </p>
                <div className="space-y-3.5">
                  {[
                    ['Segunda-feira', 'Fechado', true],
                    ['Terca a Sexta', '9h as 18h', false],
                    ['Sabado', '9h as 18h', false],
                    ['Domingo', 'Fechado', true],
                  ].map(([day, time, closed]) => (
                    <div key={day} className="flex justify-between text-sm border-b border-gold/8 pb-3">
                      <span className="text-warm-gray">{day}</span>
                      <span className={`font-medium ${closed ? 'text-warm-gray-light' : 'text-charcoal'}`}>
                        {time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="card-luxury rounded-2xl p-8 sm:p-10 h-full flex flex-col">
                <p className="text-[10px] font-semibold text-rose-gold uppercase tracking-[0.35em] mb-5">
                  Localizacao
                </p>
                <h3 className="font-serif text-lg font-semibold text-charcoal mb-2 tracking-wide">
                  Atelie de Beleza
                </h3>
                <p className="text-sm text-warm-gray leading-relaxed mb-6 flex-1">
                  Rua Julio Frank, 111 A<br />
                  Parque Arariba, SP
                </p>
                <a
                  href="https://www.google.com/maps/search/Rua+Julio+Frank+111+A+Parque+Arariba+SP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-gold inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-[0.15em] self-start"
                >
                  Abrir no Google Maps
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="marble-dark py-20 sm:py-24 border-t border-gold/10">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <ScrollReveal>
            <h2 className="font-serif text-3xl sm:text-4xl text-white mb-5 tracking-wide">
              Pronta para se cuidar?
            </h2>
            <p className="text-sm text-warm-gray-light mb-10 max-w-md mx-auto leading-relaxed">
              Escolha a data e horario que preferir. Agendamento rapido, sem complicacao.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/agenda"
                className="bg-white hover:bg-marble-warm text-charcoal px-9 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Agendar agora
              </Link>
              <a
                href="https://wa.me/5511984270908?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20hor%C3%A1rio."
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/20 hover:border-gold/50 text-white px-9 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300"
              >
                Chamar no WhatsApp
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}
