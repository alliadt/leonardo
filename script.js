// Copyright 2019 Adobe. All rights reserved.
// This file is licensed to you under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License. You may obtain a copy
// of the License at http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software distributed under
// the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
// OF ANY KIND, either express or implied. See the License for the specific language
// governing permissions and limitations under the License.

var colorField = document.getElementById('colorField1');
var color1 = document.getElementById('colorField1').value;
var colorTint = document.getElementById('colorField2').value;
var colorShade = document.getElementById('colorField3').value;
var background = document.getElementById('bgField').value;
// var colorBlock = document.getElementById('color');
var demoHeading = document.getElementById('demoHeading');
var demoWrapper = document.getElementById('demoWrapper');
var demoText = document.getElementById('demoText');
var demoBackgroundText = document.getElementById('demoTextInverted');
var demoBackgroundHeading = document.getElementById('demoHeadingInverted');
var demoBackgroundBlock = document.getElementById('demoInverted');
var demoButton = document.getElementById('demoButton');
var demoButtonInverted = document.getElementById('demoButtonInverted');
var userColorBlock = document.getElementById('userColor');
var userBgBlock = document.getElementById('userBg');
var ratioInput = document.getElementById('ratio');
var colorOutputField = document.getElementById('colorOutput');

function paramSetup() {
  colorspaceOptions();
  let url = new URL(window.location);
  let params = new URLSearchParams(url.search.slice(1));
  pathName = url.pathname;

  // // If parameters exist, use parameter; else use default html input values
  if(params.has('color')) {
    document.getElementById('colorField1').value = "#" + params.get('color');
  }
  if(params.has('base')) {
    document.getElementById('bgField').value = "#" + params.get('base');
  }
  if(params.has('tint')) {
    document.getElementById('colorField2').value = "#" + params.get('tint');
  }
  if(params.has('shade')) {
    document.getElementById('colorField3').value = "#" + params.get('shade');
  }
  if(params.has('ratios')) {
    // transform parameter values into array of numbers
    rat = params.get('ratios');
    ratios = rat.split(',');
    ratios = ratios.map(Number);

    if(ratios[0] == 0) { // if no parameter value, default to [3, 4.5]
      ratios = [3, 4.5];
    } else { }

    for(i=0; i<ratios.length; i++) {
      addRatio(ratios[i]);
    }
  }
  if(params.has('mode')) {
    document.querySelector('select[name="mode"]').value = params.get('mode');
  }
  else {
    addRatio(3);
    addRatio(4.5);
  }
}
paramSetup();

function backgroundblock(b){
  demoWrapper.style.backgroundColor = b;
  demoBackgroundText.style.color = b;
  demoBackgroundHeading.style.color = b;
  demoBackgroundBlock.style.color = b;
  demoButtonInverted.style.color = b;
  demoButtonInverted.style.borderColor = b;
}
backgroundblock(background);

// Add ratio inputs
function addRatio(v, s = '#cacaca') {
  // increment by default
  if(v == undefined) {
    // find highest value
    var hi = Math.max(...ratioInputs);
    var lo = Math.min(...ratioInputs);

    if(hi < 20) {
      v = Number(hi + 1).toFixed(2);
    }
    if(hi == 21) {
      v = Number(hi - 1).toFixed(2);
    }
  }

  var ratios = document.getElementById('ratios');
  var div = document.createElement('div');
  var sliderWrapper = document.getElementById('sliderWrapper');
  var slider = document.createElement('input');

  var randId = randomId();
  div.className = 'ratio-Item';
  div.id = randId + '-item';
  var sw = document.createElement('span');
  sw.className = 'spectrum-Textfield-swatch';
  sw.id = randId + '-sw';
  sw.style.backgroundColor = s;
  var input = document.createElement('input');
  input.className = 'spectrum-Textfield ratioField';
  input.type = "number";
  input.min = '-10';
  input.max = '21';
  input.step = '.01';
  input.placeholder = 4.5;
  input.id = randId;
  input.value = v;
  input.oninput = colorInput;
  // input.onfocus = showSlider;
  var button = document.createElement('button');
  button.className = 'spectrum-ActionButton';
  button.innerHTML = `
  <svg class="spectrum-Icon spectrum-Icon--sizeS" focusable="false" aria-hidden="true" aria-label="Delete">
    <use xlink:href="#spectrum-icon-18-Delete" />
  </svg>`;

  slider.type = 'range';
  slider.min = '0';
  slider.max = '100';
  slider.value = v;
  slider.step = '.01';
  slider.className = 'slider'
  slider.id = randId + "-sl";
  slider.disabled = true;
  sliderWrapper.appendChild(slider);

  button.onclick = deleteRatio;
  div.appendChild(sw);
  div.appendChild(input);
  div.appendChild(button);
  ratios.appendChild(div);
}

// When adding new ratios in UI, run colorinput as well
function addNewRatio() {
  addRatio();
  colorInput();
}

// Delete ratio input
function deleteRatio(e) {
  var id = e.target.parentNode.id;
  var self = document.getElementById(id);
  var sliderid = id.replace('-item', '') + '-sl';
  var slider = document.getElementById(sliderid);

  self.remove();
  slider.remove();
  colorInput();
}

function randomId() {
   return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
}

function createDemo(c, z) {
  var smallText = 'Small text demo';
  var largeText = 'Large text';
  var buttonText = 'Button';

  wrap = document.getElementById('demoWrapper');
  item = document.createElement('div');
  item.className = 'demoItem';
  demo = document.createElement('div');
  demo.className = 'spectrum-Typography demo';
  h = document.createElement('h4');
  h.className = 'spectrum-Heading2 demoHeading';
  title = document.createTextNode(largeText);
  p = document.createElement('p');
  p.className = 'spectrum-Body3 demoText';
  text = document.createTextNode(smallText);
  b = document.createElement('button');
  b.className = 'spectrum-Button demoButton';
  label = document.createTextNode(buttonText);

  h.appendChild(title);
  p.appendChild(text);
  b.appendChild(label);
  demo.appendChild(h);
  demo.appendChild(p);
  demo.appendChild(b);

  demoIn = document.createElement('div');
  demoIn.className = 'spectrum-Typography demoInverted';
  hIn = document.createElement('h4');
  hIn.className = 'spectrum-Heading2 demoHeading';
  pIn = document.createElement('p');
  pIn.className = 'spectrum-Body3 demoText';
  bIn = document.createElement('button');
  bIn.className = 'spectrum-Button demoButton';
  titleIn = document.createTextNode('Large text');
  textIn = document.createTextNode(smallText);
  labelIn = document.createTextNode(buttonText);

  hIn.appendChild(titleIn);
  pIn.appendChild(textIn);
  bIn.appendChild(labelIn);
  demoIn.appendChild(hIn);
  demoIn.appendChild(pIn);
  demoIn.appendChild(bIn);

  item.appendChild(demo);
  item.appendChild(demoIn);
  wrap.appendChild(item);

  demoIn.style.backgroundColor = c;
  demoIn.style.color = z;
  demo.style.color = c;
  p.style.color = c;
  h.style.color = c;
  b.style.color = c;
  b.style.borderColor = c;
  pIn.style.color = z;
  hIn.style.color = z;
  bIn.style.color = z;
  bIn.style.borderColor = z;
}

function colorspaceOptions() {
  colorspace = document.getElementById('mode');
  colorspace.options.length = 0;

  opts = {
    'LCH': 'Lch',
    'LAB': 'Lab',
    'CAM02': 'CIECAM02',
    'HSL': 'HSL',
    'HSLuv': 'HSLuv',
    'RGB': 'RGB'
  };

  for(index in opts) {
    colorspace.options[colorspace.options.length] = new Option(opts[index], index);
  }
}

// Calculate Color and generate Scales
function colorInput() {
  document.getElementById('colors').innerHTML = '';
  document.getElementById('charts').innerHTML = ' ';

  // var slider = document.getElementById('Slider');
  background = document.getElementById('bgField').value;
  var customTintShade = document.getElementById('tintShades');
  var color1 = colorField1.value;
  var colorTint = colorField2.value;
  var colorShade = colorField3.value;
  mode = document.querySelector('select[name="mode"]').value;
  // Gather input values for each input. Add those into array.
  ratioFields = document.getElementsByClassName('ratioField');

  // Clamp ratios convert decimal numbers to whole negatives and disallow
  // inputs less than 1 and greater than -1.
  for(i=0; i<ratioFields.length; i++) {
    val = ratioFields[i].value;
    if (val < 1 && val > -1) {
      ratioFields[i].value = (10 / (val * 10)).toFixed(2) * -1;
    } else { }
  }

  var rfIds = []
  for (i=0; i<ratioFields.length; i++) {
    rfIds.push(ratioFields[i].id);
  }
  ratioInputs = [];

  // For each ratio input field, push the value into the args array for adaptcolor
  for(i=0; i < ratioFields.length; i++) {
    ratioInputs.push(ratioFields[i].value);
  }

  adaptcolor({color: color1, base: background, ratios: ratioInputs, tint: colorTint, shade: colorShade, colorspace: mode});

  for(i=0; i<newColors.length; i++) {
    // Calculate value of color and apply to slider position/value
    var val = d3.hsluv(newColors[i]).v;
    // Find corresponding input/slider id
    var slider = document.getElementById(rfIds[i] + '-sl')
    slider.value = val;

    // apply color to subsequent swatch
    var swatch = document.getElementById(rfIds[i] + '-sw')
    swatch.style.backgroundColor = newColors[i];
  }

  // Generate Gradient
  for (var i = 0; i < colors.length; i++) {
    var container = document.getElementById('colors');
    var div = document.createElement('div');
    div.className = 'block';
    div.style.backgroundColor = colors[i];

    container.appendChild(div);
  }

  var backgroundR = d3.rgb(background).r;
  var backgroundG = d3.rgb(background).g;
  var backgroundB = d3.rgb(background).b;

  backgroundblock(background);

  var colorOutputWrapper = document.getElementById('colorOutputs');
  colorOutputWrapper.innerHTML = '';
  wrap = document.getElementById('demoWrapper');
  wrap.innerHTML = '';

  for (i = 0; i < newColors.length; i++) {
    var colorOutput = document.createElement('div');
    var colorOutputVal = newColors[i];
    var colorOutputText = document.createTextNode(d3.rgb(colorOutputVal).hex());
    var bg = d3.color(background).rgb();
    var outputRatio = contrast([d3.rgb(newColors[i]).r, d3.rgb(newColors[i]).g, d3.rgb(newColors[i]).b], [bg.r, bg.g, bg.b]);
    var ratioText = document.createTextNode(outputRatio.toFixed(2));
    var s1 = document.createElement('span');
    var s2 = document.createElement('span');

    colorOutputWrapper.appendChild(colorOutput);
    colorOutput.className = 'colorOutputBlock';
    colorOutput.style.backgroundColor = colorOutputVal;
    s1.appendChild(colorOutputText);
    s2.appendChild(ratioText);
    colorOutput.appendChild(s1);
    colorOutput.appendChild(s2);

    if (luminance(d3.rgb(newColors[i]).r, d3.rgb(newColors[i]).g, d3.rgb(newColors[i]).b) < 0.275) {
      colorOutput.style.color = "#ffffff";
    } else {
      colorOutput.style.color = '#000000';
    }
    createDemo(newColors[i], background);
  }

  createData();
  if(mode=="LCH") {
    createChartHeader('Luminosity');
    createChart(lchDataL);
    createChartHeader('Chroma');
    createChart(lchDataC);
    createChartHeader('Hue');
    createChart(lchDataH);
  }
  if(mode=="LAB") {
    createChartHeader('Luminosity');
    createChart(labDataL);
    createChartHeader('A');
    createChart(labDataA);
    createChartHeader('B');
    createChart(labDataB);
  }
  if(mode=="CAM02") {
    createChartHeader('Luminosity');
    createChart(camDataJ);
    createChartHeader('A');
    createChart(camDataA);
    createChartHeader('B');
    createChart(camDataB);
  }
  if(mode=="HSL") {
    createChartHeader('Hue');
    createChart(hslDataH);
    createChartHeader('Saturation');
    createChart(hslDataS);
    createChartHeader('Luminosity');
    createChart(hslDataL);
  }
  if(mode=="HSLuv") {
    createChartHeader('Luminosity');
    createChart(hsluvDataL);
    createChartHeader('U');
    createChart(hsluvDataU);
    createChartHeader('Value');
    createChart(hsluvDataV);
  }
  if(mode=="RGB") {
    createChartHeader('Red');
    createChart(rgbDataR);
    createChartHeader('Green');
    createChart(rgbDataG);
    createChartHeader('Blue');
    createChart(rgbDataB);
  }

  // update URL parameters
  updateParams(color1.substr(1), background.substr(1), colorTint.substr(1), colorShade.substr(1), ratioInputs, mode);
}
colorInput(color1);


// Passing variable parameters to URL
function updateParams(c, b, t, s, r, m) {
  let url = new URL(window.location);
  let params = new URLSearchParams(url.search.slice(1));

  params.set('color', c);
  params.set('base', b);
  params.set('tint', t);
  params.set('shade', s);
  params.set('ratios', r);
  params.set('mode', m);

  // retain pathname if present
  if(pathName == '/') {
    window.history.replaceState({}, '', '/?' + params); // update the page's URL.
  } else {
    window.history.replaceState({}, '', pathName + '/?' + params); // update the page's URL.
  }

  var p = document.getElementById('params');
  p.innerHTML = " ";
  var call = 'adaptcolor({';
  var pcol = 'color: "#' + c + '",';
  var pbas = 'base: "#'+ b + '",';
  var prat = 'ratios: [' + r + '],';
  var ptin = 'tint: "#' + t + '",';
  var psha = 'shade: "#' + s + '",';
  var pmod = ' colorspace: "' + m + '",';
  text1 = document.createTextNode(call);
  text2 = document.createTextNode(pcol);
  text3 = document.createTextNode(pbas);
  text4 = document.createTextNode(prat);
  text5 = document.createTextNode(ptin);
  text6 = document.createTextNode(psha);
  text7 = document.createTextNode(pmod);
  p.appendChild(text1);
  p.appendChild(text2);
  p.appendChild(text3);
  p.appendChild(text4);
  p.appendChild(text5);
  p.appendChild(text6);
  p.appendChild(text7);
}

// Create data based on colorspace
function createData() {
  CAM_J = [];
  CAM_A = [];
  CAM_B = [];
  LAB_L = [];
  LAB_A = [];
  LAB_B = [];
  LCH_L = [];
  LCH_C = [];
  LCH_H = [];
  HSL_H = [];
  HSL_S = [];
  HSL_L = [];
  HSLuv_L = [];
  HSLuv_U = [];
  HSLuv_V = [];
  RGB_R = [];
  RGB_G = [];
  RGB_B = [];

  for(i=4; i<colors.length -8; i++) { // Clip array to eliminate NaN values
    CAM_J.push(d3.jab(colors[i]).J);
    CAM_A.push(d3.jab(colors[i]).a);
    CAM_B.push(d3.jab(colors[i]).b);
    LAB_L.push(d3.lab(colors[i]).l);
    LAB_A.push(d3.lab(colors[i]).a);
    LAB_B.push(d3.lab(colors[i]).b);
    LCH_L.push(d3.hcl(colors[i]).l);
    LCH_C.push(d3.hcl(colors[i]).c);
    LCH_H.push(d3.hcl(colors[i]).h);
    RGB_R.push(d3.rgb(colors[i]).r);
    RGB_G.push(d3.rgb(colors[i]).g);
    RGB_B.push(d3.rgb(colors[i]).b);
    HSL_H.push(d3.hsl(colors[i]).h);
    HSL_S.push(d3.hsl(colors[i]).s);
    HSL_L.push(d3.hsl(colors[i]).l);
    HSLuv_L.push(d3.hsluv(colors[i]).l);
    HSLuv_U.push(d3.hsluv(colors[i]).u);
    HSLuv_V.push(d3.hsluv(colors[i]).v);
  }

  CAMArrayJ = [];
  CAMArrayA = [];
  CAMArrayB = [];
  LABArrayL = [];
  LABArrayA = [];
  LABArrayB = [];
  LCHArrayL = [];
  LCHArrayC = [];
  LCHArrayH = [];
  RGBArrayR = [];
  RGBArrayG = [];
  RGBArrayB = [];
  HSLArrayH = [];
  HSLArrayS = [];
  HSLArrayL = [];
  HSLuvArrayL = [];
  HSLuvArrayU = [];
  HSLuvArrayV = [];

  // Shorten the numbers in the array for chart purposes
  var maxVal = 50;
  var delta = Math.floor( CAM_J.length / maxVal );

  for (i = 0; i < CAM_J.length; i=i+delta) {
    CAMArrayJ.push(CAM_J[i]);
  }
  for (i = 0; i < CAM_A.length; i=i+delta) {
    CAMArrayA.push(CAM_A[i]);
  }
  for (i = 0; i < CAM_B.length; i=i+delta) {
    CAMArrayB.push(CAM_B[i]);
  }
  for (i = 0; i < LAB_L.length; i=i+delta) {
    LABArrayL.push(LAB_L[i]);
  }
  for (i = 0; i < LAB_A.length; i=i+delta) {
    LABArrayA.push(LAB_A[i]);
  }
  for (i = 0; i < LAB_B.length; i=i+delta) {
    LABArrayB.push(LAB_B[i]);
  }
  for (i = 0; i < LCH_L.length; i=i+delta) {
    LCHArrayL.push(LCH_L[i]);
  }
  for (i = 0; i < LCH_C.length; i=i+delta) {
    LCHArrayC.push(LCH_C[i]);
  }
  for (i = 0; i < LCH_H.length; i=i+delta) {
    LCHArrayH.push(LCH_H[i]);
  }
  for (i = 0; i < RGB_R.length; i=i+delta) {
    RGBArrayR.push(RGB_R[i]);
  }
  for (i = 0; i < RGB_G.length; i=i+delta) {
    RGBArrayG.push(RGB_G[i]);
  }
  for (i = 0; i < RGB_B.length; i=i+delta) {
    RGBArrayB.push(RGB_B[i]);
  }
  for (i = 0; i < HSL_H.length; i=i+delta) {
    HSLArrayH.push(HSL_H[i]);
  }
  for (i = 0; i < HSL_S.length; i=i+delta) {
    HSLArrayS.push(HSL_S[i]);
  }
  for (i = 0; i < HSL_L.length; i=i+delta) {
    HSLArrayL.push(HSL_L[i]);
  }
  for (i = 0; i < HSLuv_L.length; i=i+delta) {
    HSLuvArrayL.push(HSLuv_L[i]);
  }
  for (i = 0; i < HSLuv_U.length; i=i+delta) {
    HSLuvArrayU.push(HSLuv_U[i]);
  }
  for (i = 0; i < HSLuv_V.length; i=i+delta) {
    HSLuvArrayV.push(HSLuv_V[i]);
  }

  const fillRange = (start, end) => {
    return Array(end - start + 1).fill().map((item, index) => start + index);
  };

  dataX = fillRange(0, CAMArrayJ.length - 1);
  dataXcyl = fillRange(0, LCHArrayL.length - 1);

  // camData = [
  //   {
  //     x: dataX,
  //     y: CAMArrayJ
  //   },
  //   {
  //     x: dataX,
  //     y: CAMArrayA
  //   },
  //   {
  //     x: dataX,
  //     y: CAMArrayB
  //   }
  // ];
  // labData = [
  //   {
  //     x: dataX,
  //     y: LABArrayL
  //   },
  //   {
  //     x: dataX,
  //     y: LABArrayA
  //   },
  //   {
  //     x: dataX,
  //     y: LABArrayB
  //   }
  // ];
  // lchData = [
  //   {
  //     x: dataX,
  //     y: LCHArrayL
  //   },
  //   {
  //     x: dataX,
  //     y: LCHArrayC
  //   },
  //   {
  //     x: dataX,
  //     y: LCHArrayH
  //   }
  // ];
  // rgbData = [
  //   {
  //     x: dataX,
  //     y: RGBArrayR
  //   },
  //   {
  //     x: dataX,
  //     y: RGBArrayG
  //   },
  //   {
  //     x: dataX,
  //     y: RGBArrayB
  //   }
  // ];
  // hslData = [
  //   // {
  //   //   x: dataX,
  //   //   y: HSLArrayH
  //   // },
  //   {
  //     x: dataX,
  //     y: HSLArrayS
  //   },
  //   {
  //     x: dataX,
  //     y: HSLArrayL
  //   }
  // ];
  // hsluvData = [
  //   {
  //     x: dataX,
  //     y: HSLuvArrayL
  //   },
  //   {
  //     x: dataX,
  //     y: HSLuvArrayU
  //   },
  //   {
  //     x: dataX,
  //     y: HSLuvArrayV
  //   }
  // ];
  camDataJ = [
    {
      x: dataX,
      y: CAMArrayJ
    }
  ];
  camDataA = [
    {
      x: dataX,
      y: CAMArrayA
    }
  ];
  camDataB = [
    {
      x: dataX,
      y: CAMArrayB
    }
  ];
  labDataL = [
    {
      x: dataX,
      y: LABArrayL
    }
  ];
  labDataA = [
    {
      x: dataX,
      y: LABArrayA
    }
  ];
  labDataB = [
    {
      x: dataX,
      y: LABArrayB
    }
  ];
  lchDataL = [
    {
      x: dataX,
      y: LCHArrayL
    }
  ];
  lchDataC = [
    {
      x: dataX,
      y: LCHArrayC
    }
  ];
  lchDataH = [
    {
      x: dataXcyl,
      y: LCHArrayH
    }
  ];
  rgbDataR = [
    {
      x: dataX,
      y: RGBArrayR
    }
  ];
  rgbDataG = [
    {
      x: dataX,
      y: RGBArrayG
    }
  ];
  rgbDataB = [
    {
      x: dataX,
      y: RGBArrayB
    }
  ];
  hslDataH = [
    {
      x: dataXcyl,
      y: HSLArrayH
    }
  ];
  hslDataS = [
    {
      x: dataX,
      y: HSLArrayS
    }
  ];
  hslDataL = [
    {
      x: dataX,
      y: HSLArrayL
    }
  ];
  hsluvDataL = [
    {
      x: dataX,
      y: HSLuvArrayL
    }
  ];
  hsluvDataU = [
    {
      x: dataX,
      y: HSLuvArrayU
    }
  ];
  hsluvDataV = [
    {
      x: dataX,
      y: HSLuvArrayV
    }
  ];
}

function createChartHeader(x) {
  container = document.getElementById('charts');
  subhead = document.createElement('h6');
  subhead.className = 'spectrum-Subheading';
  title = document.createTextNode(x);
  subhead.appendChild(title);
  container.appendChild(subhead);
}

// Make color charts
function createChart(data) {
  var data = data;
  var xy_chart = d3_xy_chart()
      .width(208)
      // .height(120)
      .height(180)
      .xlabel("X Axis")
      .ylabel("Y Axis") ;
  var svg = d3.select("#charts").append("svg")
      .datum(data)
      .call(xy_chart) ;

  function d3_xy_chart() {
      var width = 180,
          height = 160,
        // height = 100,
          xlabel = "X Axis Label",
          ylabel = "Y Axis Label" ;

      function chart(selection) {
          selection.each(function(datasets) {
              //
              // Create the plot.
              //
              var margin = {top: 8, right: 0, bottom: 20, left: 0},
                  innerwidth = width - margin.left - margin.right,
                  innerheight = height - margin.top - margin.bottom ;

              var x_scale = d3.scaleLinear()
                  .range([0, innerwidth])
                  .domain([ d3.min(datasets, function(d) { return d3.min(d.x); }),
                            d3.max(datasets, function(d) { return d3.max(d.x); }) ]) ;

              var y_scale = d3.scaleLinear()
                  .range([innerheight, 0])
                  .domain([ d3.min(datasets, function(d) { return d3.min(d.y); }),
                            d3.max(datasets, function(d) { return d3.max(d.y); }) ]) ;

              var color_scale = d3.scaleOrdinal(d3.schemeCategory10)
                  .domain(d3.range(datasets.length)) ;

              var x_axis = d3.axisBottom(x_scale);

              var y_axis = d3.axisLeft(y_scale);

              var x_grid = d3.axisBottom(x_scale)
                  .tickSize(-innerheight)
                  .tickFormat("") ;

              var y_grid = d3.axisLeft(y_scale)
                  .tickSize(-innerwidth)
                  .tickFormat("") ;

              var draw_line = d3.line()
                  .curve(d3.curveLinear)
                  .x(function(d) { return x_scale(d[0]); })
                  .y(function(d) { return y_scale(d[1]); }) ;

              var svg = d3.select(this)
                  .attr("width", width)
                  .attr("height", height)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")") ;

              svg.append("g")
                  .attr("class", "x grid")
                  .attr("transform", "translate(0," + innerheight + ")")
                  .call(x_grid) ;

              svg.append("g")
                  .attr("class", "y grid")
                  .call(y_grid) ;

              svg.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + innerheight + ")")
                  .call(x_axis)
                  .append("text")
                  .attr("dy", "-.71em")
                  .attr("x", innerwidth)
                  .style("text-anchor", "end")
                  .text(xlabel) ;

              svg.append("g")
                  .attr("class", "y axis")
                  .call(y_axis)
                  .append("text")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 6)
                  .attr("dy", "0.71em")
                  .style("text-anchor", "end")
                  .text(ylabel) ;

              var data_lines = svg.selectAll(".d3_xy_chart_line")
                  .data(datasets.map(function(d) {return d3.zip(d.x, d.y);}))
                  .enter().append("g")
                  .attr("class", "d3_xy_chart_line") ;

              data_lines.append("path")
                  .attr("class", "line")
                  .attr("d", function(d) {return draw_line(d); })
                  .attr("stroke", function(_, i) {return color_scale(i);}) ;

              data_lines.append("text")
                  .datum(function(d, i) { return {name: datasets[i].label, final: d[d.length-1]}; })
                  .attr("transform", function(d) {
                      return ( "translate(" + x_scale(d.final[0]) + "," +
                               y_scale(d.final[1]) + ")" ) ; })
                  .attr("x", 3)
                  .attr("dy", ".35em")
                  .attr("fill", function(_, i) { return color_scale(i); })
                  .text(function(d) { return d.name; }) ;

          }) ;
      }

      chart.width = function(value) {
          if (!arguments.length) return width;
          width = value;
          return chart;
      };

      chart.height = function(value) {
          if (!arguments.length) return height;
          height = value;
          return chart;
      };

      chart.xlabel = function(value) {
          if(!arguments.length) return xlabel ;
          xlabel = value ;
          return chart ;
      } ;

      chart.ylabel = function(value) {
          if(!arguments.length) return ylabel ;
          ylabel = value ;
          return chart ;
      } ;

      return chart;
  }
}

function toggleGraphs() {
  var panel = document.getElementById('colorMetrics');
  var toggle = document.getElementById('toggleMetrics');
  panel.classList.toggle('visible');
  toggle.classList.toggle('is-selected');
}

// Sort swatches in UI
function sort() {
  ratioInputs.sort(function(a, b){return a-b});

  // Update ratio inputs with new values
  for (i=0; i<ratioInputs.length; i++) {
    ratioFields[i].value = ratioInputs[i];
  }
}

function sortRatios() {
  sort();
  colorInput();
}

// Exponential curve for approximating perceptually balanced swatch distribution
function returnRatio(lum) {
  var a = 22.11002659220650;
  var b = -0.03236668196111;
  var r = a * Math.exp(b * lum);
  if (r > 1) {
    return r;
  }
  if (r < 1 && r >= 0) {
    return 1;
  }
}

// Redistribute contrast swatches
function distributeExp() {
  sort();
  var start = 1;
  var end = ratioInputs.length -1;
  var Lums = []
  for(i=0; i<newColors.length; i++) {
    Lums.push(d3.hsluv(newColors[i]).v);
  }

  var startLum = Math.min(...Lums);
  var endLum = Math.max(...Lums);
  var diff = (endLum - startLum) / (Lums.length - 1);

  for (i=1; i<Lums.length -1; i++) {
    Lums[i] = startLum + diff * i;

  }
  Lums.sort(function(a, b){return b-a});

  for(i=1; i<Lums.length -1; i++) {
    ratioFields[i].value = returnRatio(Lums[i]).toFixed(2);
  }

  colorInput();
}
