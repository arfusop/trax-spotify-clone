import { Box } from '@chakra-ui/layout'
import { Table, Thead, Td, Tr, Tbody, IconButton, Th } from '@chakra-ui/react'
import { BsFillPlayFill } from 'react-icons/bs'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { formatDate, formatTime } from '../lib/formatters'
import { useStoreActions } from 'easy-peasy'

const SongTable = ({ songs }) => {
    const playSongs = useStoreActions((store: any) => store.changeActiveSongs)
    const setActiveSong = useStoreActions(
        (store: any) => store.changeActiveSong
    )

    const onPlayClick = (activeSong?) => {
        setActiveSong(activeSong || songs[0])
        playSongs(songs)
    }

    return (
        <Box bg="transparent" color="white">
            <Box padding="10px" marginBottom="40px">
                <Box marginBottom="30px">
                    <IconButton
                        icon={<BsFillPlayFill fontSize="30px" />}
                        isRound
                        colorScheme="green"
                        size="lg"
                        aria-label="play"
                        onClick={() => onPlayClick()}
                    />
                </Box>
                <Table variant="unstyled">
                    <Thead
                        borderBottom="1px solid"
                        borderColor="rgba(255,255,255,0.2)">
                        <Tr>
                            <Th>#</Th>
                            <Th>Title</Th>
                            <Th>Date Added</Th>
                            <Th>
                                <AiOutlineClockCircle />
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {songs.map((song, i) => (
                            <Tr
                                sx={{
                                    transition: 'all .3s',
                                    '&:hover': {
                                        bg: 'rgba(255,255,255,0.1)'
                                    }
                                }}
                                onDoubleClick={() => onPlayClick(song)}
                                key={song.id}
                                cursor="pointer">
                                <Td>{i + 1}</Td>
                                <Td>{song.name}</Td>
                                <Td>{formatDate(song.createdAt)}</Td>
                                <Td>{formatTime(song.duration)}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        </Box>
    )
}

export default SongTable
