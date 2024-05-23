
// imige colors



// debug var
var debugnis = false;

document.getElementById('imageForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    const image1 = document.getElementById('image1').files[0];
    const image2 = document.getElementById('image2').files[0];
    const boxnum = document.getElementById('boxnumber').value;
    const leyway = document.getElementById('threshold').value;
    const pixleperfect = document.getElementById('pixle').value;

    console.warn("SUBNITING!!!");
    console.warn(`boxNumber: ${boxnum}`);
    console.warn(`leyway: ${leyway}`);
  
    formData.append('image1', image1);
    formData.append('image2', image2);
  
    try {

      if(boxnum >= 200){
        window.alert('Large sample size causes lag, please wait for image to finish. It might take a while. | LOOK AT THE DANCING CAT. HE STOPS DANCING WHEN AN IMAGE IS BEING PROCESSED |');
      }

      // get dimentions of smallest imiage
      const image1Dimentions = await getDimentions(image1);
      const image2Dimentions = await getDimentions(image2);

      // decide witch one is smaller
      if(image1Dimentions.width + image1Dimentions.height < image2Dimentions.width + image2Dimentions.height){
        console.log('Image 1 is smaller');
        console.log('Imige 1: ', image1Dimentions);
        const slmallest = {width: image1Dimentions.width, height: image1Dimentions.height};

        var display1 = document.getElementById('display1');
        display1.style.height = slmallest.height + 'px';
        display1.style.width = slmallest.width + 'px';

        var display2 = document.getElementById('display2');
        display2.style.height = slmallest.height + 'px';
        display2.style.width = slmallest.width + 'px';

        const canvass1 = new cnver(display1, slmallest.width, slmallest.height).getctx();
        const canvass2 = new cnver(display2, slmallest.width, slmallest.height).getctx();

        if(pixleperfect) {
          console.log(`pixle perfect mode enabled size: ${slmallest.width}`);
          createGrid(slmallest.width, slmallest.width, slmallest.height, canvass1, canvass2, Math.floor(leyway));
        } else {
        createGrid(boxnum, slmallest.width, slmallest.height, canvass1, canvass2, Math.floor(leyway));
        }

      } else {
        console.log('Image 2 is smaller');
        console.log('Imige 2: ', image2Dimentions);
        const slmallest = {width: image2Dimentions.width, height: image2Dimentions.height};

        var display1 = document.getElementById('display1');
        display1.style.height = slmallest.height + 'px';
        display1.style.width = slmallest.width + 'px';

        var display2 = document.getElementById('display2');
        display2.style.height = slmallest.height + 'px';
        display2.style.width = slmallest.width + 'px';

        const canvass1 = new cnver(display1, slmallest.width, slmallest.height).getctx();
        const canvass2 = new cnver(display2, slmallest.width, slmallest.height).getctx();

        if(pixleperfect) {
          console.log(`pixle perfect mode enabled size: ${slmallest.width}`);
          createGrid(slmallest.width, slmallest.width, slmallest.height, canvass1, canvass2, Math.floor(leyway));
        } else {
        createGrid(boxnum, slmallest.width, slmallest.height, canvass1, canvass2, Math.floor(leyway));
        }

      }

    } finally {}
    
  });


  // render into grid!!

  async function createGrid(boxnum, gridSizeW, gridSizeH, imige1, imige2, threshold) {

    // Get contaners for rendering latter on
    var container1 = await document.getElementById('gridContainer1');
    container1.innerHTML = ''; // clear canvas
    var container2 = await document.getElementById('gridContainer2');
    container2.innerHTML = ''; // clear canvas

    // style container1
    container1.style.transform = await `translatey(-${gridSizeH}px)`;
    container1.style.width = await gridSizeW + 'px';
    container1.style.height = await gridSizeH + 'px';

    //style container2
    container2.style.transform = await `translatey(-${gridSizeH}px)`;
    container2.style.width = await gridSizeW + 'px';
    container2.style.height = await gridSizeH + 'px';


    // calculate the desierd box size baced off numer of squares.
    const boxSize = await gridSizeH / boxnum;
    await console.log(`[DEBUG] ${boxSize}`); // DEBUG


    // DRAW THE BOX!!!!!!!!!!!!!!!!!!!
    // for eatch rows 
    for (let i = 0; i < boxnum; i++) {
     
      // for eatch colom in the row
        for (let j = 0; j < boxnum; j++) {

          console.log(`[DEBUG] ${imige1}`); // DEBUG
          console.log(`[DEBUG] ${imige2}`); // DEBUG
            //GET AVRAGE FROM PIXLE OF EATCH IMIGE
            var rgbb1 = await imige1.getAverageColor(gridSizeW / boxnum * j, gridSizeH / boxnum * i, boxSize, boxSize);
            var rgbb2 = await imige2.getAverageColor(gridSizeW / boxnum * j, gridSizeH / boxnum * i, boxSize, boxSize);;


          //// IMIGE 1

          console.log(rgbb1);

            // check if avrage collor matches
            if(rgbb1.r <= rgbb2.r + threshold || rgbb1.g <= rgbb2.g + threshold || rgbb1.b <= rgbb2.b + threshold){
              var color2 = 'rgb(0, 256, 0)';
            } else if (rgbb1.r >= rgbb2.r - threshold || rgbb1.g >= rgbb2.g - threshold || rgbb1.b >= rgbb2.b - threshold){
              var color1 = 'rgb(255, 0, 0)';
            } else {
              console.error('ERROR COMPARING AVRAGE COLORS RENDERING IMIGE NORMALY');
              var color1 = `rgb(${rgbb1.r}, ${rgbb1.g}, ${rgbb1.b})`
            }

            const box1 = await document.createElement('div');
              box1.style.position = await '  ';
              box1.style.top = await `${gridSizeH / i}px`;
              box1.style.left = await `${gridSizeW / j}px`;
              box1.style.marginLeft = await '0%';
              box1.style.width = await `${boxSize}px`;
              box1.style.height = await `${boxSize}px`;
              box1.style.opacity = await '70%';
              box1.style.backgroundColor = color1;
              box1.style.float = await 'left';
            await container1.appendChild(box1);

          
          //// IMIGE 2

          console.log(rgbb2);

            // check if avrage collor matches
            if(rgbb1.r <= rgbb2.r + threshold || rgbb1.g <= rgbb2.g + threshold || rgbb1.b <= rgbb2.b + threshold){
              var color2 = 'rgb(0, 256, 0)';
            } else if (rgbb1.r >= rgbb2.r - threshold || rgbb1.g >= rgbb2.g - threshold || rgbb1.b >= rgbb2.b - threshold){
              var color2 = 'rgb(255, 0, 0)';
            } else {
              console.error('ERROR COMPARING AVRAGE COLORS RENDERING IMIGE NORMALY');
              var color2 = `rgb(${rgbb2.r}, ${rgbb2.g}, ${rgbb2.b})`
            }

            const box2 = await document.createElement('div');
              box2.style.position = await '  ';
              box2.style.top = await `${gridSizeH / i}px`;
              box2.style.left = await `${gridSizeW / j}px`;
              box2.style.marginLeft = await '0%';
              box2.style.width = await `${boxSize}px`;
              box2.style.height = await `${boxSize}px`;
              box2.style.opacity = await '70%';
              box2.style.backgroundColor = color2;
              box2.style.float = await 'left';
            await container2.appendChild(box2);

        }

    }


  }



function getDimentions(image){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(image);
  });
}

function previwImage(selector) {

  if(selector === 1){
    const image1 = document.getElementById('image1').files[0];
    var display1 = document.getElementById('display1');
    display1.src = URL.createObjectURL(image1);

  } else if (selector === 2){
    const image2 = document.getElementById('image2').files[0];
    var display2 = document.getElementById('display2');
    display2.src = URL.createObjectURL(image2);
  }
}


// get avrage
class cnver{
  constructor(image, width, height){
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    this.canvas.width = width;
    this.canvas.height = height;
    this.context.drawImage(image, 0, 0, width, height, 0, 0, width, height);
  }

  getAverageColor(x, y, height, width) {
    return new Promise((resolve, reject) => {
      
      const imageData = this.context.getImageData(x, y, width, height).data;
  
      let totalRed = 0;
      let totalGreen = 0;
      let totalBlue = 0;
      let totalPixels = 0;
  
      
        const red = imageData[0];
        const green = imageData[1];
        const blue = imageData[2];
  
        totalRed += red;
        totalGreen += green;
        totalBlue += blue;
        totalPixels++;
  
  
      const averageRed = Math.round(totalRed / totalPixels);
      const averageGreen = Math.round(totalGreen / totalPixels);
      const averageBlue = Math.round(totalBlue / totalPixels);
  
      resolve({
        r: totalRed,
        g: totalGreen,
        b: totalBlue,
      });
    });
  }

  getctx(){
    return this;
  }
}

// opacity slider
function opacitySlider(){
  console.log("Opacity slider");
  const slider = document.getElementById('opacity').value;
  console.log(slider);
  
  // Get contaners for changing chiled opacity
  var nodes1 = document.getElementById('gridContainer1').childNodes 
  var nodes2 = document.getElementById('gridContainer2').childNodes 
  // change opacity
  for(var i=0; i< nodes1.length; i++) {
    nodes1[i].style.opacity = slider + '%';
    nodes2[i].style.opacity = slider + '%';
  }
     
}
function secret(trigger) {
  const kisser1 = document.getElementById('kisser1');
  const kisser2 = document.getElementById('kisser2');
  const text = document.getElementById('booptx');

  kisser1.style.display = 'block';
  kisser2.style.display = 'none';

  if (trigger === 'booper'){

      text.innerHTML = 'Boop!';
      kisser1.style.display = 'none';
      kisser2.style.display = 'block';
    setTimeout(() => {
      text.innerHTML = '';
      kisser1.style.display = 'block';
      kisser2.style.display = 'none';
    }, 1700);

  }
}
var badinterval = setInterval(nopeek, 3000);
function nopeek(){
  console.clear();
  console.error('////////////////////////////////////////');
  console.error('//  HAY CAN YOU PLASE STOP TRYING TO  //');
  console.error('//  PEEK AT MY MESSY DEBUG CONSLE     //');
  console.error('//  I AM TRYING TO WORK HERE JUST GO  //');
  console.error('//  AND DO SOMETHING ELES PLEEESS.... //');
  console.error('////////////////////////////////////////');
  console.warn('// you may stop this message my typing in here: debugnis == true; // ');
  if (debugnis === true){
    clearInterval(badinterval);
  } else {
    return;
  }
}
