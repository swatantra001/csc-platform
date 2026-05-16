"use client";

import React from 'react'
import { motion } from 'framer-motion'



const Testimonials = () => {
  // return (
	// <section id="testimonials" className="relative min-h-screen bg-black text-white flex flex-col items-center justify-between px-6 py-20">
	// 	<motion.h2 className="text-4xl font-bold mb-16"
	// 	initial={{opacity: 0, y: -50}}
	// 	animate={{opacity: 1, y: 0}}
	// 	transition={{duration: 0.6}}
	// 	>
	// 		What People Say
	// 	</motion.h2>

	// 	<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 max-w-6xl w-full'>
	// 		{testimonials.map((testi, idx) => (
	// 			<motion.div key={idx}
	// 			initial={{opacity: 0, y: 50}}
	// 			whileInView={{opacity: 1, y: 0}}
	// 			viewport={{once: true}}
	// 			transition={{duration: 0.6, delay: idx*0.2}}
	// 			className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 flex flex-col items-center transform transition duration-500 hover:scale-105 hover:-rotate-1"
	// 			>
	// 				<img src={testi.image} alt={testi.name} loading='lazy' className='w-20 h-20 rounded-full mb-4 border-2 border-white/40 object-cover'/>
	// 				<p className='text-gray-200 italic mb-4'>{testi.review}</p>
	// 				<h3 className='text-lg font-semibold'>{testi.name}</h3>
	// 				<p className='text-gray-400'>{testi.role}</p>
	// 			</motion.div>
	// 		))}
	// 	</div>
	// </section>
  // )
  return <></>
}

export default Testimonials
