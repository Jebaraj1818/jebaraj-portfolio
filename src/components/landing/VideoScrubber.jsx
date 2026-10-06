import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'

/**
 * VideoScrubber
 *
 * Renders the locked hero video with strict muted / playsInline settings
 * and notifies parent when metadata is loaded so ScrollTrigger can scrub frames accurately.
 */
export const VideoScrubber = forwardRef(function VideoScrubber(
  { src, fallbackSrc, onReady, onSeeked, onSeeking, onError, className = '' },
  ref
) {
  const videoRef = useRef(null)

  useImperativeHandle(ref, () => videoRef.current, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.pause()
    video.muted = true
    video.defaultMuted = true

    // Ensure physical DOM attributes for iOS Safari inline playback policy
    if (!video.hasAttribute('muted')) video.setAttribute('muted', '')
    if (!video.hasAttribute('playsinline')) video.setAttribute('playsinline', '')
    if (!video.hasAttribute('webkit-playsinline')) video.setAttribute('webkit-playsinline', '')

    const notifyReady = () => {
      video.pause()
      // Prime the initial video frame for iOS Safari if still at 0
      if (video.currentTime === 0) {
        try {
          video.currentTime = 0.001
        } catch (e) {}
      }
      if (onReady) {
        onReady({ duration: video.duration, video })
      }
    }

    if (video.readyState >= 1 && isFinite(video.duration) && video.duration > 0) {
      notifyReady()
    } else {
      video.addEventListener('loadedmetadata', notifyReady, { once: true })
      // Ensure explicit load trigger if the browser has not started buffering
      if (video.readyState === 0) {
        try {
          video.load()
        } catch (e) {}
      }
    }

    // Prevent any independent playback attempts
    const onPlay = () => {
      video.pause()
    }
    video.addEventListener('play', onPlay)

    return () => {
      video.removeEventListener('loadedmetadata', notifyReady)
      video.removeEventListener('play', onPlay)
    }
  }, [src, onReady])

  return (
    <video
      ref={videoRef}
      className={`video-scrubber ${className}`}
      src={src}
      preload="auto"
      muted
      playsInline
      tabIndex={-1}
      aria-hidden="true"
      disablePictureInPicture
      disableRemotePlayback
      onSeeked={onSeeked}
      onSeeking={onSeeking}
      onError={onError}
    >
      {fallbackSrc && <source src={fallbackSrc} />}
    </video>
  )
})
