import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGps } from '../hooks/useGps';

/**
 * Reusable GPS capture button.
 * Props: { onCapture(lat, lng), captured, capturedLat, capturedLng }
 */
export default function GpsButton({ onCapture, captured, capturedLat, capturedLng }) {
  const { t } = useTranslation();
  const { loading, error, getLocation } = useGps();

  const handleClick = async () => {
    const coords = await getLocation();
    if (coords && onCapture) {
      onCapture(coords.lat, coords.lng);
    }
  };

  if (captured && capturedLat != null) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[#1D9E75] text-sm font-medium flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {parseFloat(capturedLat).toFixed(4)}, {parseFloat(capturedLng).toFixed(4)}
        </span>
        <button
          type="button"
          onClick={handleClick}
          className="text-[12px] text-[#0F6E56] hover:text-[#085041] underline transition-colors"
        >
          {t('gps.recapture')}
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="border border-[#D3D1C7] hover:bg-[#E1F5EE] text-[#444441] rounded-lg px-3 py-2 text-sm flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {t('gps.detecting')}
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            📍 {t('gps.use_location')}
          </>
        )}
      </button>
      {error && (
        <p className="text-[#A32D2D] text-[12px] mt-1.5">{error}</p>
      )}
    </div>
  );
}
