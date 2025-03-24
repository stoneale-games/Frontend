import React from 'react'
import { useTheme } from '../contexts/ThemeContext';


function Logo() {
      const { isDarkMode } = useTheme();
  return (
    <div>
           {isDarkMode ? (
          <img src={"/dark-logo.png"} height={200} width={200} />
        ) : (
          <img src={"/light-logo.png"} height={200} width={200}/>
        )}
    </div>
  )
}

export default Logo
