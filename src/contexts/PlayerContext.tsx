import { createContext, ReactNode, useContext, useState } from "react"

type Episode = {
  title: string
  members: string
  thumbnail: string
  duration: number
  url: string
}

type PlayerContextData = {
  currentEpisodeIndex: number
  episodeList: Episode[]
  isPlaying: boolean
  isLooping: boolean
  isShuffling: boolean
  hasPreviousEpisode: boolean
  hasNextEpisode: boolean
  playList: (list: Episode[], index: number) => void
  setPlayingState: (state: boolean) => void
  play: (episode: Episode) => void
  clearPlayerState: () => void
  toogleShuffle: () => void
  playPrevious: () => void
  tooglePlay: () => void
  toogleLoop: () => void
  playNext: () => void
}

type PlayerContextProviderProps = {
  children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider({
  children,
}: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  function play(episode: Episode) {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  function tooglePlay() {
    setIsPlaying(!isPlaying)
  }

  function toogleLoop() {
    setIsLooping(!isLooping)
  }

  function toogleShuffle() {
    setIsShuffling(!isShuffling)
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state)
  }

  function clearPlayerState() {
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }

  const hasPreviousEpisode = currentEpisodeIndex > 0
  const hasNextEpisode =
    isShuffling || currentEpisodeIndex + 1 < episodeList.length

  function playNext() {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(
        Math.random() * episodeList.length
      )
      setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    } else if (hasNextEpisode) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
  }

  function playPrevious() {
    if (hasPreviousEpisode) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        playList,
        playNext,
        playPrevious,
        isPlaying,
        isShuffling,
        isLooping,
        tooglePlay,
        setPlayingState,
        hasPreviousEpisode,
        hasNextEpisode,
        toogleLoop,
        toogleShuffle,
        clearPlayerState,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext)
}
