import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ActivationData {
  verificationCode: string;
  pin: string;
  name: string;
  cardNumberLastTwo: string;
  dateOfBirth: string;
  cardType: "travel" | "club" | "";
  completedAt: string;
}

const VERIFICATION_CODE_SUFFIX = "SLCASN";
const CORRECT_PIN = "4459";

export default function CardActivation() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<ActivationData>({
    verificationCode: "",
    pin: "",
    name: "",
    cardNumberLastTwo: "",
    dateOfBirth: "",
    cardType: "",
    completedAt: "",
  });

  // Check if already activated
  useEffect(() => {
    const activated = localStorage.getItem("sl-airlines-activated");
    if (activated) {
      navigate("/already-activated");
    }
  }, [navigate]);

  const steps = [
    { number: 1, title: "Verification Code", description: "Enter your 6-digit code" },
    { number: 2, title: "PIN", description: "Enter your 4-digit PIN" },
    { number: 3, title: "Personal Info", description: "Your name" },
    { number: 4, title: "Card Details", description: "Card number & type" },
    { number: 5, title: "Date of Birth", description: "Verify your age (16+)" },
    { number: 6, title: "Confirmation", description: "Review your information" },
  ];

  const validateVerificationCode = (code: string): boolean => {
    const cleaned = code.replace(/\s/g, "").toUpperCase();
    return cleaned.length === 6 && cleaned.endsWith(VERIFICATION_CODE_SUFFIX);
  };

  const validatePin = (pin: string): boolean => {
    return pin === CORRECT_PIN;
  };

  const validateName = (name: string): boolean => {
    return name.trim().length > 0;
  };

  const validateCardNumber = (cardNum: string): boolean => {
    return /^\d{2}$/.test(cardNum);
  };

  const getCardType = (cardNum: string): "travel" | "club" => {
    // This is simplified - in reality you'd need full card number
    // For now, assume user will tell us via the form
    return data.cardType as "travel" | "club";
  };

  const validateDateOfBirth = (dob: string): boolean => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 16;
  };

  const handleNextStep = async () => {
    setError("");
    setLoading(true);

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (step === 0) {
        if (!validateVerificationCode(data.verificationCode)) {
          setError("Invalid verification code. Must be 6 digits ending in SLCASN");
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
        if (!validateCardNumber(data.cardNumberLastTwo)) {
          setError("Please enter the last 2 digits of your card number");
          setLoading(false);
          return;
        }
        if (!data.cardType) {
          setError("Please select your card type");
          setLoading(false);
          return;
        }
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
        completedAt: new Date().toISOString(),
      };

      localStorage.setItem("sl-airlines-activated", JSON.stringify(activationData));
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
            <img src="https://cdn.builder.io/api/v1/image/assets%2F8d330572a69d41f0b535ef0b58b374e5%2Fd021add0cfe64fe394153b013ec25c99?format=webp&width=40" alt="SL Airlines" className="h-8 w-8" />
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
                <p className="text-xs mt-2 text-muted-foreground hidden sm:block">{s.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 animate-slide-up">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {steps[step].title}
          </h2>
          <p className="text-muted-foreground mb-6">{steps[step].description}</p>

          {/* Step Content */}
          <div className="space-y-6">
            {step === 0 && (
              <div>
                <Label htmlFor="verification-code" className="text-base mb-2 block">
                  Verification Code
                </Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Enter the 6-digit code sent to your email (format: XXXXSLCASN)
                </p>
                <Input
                  id="verification-code"
                  placeholder="123456SLCASN"
                  value={data.verificationCode}
                  onChange={(e) =>
                    handleInputChange("verificationCode", e.target.value.toUpperCase())
                  }
                  className="text-lg tracking-widest font-mono"
                  disabled={loading}
                />
              </div>
            )}

            {step === 1 && (
              <div>
                <Label htmlFor="pin" className="text-base mb-2 block">
                  4-Digit PIN
                </Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Enter the PIN provided with your card activation email
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
              <div className="space-y-4">
                <div>
                  <Label htmlFor="card-number" className="text-base mb-2 block">
                    Last 2 Digits of Card Number
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Enter the last 2 digits of your card
                  </p>
                  <Input
                    id="card-number"
                    placeholder="42"
                    value={data.cardNumberLastTwo}
                    onChange={(e) =>
                      handleInputChange("cardNumberLastTwo", e.target.value.replace(/\D/g, ""))
                    }
                    className="text-lg tracking-widest font-mono"
                    maxLength={2}
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label className="text-base mb-2 block">Card Type</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Select your card type (7 digits = Travel, 9 digits = Club)
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleInputChange("cardType", "travel")}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        data.cardType === "travel"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      disabled={loading}
                    >
                      <div className="font-semibold text-primary">Travel Card</div>
                      <div className="text-sm text-muted-foreground">7 digits - Blue</div>
                    </button>
                    <button
                      onClick={() => handleInputChange("cardType", "club")}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        data.cardType === "club"
                          ? "border-sl-club-black bg-sl-club-black/10"
                          : "border-border hover:border-sl-club-black/50"
                      } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      disabled={loading}
                    >
                      <div className="font-semibold text-sl-club-black">Club Card</div>
                      <div className="text-sm text-muted-foreground">9 digits - Black</div>
                    </button>
                  </div>
                </div>
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
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
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
                      <span className="font-semibold text-foreground">{data.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Card Type:</span>
                      <span className="font-semibold text-foreground capitalize">
                        {data.cardType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last 2 Digits:</span>
                      <span className="font-semibold text-foreground">{data.cardNumberLastTwo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date of Birth:</span>
                      <span className="font-semibold text-foreground">
                        {new Date(data.dateOfBirth).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {loading && (
                  <div className="text-center py-4">
                    <div className="inline-block">
                      <svg className="w-8 h-8 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    </div>
                    <p className="text-muted-foreground mt-3">Activating your card...</p>
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
            <Button onClick={handleNextStep} disabled={loading} className="flex-1 bg-primary">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
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
            <Button onClick={handleCompleteActivation} disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
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
    </div>
  );
}
