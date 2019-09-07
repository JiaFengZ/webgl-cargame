import NVMC from '../lib/nvmc.js'
export default class baseClient {
  constructor () {
    this.ground = {}
  }
  onTerminate () {}
  onConnectionOpen () {
    NVMC.log('[Connection Open]')
  }
  onConnectionClosed () {
    NVMC.log('[Connection Closed]')
  }
  onConnectionError () {
    NVMC.log('[Connection Error] :' + errData)
  }
  onLogIn () {
    NVMC.log('[Logged In]')
  }
  onLogOut () {
    NVMC.log('[Logged Out]')
  }
  onNewRace (race) {
    NVMC.log('[New Race]')
  }

  onKeyPress (keyCode, event) {}

  onMouseButtonDown (button, x, y, event) {}

  onMouseButtonUp (button, x, y, event) {}

  onMouseMove (x, y, event) {}

  onMouseWheel (delta, x, y, event) {}

  onClick (button, x, y, event) {}

  onDoubleClick (button, x, y, event) {}

  onDragStart (button, x, y) {}

  onDragEnd (button, x, y) {}

  onDrag (button, x, y) {}

  onResize (width, height, event) {}

  onAnimate (dt) {
    this.ui.postDrawEvent()
  }
}