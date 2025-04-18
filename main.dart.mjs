
// Compiles a dart2wasm-generated main module from `source` which can then
// instantiatable via the `instantiate` method.
//
// `source` needs to be a `Response` object (or promise thereof) e.g. created
// via the `fetch()` JS API.
export async function compileStreaming(source) {
  const builtins = {builtins: ['js-string']};
  return new CompiledApp(
      await WebAssembly.compileStreaming(source, builtins), builtins);
}

// Compiles a dart2wasm-generated wasm modules from `bytes` which is then
// instantiatable via the `instantiate` method.
export async function compile(bytes) {
  const builtins = {builtins: ['js-string']};
  return new CompiledApp(await WebAssembly.compile(bytes, builtins), builtins);
}

// DEPRECATED: Please use `compile` or `compileStreaming` to get a compiled app,
// use `instantiate` method to get an instantiated app and then call
// `invokeMain` to invoke the main function.
export async function instantiate(modulePromise, importObjectPromise) {
  var moduleOrCompiledApp = await modulePromise;
  if (!(moduleOrCompiledApp instanceof CompiledApp)) {
    moduleOrCompiledApp = new CompiledApp(moduleOrCompiledApp);
  }
  const instantiatedApp = await moduleOrCompiledApp.instantiate(await importObjectPromise);
  return instantiatedApp.instantiatedModule;
}

// DEPRECATED: Please use `compile` or `compileStreaming` to get a compiled app,
// use `instantiate` method to get an instantiated app and then call
// `invokeMain` to invoke the main function.
export const invoke = (moduleInstance, ...args) => {
  moduleInstance.exports.$invokeMain(args);
}

class CompiledApp {
  constructor(module, builtins) {
    this.module = module;
    this.builtins = builtins;
  }

  // The second argument is an options object containing:
  // `loadDeferredWasm` is a JS function that takes a module name matching a
  //   wasm file produced by the dart2wasm compiler and returns the bytes to
  //   load the module. These bytes can be in either a format supported by
  //   `WebAssembly.compile` or `WebAssembly.compileStreaming`.
  async instantiate(additionalImports, {loadDeferredWasm} = {}) {
    let dartInstance;

    // Prints to the console
    function printToConsole(value) {
      if (typeof dartPrint == "function") {
        dartPrint(value);
        return;
      }
      if (typeof console == "object" && typeof console.log != "undefined") {
        console.log(value);
        return;
      }
      if (typeof print == "function") {
        print(value);
        return;
      }

      throw "Unable to print message: " + js;
    }

    // Converts a Dart List to a JS array. Any Dart objects will be converted, but
    // this will be cheap for JSValues.
    function arrayFromDartList(constructor, list) {
      const exports = dartInstance.exports;
      const read = exports.$listRead;
      const length = exports.$listLength(list);
      const array = new constructor(length);
      for (let i = 0; i < length; i++) {
        array[i] = read(list, i);
      }
      return array;
    }

    // A special symbol attached to functions that wrap Dart functions.
    const jsWrappedDartFunctionSymbol = Symbol("JSWrappedDartFunction");

    function finalizeWrapper(dartFunction, wrapped) {
      wrapped.dartFunction = dartFunction;
      wrapped[jsWrappedDartFunctionSymbol] = true;
      return wrapped;
    }

    // Imports
    const dart2wasm = {

      _1: (x0,x1,x2) => x0.set(x1,x2),
      _2: (x0,x1,x2) => x0.set(x1,x2),
      _6: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._6(f,arguments.length,x0) }),
      _7: x0 => new window.FinalizationRegistry(x0),
      _8: (x0,x1,x2,x3) => x0.register(x1,x2,x3),
      _9: (x0,x1) => x0.unregister(x1),
      _10: (x0,x1,x2) => x0.slice(x1,x2),
      _11: (x0,x1) => x0.decode(x1),
      _12: (x0,x1) => x0.segment(x1),
      _13: () => new TextDecoder(),
      _14: x0 => x0.buffer,
      _15: x0 => x0.wasmMemory,
      _16: () => globalThis.window._flutter_skwasmInstance,
      _17: x0 => x0.rasterStartMilliseconds,
      _18: x0 => x0.rasterEndMilliseconds,
      _19: x0 => x0.imageBitmaps,
      _192: x0 => x0.select(),
      _193: (x0,x1) => x0.append(x1),
      _194: x0 => x0.remove(),
      _197: x0 => x0.unlock(),
      _202: x0 => x0.getReader(),
      _211: x0 => new MutationObserver(x0),
      _222: (x0,x1,x2) => x0.addEventListener(x1,x2),
      _223: (x0,x1,x2) => x0.removeEventListener(x1,x2),
      _226: x0 => new ResizeObserver(x0),
      _229: (x0,x1) => new Intl.Segmenter(x0,x1),
      _230: x0 => x0.next(),
      _231: (x0,x1) => new Intl.v8BreakIterator(x0,x1),
      _308: x0 => x0.close(),
      _309: (x0,x1,x2,x3,x4) => ({type: x0,data: x1,premultiplyAlpha: x2,colorSpaceConversion: x3,preferAnimation: x4}),
      _310: x0 => new window.ImageDecoder(x0),
      _311: x0 => x0.close(),
      _312: x0 => ({frameIndex: x0}),
      _313: (x0,x1) => x0.decode(x1),
      _316: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._316(f,arguments.length,x0) }),
      _317: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._317(f,arguments.length,x0) }),
      _318: (x0,x1) => ({addView: x0,removeView: x1}),
      _319: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._319(f,arguments.length,x0) }),
      _320: f => finalizeWrapper(f, function() { return dartInstance.exports._320(f,arguments.length) }),
      _321: (x0,x1) => ({initializeEngine: x0,autoStart: x1}),
      _322: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._322(f,arguments.length,x0) }),
      _323: x0 => ({runApp: x0}),
      _324: x0 => new Uint8Array(x0),
      _326: x0 => x0.preventDefault(),
      _327: x0 => x0.stopPropagation(),
      _328: (x0,x1) => x0.addListener(x1),
      _329: (x0,x1) => x0.removeListener(x1),
      _330: (x0,x1) => x0.prepend(x1),
      _331: x0 => x0.remove(),
      _332: x0 => x0.disconnect(),
      _333: (x0,x1) => x0.addListener(x1),
      _334: (x0,x1) => x0.removeListener(x1),
      _335: x0 => x0.blur(),
      _336: (x0,x1) => x0.append(x1),
      _337: x0 => x0.remove(),
      _338: x0 => x0.stopPropagation(),
      _342: x0 => x0.preventDefault(),
      _343: (x0,x1) => x0.append(x1),
      _344: x0 => x0.remove(),
      _345: x0 => x0.preventDefault(),
      _350: (x0,x1) => x0.removeChild(x1),
      _351: (x0,x1) => x0.appendChild(x1),
      _352: (x0,x1,x2) => x0.insertBefore(x1,x2),
      _353: (x0,x1) => x0.appendChild(x1),
      _354: (x0,x1) => x0.transferFromImageBitmap(x1),
      _356: (x0,x1) => x0.append(x1),
      _357: (x0,x1) => x0.append(x1),
      _358: (x0,x1) => x0.append(x1),
      _359: x0 => x0.remove(),
      _360: x0 => x0.remove(),
      _361: x0 => x0.remove(),
      _362: (x0,x1) => x0.appendChild(x1),
      _363: (x0,x1) => x0.appendChild(x1),
      _364: x0 => x0.remove(),
      _365: (x0,x1) => x0.append(x1),
      _366: (x0,x1) => x0.append(x1),
      _367: x0 => x0.remove(),
      _368: (x0,x1) => x0.append(x1),
      _369: (x0,x1) => x0.append(x1),
      _370: (x0,x1,x2) => x0.insertBefore(x1,x2),
      _371: (x0,x1) => x0.append(x1),
      _372: (x0,x1,x2) => x0.insertBefore(x1,x2),
      _373: x0 => x0.remove(),
      _374: (x0,x1) => x0.append(x1),
      _375: x0 => x0.remove(),
      _376: (x0,x1) => x0.append(x1),
      _377: x0 => x0.remove(),
      _378: x0 => x0.remove(),
      _379: x0 => x0.getBoundingClientRect(),
      _380: x0 => x0.remove(),
      _393: (x0,x1) => x0.append(x1),
      _394: x0 => x0.remove(),
      _395: (x0,x1) => x0.append(x1),
      _396: (x0,x1,x2) => x0.insertBefore(x1,x2),
      _397: x0 => x0.preventDefault(),
      _398: x0 => x0.preventDefault(),
      _399: x0 => x0.preventDefault(),
      _400: x0 => x0.preventDefault(),
      _401: (x0,x1) => x0.observe(x1),
      _402: x0 => x0.disconnect(),
      _403: (x0,x1) => x0.appendChild(x1),
      _404: (x0,x1) => x0.appendChild(x1),
      _405: (x0,x1) => x0.appendChild(x1),
      _406: (x0,x1) => x0.append(x1),
      _407: x0 => x0.remove(),
      _408: (x0,x1) => x0.append(x1),
      _410: (x0,x1) => x0.appendChild(x1),
      _411: (x0,x1) => x0.append(x1),
      _412: x0 => x0.remove(),
      _413: (x0,x1) => x0.append(x1),
      _414: x0 => x0.remove(),
      _418: (x0,x1) => x0.appendChild(x1),
      _419: x0 => x0.remove(),
      _978: () => globalThis.window.flutterConfiguration,
      _979: x0 => x0.assetBase,
      _984: x0 => x0.debugShowSemanticsNodes,
      _985: x0 => x0.hostElement,
      _986: x0 => x0.multiViewEnabled,
      _987: x0 => x0.nonce,
      _989: x0 => x0.fontFallbackBaseUrl,
      _995: x0 => x0.console,
      _996: x0 => x0.devicePixelRatio,
      _997: x0 => x0.document,
      _998: x0 => x0.history,
      _999: x0 => x0.innerHeight,
      _1000: x0 => x0.innerWidth,
      _1001: x0 => x0.location,
      _1002: x0 => x0.navigator,
      _1003: x0 => x0.visualViewport,
      _1004: x0 => x0.performance,
      _1007: (x0,x1) => x0.dispatchEvent(x1),
      _1008: (x0,x1) => x0.matchMedia(x1),
      _1010: (x0,x1) => x0.getComputedStyle(x1),
      _1011: x0 => x0.screen,
      _1012: (x0,x1) => x0.requestAnimationFrame(x1),
      _1013: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1013(f,arguments.length,x0) }),
      _1018: (x0,x1) => x0.warn(x1),
      _1021: () => globalThis.window,
      _1022: () => globalThis.Intl,
      _1023: () => globalThis.Symbol,
      _1026: x0 => x0.clipboard,
      _1027: x0 => x0.maxTouchPoints,
      _1028: x0 => x0.vendor,
      _1029: x0 => x0.language,
      _1030: x0 => x0.platform,
      _1031: x0 => x0.userAgent,
      _1032: x0 => x0.languages,
      _1033: x0 => x0.documentElement,
      _1034: (x0,x1) => x0.querySelector(x1),
      _1038: (x0,x1) => x0.createElement(x1),
      _1039: (x0,x1) => x0.execCommand(x1),
      _1042: (x0,x1) => x0.createTextNode(x1),
      _1043: (x0,x1) => x0.createEvent(x1),
      _1047: x0 => x0.head,
      _1048: x0 => x0.body,
      _1049: (x0,x1) => x0.title = x1,
      _1052: x0 => x0.activeElement,
      _1054: x0 => x0.visibilityState,
      _1056: x0 => x0.hasFocus(),
      _1057: () => globalThis.document,
      _1058: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
      _1059: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
      _1062: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1062(f,arguments.length,x0) }),
      _1063: x0 => x0.target,
      _1065: x0 => x0.timeStamp,
      _1066: x0 => x0.type,
      _1068: x0 => x0.preventDefault(),
      _1070: (x0,x1,x2,x3) => x0.initEvent(x1,x2,x3),
      _1077: x0 => x0.firstChild,
      _1082: x0 => x0.parentElement,
      _1084: x0 => x0.parentNode,
      _1088: (x0,x1) => x0.removeChild(x1),
      _1089: (x0,x1) => x0.removeChild(x1),
      _1090: x0 => x0.isConnected,
      _1091: (x0,x1) => x0.textContent = x1,
      _1095: (x0,x1) => x0.contains(x1),
      _1101: x0 => x0.firstElementChild,
      _1103: x0 => x0.nextElementSibling,
      _1104: x0 => x0.clientHeight,
      _1105: x0 => x0.clientWidth,
      _1106: x0 => x0.offsetHeight,
      _1107: x0 => x0.offsetWidth,
      _1108: x0 => x0.id,
      _1109: (x0,x1) => x0.id = x1,
      _1112: (x0,x1) => x0.spellcheck = x1,
      _1113: x0 => x0.tagName,
      _1114: x0 => x0.style,
      _1115: (x0,x1) => x0.append(x1),
      _1117: (x0,x1) => x0.getAttribute(x1),
      _1118: x0 => x0.getBoundingClientRect(),
      _1121: (x0,x1) => x0.closest(x1),
      _1124: (x0,x1) => x0.querySelectorAll(x1),
      _1126: x0 => x0.remove(),
      _1127: (x0,x1,x2) => x0.setAttribute(x1,x2),
      _1128: (x0,x1) => x0.removeAttribute(x1),
      _1129: (x0,x1) => x0.tabIndex = x1,
      _1132: (x0,x1) => x0.focus(x1),
      _1133: x0 => x0.scrollTop,
      _1134: (x0,x1) => x0.scrollTop = x1,
      _1135: x0 => x0.scrollLeft,
      _1136: (x0,x1) => x0.scrollLeft = x1,
      _1137: x0 => x0.classList,
      _1138: (x0,x1) => x0.className = x1,
      _1144: (x0,x1) => x0.getElementsByClassName(x1),
      _1146: x0 => x0.click(),
      _1147: (x0,x1) => x0.hasAttribute(x1),
      _1150: (x0,x1) => x0.attachShadow(x1),
      _1155: (x0,x1) => x0.getPropertyValue(x1),
      _1157: (x0,x1,x2,x3) => x0.setProperty(x1,x2,x3),
      _1159: (x0,x1) => x0.removeProperty(x1),
      _1161: x0 => x0.offsetLeft,
      _1162: x0 => x0.offsetTop,
      _1163: x0 => x0.offsetParent,
      _1165: (x0,x1) => x0.name = x1,
      _1166: x0 => x0.content,
      _1167: (x0,x1) => x0.content = x1,
      _1185: (x0,x1) => x0.nonce = x1,
      _1191: x0 => x0.now(),
      _1193: (x0,x1) => x0.width = x1,
      _1195: (x0,x1) => x0.height = x1,
      _1199: (x0,x1) => x0.getContext(x1),
      _1275: (x0,x1) => x0.fetch(x1),
      _1276: x0 => x0.status,
      _1278: x0 => x0.body,
      _1279: x0 => x0.arrayBuffer(),
      _1285: x0 => x0.read(),
      _1286: x0 => x0.value,
      _1287: x0 => x0.done,
      _1289: x0 => x0.name,
      _1290: x0 => x0.x,
      _1291: x0 => x0.y,
      _1294: x0 => x0.top,
      _1295: x0 => x0.right,
      _1296: x0 => x0.bottom,
      _1297: x0 => x0.left,
      _1306: x0 => x0.height,
      _1307: x0 => x0.width,
      _1308: (x0,x1) => x0.value = x1,
      _1310: (x0,x1) => x0.placeholder = x1,
      _1311: (x0,x1) => x0.name = x1,
      _1312: x0 => x0.selectionDirection,
      _1313: x0 => x0.selectionStart,
      _1314: x0 => x0.selectionEnd,
      _1317: x0 => x0.value,
      _1319: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
      _1322: x0 => x0.readText(),
      _1323: (x0,x1) => x0.writeText(x1),
      _1324: x0 => x0.altKey,
      _1325: x0 => x0.code,
      _1326: x0 => x0.ctrlKey,
      _1327: x0 => x0.key,
      _1328: x0 => x0.keyCode,
      _1329: x0 => x0.location,
      _1330: x0 => x0.metaKey,
      _1331: x0 => x0.repeat,
      _1332: x0 => x0.shiftKey,
      _1333: x0 => x0.isComposing,
      _1334: (x0,x1) => x0.getModifierState(x1),
      _1336: x0 => x0.state,
      _1337: (x0,x1) => x0.go(x1),
      _1339: (x0,x1,x2,x3) => x0.pushState(x1,x2,x3),
      _1341: (x0,x1,x2,x3) => x0.replaceState(x1,x2,x3),
      _1342: x0 => x0.pathname,
      _1343: x0 => x0.search,
      _1344: x0 => x0.hash,
      _1348: x0 => x0.state,
      _1356: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1356(f,arguments.length,x0,x1) }),
      _1358: (x0,x1,x2) => x0.observe(x1,x2),
      _1361: x0 => x0.attributeName,
      _1362: x0 => x0.type,
      _1363: x0 => x0.matches,
      _1366: x0 => x0.matches,
      _1368: x0 => x0.relatedTarget,
      _1369: x0 => x0.clientX,
      _1370: x0 => x0.clientY,
      _1371: x0 => x0.offsetX,
      _1372: x0 => x0.offsetY,
      _1375: x0 => x0.button,
      _1376: x0 => x0.buttons,
      _1377: x0 => x0.ctrlKey,
      _1378: (x0,x1) => x0.getModifierState(x1),
      _1381: x0 => x0.pointerId,
      _1382: x0 => x0.pointerType,
      _1383: x0 => x0.pressure,
      _1384: x0 => x0.tiltX,
      _1385: x0 => x0.tiltY,
      _1386: x0 => x0.getCoalescedEvents(),
      _1388: x0 => x0.deltaX,
      _1389: x0 => x0.deltaY,
      _1390: x0 => x0.wheelDeltaX,
      _1391: x0 => x0.wheelDeltaY,
      _1392: x0 => x0.deltaMode,
      _1398: x0 => x0.changedTouches,
      _1400: x0 => x0.clientX,
      _1401: x0 => x0.clientY,
      _1403: x0 => x0.data,
      _1406: (x0,x1) => x0.disabled = x1,
      _1407: (x0,x1) => x0.type = x1,
      _1408: (x0,x1) => x0.max = x1,
      _1409: (x0,x1) => x0.min = x1,
      _1410: (x0,x1) => x0.value = x1,
      _1411: x0 => x0.value,
      _1412: x0 => x0.disabled,
      _1413: (x0,x1) => x0.disabled = x1,
      _1414: (x0,x1) => x0.placeholder = x1,
      _1415: (x0,x1) => x0.name = x1,
      _1416: (x0,x1) => x0.autocomplete = x1,
      _1417: x0 => x0.selectionDirection,
      _1418: x0 => x0.selectionStart,
      _1419: x0 => x0.selectionEnd,
      _1423: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
      _1428: (x0,x1) => x0.add(x1),
      _1432: (x0,x1) => x0.noValidate = x1,
      _1433: (x0,x1) => x0.method = x1,
      _1434: (x0,x1) => x0.action = x1,
      _1459: x0 => x0.orientation,
      _1460: x0 => x0.width,
      _1461: x0 => x0.height,
      _1462: (x0,x1) => x0.lock(x1),
      _1478: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1478(f,arguments.length,x0,x1) }),
      _1489: x0 => x0.length,
      _1491: (x0,x1) => x0.item(x1),
      _1492: x0 => x0.length,
      _1493: (x0,x1) => x0.item(x1),
      _1494: x0 => x0.iterator,
      _1495: x0 => x0.Segmenter,
      _1496: x0 => x0.v8BreakIterator,
      _1499: x0 => x0.done,
      _1500: x0 => x0.value,
      _1501: x0 => x0.index,
      _1505: (x0,x1) => x0.adoptText(x1),
      _1506: x0 => x0.first(),
      _1507: x0 => x0.next(),
      _1508: x0 => x0.current(),
      _1522: x0 => x0.hostElement,
      _1523: x0 => x0.viewConstraints,
      _1525: x0 => x0.maxHeight,
      _1526: x0 => x0.maxWidth,
      _1527: x0 => x0.minHeight,
      _1528: x0 => x0.minWidth,
      _1529: x0 => x0.loader,
      _1530: () => globalThis._flutter,
      _1531: (x0,x1) => x0.didCreateEngineInitializer(x1),
      _1532: (x0,x1,x2) => x0.call(x1,x2),
      _1533: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1533(f,arguments.length,x0,x1) }),
      _1534: x0 => new Promise(x0),
      _1537: x0 => x0.length,
      _1540: x0 => x0.tracks,
      _1544: x0 => x0.image,
      _1551: x0 => x0.displayWidth,
      _1552: x0 => x0.displayHeight,
      _1553: x0 => x0.duration,
      _1556: x0 => x0.ready,
      _1557: x0 => x0.selectedTrack,
      _1558: x0 => x0.repetitionCount,
      _1559: x0 => x0.frameCount,
      _1625: (x0,x1) => globalThis.firebase_database.ref(x0,x1),
      _1627: (x0,x1) => globalThis.firebase_database.child(x0,x1),
      _1629: (x0,x1) => globalThis.firebase_database.push(x0,x1),
      _1631: (x0,x1) => globalThis.firebase_database.set(x0,x1),
      _1632: (x0,x1) => globalThis.firebase_database.update(x0,x1),
      _1638: x0 => globalThis.firebase_database.get(x0),
      _1653: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1653(f,arguments.length,x0,x1) }),
      _1654: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1654(f,arguments.length,x0) }),
      _1655: (x0,x1,x2) => globalThis.firebase_database.onChildAdded(x0,x1,x2),
      _1656: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1656(f,arguments.length,x0,x1) }),
      _1657: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1657(f,arguments.length,x0) }),
      _1658: (x0,x1,x2) => globalThis.firebase_database.onValue(x0,x1,x2),
      _1659: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1659(f,arguments.length,x0,x1) }),
      _1660: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1660(f,arguments.length,x0) }),
      _1661: (x0,x1,x2) => globalThis.firebase_database.onChildRemoved(x0,x1,x2),
      _1662: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1662(f,arguments.length,x0,x1) }),
      _1663: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1663(f,arguments.length,x0) }),
      _1664: (x0,x1,x2) => globalThis.firebase_database.onChildChanged(x0,x1,x2),
      _1665: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1665(f,arguments.length,x0,x1) }),
      _1666: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1666(f,arguments.length,x0) }),
      _1667: (x0,x1,x2) => globalThis.firebase_database.onChildMoved(x0,x1,x2),
      _1668: x0 => x0.call(),
      _1687: x0 => x0.toJSON(),
      _1696: x0 => x0.val(),
      _1697: x0 => x0.toJSON(),
      _1706: (x0,x1) => globalThis.firebase_database.getDatabase(x0,x1),
      _1728: x0 => x0.toJSON(),
      _1729: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1729(f,arguments.length,x0) }),
      _1730: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1730(f,arguments.length,x0) }),
      _1731: (x0,x1,x2) => x0.onAuthStateChanged(x1,x2),
      _1732: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1732(f,arguments.length,x0) }),
      _1733: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1733(f,arguments.length,x0) }),
      _1734: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1734(f,arguments.length,x0) }),
      _1735: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1735(f,arguments.length,x0) }),
      _1736: (x0,x1,x2) => x0.onIdTokenChanged(x1,x2),
      _1748: x0 => globalThis.firebase_auth.signInAnonymously(x0),
      _1756: (x0,x1) => globalThis.firebase_auth.connectAuthEmulator(x0,x1),
      _1778: x0 => globalThis.firebase_auth.OAuthProvider.credentialFromResult(x0),
      _1793: x0 => globalThis.firebase_auth.getAdditionalUserInfo(x0),
      _1794: (x0,x1,x2) => ({errorMap: x0,persistence: x1,popupRedirectResolver: x2}),
      _1795: (x0,x1) => globalThis.firebase_auth.initializeAuth(x0,x1),
      _1811: x0 => globalThis.firebase_auth.OAuthProvider.credentialFromError(x0),
      _1833: () => globalThis.firebase_auth.debugErrorMap,
      _1837: () => globalThis.firebase_auth.browserSessionPersistence,
      _1839: () => globalThis.firebase_auth.browserLocalPersistence,
      _1841: () => globalThis.firebase_auth.indexedDBLocalPersistence,
      _1876: x0 => globalThis.firebase_auth.multiFactor(x0),
      _1877: (x0,x1) => globalThis.firebase_auth.getMultiFactorResolver(x0,x1),
      _1879: x0 => x0.currentUser,
      _1894: x0 => x0.displayName,
      _1895: x0 => x0.email,
      _1896: x0 => x0.phoneNumber,
      _1897: x0 => x0.photoURL,
      _1898: x0 => x0.providerId,
      _1899: x0 => x0.uid,
      _1900: x0 => x0.emailVerified,
      _1901: x0 => x0.isAnonymous,
      _1902: x0 => x0.providerData,
      _1903: x0 => x0.refreshToken,
      _1904: x0 => x0.tenantId,
      _1905: x0 => x0.metadata,
      _1910: x0 => x0.providerId,
      _1911: x0 => x0.signInMethod,
      _1912: x0 => x0.accessToken,
      _1913: x0 => x0.idToken,
      _1914: x0 => x0.secret,
      _1941: x0 => x0.creationTime,
      _1942: x0 => x0.lastSignInTime,
      _1947: x0 => x0.code,
      _1949: x0 => x0.message,
      _1961: x0 => x0.email,
      _1962: x0 => x0.phoneNumber,
      _1963: x0 => x0.tenantId,
      _1986: x0 => x0.user,
      _1989: x0 => x0.providerId,
      _1990: x0 => x0.profile,
      _1991: x0 => x0.username,
      _1992: x0 => x0.isNewUser,
      _1995: () => globalThis.firebase_auth.browserPopupRedirectResolver,
      _2001: x0 => x0.displayName,
      _2002: x0 => x0.enrollmentTime,
      _2003: x0 => x0.factorId,
      _2004: x0 => x0.uid,
      _2006: x0 => x0.hints,
      _2007: x0 => x0.session,
      _2009: x0 => x0.phoneNumber,
      _2021: (x0,x1) => x0.getItem(x1),
      _2028: (x0,x1) => x0.createElement(x1),
      _2034: (x0,x1) => x0.getItem(x1),
      _2036: (x0,x1,x2) => x0.setItem(x1,x2),
      _2041: (x0,x1,x2,x3,x4,x5,x6,x7) => ({apiKey: x0,authDomain: x1,databaseURL: x2,projectId: x3,storageBucket: x4,messagingSenderId: x5,measurementId: x6,appId: x7}),
      _2042: (x0,x1) => globalThis.firebase_core.initializeApp(x0,x1),
      _2043: x0 => globalThis.firebase_core.getApp(x0),
      _2044: () => globalThis.firebase_core.getApp(),
      _2049: x0 => x0.key,
      _2050: x0 => x0.priority,
      _2115: x0 => x0.ref,
      _2121: x0 => x0.key,
      _2125: () => globalThis.firebase_core.SDK_VERSION,
      _2132: x0 => x0.apiKey,
      _2134: x0 => x0.authDomain,
      _2136: x0 => x0.databaseURL,
      _2138: x0 => x0.projectId,
      _2140: x0 => x0.storageBucket,
      _2142: x0 => x0.messagingSenderId,
      _2144: x0 => x0.measurementId,
      _2146: x0 => x0.appId,
      _2148: x0 => x0.name,
      _2149: x0 => x0.options,
      _2150: (x0,x1) => x0.debug(x1),
      _2151: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2151(f,arguments.length,x0) }),
      _2152: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._2152(f,arguments.length,x0,x1) }),
      _2153: (x0,x1) => ({createScript: x0,createScriptURL: x1}),
      _2154: (x0,x1,x2) => x0.createPolicy(x1,x2),
      _2155: (x0,x1) => x0.createScriptURL(x1),
      _2156: (x0,x1,x2) => x0.createScript(x1,x2),
      _2157: (x0,x1) => x0.appendChild(x1),
      _2158: (x0,x1) => x0.appendChild(x1),
      _2159: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2159(f,arguments.length,x0) }),
      _2172: x0 => new Array(x0),
      _2174: x0 => x0.length,
      _2176: (x0,x1) => x0[x1],
      _2177: (x0,x1,x2) => x0[x1] = x2,
      _2180: (x0,x1,x2) => new DataView(x0,x1,x2),
      _2182: x0 => new Int8Array(x0),
      _2183: (x0,x1,x2) => new Uint8Array(x0,x1,x2),
      _2184: x0 => new Uint8Array(x0),
      _2190: x0 => new Uint16Array(x0),
      _2192: x0 => new Int32Array(x0),
      _2194: x0 => new Uint32Array(x0),
      _2196: x0 => new Float32Array(x0),
      _2198: x0 => new Float64Array(x0),
      _2204: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2204(f,arguments.length,x0) }),
      _2205: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2205(f,arguments.length,x0) }),
      _2230: (decoder, codeUnits) => decoder.decode(codeUnits),
      _2231: () => new TextDecoder("utf-8", {fatal: true}),
      _2232: () => new TextDecoder("utf-8", {fatal: false}),
      _2233: x0 => new WeakRef(x0),
      _2234: x0 => x0.deref(),
      _2240: Date.now,
      _2242: s => new Date(s * 1000).getTimezoneOffset() * 60,
      _2243: s => {
        if (!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(s)) {
          return NaN;
        }
        return parseFloat(s);
      },
      _2244: () => {
        let stackString = new Error().stack.toString();
        let frames = stackString.split('\n');
        let drop = 2;
        if (frames[0] === 'Error') {
            drop += 1;
        }
        return frames.slice(drop).join('\n');
      },
      _2245: () => typeof dartUseDateNowForTicks !== "undefined",
      _2246: () => 1000 * performance.now(),
      _2247: () => Date.now(),
      _2250: () => new WeakMap(),
      _2251: (map, o) => map.get(o),
      _2252: (map, o, v) => map.set(o, v),
      _2253: () => globalThis.WeakRef,
      _2264: s => JSON.stringify(s),
      _2265: s => printToConsole(s),
      _2266: a => a.join(''),
      _2267: (o, a, b) => o.replace(a, b),
      _2269: (s, t) => s.split(t),
      _2270: s => s.toLowerCase(),
      _2271: s => s.toUpperCase(),
      _2272: s => s.trim(),
      _2273: s => s.trimLeft(),
      _2274: s => s.trimRight(),
      _2276: (s, p, i) => s.indexOf(p, i),
      _2277: (s, p, i) => s.lastIndexOf(p, i),
      _2278: (s) => s.replace(/\$/g, "$$$$"),
      _2279: Object.is,
      _2280: s => s.toUpperCase(),
      _2281: s => s.toLowerCase(),
      _2282: (a, i) => a.push(i),
      _2286: a => a.pop(),
      _2287: (a, i) => a.splice(i, 1),
      _2289: (a, s) => a.join(s),
      _2290: (a, s, e) => a.slice(s, e),
      _2293: a => a.length,
      _2295: (a, i) => a[i],
      _2296: (a, i, v) => a[i] = v,
      _2298: (o, offsetInBytes, lengthInBytes) => {
        var dst = new ArrayBuffer(lengthInBytes);
        new Uint8Array(dst).set(new Uint8Array(o, offsetInBytes, lengthInBytes));
        return new DataView(dst);
      },
      _2299: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
      _2300: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
      _2301: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
      _2302: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
      _2303: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
      _2304: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
      _2305: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
      _2307: (o, start, length) => new BigInt64Array(o.buffer, o.byteOffset + start, length),
      _2308: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
      _2309: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
      _2310: (t, s) => t.set(s),
      _2312: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
      _2314: o => o.buffer,
      _2315: o => o.byteOffset,
      _2316: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
      _2317: (b, o) => new DataView(b, o),
      _2318: (b, o, l) => new DataView(b, o, l),
      _2319: Function.prototype.call.bind(DataView.prototype.getUint8),
      _2320: Function.prototype.call.bind(DataView.prototype.setUint8),
      _2321: Function.prototype.call.bind(DataView.prototype.getInt8),
      _2322: Function.prototype.call.bind(DataView.prototype.setInt8),
      _2323: Function.prototype.call.bind(DataView.prototype.getUint16),
      _2324: Function.prototype.call.bind(DataView.prototype.setUint16),
      _2325: Function.prototype.call.bind(DataView.prototype.getInt16),
      _2326: Function.prototype.call.bind(DataView.prototype.setInt16),
      _2327: Function.prototype.call.bind(DataView.prototype.getUint32),
      _2328: Function.prototype.call.bind(DataView.prototype.setUint32),
      _2329: Function.prototype.call.bind(DataView.prototype.getInt32),
      _2330: Function.prototype.call.bind(DataView.prototype.setInt32),
      _2333: Function.prototype.call.bind(DataView.prototype.getBigInt64),
      _2334: Function.prototype.call.bind(DataView.prototype.setBigInt64),
      _2335: Function.prototype.call.bind(DataView.prototype.getFloat32),
      _2336: Function.prototype.call.bind(DataView.prototype.setFloat32),
      _2337: Function.prototype.call.bind(DataView.prototype.getFloat64),
      _2338: Function.prototype.call.bind(DataView.prototype.setFloat64),
      _2351: (o, t) => o instanceof t,
      _2353: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2353(f,arguments.length,x0) }),
      _2354: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2354(f,arguments.length,x0) }),
      _2355: o => Object.keys(o),
      _2356: (ms, c) =>
      setTimeout(() => dartInstance.exports.$invokeCallback(c),ms),
      _2357: (handle) => clearTimeout(handle),
      _2358: (ms, c) =>
      setInterval(() => dartInstance.exports.$invokeCallback(c), ms),
      _2359: (handle) => clearInterval(handle),
      _2360: (c) =>
      queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
      _2361: () => Date.now(),
      _2390: (x0,x1) => x0.key(x1),
      _2391: x0 => x0.trustedTypes,
      _2393: (x0,x1) => x0.text = x1,
      _2409: (s, m) => {
        try {
          return new RegExp(s, m);
        } catch (e) {
          return String(e);
        }
      },
      _2410: (x0,x1) => x0.exec(x1),
      _2411: (x0,x1) => x0.test(x1),
      _2412: (x0,x1) => x0.exec(x1),
      _2413: (x0,x1) => x0.exec(x1),
      _2414: x0 => x0.pop(),
      _2416: o => o === undefined,
      _2435: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
      _2437: o => {
        const proto = Object.getPrototypeOf(o);
        return proto === Object.prototype || proto === null;
      },
      _2438: o => o instanceof RegExp,
      _2439: (l, r) => l === r,
      _2440: o => o,
      _2441: o => o,
      _2442: o => o,
      _2443: b => !!b,
      _2444: o => o.length,
      _2447: (o, i) => o[i],
      _2448: f => f.dartFunction,
      _2449: l => arrayFromDartList(Int8Array, l),
      _2450: l => arrayFromDartList(Uint8Array, l),
      _2451: l => arrayFromDartList(Uint8ClampedArray, l),
      _2452: l => arrayFromDartList(Int16Array, l),
      _2453: l => arrayFromDartList(Uint16Array, l),
      _2454: l => arrayFromDartList(Int32Array, l),
      _2455: l => arrayFromDartList(Uint32Array, l),
      _2456: l => arrayFromDartList(Float32Array, l),
      _2457: l => arrayFromDartList(Float64Array, l),
      _2458: x0 => new ArrayBuffer(x0),
      _2459: (data, length) => {
        const getValue = dartInstance.exports.$byteDataGetUint8;
        const view = new DataView(new ArrayBuffer(length));
        for (let i = 0; i < length; i++) {
          view.setUint8(i, getValue(data, i));
        }
        return view;
      },
      _2460: l => arrayFromDartList(Array, l),
      _2461: () => ({}),
      _2462: () => [],
      _2463: l => new Array(l),
      _2464: () => globalThis,
      _2465: (constructor, args) => {
        const factoryFunction = constructor.bind.apply(
            constructor, [null, ...args]);
        return new factoryFunction();
      },
      _2466: (o, p) => p in o,
      _2467: (o, p) => o[p],
      _2468: (o, p, v) => o[p] = v,
      _2469: (o, m, a) => o[m].apply(o, a),
      _2471: o => String(o),
      _2472: (p, s, f) => p.then(s, f),
      _2473: o => {
        if (o === undefined) return 1;
        var type = typeof o;
        if (type === 'boolean') return 2;
        if (type === 'number') return 3;
        if (type === 'string') return 4;
        if (o instanceof Array) return 5;
        if (ArrayBuffer.isView(o)) {
          if (o instanceof Int8Array) return 6;
          if (o instanceof Uint8Array) return 7;
          if (o instanceof Uint8ClampedArray) return 8;
          if (o instanceof Int16Array) return 9;
          if (o instanceof Uint16Array) return 10;
          if (o instanceof Int32Array) return 11;
          if (o instanceof Uint32Array) return 12;
          if (o instanceof Float32Array) return 13;
          if (o instanceof Float64Array) return 14;
          if (o instanceof DataView) return 15;
        }
        if (o instanceof ArrayBuffer) return 16;
        return 17;
      },
      _2474: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI8ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2475: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI8ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2476: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI16ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2477: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI16ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2478: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2479: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2480: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2481: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2482: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF64ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2483: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF64ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2484: s => {
        if (/[[\]{}()*+?.\\^$|]/.test(s)) {
            s = s.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&');
        }
        return s;
      },
      _2487: x0 => x0.index,
      _2490: (x0,x1) => x0.exec(x1),
      _2492: x0 => x0.flags,
      _2493: x0 => x0.multiline,
      _2494: x0 => x0.ignoreCase,
      _2495: x0 => x0.unicode,
      _2496: x0 => x0.dotAll,
      _2497: (x0,x1) => x0.lastIndex = x1,
      _2499: (o, p) => o[p],
      _2500: (o, p, v) => o[p] = v,
      _2501: (o, p) => delete o[p],
      _2502: x0 => x0.random(),
      _2503: x0 => x0.random(),
      _2507: () => globalThis.Math,
      _2509: Function.prototype.call.bind(Number.prototype.toString),
      _2510: (d, digits) => d.toFixed(digits),
      _3955: (x0,x1) => x0.type = x1,
      _3963: (x0,x1) => x0.crossOrigin = x1,
      _3965: (x0,x1) => x0.text = x1,
      _4440: () => globalThis.window,
      _4486: x0 => x0.location,
      _4767: x0 => x0.trustedTypes,
      _4768: x0 => x0.sessionStorage,
      _4769: x0 => x0.localStorage,
      _4784: x0 => x0.hostname,
      _5116: x0 => x0.length,
      _7222: () => globalThis.document,
      _7317: x0 => x0.head,
      _14171: () => globalThis.console,
      _14200: () => globalThis.window.flutterCanvasKit,
      _14201: () => globalThis.window._flutter_skwasmInstance,
      _14202: x0 => x0.name,
      _14203: x0 => x0.message,
      _14204: x0 => x0.code,
      _14206: x0 => x0.customData,

    };

    const baseImports = {
      dart2wasm: dart2wasm,


      Math: Math,
      Date: Date,
      Object: Object,
      Array: Array,
      Reflect: Reflect,
    };

    const jsStringPolyfill = {
      "charCodeAt": (s, i) => s.charCodeAt(i),
      "compare": (s1, s2) => {
        if (s1 < s2) return -1;
        if (s1 > s2) return 1;
        return 0;
      },
      "concat": (s1, s2) => s1 + s2,
      "equals": (s1, s2) => s1 === s2,
      "fromCharCode": (i) => String.fromCharCode(i),
      "length": (s) => s.length,
      "substring": (s, a, b) => s.substring(a, b),
      "fromCharCodeArray": (a, start, end) => {
        if (end <= start) return '';

        const read = dartInstance.exports.$wasmI16ArrayGet;
        let result = '';
        let index = start;
        const chunkLength = Math.min(end - index, 500);
        let array = new Array(chunkLength);
        while (index < end) {
          const newChunkLength = Math.min(end - index, 500);
          for (let i = 0; i < newChunkLength; i++) {
            array[i] = read(a, index++);
          }
          if (newChunkLength < chunkLength) {
            array = array.slice(0, newChunkLength);
          }
          result += String.fromCharCode(...array);
        }
        return result;
      },
    };

    const deferredLibraryHelper = {
      "loadModule": async (moduleName) => {
        if (!loadDeferredWasm) {
          throw "No implementation of loadDeferredWasm provided.";
        }
        const source = await Promise.resolve(loadDeferredWasm(moduleName));
        const module = await ((source instanceof Response)
            ? WebAssembly.compileStreaming(source, this.builtins)
            : WebAssembly.compile(source, this.builtins));
        return await WebAssembly.instantiate(module, {
          ...baseImports,
          ...additionalImports,
          "wasm:js-string": jsStringPolyfill,
          "module0": dartInstance.exports,
        });
      },
    };

    dartInstance = await WebAssembly.instantiate(this.module, {
      ...baseImports,
      ...additionalImports,
      "deferredLibraryHelper": deferredLibraryHelper,
      "wasm:js-string": jsStringPolyfill,
    });

    return new InstantiatedApp(this, dartInstance);
  }
}

class InstantiatedApp {
  constructor(compiledApp, instantiatedModule) {
    this.compiledApp = compiledApp;
    this.instantiatedModule = instantiatedModule;
  }

  // Call the main function with the given arguments.
  invokeMain(...args) {
    this.instantiatedModule.exports.$invokeMain(args);
  }
}

