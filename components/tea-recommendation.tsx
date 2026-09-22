'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"

const flavorCategories = [
  { name: 'fruity', color: 'bg-[#B4D7A4]', icon: '🍓' },
  { name: 'earthy', color: 'bg-[#7D9B6E]', icon: '🏔️' },
  { name: 'sweet', color: 'bg-[#F7D488]', icon: '🍯' },
  { name: 'savory', color: 'bg-[#7E4E7E]', icon: '🌿' },
  { name: 'creamy', color: 'bg-[#C4C4C4]', icon: '☁️' },
  { name: 'floral', color: 'bg-[#E6B5B5]', icon: '🌸' },
  { name: 'bitter', color: 'bg-[#5B87C1]', icon: '🍋' },
  { name: 'spicy', color: 'bg-[#E67E22]', icon: '🌶️' },
]

type Tea = {
  flavours: string[]
  name: string
  type: string
  vendor: string
}

type Recommendation = {
  tea: Tea
  matchedFlavors: string[]
  score: number
}

const teaColors = ['from-amber-700 to-orange-500', 'from-emerald-700 to-lime-500', 'from-rose-700 to-pink-500']

export function TeaRecommendationComponent() {
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [categorizedFlavors, setCategorizedFlavors] = useState<Record<string, string[]>>({})
  const [teas, setTeas] = useState<Tea[]>([])
  const [recommendedTeas, setRecommendedTeas] = useState<Recommendation[] | null>(null)

  useEffect(() => {
    const loadedTeas: Tea[] = [
      { flavours: ["Almond", "Apple", "Cinnamon", "Nuts", "Nutty", "Apple Candy", "Apple Skins", "Caramel", "Sweet", "Honey", "Walnut", "Cake", "Creamy", "Fruity", "Berry", "Hibiscus", "Nutmeg", "Red Apple", "Vanilla", "Spices", "Cookie", "Smooth", "Cream", "Popcorn", "Roasted nuts", "Pecan", "Toffee", "Artificial", "Baked Bread", "Hay", "Overripe Cherries", "Pastries", "Brown Sugar", "Peanut", "Spicy", "Oats", "Butter", "Tangy", "Anise", "Clove", "Cranberry", "Rhubarb", "Roast nuts", "Rose", "Sugar", "Coconut", "Honeydew", "Stewed Fruits", "Berries", "Earth"], name: "Forever Nuts", type: "Fruit Herbal Blend", vendor: "DAVIDsTEA" },
      { flavours: ["Bitter", "Grapefruit", "Tart", "Ginger"], name: "Grapefruit Granita", type: "Green Tea", vendor: "DAVIDsTEA" },
      { flavours: ["Floral", "Jasmine", "Smooth", "Sweet", "Creamy"], name: "Jasmine Phoenix Pearls", type: "Green Tea", vendor: "Adagio Teas" },
      { flavours: ["Cinnamon", "Cloves", "Creamy", "Hazelnut", "Nutty", "Orange Zest", "Spices", "Sweet"], name: "Hazelnut Chai", type: "Black Chai Blend", vendor: "Zhena's Gypsy Tea" },
      { flavours: ["Bergamot", "Orange", "Paper", "Citrus", "Cream", "Citrus Zest", "Earth", "Floral", "Malt", "Nuts", "Wood", "Honey", "Perfume", "Cloves", "Dark Wood", "Orange Zest", "Astringent", "Bitter", "Green", "Lemon Zest", "Dark Bittersweet", "Vanilla", "Butterscotch", "Guava"], name: "Earl Grey", type: "Black Tea", vendor: "Twinings" },
    ]
    setTeas(loadedTeas)

    const allFlavors = loadedTeas.flatMap(tea => tea.flavours)
    const uniqueFlavors = Array.from(new Set(allFlavors))
    const categorized: Record<string, string[]> = { fruity: [], earthy: [], sweet: [], savory: [], creamy: [], floral: [], bitter: [], spicy: [] }

    uniqueFlavors.forEach(flavor => {
      const lowerFlavor = flavor.toLowerCase()
      if (['apple', 'berry', 'cherry', 'citrus', 'fruit', 'guava', 'orange', 'lemon', 'grapefruit', 'cranberry', 'rhubarb', 'honeydew'].some(f => lowerFlavor.includes(f))) categorized.fruity.push(flavor)
      else if (['earth', 'wood', 'hay', 'malt'].some(f => lowerFlavor.includes(f))) categorized.earthy.push(flavor)
      else if (['sweet', 'honey', 'sugar', 'caramel', 'toffee', 'vanilla', 'butterscotch'].some(f => lowerFlavor.includes(f))) categorized.sweet.push(flavor)
      else if (['savory', 'nuts', 'nutty', 'almond', 'walnut', 'pecan', 'peanut', 'hazelnut', 'oats', 'bread', 'popcorn'].some(f => lowerFlavor.includes(f))) categorized.savory.push(flavor)
      else if (['cream', 'creamy', 'butter', 'coconut', 'smooth'].some(f => lowerFlavor.includes(f))) categorized.creamy.push(flavor)
      else if (['floral', 'rose', 'jasmine', 'hibiscus', 'perfume'].some(f => lowerFlavor.includes(f))) categorized.floral.push(flavor)
      else if (['bitter', 'tart', 'astringent'].some(f => lowerFlavor.includes(f))) categorized.bitter.push(flavor)
      else if (['spicy', 'cinnamon', 'clove', 'ginger', 'nutmeg', 'anise'].some(f => lowerFlavor.includes(f))) categorized.spicy.push(flavor)
    })

    setCategorizedFlavors(categorized)
  }, [])

  const clearResults = () => setRecommendedTeas(null)

  const handleCategoryClick = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category)
  }

  const handleSubFlavorClick = (subFlavor: string) => {
    clearResults()
    setSelectedFlavors(prevFlavors => {
      if (prevFlavors.includes(subFlavor)) return prevFlavors.filter(flavor => flavor !== subFlavor)
      if (prevFlavors.length < 3) return [...prevFlavors, subFlavor]
      return [...prevFlavors.slice(1), subFlavor]
    })
  }

  const handleRemoveFlavor = (flavor: string) => {
    clearResults()
    setSelectedFlavors(prevFlavors => prevFlavors.filter(f => f !== flavor))
  }

  const recommendTea = () => {
    const recommendations = teas
      .map(tea => {
        const matchedFlavors = tea.flavours.filter(flavor => selectedFlavors.includes(flavor))
        return { tea, matchedFlavors, score: matchedFlavors.length / selectedFlavors.length }
      })
      .filter(({ matchedFlavors }) => matchedFlavors.length > 0)
      .sort((a, b) => b.score - a.score || a.tea.flavours.length - b.tea.flavours.length)
      .slice(0, 3)

    setRecommendedTeas(recommendations)
  }

  return (
    <Card className="w-full max-w-3xl mx-auto p-6 bg-white">
      <div className="flex flex-col items-center mb-12">
        <div className="w-32 h-16 mb-8 relative">
          <Image src="/logo.png" alt="Tea Hop Logo" fill className="object-contain" />
        </div>
        <h1 className="text-4xl font-bold mt-4">Click Three Flavours</h1>
      </div>
      {!activeCategory ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {flavorCategories.map((category) => (
            <button key={category.name} onClick={() => handleCategoryClick(category.name)} className={`${category.color} rounded-2xl p-4 h-32 flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}>
              <span className="text-4xl mb-2">{category.icon}</span>
              <span className="text-2xl font-semibold text-white">{category.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <Card className="p-4 bg-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold">{activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Sub-flavors</h3>
            <Button onClick={() => handleCategoryClick(activeCategory)} variant="outline">Back to Categories</Button>
          </div>
          <ScrollArea className="h-64">
            <div className="grid grid-cols-2 gap-4">
              {categorizedFlavors[activeCategory]?.map((subFlavor) => (
                <Button key={subFlavor} onClick={() => handleSubFlavorClick(subFlavor)} variant={selectedFlavors.includes(subFlavor) ? "default" : "outline"} className="justify-start h-12 text-lg">
                  {subFlavor}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">Selected Flavors <span className="text-muted-foreground">({selectedFlavors.length}/3)</span></h3>
          <div className="flex flex-wrap gap-2">
            {selectedFlavors.length === 0 && <span className="text-sm text-muted-foreground">Choose up to three flavours to begin.</span>}
            {selectedFlavors.map((flavor) => (
              <Button key={flavor} variant="secondary" className="px-3 py-1 text-sm hover:bg-primary hover:text-primary-foreground transition-colors" onClick={() => handleRemoveFlavor(flavor)}>
                {flavor} ✕
              </Button>
            ))}
          </div>
        </div>
        <Button onClick={recommendTea} disabled={selectedFlavors.length !== 3}>Recommend Teas</Button>
      </div>
      {recommendedTeas !== null && (
        <section className="mt-8" aria-live="polite">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-amber-700">Your tasting matches</p>
              <h3 className="text-2xl font-bold">Recommended teas</h3>
            </div>
            {recommendedTeas.length > 0 && <span className="text-sm text-muted-foreground">Ranked by flavor overlap</span>}
          </div>
          {recommendedTeas.length === 0 ? (
            <Card className="border-dashed p-8 text-center bg-amber-50/60">
              <p className="text-3xl mb-2">🍵</p>
              <h4 className="font-semibold">No direct matches yet</h4>
              <p className="mt-1 text-sm text-muted-foreground">Try a different combination of three flavours.</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {recommendedTeas.map(({ tea, matchedFlavors, score }, index) => (
                <Card key={tea.name} className="overflow-hidden border-amber-100 shadow-sm">
                  <div className="flex">
                    <div className={`hidden w-24 shrink-0 bg-gradient-to-br ${teaColors[index % teaColors.length]} sm:flex items-center justify-center text-4xl text-white`} aria-hidden="true">🍵</div>
                    <div className="min-w-0 flex-1 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-amber-700">#{index + 1} match</p>
                          <h4 className="mt-1 text-xl font-bold">{tea.name}</h4>
                          <p className="text-sm text-muted-foreground">{tea.type} · {tea.vendor}</p>
                        </div>
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-900">{Math.round(score * 100)}%</span>
                      </div>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-amber-100" aria-label={`${Math.round(score * 100)}% flavor match`}>
                        <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${score * 100}%` }} />
                      </div>
                      <p className="mt-4 text-sm"><span className="font-semibold">Why it fits:</span> shares {matchedFlavors.length === 1 ? 'this flavour' : 'these flavours'} with your selection.</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {matchedFlavors.map(flavor => <span key={flavor} className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-900">{flavor}</span>)}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}
    </Card>
  )
}
