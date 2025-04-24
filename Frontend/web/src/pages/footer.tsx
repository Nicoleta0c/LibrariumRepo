
import { Book, Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Link } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from--800 to-teal-600 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <Book className="h-8 w-8 mr-2" />
              <span className="text-2xl font-bold">Librarium</span>
            </div>
            <p className="text-sm text-teal-100 mb-4">
              Tu portal digital para descubrir, explorar y disfrutar de los mejores libros en cualquier momento y lugar.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 border-b border-teal-400 pb-2">Enlaces Rápidos</h3>
            <ul className="space-y-2">
            <li className="text-teal-100 hover:text-white hover:underline transition">
                Catalogo
              </li>
              <li className="text-teal-100 hover:text-white hover:underline transition">
                Autores
              </li>
            </ul>
          </div>

          {/* Categorías */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 border-b border-teal-400 pb-2">Categorías</h3>
            <ul className="space-y-2">
            <li className="text-teal-100 hover:text-white hover:underline transition">
                Comedia
              </li>
              <li className="text-teal-100 hover:text-white hover:underline transition">
                Ficcion
              </li>
              <li className="text-teal-100 hover:text-white hover:underline transition">
                Ciencia
              </li>
              <li className="text-teal-100 hover:text-white hover:underline transition">
                  Historia
              </li>
              <li className="text-teal-100 hover:text-white hover:underline transition">
                Poesia
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 border-b border-teal-400 pb-2">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-teal-300" />
                <span className="text-teal-100">tester@librarium.com</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-teal-300" />
                <span className="text-teal-100">+809 888 8888</span>
              </li>
              <li className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-teal-300" />
                <span className="text-teal-100">AgoraVirtual, Santo Domingo</span>
              </li>
            </ul>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-teal-100 hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-teal-100 hover:text-white">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-teal-100 hover:text-white">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Suscripción al boletín */}
        <div className="mt-8 pt-6 border-t border-teal-500">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h4 className="text-lg font-medium mb-2 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-teal-300" /> Suscríbete a nuestro boletín
              </h4>
              <p className="text-sm text-teal-100">Recibe recomendaciones personalizadas y noticias literarias.</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="px-4 py-2 rounded-l-md focus:outline-none text-gray-800 w-full md:w-64"
              />
              <button className="bg-teal-500 hover:bg-teal-400 px-4 py-2 rounded-r-md transition">Suscribirse</button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-teal-500 text-center text-sm text-teal-200">
          <p>© {new Date().getFullYear()} Librarium. Todos los derechos reservados.</p>
          <div className="mt-2 flex justify-center space-x-4">
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
