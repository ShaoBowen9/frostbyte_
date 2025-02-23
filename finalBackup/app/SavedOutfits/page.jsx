"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { db, auth } from "../firebase/config";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import SnowBackground from "../components/SnowBackground.tsx"

const SavedOutfits = () => {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth.currentUser) {
      fetchSavedOutfits();
    }
  }, []);

  const fetchSavedOutfits = async () => {
    try {
      const userId = auth.currentUser.uid;
      const outfitsRef = collection(db, "users", userId, "savedOutfits");
      const q = query(outfitsRef, orderBy("createdAt", "desc"));
      
      const querySnapshot = await getDocs(q);
      const outfitsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOutfits(outfitsList);
    } catch (error) {
      console.error("Error fetching outfits:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteOutfit = async (id) => {
    try {
      const userId = auth.currentUser.uid;
      await deleteDoc(doc(db, "users", userId, "savedOutfits", id));
      setOutfits(outfits.filter(outfit => outfit.id !== id));
    } catch (error) {
      console.error("Error deleting outfit:", error);
    }
  };

  return (
    <div className="min-h-screen relative">
      <SnowBackground />
      
      {/* Content Container */}
      <div className="relative z-20 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-white">Saved Outfits</h1>
          <Link href="/components/Dashboard">
            <button className="bg-blue-500/80 backdrop-blur-sm text-white py-2 px-4 rounded-lg hover:bg-blue-600/80 transition">
              Back
            </button>
          </Link>
        </div>

        {outfits.length === 0 ? (
          <p className="text-white">No saved outfits yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {outfits.map(outfit => (
              <div 
                key={outfit.id} 
                className="p-4 rounded-lg backdrop-blur-md bg-white/10 border border-white/20 shadow-xl hover:bg-white/20 transition duration-300"
              >
                <h2 className="text-xl font-semibold text-white mb-2">Outfit</h2>
                <p className="text-white/90"><strong>Top:</strong> {outfit.top}</p>
                <p className="text-white/90"><strong>Bottom:</strong> {outfit.bottom}</p>
                <p className="text-white/90">
                  <strong>Under Layers:</strong>{" "}
                  {outfit.underLayers && outfit.underLayers.length > 0
                    ? outfit.underLayers.join(", ")
                    : "None"}
                </p>

                <button
                  onClick={() => deleteOutfit(outfit.id)}
                  className="mt-4 bg-red-500/80 backdrop-blur-sm text-white py-1 px-3 rounded-lg hover:bg-red-600/80 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedOutfits;
