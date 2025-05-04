import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { ThemeProvider, Global } from '@emotion/react'
import styled from '@emotion/styled'
import { useState, useRef, useCallback } from 'react'
import Wheel from './components/Wheel'
import { theme } from './styles/theme'

const globalStyles = {
  'html, body': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },
  'body': {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    minHeight: '100vh',
  },
} as const

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  padding: 2rem;
`

const TopBar = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1rem 0 1rem;
  background: white;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 1200px;
  justify-content: flex-start;
  margin-bottom: 0;
  border-bottom: none;
  margin-left: 0;
`

const Tab = styled(Link)`
  padding: 0.6rem 1.2rem;
  border-radius: 8px 8px 0 0;
  background: ${props => props.className?.includes('active') ? '#007AFF' : '#f5f7fa'};
  color: ${props => props.className?.includes('active') ? 'white' : '#333'};
  transition: all 0.3s ease;
  font-weight: 500;
  border: 1px solid #eee;
  border-bottom: ${props => props.className?.includes('active') ? 'none' : '1px solid #eee'};
  margin-bottom: -1px;
  position: relative;
  top: 1px;

  &:hover {
    background: ${props => props.className?.includes('active') ? '#007AFF' : '#e9ecef'};
  }
`

const ContentContainer = styled.div`
  background: white;
  border-radius: 0 0 12px 12px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1200px;
  overflow-x: hidden;
  margin-top: 0;
  border-top: 1px solid #eee;
`

const WheelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 35px;
  position: relative;
  padding-right: 340px;
`

const WheelsRow = styled.div`
  display: flex;
  gap: 2rem;
  width: 100%;
  flex-wrap: nowrap;
  margin-bottom: 1rem;
  margin-top: 35px;
  margin-left: 35px;
  
  @media (max-width: 800px) {
    flex-direction: column;
    align-items: center;
    gap: 3rem;
  }
`

const SpinButton = styled.button`
  padding: 1.2rem 3rem;
  background: linear-gradient(135deg, #FF5722, #FF9800);
  color: white;
  border-radius: 50px;
  font-size: 1.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  margin: 2rem auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  display: block;
  width: fit-content;
  margin-top: 35px;
  margin-left: 65px;

  &:hover {
    background: linear-gradient(135deg, #FF9800, #FF5722);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

const HistoryContainer = styled.div`
  width: 300px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 35px;

  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: absolute;
  right: 20px;
  top: 0;
  max-height: 800px;
  overflow-y: auto;

  h3 {
    margin-bottom: 1rem;
    color: #333;
    font-size: 1.5rem;
    text-align: center;
    border-bottom: 1px solid #ddd;
    padding-bottom: 0.5rem;
  }
`

const HistoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  border-bottom: 1px solid #eee;
  margin-bottom: 0.5rem;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`

const ResultText = styled.span`
  color: #333;
  font-weight: 500;
`

const TimeText = styled.span`
  color: #999;
  font-size: 0.8rem;
`

const ArrowIcon = styled.span`
  color: #FF9800;
  font-size: 1.2rem;
  margin: 0 0.5rem;
`

const App = () => {
  const [isSpinning, setIsSpinning] = useState(false)
  const leftWheelRef = useRef<any>(null)
  const rightWheelRef = useRef<any>(null)
  const [history, setHistory] = useState<Array<{left: string, right: string, time: string}>>([])

  const handleSpin = useCallback(() => {
    if (isSpinning) return
    
    setIsSpinning(true)
    
    try {
      leftWheelRef.current?.spinWheel()
      rightWheelRef.current?.spinWheel()
      
      setTimeout(() => {
        const leftResult = leftWheelRef.current?.getSelectedLabel() || '未知'
        const rightResult = rightWheelRef.current?.getSelectedLabel() || '未知'
        
        const now = new Date()
        const hours = now.getHours().toString().padStart(2, '0')
        const mins = now.getMinutes().toString().padStart(2, '0')
        const timeString = `${hours}:${mins}`
        
        setHistory(prev => {
          const newHistory = [{
            left: leftResult,
            right: rightResult,
            time: timeString
          }, ...prev]
          
          if (newHistory.length > 10) {
            return newHistory.slice(0, 10)
          }
          return newHistory
        })
        
        setIsSpinning(false)
      }, 3100)
    } catch (error) {
      console.error('Error during spin:', error)
      setIsSpinning(false)
    }
  }, [isSpinning])

  const renderHistory = useCallback(() => {
    if (history.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '1rem', color: '#999' }}>
          尚無記錄
        </div>
      )
    }
    
    return history.map((record, index) => (
      <HistoryItem key={index}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ResultText>{record.left}</ResultText>
          <ArrowIcon>→</ArrowIcon>
          <ResultText>{record.right}</ResultText>
        </div>
        <TimeText>{record.time}</TimeText>
      </HistoryItem>
    ))
  }, [history])

  return (
    <ThemeProvider theme={theme}>
      <Global styles={globalStyles} />
      <Router>
        <AppContainer>
          <TopBar>
            <Tab to="/entertainment" className={window.location.pathname === '/entertainment' ? 'active' : ''}>娛樂</Tab>
            <Tab to="/goal" className={window.location.pathname === '/goal' ? 'active' : ''}>目標</Tab>
          </TopBar>
          <ContentContainer>
            <Routes>
              <Route path="/" element={<Navigate to="/entertainment" replace />} />
              <Route path="/entertainment" element={
                <WheelContainer>
                  <WheelsRow>
                    <Wheel
                      ref={leftWheelRef}
                      segments={5}
                      colors={[
                        '#E50914', '#1DB954', '#FFD700', '#007AFF', '#FF6B6B', '#9C27B0', '#FF9800', '#795548',
                        '#00BCD4', '#8BC34A', '#FF5722', '#3F51B5', '#009688', '#E91E63', '#FFC107', '#607D8B',
                        '#673AB7', '#4CAF50', '#FF9800', '#2196F3', '#F44336'
                      ]}
                      labels={[
                        '看Netflix', '畫畫',  '看電影', '躺一個晚上', '打魔物'
                      ]}
                      hideControls={true}
                    />
                  </WheelsRow>
                  <SpinButton onClick={handleSpin} disabled={isSpinning}>
                    {isSpinning ? '旋轉中...' : '旋轉輪盤'}
                  </SpinButton>
                  <HistoryContainer>
                    <h3>歷史紀錄</h3>
                    {renderHistory()}
                  </HistoryContainer>
                </WheelContainer>
              } />
              <Route path="/goal" element={
                <WheelContainer>
                  <WheelsRow>
                    <Wheel
                      ref={leftWheelRef}
                      segments={21}
                      colors={[
                        '#E50914', '#1DB954', '#FFD700', '#007AFF', '#FF6B6B', '#9C27B0', '#FF9800', '#795548',
                        '#00BCD4', '#8BC34A', '#FF5722', '#3F51B5', '#009688', '#E91E63', '#FFC107', '#607D8B',
                        '#673AB7', '#4CAF50', '#FF9800', '#2196F3', '#F44336'
                      ]}
                      labels={[
                        '看Netflix', '看書', '畫畫', '寫程式', '運動', '自傳', '整理環境(斷捨離)', '看電影',
                        '煮飯', '寫詩', '躺一個晚上', '公園散步(with mom)', '拍自然照', '拍街頭照', '練英文', '看openmic',
                        '看一場音樂劇', '看劇場表演', '考機車駕照', '練開車(找朋朋)', '寫一封給未來自己的信'
                      ]}
                      hideControls={true}
                    />
                  </WheelsRow>
                  <SpinButton onClick={handleSpin} disabled={isSpinning}>
                    {isSpinning ? '旋轉中...' : '旋轉輪盤'}
                  </SpinButton>
                  <HistoryContainer>
                    <h3>歷史紀錄</h3>
                    {renderHistory()}
                  </HistoryContainer>
                </WheelContainer>
              } />
              <Route path="*" element={<Navigate to="/entertainment" replace />} />
            </Routes>
          </ContentContainer>
        </AppContainer>
      </Router>
    </ThemeProvider>
  )
}

export default App
