// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.

const fonts = ['Arial', 'Roboto', 'Open Sans', 'Inter', 'Montserrat', 'Helvetica', 'Calibri'];
for (const font of fonts) {
  loadFonts(font);
}

function loadFonts(font: string) {
  const fontStyles = ["Thin", "Light", "Regular", "Medium", "Bold", "Black", "Extra-Bold"];
  for (const style of fontStyles) {
    figma.loadFontAsync({ family: font, style: style })
      .then(() => {
        console.log(`"${font}""${style}" loaded successfully`);
      })
      .catch((err) => {
        console.log(`"${style}" is not available in the Roboto font family:`, err);
      });
  }
  console.log('loading finished!!');
}


figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'submit') {
    const nodes: SceneNode[] = [];
    const canvas = drawCanvas(nodes);

    const colorResponse = msg.colorResult;
    const typeResponse = msg.typeResult;
    const buttonResponse = msg.buttonResult;


    console.log("new")

    console.log("code.ts")
    console.log(colorResponse);
    console.log(typeResponse);
    console.log(buttonResponse);
    // const colors = {
    //   "primary": "#FF8800",
    //   "secondary": "#FFE6B3",
    //   "warning": "#E60073"
    // };
    // const styles = {
    //   "header 1": {
    //     "fontFamily": "Roboto",
    //     "fontSize": 48,
    //     "fontWeight": "Bold",
    //     "fontColor": "#212121"
    //   },
    //   "header 2": {
    //     "fontFamily": "Roboto",
    //     "fontSize": 36,
    //     "fontWeight": "Bold",
    //     "fontColor": "#212121"
    //   },
    //   "body": {
    //     "fontFamily": "Open Sans",
    //     "fontSize": 16,
    //     "fontWeight": "Regular",
    //     "fontColor": "#757575"
    //   }
    // }
    // const buttonsInfo = {
    //   "button 1": {
    //   "fontFamily": "Helvetica",
    //   "fontSize": 16,
    //   "fontWeight": "Bold",
    //   "borderWidth":1,
    //   "borderColor": "#CCCCCC",
    //   "cornerRadius": 4,
    //   "padding": 8,
    //   "color": "#FFFFFF",
    //   "fontColor": "#000000"
    //   },
    //   "button 2": {
    //   "fontFamily": "Helvetica",
    //   "fontSize": 16,
    //   "fontWeight": "Bold",
    //   "borderWidth":1,
    //   "borderColor": "#CCCCCC",
    //   "cornerRadius": 4,
    //   "padding": 8,
    //   "color": "#000000",
    //   "fontColor": "#FFFFFF"
    //   },
    //   "cancel": {
    //   "fontFamily": "Helvetica",
    //   "fontSize": 16,
    //   "fontWeight": "Regular",
    //   "borderWidth":1,
    //   "borderColor": "#CCCCCC",
    //   "cornerRadius": 4,
    //   "padding": 8,
    //   "color": "#FFFFFF",
    //   "fontColor": "#000000"
    //   }
    //   }
    const colors = JSON.parse(colorResponse);
    const types = JSON.parse(typeResponse);
    const buttons = JSON.parse(buttonResponse);

    Object.keys(buttons).forEach(key => {
      const button = buttons[key];
      figma.loadFontAsync({ family: button.fontFamily, style: button.fontWeight });
    });
    

    const palettes = drawPalettes(canvas, colors);
    nodes.push(...palettes);
    const typographies = drawTypography(canvas, types);
    nodes.push(...typographies);
    const buttonsDisplay = drawButtons(canvas, buttons);
    nodes.push(...buttonsDisplay);

    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }
};
  
function drawCanvas(nodes: any[]) {
  const canvas = figma.createFrame();
  canvas.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  canvas.resize(600, 900);
  figma.currentPage.appendChild(canvas);
  nodes.push(canvas);
  return canvas;
}

function drawPalettes(parent: FrameNode, colors: any) {
  // console.log('startingdrawnig');
  // console.log(colors.length);
  const padding = 16;
  const paletteWidth = (parent.width - padding * (Object.keys(colors).length + 1)) / Object.keys(colors).length;
  const paletteHeight = 50;
  const palettes: RectangleNode[] = [];
  let count = 0;
  console.log('start drawing colors:' + colors);
  const startingY = padding;
  const titleName = 'Colors';
  createTitle(parent, titleName, startingY);

  Object.keys(colors).forEach(key => {
    const palette = figma.createRectangle();
    palette.name = key;
    const hexValue = colors[key];
    console.log(`Name: ${palette.name}, Hex Value: ${hexValue}`);
    palette.fills = [{ type: 'SOLID', color: hexToRgb(hexValue) }];
    palette.resize(paletteWidth, paletteHeight);
    palette.x = padding + count * (paletteWidth + padding);
    palette.y = padding + startingY + 60;
    parent.appendChild(palette);
    const label = figma.createText();
    label.name = 'Label';
    label.characters = key.toUpperCase();
    label.fontSize = 14;
    label.x = palette.x;
    label.y = palette.y - 24;
    label.textAlignHorizontal = 'CENTER';
    label.resize(paletteWidth, 24);
    parent.appendChild(label);
    palettes.push(palette);
    count += 1;
  });
  return palettes;
}

function drawTypography(parent: FrameNode, styles: any) {
  const typographies: TextNode[] = [];
  let count = 0;
  const padding = 16;
  const lineHeight = 50;

  const startingY = 200;
  const titleName = 'Typography';
  createTitle(parent, titleName, startingY);

  Object.keys(styles).forEach(key => {
    const typography = figma.createText();
    typography.name = key;
    const style = styles[key];
    typography.x = padding;
    typography.y = padding + startingY + count + 60;
    typography.fills = [{ type: 'SOLID', color: hexToRgb(style.fontColor) }];
    figma.loadFontAsync({ family: style.fontFamily, style: style.fontWeight });
    typography.fontName = { family: style.fontFamily, style: style.fontWeight };
    typography.characters = `${key}: ${style.fontFamily} ${style.fontWeight} ${style.fontSize}`;
    typography.fontSize = style.fontSize;
    parent.appendChild(typography);
    typographies.push(typography);
    count = count + style.fontSize + padding;
  });
  return typographies;
}

function drawButtons(parent: FrameNode, buttonsInfo: any) {
  const buttonsList: TextNode[] = [];
  let count = 0;
  const padding = 16;
  const lineHeight = 50;
  
  const startingY = 500;
  const titleName = 'Buttons';
  createTitle(parent, titleName, startingY);

  Object.keys(buttonsInfo).forEach(key => {
    const button = buttonsInfo[key];
    console.log('this button is'+key);
    console.log(key);
    const buttonComponent = createButtonComponent(key, button);    
    buttonComponent.name = key;
    buttonComponent.x = padding + count;
    buttonComponent.y = padding + startingY + 60;
    parent.appendChild(buttonComponent);
    buttonsList.push();
    count = count + 120 + padding;
  });
  return buttonsList;
}

function createButtonComponent(key: string, button: any){
  // Create the button component
  const buttonComponent = figma.createComponent();

  // Set the size of the button component
  buttonComponent.resize(120, 40);

  // Create the button background rectangle
  const buttonBackground = figma.createRectangle();
  buttonBackground.name = "Button Background";
  buttonBackground.resize(120, 40);
  console.log('font color is'+ button.borderColor);
  buttonBackground.strokes = [{ type: "SOLID", color: hexToRgb(button.borderColor) }];
  buttonBackground.strokeWeight = button.borderWidth;
  buttonBackground.cornerRadius = button.cornerRadius;
  buttonBackground.fills = [{ type: "SOLID", color: hexToRgb(button.color) }];

  // Create the button text
  const buttonTextElement = figma.createText();
  buttonTextElement.name = key;
  buttonTextElement.characters = key;
  figma.loadFontAsync({ family: button.fontFamily, style: button.fontWeight });
  buttonTextElement.fontName = { family: button.fontFamily, style: button.fontWeight };
  buttonTextElement.fontSize = button.fontSize;
  console.log('font color is'+ button.fontColor);
  buttonTextElement.fills = [{ type: "SOLID", color: hexToRgb(button.fontColor) }];

  // Center the button text within the button background
  const textWidth = buttonTextElement.width;
  const textHeight = buttonTextElement.height;
  buttonTextElement.x = (buttonBackground.width - textWidth) / 2;
  buttonTextElement.y = (buttonBackground.height - textHeight) / 2;

  // Add the button background and button text to the button component
  buttonComponent.appendChild(buttonBackground);
  buttonComponent.appendChild(buttonTextElement);

  // Add the button component to the frameNode
  return buttonComponent;
}

function hexToRgb(hex: string) {
  const hexValue = hex.replace('#', '');
  const r = parseInt(hexValue.substring(0, 2), 16)/255;
  const g = parseInt(hexValue.substring(2, 4), 16)/255;
  const b = parseInt(hexValue.substring(4, 6), 16)/255;
  console.log(r, g, b);
  return { r, g, b };
}

function createTitle(parent: FrameNode, titleName: string, startingY: number) {
  const padding = 16;
  const title = figma.createText();
  title.x = padding;
  title.y = startingY;
  title.fontName = { family:'Calibri', style:'Regular' };
  title.characters = titleName;
  title.fontSize = 30;
  parent.appendChild(title);
}




