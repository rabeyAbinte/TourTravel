import React, { useState } from 'react';
import { Star, MapPin, Languages, Award, CheckCircle, Mail, X, Check } from 'lucide-react';

export default function TourGuides() {
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [selectedReviewGuide, setSelectedReviewGuide] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleOpenModal = (guide) => {
    setSelectedGuide(guide);
  };

  const handleCloseModal = () => {
    setSelectedGuide(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setToastMessage(`Your request has been sent to ${selectedGuide.name}.`);
    setShowToast(true);
    setSelectedGuide(null);
    setTimeout(() => setShowToast(false), 4000);
  };

  const guides = [
    {
      id: 1,
      name: "Tanvir Ahmed",
      title: "Senior Eco-Tourism & Wildlife Specialist",
      region: "Sundarbans & Khulna Division",
      rating: 4.9,
      reviews: 128,
      experience: "8+ Years Experience",
      languages: ["English", "Bengali", "Hindi"],
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop",
      specialty: "Mangrove Safari & Bengal Tiger Tracking",
      email: "tanvir@example.com"
    },
    {
      id: 2,
      name: "Nusrat Jahan",
      title: "Cultural & Heritage Tour Specialist",
      region: "Sylhet & Srimangal Tea Estates",
      rating: 4.8,
      reviews: 95,
      experience: "6+ Years Experience",
      languages: ["English", "Bengali"],
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
      specialty: "Tea Garden Trekking & Swamp Forest Kayaking",
      email: "nusrat@example.com"
    },
    {
      id: 3,
      name: "Rahat Chowdhury",
      title: "Hill Trekking & Adventure Escort",
      region: "Sajek Valley & Bandarban",
      rating: 4.9,
      reviews: 142,
      experience: "10+ Years Experience",
      languages: ["English", "Bengali", "Chakma"],
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
      specialty: "Nilgiri Peak Expedition & Cloud Valley Camping",
      email: "rahat@example.com"
    },
    {
      id: 4,
      name: "Sharmin Sultana",
      title: "Coastal Explorer & Coral Reef Guide",
      region: "Cox's Bazar & Saint Martin's Island",
      rating: 4.7,
      reviews: 86,
      experience: "5+ Years Experience",
      languages: ["English", "Bengali"],
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
      specialty: "Beach Sunset Cruises & Snorkeling Expeditions",
      email: "sharmin@example.com"
    }
  ];

  return (
    <div className="animate-fade-in" style={{ paddingTop: '110px', paddingBottom: '80px', minHeight: '90vh' }}>
      <div className="container mx-auto px-4">
        
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 50px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(13, 148, 136, 0.1)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>
            <Award size={16} /> Certified Travel Experts
          </div>
          <h1 className="section-title text-4xl font-extrabold mb-4">Meet Our Local <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">Tour Guides</span></h1>
          <p className="text-neutral-600 text-lg leading-relaxed">Connect with government-certified local experts to guide your adventures across Bangladesh with deep cultural insights and safety.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {guides.map((guide) => (
            <div key={guide.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 border border-neutral-100 flex flex-col h-full transition-all duration-300 group">
              
              <div className="h-[260px] relative overflow-hidden shrink-0">
                <img src={guide.image} alt={guide.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                <div 
                  onClick={(e) => { e.stopPropagation(); setSelectedReviewGuide(guide); }}
                  className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg border border-white/20 cursor-pointer hover:scale-105 transition-transform duration-300 hover:bg-slate-800"
                >
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  {guide.rating} ({guide.reviews})
                </div>
              </div>

              <div className="p-6 flex flex-1 flex-col justify-between">
                <div className="flex flex-col">
                  <div className="mb-5">
                    <span className="text-[10px] font-extrabold text-teal-600 uppercase tracking-[0.2em] block mb-2">{guide.experience}</span>
                    <h3 className="text-xl font-extrabold text-neutral-900 mb-1.5 leading-tight truncate">{guide.name}</h3>
                    <p className="text-neutral-600 text-sm font-semibold leading-snug h-[42px] line-clamp-2">{guide.title}</p>
                  </div>

                  <div className="flex flex-col gap-3 mb-6 text-sm text-neutral-700">
                    <div className="flex items-start gap-2.5 h-[38px]">
                      <MapPin size={16} className="text-teal-500 shrink-0 mt-0.5" />
                      <span className="font-medium leading-tight line-clamp-2">{guide.region}</span>
                    </div>
                    <div className="flex items-start gap-2.5 h-[20px]">
                      <Languages size={16} className="text-teal-500 shrink-0 mt-0.5" />
                      <span className="font-medium leading-tight truncate">{guide.languages.join(", ")}</span>
                    </div>
                    <div className="flex items-start gap-2.5 h-[38px]">
                      <CheckCircle size={16} className="text-teal-500 shrink-0 mt-0.5" />
                      <span className="font-medium leading-tight line-clamp-2">{guide.specialty}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-5 border-t border-neutral-100 flex items-center justify-between gap-3 shrink-0">
                  <button 
                    onClick={() => handleOpenModal(guide)}
                    className="flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-teal-600 transition-colors group-hover:text-teal-600"
                  >
                    <Mail size={16} /> <span className="underline decoration-teal-200 underline-offset-4 group-hover:decoration-teal-600 transition-colors">{guide.email}</span>
                  </button>
                  <button 
                    onClick={() => handleOpenModal(guide)}
                    className="flex shrink-0 items-center justify-center gap-1.5 px-5 py-2.5 bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white rounded-xl text-sm font-bold transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <Mail size={16} /> <span className="whitespace-nowrap">Assign</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Review Modal Overlay */}
      {selectedReviewGuide && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setSelectedReviewGuide(null)}>
          <div 
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#8B5E34] px-6 py-4 flex items-center justify-between text-white">
              <h2 className="text-lg font-extrabold">Reviews for {selectedReviewGuide.name}</h2>
              <button 
                onClick={() => setSelectedReviewGuide(null)}
                className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Summary Breakdown */}
              <div className="flex items-center gap-6 mb-8 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                <div className="text-center">
                  <div className="text-4xl font-extrabold text-[#8B5E34]">{selectedReviewGuide.rating}</div>
                  <div className="flex items-center justify-center gap-0.5 my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className={i < Math.floor(selectedReviewGuide.rating) ? "fill-[#8B5E34] text-[#8B5E34]" : "text-neutral-300"} />
                    ))}
                  </div>
                  <div className="text-xs font-semibold text-neutral-500">{selectedReviewGuide.reviews} reviews</div>
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 text-xs font-semibold text-neutral-600">
                    <span className="w-8 shrink-0">5 Star</span>
                    <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#8B5E34] w-[90%]"></div>
                    </div>
                    <span className="w-8 text-right">90%</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-neutral-600">
                    <span className="w-8 shrink-0">4 Star</span>
                    <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#8B5E34] w-[10%]"></div>
                    </div>
                    <span className="w-8 text-right">10%</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-neutral-600 opacity-50">
                    <span className="w-8 shrink-0">3 Star</span>
                    <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden"></div>
                    <span className="w-8 text-right">0%</span>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {[
                  { name: "Michael R.", country: "USA 🇺🇸", review: `Absolutely incredible experience! ${selectedReviewGuide.name} was incredibly knowledgeable and made our trip unforgettable. Highly recommended!`, img: "https://i.pravatar.cc/150?u=12" },
                  { name: "Sarah L.", country: "UK 🇬🇧", review: `Very professional and friendly. The deep cultural insights provided were exactly what we were looking for.`, img: "https://i.pravatar.cc/150?u=24" },
                  { name: "Ahmed K.", country: "UAE 🇦🇪", review: `Great tour, felt very safe and well-guided the entire time. Will definitely book again next time I visit!`, img: "https://i.pravatar.cc/150?u=35" }
                ].map((review, idx) => (
                  <div key={idx} className="pb-6 border-b border-neutral-100 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <img src={review.img} alt={review.name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                        <div>
                          <div className="font-bold text-neutral-800 text-sm">{review.name}</div>
                          <div className="text-xs text-neutral-500 font-medium">{review.country}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className="fill-[#8B5E34] text-[#8B5E34]" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 leading-relaxed italic">"{review.review}"</p>
                  </div>
                ))}
              </div>
              
            </div>
          </div>
        </div>
      )}

      {/* Modal Overlay */}
      {selectedGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={handleCloseModal}>
          <div 
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-neutral-900">Send a Request</h2>
              <button 
                onClick={handleCloseModal}
                className="text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-bold text-neutral-800 text-lg">To: {selectedGuide.name}</h3>
                <p className="text-sm text-neutral-500 mt-1">The concierge team will get back to you via email within 24 hours.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#8B5E34] focus:border-[#8B5E34] transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Your Email Address *</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#8B5E34] focus:border-[#8B5E34] transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Travel Dates (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Oct 15 - Oct 20"
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#8B5E34] focus:border-[#8B5E34] transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Message / Special Requirements</label>
                  <textarea 
                    rows="3"
                    placeholder="Tell us about your trip..."
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#8B5E34] focus:border-[#8B5E34] transition-all text-sm resize-none"
                  ></textarea>
                </div>
                
                {/* Modal Footer */}
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={handleCloseModal}
                    className="flex-1 px-5 py-2.5 border border-neutral-200 text-neutral-700 hover:bg-neutral-50 rounded-xl text-sm font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-5 py-2.5 bg-[#8B5E34] text-white hover:bg-[#724C2A] rounded-xl text-sm font-bold transition-colors shadow-sm hover:shadow"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-4 z-[110] bg-white border border-teal-100 shadow-2xl rounded-xl p-4 flex items-start gap-3 animate-fade-in max-w-sm">
          <div className="bg-teal-50 text-teal-600 rounded-full p-1.5 mt-0.5 shrink-0">
            <Check size={16} />
          </div>
          <div>
            <h4 className="font-bold text-teal-800 text-sm mb-0.5">Success!</h4>
            <p className="text-sm text-neutral-600">{toastMessage}</p>
          </div>
          <button onClick={() => setShowToast(false)} className="text-neutral-400 hover:text-neutral-600 ml-auto shrink-0">
            <X size={16} />
          </button>
        </div>
      )}

    </div>
  );
}
