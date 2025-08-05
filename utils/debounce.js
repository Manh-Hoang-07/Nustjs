/**
 * Enhanced debounce function with better performance and options
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {Object} options - Additional options
 * @param {boolean} options.immediate - If true, trigger the function on the leading edge
 * @param {boolean} options.trailing - If true, trigger the function on the trailing edge
 * @param {number} options.maxWait - Maximum time to wait before forcing execution
 * @returns {Function} - The debounced function
 */
export function debounce(func, wait, options = {}) {
  const { immediate = false, trailing = true, maxWait } = options
  let timeout
  let lastCallTime
  let lastInvokeTime = 0
  let result

  function invokeFunc(time) {
    const args = arguments
    const thisArg = this

    lastInvokeTime = time
    result = func.apply(thisArg, args)
    return result
  }

  function startTimer(pendingFunc, wait) {
    return setTimeout(pendingFunc, wait)
  }

  function cancelTimer(id) {
    clearTimeout(id)
  }

  function leadingEdge(time) {
    lastInvokeTime = time
    timeout = startTimer(timerExpired, wait)
    return immediate ? invokeFunc(time) : result
  }

  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime
    const timeWaiting = wait - timeSinceLastCall

    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting
  }

  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime

    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
            (timeSinceLastCall < 0) || (maxWait !== undefined && timeSinceLastInvoke >= maxWait))
  }

  function timerExpired() {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }
    timeout = startTimer(timerExpired, remainingWait(time))
  }

  function trailingEdge(time) {
    timeout = undefined

    if (trailing && lastCallTime !== undefined) {
      return invokeFunc(time)
    }
    return result
  }

  function cancel() {
    if (timeout !== undefined) {
      cancelTimer(timeout)
    }
    lastInvokeTime = 0
    lastCallTime = undefined
    timeout = undefined
  }

  function flush() {
    return timeout === undefined ? result : trailingEdge(Date.now())
  }

  function pending() {
    return timeout !== undefined
  }

  function debounced(...args) {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastCallTime = time

    if (isInvoking) {
      if (timeout === undefined) {
        return leadingEdge(lastCallTime)
      }
      if (maxWait !== undefined) {
        timeout = startTimer(timerExpired, wait)
        return invokeFunc(lastCallTime)
      }
    }
    if (timeout === undefined) {
      timeout = startTimer(timerExpired, wait)
    }
    return result
  }

  debounced.cancel = cancel
  debounced.flush = flush
  debounced.pending = pending

  return debounced
}

/**
 * Throttle function to limit execution rate
 * @param {Function} func - The function to throttle
 * @param {number} wait - The number of milliseconds to throttle
 * @param {Object} options - Additional options
 * @returns {Function} - The throttled function
 */
export function throttle(func, wait, options = {}) {
  const { leading = true, trailing = true } = options
  return debounce(func, wait, { leading, trailing, maxWait: wait })
} 