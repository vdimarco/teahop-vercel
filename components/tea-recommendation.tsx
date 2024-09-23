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

export function TeaRecommendationComponent() {
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [categorizedFlavors, setCategorizedFlavors] = useState<Record<string, string[]>>({})
  const [teas, setTeas] = useState<Tea[]>([])
  const [recommendedTeas, setRecommendedTeas] = useState<Tea[]>([])

  useEffect(() => {
    // Simulating loading the CSV data
    const loadedTeas: Tea[] = [
      { flavours: ["Almond", "Apple", "Cinnamon", "Nuts", "Nutty", "Apple Candy", "Apple Skins", "Caramel", "Sweet", "Honey", "Walnut", "Cake", "Creamy", "Fruity", "Berry", "Hibiscus", "Nutmeg", "Red Apple", "Vanilla", "Spices", "Cookie", "Smooth", "Cream", "Popcorn", "Roasted nuts", "Pecan", "Toffee", "Artificial", "Baked Bread", "Hay", "Overripe Cherries", "Pastries", "Brown Sugar", "Peanut", "Spicy", "Oats", "Butter", "Tangy", "Anise", "Clove", "Cranberry", "Rhubarb", "Roast nuts", "Rose", "Sugar", "Coconut", "Honeydew", "Stewed Fruits", "Berries", "Earth"], name: "Forever Nuts", type: "Fruit Herbal Blend", vendor: "DAVIDsTEA" },
      { flavours: ["Bitter", "Grapefruit", "Tart", "Ginger"], name: "Grapefruit Granita", type: "Green Tea", vendor: "DAVIDsTEA" },
      { flavours: ["Floral", "Jasmine", "Smooth", "Sweet", "Creamy"], name: "Jasmine Phoenix Pearls", type: "Green Tea", vendor: "Adagio Teas" },
      { flavours: ["Cinnamon", "Cloves", "Creamy", "Hazelnut", "Nutty", "Orange Zest", "Spices", "Sweet"], name: "Hazelnut Chai", type: "Black Chai Blend", vendor: "Zhena's Gypsy Tea" },
      { flavours: ["Bergamot", "Orange", "Paper", "Citrus", "Cream", "Citrus Zest", "Earth", "Floral", "Malt", "Nuts", "Wood", "Honey", "Perfume", "Cloves", "Dark Wood", "Orange Zest", "Astringent", "Bitter", "Green", "Lemon Zest", "Dark Bittersweet", "Vanilla", "Butterscotch", "Guava"], name: "Earl Grey", type: "Black Tea", vendor: "Twinings" },
    ]
    setTeas(loadedTeas)

    // Categorize all flavors
    const allFlavors = loadedTeas.flatMap(tea => tea.flavours)
    const uniqueFlavors = Array.from(new Set(allFlavors))
    
    const categorized: Record<string, string[]> = {
      fruity: [],
      earthy: [],
      sweet: [],
      savory: [],
      creamy: [],
      floral: [],
      bitter: [],
      spicy: [],
    }

    uniqueFlavors.forEach(flavor => {
      const lowerFlavor = flavor.toLowerCase()
      if (['apple', 'berry', 'cherry', 'citrus', 'fruit', 'guava', 'orange', 'lemon', 'grapefruit', 'cranberry', 'rhubarb', 'honeydew'].some(f => lowerFlavor.includes(f))) {
        categorized.fruity.push(flavor)
      } else if (['earth', 'wood', 'hay', 'malt'].some(f => lowerFlavor.includes(f))) {
        categorized.earthy.push(flavor)
      } else if (['sweet', 'honey', 'sugar', 'caramel', 'toffee', 'vanilla', 'butterscotch'].some(f => lowerFlavor.includes(f))) {
        categorized.sweet.push(flavor)
      } else if (['savory', 'nuts', 'nutty', 'almond', 'walnut', 'pecan', 'peanut', 'hazelnut', 'oats', 'bread', 'popcorn'].some(f => lowerFlavor.includes(f))) {
        categorized.savory.push(flavor)
      } else if (['cream', 'creamy', 'butter', 'coconut', 'smooth'].some(f => lowerFlavor.includes(f))) {
        categorized.creamy.push(flavor)
      } else if (['floral', 'rose', 'jasmine', 'hibiscus', 'perfume'].some(f => lowerFlavor.includes(f))) {
        categorized.floral.push(flavor)
      } else if (['bitter', 'tart', 'astringent'].some(f => lowerFlavor.includes(f))) {
        categorized.bitter.push(flavor)
      } else if (['spicy', 'cinnamon', 'clove', 'ginger', 'nutmeg', 'anise'].some(f => lowerFlavor.includes(f))) {
        categorized.spicy.push(flavor)
      }
    })

    setCategorizedFlavors(categorized)
  }, [])

  const handleCategoryClick = (category: string) => {
    if (activeCategory === category) {
      setActiveCategory(null)
    } else {
      setActiveCategory(category)
    }
  }

  const handleSubFlavorClick = (subFlavor: string) => {
    setSelectedFlavors(prevFlavors => {
      if (prevFlavors.includes(subFlavor)) {
        return prevFlavors.filter(flavor => flavor !== subFlavor)
      } else if (prevFlavors.length < 3) {
        return [...prevFlavors, subFlavor]
      } else {
        return [...prevFlavors.slice(1), subFlavor]
      }
    })
  }

  const handleRemoveFlavor = (flavor: string) => {
    setSelectedFlavors(prevFlavors => prevFlavors.filter(f => f !== flavor))
  }

  const recommendTea = () => {
    if (selectedFlavors.length === 3) {
      // Simulating NetworkX nearest neighbors algorithm
      const similarities = teas.map(tea => {
        const commonFlavors = tea.flavours.filter(flavor => selectedFlavors.includes(flavor))
        return {
          tea,
          similarity: commonFlavors.length / Math.sqrt(tea.flavours.length * selectedFlavors.length)
        }
      })

      // Sort by similarity and get top 3
      const topRecommendations = similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 3)
        .map(item => item.tea)

      setRecommendedTeas(topRecommendations)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto p-6 bg-white">
      <div className="flex flex-col items-center mb-12">
        <div className="w-32 h-16 mb-8 relative">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-MTdJjGfMauo6x6HfoVIMin4MGQqd1M.png"
            alt="Tea Hop Logo"
            layout="fill"
            objectFit="contain"
          />
        </div>
        <h1 className="text-4xl font-bold mt-4">Click Three Flavours</h1>
      </div>
      {!activeCategory ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {flavorCategories.map((category) => (
            <button
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className={`${category.color} rounded-2xl p-4 h-32 flex flex-col items-center justify-center transition-all duration-300`}
            >
              <span className="text-4xl mb-2">{category.icon}</span>
              <span className="text-2xl font-semibold text-white">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <Card className="p-4 bg-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold">
              {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Sub-flavors
            </h3>
            <Button onClick={() => handleCategoryClick(activeCategory)} variant="outline">Back to Categories</Button>
          </div>
          <ScrollArea className="h-64">
            <div className="grid grid-cols-2 gap-4">
              {categorizedFlavors[activeCategory]?.map((subFlavor) => (
                <Button
                  key={subFlavor}
                  onClick={() => handleSubFlavorClick(subFlavor)}
                  variant={selectedFlavors.includes(subFlavor) ? "default" : "outline"}
                  className="justify-start h-12 text-lg"
                >
                  {subFlavor}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}
      <div className="mt-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-2">Selected Flavors:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedFlavors.map((flavor) => (
              <Button
                key={flavor}
                variant="secondary"
                className="px-3 py-1 text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => handleRemoveFlavor(flavor)}
              >
                {flavor} ✕
              </Button>
            ))}
          </div>
        </div>
        <Button 
          onClick={recommendTea} 
          disabled={selectedFlavors.length !== 3}
        >
          Recommend Teas
        </Button>
      </div>
      {recommendedTeas.length > 0 && (
        <Card className="mt-6 p-4 bg-primary/10">
          <h3 className="text-xl font-bold mb-4">Recommended Teas:</h3>
          {recommendedTeas.map((tea, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <p><strong>Name:</strong> {tea.name}</p>
              <p><strong>Type:</strong> {tea.type}</p>
              <p><strong>Vendor:</strong> {tea.vendor}</p>
              <p><strong>Flavors:</strong> {tea.flavours.join(', ')}</p>
            </div>
          ))}
        </Card>
      )}
    </Card>
  )
}
