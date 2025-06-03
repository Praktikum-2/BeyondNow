import React, { useEffect } from "react";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";

const Landing: React.FC = () => {
  useEffect(() => {
    const fetchHello = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL_LOCAL}/api/hello`
        );
        const data = await res.json();
        console.log("Backend says:", data.message); // Should log: Hello from Express.
      } catch (error) {
        console.error("Error fetching from backend:", error);
      }
    };

    fetchHello();
  }, []);

  return (
    <div className='min-h-screen bg-white relative overflow-hidden'>
      {/* DOTS */}
      <div className='absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e0e7ff_1px,transparent_2.5px)] bg-[size:40px_40px] opacity-90 animate-diagonal-move z-0' />

      <div className='relative z-10'>
        <Navbar />
        <Hero />

        {/* Boxes */}
        <div className='relative'>
          <div
            className='absolute inset-0 pointer-events-none bg-[linear-gradient(#c7d2fe_1px,transparent_1px),linear-gradient(90deg,#c7d2fe_1px,transparent_1px)] bg-[size:32px_32px] opacity-20'
            style={{
              maskImage:
                "radial-gradient(ellipse at center, black 20%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, black 40%, transparent 100%)",
            }}
          />
          <Features />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Landing;
