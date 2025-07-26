// src/pages/LandingPage.jsx
import heroBackground from '/assets/LD_BG3.jpg';
import atbLogoSecondary from '/assets/ATBlogo.jpg';
import PWL1 from '/assets/PWL1.jpeg';
import SWP2 from '/assets/SWP2.jpeg';
import P1 from '/assets/P1.jpg';
import H1 from '/assets/H1.jpg';
import AvailableProperties from '../components/AvailableProperties.jsx';

export default function LandingPage() {
  const properties = [
    { name: 'Parkway Lane Condominiums', imgSrc: PWL1 },
    { name: 'Bent Trail Condominiums', imgSrc: SWP2 },
    { name: 'Property 3', imgSrc: P1 },
    { name: 'Property 4', imgSrc: H1 },
  ];


  return (
    <div className="min-h-screen flex flex-col">
      <header
        className="relative bg-cover bg-center w-full h-[75vh]"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />
        <div className="relative z-10 flex flex-col items-center justify-start text-center w-full pt-40">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white">
            Welcome to ATB Community Management
          </h1>
          <img
            src={atbLogoSecondary}
            alt="ATB secondary logo"
            className="h-36 w-auto mt-12 mb-8"
          />
          <p className="font-sans text-lg md:text-xl text-white mt-8">
            Your one-stop HOA &amp; property management solution.
          </p>
        </div>
      </header>

      <div className="mt-6">
        <AvailableProperties data={properties} />
      </div>



      {/* Footer (optional) */}
      <footer className="bg-gray-800 text-white py-4 text-center">
        &copy; {new Date().getFullYear()} ATB
      </footer>
    </div>
  );
}
