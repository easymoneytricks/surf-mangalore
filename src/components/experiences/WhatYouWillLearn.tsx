import { motion } from 'framer-motion'
import Badge from '../Badge'
import Card from '../Card'
import { learningSteps } from '../../data/experiences'

export default function WhatYouWillLearn() {
  return (
    <section className="mx-auto w-full max-w-[var(--container-lg)] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
      <div className="rounded-[2rem] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-8 shadow-[0_24px_80px_rgba(4,19,27,0.18)] sm:p-10 lg:p-12">
        <div className="max-w-[42rem]">
          <Badge tone="accent">What you will learn</Badge>
          <h2 className="mt-4 font-[var(--font-heading)] text-[clamp(1.8rem,3.2vw,2.5rem)] font-[var(--font-semibold)] leading-[1.08] tracking-[var(--letter-tight)] text-[var(--color-text)]">
            A clear learning path that builds comfort before intensity.
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--color-text-secondary)]">
            The journey is intentionally sequenced so new surfers can settle in, understand the environment, and move into the water with a real sense of control.
          </p>
        </div>

        <div className="relative mt-10 grid gap-4">
          <div className="absolute left-6 top-0 hidden h-full w-px bg-[linear-gradient(180deg,rgba(122,214,209,0.5),transparent)] lg:block" />
          {learningSteps.map((step, index) => (
            <motion.div key={step.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.06 }} className="relative">
              <div className="grid gap-4 lg:grid-cols-[4rem_1fr] lg:items-start">
                <div className="flex items-start justify-start lg:justify-center">
                  <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-primary)]/25 bg-[rgba(122,214,209,0.08)] text-sm font-semibold text-[var(--color-primary)] shadow-[0_14px_40px_rgba(4,19,27,0.18)]">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                <Card variant="glass" className="border-white/12 p-6">
                  <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">{step.description}</p>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
