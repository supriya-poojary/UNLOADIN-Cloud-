import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Cloud } from '@react-three/drei';
import * as THREE from 'three';

function RotatingStars() {
    const ref = useRef();
    useFrame((state, delta) => {
        ref.current.rotation.x -= delta / 10;
        ref.current.rotation.y -= delta / 15;
    });
    return (
        <group rotation={[0, 0, Math.PI / 4]} ref={ref}>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </group>
    );
}

function Particles({ count = 100 }) {
    const mesh = useRef();
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const x = (Math.random() - 0.5) * 100; // wide spread
            const y = (Math.random() - 0.5) * 100;
            const z = (Math.random() - 0.5) * 100;
            temp.push({ t, factor, speed, x, y, z, mx: 0, my: 0 });
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        particles.forEach((particle, i) => {
            let { t, factor, speed, x, y, z } = particle;
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;
            const s = Math.cos(t);

            dummy.position.set(x + Math.cos(t / 10) * 10 + Math.sin(t * 1) * 10, y + Math.sin(t / 10) * 10, z + Math.cos(t) * 10);
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();

            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <>
            <instancedMesh ref={mesh} args={[null, null, count]}>
                <dodecahedronGeometry args={[0.2, 0]} />
                <meshBasicMaterial color="#ff7a57" transparent opacity={0.6} />
            </instancedMesh>
        </>
    );
}


export default function PremiumBackground() {
    return (
        <div className="fixed inset-0 z-[-1] bg-[#0f172a]">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/0 via-[#0f172a]/50 to-[#0f172a] z-10 pointer-events-none" />
            <Canvas camera={{ position: [0, 0, 20], fov: 60 }} dpr={[1, 2]}>
                <fog attach="fog" args={['#0f172a', 10, 60]} />
                <ambientLight intensity={0.5} />
                <RotatingStars />
                <Particles count={300} />
                <Cloud opacity={0.3} segments={20} bounds={[10, 2, 2]} volume={10} color="#2c3e50" position={[0, -5, -10]} />
                <Cloud opacity={0.3} segments={20} bounds={[10, 2, 2]} volume={10} color="#ff7a57" position={[10, 5, -15]} />
            </Canvas>
        </div>
    );
}
