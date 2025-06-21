'use client';

export default function ContactInfo() {
  return (
    <div className="w-full md:w-2/5 bg-amber-500 text-black p-8 md:p-10 rounded-lg shadow-md self-start mt-20">
      <h2 className="text-3xl font-bold mb-6">Contact Information</h2>

      <p className="mb-6">
        Have any questions? Reach us through the form, call, or visit us at:
      </p>

      <ul className="space-y-5 text-sm">
        <li className="flex items-start gap-3">
          <span className="text-pink-600 text-lg">📞</span>
          <span>+62 851 6145 7365</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-blue-500 text-lg">📧</span>
          <span>contact@wmk08cheerslabs@gmail.com</span>
        </li>
        <li className="flex items-start gap-3">
          <span className="text-red-500 text-lg">📍</span>
          <span>
            Jl. Pura No.370, Jomblangan, Banguntapan, Kabupaten Bantul,
            <br />
            Daerah Istimewa Yogyakarta 55198
          </span>
        </li>
      </ul>
    </div>
  );
}
