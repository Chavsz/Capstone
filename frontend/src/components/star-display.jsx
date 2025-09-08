// Star display tutor component
const StarDisplay = ({ value }) => {
  const rounded = Math.round(value * 10) / 10;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-xl ${
            star <= Math.round(rounded) ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </span>
      ))}
      <span className="ml-1 text-base font-semibold text-gray-700">
        {rounded}
      </span>
    </div>
  );
};

export default StarDisplay;