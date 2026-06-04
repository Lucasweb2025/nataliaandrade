import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ScrollReveal from '../components/ScrollReveal'
import Gallery from '../components/Gallery'
import Testimonials from '../components/Testimonials'
import LocationMap from '../components/LocationMap'
import { LOGO_URL, SERVICES, waLink, ADDRESS, MAPS_URL, HOURS_LABEL } from '../lib/constants'

const WA_URL = waLink('Olá! Gostaria de saber mais sobre os serviços.')

const FEATURES = [
  { num: '01', title: 'Atendimento personalizado', desc: 'Cada cliente recebe uma consultoria para encontrar o melhor tratamento.' },
  { num: '02', title: 'Produtos premium', desc: 'Trabalhamos apenas com marcas profissionais de primeira linha.' },
  { num: '03', title: 'Agendamento online', desc: 'Escolha data e horário sem precisar ligar. Rápido e prático.' },
]

const STEPS = [
  { step: '1', title: 'Escolha o serviço', desc: 'Veja os tratamentos e toque em Agendar.' },
  { step: '2', title: 'Data e horário', desc: 'Selecione no calendário um horário disponível.' },
  { step: '3', title: 'Confirme', desc: 'Preencha nome e WhatsApp. Pronto — horário reservado.' },
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
    <div className="min-h-screen pb-20 sm:pb-0">
      <Navbar />

      <section className="marble-bg relative overflow-hidden min-h-[85vh] flex items-center">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url(${LOGO_URL})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
          }}
        />
        <div className="absolute top-20 right-0 w-80 h-80 bg-rose-gold/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-gold/5 rounded-full blur-[80px]" />

        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24 md:py-28 flex flex-col items-center text-center relative z-10 w-full">
          <motion.img
            src={LOGO_URL}
            alt="Nathalia Andrade - Salão de Beleza"
            className="w-[min(92vw,22rem)] sm:w-96 md:w-[28rem] h-auto mb-10"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.p
            className="font-serif text-2xl sm:text-3xl md:text-4xl text-warm-gray italic leading-relaxed max-w-xl mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Realçando sua beleza natural com excelência.
          </motion.p>

          <motion.p
            className="text-sm text-warm-gray-light mb-12 max-w-md leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Especialista em tratamentos capilares e estética.
            Atendimento personalizado em um ambiente acolhedor.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto max-w-sm sm:max-w-none"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link to="/agenda" className="btn-luxury px-9 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-center">
              Agendar agora
            </Link>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold px-9 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] text-center"
            >
              Falar no WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      <div className="gold-separator" />

      <section className="py-16 sm:py-20 bg-white/60">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <ScrollReveal className="text-center mb-12">
            <p className="text-[10px] font-semibold text-rose-gold uppercase tracking-[0.35em] mb-3">Como funciona</p>
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal tracking-wide">Agende em 3 passos</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <ScrollReveal key={s.step} delay={i * 0.08}>
                <div className="text-center md:text-left p-6 rounded-2xl border border-gold/10 bg-marble h-full">
                  <span className="inline-flex w-10 h-10 items-center justify-center rounded-full border border-gold/30 font-serif text-lg text-rose-gold mb-4">
                    {s.step}
                  </span>
                  <h3 className="font-semibold text-charcoal mb-2 tracking-wide">{s.title}</h3>
                  <p className="text-sm text-warm-gray leading-relaxed">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-separator" />

      <section id="servicos" className="py-20 sm:py-28 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <ScrollReveal className="text-center mb-14 sm:mb-20">
            <p className="text-[10px] font-semibold text-rose-gold uppercase tracking-[0.35em] mb-4">Nossos serviços</p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal tracking-wide">
              Tratamentos <span className="text-rose-gold italic">Signature</span>
            </h2>
            <p className="text-xs text-warm-gray-light mt-4 max-w-md mx-auto">
              Valores &quot;a partir de&quot; podem variar conforme comprimento e tipo de cabelo.
            </p>
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
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-serif text-lg font-semibold text-charcoal tracking-wide">{svc.title}</h3>
                    <span className="text-[10px] font-semibold text-warm-gray uppercase tracking-wider shrink-0 pt-1">
                      {svc.duration}
                    </span>
                  </div>
                  <p className="font-serif text-xl text-rose-gold-dark mb-3 tracking-wide">{svc.price}</p>
                  <p className="text-sm text-warm-gray leading-relaxed flex-1">{svc.desc}</p>
                  <Link
                    to={`/agenda?s=${encodeURIComponent(svc.title)}`}
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

      <section id="sobre" className="bg-white py-20 sm:py-28 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal>
              <div className="marble-dark rounded-[2rem] p-10 sm:p-14 text-white relative overflow-hidden border border-gold/10">
                <p className="text-[10px] font-semibold text-rose-gold uppercase tracking-[0.35em] mb-5">Sobre o salão</p>
                <h2 className="font-serif text-2xl sm:text-3xl mb-7 leading-tight tracking-wide">
                  Um espaço pensado para <span className="text-rose-gold italic">você</span>
                </h2>
                <p className="text-sm text-warm-gray-light leading-relaxed mb-5">
                  O Salão Nathalia Andrade nasceu da paixão por realçar a beleza única de cada mulher.
                  Tratamentos capilares e estéticos com produtos de alta qualidade.
                </p>
                <p className="text-sm text-warm-gray-light leading-relaxed">
                  Cada atendimento é personalizado — você merece um cuidado especial.
                </p>
              </div>
            </ScrollReveal>
            <div className="space-y-8">
              {FEATURES.map((f, i) => (
                <ScrollReveal key={f.num} delay={i * 0.12}>
                  <div className="flex gap-6 items-start">
                    <span className="font-serif text-3xl font-semibold text-gold/30 shrink-0 leading-none mt-1">{f.num}</span>
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

      <Gallery />
      <div className="gold-separator" />
      <Testimonials />
      <div className="gold-separator" />

      <section id="localizacao" className="py-20 sm:py-28 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScrollReveal>
              <div className="card-luxury rounded-2xl p-8 sm:p-10 h-full">
                <p className="text-[10px] font-semibold text-rose-gold uppercase tracking-[0.35em] mb-5">Horário</p>
                <div className="space-y-3.5">
                  {[
                    ['Segunda-feira', 'Fechado', true],
                    ['Terça a Sexta', '9h às 19h', false],
                    ['Sábado', '9h às 19h', false],
                    ['Domingo', 'Fechado', true],
                  ].map(([day, time, closed]) => (
                    <div key={day} className="flex justify-between text-sm border-b border-gold/8 pb-3">
                      <span className="text-warm-gray">{day}</span>
                      <span className={`font-medium ${closed ? 'text-warm-gray-light' : 'text-charcoal'}`}>{time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="card-luxury rounded-2xl p-8 sm:p-10 h-full flex flex-col">
                <p className="text-[10px] font-semibold text-rose-gold uppercase tracking-[0.35em] mb-5">Localização</p>
                <h3 className="font-serif text-lg font-semibold text-charcoal mb-2 tracking-wide">Ateliê de Beleza</h3>
                <p className="text-sm text-warm-gray leading-relaxed mb-6 flex-1">{ADDRESS}</p>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-gold inline-flex px-6 py-3 rounded-full text-xs font-bold uppercase tracking-[0.15em] self-start"
                >
                  Abrir no Google Maps
                </a>
              </div>
            </ScrollReveal>
          </div>
          <LocationMap />
        </div>
      </section>

      <section className="marble-dark py-20 sm:py-24 border-t border-gold/10">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <ScrollReveal>
            <h2 className="font-serif text-3xl sm:text-4xl text-white mb-5 tracking-wide">Pronta para se cuidar?</h2>
            <p className="text-sm text-warm-gray-light mb-10 max-w-md mx-auto leading-relaxed">
              Escolha a data e horário que preferir. Agendamento rápido, sem complicação.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/agenda"
                className="bg-white hover:bg-marble-warm text-charcoal px-9 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Agendar agora
              </Link>
              <a
                href={waLink('Olá! Gostaria de agendar um horário.')}
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

      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/90 backdrop-blur-xl border-t border-gold/15 safe-bottom">
        <Link to="/agenda" className="btn-luxury block w-full text-center py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.18em]">
          Agendar horário
        </Link>
      </div>
    </div>
  )
}
