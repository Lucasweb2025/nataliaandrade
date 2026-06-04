import PageShell from '../components/PageShell'
import ScrollReveal from '../components/ScrollReveal'
import { LOGO_URL, waLink } from '../lib/constants'

const FEATURES = [
  { num: '01', title: 'Atendimento personalizado', desc: 'Cada cliente recebe uma consultoria para encontrar o melhor tratamento.' },
  { num: '02', title: 'Produtos premium', desc: 'Trabalhamos apenas com marcas profissionais de primeira linha.' },
  { num: '03', title: 'Agendamento online', desc: 'Escolha data e horário sem precisar ligar. Rápido e prático.' },
]

const VALUES = [
  { title: 'Excelência', desc: 'Técnica atualizada e cuidado em cada detalhe do atendimento.' },
  { title: 'Acolhimento', desc: 'Um ambiente tranquilo para você relaxar e sair renovada.' },
  { title: 'Resultado', desc: 'Tratamentos pensados para a saúde e a beleza dos seus fios.' },
]

export default function Sobre() {
  return (
    <PageShell
      eyebrow="Sobre o salão"
      title={
        <>
          Um espaço pensado para <span className="text-rose-gold italic">você</span>
        </>
      }
      subtitle="O Salão Nathalia Andrade nasceu da paixão por realçar a beleza única de cada mulher."
    >
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-16 sm:mb-20">
            <ScrollReveal>
              <div className="marble-dark rounded-[2rem] p-10 sm:p-14 text-white relative overflow-hidden border border-gold/10">
                <img
                  src={LOGO_URL}
                  alt=""
                  aria-hidden
                  className="absolute right-4 bottom-4 w-32 opacity-[0.06] pointer-events-none"
                />
                <h2 className="font-serif text-2xl sm:text-3xl mb-6 leading-tight tracking-wide relative z-10">
                  Nathalia Andrade
                </h2>
                <p className="text-sm text-warm-gray-light leading-relaxed mb-5 relative z-10">
                  Especialista em tratamentos capilares e estética em Parque Arariba.
                  Cada atendimento é personalizado, com produtos de alta qualidade e foco no que
                  funciona para o seu tipo de cabelo.
                </p>
                <p className="text-sm text-warm-gray-light leading-relaxed relative z-10">
                  Você merece um cuidado especial — da consulta ao resultado final.
                </p>
              </div>
            </ScrollReveal>
            <div className="space-y-8">
              {FEATURES.map((f, i) => (
                <ScrollReveal key={f.num} delay={i * 0.1}>
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

          <ScrollReveal className="text-center mb-10">
            <p className="text-[10px] font-semibold text-rose-gold uppercase tracking-[0.35em] mb-3">Nossa essência</p>
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal tracking-wide">O que nos move</h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {VALUES.map((v, i) => (
              <ScrollReveal key={v.title} delay={i * 0.08}>
                <div className="card-luxury rounded-2xl p-8 h-full text-center md:text-left">
                  <h3 className="font-serif text-lg text-charcoal mb-3 tracking-wide">{v.title}</h3>
                  <p className="text-sm text-warm-gray leading-relaxed">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal className="mt-14 text-center">
            <a
              href={waLink('Olá! Gostaria de conhecer melhor o salão.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold inline-flex px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.18em]"
            >
              Conversar no WhatsApp
            </a>
          </ScrollReveal>
        </div>
      </section>
    </PageShell>
  )
}
