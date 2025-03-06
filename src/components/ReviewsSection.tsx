import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

interface Review {
  staff_id: string;
  customer_id: string;
  type: "rating" | "testimonial";
  stars: number;
  text: string | null;
}

const ReviewsSection = () => {
  const { user, userData } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [noOfReviews, setNoOfReviews] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      const db = getFirestore();
      const reviewsRef = collection(db, "reviews");
      const q = query(reviewsRef, where("staff_id", "==", user?.uid));
      const querySnapshot = await getDocs(q);
      const reviewsData: Review[] = [];
      querySnapshot.forEach((doc) => {
        reviewsData.push(doc.data() as Review);
      });
      setReviews(reviewsData);
      setNoOfReviews(reviewsData.length);

      // Calculate average rating
      const totalStars = reviewsData.reduce(
        (acc, review) => acc + review.stars,
        0
      );
      const average = totalStars / reviewsData.length;
      setAverageRating(average);
    };

    if (user?.uid) {
      fetchReviews();
    }
  }, [user?.uid, userData]);

  return averageRating !== null && !isNaN(averageRating) ? (
    <div className="reviews-section p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex justify-between items-center">
        Reviews
        <span className="ml-4 text-blue-500 flex items-center">
          {averageRating.toFixed(1)}/5 <Star className="w-5 h-5 ml-1" />
        </span>
        <span className="ml-4 text-sm text-gray-900 flex items-center">
          ({noOfReviews} reviews)
        </span>
      </h2>
      <div className="testimonials space-y-4">
        {reviews
          .filter((review) => review.type === "testimonial")
          .map((review) => (
            <div
              key={review.customer_id}
              className="testimonial p-4 bg-gray-50 rounded-lg shadow-sm"
            >
              <div className="text text-gray-700 mb-2">{review.text}</div>
              <div className="stars text-blue-500 font-semibold flex items-center">
                Rating: {review.stars}/5
                <Star className="w-4 h-4 ml-1" />
              </div>
              <div className="customer-id text-gray-500 text-sm">
                Customer ID: {review.customer_id}
              </div>
            </div>
          ))}
      </div>
    </div>
  ) : null;
};

export default ReviewsSection;
