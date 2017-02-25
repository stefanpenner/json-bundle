console.time('directoryToBundle');
require('.').directoryToBundle(__dirname + '/prebuilt/addon', 'addon.prebuilt');
console.timeEnd('directoryToBundle');

// ls(__dirname + '/prebuilt/addon');
console.time('bundleToDirectory');
bundleToDirectory('addon.prebuilt', 'asdf')
require('.').bundleToDirectory('addon.prebuilt', 'asdf');
console.timeEnd('bundleToDirectory');

// class FromPrebuilt extends Plugin {
//   constructor(trees) {
//     super(tress, { persistentOutput: true });
//     this._didBuild = false;
//   };

//   build() {
//     if (this._didBuild) { return; }

//     bundleToDirectory(this.input, this.outputPath);
//     this._didBuild = true;
//   }
// }
