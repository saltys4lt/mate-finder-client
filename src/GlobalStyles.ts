import { createGlobalStyle } from 'styled-components';
 
const GlobalStyle = createGlobalStyle`

@font-face {
    font-family:'montserrat' ;
    src: url('/fonts/Montserrat-Regular.ttf');
    font-weight: 400;
}

@font-face {
    font-family:'montserrat' ;
    src: url('/fonts/Montserrat-Bold.ttf');
    font-weight: 700;
}

@font-face {
    font-family:'montserrat' ;
    src: url('/fonts/Montserrat-Light.ttf');
    font-weight: 300;
}

*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  list-style: none;
}

body{
  background-color: #242424;
    font-family: 'montserrat';
}


`;
 
export default GlobalStyle;