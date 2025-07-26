import PropTypes from 'prop-types';

export default function AvailableProperties({ data = [] }) {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map(({ name, imgSrc }) => (
          <div
            key={name}
            className="bg-[#F8F9FA] rounded-xl shadow-2xl border border-gray-200 overflow-hidden transform transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <img src={imgSrc} alt={name} className="w-full h-56 object-cover" />
            <div className="p-4">
              <h3 className="text-gray-900 font-bold text-lg">{name}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

AvailableProperties.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      imgSrc: PropTypes.string.isRequired,
    })
  ),
};
