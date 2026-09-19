(function() {
  var base = new URL("./", document.currentScript.src);

  Promise.all([
    fetch(new URL("animations.part.aa", base)).then(r => r.arrayBuffer()),
    fetch(new URL("animations.part.ab", base)).then(r => r.arrayBuffer())
  ]).then(function(parts) {
    var combined = new Uint8Array(parts[0].byteLength + parts[1].byteLength);

    combined.set(new Uint8Array(parts[0]), 0);
    combined.set(new Uint8Array(parts[1]), parts[0].byteLength);

    var blob = new Blob([combined], {
      type: "application/javascript"
    });

    var script = document.createElement("script");
    script.src = URL.createObjectURL(blob);

    script.onload = function() {
      URL.revokeObjectURL(script.src);
      window.meleeAnimationsLoaded = true;
    };

    document.head.appendChild(script);
  }).catch(function(error) {
    console.error("[ANIMATIONS] Failed to load:", error);
  });
})();
