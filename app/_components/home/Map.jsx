"use client";
import React from 'react'
import { motion } from "framer-motion";

export default function Map() {
  return (
    <section className="w-full bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            موقع العيادة
          </h2>
          <p className="text-lg text-gray-600">
            نحن في خدمتكم في موقع متميز وسهل الوصول
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-3xl"></div>
          <div className="relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden">
            <iframe
              title="Clinic Location"
              aria-label="موقع العيادة على الخريطة"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3454.0123456789!2d31.235711315115!3d30.0444199818797!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z2KfZhNmF2K3Yp9mB2YrYqQ!5e0!3m2!1sar!2seg!4v1680000000000!5m2!1sar!2seg"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-96"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}
