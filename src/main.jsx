import { createRoot } from 'react-dom/client';

import App from './App.jsx';
import './index.css';

/** `<StrictMode>`는 개발 빌드에서 이중 마운트를 일으켜 인트로 MP4를 두 번 요청할 수 있음 */
createRoot(document.getElementById('root')).render(<App />);
