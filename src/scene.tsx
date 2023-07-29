import React from 'react'
import { Camera, Canvas, ThreeElements, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, OrbitControlsChangeEvent, PerspectiveCamera } from '@react-three/drei'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { AnimationMixer } from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import styles from './ui.module.scss'
import cx from 'classnames'
// import draco from 'three/examples/js/libs/draco/gltf'

function Dima(props: { isStarted: boolean, position: ThreeElements['mesh']['position'], onReady: () => any }) {
  // This reference gives us direct access to the THREE.Mesh object
  // const ref = useRef<THREE.Mesh>(null!)
  // Hold state for hovered and clicked events
  // const [hovered, hover] = useState(false)
  // const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  // useFrame((state, delta) => (ref.current.rotation.x += delta))
  // Return the view, these are regular Threejs elements expressed in JSX
  // const fbx = useFBX('/variant2.fbx')
  const [model, setModel] = React.useState<GLTF | null>(null)
  // const [animModel, setAnimModel] = React.useState<GLTF | null>(null)

  React.useEffect(() => {
    load('/dima.glb', (gltf: GLTF) => {
      setModel(gltf)
      props.onReady()
    })
  }, [])

  const load = (url: string, cb: (gltf: GLTF) => any) => {
    const draco = new DRACOLoader()
    draco.setDecoderConfig({ type: 'js' });
    draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
    const gltf = new GLTFLoader()
    gltf.setDRACOLoader(draco)
    gltf.load(url, gltf => {
      cb(gltf)
    })
  }

  // const model = useLoader(GLTFLoader, '/dima.glb') as GLTF

  const mixer = React.useMemo(() => model && new AnimationMixer(model.scene), [model])

  React.useEffect(() => {
    if (mixer && model && model) {
      if(props.isStarted) {
        // model.scene.frustumCulled = false
        // model.scene.
        if (model.animations.length) {
          model.animations.forEach(clip => {
            mixer.timeScale = 1
            const action = mixer.clipAction(clip)
            action.play()
          })
        }
      }
    }
  }, [props.isStarted, mixer, model, model?.animations])

  useFrame((state, delta) => {
    mixer?.update(delta)
  })

  return (
    <>
      {model && <primitive
        position={props.position}
        object={model.scene}
        scale={[0.3, 0.3, 0.3]}
      />}
    </>
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

export function Scene({ isStarted, onReady }: {
  isStarted: boolean
  onReady: () => any
}) {
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [modelIsReady, setModelIsReady] = React.useState(false)
  const [videoIsReady, setVideoIsReady] = React.useState(false)
  const [videoIsHidden, setVideoIsHidden] = React.useState(false)

  const getDistance = (x: number, y: number, z: number) => Math.sqrt(x ** 2 + y ** 2 + z ** 2)
  const handleChangePos = (e: OrbitControlsChangeEvent) => {
    const distance = getDistance(
      e.target.object.position.x, 
      e.target.object.position.y, 
      e.target.object.position.z
    )
    const distN = Math.max(3, Math.min(100, distance))
    const volume = 1-(distN-3)/(100-3)
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }

  React.useEffect(() => {
    if (isStarted) {
      audioRef.current!.play()
      videoRef.current!.play()
    }
  }, [isStarted])

  const handleLoadedVideo = () => {
    if(videoRef.current!.readyState === 4) {
      setVideoIsReady(true)
    }
  }

  React.useEffect(() => {
    if(videoIsReady && modelIsReady) {
      onReady()
    }
  }, [videoIsReady, modelIsReady])

  return (
    <>
      <div className={cx(styles.videoContainer, { [styles.hidden]: videoIsHidden })}>
        <video
          src={'/exported_video.mp4'}
          ref={videoRef}
          className={styles.video}
          preload=''
          loop
          onLoadedData={handleLoadedVideo}
        />
      </div>
      <audio ref={audioRef} src={'/gangnam.mp3'} preload='' loop></audio>
      <Canvas  
        camera={{ fov: 50, zoom: 0.6 }} 
        onPointerDown={() => setVideoIsHidden(true)}
        onWheel={() => setVideoIsHidden(true)}
      >
        <ambientLight intensity={1} />
        <color attach="background" args={[81/255/3.85, 81/255/3.85, 81/255/3.85]} />
        <pointLight position={[0, 0, 2]} power={100} />
        {/* <mesh position={[0, 0, 2]}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh> */}
        {/* 
      */}
        <Dima 
          isStarted={isStarted} 
          position={[0, -3, 0]} 
          onReady={() => setModelIsReady(true)}
        />
        <OrbitControls
          enablePan={false}
          // camera={cameraRef.current ?? undefined}
          onChange={handleChangePos}
          // distan
          minDistance={3}
          maxDistance={100}
        />
        {/* <PerspectiveCamera
          makeDefault
          position={[0, 0, 0]}
          fov={50}
          zoom={0.9}
        /> */}
        {/* <camera ref={cameraRef} rotation={[0, 10, 0]} /> */}
      </Canvas>
    </>
  )
}
