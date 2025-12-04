import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

const VERIFICATION_CODE_SUFFIX = "SLCASN";
const CORRECT_PIN = "4459";
const CARD_PREFIX = "8838";

export default function CardActivation() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cardAttempts, setCardAttempts] = useState(0);
  const [data, setData] = useState<ActivationData>({
    id: "",
    verificationCode: "",
    pin: "",
    name: "",
    cardNumber: "",
    dateOfBirth: "",
    cardType: "",
    completedAt: "",
    isLocked: false,
  });

  const steps = [
    {
      number: 1,
      title: "Verification Code",
      description: "From your card package",
    },
    { number: 2, title: "PIN", description: "From your email" },
    { number: 3, title: "Personal Info", description: "Your name" },
    { number: 4, title: "Card Details", description: "Your card number" },
    { number: 5, title: "Date of Birth", description: "Verify your age (16+)" },
    {
      number: 6,
      title: "Confirmation",
      description: "Review your information",
    },
  ];

  const validateVerificationCode = (code: string): boolean => {
    const cleaned = code.replace(/\s/g, "").toUpperCase();
    const pattern = /^\d{6}SLCASN$/;
    return pattern.test(cleaned);
  };

  const validatePin = (pin: string): boolean => {
    return pin === CORRECT_PIN;
  };

  const validateName = (name: string): boolean => {
    return name.trim().length > 0;
  };

  const validateAndProcessCardNumber = (
    cardNum: string,
  ): { valid: boolean; cardType?: "travel" | "club" } => {
    const cleaned = cardNum.replace(/\s/g, "");

    // Must be 10 digits
    if (!/^\d{10}$/.test(cleaned)) {
      return { valid: false };
    }

    // Must start with 8838
    if (!cleaned.startsWith(CARD_PREFIX)) {
      return { valid: false };
    }

    // Last digit must be 7 (travel) or 9 (club)
    const lastDigit = cleaned[9];
    if (lastDigit === "7") {
      return { valid: true, cardType: "travel" };
    } else if (lastDigit === "9") {
      return { valid: true, cardType: "club" };
    }

    return { valid: false };
  };

  const validateDateOfBirth = (dob: string): boolean => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age >= 16;
  };

  const handleNextStep = async () => {
    setError("");
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (step === 0) {
        if (!validateVerificationCode(data.verificationCode)) {
          setError("Invalid verification code. Please check and try again.");
          setLoading(false);
          return;
        }
      } else if (step === 1) {
        if (!validatePin(data.pin)) {
          setError("Invalid PIN. Please check and try again");
          setLoading(false);
          return;
        }
      } else if (step === 2) {
        if (!validateName(data.name)) {
          setError("Please enter your name");
          setLoading(false);
          return;
        }
      } else if (step === 3) {
        const validation = validateAndProcessCardNumber(data.cardNumber);
        if (!validation.valid) {
          const newAttempts = cardAttempts + 1;
          setCardAttempts(newAttempts);

          if (newAttempts >= 2) {
            setError("This information was false. Activation cancelled.");
            setLoading(false);
            setTimeout(() => {
              navigate("/");
            }, 2000);
            return;
          }

          setError("This information was false. You have 1 attempt remaining.");
          setLoading(false);
          return;
        }

        // Auto-set card type based on validation
        setData((prev) => ({
          ...prev,
          cardType: validation.cardType || "",
        }));
      } else if (step === 4) {
        if (!validateDateOfBirth(data.dateOfBirth)) {
          setError("You must be at least 16 years old to activate this card");
          setLoading(false);
          return;
        }
      }

      setStep(step + 1);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousStep = () => {
    if (step > 0) {
      setStep(step - 1);
      setError("");
    }
  };

  const handleCompleteActivation = async () => {
    setError("");
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const activationData: ActivationData = {
        ...data,
        id: Date.now().toString(),
        completedAt: new Date().toISOString(),
        isLocked: false,
      };

      // Get existing cards or initialize empty array
      const existingCardsJson = localStorage.getItem("sl-airlines-cards");
      const existingCards: ActivationData[] = existingCardsJson
        ? JSON.parse(existingCardsJson)
        : [];

      // Add new card to array
      existingCards.push(activationData);

      // Save updated array
      localStorage.setItem("sl-airlines-cards", JSON.stringify(existingCards));

      // Set as current card for review
      localStorage.setItem(
        "sl-airlines-activated",
        JSON.stringify(activationData),
      );

      navigate("/review-status");
    } catch (err) {
      setError("Failed to complete activation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ActivationData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-background">
      {/* Header with Logo */}
      <div className="border-b border-border/50 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F58f2265166be4d0db08ea914234affec%2F41558cec03da4b39b5bb4960324d8449?format=webp&width=64"
              alt="SL Airlines"
              className="h-8 w-8"
            />
            <span className="font-bold text-lg text-primary">SL Airlines</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
        {/* Progress Bar - Minimalist */}
        <div className="mb-8">
          {/* Progress Bar Line */}
          <div className="w-full bg-muted h-1 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Step Indicators - Minimal */}
          <div className="flex justify-between items-center">
            {steps.map((s, idx) => (
              <div key={s.number} className="flex flex-col items-center flex-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                    idx < step
                      ? "bg-green-500 text-white"
                      : idx === step
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {idx < step ? (
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    s.number
                  )}
                </div>
                <p className="text-xs mt-2 text-muted-foreground hidden sm:block">
                  {s.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 animate-slide-up">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {steps[step].title}
          </h2>
          <p className="text-muted-foreground mb-6">
            {steps[step].description}
          </p>

          {/* Step Content */}
          <div className="space-y-6">
            {step === 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="verification-code" className="text-base">
                    Verification Code
                  </Label>
                  <div className="group relative">
                    <button
                      type="button"
                      className="w-5 h-5 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-white flex items-center justify-center text-xs font-bold transition-colors"
                      title="Help"
                    >
                      ?
                    </button>
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded p-2 w-48 z-10">
                      <p className="font-semibold mb-1">
                        Where to find your verification code:
                      </p>
                      <p>
                        Look on the package or insert that came with your
                        physical card.
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  This code is found on your card package or insert
                </p>
                <Input
                  id="verification-code"
                  placeholder="123456SLCASN"
                  value={data.verificationCode}
                  onChange={(e) =>
                    handleInputChange(
                      "verificationCode",
                      e.target.value.toUpperCase(),
                    )
                  }
                  className="text-lg tracking-widest font-mono"
                  disabled={loading}
                />
              </div>
            )}

            {step === 1 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="pin" className="text-base">
                    Security PIN
                  </Label>
                  <div className="group relative">
                    <button
                      type="button"
                      className="w-5 h-5 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-white flex items-center justify-center text-xs font-bold transition-colors"
                      title="Help"
                    >
                      ?
                    </button>
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded p-2 w-48 z-10">
                      <p className="font-semibold mb-1">
                        Where to find your PIN:
                      </p>
                      <p>
                        Check the activation email sent to you when your card
                        was issued.
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  This 4-digit PIN was sent to your email
                </p>
                <Input
                  id="pin"
                  placeholder="••••"
                  type="password"
                  value={data.pin}
                  onChange={(e) => handleInputChange("pin", e.target.value)}
                  className="text-2xl tracking-widest text-center font-mono"
                  maxLength={4}
                  disabled={loading}
                />
              </div>
            )}

            {step === 2 && (
              <div>
                <Label htmlFor="name" className="text-base mb-2 block">
                  Full Name
                </Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Enter your full name as it appears on your card
                </p>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={data.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="text-lg"
                  disabled={loading}
                />
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="card-number" className="text-base">
                    Card Number
                  </Label>
                  <div className="group relative">
                    <button
                      type="button"
                      className="w-5 h-5 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-white flex items-center justify-center text-xs font-bold transition-colors"
                      title="Help"
                    >
                      ?
                    </button>
                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded p-2 w-48 z-10">
                      <p className="font-semibold mb-1">
                        Where to find your card number:
                      </p>
                      <p>
                        The 10-digit number is printed on the front of your
                        physical card.
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Enter your 10-digit card number
                </p>
                <Input
                  id="card-number"
                  placeholder="8838••••••"
                  value={data.cardNumber}
                  onChange={(e) =>
                    handleInputChange(
                      "cardNumber",
                      e.target.value.replace(/\D/g, ""),
                    )
                  }
                  className="text-lg tracking-widest font-mono"
                  maxLength={10}
                  disabled={loading}
                />
                {cardAttempts > 0 && (
                  <p className="text-xs text-amber-600 mt-2">
                    Attempt {cardAttempts} of 2
                  </p>
                )}
              </div>
            )}

            {step === 4 && (
              <div>
                <Label htmlFor="dob" className="text-base mb-2 block">
                  Date of Birth
                </Label>
                <p className="text-sm text-muted-foreground mb-3">
                  You must be at least 16 years old to activate this card
                </p>
                <Input
                  id="dob"
                  type="date"
                  value={data.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  className="text-lg"
                  disabled={loading}
                />
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <h3 className="font-semibold text-foreground mb-4">
                    Please review your information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-semibold text-foreground">
                        {data.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Card Type:</span>
                      <span className="font-semibold text-foreground capitalize">
                        {data.cardType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Card Number:
                      </span>
                      <span className="font-semibold text-foreground font-mono">
                        {data.cardNumber.slice(0, 4)}****
                        {data.cardNumber.slice(-2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Date of Birth:
                      </span>
                      <span className="font-semibold text-foreground">
                        {new Date(data.dateOfBirth).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {loading && (
                  <div className="text-center py-4">
                    <div className="inline-block">
                      <svg
                        className="w-8 h-8 text-primary animate-spin"
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
                    </div>
                    <p className="text-muted-foreground mt-3">
                      Activating your card...
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-destructive text-sm">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousStep}
            disabled={step === 0 || loading}
            className="flex-1"
          >
            Previous
          </Button>

          {step < 5 ? (
            <Button
              onClick={handleNextStep}
              disabled={loading}
              className="flex-1 bg-primary"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 animate-spin"
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
                  Verifying...
                </span>
              ) : (
                "Next"
              )}
            </Button>
          ) : (
            <Button
              onClick={handleCompleteActivation}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 animate-spin"
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
                  Completing...
                </span>
              ) : (
                "Complete Activation"
              )}
            </Button>
          )}
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
