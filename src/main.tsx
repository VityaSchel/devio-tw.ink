import './index.scss'
import { createRoot } from 'react-dom/client'
import React, { useRef, useState } from 'react'
import { Canvas, ThreeElements, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, useFBX } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { AnimationMixer } from 'three'

function Dima(props: { position: ThreeElements['mesh']['position'] }) {
  // This reference gives us direct access to the THREE.Mesh object
  // const ref = useRef<THREE.Mesh>(null!)
  // Hold state for hovered and clicked events
  // const [hovered, hover] = useState(false)
  // const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  // useFrame((state, delta) => (ref.current.rotation.x += delta))
  // Return the view, these are regular Threejs elements expressed in JSX
  // const fbx = useFBX('/variant2.fbx')
  const glb = useLoader(GLTFLoader, '/dima_twink.glb')

  let mixer
  if (glb.animations.length) {
    mixer = new AnimationMixer(glb.scene);
    glb.animations.forEach(clip => {
      const action = mixer.clipAction(clip)
      action.play();
    });
  }

  useFrame((state, delta) => {
    mixer?.update(delta)
  })

  return (
    <primitive
      position={props.position}
      object={glb.scene}
      scale={[0.1, 0.1, 0.1]}
    />
    // <mesh
    //   position={props.position}
    //   ref={ref}
    //   scale={clicked ? 1.5 : 1}
    //   onClick={() => click(!clicked)}
    //   onPointerOver={() => hover(true)}
    //   onPointerOut={() => hover(false)}>
    //   <boxGeometry args={[1, 1, 1]} />
    //   <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    // </mesh>
  )
}

createRoot(document.getElementById('root')!).render(
  <Canvas color='black'>
    <ambientLight intensity={0.5} />
    <color attach="background" args={[0,0,0]} />
    <pointLight position={[0, 0, 2]} power={100} />
    {/* <mesh position={[0, 0, 2]}>
      <boxGeometry args={[1, 1, 1]} />
    </mesh> */}
    {/* 
     */}
    <Dima position={[0, -1, 0]} />
    <OrbitControls />
  </Canvas>,
)