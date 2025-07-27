import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { label: 'HOME', path: '/' },
  { label: 'WHO WE ARE', path: '/who-we-are' },
  { label: 'OUR TEAM', path: '/our-team' },
  { label: 'SERVICES', path: '/services' },
  { label: 'CONTACT US', path: '/contact' },
  { label: 'LOGIN', path: '/login' },
  { label: 'SIGN UP', path: '/signup' },
];

const mainLinks = links;

function useScrolled(threshold = 10) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return scrolled;
}

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled(10);
  const toggle = () => setOpen(o => !o);
  const close = () => setOpen(false);

  return (
    <nav
      className="fixed top-0 inset-x-0 flex items-center justify-between p-6 z-20 bg-[#1A2A44]"
    >
      <div className="bg-white flex items-center justify-center">
        <img src="/assets/ATB-Logo.jpg" alt="ATB logo" className="w-40" />
      </div>
      <ul className="hidden md:flex gap-6">
        {mainLinks.map(link => (
          <li key={link.label}>
            <NavLink
              to={link.path}
              className={({ isActive }) =>
                `uppercase text-base tracking-wide hover:underline ${
                  isActive ? 'text-gray-300' : 'text-white'
                } ${isActive ? 'font-semibold' : ''}`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
        <li>
          <a
            href="https://pay.allianceassociationbank.com/home?cmcid=A2DD937B"
          className="ml-6 px-4 py-2 bg-[#FFC857] text-[#1A2A44] font-semibold rounded-lg hover:bg-[#e6b64b]"
          >
            Make Payment
          </a>
        </li>
      </ul>
      <button
        className="md:hidden text-white" onClick={toggle} aria-label="Menu"
      >
        ☰
      </button>
      {open && (
        <div className="absolute top-full inset-x-0 bg-[#1A2A44] shadow flex flex-col items-center gap-2 py-2 md:hidden">
          {links.map(link => (
            <NavLink
              key={link.label}
              to={link.path}
              onClick={close}
              className={({ isActive }) =>
                `uppercase text-base tracking-wide hover:underline ${isActive ? 'text-gray-300' : 'text-white'} ${isActive ? 'font-semibold' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <a
            href="https://pay.allianceassociationbank.com/home?cmcid=A2DD937B"
            className="mt-2 px-4 py-2 bg-[#FFC857] text-[#1A2A44] font-semibold rounded-lg hover:bg-[#e6b64b]"
            onClick={close}
          >
            Make Payment
          </a>
        </div>
      )}
    </nav>
  );
}
