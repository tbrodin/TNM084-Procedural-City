var container, 
    renderer, 
    scene, 
    camera, 
    controls,
    groundMesh, 
    groundMaterial,
    buildingMaterial,
    light,
    light1,
    start = Date.now(),
    fov = 30;

window.addEventListener( 'load', function() {

    
    // grab the container from the DOM
    container = document.getElementById( "container" );
            // create a scene
    scene = new THREE.Scene();

    // create a camera the size of the browser window
    // and place it 100 units away, looking towards the center of the scene
    camera = new THREE.PerspectiveCamera( 
        fov, 
        window.innerWidth / window.innerHeight, 
        1, 
        10000 );
   
    camera.position.z = 150;
    camera.target = new THREE.Vector3( 0, 0, 0 );

    //Add controls for camera
    controls = new THREE.TrackballControls( camera );

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.keys = [ 65, 83, 68 ];

    controls.addEventListener( 'change', render );


    //LIGHTS FOR THE CITY
    //Ambient
    var light = new THREE.AmbientLight( 0xffffff ); // white light
    scene.add( light );

    // Point light 1
    light1 = new THREE.PointLight(0xffffff, 1.0); // white point light
    light1.position.set(0.0,-1.0,0.0);
    scene.add(light1);

    var sphereSize = 1;
    var pointLightHelper = new THREE.PointLightHelper( light1, sphereSize );
    scene.add( pointLightHelper );

    // Point light 2
    var light2 = new THREE.PointLight(0xff0000, 1.0); // red point light2
    //light2.position.set(0.0,10.0, 100.0);
    //scene.add(light2);
        
    generateCity();

    // create the renderer and attach it to the DOM
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    container.appendChild( renderer.domElement );

    animate();

} );


function generateCity(){

    //Shadermaterial for ground
    groundMaterial = new THREE.ShaderMaterial( {

    uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib['lights'],
        {
            time: { type: "f", value: 0.0},
            camPos: {type: "v3", value: camera.position}
        }
    ]),  
 
    vertexShader: document.getElementById( 'groundVertexShader').textContent,
    fragmentShader: document.getElementById( 'groundFragmentShader' ).textContent,
    wireframe: false,
    lights: true
    } );

    
    // create the ground and assign the material
    groundMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry(  100, 100, 50, 50 ), groundMaterial );
    groundMesh.position.z = -15.0;
    //groundMesh.rotation.x = -Math.PI / 2.0;
    scene.add( groundMesh );

    //BYGGA MASSA HUS    
    //Kanske möjligt att använda shaders för att bestämma materialet
    buildingMaterial = new THREE.ShaderMaterial( {

    uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib['lights'],
        {
            time: { type: "f", value: 0.0},
            camPos: {type: "v3", value: camera.position}
        }
    ]),  
 
    vertexShader: document.getElementById( 'buildingVertexShader' ).textContent,
    fragmentShader: document.getElementById( 'buildingFragmentShader' ).textContent,
    wireframe: false,
    lights: true
    } );

    var cityGeometry= new THREE.Geometry();
    for( var i = 0; i < 1; i ++ ){
        /// HÄR SKA DET BLI STAD SÅ DET SMÄLLER!! (Undersök hur detta kan göras i shader)
        var buildingGeo = new THREE.BoxGeometry(1, 1, 1, 5,5,5);

        buildingGeo.applyMatrix( new THREE.Matrix4().makeTranslation( 0.0, 0.0, 0.5 ) );

        var buildingMesh = new THREE.Mesh( buildingGeo, buildingMaterial);

        //Position of building
        buildingMesh.position.x = Math.floor( Math.random() * -80 + 42 );
        buildingMesh.position.y = Math.floor( Math.random() * -80 + 42 );

        //y.pos will later depend on plane
        buildingMesh.position.z = -15.0;

        //scale of building
        buildingMesh.scale.x  = Math.random()*Math.random()*Math.random()*Math.random() * 5 + 5;
        buildingMesh.scale.y  = buildingMesh.scale.x;
        buildingMesh.scale.z  = (Math.random() * Math.random() * Math.random() * buildingMesh.scale.x) * 6 + 5;
        THREE.GeometryUtils.merge( cityGeometry, buildingMesh );
    }
        
    
    var cityMesh = new THREE.Mesh(cityGeometry, buildingMaterial );

    scene.add(cityMesh);
    
            
}

function animate() {
  
    requestAnimationFrame( animate );
    controls.update();
    render();
}

function render() {
    var t = 0.00025 * ( Date.now() - start );
   groundMaterial.uniforms[ 'time' ].value = t;
   buildingMaterial.uniforms[ 'time' ].value = t;
   // light1.position.set(0.0, Math.sin( .00025 * ( Date.now() - start ) ) * 50.0,0.0 );
    light1.position.set(0.0, 100.0,0.0);
    renderer.render( scene, camera );

}
