/**
 * 入口启动文件
 */
import './style.css'
import '../lib/spidergl.js'
import '../lib/spidergl-config.js'
import NVMC from '../lib/nvmc.js'
import '../lib/nvmc-config.js'
import NVMCClient from './client.js'

const handler        = new NVMCClient()
const drawCanvasID   = 'nvmc-canvas'
const serverURL      = 'ws://146.48.84.222:80'
const animationRate  = 60.0
const simulationRate = 60.0
const defaultRace    = NVMC.DefaultRace

NVMC.setupGame({
  handler : handler,
  canvas  : drawCanvasID,
  race    : defaultRace,
  url     : serverURL,
  fps     : animationRate,
  ups     : simulationRate,
  onLoad  : function () {
    setInterval(function () {
      const game = handler.game
      if (!game) return
      document.getElementById("nvmc-fps"               ).innerHTML = "FPS : "                + Math.floor(handler.ui.framesPerSecond)
      document.getElementById("nvmc-latency"           ).innerHTML = "Latency : "            + Math.floor(game.latency) + " ms."
      document.getElementById("nvmc-server-clock-delta").innerHTML = "Server Clock Delta : " + Math.floor(game.serverTicksDelta) + " ms."
      document.getElementById("nvmc-server-time"       ).innerHTML = "Server Time : "        + game.serverTime;
    }, 1000)
  }
})