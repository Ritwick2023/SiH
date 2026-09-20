'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ChevronDown, Check, Loader2 } from 'lucide-react';
import { DEMO_PERSONAS } from '@/lib/demoPersonas';

interface ParichayLoginButtonProps {
  className?: string;
  defaultPersonaId?: string;
  showPersonaDropdown?: boolean;
}

export function ParichayLoginButton({
  className = '',
  defaultPersonaId = 'demo-sunita',
  showPersonaDropdown = true,
}: ParichayLoginButtonProps) {
  const router = useRouter();
  const [selectedPersonaId, setSelectedPersonaId] = useState(defaultPersonaId);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedPersona =
    DEMO_PERSONAS.find((p) => p.id === selectedPersonaId) || DEMO_PERSONAS[1];

  const handleLogin = (personaId?: string) => {
    const targetPersona = personaId || selectedPersonaId;
    setLoading(true);
    router.push(`/api/auth/parichay?persona=${encodeURIComponent(targetPersona)}`);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="flex items-center gap-1.5 w-full">
        {/* Main SSO Action Button */}
        <button
          type="button"
          onClick={() => handleLogin()}
          disabled={loading}
          className="flex-1 h-12 px-4 rounded-2xl bg-[#1C4CA1] hover:bg-[#153a7a] text-white font-semibold text-xs sm:text-sm flex items-center justify-between shadow-sm hover:shadow-md transition-all group cursor-pointer border border-[#1C4CA1]"
          title="Sign in with Jan-Parichay / MeriPehchaan (NIC OIDC)"
        >
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white shrink-0">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                <Shield className="h-4 w-4 text-[#FFA72F]" />
              )}
            </div>
            <div className="text-left leading-tight">
              <span className="block font-bold">Jan-Parichay SSO</span>
              <span className="text-[10px] text-white/70 block">
                {selectedPersona ? `${selectedPersona.name} (${selectedPersona.cadre})` : 'MeriPehchaan OIDC'}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center text-[10px] font-mono font-black uppercase tracking-wider bg-[#FFA72F] text-[#1F273A] px-2 py-0.5 rounded-md">
            Gov ID
          </div>
        </button>

        {/* Cadre Persona Switcher Trigger */}
        {showPersonaDropdown && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="h-12 w-10 rounded-2xl bg-[#EDF0F7] hover:bg-[#EDF0F7]/80 border border-[#EDF0F7] flex items-center justify-center text-[#1F273A] transition-colors cursor-pointer"
              title="Select MoSPI Cadre Persona for SSO simulation"
              aria-label="Select persona"
            >
              <ChevronDown className={`h-4 w-4 text-[#1C4CA1] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-72 bg-white rounded-2xl shadow-xl border border-[#EDF0F7] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-[#EDF0F7] mb-1">
                  <span className="text-[11px] font-bold text-[#1F273A] block">
                    Select MoSPI Cadre Persona
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Simulates Jan-Parichay SAML/OIDC identity claims
                  </span>
                </div>

                <div className="space-y-1">
                  {DEMO_PERSONAS.map((p) => {
                    const isSelected = p.id === selectedPersonaId;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setSelectedPersonaId(p.id);
                          setIsOpen(false);
                          handleLogin(p.id);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#1C4CA1]/10 text-[#1C4CA1] font-bold'
                            : 'hover:bg-[#EDF0F7]/60 text-[#1F273A]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold">{p.name}</span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-white border border-[#EDF0F7] text-muted-foreground">
                              {p.cadre}
                            </span>
                          </div>
                          <span className="text-[10px] text-muted-foreground block">{p.designation}</span>
                        </div>
                        {isSelected && <Check className="h-3.5 w-3.5 text-[#1C4CA1]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
