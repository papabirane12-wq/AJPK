'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface CountryDial {
  code: string;
  name: string;
  dial_code: string;
  flag: string;
  format: string; // ex: '77 123 45 67'
  minLength: number;
  maxLength: number;
}

export const COUNTRIES: CountryDial[] = [
  { code: 'SN', name: 'Sénégal', dial_code: '+221', flag: '🇸🇳', format: '77 000 00 00', minLength: 9, maxLength: 9 },
  { code: 'FR', name: 'France', dial_code: '+33', flag: '🇫🇷', format: '6 12 34 56 78', minLength: 9, maxLength: 10 },
  { code: 'US', name: 'États-Unis / Canada', dial_code: '+1', flag: '🇺🇸', format: '202 555 0123', minLength: 10, maxLength: 10 },
  { code: 'IT', name: 'Italie', dial_code: '+39', flag: '🇮🇹', format: '312 345 6789', minLength: 9, maxLength: 10 },
  { code: 'ES', name: 'Espagne', dial_code: '+34', flag: '🇪🇸', format: '612 34 56 78', minLength: 9, maxLength: 9 },
  { code: 'GM', name: 'Gambie', dial_code: '+220', flag: '🇬🇲', format: '700 0000', minLength: 7, maxLength: 7 },
  { code: 'MR', name: 'Mauritanie', dial_code: '+222', flag: '🇲🇷', format: '45 00 00 00', minLength: 8, maxLength: 8 },
  { code: 'ML', name: 'Mali', dial_code: '+223', flag: '🇲🇱', format: '70 00 00 00', minLength: 8, maxLength: 8 },
  { code: 'CI', name: 'Côte d’Ivoire', dial_code: '+225', flag: '🇨🇮', format: '07 00 00 00 00', minLength: 10, maxLength: 10 },
  { code: 'GN', name: 'Guinée', dial_code: '+224', flag: '🇬🇳', format: '620 00 00 00', minLength: 9, maxLength: 9 },
  { code: 'MA', name: 'Maroc', dial_code: '+212', flag: '🇲🇦', format: '6 00 00 00 00', minLength: 9, maxLength: 9 },
  { code: 'GA', name: 'Gabon', dial_code: '+241', flag: '🇬🇦', format: '07 00 00 00', minLength: 8, maxLength: 9 },
  { code: 'DE', name: 'Allemagne', dial_code: '+49', flag: '🇩🇪', format: '151 23456789', minLength: 10, maxLength: 11 },
  { code: 'BE', name: 'Belgique', dial_code: '+32', flag: '🇧🇪', format: '470 12 34 56', minLength: 9, maxLength: 9 },
  { code: 'GB', name: 'Royaume-Uni', dial_code: '+44', flag: '🇬🇧', format: '7911 123456', minLength: 10, maxLength: 10 },
  { code: 'SA', name: 'Arabie Saoudite', dial_code: '+966', flag: '🇸🇦', format: '50 123 4567', minLength: 9, maxLength: 9 },
  { code: 'AE', name: 'Émirats Arabes Unis', dial_code: '+971', flag: '🇦🇪', format: '50 123 4567', minLength: 9, maxLength: 9 },
];

interface PhoneInputProps {
  value: string;
  onChange: (fullNumber: string) => void;
  required?: boolean;
}

export function PhoneInput({ value, onChange, required = true }: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryDial>(COUNTRIES[0]);
  const [nationalNumber, setNationalNumber] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleCountryChange = (country: CountryDial) => {
    setSelectedCountry(country);
    setIsOpen(false);
    const cleaned = nationalNumber.replace(/\D/g, '');
    onChange(cleaned ? `${country.dial_code} ${cleaned}` : '');
  };

  const handleNumberChange = (raw: string) => {
    // Only allow digits and spaces
    const digitsOnly = raw.replace(/\D/g, '');
    setNationalNumber(digitsOnly);
    if (digitsOnly) {
      onChange(`${selectedCountry.dial_code} ${digitsOnly}`);
    } else {
      onChange('');
    }
  };

  const isInvalid = nationalNumber.length > 0 && 
    (nationalNumber.length < selectedCountry.minLength || nationalNumber.length > selectedCountry.maxLength);

  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
        Téléphone *
      </label>
      
      <div className="relative">
        <div className={`flex items-center rounded-xl bg-slate-50 dark:bg-slate-800 border transition-all ${
          isInvalid 
            ? 'border-rose-400 focus-within:ring-2 focus-within:ring-rose-400' 
            : 'border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-brand-500'
        }`}>
          {/* Country Selector Dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 px-3 py-3 border-r border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750 transition text-xs font-semibold text-slate-800 dark:text-slate-100 rounded-l-xl"
              title={`${selectedCountry.name} (${selectedCountry.dial_code})`}
            >
              <span className="text-base leading-none">{selectedCountry.flag}</span>
              <span className="font-mono text-xs">{selectedCountry.dial_code}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsOpen(false)}
                />
                <div className="absolute top-full left-0 mt-1.5 w-64 max-h-60 overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 p-1.5 space-y-0.5">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Sélectionner un indicatif
                  </div>
                  {COUNTRIES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => handleCountryChange(c)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition text-left ${
                        selectedCountry.code === c.code
                          ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-sm">{c.flag}</span>
                        <span className="truncate">{c.name}</span>
                      </div>
                      <span className="font-mono text-slate-500 dark:text-slate-400 shrink-0 text-[11px]">
                        {c.dial_code}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* National Number Input */}
          <input
            type="tel"
            required={required}
            value={nationalNumber}
            onChange={(e) => handleNumberChange(e.target.value)}
            className="w-full px-4 py-3 bg-transparent text-xs font-medium text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        {/* Validation hint */}
        {isInvalid && (
          <p className="text-[10px] text-rose-500 font-medium mt-1">
            Numéro incomplet pour {selectedCountry.name} ({selectedCountry.minLength} chiffres attendus).
          </p>
        )}
      </div>
    </div>
  );
}
