import { useState } from 'react'
import { Box, Flex, Input, Button } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useSWRConfig } from 'swr'
import NextImage from 'next/image'

import { auth } from '../lib/mutations'

interface AuthTypes {
    mode: 'register' | 'login'
}

const AuthForm = ({ mode }: AuthTypes) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    const onSubmit = async e => {
        e.preventDefault()
        setLoading(true)

        const user = await auth(mode, { email, password })
        console.log(user)
        setLoading(false)
        router.push('/')
    }

    return (
        <Box height="100vh" width="100vw" bg="black" color="white">
            <Flex
                justify="center"
                align="center"
                height="100px"
                borderBottom="white 1px solid">
                <NextImage src="/logo.svg" height={60} width={120} />
            </Flex>
            <Flex justify="center" align="center" height="calc(100vh - 100px)">
                <Box padding="50px" bg="gray.900" borderRadius="6px">
                    <form onSubmit={onSubmit}>
                        <Input
                            placeholder="Email"
                            type="email"
                            onChange={e => setEmail(e.target.value)}
                        />
                        <Input
                            placeholder="Password"
                            type="password"
                            onChange={e => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            bg="green.500"
                            isLoading={loading}
                            sx={{ '&:hover': { bg: 'green.300' } }}>
                            {mode}
                        </Button>
                    </form>
                </Box>
            </Flex>
        </Box>
    )
}

export default AuthForm
