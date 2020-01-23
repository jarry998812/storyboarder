import React, { useEffect, useRef } from 'react'
import IconSprites from '../../../IconSprites'


const CameraIcon = React.memo(({type, text, secondText, sceneObject, fontMesh}) => {
    const ref = useRef()
    const iconsSprites = useRef()
    const frustumIcons = useRef()
    useEffect(() => {
        if(!fontMesh) return
        iconsSprites.current = new IconSprites(type, fontMesh)
        iconsSprites.current.addText(text, 1)
        let valueText = Math.round(sceneObject.fov) + "mm, " + sceneObject.z.toFixed(2) + "m"
        iconsSprites.current.addText(valueText, 2, { x: 0.7, y: 0, z: 0.39 }, 0.0055)
        ref.current.add(iconsSprites.current)
        iconsSprites.current.icon.material.rotation = ref.current.rotation.y
        frustumIcons.current = new THREE.Object3D()

        frustumIcons.current.left = new IconSprites( 'object', fontMesh )
        frustumIcons.current.right = new IconSprites( 'object', fontMesh )
        frustumIcons.current.left.scale.set(0.06, 2.5, 1)
        frustumIcons.current.right.scale.set(0.06, 2.5, 1)
        frustumIcons.current.left.icon.center = new THREE.Vector2(0.5, -0.2)
        frustumIcons.current.right.icon.center = new THREE.Vector2(0.5, -0.2)
        let hFOV = 2 * Math.atan( Math.tan( sceneObject.fov * Math.PI / 180 / 2 ) * 1 )
        frustumIcons.current.left.icon.material.rotation = hFOV/2 + ref.current.rotation.y
        frustumIcons.current.right.icon.material.rotation = -hFOV/2 + ref.current.rotation.y
        frustumIcons.current.add(frustumIcons.current.left)
        frustumIcons.current.add(frustumIcons.current.right)
        iconsSprites.current.add(frustumIcons.current)

    }, [fontMesh])

    useEffect(() => {
        if (fontMesh && ref.current) {
           iconsSprites.current.icon.material.rotation = sceneObject.rotation
            
            let hFOV = 2 * Math.atan( Math.tan( sceneObject.fov * Math.PI / 180 / 2 ) * 1 )
            frustumIcons.current.left.icon.material.rotation = hFOV/2 + sceneObject.rotation
            frustumIcons.current.right.icon.material.rotation = -hFOV/2 + sceneObject.rotation
            
            let focal = sceneObject.fov
            let meters = parseFloat(Math.round(sceneObject.z * 100) / 100).toFixed(2)
            if (iconsSprites.current.iconSecondText)
                iconsSprites.current.changeSecondText(`${Math.round(focal)}mm, ${meters}m`)
        }   
    }, [sceneObject])

    useEffect(() => {
        iconsSprites.current.changeText(1, text)
    }, [text])

    useEffect(() => {
        let valueText = Math.round(sceneObject.fov) + "mm, " + sceneObject.z.toFixed(2) + "m"
        iconsSprites.current.changeText(2, valueText)
    }, [ sceneObject.fov, sceneObject.z ])

    useEffect(() => {
        iconsSprites.current.icon.rotation.y = sceneObject.rotation
    }, [sceneObject.rotation])

    const { x, y, z} = sceneObject
    return <group 
        ref={ ref }
        position={ [x, z, y] }
        visible={ true }
        userData={{
            type:type
        }}
    >
    </group>
})

export default CameraIcon