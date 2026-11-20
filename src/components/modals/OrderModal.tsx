"use client";

import React, { useState } from "react";
import { Language, TierQuantities } from "@/types/botanical";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  quantities: TierQuantities;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  lang,
  quantities,
}) => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [notes, setNotes] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const totalTrees = quantities.tier1 + quantities.tier2 + quantities.tier3;
  const totalPrice =
    quantities.tier1 * 10 + quantities.tier2 * 20 + quantities.tier3 * 50;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          region,
          notes,
          quantities,
          website,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error");
      }
      setSubmitted(true);
    } catch {
      setErrorMsg(
        lang === "ka"
          ? "გაგზავნა ვერ მოხერხდა. სცადეთ თავიდან ან დაგვირეკეთ: 595 33 11 69"
          : "Submission failed. Please try again or call: 595 33 11 69"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setErrorMsg("");
    setFullName("");
    setPhone("");
    setRegion("");
    setNotes("");
    onClose();
  };

  return (
    <div
      onClick={resetAndClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-panel max-w-lg w-full rounded-3xl p-6 sm:p-8 relative"
      >
        <button
          type="button"
          onClick={resetAndClose}
          aria-label="Close"
          className="absolute top-5 right-5 w-9 h-9 rounded-full border border-[var(--gold-main)]/35 flex items-center justify-center text-[var(--gold-main)] hover:bg-[var(--gold-main)]/10 cursor-pointer"
        >
          ✕
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="w-14 h-14 rounded-full bg-[var(--gold-main)]/20 border border-[var(--gold-main)] text-[var(--gold-main)] flex items-center justify-center mx-auto mb-5 text-2xl">
              ✓
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">
              {lang === "ka"
                ? "განაცხადი მიღებულია!"
                : "Reservation Received!"}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">
              {lang === "ka"
                ? "მადლობა! ჩვენი აგრო-კონსულტანტი უმოკლეს დროში დაგიკავშირდებათ მითითებულ ნომერზე."
                : "Thank you! Our agro-consultant will contact you shortly on the provided phone number."}
            </p>
            <button
              type="button"
              onClick={resetAndClose}
              className="px-7 py-3 rounded-full bg-gradient-to-r from-[#f5e7bd] via-[#d4af37] to-[#b88e28] text-[#060b08] text-xs font-bold tracking-wider uppercase cursor-pointer"
            >
              {lang === "ka" ? "დახურვა" : "Close"}
            </button>
          </div>
        ) : (
          <>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--gold-main)] block mb-1.5">
              {lang === "ka" ? "ნერგების რეზერვაცია" : "SEEDLING RESERVATION"}
            </span>
            <h3 className="font-display text-2xl font-bold mb-4">
              {lang === "ka" ? "შეკვეთის გაფორმება" : "Complete Your Order"}
            </h3>

            <div className="rounded-2xl bg-[var(--gold-main)]/10 border border-[var(--gold-main)]/25 p-3.5 mb-5 flex items-center justify-between text-xs">
              <span>
                {lang === "ka" ? "არჩეული პორტფელი:" : "Selected Portfolio:"}{" "}
                <strong>
                  {totalTrees.toLocaleString()}{" "}
                  {lang === "ka" ? "ნერგი" : "seedlings"}
                </strong>
              </span>
              <span className="font-bold text-sm text-[var(--gold-main)]">
                {totalPrice.toLocaleString()} ₾
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {/* Hidden bot honeypot */}
              <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
              />

              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">
                  {lang === "ka" ? "სახელი და გვარი *" : "Full Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={
                    lang === "ka" ? "მაგ: გიორგი ბერიძე" : "e.g. Giorgi Beridze"
                  }
                  className="w-full px-4 py-3 rounded-xl bg-black/15 border border-[var(--gold-main)]/30 focus:outline-none focus:border-[var(--gold-main)]"
                />
              </div>

              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">
                  {lang === "ka" ? "ტელეფონის ნომერი *" : "Phone Number *"}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="5XX XX XX XX"
                  className="w-full px-4 py-3 rounded-xl bg-black/15 border border-[var(--gold-main)]/30 focus:outline-none focus:border-[var(--gold-main)]"
                />
              </div>

              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">
                  {lang === "ka"
                    ? "რეგიონი / მიწის მდებარეობა"
                    : "Region / Land Location"}
                </label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder={
                    lang === "ka"
                      ? "მაგ: კასპი, კახეთი..."
                      : "e.g. Kaspi, Kakheti..."
                  }
                  className="w-full px-4 py-3 rounded-xl bg-black/15 border border-[var(--gold-main)]/30 focus:outline-none focus:border-[var(--gold-main)]"
                />
              </div>

              <div>
                <label className="block mb-1 text-[var(--text-secondary)]">
                  {lang === "ka" ? "დამატებითი კომენტარი" : "Additional Notes"}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/15 border border-[var(--gold-main)]/30 focus:outline-none focus:border-[var(--gold-main)]"
                />
              </div>

              {errorMsg && (
                <p className="text-red-400 text-xs font-medium">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#f5e7bd] via-[#d4af37] to-[#b88e28] text-[#060b08] text-xs font-bold tracking-[0.16em] uppercase shadow-lg shadow-[#d4af37]/20 hover:brightness-105 transition-all cursor-pointer mt-2 disabled:opacity-60"
              >
                {loading
                  ? lang === "ka"
                    ? "იგზავნება..."
                    : "Sending..."
                  : lang === "ka"
                    ? "განაცხადის გაგზავნა"
                    : "Submit Reservation"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};