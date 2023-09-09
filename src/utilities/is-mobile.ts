const REGEX_MOBILE =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

export function isMobile() {
  const userAgent = navigator.userAgent
  return REGEX_MOBILE.test(userAgent)
}
