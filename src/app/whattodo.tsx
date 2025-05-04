'use client'

import { useState, useRef, useCallback } from 'react'
import { 
  ChakraProvider, 
  Container, 
  VStack, 
  HStack, 
  Button, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel, 
  Box, 
  Heading, 
  Text, 
  List, 
  ListItem,
  Grid,
  GridItem
} from '@chakra-ui/react'
import Wheel from '@/components/Wheel'

export default function WhatToDo() {
  // 狀態管理
  const [isSpinning, setIsSpinning] = useState(false)
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [showWheel, setShowWheel] = useState(false)
  const leftWheelRef = useRef<any>(null)
  const [history, setHistory] = useState<Array<{left: string, right: string, time: string}>>([])

  // 處理輪盤旋轉的函數
  const handleSpin = useCallback(() => {
    if (isSpinning) return
    
    setIsSpinning(true)
    
    try {
      leftWheelRef.current?.spinWheel()
      
      setTimeout(() => {
        const leftResult = leftWheelRef.current?.getSelectedLabel() || '未知'
        
        const now = new Date()
        const hours = now.getHours().toString().padStart(2, '0')
        const mins = now.getMinutes().toString().padStart(2, '0')
        const timeString = `${hours}:${mins}`
        
        setHistory(prev => {
          const newHistory = [{
            left: leftResult,
            right: '',
            time: timeString
          }, ...prev]
          
          return newHistory.slice(0, 10)
        })
        
        setIsSpinning(false)
      }, 3100)
    } catch (error) {
      console.error('Error during spin:', error)
      setIsSpinning(false)
    }
  }, [isSpinning])

  // 處理 What to do 按鈕點擊
  const handleWhatToDoClick = useCallback(() => {
    setShowWheel(true)
  }, [])

  // 渲染歷史記錄的函數
  const renderHistory = useCallback(() => {
    if (history.length === 0) {
      return (
        <Text color="gray.500" textAlign="center" py={4}>
          尚無記錄
        </Text>
      )
    }
    
    return (
      <List spacing={3}>
        {history.map((record, index) => (
          <ListItem key={index} p={3} bg="gray.50" borderRadius="md" display="flex" justifyContent="space-between" alignItems="center">
            <Text fontWeight="medium">{record.left}</Text>
            <Text fontSize="sm" color="gray.500">{record.time}</Text>
          </ListItem>
        ))}
      </List>
    )
  }, [history])

  // 輪盤選項配置
  const entertainmentOptions = {
    segments: 5,
    colors: ['#E50914', '#1DB954', '#FFD700', '#007AFF', '#FF6B6B'],
    labels: ['看Netflix', '畫畫', '看電影', '躺一個晚上', '打魔物']
  }

  const goalOptions = {
    segments: 4,
    colors: ['#34C759', '#FF9500', '#5AC8FA', '#5856D6'],
    labels: ['運動 30 分鐘', '學習新技術', '閱讀一章書', '規劃明天行程']
  }
  
  const currentOptions = activeTabIndex === 0 ? entertainmentOptions : goalOptions

  return (
    <Box position="relative" width="100%" minHeight="100vh">
      <Container 
        maxW="100%"           
        px={0}                
        py={8}
        minHeight="100vh"
        display="flex"
        flexDirection="column"
      >
        <Grid
          templateColumns="200px 1fr"
          gap={6}                      
          width="100%"
          flex="1"
        >
          {/* 左側導航區域 */}
          <GridItem>
            <VStack 
              align="flex-start"       
              spacing={4}              
              position="sticky"        
              top="20px"               
            >
              {/* 可以在這裡添加其他導航按鈕 */}
            </VStack>
          </GridItem>

          {/* 主要內容區域 */}
          <GridItem>
            <VStack spacing={4} align="center">
              {!showWheel ? (
                <Box>
                  {/* 空內容 */}
                </Box>
              ) : (
                <Tabs index={activeTabIndex} onChange={(index) => setActiveTabIndex(index)} variant="soft-rounded" colorScheme="blue">
                  <TabList>
                    <Tab fontSize="0.9em">娛樂</Tab>
                    <Tab fontSize="0.9em">目標</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <VStack spacing={6}>
                        <Heading 
                          as="h1" 
                          size="sm"
                          fontSize="0.75em"
                          lineHeight="1.2"
                          marginBottom="0.25em"
                        >
                          Away from earth
                        </Heading>
                        <Wheel
                          ref={leftWheelRef}
                          options={currentOptions}
                          onSpinComplete={handleSpin}
                        />
                        <Button
                          colorScheme="blue"
                          size="lg"
                          onClick={handleSpin}
                          isLoading={isSpinning}
                          loadingText="旋轉中..."
                        >
                          開始旋轉
                        </Button>
                      </VStack>
                    </TabPanel>
                    <TabPanel>
                      <VStack spacing={6}>
                        <Heading 
                          as="h1" 
                          size="sm"
                          fontSize="0.75em"
                          lineHeight="1.2"
                          marginBottom="0.25em"
                        >
                          Away from earth
                        </Heading>
                        <Wheel
                          ref={leftWheelRef}
                          options={currentOptions}
                          onSpinComplete={handleSpin}
                        />
                        <Button
                          colorScheme="blue"
                          size="lg"
                          onClick={handleSpin}
                          isLoading={isSpinning}
                          loadingText="旋轉中..."
                        >
                          開始旋轉
                        </Button>
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              )}
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  )
} 