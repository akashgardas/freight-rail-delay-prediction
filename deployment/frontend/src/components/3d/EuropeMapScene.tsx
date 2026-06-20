"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

// European City Nodes for 3D Map (aligned with backend coordinates)
const CITIES = [
  { id: "london", name: "London Hub", x: -4.5, z: -2.0, color: "#3b82f6", load: "45%", delay: "2.5m" },
  { id: "paris", name: "Paris Central", x: -2.8, z: -0.2, color: "#3b82f6", load: "72%", delay: "8.4m" },
  { id: "brussels", name: "Brussels Grid", x: -2.2, z: -1.2, color: "#3b82f6", load: "60%", delay: "4.1m" },
  { id: "rotterdam", name: "Rotterdam Terminal", x: -2.0, z: -1.8, color: "#f59e0b", load: "94%", delay: "32.5m" },
  { id: "hamburg", name: "Hamburg Yards", x: -0.2, z: -2.5, color: "#3b82f6", load: "65%", delay: "6.8m" },
  { id: "berlin", name: "Berlin Junction", x: 0.8, z: -1.8, color: "#10b981", load: "78%", delay: "11.2m" },
  { id: "warsaw", name: "Warsaw Grid", x: 3.2, z: -1.6, color: "#3b82f6", load: "55%", delay: "5.4m" },
  { id: "munich", name: "Munich Hub", x: 0.2, z: -0.2, color: "#f59e0b", load: "85%", delay: "21.0m" },
  { id: "vienna", name: "Vienna Station", x: 1.5, z: -0.2, color: "#3b82f6", load: "40%", delay: "3.2m" },
  { id: "milan", name: "Milan Depot", x: -0.5, z: 1.2, color: "#3b82f6", load: "62%", delay: "9.5m" },
  { id: "rome", name: "Rome Central", x: 0.4, z: 2.8, color: "#3b82f6", load: "50%", delay: "6.1m" },
  { id: "madrid", name: "Madrid Hub", x: -5.2, z: 2.2, color: "#3b82f6", load: "48%", delay: "4.8m" }
];

// Rails routes connecting cities
const ROUTES = [
  { from: "london", to: "brussels" },
  { from: "brussels", to: "rotterdam" },
  { from: "rotterdam", to: "hamburg" },
  { from: "hamburg", to: "berlin" },
  { from: "berlin", to: "warsaw" },
  { from: "paris", to: "brussels" },
  { from: "paris", to: "milan" },
  { from: "munich", to: "vienna" },
  { from: "vienna", to: "rome" },
  { from: "milan", to: "rome" },
  { from: "paris", to: "madrid" }
];

// Helper to get city by ID
const getCity = (id: string) => CITIES.find(c => c.id === id);

// Component to render background grid map of Europe (simulated landmass dots)
function EuropeLandmassDots() {
  const dots: [number, number, number][] = [];
  
  // Generating a cyber grid of dots in the general outline of Western/Central Europe
  // Centered around 0,0. X is west-east, Z is north-south
  for (let x = -7.0; x <= 6.0; x += 0.4) {
    for (let z = -4.0; z <= 4.0; z += 0.4) {
      // Procedural mathematical boundary outlining continental Europe
      const inMap = 
        // Spain / Portugal
        (x < -4.0 && z > 1.2 && z < 3.2 && !(x < -6.0 && z > 2.8)) ||
        // France
        (x >= -4.0 && x < -1.0 && z > -0.8 && z < 1.8) ||
        // UK
        (x < -3.2 && x > -5.2 && z > -3.2 && z < -1.2) ||
        // Italy
        (x >= -1.0 && x <= 1.0 && z > 0.8 && z < 3.5 && x + z * 0.4 > -0.2) ||
        // Central Europe (Germany, Poland, Austria)
        (x >= -1.0 && x <= 4.0 && z > -2.8 && z <= 0.8) ||
        // Benelux / North Sea coast
        (x >= -2.5 && x < -0.8 && z > -2.0 && z <= -0.8) ||
        // Scandinavia tail
        (x > 0.0 && x < 2.0 && z < -2.8 && z > -4.0);

      if (inMap) {
        // Add coordinates with slight visual height variance
        dots.push([x + (Math.random() - 0.5) * 0.05, -0.1, z + (Math.random() - 0.5) * 0.05]);
      }
    }
  }

  return (
    <points>
      <bufferGeometry>
        <float32BufferAttribute
          attach="attributes-position"
          args={[new Float32Array(dots.flat()), 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#1e3a8a"
        size={0.06}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.35}
      />
    </points>
  );
}

// Renders glowing rail track curves with moving train cargo pulse particles
interface RouteProps {
  start: { x: number; z: number };
  end: { x: number; z: number };
  speedMultiplier: number;
}

function RouteLine({ start, end, speedMultiplier }: RouteProps) {
  const points: THREE.Vector3[] = [];
  
  // Calculate mid-point height for Bezier curve elevation
  const startVec = new THREE.Vector3(start.x, 0, start.z);
  const endVec = new THREE.Vector3(end.x, 0, end.z);
  const dist = startVec.distanceTo(endVec);
  
  const midVec = new THREE.Vector3()
    .addVectors(startVec, endVec)
    .multiplyScalar(0.5);
  midVec.y = dist * 0.15; // Arc height

  // Create quadratic bezier curve
  const curve = new THREE.QuadraticBezierCurve3(startVec, midVec, endVec);
  const curvePoints = curve.getPoints(50);
  
  // Ref for cargo train particle animation
  const particleRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!particleRef.current) return;
    // Animate along curve based on time
    const t = ((state.clock.getElapsedTime() * 0.12 * speedMultiplier) % 1.0);
    const pos = curve.getPointAt(t);
    particleRef.current.position.copy(pos);
  });

  return (
    <group>
      {/* The visible glowing track line */}
      <line>
        <bufferGeometry>
          <float32BufferAttribute
            attach="attributes-position"
            args={[new Float32Array(curvePoints.map(p => [p.x, p.y, p.z]).flat()), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#1d4ed8" transparent opacity={0.4} linewidth={1} />
      </line>

      {/* Cargo Particle Pulse */}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color="#f97316" toneMapped={false} />
      </mesh>
    </group>
  );
}

// Scene controls and actual elements mapping
function MapScene({ onHoverNode }: { onHoverNode: (node: any) => void }) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <group position={[0, -0.5, 0]}>
      {/* Ambient and spotlighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#3b82f6" />
      <pointLight position={[-10, 5, -10]} intensity={0.5} color="#f97316" />

      {/* Ground Grid lines for command center look */}
      <gridHelper args={[24, 24, "#1e293b", "#0f172a"]} position={[0, -0.15, 0]} />

      {/* Dot landmass */}
      <EuropeLandmassDots />

      {/* Railway Route Lines */}
      {ROUTES.map((route, i) => {
        const startCity = getCity(route.from);
        const endCity = getCity(route.to);
        if (!startCity || !endCity) return null;
        
        // Random speed variance per route
        const speed = 1.0 + (i % 3) * 0.25;
        
        return (
          <RouteLine 
            key={`${route.from}-${route.to}`} 
            start={startCity} 
            end={endCity} 
            speedMultiplier={speed} 
          />
        );
      })}

      {/* City Station Nodes */}
      {CITIES.map((city) => {
        const isHovered = hoveredNode === city.id;
        
        return (
          <group 
            key={city.id} 
            position={[city.x, 0, city.z]}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredNode(city.id);
              onHoverNode(city);
            }}
            onPointerOut={() => {
              setHoveredNode(null);
              onHoverNode(null);
            }}
          >
            {/* Glowing outer ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
              <ringGeometry args={[0.16, isHovered ? 0.35 : 0.25, 32]} />
              <meshBasicMaterial 
                color={city.color} 
                transparent 
                opacity={isHovered ? 0.8 : 0.3} 
                side={THREE.DoubleSide} 
              />
            </mesh>

            {/* Inner core node */}
            <mesh position={[0, 0.05, 0]}>
              <sphereGeometry args={[isHovered ? 0.13 : 0.09, 16, 16]} />
              <meshBasicMaterial color={city.color} />
            </mesh>

            {/* Glowing pulse ring */}
            {isHovered && (
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
                <ringGeometry args={[0.2, 0.5, 32]} />
                <meshBasicMaterial color="#f97316" transparent opacity={0.4} />
              </mesh>
            )}

            {/* HTML label */}
            <Html distanceFactor={8} position={[0, 0.4, 0]} center>
              <div className={`px-2 py-0.5 rounded text-[10px] font-serif select-none border whitespace-nowrap transition-all duration-300 ${
                isHovered 
                  ? "bg-brand-saffron/90 border-brand-saffron text-white font-bold scale-110 shadow-sm" 
                  : "bg-bg-card border-border-primary text-text-primary"
              }`}>
                {city.name}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

export default function EuropeMapScene() {
  const [selectedStation, setSelectedStation] = useState<any>(null);

  // Dynamic import elements fail-safes
  const [OrbitControlsComponent, setOrbitControlsComponent] = useState<any>(null);
  
  React.useEffect(() => {
    // Dynamic import to prevent SSR loading crashes in Next.js 15
    import("@react-three/drei").then((drei) => {
      setOrbitControlsComponent(() => drei.OrbitControls);
    });
  }, []);

  return (
    <div className="relative w-full h-full bg-bg-card rounded-xl border border-border-primary overflow-hidden shadow-sm">
      
      {/* Floating Instrument Control HUD Overlay */}
      <div className="absolute top-4 left-4 z-10 p-3 bg-bg-card border border-border-primary rounded max-w-[200px]">
        <div className="flex items-center space-x-2 text-xs font-bold text-brand-blue dark:text-brand-accent-blue border-b border-border-primary pb-1.5 mb-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>LIVE CORRIDORS TELEMETRY</span>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-serif">
          TRANSMITTING: 24h<br />
          SATELLITE SYNC: OK<br />
          ACTIVE TRANSITS: 11<br />
          MAP SCALE: 1 : 4,200,000
        </p>
      </div>

      {/* Hover Info HUD Overlay */}
      {selectedStation && (
        <div className="absolute bottom-4 right-4 z-10 p-4 bg-bg-card border border-brand-saffron/40 rounded max-w-[220px] transition-all duration-300 animate-fade-in shadow-md">
          <div className="text-xs font-bold text-brand-saffron border-b border-border-primary pb-1.5 mb-2 font-serif">
            {selectedStation.name.toUpperCase()}
          </div>
          <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[10px] text-slate-600 dark:text-slate-400">
            <span>TRAFFIC LOAD:</span>
            <span className="font-bold text-text-primary text-right">{selectedStation.load}</span>
            <span>AVG DELAY:</span>
            <span className={`font-bold text-right ${selectedStation.id === 'rotterdam' ? 'text-red-600 dark:text-red-400' : 'text-brand-green'}`}>{selectedStation.delay}</span>
            <span>GRID STATUS:</span>
            <span className="text-brand-green font-bold text-right">ONLINE</span>
          </div>
        </div>
      )}

      {/* 3D Canvas Rendering */}
      <Canvas
        camera={{ position: [0, 6, 8], fov: 45 }}
        style={{ width: "100%", height: "100%" }}
      >
        <color attach="background" args={["#030712"]} />
        <MapScene onHoverNode={setSelectedStation} />
        {OrbitControlsComponent && (
          <OrbitControlsComponent 
            enableDamping 
            dampingFactor={0.05} 
            maxPolarAngle={Math.PI / 2.1} // Avoid flipping below grid
            minDistance={3}
            maxDistance={15}
          />
        )}
      </Canvas>

      {/* Compass / Navigation helper indicator */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center space-x-1.5 text-[9px] text-brand-blue dark:text-brand-accent-blue font-bold">
        <span className="border border-border-primary px-1 py-0.5 rounded">R: PAN</span>
        <span className="border border-border-primary px-1 py-0.5 rounded">L: ROTATE</span>
        <span className="border border-border-primary px-1 py-0.5 rounded">SCROLL: ZOOM</span>
      </div>
    </div>
  );
}
