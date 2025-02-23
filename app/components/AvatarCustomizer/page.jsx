"use client";

import React from "react";
import Image from "next/image";
import mannequin from "../assets/mannequin.png";
import tshirt from "../assets/clothes/tshirt.png";
import sweater from "../assets/clothes/sweater.png";
import jacket from "../assets/clothes/jacket.png";
import jeans from "../assets/clothes/jeans.png";
import shorts from "../assets/clothes/shorts.png";
import sweatpants from "../assets/clothes/sweatpants.png";
import { db, auth } from "../../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const underLayerOptions = [
  "Thermal Shirt",
  "Leggings",
  "Tank Top",
  "T-shirt",
  "Sweater",
  "Hoodie",
  "Socks",
  "Winter Boots",  // Added
  "Neck Gaiter",    // Added (corrected spelling)
  "Gloves",
  "Beanie",
  "Earmuffs",       // Added
  "Baseball Cap"
];

const AvatarCustomizer = ({ underLayers, setUnderLayers, top, setTop, bottom, setBottom }) => {
  const clothingImages = {
    top: { "None": null, "T-shirt": tshirt, "Sweater": sweater, "Jacket": jacket },
    bottom: { "None": null,  "Shorts": shorts,"Jeans": jeans, "Sweatpants": sweatpants },
  };

  const handleUnderLayerChange = (option) => {
    const newUnderLayers = underLayers.includes(option)
      ? underLayers.filter(layer => layer !== option)
      : [...underLayers, option];
    setUnderLayers(newUnderLayers);
  };

  const saveOutfit = async () => {
    if (!auth.currentUser) {
      alert("You need to be logged in to save outfits.");
      return;
    }

    try {
      await addDoc(collection(db, "users", auth.currentUser.uid, "savedOutfits"), {
        underLayers,
        top,
        bottom,
        createdAt: serverTimestamp(),
      });
      alert("Outfit saved successfully!");
    } catch (error) {
      console.error("Error saving outfit:", error);
    }
  };

  return (
    <div className="flex gap-6 items-center p-4 bg-gradient-to-br from-blue-200 via-blue-100 to-blue-50 shadow-lg rounded-lg border border-blue-300">
      <div className="relative w-56 h-96 bg-white bg-opacity-50 rounded-lg p-2">
        <Image src={mannequin || "/placeholder.svg"} alt="Mannequin" width={224} height={384} objectFit="contain" />

        {/* Bottom Wear Image */}
{bottom !== "None" && clothingImages.bottom[bottom] && (
  <Image
    src={clothingImages.bottom[bottom] || "/placeholder.svg"}
    alt={bottom}
    width={bottom === "Jeans" ? 140 : 120}
    height={bottom === "Jeans" ? 140 : 120}
    objectFit="contain"
    className={`absolute left-1/2 transform -translate-x-1/2 ${bottom === "Shorts" ? "bottom-24" : "bottom-6"}`} // Changed from bottom-30/bottom-3 to bottom-24/bottom-6
  />
)}

{/* Top Wear Image */}
{top !== "None" && clothingImages.top[top] && (
  <Image
    src={clothingImages.top[top] || "/placeholder.svg"}
    alt={top}
    width={top === "Jacket" ? 103 : 120}
    height={top === "Jacket" ? 103 : 120}
    objectFit="contain"
    className={`absolute ${
      top === "Jacket" ? "top-[4rem]" : "top-[5.5rem]"
    } left-1/2 transform -translate-x-[calc(50%-4px)]`}
  />
)}
      </div>

      <div className="flex flex-col flex-1">
        <label className="block text-blue-900 font-semibold mb-2">Under Layers</label>
        <div className="border border-blue-300 p-2 rounded-lg max-h-40 overflow-y-auto bg-white bg-opacity-90 shadow-inner">
          {underLayerOptions.map((option) => (
            <label key={option} className="flex items-center space-x-2 text-blue-900 py-1 hover:bg-blue-50 px-2 rounded">
              <input
                type="checkbox"
                checked={underLayers.includes(option)}
                onChange={() => handleUnderLayerChange(option)}
                className="text-blue-500 border-blue-300 focus:ring-blue-200"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>

        <label className="block text-blue-900 font-semibold mt-4 mb-2">Top Wear</label>
        <select
          className="p-2 border border-blue-300 rounded-lg w-full bg-white bg-opacity-90 text-blue-900 shadow-inner"
          value={top}
          onChange={(e) => setTop(e.target.value)}
        >
          <option value="None">None</option>
          <option value="T-shirt">T-shirt</option>
          <option value="Sweater">Sweater</option>
          <option value="Jacket">Jacket</option>
        </select>

        <label className="block text-blue-900 font-semibold mt-4 mb-2">Bottom Wear</label>
        <select
          className="p-2 border border-blue-300 rounded-lg w-full bg-white bg-opacity-90 text-blue-900 shadow-inner"
          value={bottom}
          onChange={(e) => setBottom(e.target.value)}
        >
          <option value="None">None</option>
          <option value="Shorts">Shorts</option>
          <option value="Jeans">Jeans</option>
          <option value="Sweatpants">Sweatpants</option>
        </select>

        <button
          onClick={saveOutfit}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-md font-semibold"
        >
          Save Outfit
        </button>
      </div>
    </div>
  );
};

export default AvatarCustomizer;