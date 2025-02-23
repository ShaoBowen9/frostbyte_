'use client';
import { ReactNode, useState } from 'react';

const Layout = ({ children }) => {
  // Initialize snowflakes once using state
  const [snowflakes] = useState(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: Math.random() * 5 + 5,
      animationDelay: Math.random() * 5,
      opacity: Math.random()
    }))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-900 to-white relative overflow-hidden">
      {/* Snowflakes */}
      <div className="absolute inset-0 pointer-events-none">
        {snowflakes.map((flake) => (
          <div
            key={flake.id}
            className="snowflake"
            style={{
              position: 'absolute',
              top: `${-10}%`,
              left: `${flake.left}%`,
              width: '8px',
              height: '8px',
              backgroundColor: 'white',
              borderRadius: '50%',
              opacity: flake.opacity,
              animation: `fall ${flake.animationDuration}s linear infinite`,
              animationDelay: `${flake.animationDelay}s`,
            }}
          />
        ))}
      </div>

      {/* Rest remains the same */}
      <div className="relative z-10">{children}</div>

      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(-10vh); }
          100% { transform: translateY(110vh); }
        }
      `}</style>
    </div>
  );
};

export default Layout;