import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function Particles({ count = 100 }) {
    const mesh = useRef();
    const light = useRef();

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const time = Math.random() * 100;
            const factor = Math.random() * 100 + 20;
            const speed = Math.random() * 0.01 + 0.001;
            const x = Math.random() * 20 - 10;
            const y = Math.random() * 20 - 10;
            const z = Math.random() * 20 - 10;

            temp.push({ time, factor, speed, x, y, z });
        }
        return temp;
    }, [count]);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        particles.forEach((particle, i) => {
            let { time, factor, speed, x, y, z } = particle;

            // Update time
            const t = (particle.time += speed);

            // Update position
            dummy.position.set(
                x + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
                y + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                z + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
            );

            // Update scale based on position or time for pulsing effect
            const s = Math.cos(t);
            dummy.scale.set(s, s, s);
            dummy.rotation.set(s * 5, s * 5, s * 5);

            dummy.updateMatrix();

            // Apply matrix to instance
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <>
            <pointLight ref={light} distance={40} intensity={8} color="lightblue" />
            <instancedMesh ref={mesh} args={[null, null, count]}>
                <dodecahedronGeometry args={[0.2, 0]} />
                <meshPhongMaterial color="#05f" emissive="#05f" wireframe={false} />
            </instancedMesh>
        </>
    );
}

export default function HeroBackground() {
    return (
        <div className="absolute inset-0 z-0 opacity-40">
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                <fog attach="fog" args={["#0f172a", 5, 20]} />
                <ambientLight intensity={0.5} />
                <Particles count={150} />
            </Canvas>
        </div>
    );
}
