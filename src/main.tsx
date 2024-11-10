import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Root } from './root';

createRoot(document.getElementById('root')! as HTMLElement).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
