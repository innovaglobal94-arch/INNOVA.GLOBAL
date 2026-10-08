import React from 'react';
import { UserPlus, CreditCard, CheckCircle, PlayCircle, Wallet } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: <UserPlus className="w-5 h-5 text-[#d4af37]" />,
      title: 'Create Account',
      description:
        'Register your account with Name, Mobile, and Password. Receive a sequential six-digit INNOVA ID (e.g. 000001, 000002).',
    },
    {
      num: '02',
      icon: <CreditCard className="w-5 h-5 text-[#d4af37]" />,
      title: 'Submit Activation',
      description:
        'Send the activation fee (৳200) via bKash or Nagad to official number 01313213083, then submit your transaction ID and screenshot.',
    },
    {
      num: '03',
      icon: <CheckCircle className="w-5 h-5 text-[#d4af37]" />,
      title: 'Admin Verification',
      description:
        'Root Admin (000001) reviews the payment and approves it. Your account and package status transition to ACTIVE.',
    },
    {
      num: '04',
      icon: <PlayCircle className="w-5 h-5 text-[#d4af37]" />,
      title: 'Perform Daily Tasks',
      description:
        'Complete 12 daily tasks (~20s duration each) to generate verified earnings recorded transparently in the database ledger.',
    },
    {
      num: '05',
      icon: <Wallet className="w-5 h-5 text-[#d4af37]" />,
      title: 'Network & Withdraw',
      description:
        'Earn ৳30 referral rewards per sponsored member and request manual bKash/Nagad disbursements directly to your phone.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#08080c] border-t border-[#181924]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#161722] border border-[#d4af37]/30 text-xs font-bold text-[#f7df8b] uppercase tracking-wider">
            <span>Step-by-Step Transparency</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-heading font-black text-white">
            How INNOVA.GLOBAL Works
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            A methodical, database-driven lifecycle guaranteeing security, accurate records, and clear procedures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#0f1017] border border-slate-800 relative hover:border-[#d4af37]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#171924] border border-slate-700 flex items-center justify-center">
                    {s.icon}
                  </div>
                  <span className="font-mono text-2xl font-black text-slate-700">{s.num}</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
