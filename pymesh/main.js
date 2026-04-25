import { xlab } from "xlab";

// jshint unused:false
export function run(urls) {
  'use strict';
  var viewer = xlab.Viewer();
  viewer.load(urls);
  viewer.run();
}