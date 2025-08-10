import { StarIcon as SolidStar } from "@heroicons/react/24/solid";
import { StarIcon as OutlineStar } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

const QuarterStar = () => (
  <div className="relative w-5 h-5">
    <OutlineStar className="text-gray-400 absolute" />
    <SolidStar className="text-yellow-500 absolute" style={{ clipPath: "polygon(0 0, 25% 0, 25% 100%, 0% 100%)" }} />
  </div>
);

const HalfStar = () => (
  <div className="relative w-5 h-5">
    <OutlineStar className="text-gray-400 absolute" />
    <SolidStar className="text-yellow-500 absolute" style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0% 100%)" }} />
  </div>
);

const ThreeQuarterStar = () => (
  <div className="relative w-5 h-5">
    <OutlineStar className="text-gray-400 absolute" />
    <SolidStar className="text-yellow-500 absolute" style={{ clipPath: "polygon(0 0, 75% 0, 75% 100%, 0% 100%)" }} />
  </div>
);

const StarRating = ({ rating = 0 }) => {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        const fraction = rating - index;

        if (fraction >= 1) return <SolidStar key={index} className="h-5 w-5 text-yellow-500" />;
        if (fraction >= 0.75) return <ThreeQuarterStar key={index} />;
        if (fraction >= 0.25) return <HalfStar key={index} />;
        if (fraction > 0) return <QuarterStar key={index} />;
        
        return <OutlineStar key={index} className="h-5 w-5 text-gray-400" />;
      })}
    </div>
  );
};
export default StarRating;

