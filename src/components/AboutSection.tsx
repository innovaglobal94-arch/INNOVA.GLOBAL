import React from 'react';
import {
  Network,
  BookOpen,
  Users2,
  CheckCircle2,
  ShieldAlert,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const pillars = [
    {
      icon: <Network className="w-6 h-6 text-[#d4af37]" />,
      title: 'Digital Networking',
      description:
        'A structured peer-to-peer ecosystem built to connect ambitious individuals across communities to collaborate and share digital skills.',
    },
    {
      icon: <BookOpen className="w-6 h-6 text-[#d4af37]" />,
      title: 'Digital Learning',
      description:
        'Access curated educational materials and practical workflows covering digital literacy, online operations, and technology tools.',
    },
    {
      icon: <Users2 className="w-6 h-6 text-[#d4af37]" />,
      title: 'Community Participation',
      description:
        'Engage with real members, share experiences, and build long-term relationships through dedicated community discussions.',
    },
    {
      icon: <Cpu className="w-6 h-6 text-[#d4af37]" />,
      title: 'Eligible Platform Tasks',
      description:
        'Participate in configured platform activities such as partner content reviews and digital evaluations with transparent execution rules.',
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-[#d4af37]" />,
      title: 'Verified Financial Ledger',
      description:
        'Every reward and ledger transaction is backed by verified business logic with zero artificial inflation and full administrative audit trails.',
    },
    {
      icon: <Layers className="w-6 h-6 text-[#d4af37]" />,
      title: 'Multi-Generation Network',
      description:
        'A structured 3-generation referral model that recognizes genuine sponsors for guiding, onboarding, and supporting active team members.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-[#090a0f] border-t border-[#191b26]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#161722] border border-[#d4af37]/30 text-xs font-bold text-[#f7df8b] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>About INNOVA.GLOBAL</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-heading font-black text-white">
            Smart Digital Network Platform
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            INNOVA.GLOBAL is built to empower individuals through digital networking, structured community
            participation, and practical digital tasks. We eliminate hype to focus on transparent systems and
            dependable software architecture.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-[#0f1118] border border-slate-800/80 hover:border-[#d4af37]/40 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#171924] border border-slate-700/60 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                {pillar.icon}
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#f7df8b] transition-colors">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* Trust & Compliance Statement */}
        <div className="mt-12 p-6 rounded-2xl bg-[#141520] border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-white font-semibold">Integrity & Realistic Expectations: </strong>
            INNOVA.GLOBAL enforces strict zero-tolerance policies against deceitful income guarantees. All rewards
            are subject to verified package criteria, genuine human completion of platform activities, and
            compliance with platform terms.
          </div>
        </div>
      </div>
    </section>
  );
};
