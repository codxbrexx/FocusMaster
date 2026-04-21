import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import { TestimonialCard } from './TestimonialCard';
import type { TestimonialProps } from './TestimonialCard';

const testimonials: TestimonialProps[] = [
  {
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
    name: 'Alex Chen',
    role: 'Computer Science Student',
    company: 'Stanford University',
    quote:
      'FocusMaster helped me ace my exams. The Pomodoro timer + analytics made studying incredibly efficient.',
    rating: 5,
  },
  {
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
    name: 'Priya Sharma',
    role: 'Freelance Developer',
    company: 'Remote Worldwide',
    quote:
      'Finally, a tool that tracks my billable hours accurately. The time tracking is seamless and reliable.',
    rating: 5,
  },
  {
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop',
    name: 'Marcus Rodriguez',
    role: 'UX Designer',
    company: 'Creative Studio',
    quote:
      'The combination of task management and focus timer eliminated my context switching completely.',
    rating: 4,
  },
  {
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop',
    name: 'Sophie Müller',
    role: 'Product Manager',
    company: 'Tech Startup',
    quote:
      'My productivity increased by 40% using FocusMaster. It\'s like having a personal coaching system.',
    rating: 5,
  },
  {
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
    name: 'James Wilson',
    role: 'Team Lead',
    company: 'Enterprise Firm',
    quote:
      'The analytics dashboard gives insights I never had before about team productivity patterns.',
    rating: 4,
  },
];

export const TestimonialsSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (emblaApi) {
        emblaApi.scrollNext();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [emblaApi]);

  useEffect(() => {
    const onSelect = () => {
      setSelectedIndex(emblaApi?.selectedScrollSnap() ?? 0);
    };

    if (emblaApi) {
      emblaApi.on('select', onSelect);
      onSelect();
    }

    return () => {
      if (emblaApi) {
        emblaApi.off('select', onSelect);
      }
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <section className="relative w-full bg-[#020202] py-20 md:py-32 lg:py-40 px-4 md:px-8 lg:px-20">
      {/* Section Header */}
      <motion.div
        className="mx-auto max-w-6xl mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
          Loved by Professionals
        </h2>
        <p className="text-white/60 text-lg md:text-xl max-w-2xl">
          Discover how FocusMaster is transforming the way people work and
          achieve their goals.
        </p>
      </motion.div>

      {/* Carousel Container */}
      <div className="mx-auto max-w-6xl">
        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="embla__slide min-w-0 basis-full md:basis-1/2 lg:basis-1/3 flex shrink-0"
              >
                <TestimonialCard {...testimonial} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 md:mt-12">
          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === selectedIndex
                    ? 'bg-purple-600 w-8'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* Arrow Buttons */}
          <div className="flex gap-3">
            <motion.button
              onClick={scrollPrev}
              className="p-3 rounded-full border border-white/20 hover:border-white/40 text-white transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={scrollNext}
              className="p-3 rounded-full border border-white/20 hover:border-white/40 text-white transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -z-10 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10" />
    </section>
  );
};
