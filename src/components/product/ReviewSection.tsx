"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";
import { Review } from "@/lib/types";
import { Star, ThumbsUp, Edit, Trash2 } from "lucide-react";

interface ReviewSectionProps {
  productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const { user, profile } = useAuth();
  const { showToast } = useToast();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  async function fetchReviews() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(`
          *,
          profiles (full_name)
        `)
        .eq("product_id", productId)
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data as any || []);
    } catch (err: any) {
      console.error("Error fetching reviews:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const userReview = user ? reviews.find(r => r.user_id === user.id) : null;

  // Star breakdown calculation
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : "0.0";
    
  const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) {
      starCounts[r.rating as keyof typeof starCounts]++;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast({ type: "warning", title: "Authentication required", message: "Please log in to submit a review." });
      return;
    }
    if (rating === 0) {
      showToast({ type: "warning", title: "Rating required", message: "Please select a star rating." });
      return;
    }
    if (body.trim().length === 0) {
      showToast({ type: "warning", title: "Review text required", message: "Please write a review." });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingReviewId) {
        // Edit existing review
        const { error } = await supabase
          .from("reviews")
          .update({ rating, title, body })
          .eq("id", editingReviewId)
          .eq("user_id", user.id);

        if (error) throw error;
        showToast({ type: "success", title: "Review updated successfully" });
      } else {
        // Create new review
        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: productId,
            user_id: user.id,
            rating,
            title,
            review_body: body,
          })
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to submit review");
        }
        showToast({ type: "success", title: "Review submitted successfully" });
      }

      setShowModal(false);
      resetForm();
      fetchReviews();
    } catch (err: any) {
      console.error(err);
      showToast({ type: "error", title: "Failed to submit", message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId)
        .eq("user_id", user.id);

      if (error) throw error;
      showToast({ type: "success", title: "Review deleted" });
      fetchReviews();
    } catch (err: any) {
      showToast({ type: "error", title: "Failed to delete review", message: err.message });
    }
  };

  const handleHelpful = async (reviewId: string) => {
    if (!user) {
      showToast({ type: "warning", title: "Please log in to vote" });
      return;
    }
    try {
      const { error } = await supabase
        .from("review_votes")
        .insert({ review_id: reviewId, user_id: user.id });
      
      if (error) {
        if (error.code === '23505') {
          showToast({ type: "warning", title: "You already marked this helpful" });
        } else {
          throw error;
        }
      } else {
        // Optimistically update
        setReviews(reviews.map(r => r.id === reviewId ? { ...r, helpful_count: r.helpful_count + 1 } : r));
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const openEditModal = (review: Review) => {
    setRating(review.rating);
    setTitle(review.title || "");
    setBody(review.body);
    setEditingReviewId(review.id);
    setShowModal(true);
  };

  const resetForm = () => {
    setRating(0);
    setTitle("");
    setBody("");
    setEditingReviewId(null);
  };

  return (
    <div id="reviews-section" className="w-full mt-10 lg:mt-16 bg-[#ECEAEF] rounded-[24px] md:rounded-[36px] p-6 md:p-10 border border-[#ADACB5]/60 shadow-card">
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Left: Summary */}
        <div className="lg:w-1/3 flex flex-col items-start shrink-0">
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-[#2D3142] uppercase mb-6">
            Customer Reviews
          </h2>
          
          {isLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#2D3142] border-t-transparent"></div>
          ) : totalReviews > 0 ? (
            <>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-4xl md:text-5xl font-black tracking-tight text-[#2D3142]">
                  {averageRating}
                </div>
                <div className="flex flex-col">
                  <div className="flex text-[#2D3142]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-4 h-4 ${star <= Math.round(Number(averageRating)) ? "fill-[#2D3142]" : "text-[#ADACB5]"}`} />
                    ))}
                  </div>
                  <span className="text-[10px] font-black tracking-widest text-[#2D3142]/70 uppercase mt-0.5">
                    {totalReviews} {totalReviews === 1 ? 'Review' : 'Reviews'}
                  </span>
                </div>
              </div>

              <div className="w-full space-y-2 mt-6">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2 text-[10px] font-black tracking-widest text-[#2D3142] uppercase">
                    <span className="w-6 shrink-0">{star} ★</span>
                    <div className="flex-1 h-2 bg-[#D8D5DB] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#2D3142] rounded-full" 
                        style={{ width: `${totalReviews > 0 ? (starCounts[star as keyof typeof starCounts] / totalReviews) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="w-6 text-right shrink-0">{starCounts[star as keyof typeof starCounts]}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-[11px] md:text-xs text-[#2D3142]/70 font-semibold tracking-wider uppercase mb-6">
              No reviews yet. Be the first to share your thoughts.
            </p>
          )}

          <div className="mt-8 w-full">
            {userReview ? (
              <div className="flex flex-col gap-2 w-full">
                <button
                  onClick={() => openEditModal(userReview)}
                  className="bg-[#2D3142] text-[#D8D5DB] w-full min-h-[48px] rounded-full text-xs font-black tracking-[0.2em] uppercase hover:bg-[#3D4258] transition-all shadow-sm active:scale-95"
                >
                  EDIT YOUR REVIEW
                </button>
                <button
                  onClick={() => handleDelete(userReview.id)}
                  className="bg-transparent text-[#2D3142] border border-[#2D3142]/20 w-full min-h-[48px] rounded-full text-xs font-black tracking-[0.2em] uppercase hover:bg-[#2D3142]/5 transition-all shadow-sm active:scale-95"
                >
                  DELETE REVIEW
                </button>
              </div>
            ) : (
              <button
                onClick={() => { resetForm(); setShowModal(true); }}
                className="bg-[#2D3142] text-[#D8D5DB] w-full min-h-[48px] rounded-full text-xs font-black tracking-[0.2em] uppercase hover:bg-[#3D4258] transition-all shadow-sm active:scale-95"
              >
                WRITE A REVIEW
              </button>
            )}
          </div>
        </div>

        {/* Right: Reviews List */}
        <div className="lg:w-2/3 flex flex-col gap-4">
          {!isLoading && reviews.length > 0 && reviews.map((review) => (
            <div key={review.id} className="bg-[#D8D5DB] rounded-[20px] p-5 md:p-6 shadow-sm border border-[#ADACB5]/40 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center text-[#2D3142] gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? "fill-[#2D3142]" : "text-[#ADACB5]"}`} />
                  ))}
                </div>
                <span className="text-[9px] font-black tracking-[0.1em] text-[#2D3142]/60 uppercase">
                  {new Date(review.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
              
              {review.title && (
                <h3 className="text-sm font-black tracking-tight text-[#2D3142] uppercase mb-1">
                  {review.title}
                </h3>
              )}
              
              <p className="text-[11px] md:text-xs text-[#2D3142]/85 leading-relaxed font-semibold mb-4 whitespace-pre-wrap">
                {review.body}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#ADACB5]/30">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black tracking-widest text-[#2D3142] uppercase">
                    {review.profiles?.full_name || "Customer"}
                  </span>
                  {review.is_verified_purchase && (
                    <span className="bg-[#2D3142] text-[#D8D5DB] text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  )}
                </div>
                
                <button
                  onClick={() => handleHelpful(review.id)}
                  className="flex items-center gap-1.5 text-[9px] font-black tracking-widest uppercase text-[#2D3142]/70 hover:text-[#2D3142] transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({review.helpful_count})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D3142]/60 backdrop-blur-sm">
          <div className="bg-[#ECEAEF] w-full max-w-lg rounded-[24px] md:rounded-[36px] p-6 md:p-8 shadow-card border border-[#ADACB5]/60 overflow-hidden flex flex-col max-h-[90vh]">
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-[#2D3142] uppercase mb-6">
              {editingReviewId ? "Edit Review" : "Write a Review"}
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 overflow-y-auto no-scrollbar pb-2">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black tracking-widest text-[#2D3142]/70 uppercase">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-none hover:scale-110 transition-transform"
                    >
                      <Star className={`w-8 h-8 ${star <= rating ? "fill-[#2D3142] text-[#2D3142]" : "text-[#ADACB5]"}`} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black tracking-widest text-[#2D3142]/70 uppercase">Title (Optional)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your experience"
                  className="w-full bg-[#D8D5DB] border border-[#ADACB5]/60 rounded-full px-5 py-3.5 text-xs font-semibold focus:outline-none focus:border-[#2D3142] transition-colors text-[#2D3142] shadow-inner"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black tracking-widest text-[#2D3142]/70 uppercase">Review</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="How does it fit? How is the quality?"
                  required
                  rows={4}
                  className="w-full bg-[#D8D5DB] border border-[#ADACB5]/60 rounded-[16px] px-5 py-3.5 text-xs font-semibold focus:outline-none focus:border-[#2D3142] transition-colors text-[#2D3142] shadow-inner resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 bg-transparent text-[#2D3142] border border-[#2D3142]/20 min-h-[48px] rounded-full text-xs font-black tracking-[0.2em] uppercase hover:bg-[#2D3142]/5 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#2D3142] text-[#D8D5DB] min-h-[48px] rounded-full text-xs font-black tracking-[0.2em] uppercase hover:bg-[#3D4258] transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="w-4 h-4 border-2 border-[#D8D5DB] border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    editingReviewId ? "Update" : "Submit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
