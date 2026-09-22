'use client'

import { useMemo, useState } from 'react'
import { ArrowRight, Check, ChevronLeft, Leaf, RotateCcw, Search, Sparkles, X } from 'lucide-react'

const categories = [
  { id: 'fruity', name: 'Fruity', icon: '✦', description: 'Bright, juicy and sunlit', colors: 'from-rose-300 via-orange-200 to-amber-100' },
  { id: 'floral', name: 'Floral', icon: '✿', description: 'Aromatic and lifted', colors: 'from-fuchsia-200 via-rose-100 to-white' },
  { id: 'creamy', name: 'Creamy', icon: '◒', description: 'Silky and comforting', colors: 'from-stone-200 via-amber-50 to-white' },
  { id: 'spicy', name: 'Spiced', icon: '✹', description: 'Warm and expressive', colors: 'from-orange-300 via-amber-100 to-yellow-50' },
  { id: 'earthy', name: 'Earthy', icon: '◐', description: 'Grounded and deep', colors: 'from-emerald-300 via-lime-100 to-stone-50' },
  { id: 'sweet', name: 'Sweet', icon: '◌', description: 'Round and indulgent', colors: 'from-amber-200 via-yellow-50 to-white' },
  { id: 'bitter', name: 'Bitter', icon: '◈', description: 'Crisp and bracing', colors: 'from-sky-200 via-cyan-50 to-white' },
  { id: 'savory', name: 'Nutty', icon: '◑', description: 'Toasty and complex', colors: 'from-violet-200 via-purple-50 to-white' },
] as const

type Category = (typeof categories)[number]['id']

type Tea = {
  name: string
  type: string
  vendor: string
  flavours: string[]
}

const teas: Tea[] = [
  { flavours: ['Almond', 'Apple', 'Cinnamon', 'Nutty', 'Caramel', 'Sweet', 'Honey', 'Creamy', 'Berry', 'Hibiscus', 'Nutmeg', 'Vanilla', 'Smooth', 'Pecan', 'Toffee', 'Baked Bread', 'Spicy', 'Butter', 'Cranberry', 'Rose', 'Coconut', 'Earth'], name: 'Forever Nuts', type: 'Fruit Herbal Blend', vendor: 'DAVIDsTEA' },
  { flavours: ['Bitter', 'Grapefruit', 'Tart', 'Ginger'], name: 'Grapefruit Granita', type: 'Green Tea', vendor: 'DAVIDsTEA' },
  { flavours: ['Floral', 'Jasmine', 'Smooth', 'Sweet', 'Creamy'], name: 'Jasmine Phoenix Pearls', type: 'Green Tea', vendor: 'Adagio Teas' },
  { flavours: ['Cinnamon', 'Clove', 'Creamy', 'Hazelnut', 'Nutty', 'Orange Zest', 'Spicy', 'Sweet'], name: 'Hazelnut Chai', type: 'Black Chai Blend', vendor: "Zhena's Gypsy Tea" },
  { flavours: ['Bergamot', 'Orange', 'Citrus', 'Cream', 'Earth', 'Floral', 'Malt', 'Nuts', 'Wood', 'Honey', 'Clove', 'Bitter', 'Vanilla'], name: 'Earl Grey', type: 'Black Tea', vendor: 'Twinings' },
]

const categoryKeywords: Record<Category, string[]> = {
  fruity: ['apple', 'berry', 'citrus', 'fruit', 'guava', 'orange', 'lemon', 'grapefruit', 'cranberry', 'cherry'],
  floral: ['floral', 'rose', 'jasmine', 'hibiscus', 'perfume'],
  creamy: ['cream', 'creamy', 'butter', 'coconut', 'smooth'],
  spicy: ['spicy', 'cinnamon', 'clove', 'ginger', 'nutmeg', 'anise'],
  earthy: ['earth', 'wood', 'hay', 'malt'],
  sweet: ['sweet', 'honey', 'sugar', 'caramel', 'toffee', 'vanilla'],
  bitter: ['bitter', 'tart', 'astringent'],
  savory: ['nut', 'almond', 'walnut', 'pecan', 'peanut', 'hazelnut', 'oats', 'bread', 'popcorn'],
}

const canonical = (flavour: string) => {
  const value = flavour.toLowerCase().replace(/s$/, '')
  if (value.includes('cream') || value.includes('smooth')) return 'creamy'
  if (value.includes('clov')) return 'clove'
  if (value.includes('nut')) return 'nutty'
  if (value.includes('citrus') || value.includes('orange') || value.includes('lemon')) return 'citrus'
  return value
}

const categoryFor = (flavour: string) => (Object.keys(categoryKeywords) as Category[]).find(category => categoryKeywords[category].some(keyword => flavour.toLowerCase().includes(keyword)))

export function TeaRecommendationComponent() {
  const [selected, setSelected] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<Category>('fruity')
  const [query, setQuery] = useState('')
  const [showResults, setShowResults] = useState(false)

  const flavoursByCategory = useMemo(() => {
    const grouped = Object.fromEntries(categories.map(category => [category.id, [] as string[]])) as Record<Category, string[]>
    Array.from(new Set(teas.flatMap(tea => tea.flavours))).forEach(flavour => {
      const category = categoryFor(flavour)
      if (category) grouped[category].push(flavour)
    })
    return grouped
  }, [])

  const visibleFlavours = flavoursByCategory[activeCategory].filter(flavour => flavour.toLowerCase().includes(query.toLowerCase()))
  const active = categories.find(category => category.id === activeCategory)!

  const recommendations = useMemo(() => {
    if (!showResults || selected.length !== 3) return []
    const selectedCanonical = selected.map(canonical)
    return teas.map(tea => {
      const directMatches = tea.flavours.filter(flavour => selectedCanonical.includes(canonical(flavour)))
      const relatedMatches = tea.flavours.filter(flavour => !directMatches.includes(flavour) && selected.some(selectedFlavour => categoryFor(selectedFlavour) === categoryFor(flavour)))
      const score = Math.min(100, Math.round(((directMatches.length * 1 + relatedMatches.length * 0.18) / selected.length) * 100))
      return { tea, directMatches, relatedMatches, score }
    }).filter(result => result.score > 0).sort((a, b) => b.score - a.score).slice(0, 3)
  }, [selected, showResults])

  const selectFlavour = (flavour: string) => {
    setShowResults(false)
    setSelected(current => current.includes(flavour) ? current.filter(item => item !== flavour) : current.length < 3 ? [...current, flavour] : [...current.slice(1), flavour])
  }

  const reset = () => {
    setSelected([])
    setShowResults(false)
    setQuery('')
    setActiveCategory('fruity')
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f0e7] text-[#1d3029]">
      <div className="tea-grain pointer-events-none fixed inset-0 opacity-50" />
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-6 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1d3029]/15 bg-[#fdfbf6] text-lg"><Leaf size={18} /></div>
          <span className="font-serif text-2xl font-semibold tracking-tight">TeaHop</span>
        </div>
        <p className="hidden text-sm text-[#516157] sm:block">Find a tea that feels like you.</p>
        <button onClick={reset} className="inline-flex items-center gap-2 text-sm font-medium text-[#516157] transition hover:text-[#1d3029]"><RotateCcw size={15} /> Start over</button>
      </header>

      <section className="relative mx-auto max-w-6xl px-5 pb-20 md:px-8">
        <div className="grid items-end gap-10 pb-10 pt-6 lg:grid-cols-[1.1fr_.9fr] lg:pt-16">
          <div>
            <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#b45c30]"><Sparkles size={14} /> A more personal cup</p>
            <h1 className="max-w-3xl font-serif text-5xl leading-[.94] tracking-tight md:text-7xl">Begin with <em className="font-normal text-[#b45c30]">three</em> flavours.</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#516157]">Choose the notes you crave. We’ll surface teas that share their character, with the reasoning in every match.</p>
          </div>
          <div className="rounded-[2rem] border border-[#1d3029]/10 bg-[#1d3029] p-6 text-[#fbf8f0] shadow-[0_22px_60px_rgba(45,55,42,.18)]">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e7b775]">Your palate</p>
            <div className="mt-4 flex min-h-12 flex-wrap gap-2">
              {selected.length === 0 && <p className="self-center text-sm text-[#d9dbcf]">Your three notes will appear here.</p>}
              {selected.map((flavour, index) => <button key={flavour} onClick={() => selectFlavour(flavour)} className="group flex items-center gap-2 rounded-full bg-[#fbf8f0] px-3 py-2 text-sm font-semibold text-[#1d3029] transition hover:bg-[#e7b775]"><span className="text-[#b45c30]">0{index + 1}</span>{flavour}<X size={14} className="opacity-50 group-hover:opacity-100" /></button>)}
              {Array.from({ length: 3 - selected.length }).map((_, index) => <span key={index} className="h-9 w-9 rounded-full border border-dashed border-[#fbf8f0]/35" />)}
            </div>
            <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/15"><div className="h-full bg-[#e7b775] transition-all duration-500" style={{ width: `${selected.length / 3 * 100}%` }} /></div>
            <p className="mt-3 text-xs text-[#d9dbcf]">{selected.length === 3 ? 'Your tasting profile is ready.' : `${3 - selected.length} more note${3 - selected.length === 1 ? '' : 's'} to unlock your matches.`}</p>
          </div>
        </div>

        <div className="relative rounded-[2rem] border border-[#1d3029]/10 bg-[#fdfbf6] p-4 shadow-[0_18px_50px_rgba(60,56,38,.09)] md:p-7">
          <div className="flex flex-col justify-between gap-5 border-b border-[#1d3029]/10 pb-5 md:flex-row md:items-center">
            <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b45c30]">Step 1 of 2</p><h2 className="mt-1 font-serif text-3xl">What are you drawn to?</h2></div>
            <div className="relative w-full md:w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#738177]" size={17} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search flavours" className="w-full rounded-full border border-[#1d3029]/15 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-[#8a948c] focus:border-[#b45c30] focus:ring-4 focus:ring-[#e7b775]/25" /></div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[250px_1fr]">
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              {categories.map(category => <button key={category.id} onClick={() => { setActiveCategory(category.id); setQuery('') }} className={`group relative overflow-hidden rounded-2xl border p-3 text-left transition ${activeCategory === category.id ? 'border-[#1d3029] bg-[#1d3029] text-white shadow-lg' : 'border-[#1d3029]/10 bg-white hover:border-[#b45c30]/50'}`}><div className={`absolute inset-0 bg-gradient-to-br ${category.colors} opacity-0 transition group-hover:opacity-30 ${activeCategory === category.id ? 'hidden' : ''}`} /><span className="relative flex items-center gap-3"><span className={`flex h-9 w-9 items-center justify-center rounded-full text-lg ${activeCategory === category.id ? 'bg-[#e7b775] text-[#1d3029]' : 'bg-[#f5f0e7]'}`}>{category.icon}</span><span><strong className="block text-sm">{category.name}</strong><small className={`hidden text-xs md:block ${activeCategory === category.id ? 'text-white/65' : 'text-[#738177]'}`}>{category.description}</small></span></span></button>)}
            </div>
            <div className={`rounded-3xl bg-gradient-to-br ${active.colors} p-5 md:p-8`}>
              <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#1d3029]/55">Explore notes</p><h3 className="mt-1 font-serif text-3xl">{active.name}</h3></div><span className="text-5xl text-[#1d3029]/65">{active.icon}</span></div>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {visibleFlavours.map(flavour => { const isSelected = selected.includes(flavour); return <button key={flavour} onClick={() => selectFlavour(flavour)} className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${isSelected ? 'border-[#1d3029] bg-[#1d3029] text-white shadow-md' : 'border-[#1d3029]/15 bg-white/70 text-[#1d3029] hover:-translate-y-0.5 hover:border-[#b45c30] hover:bg-white'}`}>{isSelected && <Check className="mr-1 inline" size={14} />}{flavour}</button> })}
                {visibleFlavours.length === 0 && <p className="text-sm text-[#516157]">No flavours found in this family.</p>}
              </div>
              <p className="mt-8 max-w-lg text-sm leading-relaxed text-[#516157]">Tip: combine notes from different families to discover a more surprising result.</p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-4 z-10 mt-6 flex flex-col gap-4 rounded-3xl border border-[#1d3029]/10 bg-[#fdfbf6]/95 p-4 shadow-[0_14px_45px_rgba(45,55,42,.15)] backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e7b775] font-serif text-lg">{selected.length}</span><p className="text-sm text-[#516157]"><strong className="text-[#1d3029]">Your tasting profile</strong><br />Choose exactly three notes to continue.</p></div>
          <button disabled={selected.length !== 3} onClick={() => setShowResults(true)} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1d3029] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#b45c30] disabled:cursor-not-allowed disabled:opacity-35">Reveal my teas <ArrowRight size={17} /></button>
        </div>

        {showResults && <section className="mt-16 scroll-mt-6" aria-live="polite">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#b45c30]">Step 2 of 2</p><h2 className="mt-2 font-serif text-5xl tracking-tight">Your next cup.</h2><p className="mt-3 text-[#516157]">Ranked by direct notes first, then nearby flavour families.</p></div><button onClick={() => setShowResults(false)} className="inline-flex items-center gap-2 text-sm font-semibold text-[#516157] hover:text-[#1d3029]"><ChevronLeft size={16} /> Refine profile</button></div>
          <div className="mt-7 grid gap-5 lg:grid-cols-3">
            {recommendations.map(({ tea, directMatches, relatedMatches, score }, index) => <article key={tea.name} className={`group relative overflow-hidden rounded-[2rem] border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${index === 0 ? 'border-[#b45c30]/40 bg-[#1d3029] text-[#fbf8f0]' : 'border-[#1d3029]/10 bg-[#fdfbf6]'}`}>
              <div className={`absolute right-[-18px] top-[-24px] text-9xl opacity-10 ${index === 0 ? 'text-[#e7b775]' : 'text-[#b45c30]'}`}>✦</div>
              <div className="relative"><div className="flex items-center justify-between"><span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${index === 0 ? 'bg-[#e7b775] text-[#1d3029]' : 'bg-[#f5e6ca] text-[#8d4527]'}`}>#{index + 1} match</span><span className="font-serif text-3xl">{score}%</span></div><div className={`mt-5 h-1.5 overflow-hidden rounded-full ${index === 0 ? 'bg-white/15' : 'bg-[#e8e0d3]'}`}><div className="h-full rounded-full bg-[#e7b775]" style={{ width: `${score}%` }} /></div><p className={`mt-5 text-xs font-bold uppercase tracking-[.14em] ${index === 0 ? 'text-[#e7b775]' : 'text-[#b45c30]'}`}>{tea.type}</p><h3 className="mt-2 font-serif text-3xl leading-none">{tea.name}</h3><p className={`mt-2 text-sm ${index === 0 ? 'text-white/65' : 'text-[#738177]'}`}>{tea.vendor}</p><div className="mt-7 border-t border-current/10 pt-5"><p className={`text-sm ${index === 0 ? 'text-white/75' : 'text-[#516157]'}`}><strong className={index === 0 ? 'text-white' : 'text-[#1d3029]'}>Why it fits</strong><br />{directMatches.length ? `Directly shares ${directMatches.join(', ')}.` : `Sits near your ${selected.join(', ')} profile.`}</p><div className="mt-4 flex flex-wrap gap-2">{[...directMatches, ...relatedMatches.slice(0, 2)].map(flavour => <span key={flavour} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${index === 0 ? 'bg-white/10 text-white' : 'bg-[#f5f0e7] text-[#516157]'}`}>{flavour}</span>)}</div></div></div>
            </article>)}
          </div>
          {recommendations.length === 0 && <div className="mt-6 rounded-3xl border border-dashed border-[#1d3029]/20 bg-[#fdfbf6] p-10 text-center"><p className="font-serif text-3xl">No close match yet.</p><p className="mt-2 text-[#516157]">Try a new three-flavour combination—we’ll keep looking.</p></div>}
        </section>}
      </section>
      <footer className="relative border-t border-[#1d3029]/10 px-5 py-8 text-center text-sm text-[#738177]">TeaHop — made for curious palates.</footer>
    </main>
  )
}
