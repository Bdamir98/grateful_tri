'use client'

import { useState, useRef, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipBack, SkipForward } from 'lucide-react'

interface VideoPlayerProps {
  url: string
  onProgress?: (progress: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => void
  onEnded?: () => void
  startTime?: number
  title?: string
  isPreview?: boolean
  previewDuration?: number
}

export function VideoPlayer({ 
  url, 
  onProgress, 
  onEnded, 
  startTime = 0, 
  title,
  isPreview = false,
  previewDuration = 300 // 5 minutes default preview
}: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const [played, setPlayed] = useState(0)
  const [loaded, setLoaded] = useState(0)
  const [duration, setDuration] = useState(0)
  const [seeking, setSeeking] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  
  const playerRef = useRef<ReactPlayer>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (startTime > 0 && playerRef.current) {
      playerRef.current.seekTo(startTime, 'seconds')
    }
  }, [startTime])

  const handlePlayPause = () => {
    setPlaying(!playing)
  }

  const handleProgress = (progress: any) => {
    if (!seeking) {
      setPlayed(progress.played)
    }
    
    // Restrict preview duration
    if (isPreview && progress.playedSeconds >= previewDuration) {
      setPlaying(false)
      return
    }
    
    onProgress?.(progress)
  }

  const handleSeekMouseDown = () => {
    setSeeking(true)
  }

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPlayed = parseFloat(e.target.value)
    
    // Restrict seeking in preview mode
    if (isPreview && newPlayed * duration > previewDuration) {
      return
    }
    
    setPlayed(newPlayed)
  }

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false)
    const target = e.target as HTMLInputElement
    const newPlayed = parseFloat(target.value)
    playerRef.current?.seekTo(newPlayed)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value))
    setMuted(false)
  }

  const toggleMute = () => {
    setMuted(!muted)
  }

  const handleFullscreen = () => {
    const element = document.querySelector('.video-player-container')
    if (element) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        element.requestFullscreen()
      }
    }
  }

  const skip = (seconds: number) => {
    const currentTime = played * duration
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds))
    
    // Restrict skipping in preview mode
    if (isPreview && newTime > previewDuration) {
      return
    }
    
    playerRef.current?.seekTo(newTime, 'seconds')
  }

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000)
    const hh = date.getUTCHours()
    const mm = date.getUTCMinutes()
    const ss = date.getUTCSeconds().toString().padStart(2, '0')
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`
    }
    return `${mm}:${ss}`
  }

  const showControlsTemporarily = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (playing) {
        setShowControls(false)
      }
    }, 3000)
  }

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

  return (
    <div 
      className="video-player-container relative bg-black group"
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <ReactPlayer
        ref={playerRef}
        url={url}
        width="100%"
        height="100%"
        playing={playing}
        volume={muted ? 0 : volume}
        playbackRate={playbackRate}
        onProgress={handleProgress}
        onDuration={setDuration}
        onEnded={onEnded}
        onLoadedMetadata={() => setLoaded(1)}
        config={{
          youtube: {
            playerVars: {
              showinfo: 0,
              controls: 0,
              modestbranding: 1,
              rel: 0
            }
          }
        }}
      />

      {/* Preview Overlay */}
      {isPreview && played * duration >= previewDuration && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-center text-white p-8">
            <h3 className="text-2xl font-bold mb-4">Preview Ended</h3>
            <p className="text-lg mb-6">Enroll in this course to watch the full lesson</p>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Enroll Now
            </button>
          </div>
        </div>
      )}

      {/* Custom Controls */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min={0}
            max={1}
            step="any"
            value={played}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${played * 100}%, #4b5563 ${played * 100}%, #4b5563 100%)`
            }}
          />
          {isPreview && (
            <div 
              className="absolute h-1 bg-red-500 rounded-lg pointer-events-none"
              style={{
                left: '0',
                width: `${Math.min(100, (previewDuration / duration) * 100)}%`,
                top: '0'
              }}
            />
          )}
        </div>

        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-4">
            {/* Play/Pause */}
            <button
              onClick={handlePlayPause}
              className="hover:text-purple-400 transition-colors"
            >
              {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>

            {/* Skip buttons */}
            <button
              onClick={() => skip(-10)}
              className="hover:text-purple-400 transition-colors"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              onClick={() => skip(10)}
              className="hover:text-purple-400 transition-colors"
            >
              <SkipForward className="h-5 w-5" />
            </button>

            {/* Volume */}
            <div className="flex items-center space-x-2">
              <button onClick={toggleMute} className="hover:text-purple-400 transition-colors">
                {muted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Time */}
            <div className="text-sm">
              {formatTime(played * duration)} / {formatTime(duration)}
              {isPreview && (
                <span className="text-red-400 ml-2">
                  (Preview: {formatTime(previewDuration)})
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Settings */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="hover:text-purple-400 transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>
              
              {showSettings && (
                <div className="absolute bottom-8 right-0 bg-black/90 rounded-lg p-3 min-w-[120px]">
                  <div className="text-sm font-semibold mb-2">Playback Speed</div>
                  {playbackRates.map(rate => (
                    <button
                      key={rate}
                      onClick={() => {
                        setPlaybackRate(rate)
                        setShowSettings(false)
                      }}
                      className={`block w-full text-left px-2 py-1 rounded hover:bg-purple-600 transition-colors ${
                        playbackRate === rate ? 'bg-purple-600' : ''
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={handleFullscreen}
              className="hover:text-purple-400 transition-colors"
            >
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      {loaded < 1 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      )}
    </div>
  )
}