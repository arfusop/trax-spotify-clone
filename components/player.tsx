import {
    ButtonGroup,
    Box,
    IconButton,
    RangeSlider,
    RangeSliderFilledTrack,
    RangeSliderTrack,
    RangeSliderThumb,
    Center,
    Flex,
    Text
} from '@chakra-ui/react'
import ReactHowler from 'react-howler'
import { useEffect, useRef, useState } from 'react'
import {
    MdShuffle,
    MdSkipPrevious,
    MdSkipNext,
    MdOutlinePlayCircleFilled,
    MdOutlinePauseCircleFilled,
    MdOutlineRepeat
} from 'react-icons/md'
import { useStoreActions } from 'easy-peasy'
import { formatTime } from '../lib/formatters'

const Player = ({ songs, activeSong }) => {
    const soundRef = useRef(null)

    const [playing, setPlaying] = useState(true)
    const [index, setIndex] = useState(
        songs.findIndex(s => s.id === activeSong.id)
    )
    const [seek, setSeek] = useState(0)
    const [isSeeking, setIsSeeking] = useState(false)
    const [repeat, setRepeat] = useState(false)
    const [shuffle, setShuffle] = useState(false)
    const [duration, setDuration] = useState(0)
    const repeatRef = useRef(repeat)

    const changeActiveSong = useStoreActions(
        (state: any) => state.changeActiveSong
    )

    useEffect(() => {
        let timerId

        if (playing && !isSeeking) {
            const f = () => {
                setSeek(soundRef.current.seek())
                timerId = requestAnimationFrame(f)
            }

            timerId = requestAnimationFrame(f)

            return () => cancelAnimationFrame(timerId)
        }

        cancelAnimationFrame(timerId)
    }, [playing, isSeeking])

    useEffect(() => {
        changeActiveSong(songs[index])
    }, [index, changeActiveSong, songs])

    useEffect(() => {
        repeatRef.current = repeat
    }, [repeat])

    const onPlayStateToggle = value => setPlaying(value)
    const onShuffle = () => setShuffle(state => !state)
    const onRepeat = () => setRepeat(state => !state)
    const onPrevSong = () => {
        setIndex(state => (state ? state - 1 : songs.length - 1))
    }
    const onNextSong = () => {
        setIndex(state => {
            if (shuffle) {
                const next = Math.floor(Math.random() * songs.length)
                if (next === state) {
                    return onNextSong()
                }
                return next
            } else {
                return state === songs.length - 1 ? 0 : state + 1
            }
        })
    }

    const onSongEnd = () => {
        if (repeatRef.current) {
            setSeek(0)
            soundRef.current.seek(0)
        } else {
            onNextSong()
        }
    }

    const onLoad = () => {
        const songDuration = soundRef.current.duration()
        setDuration(songDuration)
    }

    const onSeek = e => {
        setSeek(parseFloat(e[0]))
        soundRef.current.seek(e[0])
    }

    return (
        <Box>
            <Box>
                <ReactHowler
                    playing={playing}
                    src={activeSong?.url}
                    ref={soundRef}
                    onLoad={onLoad}
                    onEnd={onSongEnd}
                    volume={0.25}
                />
            </Box>
            <Center color="gray.600">
                <ButtonGroup>
                    <IconButton
                        outline="none"
                        variant="link"
                        aria-label="shuffle"
                        fontSize="24px"
                        color={shuffle ? 'white' : ''}
                        icon={<MdShuffle />}
                        onClick={onShuffle}
                    />
                    <IconButton
                        outline="none"
                        variant="link"
                        aria-label="skipPrev"
                        fontSize="24px"
                        icon={<MdSkipPrevious />}
                        onClick={onPrevSong}
                    />
                    {playing ? (
                        <IconButton
                            outline="none"
                            variant="link"
                            aria-label="pause"
                            fontSize="40px"
                            color="white"
                            icon={<MdOutlinePauseCircleFilled />}
                            onClick={() => onPlayStateToggle(false)}
                        />
                    ) : (
                        <IconButton
                            outline="none"
                            variant="link"
                            aria-label="play"
                            fontSize="40px"
                            color="white"
                            icon={<MdOutlinePlayCircleFilled />}
                            onClick={() => onPlayStateToggle(true)}
                        />
                    )}
                    <IconButton
                        outline="none"
                        variant="link"
                        aria-label="skipNext"
                        fontSize="24px"
                        onClick={onNextSong}
                        icon={<MdSkipNext />}
                    />
                    <IconButton
                        outline="none"
                        variant="link"
                        aria-label="repeat"
                        fontSize="24px"
                        color={repeat ? 'white' : ''}
                        onClick={onRepeat}
                        icon={<MdOutlineRepeat />}
                    />
                </ButtonGroup>
            </Center>
            <Box color="gray.600">
                <Flex justify="center" align="center">
                    <Box width="10%">
                        <Text fontSize="xs">{formatTime(seek)}</Text>
                    </Box>
                    <Box width="80%">
                        <RangeSlider
                            aria-label={['min', 'max']}
                            step={0.1}
                            min={0}
                            max={duration ? parseInt(duration.toFixed(2)) : 0}
                            onChange={onSeek}
                            onChangeStart={() => setIsSeeking(true)}
                            onChangeEnd={() => setIsSeeking(false)}
                            value={[seek]}
                            id="player-range">
                            <RangeSliderTrack bg="gray.800">
                                <RangeSliderFilledTrack bg="gray.600"></RangeSliderFilledTrack>
                                <RangeSliderThumb index={0} />
                            </RangeSliderTrack>
                        </RangeSlider>
                    </Box>
                    <Box width="10%">
                        <Text fontSize="xs" textAlign="right">
                            {formatTime(duration)}
                        </Text>
                    </Box>
                </Flex>
            </Box>
        </Box>
    )
}

export default Player
