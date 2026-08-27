import { MapPin, Tv, CloudLightning, GraduationCap, Camera, Github, Twitter, Instagram, Mail } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
        {/* Placeholder for your profile picture */}
        <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 rounded-3xl bg-landmass border border-border overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center text-low-emphasis">
            <Camera size={48} opacity={0.2} />
          </div>
          {/* TODO: Add real image here -> <img src="/profile.jpg" alt="Martins Bergšteins" className="w-full h-full object-cover" /> */}
        </div>
        
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Martins Bergšteins</h1>
            <p className="text-xl text-secondary font-medium">@MeteoLatvia</p>
          </div>
          <p className="text-medium-emphasis text-lg leading-relaxed max-w-2xl">
            Meteoroloģijas un astronomijas entuziasts. Aizraujas ar atmosfēras fiziku, sinoptisko analīzi un skarbu laikapstākļu (vētru) medībām, apvienojot zinātni ar vizuālo mākslu un medijiem.
          </p>
          <div className="flex items-center gap-4 text-medium-emphasis">
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <MapPin size={16} className="text-secondary" />
              <span>Jelgava, Latvija</span>
            </div>
          </div>
        </div>
      </div>

      {/* Experience & Affiliations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <div className="bg-landmass border border-border p-5 rounded-2xl flex gap-4 items-start hover:border-secondary/50 transition-colors">
          <div className="bg-background p-3 rounded-xl">
            <Tv size={24} className="text-secondary" />
          </div>
          <div>
            <h3 className="font-bold text-lg">TV3 Latvija</h3>
            <p className="text-medium-emphasis text-sm mt-1">Laika ziņu moderators un satura veidotājs.</p>
          </div>
        </div>
        
        <div className="bg-landmass border border-border p-5 rounded-2xl flex gap-4 items-start hover:border-secondary/50 transition-colors">
          <div className="bg-background p-3 rounded-xl">
            <CloudLightning size={24} className="text-secondary" />
          </div>
          <div>
            <h3 className="font-bold text-lg">LVĢMC & ESSL</h3>
            <p className="text-medium-emphasis text-sm mt-1">Operatīvās meteoroloģijas praktikants un brīvprātīgais novērotājs Eiropas Spēcīgo vētru laboratorijā.</p>
          </div>
        </div>

        <div className="bg-landmass border border-border p-5 rounded-2xl flex gap-4 items-start hover:border-secondary/50 transition-colors">
          <div className="bg-background p-3 rounded-xl">
            <GraduationCap size={24} className="text-secondary" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Latvijas Universitāte</h3>
            <p className="text-medium-emphasis text-sm mt-1">Ģeogrāfijas un Zemes zinātņu fakultāte. Regeneron ISEF nacionālais finālists (Kirsty ciklona pētījums).</p>
          </div>
        </div>

        <div className="bg-landmass border border-border p-5 rounded-2xl flex gap-4 items-start hover:border-secondary/50 transition-colors">
          <div className="bg-background p-3 rounded-xl">
            <Camera size={24} className="text-secondary" />
          </div>
          <div>
            <h3 className="font-bold text-lg">MeteoLatvia</h3>
            <p className="text-medium-emphasis text-sm mt-1">Zinātnisko mediju zīmols un laikapstākļu novērojumu kopienas vadītājs.</p>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="pt-8 border-t border-border">
        <h2 className="text-2xl font-black mb-6">Saziņa un sociālie tīkli</h2>
        <div className="flex flex-wrap gap-4">
          <a href="#" className="flex items-center gap-2 bg-landmass hover:bg-ocean border border-border px-4 py-2.5 rounded-xl font-medium transition-colors">
            <Twitter size={18} className="text-[#1DA1F2]" />
            <span>X (Twitter)</span>
          </a>
          <a href="#" className="flex items-center gap-2 bg-landmass hover:bg-ocean border border-border px-4 py-2.5 rounded-xl font-medium transition-colors">
            <Instagram size={18} className="text-[#E1306C]" />
            <span>Instagram</span>
          </a>
          <a href="#" className="flex items-center gap-2 bg-landmass hover:bg-ocean border border-border px-4 py-2.5 rounded-xl font-medium transition-colors">
            <Github size={18} />
            <span>GitHub</span>
          </a>
          <a href="#" className="flex items-center gap-2 bg-landmass hover:bg-ocean border border-border px-4 py-2.5 rounded-xl font-medium transition-colors">
            <Mail size={18} className="text-medium-emphasis" />
            <span>E-pasts</span>
          </a>
        </div>
      </div>

    </div>
  );
}