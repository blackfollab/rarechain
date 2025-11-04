'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const CallToAction = () => {
  return (
    <section className="w-full bg-gradient-to-br from-[#fff0f7] via-white to-[#e5d4fa] py-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
        {/* Left Text */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-3xl lg:text-4xl font-medium text-black mb-2">
            Uncompromised
          </h2>
          <h1 className="text-[60px] lg:text-[100px] font-semibold text-black leading-none">
            SECURITY
          </h1>
          <p className="text-sm text-gray-700 mt-2">
            By Rarechain
          </p>
        </div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="flex-1 flex justify-center"
        >
          <Image
            src="/assets/bnb-icon.png"
            alt="Security Visual"
            width={500}
            height={500}
            className="max-w-[500px] w-full h-auto object-contain"
          />
        </motion.div>
      </div>
    </section>
  )
}

export default CallToAction
