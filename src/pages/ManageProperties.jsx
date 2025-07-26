import { Link } from 'react-router-dom';
import { useGetPropertiesQuery } from '../services/api/propertyApi.ts';
import PropertyCard from '../components/properties/PropertyCard.js';

export default function ManageProperties() {
  const { data, isLoading, error } = useGetPropertiesQuery();

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Failed to load properties</div>;

  const properties = data?.data || data;

  const renderPropertiesList = () => {
    return properties.map((p) => (
      <Link
        key={p.id}
        to={`/properties/${p.id}`}
        className="block hover:shadow-lg transition-shadow"
      >
        <PropertyCard property={{ ...p, images: p.images || [{ imageUrl: p.thumbnail }] }} />
      </Link>
    ));
  };

  return (
    <div className="p-4 grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))' }}>
      {renderPropertiesList()}
    </div>
  );
}
