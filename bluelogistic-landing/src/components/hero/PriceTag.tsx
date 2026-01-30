'use client';

export function PriceTag() {
  return (
    <div
      className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg px-5 py-4"
      style={{
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
      }}
    >
      {/* Header */}
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
        Shipping
      </p>

      {/* Flags with arrows */}
      <div className="flex items-center gap-2 my-2">
        {/* Austria flag emoji */}
        <span className="text-lg">🇦🇹</span>

        {/* Static arrows */}
        <div className="flex items-center">
          <span className="text-[#D8420E] text-sm">→→→</span>
        </div>

        {/* EU flag emoji */}
        <span className="text-lg">🇪🇺</span>
      </div>

      {/* Price */}
      <p className="text-[10px] text-gray-400 mb-0.5">from</p>
      <p className="text-2xl font-bold text-[#0D2556]">€5.80</p>
    </div>
  );
}
