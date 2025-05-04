'use client'

import { ChakraProvider, Box, Text } from '@chakra-ui/react'
import { Global, css } from '@emotion/react'
import styled from '@emotion/styled'

const Title = styled.h1`
  font-family: 'Press Start 2P', monospace;
  color: white;
  font-size: 2.5rem;
  text-align: center;
  margin: 20px 0;
  text-shadow: 
    4px 4px 0 #000,
    -1px -1px 0 #000,
    1px -1px 0 #000,
    -1px 1px 0 #000,
    1px 1px 0 #000;
  letter-spacing: 2px;
  animation: pixelFloat 3s ease-in-out infinite;
  position: relative;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.5);
  border: 4px solid white;
  box-shadow: 
    8px 8px 0 #000,
    -2px -2px 0 #fff,
    2px -2px 0 #fff,
    -2px 2px 0 #fff,
    2px 2px 0 #fff;
  
  @keyframes pixelFloat {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-8px);
    }
    100% {
      transform: translateY(0px);
    }
  }
  
  @keyframes pixelGlitch {
    0% {
      transform: translate(0);
      text-shadow: 
        4px 4px 0 #000,
        -1px -1px 0 #000,
        1px -1px 0 #000,
        -1px 1px 0 #000,
        1px 1px 0 #000;
    }
    25% {
      transform: translate(-2px, 2px);
      text-shadow: 
        6px 6px 0 #000,
        -2px -2px 0 #000,
        2px -2px 0 #000,
        -2px 2px 0 #000,
        2px 2px 0 #000;
    }
    50% {
      transform: translate(2px, -2px);
      text-shadow: 
        4px 4px 0 #000,
        -1px -1px 0 #000,
        1px -1px 0 #000,
        -1px 1px 0 #000,
        1px 1px 0 #000;
    }
    75% {
      transform: translate(-2px, -2px);
      text-shadow: 
        6px 6px 0 #000,
        -2px -2px 0 #000,
        2px -2px 0 #000,
        -2px 2px 0 #000,
        2px 2px 0 #000;
    }
    100% {
      transform: translate(0);
      text-shadow: 
        4px 4px 0 #000,
        -1px -1px 0 #000,
        1px -1px 0 #000,
        -1px 1px 0 #000,
        1px 1px 0 #000;
    }
  }
  
  &:hover {
    animation: pixelGlitch 0.3s steps(1) infinite;
    background: rgba(0, 0, 0, 0.7);
    box-shadow: 
      10px 10px 0 #000,
      -3px -3px 0 #fff,
      3px -3px 0 #fff,
      -3px 3px 0 #fff,
      3px 3px 0 #fff;
  }
`

const globalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Press Start 2P', monospace;
    background-color: #000000;
    image-rendering: pixelated;
  }

  button {
    font-family: 'Press Start 2P', monospace;
  }

  input, textarea {
    font-family: 'Press Start 2P', monospace;
  }
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ backgroundColor: '#000000' }}>
        <Global styles={globalStyles} />
        <ChakraProvider>
          <Box
            position="relative"
            zIndex={1}
            minHeight="100vh"
            backgroundColor="#000000"
            sx={{
              '& > div': {
                maxWidth: '800px',
                padding: '20px'
              }
            }}
          >
            <Title>BraBraBraz</Title>
            {children}
          </Box>
        </ChakraProvider>
      </body>
    </html>
  )
} 