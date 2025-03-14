export function countdown (s) {
  const d = Math.floor(s / (3600 * 24))
  s -= d * 3600 * 24
  const h = Math.floor(s / 3600)
  s -= h * 3600
  const m = Math.floor(s / 60)
  s -= m * 60
  const tmp = []
  if (d) tmp.push(d + 'd')
  if (d || h) tmp.push(h + 'h')
  if (d || h || m) tmp.push(m + 'm')
  return tmp.join(' ')
}

const formatter = new Intl.RelativeTimeFormat('en')
const ranges = {
  years: 3600 * 24 * 365,
  months: 3600 * 24 * 30,
  weeks: 3600 * 24 * 7,
  days: 3600 * 24,
  hours: 3600,
  minutes: 60,
  seconds: 1
}

export function since (date) {
  const secondsElapsed = (date.getTime() - Date.now()) / 1000
  for (const key in ranges) {
    if (ranges[key] < Math.abs(secondsElapsed)) {
      const delta = secondsElapsed / ranges[key]
      // @ts-ignore
      return formatter.format(Math.round(delta), key)
    }
  }
}

const units = [' B', ' kB', ' MB', ' GB', ' TB']
export function fastPrettyBytes (num) {
  if (isNaN(num)) return '0 B'
  if (num < 1) return num + ' B'
  const exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1)
  return Number((num / Math.pow(1000, exponent)).toFixed(2)) + units[exponent]
}

/**
 * @type {DOMParser['parseFromString']}
 */
export const DOMPARSER = DOMParser.prototype.parseFromString.bind(new DOMParser())

export const sleep = t => new Promise(resolve => setTimeout(resolve, t))

export function toTS (sec, full) {
  if (isNaN(sec) || sec < 0) {
    switch (full) {
      case 1:
        return '0:00:00.00'
      case 2:
        return '0:00:00'
      case 3:
        return '00:00'
      default:
        return '0:00'
    }
  }
  const hours = Math.floor(sec / 3600)
  /**
   * @type {any}
   */
  let minutes = Math.floor(sec / 60) - hours * 60
  /**
   * @type {any}
   */
  let seconds = full === 1 ? (sec % 60).toFixed(2) : Math.floor(sec % 60)
  if (minutes < 10 && (hours > 0 || full)) minutes = '0' + minutes
  if (seconds < 10) seconds = '0' + seconds
  return (hours > 0 || full === 1 || full === 2) ? hours + ':' + minutes + ':' + seconds : minutes + ':' + seconds
}

export async function PromiseBatch (task, items, batchSize) {
  let position = 0
  let results = []
  while (position < items.length) {
    const itemsForBatch = items.slice(position, position + batchSize)
    results = [...results, ...await Promise.all(itemsForBatch.map(item => task(item)))]
    position += batchSize
  }
  return results
}

export function generateRandomHexCode (len) {
  let hexCode = ''

  while (hexCode.length < len) {
    hexCode += (Math.round(Math.random() * 15)).toString(16)
  }

  return hexCode
}

export function throttle (fn, time) {
  let wait = false
  return () => {
    if (!wait) {
      fn()
      wait = true
      setTimeout(() => {
        fn()
        wait = false
      }, time)
    }
  }
}

export function debounce (fn, time) {
  let timeout
  return (...args) => {
    const later = () => {
      timeout = null
      fn(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, time)
  }
}

export function binarySearch (arr, el) {
  let left = 0
  let right = arr.length - 1

  while (left <= right) {
    // Using bitwise or instead of Math.floor as it is slightly faster
    const mid = ((right + left) / 2) | 0
    if (arr[mid] === el) {
      return true
    } else if (el < arr[mid]) {
      right = mid - 1
    } else {
      left = mid + 1
    }
  }

  return false
}
