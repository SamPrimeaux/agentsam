import React from 'react';
import { createRoot } from 'react-dom/client';
import { MobileApp } from './app/MobileApp';
import './styles/mobile.css';

createRoot(document.getElementById('root')!).render(<React.StrictMode><MobileApp /></React.StrictMode>);
