import React from 'react';

const members = [
  {
    name: 'Jordan Bailey',
    title: 'President',
    bio: 'With a background in finance and over a decade in HOA management, Jordan brings leadership and strategic vision to ATB Community Management.'
  },
  {
    name: 'Alyssa Lawrence',
    title: 'Vice President',
    bio: 'Alyssa specializes in operations and customer service, ensuring each community receives personal attention and timely support.'
  }
];

const OurTeam = () => (
  <>
    <div className="pt-24 pb-4">
      <h1 className="text-4xl font-bold text-center text-[#0d4f3d]">Our Team</h1>
    </div>
    <div className="px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4 pb-12">
        {members.map(m => (
          <div
            key={m.name}
            className="bg-white rounded-xl shadow-md p-8 text-center text-gray-900"
          >
            <h2 className="font-bold text-lg mb-2">{m.name}</h2>
            <p className="font-semibold mb-2">{m.title}</p>
            <p>{m.bio}</p>
          </div>
        ))}
      </div>
    </div>
  </>
);

export default OurTeam;
