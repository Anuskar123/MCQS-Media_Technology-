const fs = require('fs');

const d = {
  "LZW": "🧠 Think 'Lazy Writer' (LZW). A dynamic dictionary compressor. It creates a dictionary rule on the fly for repeating fragments.",
  "Screen Tearing": "🧠 Imagine a printer still printing the top half, but the computer prints the bottom. Monitor display fell out of sync.",
  "Cyan": "🧠 Additive Light. Red(0) + Green(255) + Blue(255). Full Green and full Blue light together make Cyan.",
  "Magenta": "🧠 Additive Light. Red(255) + Green(0) + Blue(255). Full Red and full Blue light together make Magenta.",
  "Yellow": "🧠 Additive Light. Red(255) + Green(255) + Blue(0). Pure Red light and pure Green light combine to form Yellow.",
  "White": "🧠 Additive Light. Red(255) + Green(255) + Blue(255). All 3 primary channels maxed out forms White light.",
  "Black": "🧠 Additive Light. Red(0) + Green(0) + Blue(0). Zero light emission creates Black.",
  "Smoothing Filter": "🧠 A bulldozer flattening a dirt road. It averages out bumps. Averaging 9 identical clones mathematically yields the exact same pixel value back!",
  "Sharpening Kernel": "🧠 A strong positive weight in the center and negative weights on the edges. This creates forced localized contrast.",
  "Edge Replication": "🧠 Copies the inner border pixels directly outwards, building an artificial safety bridge.",
  "Zero Padding": "🧠 Wraps the entire image in a massive, thick frame of pure 0 border pixels.",
  "Image Slicing": "🧠 Python Numpy slicing array[start:end] crops out a specific segment from a massive 2D resolution grid.",
  "Generation Loss": "🧠 Photocopying a photocopy. Every time you re-save a Lossy file like a JPEG, the physical damage permanently compounds.",
  "Histogram Equalization": "🧠 Forcefully statistically spreads out crammed pixels. Mathematically stretches a low-contrast histogram.",
  "Histogram": "🧠 A census report for pixels! The X-axis maps brightness, and the Y-axis counts exact pixels.",
  "Affine Transformation": "🧠 Affine perfectly ensures parallel lines remain parallel.",
  "Scaling": "🧠 Pure geometric resizing. Multiplies the X and Y coordinate mapping.",
  "Non-Commutative": "🧠 Matrix Multiplication is not reversible. Rotating then Translating is absolutely different than Translating then Rotating.",
  "Lossless": "🧠 Algorithms that perfectly preserve 100% of the raw data.",
  "Lossy": "🧠 Permanently obliviates high-frequency data your human eye can barely perceive. Gone forever.",
  "Run-Length": "🧠 Why write 'AAAAAABBB'? RLE notices the repetition and writes '6A3B' instead.",
  "Raster Scan": "🧠 The electron gun physically sweeps and paints the hardware screen row-by-row, top to bottom.",
  "Indentation": "🧠 Mandatory structural spacing explicitly dictating which code belongs inside specific loops.",
  "Cones": "🧠 Cones = Color. Retina receptors responsible for perceiving high-resolution color.",
  "Rods": "🧠 Rods = Resolve dark. Retina receptors sensitive to dim environments, but incapable of processing colors.",
  "Saturation": "🧠 The Purity or Vividness of a color entirely decoupled from brightness.",
  "Luminance": "🧠 Just objective physical brightness.",
  "Hue": "🧠 The color family determined by the dominant visual wavelength.",
  "Grayscale": "🧠 An 8-bit visual tunnel limiting reality to explicitly 256 unique shades (0-255).",
  "List": "🧠 Python's flexible sequence with brackets []. Allows infinite internal deletion and continuous insertions.",
  "Tuple": "🧠 Defined by parentheses (). Once forged, it is completely Immutable.",
  "Numpy": "🧠 Numerical Python. Secretly outsources heavy calculations back into the faster C language.",
  "Pixel": "🧠 Picture Element. The smallest fundamentally controllable geometric square atom of digital representation.",
  "Resolution": "🧠 Exact physical grid landscape. Width multiplied by vertical height.",
  "Frame Buffer": "🧠 The Waiting Room. VRAM temporarily stores pixel intensity states before broadcasting.",
  "Compression ratio": "🧠 Original Size divided by Compressed Size! Example: 100MB down to 10MB is a ratio of 10.",
  "Translation Matrix": "🧠 Translation matrices just add the offset values linearly without changing size or angle. Just pure addition!"
};

let content = fs.readFileSync('questions.js', 'utf8');
let jsonStr = content.replace('const questionBank = ', '').replace(/;\s*$/, '');
// Sometimes the keys in questionBank are not fully quoted if it's not strict JSON. 
// However, the viewing of questions.js showed it is fairly well formatted JSON inside the object literal.
// Wait, looking closely at questions.js, "type" and "practice" are NOT quoted keys in the tca block.
// "tca: [ { type: "fillInTheBlank", q: ..." } ]"
// This means JSON.parse will fail!
