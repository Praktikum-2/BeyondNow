import React from "react";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/ButtonLanding";
import Container from "@/components/ui/ContainerLanding";
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  return (
    <section className='pt-32 pb-20 md:pt-40 md:pb-28'>
      <Container>
        <div className='flex flex-col items-center text-center'>
          <h1 className='text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-gray-900 max-w-4xl mx-auto leading-[1.2]'>
            Smart employee planning by projects
          </h1>
          <p className='mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed'>
            Easily manage availability , assign resources based on skills, and
            gain clear insight into workload with an{" "}
            <span className="text-black font-extrabold text-2xl tracking-wide font-['Geist Mono']">
              intuitive
            </span>{" "}
            and{" "}
            <span className="text-black font-extrabold text-2xl tracking-wide font-['Geist Mono']">
              efficient{" "}
            </span>
            project planning web app.
          </p>
          <div className='mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6'>
            <Link to='/login'>
              <Button variant='primary' size='lg'>
                Get Started
                <ArrowRight size={16} className='ml-2' />
              </Button>
            </Link>
            <Button variant='outline' size='lg'>
              Explore
            </Button>
          </div>

          <div className='mt-16 md:mt-20 relative w-full max-w-5xl mx-auto'>
            <div className='aspect-video bg-gray-100 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01]'>
              <img
                src='/dashboard.png'
                alt='Modern Dashboard Interface'
                className='w-full h-full object-cover'
              />
            </div>
            <div className='absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500 rounded-full z-0 blur-[60px] opacity-30'></div>
            <div className='absolute -top-4 -left-4 w-32 h-32 bg-indigo-500 rounded-full z-0 blur-[80px] opacity-20'></div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
