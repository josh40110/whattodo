import { Button } from '@chakra-ui/react'
import styled from '@emotion/styled'

const StyledAboutButton = styled(Button)`
  /* 字體設置 */
  font-family: 'Press Start 2P', monospace;  // 使用像素風格字體
  color: white;                              // 文字顏色
  font-size: 1rem;                          // 字體大小
  text-shadow:                              // 文字陰影效果，創造像素風格
    4px 4px 0 #000,
    -1px -1px 0 #000,
    1px -1px 0 #000,
    -1px 1px 0 #000,
    1px 1px 0 #000;
  letter-spacing: 2px;                      // 字間距

  /* 動畫效果 */
  animation: float 3s ease-in-out infinite;  // 持續浮動動畫

  /* 按鈕基本樣式 */
  padding: 10px 20px;                       // 內邊距
  background: rgba(0, 0, 0, 0.5);           // 半透明黑色背景
  border: 4px solid white;                  // 白色邊框
  box-shadow:                               // 像素風格陰影
    8px 8px 0 #000,
    -2px -2px 0 #fff,
    2px -2px 0 #fff,
    -2px 2px 0 #fff,
    2px 2px 0 #fff;
  
  /* 偽元素：創建像素風格邊框效果 */
  &::before {
    content: '';
    position: absolute;
    background: linear-gradient(45deg, transparent 48%, #fff 49%, #fff 51%, transparent 52%);
    background-size: 8px 8px;
    z-index: -1;
  }
  
  /* 浮動動畫定義 */
  @keyframes float {
    0% {
      transform: translateY(0px) rotate(-1deg);
    }
    50% {
      transform: translateY(-10px) rotate(1deg);
    }
    100% {
      transform: translateY(0px) rotate(-1deg);
    }
  }
  
  /* 故障效果動畫定義 */
  @keyframes glitch {
    0% {
      transform: translate(0);
    }
    20% {
      transform: translate(-2px, 2px);
    }
    40% {
      transform: translate(-2px, -2px);
    }
    60% {
      transform: translate(2px, 2px);
    }
    80% {
      transform: translate(2px, -2px);
    }
    100% {
      transform: translate(0);
    }
  }
  
  /* 滑鼠懸停效果 */
  &:hover {
    animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) both;
  }
`

interface AboutButtonProps {
  children: React.ReactNode;                 // 按鈕內容
  onClick?: () => void;                     // 點擊事件處理函數
  position?: 'absolute' | 'relative' | 'fixed' | 'sticky';  // 定位方式
  top?: string | number;                    // 上邊距
  left?: string | number;                   // 左邊距
  right?: string | number;                  // 右邊距
  bottom?: string | number;                 // 下邊距
  margin?: string | number;                 // 外邊距
  marginTop?: string | number;              // 上外邊距
  marginLeft?: string | number;             // 左外邊距
  marginRight?: string | number;            // 右外邊距
  marginBottom?: string | number;           // 下外邊距
  [key: string]: any;                       // 其他屬性
}

const AboutButton = ({ 
  children,                                // 按鈕內容
  onClick,                                // 點擊事件
  position,                               // 定位方式
  top,                                    // 上邊距
  left,                                   // 左邊距
  right,                                  // 右邊距
  bottom,                                 // 下邊距
  margin,                                 // 外邊距
  marginTop,                              // 上外邊距
  marginLeft,                             // 左外邊距
  marginRight,                            // 右外邊距
  marginBottom,                           // 下外邊距
  ...props                                // 其他屬性
}: AboutButtonProps) => {
  return (
    <StyledAboutButton
      colorScheme="blue"                  // 按鈕顏色方案
      variant="outline"                   // 按鈕變體
      size="md"                           // 按鈕大小
      onClick={onClick}                   // 點擊事件
      position={position}                 // 定位方式
      top={top}                           // 上邊距
      left={left}                         // 左邊距
      right={right}                       // 右邊距
      bottom={bottom}                     // 下邊距
      margin={margin}                     // 外邊距
      marginTop={marginTop}               // 上外邊距
      marginLeft={marginLeft}             // 左外邊距
      marginRight={marginRight}           // 右外邊距
      marginBottom={marginBottom}         // 下外邊距
      {...props}                          // 其他屬性
    >
      {children}                         
    </StyledAboutButton>
  )
}

export default AboutButton 