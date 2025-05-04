'use client'

import { useEffect, useRef, useState } from 'react'
import { Box, IconButton } from '@chakra-ui/react'
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa'

export default function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // 確保影片可以播放
    const handleCanPlay = () => {
      try {
        video.play()
      } catch (error) {
        console.error('Error playing video:', error)
      }
    }

    // 當影片播放到結束時，重新播放
    const handleEnded = () => {
      try {
        video.currentTime = 0
        video.play()
      } catch (error) {
        console.error('Error replaying video:', error)
      }
    }

    // 處理影片載入錯誤
    const handleError = (e: Event) => {
      console.error('Video error:', e)
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('error', handleError)

    // 確保影片從頭開始播放
    video.currentTime = 0

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('error', handleError)
    }
  }, [])

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }

  return (
    <Box
      position="relative"
      width="100%"
      height="100%"
      overflow="hidden"
      border="4px solid white"
    >
      <video
        ref={videoRef}
        width="100%"
        height="100%"
        autoPlay
        playsInline
        loop
        muted
        style={{
          objectFit: 'cover',
          imageRendering: 'pixelated'
        }}
      >
        <source src="/manga.mp4" type="video/mp4" />
        您的瀏覽器不支援影片播放
      </video>
      <IconButton
        aria-label={isMuted ? "開啟聲音" : "關閉聲音"}
        icon={isMuted ? <FaVolumeMute size="1.5em" /> : <FaVolumeUp size="1.5em" />}
        onClick={toggleMute}
        position="absolute"
        bottom="10px"
        right="10px"
        size="lg"
        width="60px"
        height="60px"
        backgroundColor="#1A1A1A"
        color="white"
        borderRadius="0"
        fontFamily="'Press Start 2P', monospace"
        fontSize="0.8em"
        textShadow="2px 2px 0 #000"
        boxShadow="4px 4px 0 #000, inset 2px 2px 0 rgba(255,255,255,0.2), inset -2px -2px 0 rgba(0,0,0,0.2)"
        border="2px solid white"
        transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
        _hover={{
          backgroundColor: "#2A2A2A",
          transform: 'translate(-2px, -2px)',
          boxShadow: '6px 6px 0 #000, inset 2px 2px 0 rgba(255,255,255,0.3), inset -2px -2px 0 rgba(0,0,0,0.1)',
          transition: 'all 0.1s steps(1)',
          '& svg': {
            transform: 'scale(1.2)',
            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            color: '#FFFFFF'
          }
        }}
        _active={{
          backgroundColor: "#0A0A0A",
          transform: 'translate(2px, 2px)',
          boxShadow: '2px 2px 0 #000, inset 2px 2px 0 rgba(0,0,0,0.2), inset -2px -2px 0 rgba(255,255,255,0.1)',
          '& svg': {
            transform: 'scale(0.9)',
            transition: 'transform 0.1s steps(1)',
            color: '#CCCCCC'
          }
        }}
        _before={{
          content: '""',
          position: 'absolute',
          top: '-4px',
          left: '-4px',
          right: '-4px',
          bottom: '-4px',
          background: 'linear-gradient(45deg, transparent 48%, white 49%, white 51%, transparent 52%)',
          backgroundSize: '4px 4px',
          zIndex: -1,
          opacity: 0.8
        }}
        _after={{
          content: '""',
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
          pointerEvents: 'none'
        }}
        sx={{
          '& svg': {
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: 'drop-shadow(1px 1px 0 #000)',
            color: 'white'
          }
        }}
      />
    </Box>
  )
} 