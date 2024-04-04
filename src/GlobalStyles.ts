import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --main-text-color: #dedede;
    --main-red-color: #8f2121;
  }
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  list-style: none;

}

body{
  background-color:#1a1a1d;
    font-family: 'montserrat';
    padding: 0 !important;

  margin-right: calc(-1 * (100vw - 100%));

}

html{
  overflow-x: hidden;
}


`;

export default GlobalStyle;
