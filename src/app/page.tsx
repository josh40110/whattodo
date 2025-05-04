'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
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
import AboutButton from '@/components/AboutButton'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import VideoPlayer from '@/components/VideoPlayer'
import { useRouter } from 'next/navigation'

// 使用動態導入優化影片組件
const VideoPlayerComponent = dynamic(() => import('@/components/VideoPlayer'), {
  ssr: false,
  loading: () => (
    <Box 
      width="100%" 
      height="70vh"
      backgroundColor="#000000"
    />
  )
})

export default function Home() {
  const router = useRouter()

  // 狀態管理
  const [isSpinning, setIsSpinning] = useState(false)
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [showWheel, setShowWheel] = useState(false)
  const leftWheelRef = useRef<any>(null)
  const [history, setHistory] = useState<Array<{left: string, right: string, time: string}>>([])
  const [clickCount, setClickCount] = useState(0)
  const [currentScale, setCurrentScale] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showFrogBackground, setShowFrogBackground] = useState(false)
  const [showTuna, setShowTuna] = useState(false)
  const [frogStyle, setFrogStyle] = useState({
    opacity: 0,
    transform: 'translateX(100%) rotate(0deg)'
  })
  const [tunaStyle, setTunaStyle] = useState({
    opacity: 0,
    transform: 'translate(0, 0)'
  })
  const [stickerClickCount, setStickerClickCount] = useState(0)
  const [showMerit, setShowMerit] = useState(false)
  const [meritStyle, setMeritStyle] = useState({
    opacity: 0,
    transform: 'translateY(0)'
  })
  const [showShovel, setShowShovel] = useState(false)

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
      {/* 按鈕區域 */}
      <Box 
        position="relative" 
        top={25} 
        left={-50} 
        width="1600px" 
        zIndex={2}
        display="flex"
        justifyContent="start"
        paddingX={16}
        gap={16}
      >
        <AboutButton paddingX={12} paddingY={6} onClick={() => router.push('/')}>
          Home
        </AboutButton>
        <AboutButton paddingX={12} paddingY={6}>
          About me
        </AboutButton>
        <AboutButton paddingX={12} paddingY={6} onClick={() => router.push('/whattodo')}>
          What to do
        </AboutButton>
        <AboutButton paddingX={12} paddingY={6}>
          Memory Gallery
        </AboutButton>
        <AboutButton paddingX={12} paddingY={6}>
          Stock Tracker
        </AboutButton>
      </Box>

      {/* 影片放在按鈕下方 */}
      <Box 
        position="relative" 
        left={0} 
        top={55} 
        width="2250px" 
        height="80vh"
        zIndex={1}
        display="flex"
        alignItems="center"
      >
        <Box width="100%" height="100%">
          <Suspense fallback={
            <Box 
              width="100%" 
              height="100%"
              backgroundColor="#000000"
            />
          }>
            <VideoPlayerComponent />
          </Suspense>
        </Box>
        <Box 
          width="200px" 
          height="100%"
          display="flex"
          alignItems="flex-end"
          justifyContent="flex-end"
          marginLeft="100px"
          position="relative"
        >
          <img
            src="/sticker.png"
            alt="sticker"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              cursor: "pointer",
              transition: "transform 0.3s ease"
            }}
            onClick={() => {
              console.log("Sticker clicked, showing tuna");
              setStickerClickCount(prev => prev + 1);
              setShowTuna(true);
              setTunaStyle({
                opacity: 1,
                transform: 'translate(0, 0)'
              });
              
              setTimeout(() => {
                console.log("Starting tuna animation");
                setTunaStyle({
                  opacity: 1,
                  transform: 'translate(250px, -30px) rotate(360deg)'
                });
                
                setTimeout(() => {
                  console.log("Fading out tuna");
                  setTunaStyle({
                    opacity: 0,
                    transform: 'translate(250px, -30px) rotate(360deg)'
                  });
                  setTimeout(() => {
                    console.log("Hiding tuna and showing merit");
                    setShowTuna(false);
                    setShowMerit(true);
                    setMeritStyle({
                      opacity: 1,
                      transform: 'translateY(-50px)'
                    });
                    
                    // 1秒後淡出功德文字
                    setTimeout(() => {
                      setMeritStyle({
                        opacity: 0,
                        transform: 'translateY(-100px)'
                      });
                      setTimeout(() => {
                        setShowMerit(false);
                      }, 500);
                    }, 1000);
                    
                    // 檢查是否需要觸發佛光效果
                    if (stickerClickCount + 1 >= 5 && !isAnimating) {
                      console.log("Triggering bun animation");
                      setIsAnimating(true);
                      setShowFrogBackground(true);
                      setFrogStyle({
                        opacity: 1,
                        transform: 'translateX(0) rotate(0deg)'
                      });
                      
                      const bunImage = document.querySelector('img[alt="bun"]') as HTMLImageElement;
                      if (bunImage) {
                        bunImage.style.animation = "bunFloat 5s ease-in-out";
                        
                        // 5秒後重置所有效果
                        setTimeout(() => {
                          console.log("Resetting bun animation");
                          bunImage.style.animation = "";
                          setIsAnimating(false);
                          setStickerClickCount(0);
                          setCurrentScale(1); // 重置 bun.png 的大小
                          setFrogStyle({
                            opacity: 0,
                            transform: 'translateX(0) rotate(0deg)'
                          });
                          setTimeout(() => {
                            setShowFrogBackground(false);
                          }, 300);
                        }, 5000);
                      }
                    } else {
                      // 如果不需要觸發佛光效果，只增加點擊計數
                      const bunImage = document.querySelector('img[alt="bun"]') as HTMLImageElement;
                      if (bunImage) {
                        setClickCount(prev => prev + 1);
                        setCurrentScale(prev => prev + 0.1);
                      }
                    }
                  }, 1000);
                }, 1000);
              }, 100);
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          />
        </Box>
        <Box 
          width="200px" 
          height="100%"
          display="flex"
          alignItems="flex-end"
          justifyContent="flex-end"
          marginLeft="150px"
        >
          <img
            src="/bun.png"
            alt="bun"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              position: "relative",
              cursor: "url(/mooyu.png), auto",
              transition: "transform 0.3s ease",
              transform: `scale(${currentScale})`,
              zIndex: 2
            }}
            onClick={() => {
              const bunImage = document.querySelector('img[alt="bun"]') as HTMLImageElement;
              if (bunImage) {
                setClickCount(prev => prev + 1);
                setCurrentScale(prev => prev + 0.1);
                
                if (clickCount + 1 >= 5 && !isAnimating) {
                  setIsAnimating(true);
                  setShowFrogBackground(true);
                  setFrogStyle({
                    opacity: 1,
                    transform: 'translateX(0) rotate(0deg)'
                  });
                  bunImage.style.animation = "bunFloat 5s ease-in-out";
                  
                  // 在佛光動畫快結束時（4秒後）丟出tuna
                  setTimeout(() => {
                    setShowTuna(true);
                    setTunaStyle({
                      opacity: 1,
                      transform: 'translate(-500px, -100px) rotate(360deg)'
                    });
                    
                    // 1秒後讓bun恢復正常大小
                    setTimeout(() => {
                      setCurrentScale(1);
                      setTunaStyle({
                        opacity: 0,
                        transform: 'translate(-500px, -100px) rotate(360deg)'
                      });
                      setTimeout(() => {
                        setShowTuna(false);
                      }, 1000);
                    }, 1000);
                  }, 4000);
                  
                  setTimeout(() => {
                    bunImage.style.animation = "";
                    setIsAnimating(false);
                    setClickCount(0);
                    setFrogStyle({
                      opacity: 0,
                      transform: 'translateX(0) rotate(0deg)'
                    });
                    setTimeout(() => {
                      setShowFrogBackground(false);
                    }, 5000);
                  }, 5000);
                }
              }
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = `scale(${currentScale * 1.1})`;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = `scale(${currentScale})`;
            }}
          />
          <style jsx global>{`
            @keyframes bunFloat {
              0% {
                transform: translateY(0px) scale(${currentScale});
                filter: drop-shadow(0 0 0 rgba(255, 255, 0, 0)) 
                        drop-shadow(0 0 0 rgba(255, 215, 0, 0))
                        drop-shadow(0 0 0 rgba(255, 165, 0, 0));
              }
              10% {
                transform: translateY(-150px) scale(${currentScale});
                filter: drop-shadow(0 0 0 rgba(255, 255, 0, 0)) 
                        drop-shadow(0 0 0 rgba(255, 215, 0, 0))
                        drop-shadow(0 0 0 rgba(255, 165, 0, 0));
              }
              20% {
                transform: translate(0px, -150px) scale(${currentScale});
                filter: drop-shadow(0 0 0 rgba(255, 255, 0, 0)) 
                        drop-shadow(0 0 0 rgba(255, 215, 0, 0))
                        drop-shadow(0 0 0 rgba(255, 165, 0, 0));
              }
              30% {
                transform: translate(0px, -150px) scale(${currentScale});
                filter: drop-shadow(0 0 0 rgba(255, 255, 0, 0)) 
                        drop-shadow(0 0 0 rgba(255, 215, 0, 0))
                        drop-shadow(0 0 0 rgba(255, 165, 0, 0));
              }
              31% {
                transform: translate(5px, -150px) scale(${currentScale});
                filter: drop-shadow(0 0 0 rgba(255, 255, 0, 0)) 
                        drop-shadow(0 0 0 rgba(255, 215, 0, 0))
                        drop-shadow(0 0 0 rgba(255, 165, 0, 0));
              }
              32% {
                transform: translate(-5px, -150px) scale(${currentScale});
                filter: drop-shadow(0 0 0 rgba(255, 255, 0, 0)) 
                        drop-shadow(0 0 0 rgba(255, 215, 0, 0))
                        drop-shadow(0 0 0 rgba(255, 165, 0, 0));
              }
              33% {
                transform: translate(10px, -150px) scale(${currentScale});
                filter: drop-shadow(0 0 0 rgba(255, 255, 0, 0)) 
                        drop-shadow(0 0 0 rgba(255, 215, 0, 0))
                        drop-shadow(0 0 0 rgba(255, 165, 0, 0));
              }
              34% {
                transform: translate(-10px, -150px) scale(${currentScale});
                filter: drop-shadow(0 0 0 rgba(255, 255, 0, 0)) 
                        drop-shadow(0 0 0 rgba(255, 215, 0, 0))
                        drop-shadow(0 0 0 rgba(255, 165, 0, 0));
              }
              35% {
                transform: translate(15px, -150px) scale(${currentScale});
                filter: drop-shadow(0 0 0 rgba(255, 255, 0, 0)) 
                        drop-shadow(0 0 0 rgba(255, 215, 0, 0))
                        drop-shadow(0 0 0 rgba(255, 165, 0, 0));
              }
              36% {
                transform: translate(-15px, -150px) scale(${currentScale});
                filter: drop-shadow(0 0 0 rgba(255, 255, 0, 0)) 
                        drop-shadow(0 0 0 rgba(255, 215, 0, 0))
                        drop-shadow(0 0 0 rgba(255, 165, 0, 0));
              }
              37% {
                transform: translate(20px, -150px) scale(${currentScale});
                filter: drop-shadow(0 0 0 rgba(255, 255, 0, 0)) 
                        drop-shadow(0 0 0 rgba(255, 215, 0, 0))
                        drop-shadow(0 0 0 rgba(255, 165, 0, 0));
              }
              38% {
                transform: translate(-20px, -150px) scale(${currentScale});
                filter: drop-shadow(0 0 0 rgba(255, 255, 0, 0)) 
                        drop-shadow(0 0 0 rgba(255, 215, 0, 0))
                        drop-shadow(0 0 0 rgba(255, 165, 0, 0));
              }
              39% {
                transform: translate(25px, -150px) scale(${currentScale});
                filter: drop-shadow(0 0 0 rgba(255, 255, 0, 0)) 
                        drop-shadow(0 0 0 rgba(255, 215, 0, 0))
                        drop-shadow(0 0 0 rgba(255, 165, 0, 0));
              }
              40% {
                transform: translate(-25px, -150px) scale(${currentScale});
                filter: drop-shadow(0 0 0 rgba(255, 255, 0, 0)) 
                        drop-shadow(0 0 0 rgba(255, 215, 0, 0))
                        drop-shadow(0 0 0 rgba(255, 165, 0, 0));
              }
              40.1% {
                transform: translate(50px, -150px) scale(${currentScale});
                filter: drop-shadow(0 0 0 rgba(255, 255, 0, 0)) 
                        drop-shadow(0 0 0 rgba(255, 215, 0, 0))
                        drop-shadow(0 0 0 rgba(255, 165, 0, 0));
              }
              40.2% {
                transform: translate(-50px, -150px) scale(${currentScale});
                filter: drop-shadow(0 0 0 rgba(255, 255, 0, 0)) 
                        drop-shadow(0 0 0 rgba(255, 215, 0, 0))
                        drop-shadow(0 0 0 rgba(255, 165, 0, 0));
              }
              40.3% {
                transform: translate(100px, -150px) scale(${currentScale});
                filter: drop-shadow(0 0 0 rgba(255, 255, 0, 0)) 
                        drop-shadow(0 0 0 rgba(255, 215, 0, 0))
                        drop-shadow(0 0 0 rgba(255, 165, 0, 0));
              }
              40.4% {
                transform: translate(-100px, -150px) scale(${currentScale});
                filter: drop-shadow(0 0 0 rgba(255, 255, 0, 0)) 
                        drop-shadow(0 0 0 rgba(255, 215, 0, 0))
                        drop-shadow(0 0 0 rgba(255, 165, 0, 0));
              }
              40.5% {
                transform: translate(100px, -150px) scale(${currentScale});
                filter: drop-shadow(0 0 0 rgba(255, 255, 0, 0)) 
                        drop-shadow(0 0 0 rgba(255, 215, 0, 0))
                        drop-shadow(0 0 0 rgba(255, 165, 0, 0));
              }
              40.6% {
                transform: translate(-100px, -150px) scale(${currentScale});
                filter: drop-shadow(0 0 0 rgba(255, 255, 0, 0)) 
                        drop-shadow(0 0 0 rgba(255, 215, 0, 0))
                        drop-shadow(0 0 0 rgba(255, 165, 0, 0));
              }
              40.7% {
                transform: translate(100px, -150px) scale(${currentScale});
                filter: drop-shadow(0 0 0 rgba(255, 255, 0, 0)) 
                        drop-shadow(0 0 0 rgba(255, 215, 0, 0))
                        drop-shadow(0 0 0 rgba(255, 165, 0, 0));
              }
              40.8% {
                transform: translate(-100px, -150px) scale(${currentScale});
                filter: drop-shadow(0 0 0 rgba(255, 255, 0, 0)) 
                        drop-shadow(0 0 0 rgba(255, 215, 0, 0))
                        drop-shadow(0 0 0 rgba(255, 165, 0, 0));
              }
              40.9% {
                transform: translate(100px, -150px) scale(${currentScale});
                filter: drop-shadow(0 0 0 rgba(255, 255, 0, 0)) 
                        drop-shadow(0 0 0 rgba(255, 215, 0, 0))
                        drop-shadow(0 0 0 rgba(255, 165, 0, 0));
              }
              50% {
                transform: translate(-100px, -150px) scale(${currentScale});
                filter: drop-shadow(0 0 50px rgba(255, 255, 0, 0.8))
                        drop-shadow(0 0 100px rgba(255, 215, 0, 0.6))
                        drop-shadow(0 0 200px rgba(255, 165, 0, 0.4))
                        drop-shadow(0 0 300px rgba(255, 255, 0, 0.2))
                        brightness(1.5)
                        contrast(1.2);
              }
              60% {
                transform: translate(30px, -150px) scale(${currentScale});
                filter: drop-shadow(0 0 60px rgba(255, 255, 0, 0.8))
                        drop-shadow(0 0 120px rgba(255, 215, 0, 0.6))
                        drop-shadow(0 0 240px rgba(255, 165, 0, 0.4))
                        drop-shadow(0 0 360px rgba(255, 255, 0, 0.2))
                        brightness(1.6)
                        contrast(1.3);
              }
              70% {
                transform: translate(-30px, -150px) scale(${currentScale});
                filter: drop-shadow(0 0 70px rgba(255, 255, 0, 0.8))
                        drop-shadow(0 0 140px rgba(255, 215, 0, 0.6))
                        drop-shadow(0 0 280px rgba(255, 165, 0, 0.4))
                        drop-shadow(0 0 420px rgba(255, 255, 0, 0.2))
                        brightness(1.7)
                        contrast(1.4);
              }
              80% {
                transform: translate(40px, -150px) scale(${currentScale});
                filter: drop-shadow(0 0 80px rgba(255, 255, 0, 0.8))
                        drop-shadow(0 0 160px rgba(255, 215, 0, 0.6))
                        drop-shadow(0 0 320px rgba(255, 165, 0, 0.4))
                        drop-shadow(0 0 480px rgba(255, 255, 0, 0.2))
                        brightness(1.8)
                        contrast(1.5);
              }
              90% {
                transform: translate(-40px, -150px) scale(${currentScale});
                filter: drop-shadow(0 0 90px rgba(255, 255, 0, 0.8))
                        drop-shadow(0 0 180px rgba(255, 215, 0, 0.6))
                        drop-shadow(0 0 360px rgba(255, 165, 0, 0.4))
                        drop-shadow(0 0 540px rgba(255, 255, 0, 0.2))
                        brightness(1.9)
                        contrast(1.6);
              }
              100% {
                transform: translate(0px, -150px) scale(${currentScale});
                filter: drop-shadow(0 0 0 rgba(255, 255, 0, 0)) 
                        drop-shadow(0 0 0 rgba(255, 215, 0, 0))
                        drop-shadow(0 0 0 rgba(255, 165, 0, 0));
              }
            }
          `}</style>
        </Box>
        <Box
          position="absolute"
          left="1870px"
          top="44%"
          zIndex={3}
          width="200px"
          height="100%"
          display="flex"
          alignItems="flex-end"
          justifyContent="flex-end"
          cursor="pointer"
          onClick={() => {
            console.log("Frog clicked, showing shovel");
            setShowShovel(true);
          }}
        >
          <img
            src="/frog.png"
            alt="frog background"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              opacity: 1,
              transform: 'translateX(0) rotate(0deg) scaleX(-1)',
              transition: 'transform 3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in-out',
              willChange: 'transform, opacity'
            }}
          />
        </Box>
        {showShovel && (
          <Box
            position="absolute"
            left="1870px"
            top="44%"
            zIndex={4}
            width="200px"
            height="100%"
            display="flex"
            alignItems="flex-end"
            justifyContent="flex-end"
          >
            <img
              src="/shovel.png"
              alt="shovel"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                opacity: 1,
                transform: 'translateX(0) rotate(0deg) scaleX(-1)',
                transition: 'transform 3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in-out',
                willChange: 'transform, opacity'
              }}
            />
          </Box>
        )}
        {showTuna && (
          <div
            style={{
              position: 'absolute',
              left: '1850px',
              top: '86%',
              zIndex: 99,
              width: '100px',
              height: '100px'
            }}
          >
            <img
              src="/tuna.png"
              alt="tuna"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                opacity: tunaStyle.opacity,
                transform: tunaStyle.transform,
                transition: 'all 1s ease-in-out',
                position: 'absolute'
              }}
            />
          </div>
        )}
      </Box>
      {/* 功德+1 文字 */}
      {showMerit && (
        <div
          style={{
            position: 'absolute',
            left: '1850px',
            top: '86%',
            zIndex: 99,
            color: '#FFD700',
            fontSize: '24px',
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(255, 215, 0, 0.8)',
            opacity: meritStyle.opacity,
            transform: `${meritStyle.transform} translateY(-100%)`,
            transition: 'all 0.5s ease-in-out'
          }}
        >
          功德+1
        </div>
      )}
    </Box>
  )
} 