import AOS from 'aos';
import 'aos/dist/aos.css';

export default function initAOS() {
  if (typeof window !== 'undefined') {
    AOS.init({
      once: true,
      duration: 1000,
      offset: 80,
    });
  }
} 