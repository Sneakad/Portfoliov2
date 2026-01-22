'use client';

interface PlaceholderImageProps {
  title: string;
  color: string;
}

const PlaceholderImage = ({ title, color }: PlaceholderImageProps) => {
  return (
    <div 
      className="w-full h-full flex items-center justify-center"
      style={{ backgroundColor: color }}
    >
      <div className="text-center text-white">
        <div className="text-4xl mb-2">📸</div>
        <p className="text-sm opacity-80">{title}</p>
      </div>
    </div>
  );
};

export default PlaceholderImage;
