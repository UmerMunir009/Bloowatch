import insta1 from '../assets/images/instagram-1.png';
import insta2 from '../assets/images/instagram-1.png';
import insta3 from '../assets/images/instagram-3.png';
import insta4 from '../assets/images/instagram-4.png';
import insta5 from '../assets/images/instagram-5.png';

export default function Footer() {
    const instagramImages = [insta1, insta2, insta3, insta4, insta5];

    return (
        <footer className="w-full bg-footer-bg text-white pt-16 pb-12 px-12 mt-auto">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-xs leading-relaxed text-gray-400">

                <div>
                    <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-sm">About</h4>
                    <p>
                        Bloowatch is specialized software for watersports schools (surfing, kitesurfing, sailing, and diving) and outdoor activity providers (skiing, climbing).
                    </p>
                </div>

                <div>
                    <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-sm">Contact</h4>
                    <p className="mb-2">156-677-124-442-2887</p>
                    <p className="mb-2">wave@bloowatch.com</p>
                    <p>Spain</p>
                </div>

                <div>
                    <h4 className="text-white font-bold uppercase tracking-wider mb-4 text-sm">Useful Links</h4>
                    <ul className="space-y-2">
                        <li><a href="#about" className="hover:text-white transition-colors">About us</a></li>
                        <li><a href="#history" className="hover:text-white transition-colors">History</a></li>
                        <li><a href="#contact" className="hover:text-white transition-colors">Contact us</a></li>
                    </ul>
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                    {instagramImages.map((imgSrc, index) => (
                        <a
                            key={index}
                            href="https://instagram.com"
                            target="_blank"
                            className="aspect-square bg-gray-800 rounded-sm overflow-hidden border border-gray-700 block hover:opacity-80 transition-opacity"
                        >
                            <img
                                src={imgSrc}
                                alt={`Instagram thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </a>
                    ))}
                </div>

            </div>
        </footer>
    );
}