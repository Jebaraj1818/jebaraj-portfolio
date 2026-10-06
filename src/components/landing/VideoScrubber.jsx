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

    const notifyReady = () => {
      video.pause()
      if (onReady) {
        onReady({ duration: video.duration, video })
      }
    }

    if (video.readyState >= 1 && isFinite(video.duration) && video.duration > 0) {
      notifyReady()
    } else {
      video.addEventListener('loadedmetadata', notifyReady, { once: true })
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
