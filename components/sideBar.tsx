import NextImage from 'next/image'
import NextLink from 'next/link'
import {
    Box,
    List,
    ListItem,
    ListIcon,
    Divider,
    Center,
    LinkBox,
    LinkOverlay
} from '@chakra-ui/layout'
import {
    MdHome,
    MdSearch,
    MdLibraryMusic,
    MdPlaylistAdd,
    MdFavorite
} from 'react-icons/md'
import { usePlaylist } from '../lib/hooks'
import playlist from '../pages/api/playlist'

const NAV_MENU = [
    { icon: MdHome, route: '/', name: 'Home' },
    { icon: MdSearch, route: '/search', name: 'Search' },
    { icon: MdLibraryMusic, route: '/library', name: 'Your Library' }
]

const MUSIC_MENU = [
    { icon: MdPlaylistAdd, route: '/', name: 'Create Playlist' },
    { icon: MdFavorite, route: '/favorites', name: 'Favorites' }
]

const Sidebar = () => {
    const { playlists } = usePlaylist()

    if (!playlists?.length) {
        return (
            <Box
                width="100%"
                height="calc(100vh - 100px)"
                bg="black"
                paddingX="5px"
                color="grey">
                Loading...
            </Box>
        )
    }

    return (
        <Box
            width="100%"
            height="calc(100vh - 100px)"
            bg="black"
            paddingX="5px"
            color="grey">
            <Box paddingY="20px" height="100%">
                <Box width="120px" marginBottom="20px" paddingX="20px">
                    <NextImage src="/logo.svg" height={60} width={120} />
                </Box>
                <Box>
                    <List spacing={2}>
                        {NAV_MENU.map(({ icon, route, name }) => (
                            <ListItem
                                paddingX="20px"
                                fontSize="16px"
                                key={name}>
                                <LinkBox>
                                    <NextLink href={route} passHref>
                                        <LinkOverlay>
                                            <ListIcon
                                                as={icon}
                                                color="white"
                                                marginRight="20px"
                                            />
                                            {name}
                                        </LinkOverlay>
                                    </NextLink>
                                </LinkBox>
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Divider marginY="20px" color="gray.800" />
                <Box>
                    <List spacing={2}>
                        {MUSIC_MENU.map(({ name, icon, route }) => (
                            <ListItem
                                paddingX="20px"
                                fontSize="16px"
                                key={name}>
                                <LinkBox>
                                    <NextLink href={route} passHref>
                                        <LinkOverlay>
                                            <ListIcon
                                                as={icon}
                                                color="white"
                                                marginRight="20px"
                                            />
                                            {name}
                                        </LinkOverlay>
                                    </NextLink>
                                </LinkBox>
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Divider marginY="20px" color="gray.800" />
                <Box height="66%" overflowY="auto" paddingY="20px">
                    <List spacing={2}>
                        {playlists.map(item => (
                            <ListItem paddingX="20px" key={item.id}>
                                <LinkBox>
                                    <NextLink
                                        href={{
                                            pathname: '/playlist/[id]',
                                            query: { id: item.id }
                                        }}>
                                        <LinkOverlay>{item.name}</LinkOverlay>
                                    </NextLink>
                                </LinkBox>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Box>
        </Box>
    )
}

export default Sidebar
