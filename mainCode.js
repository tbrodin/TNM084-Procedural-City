var container, 
    renderer, 
    scene, 
    camera, 
    controls,
    groundMesh, 
    groundMaterial,
    light,
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
    
    camera.position.z = 100;
    camera.target = new THREE.Vector3( 0, 0, 0 );

    //Add controls to manage camera position
    controls = new THREE.OrbitControls( camera );
                controls.damping = 0.2;
                controls.addEventListener( 'change', render );

    scene.add( camera );

    generateCity();

    // create the renderer and attach it to the DOM
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    container.appendChild( renderer.domElement );

    render();

} );

    function generateCity(){


    //light for city
    var light = new THREE.AmbientLight( 0x808080 ); // soft white light
    scene.add( light );

    // Create light
    var light = new THREE.PointLight(0xffffff, 1.0);

    light.position.set(0.0,50.0,200.0);
    scene.add(light);
        
    //Shadermaterial for ground
    groundMaterial = new THREE.ShaderMaterial( {

    uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib['lights'],
        {
            time: { type: "f", value: 0.0},
            camPos: {type: "v3", value: camera.position}
        }
    ]),  
 
    vertexShader: document.getElementById( 'vertexShader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
    wireframe: false,
    lights: true
    } );
    
    // create the ground and assign the material
    groundMesh = new THREE.Mesh( new THREE.PlaneGeometry(  100, 100, 200, 200 ), groundMaterial );
    groundMesh.position.y = -15;
    groundMesh.rotation.x = -Math.PI / 2.0;
    scene.add( groundMesh );


    /// HÄR SKA DET BLI STAD SÅ DET SMÄLLER!! (Undersök hur detta kan göras i shader)
    var buildingGeo = new THREE.CubeGeometry(1, 1, 1);

    buildingGeo.applyMatrix( new THREE.Matrix4().makeTranslation( 0.0, 0.5, 0.0 ) );

    //Kanske möjligt att använda shaders för att bestämma materialet
    var buildingMaterial = new THREE.MeshPhongMaterial( { color: 0x808080, shininess: 30, shading: THREE.FlatShading } );


    var buildingMesh = new THREE.Mesh( buildingGeo, buildingMaterial);

    //Position of building
    buildingMesh.position.x = Math.floor( Math.random() * 40 - 10 );
    buildingMesh.position.z = Math.floor( Math.random() * 40 - 10 );

    //y.pos will later depend on plane
    buildingMesh.position.y = -16;

    //scale of building
    buildingMesh.scale.x  = Math.random()*Math.random()*Math.random()*Math.random() * 5 + 5;
    buildingMesh.scale.z  = buildingMesh.scale.x;
    buildingMesh.scale.y  = (Math.random() * Math.random() * Math.random() * buildingMesh.scale.x) * 4 + 5;

    scene.add(buildingMesh);
            
    }

function render() {

   //groundMaterial.uniforms[ 'time' ].value = .00025 * ( Date.now() - start );
   
    // let there be light
    renderer.render( scene, camera );
    requestAnimationFrame( render );
    
}
