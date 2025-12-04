import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ActivationData {
  id: string;
  verificationCode: string;
  pin: string;
  name: string;
  cardNumber: string;
  dateOfBirth: string;
  cardType: "travel" | "club" | "";
  completedAt: string;
  isLocked: boolean;
}

export default function ReviewStatus() {
  const navigate = useNavigate();
  const [currentCard, setCurrentCard] = useState<ActivationData | null>(null);
  const [allCards, setAllCards] = useState<ActivationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activated = localStorage.getItem("sl-airlines-activated");
    if (!activated) {
      navigate("/");
      return;
    }

    const cardsJson = localStorage.getItem("sl-airlines-cards");
    const cards: ActivationData[] = cardsJson ? JSON.parse(cardsJson) : [];
    const current = JSON.parse(activated);

    setCurrentCard(current);
    setAllCards(cards);
    setLoading(false);
  }, [navigate]);

  const handleToggleLock = (cardId: string) => {
    const updatedCards = allCards.map((card) =>
      card.id === cardId ? { ...card, isLocked: !card.isLocked } : card,
    );
    setAllCards(updatedCards);
    localStorage.setItem("sl-airlines-cards", JSON.stringify(updatedCards));

    // Update current card if it's the one being locked
    if (currentCard?.id === cardId) {
      const updatedCurrent = { ...currentCard, isLocked: !currentCard.isLocked };
      setCurrentCard(updatedCurrent);
      localStorage.setItem(
        "sl-airlines-activated",
        JSON.stringify(updatedCurrent),
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-background flex items-center justify-center">
        <div className="text-center">
          <svg
            className="w-12 h-12 text-primary animate-spin mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-muted-foreground">Loading your card status...</p>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Card information not found</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const completedDate = new Date(currentCard.completedAt);
  const dob = new Date(currentCard.dateOfBirth);
  const cardImage = currentCard.cardType === "travel" ? "🔵" : "⬛";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-background">
      {/* Header with Logo */}
      <div className="border-b border-border/50 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F8d330572a69d41f0b535ef0b58b374e5%2Fd021add0cfe64fe394153b013ec25c99?format=webp&width=40"
              alt="SL Airlines"
              className="h-8 w-8"
            />
            <span className="font-bold text-lg text-primary">SL Airlines</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Success Banner */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-8 mb-8 text-center animate-slide-up">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-900 mb-2">
            Card Activated Successfully!
          </h1>
          <p className="text-green-700">
            Your SL Airlines card is now active and ready to use
          </p>
        </div>

        {/* Multiple Cards Notice */}
        {allCards.length > 1 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
            <p className="text-blue-900 text-sm">
              <strong>You have {allCards.length} active cards.</strong> View all
              cards below.
            </p>
          </div>
        )}

        {/* Card Visual */}
        <div className="mb-8">
          <div
            className={`rounded-2xl p-8 text-white shadow-xl relative overflow-hidden ${
              data.cardType === "travel"
                ? "bg-gradient-to-br from-gray-400 to-gray-500"
                : "bg-gradient-to-br from-sl-club-black to-slate-700"
            }`}
          >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <path
                  d="M100 10 L150 40 L150 100 L100 130 L50 100 L50 40 Z"
                  fill="white"
                  opacity="0.3"
                />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <p className="text-sm opacity-75 mb-2">CARD TYPE</p>
                  <p className="text-2xl font-bold capitalize">
                    {data.cardType} Card
                  </p>
                </div>
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2F8d330572a69d41f0b535ef0b58b374e5%2Fd021add0cfe64fe394153b013ec25c99?format=webp&width=50"
                  alt="SL"
                  className="h-10 w-10 opacity-90"
                />
              </div>

              <div className="mb-8">
                <p className="text-sm opacity-75 mb-2">CARDHOLDER NAME</p>
                <p className="text-2xl font-semibold">{data.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-xs opacity-75 mb-1">CARD NUMBER</p>
                  <p className="text-lg font-mono font-bold tracking-wider">
                    8838 | {currentCard.cardNumber.slice(4, 8)} |{" "}
                    {currentCard.cardNumber.slice(-2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-75 mb-1">VALID FROM</p>
                  <p className="text-xl font-bold">2025</p>
                </div>
              </div>

              <div className="border-t border-white/20 pt-4 flex justify-between items-center">
                <p className="text-xs opacity-75">SL AIRLINES</p>
                <p className="text-xs opacity-75">Premium Member</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Activation Details */}
          <div className="bg-white rounded-xl shadow p-6 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Activation Details
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Activation Date
                </p>
                <p className="font-semibold text-foreground">
                  {completedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Activation Time
                </p>
                <p className="font-semibold text-foreground">
                  {completedDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Card Type</p>
                <p className="font-semibold text-foreground capitalize">
                  {data.cardType} Card
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow p-6 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-6">
              Personal Information
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                <p className="font-semibold text-foreground">{data.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Date of Birth
                </p>
                <p className="font-semibold text-foreground">
                  {dob.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Card Number (Last 2 Digits)
                </p>
                <p className="font-semibold text-foreground font-mono">
                  ••{data.cardNumberLastTwo}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next Section */}
        <div className="bg-primary/5 rounded-xl p-6 mb-8 border border-primary/20">
          <h2 className="text-lg font-bold text-foreground mb-4">
            What's Next?
          </h2>
          <div className="space-y-3 text-sm text-foreground">
            <p className="flex items-start gap-3">
              <span className="text-primary font-bold mt-0.5">1</span>
              <span>
                Access your SL Airlines dashboard to manage your account
              </span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-primary font-bold mt-0.5">2</span>
              <span>Start earning miles on every flight and purchase</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-primary font-bold mt-0.5">3</span>
              <span>
                Redeem your miles for flights, upgrades, and exclusive perks
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-2 gap-4">
          <a
            href="https://slairlines.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button className="w-full bg-primary hover:bg-primary/90 text-white">
              Go to Dashboard
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m4-6l-8 8m0 0l-4-4m4 4l4-4"
                />
              </svg>
            </Button>
          </a>
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="w-full"
          >
            Print Details
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
          </Button>
        </div>

        {/* Important Note */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-semibold mb-2">Confirmation</p>
          <p>We added your card to your dashboard.</p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 mt-12 py-8 text-center text-muted-foreground text-sm">
        <p>&copy; 2025 SL Airlines. All rights reserved.</p>
        <div className="flex justify-center gap-6 mt-4">
          <a
            href="https://sites.google.com/view/sl-airlines/our-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Policies
          </a>
          <a
            href="https://sites.google.com/view/sl-airlines/club-open-page"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Support
          </a>
        </div>
      </div>
    </div>
  );
}
