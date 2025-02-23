'use client';

import React from "react";
import Image from "next/image";
import mannequin from "../assets/mannequin.png"; 
import tshirt from "../assets/clothes/tshirt.png";
import sweater from "../assets/clothes/sweater.png";
import jacket from "../assets/clothes/jacket.png";
import jeans from "../assets/clothes/jeans.png";
import shorts from "../assets/clothes/shorts.png";
import sweatpants from "../assets/clothes/sweatpants.png";

const underLayerOptions = [
  "Thermal Shirt",
  "Leggings",
  "Tank Top",
  "T-shirt",
  "Sweater",
  "Hoodie",
  "Socks",
  "Gloves",
  "Beanie",
  "Baseball Cap",
];

const AvatarCustomizer = ({ 
  underLayers, 
  setUnderLayers,
  top,
  setTop,
  bottom,
  setBottom
}) => {
  const clothingImages = {
    top: { "None": null, "T-shirt": tshirt, "Sweater": sweater, "Jacket": jacket },
    bottom: { "None": null, "Jeans": jeans, "Shorts": shorts, "Sweatpants": sweatpants },
  };

  const handleUnderLayerChange = (option) => {
    const newUnderLayers = underLayers.includes(option)
      ? underLayers.filter(layer => layer !== option)
      : [...underLayers, option];
    setUnderLayers(newUnderLayers);
  };

  return (
    <div className="flex gap-6 items-center p-4 bg-white shadow-md rounded-lg">
      <div className="relative w-56 h-96">
        <Image src={mannequin} alt="Mannequin" width={224} height={384} objectFit="contain" />

        {bottom !== "None" && clothingImages.bottom[bottom] && (
          <Image
            src={clothingImages.bottom[bottom]}
            alt={bottom}
            width={bottom === "Jeans" ? 200 : 120}
            height={bottom === "Jeans" ? 200 : 120}
            objectFit="contain"
            className={`absolute left-1/2 transform -translate-x-1/2 ${bottom === "Shorts" ? "bottom-30" : "bottom-3"}`}
          />
        )}

        {top !== "None" && clothingImages.top[top] && (
          <Image
            src={clothingImages.top[top]}
            alt={top}
            width={top === "Jacket" ? 147 : 120}
            height={top === "Jacket" ? 147 : 120}
            objectFit="contain"
            className="absolute top-16 left-1/2 transform -translate-x-1/2"
          />
        )}
      </div>

      <div className="flex flex-col">
        <label className="block text-gray-700 font-medium mb-2">Under Layers</label>
        <div className="border p-2 rounded-lg max-h-40 overflow-y-auto">
          {underLayerOptions.map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={underLayers.includes(option)}
                onChange={() => handleUnderLayerChange(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>

        <label className="block text-gray-700 font-medium mt-4 mb-2">Top Wear</label>
        <select
          className="p-2 border rounded-lg w-full"
          value={top}
          onChange={(e) => setTop(e.target.value)}
        >
          <option value="None">None</option>
          <option value="T-shirt">T-shirt</option>
          <option value="Sweater">Sweater</option>
          <option value="Jacket">Jacket</option>
        </select>

        <label className="block text-gray-700 font-medium mt-4 mb-2">Bottom Wear</label>
        <select
          className="p-2 border rounded-lg w-full"
          value={bottom}
          onChange={(e) => setBottom(e.target.value)}
        >
          <option value="None">None</option>
          <option value="Jeans">Jeans</option>
          <option value="Shorts">Shorts</option>
          <option value="Sweatpants">Sweatpants</option>
        </select>
      </div>
    </div>
  );
};

export default AvatarCustomizer;