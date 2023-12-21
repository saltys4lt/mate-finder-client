import React from 'react'
import Container from './Container'
import styled from 'styled-components'


const FooterContainer=styled.div`

width: 100%;
padding: 50px 0;
display: flex;
justify-content: space-between;
`
const Contacts=styled.div`

`

const ContactsItem=styled.a`
  display: flex;
  column-gap: 10px;
  align-items: center;
  text-decoration: none;
  margin-left: 10px;
  margin-top: 10px;
`

const ContactsLink=styled.span`
text-decoration: none;
font-size: 16px;
color: #444;
&:hover{
    color: #979797;
  }
`

const ContactsTitle=styled.h3`
color: #979797;
  margin-bottom: 30px;
`

const ContactsIcon=styled.img`
width: 20px;
`

const Logo=styled.img`
  height: 120px;
  border-radius: 5px;
`

const Footer = () => {
  return (
    <footer>
      <Container>
      <FooterContainer>
        
        <Contacts>
        <ContactsTitle>Contact Us</ContactsTitle>

          <ContactsItem href='https://t.me/ahrisai' target='_blank'>
            <ContactsLink >@ahrisai</ContactsLink>
            <ContactsIcon src='/images/telegram.png'/>
          </ContactsItem>

          <ContactsItem  href='https://github.com/ahrisai' target='_blank'> 
            <ContactsLink>ahrisai</ContactsLink>
            <ContactsIcon src='/images/github.png'/>
          </ContactsItem>

           <ContactsItem href='https://www.linkedin.com/in/ilia-shpak-8b1524298/' target='_blank'>
            <ContactsLink>Ilia Shpak</ContactsLink>
            <ContactsIcon src='/images/linkedin.png'/>
          </ContactsItem>
        </Contacts>
        <Logo src='/images/footer-logo.jpg'/>
      </FooterContainer>
      </Container>
    </footer>
  )
}

export default Footer