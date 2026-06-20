"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Individual rotating wheel assembly component
function TrainWheel({ position }: { position: [number, number, number] }) {
  const wheelRef = useRef<THREE.Mesh>(null);

  // Rotate wheels to simulate forward movement
  useFrame((state) => {
    if (wheelRef.current) {
      wheelRef.current.rotation.z = -state.clock.getElapsedTime() * 4.5;
    }
  });

  return (
    <mesh position={position} ref={wheelRef}>
      <cylinderGeometry args={[0.22, 0.22, 0.08, 16]} />
      <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
    </mesh>
  );
}

// Track ties that slide backwards to simulate forward motion
function TrackTies() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Shift ties backwards to create movement illusion
      groupRef.current.position.z = (state.clock.getElapsedTime() * 1.5) % 1.2;
    }
  });

  // Generate a list of track ties
  const ties = [];
  for (let i = -10; i <= 10; i++) {
    ties.push(
      <group key={i} position={[0, -0.4, i * 1.2]}>
        {/* Sleeper Tie (wood/concrete) */}
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[1.6, 0.08, 0.25]} />
          <meshStandardMaterial color="#334155" roughness={0.9} />
        </mesh>
        {/* Rail plates */}
        <mesh position={[-0.55, 0.01, 0]}>
          <boxGeometry args={[0.15, 0.04, 0.2]} />
          <meshStandardMaterial color="#475569" metalness={0.7} />
        </mesh>
        <mesh position={[0.55, 0.01, 0]}>
          <boxGeometry args={[0.15, 0.04, 0.2]} />
          <meshStandardMaterial color="#475569" metalness={0.7} />
        </mesh>
      </group>
    );
  }

  return <group ref={groupRef}>{ties}</group>;
}

// Procedural high-tech cargo locomotive wagon
function CargoLocomotive({ color = "#0f1c3f" }) {
  const cabinRef = useRef<THREE.Group>(null);
  
  // Subtle vertical vibration to simulate active engine
  useFrame((state) => {
    if (cabinRef.current) {
      cabinRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 32) * 0.008;
    }
  });

  return (
    <group ref={cabinRef} position={[0, 0, 2.5]}>
      {/* Chassis / Frame */}
      <mesh position={[0, -0.25, 0]}>
        <boxGeometry args={[1.2, 0.15, 3.2]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Main Body Grid */}
      <mesh position={[0, 0.25, -0.2]}>
        <boxGeometry args={[1.15, 0.85, 2.4]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Raised Cabin section */}
      <mesh position={[0, 0.6, 0.75]}>
        <boxGeometry args={[1.15, 0.55, 0.8]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Windshield */}
      <mesh position={[0, 0.62, 1.16]}>
        <boxGeometry args={[1.0, 0.3, 0.02]} />
        <meshStandardMaterial color="#60a5fa" transparent opacity={0.6} emissive="#1d4ed8" emissiveIntensity={0.5} />
      </mesh>

      {/* Front Nose Grid Grill */}
      <mesh position={[0, 0.1, 1.61]}>
        <boxGeometry args={[0.9, 0.45, 0.02]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.5} />
      </mesh>

      {/* Headlights (High-tech Glowing LED strip) */}
      <mesh position={[-0.4, -0.1, 1.62]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#f97316" />
      </mesh>
      <mesh position={[0.4, -0.1, 1.62]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#f97316" />
      </mesh>

      {/* Saffron Center Indicator Light */}
      <mesh position={[0, 0.9, 1.16]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#f97316" />
      </mesh>

      {/* Glowing Headlight Beams */}
      <spotLight 
        position={[0, 0.2, 1.8]} 
        angle={0.25} 
        penumbra={0.6} 
        intensity={8} 
        color="#fdba74" 
        distance={20}
        castShadow
      />

      {/* Locomotive Wheels */}
      <TrainWheel position={[-0.55, -0.4, 1.1]} />
      <TrainWheel position={[0.55, -0.4, 1.1]} />
      <TrainWheel position={[-0.55, -0.4, 0.5]} />
      <TrainWheel position={[0.55, -0.4, 0.5]} />
      
      <TrainWheel position={[-0.55, -0.4, -0.7]} />
      <TrainWheel position={[0.55, -0.4, -0.7]} />
      <TrainWheel position={[-0.55, -0.4, -1.2]} />
      <TrainWheel position={[0.55, -0.4, -1.2]} />
    </group>
  );
}

// Container Cargo Car
interface CargoCarProps {
  position: [number, number, number];
  containerColor: string;
  label: string;
}

function CargoCar({ position, containerColor, label }: CargoCarProps) {
  return (
    <group position={position}>
      {/* Flatbed chassis */}
      <mesh position={[0, -0.28, 0]}>
        <boxGeometry args={[1.2, 0.1, 3.4]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Cargo Container Box */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.1, 1.25, 3.2]} />
        <meshStandardMaterial color={containerColor} metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Ribbed lines on Container for industrial texture */}
      {[...Array(9)].map((_, i) => (
        <mesh key={i} position={[0, 0.4, -1.4 + i * 0.35]}>
          <boxGeometry args={[1.13, 1.28, 0.08]} />
          <meshStandardMaterial color="#0f172a" metalness={0.4} roughness={0.6} />
        </mesh>
      ))}

      {/* Wheels */}
      <TrainWheel position={[-0.55, -0.4, 1.2]} />
      <TrainWheel position={[0.55, -0.4, 1.2]} />
      <TrainWheel position={[-0.55, -0.4, 0.7]} />
      <TrainWheel position={[0.55, -0.4, 0.7]} />

      <TrainWheel position={[-0.55, -0.4, -0.7]} />
      <TrainWheel position={[0.55, -0.4, -0.7]} />
      <TrainWheel position={[-0.55, -0.4, -1.2]} />
      <TrainWheel position={[0.55, -0.4, -1.2]} />
    </group>
  );
}

// Complete Train assembly containing engine and cargo cars
function TrainAssembly() {
  return (
    <group position={[0, 0, 0]}>
      {/* Steel rails (Static in X, infinite Z look) */}
      <mesh position={[-0.55, -0.36, 0]}>
        <boxGeometry args={[0.06, 0.06, 25]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.55, -0.36, 0]}>
        <boxGeometry args={[0.06, 0.06, 25]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Sliding track sleepers */}
      <TrackTies />

      {/* Locomotive Lead */}
      <CargoLocomotive color="#1e3a8a" />

      {/* Connected Containers */}
      <CargoCar position={[0, 0, -1.5]} containerColor="#0f172a" label="CARGO-A" />
      <CargoCar position={[0, 0, -5.3]} containerColor="#f97316" label="CARGO-B" />
      <CargoCar position={[0, 0, -9.1]} containerColor="#10b981" label="CARGO-C" />
    </group>
  );
}

export default function FreightTrainScene() {
  const [OrbitControlsComponent, setOrbitControlsComponent] = useState<any>(null);
  
  useEffect(() => {
    import("@react-three/drei").then((drei) => {
      setOrbitControlsComponent(() => drei.OrbitControls);
    });
  }, []);

  return (
    <div className="w-full h-full min-h-[350px] relative rounded-xl overflow-hidden border border-border-primary shadow bg-bg-card">
      
      {/* Telemetry HUD */}
      <div className="absolute top-4 left-4 z-10 text-brand-blue dark:text-brand-accent-blue p-3 rounded bg-bg-card text-xs border border-border-primary shadow-sm">
        <div className="flex items-center space-x-1.5 border-b border-border-primary pb-1 mb-1 font-serif">
          <span className="w-2 h-2 bg-brand-saffron rounded-full animate-pulse"></span>
          <span className="font-bold">TRAIN ASSEMBLY SIMULATOR</span>
        </div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400 space-y-0.5">
          <div>LOCOMOTIVE: WAG-9HC CLASS</div>
          <div>POWER: 9,000 HP (AC TRACTION)</div>
          <div>TELESCOPIC LOAD: 6,400 TONNES</div>
          <div>VELOCITY: 105 KM/H (CONST)</div>
          <div>COUPLING UNIT: SHENZHEN/SCHAKU</div>
        </div>
      </div>

      <Canvas
        camera={{ position: [4, 1.8, 5], fov: 42 }}
        style={{ width: "100%", height: "100%" }}
        shadows
      >
        {/* Dark atmospheric background color */}
        <color attach="background" args={["#040815"]} />
        
        {/* Scene lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1.2} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-5, 3, -5]} intensity={0.4} color="#ea580c" />

        {/* Dynamic fog for speed feeling */}
        <fog attach="fog" args={["#040815", 8, 22]} />

        {/* Procedural train */}
        <TrainAssembly />

        {OrbitControlsComponent && (
          <OrbitControlsComponent 
            enableZoom={true} 
            maxPolarAngle={Math.PI / 2.2} 
            minDistance={3}
            maxDistance={12}
          />
        )}
      </Canvas>

      {/* Controls description */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center space-x-2 text-[9px] text-slate-500 bg-bg-card px-2.5 py-1 rounded border border-border-primary font-serif font-bold shadow-sm">
        <span>DRAG TO ROTATE 3D MODEL</span>
      </div>
    </div>
  );
}
